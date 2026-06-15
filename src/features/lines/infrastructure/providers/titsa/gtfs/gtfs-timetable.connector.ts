import { parse } from 'csv-parse/sync'
import { strFromU8, unzipSync } from 'fflate'
import { z } from 'zod'
import type { TimetableStop, TimetableVariant } from '../../../db/schemas/line-timetable.schema'
import {
  gtfsCalendarDateSchema,
  gtfsPackageResponseSchema,
  gtfsRouteSchema,
  gtfsStopSchema,
  gtfsStopTimeSchema,
  gtfsTripSchema,
} from './gtfs-timetable.schema'

const packageUrl = 'https://datos.tenerife.es/ckan/api/action/package_show?id=36c2e26f-0d18-4b5a-b214-1636168e0765'

type GtfsTrip = z.infer<typeof gtfsTripSchema>
type GtfsStopTime = z.infer<typeof gtfsStopTimeSchema>
type GtfsStop = z.infer<typeof gtfsStopSchema>
type GtfsCalendarDate = z.infer<typeof gtfsCalendarDateSchema>
type GtfsRoute = z.infer<typeof gtfsRouteSchema>
type DayType = 'weekday' | 'saturday' | 'sunday_or_holiday'

export type GtfsTimetableContext = {
  routes: GtfsRoute[]
  trips: GtfsTrip[]
  stopTimesByTrip: Map<string, GtfsStopTime[]>
  stopsById: Map<string, GtfsStop>
  calendarDates: GtfsCalendarDate[]
  activeServicesByDate: Map<string, Set<string>>
}

async function getGtfsZipUrl() {
  const response = await fetch(packageUrl)

  if (!response.ok) {
    throw new Error(`Open Data GTFS package error: ${response.status}`)
  }

  const data = await response.json()
  const parsedData = gtfsPackageResponseSchema.parse(data)

  const resource = parsedData.result.resources.find(resource => {
    return resource.format?.toUpperCase() === 'ZIP' || resource.mimetype === 'application/zip'
  })

  if (!resource) {
    throw new Error('GTFS zip resource not found')
  }

  return resource.url
}

async function getGtfsZip() {
  const url = await getGtfsZipUrl()
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Open Data GTFS download error: ${response.status}`)
  }

  const buffer = await response.arrayBuffer()

  return unzipSync(new Uint8Array(buffer))
}

function readCsv<T>(zip: Record<string, Uint8Array>, fileName: string, schema: z.ZodType<T>) {
  const file = zip[fileName]

  if (!file) {
    throw new Error(`GTFS file not found: ${fileName}`)
  }

  const rows = parse(strFromU8(file), {
    bom: true,
    columns: true,
    skip_empty_lines: true,
    trim: true,
  })

  return z.array(schema).parse(rows)
}

function normalizeStopId(id: string) {
  return id.trim()
}

function getStopTimesByTrip(stopTimes: GtfsStopTime[]) {
  const stopTimesByTrip = new Map<string, GtfsStopTime[]>()

  for (const stopTime of stopTimes) {
    const currentStopTimes = stopTimesByTrip.get(stopTime.trip_id) ?? []
    currentStopTimes.push(stopTime)
    stopTimesByTrip.set(stopTime.trip_id, currentStopTimes)
  }

  return stopTimesByTrip
}

function getStopIndex(stopId: string, directionStops: TimetableStop[]) {
  return directionStops.findIndex(stop => {
    return normalizeStopId(stop.id) === normalizeStopId(stopId)
  })
}

function matchesDirection(firstStopId: string, lastStopId: string, directionStops: TimetableStop[]) {
  const firstStopIndex = getStopIndex(firstStopId, directionStops)
  const lastStopIndex = getStopIndex(lastStopId, directionStops)

  return firstStopIndex >= 0 && lastStopIndex >= 0 && firstStopIndex < lastStopIndex
}

function hasEnoughDirectionOverlap(stopTimes: GtfsStopTime[], directionStops: TimetableStop[]) {
  const stopIds = new Set(stopTimes.map(stopTime => normalizeStopId(stopTime.stop_id)))
  const matchingStops = directionStops.filter(stop => {
    return stopIds.has(normalizeStopId(stop.id))
  })

  return directionStops.length > 0 && matchingStops.length / directionStops.length >= 0.6
}

function matchesDirectionVariant(
  firstStopId: string,
  lastStopId: string,
  stopTimes: GtfsStopTime[],
  directionStops: TimetableStop[]
) {
  const firstStopIndex = getStopIndex(firstStopId, directionStops)
  const lastStopIndex = getStopIndex(lastStopId, directionStops)

  if (matchesDirection(firstStopId, lastStopId, directionStops)) {
    return true
  }

  if (!hasEnoughDirectionOverlap(stopTimes, directionStops)) {
    return false
  }

  return (firstStopIndex === -1 && lastStopIndex >= 0)
    || (firstStopIndex >= 0 && lastStopIndex === -1)
}

function getGtfsStop(stop: GtfsStop | undefined): TimetableStop {
  return {
    id: stop?.stop_id ?? '',
    name: stop?.stop_name ?? '',
  }
}

function formatApiDate(gtfsDate: string) {
  return `${gtfsDate.slice(0, 4)}-${gtfsDate.slice(4, 6)}-${gtfsDate.slice(6, 8)}`
}

function getDateDayType(gtfsDate: string) {
  const date = new Date(`${formatApiDate(gtfsDate)}T00:00:00Z`)
  const day = date.getUTCDay()

  if (day === 6) {
    return 'saturday'
  }

  if (day === 0) {
    return 'sunday_or_holiday'
  }

  return 'weekday'
}

function getMonthDates(
  calendarDates: GtfsCalendarDate[],
  month: string,
  dayType: DayType
) {
  const gtfsMonth = month.replace('-', '')
  const dates = new Set(
    calendarDates
      .filter(calendarDate => {
        return calendarDate.date.startsWith(gtfsMonth)
          && calendarDate.exception_type === '1'
          && getDateDayType(calendarDate.date) === dayType
      })
      .map(calendarDate => calendarDate.date)
  )

  return Array.from(dates).sort()
}

function getActiveServicesByDate(calendarDates: GtfsCalendarDate[]) {
  const activeServicesByDate = new Map<string, Set<string>>()

  for (const calendarDate of calendarDates) {
    if (calendarDate.exception_type !== '1') {
      continue
    }

    const activeServices = activeServicesByDate.get(calendarDate.date) ?? new Set<string>()
    activeServices.add(calendarDate.service_id)
    activeServicesByDate.set(calendarDate.date, activeServices)
  }

  return activeServicesByDate
}

function getVariantsForServices(
  routeId: string,
  activeServices: Set<string>,
  trips: GtfsTrip[],
  stopTimesByTrip: Map<string, GtfsStopTime[]>,
  stopsById: Map<string, GtfsStop>,
  directionStops: TimetableStop[]
) {
  const routeTrips = trips.filter(trip => {
    return trip.route_id === routeId && activeServices.has(trip.service_id)
  })

  const variants = new Map<string, TimetableVariant>()

  for (const trip of routeTrips) {
    const orderedStopTimes = (stopTimesByTrip.get(trip.trip_id) ?? []).sort((a, b) => {
      return Number(a.stop_sequence) - Number(b.stop_sequence)
    })

    const firstStopTime = orderedStopTimes[0]
    const lastStopTime = orderedStopTimes[orderedStopTimes.length - 1]

    if (!firstStopTime || !lastStopTime) {
      continue
    }

    if (!matchesDirectionVariant(firstStopTime.stop_id, lastStopTime.stop_id, orderedStopTimes, directionStops)) {
      continue
    }

    const origin = getGtfsStop(stopsById.get(firstStopTime.stop_id))
    const destination = getGtfsStop(stopsById.get(lastStopTime.stop_id))
    const key = `${origin.name}-${destination.name}`
    const currentVariant = variants.get(key) ?? {
      origin,
      destination,
      times: [],
    }

    currentVariant.times.push({
      departure: firstStopTime.departure_time,
      arrival: lastStopTime.arrival_time,
    })

    variants.set(key, currentVariant)
  }

  return Array.from(variants.values()).map(variant => {
    const timesByKey = new Map(
      variant.times.map(time => [`${time.departure}-${time.arrival}`, time])
    )

    return {
      ...variant,
      times: Array.from(timesByKey.values()).sort((a, b) => {
        return a.departure.localeCompare(b.departure)
      }),
    }
  })
}

export async function loadGtfsTimetableContext(): Promise<GtfsTimetableContext> {
  const zip = await getGtfsZip()

  const routes = readCsv(zip, 'routes.txt', gtfsRouteSchema)
  const trips = readCsv(zip, 'trips.txt', gtfsTripSchema)
  const stopTimes = readCsv(zip, 'stop_times.txt', gtfsStopTimeSchema)
  const stops = readCsv(zip, 'stops.txt', gtfsStopSchema)
  const calendarDates = readCsv(zip, 'calendar_dates.txt', gtfsCalendarDateSchema)

  return {
    routes,
    trips,
    stopTimesByTrip: getStopTimesByTrip(stopTimes),
    stopsById: new Map(stops.map(stop => [stop.stop_id, stop])),
    calendarDates,
    activeServicesByDate: getActiveServicesByDate(calendarDates),
  }
}

export function getLineTimetablePatternFromGtfsContext(
  context: GtfsTimetableContext,
  lineNumber: string,
  month: string,
  dayType: DayType,
  directionStops: TimetableStop[]
) {
  const route = context.routes.find(route => route.route_short_name === lineNumber)

  if (!route) {
    return {
      variants: [],
      source: {
        sampleDate: '',
        matchedDates: 0,
      },
    }
  }

  const monthDates = getMonthDates(context.calendarDates, month, dayType)
  const patterns = new Map<string, {
    variants: TimetableVariant[],
    sampleDate: string,
    matchedDates: number,
  }>()

  for (const date of monthDates) {
    const activeServices = context.activeServicesByDate.get(date) ?? new Set<string>()
    const variants = getVariantsForServices(
      route.route_id,
      activeServices,
      context.trips,
      context.stopTimesByTrip,
      context.stopsById,
      directionStops
    )
    const key = JSON.stringify(variants)
    const currentPattern = patterns.get(key) ?? {
      variants,
      sampleDate: formatApiDate(date),
      matchedDates: 0,
    }

    currentPattern.matchedDates += 1
    patterns.set(key, currentPattern)
  }

  const selectedPattern = Array.from(patterns.values()).sort((a, b) => {
    return b.matchedDates - a.matchedDates
  })[0]

  return {
    variants: selectedPattern?.variants ?? [],
    source: {
      sampleDate: selectedPattern?.sampleDate ?? '',
      matchedDates: selectedPattern?.matchedDates ?? 0,
    },
  }
}

export async function getLineTimetablePatternFromGtfs(
  lineNumber: string,
  month: string,
  dayType: DayType,
  directionStops: TimetableStop[]
) {
  const context = await loadGtfsTimetableContext()

  return getLineTimetablePatternFromGtfsContext(context, lineNumber, month, dayType, directionStops)
}
