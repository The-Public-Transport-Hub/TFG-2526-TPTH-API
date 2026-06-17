// import { clearLineTimetables, clearLineTimetablesByLine, upsertLineTimetable } from "../../infrastructure/db/repositories/line-timetables.repository";
// import { getAllLinesWithDetail } from "../../infrastructure/db/repositories/lines.repository";
// import type { LineDocument } from "../../infrastructure/db/schemas/line-document.schema";
// import type { LineTimetableDocument } from "../../infrastructure/db/schemas/line-timetable.schema";
// import { getLineTimetablePatternFromGtfsContext, loadGtfsTimetableContext } from "../../infrastructure/providers/titsa/gtfs/gtfs-timetable.connector";
// import type { GtfsTimetableContext } from "../../infrastructure/providers/titsa/gtfs/gtfs-timetable.connector";
// import { obtainLineById } from "./get-line-by-id.use-case";

// const directions = ['outbound', 'inbound'] as const
// const dayTypes = ['weekday', 'saturday', 'sunday_or_holiday'] as const

// type LineTimetablesSyncStatus = {
//   status: 'idle' | 'running' | 'completed' | 'failed'
//   synced: number
//   linesSynced: number
//   linesSkipped: number
//   linesFailed: number
//   totalLines: number
//   currentLine: string | null
//   startedAt: string | null
//   finishedAt: string | null
//   failedLines: { lineNumber: string, message: string }[]
// }

// const lineTimetablesSyncStatus: LineTimetablesSyncStatus = {
//   status: 'idle',
//   synced: 0,
//   linesSynced: 0,
//   linesSkipped: 0,
//   linesFailed: 0,
//   totalLines: 0,
//   currentLine: null,
//   startedAt: null,
//   finishedAt: null,
//   failedLines: [],
// }

// export function getLineTimetablesSyncStatus() {
//   return lineTimetablesSyncStatus
// }

// async function syncLineTimetablesWithContext(
//   line: LineDocument,
//   month: string,
//   gtfsContext: GtfsTimetableContext
// ) {
//   let synced = 0

//   for (const direction of directions) {
//     const directionStops = direction === 'outbound'
//       ? line.stopsOutbound ?? []
//       : line.stopsInbound ?? []

//     for (const dayType of dayTypes) {
//       const { variants, source } = getLineTimetablePatternFromGtfsContext(
//         gtfsContext,
//         line.number,
//         month,
//         dayType,
//         directionStops
//       )

//       const timetable: LineTimetableDocument = {
//         lineNumber: line.number,
//         lineName: line.name,
//         provider: line.provider,
//         month,
//         dayType,
//         direction,
//         variants,
//         source,
//         syncedAt: new Date().toISOString(),
//       }

//       await upsertLineTimetable(timetable)
//       synced += 1
//     }
//   }

//   return synced
// }

// export async function syncLineTimetables(id: string, month: string) {
//   const line = await obtainLineById(id)

//   if (!line) {
//     return { synced: 0 }
//   }

//   if (!line.stopsOutbound?.length || !line.stopsInbound?.length) {
//     return { synced: 0 }
//   }

//   const gtfsContext = await loadGtfsTimetableContext()

//   await clearLineTimetablesByLine(id)

//   const synced = await syncLineTimetablesWithContext(line, month, gtfsContext)

//   return { synced }
// }

// export async function syncAllLineTimetables(month: string) {
//   if (lineTimetablesSyncStatus.status === 'running') {
//     return lineTimetablesSyncStatus
//   }

//   lineTimetablesSyncStatus.status = 'running'
//   lineTimetablesSyncStatus.synced = 0
//   lineTimetablesSyncStatus.linesSynced = 0
//   lineTimetablesSyncStatus.linesSkipped = 0
//   lineTimetablesSyncStatus.linesFailed = 0
//   lineTimetablesSyncStatus.totalLines = 0
//   lineTimetablesSyncStatus.currentLine = null
//   lineTimetablesSyncStatus.startedAt = new Date().toISOString()
//   lineTimetablesSyncStatus.finishedAt = null
//   lineTimetablesSyncStatus.failedLines = []

//   try {
//     const lines = await getAllLinesWithDetail()
//     lineTimetablesSyncStatus.totalLines = lines.length

//     const gtfsContext = await loadGtfsTimetableContext()

//     await clearLineTimetables()

//     for (const line of lines) {
//       lineTimetablesSyncStatus.currentLine = line.number

//       if (!line.stopsOutbound?.length || !line.stopsInbound?.length) {
//         lineTimetablesSyncStatus.linesSkipped += 1
//         continue
//       }

//       try {
//         lineTimetablesSyncStatus.synced += await syncLineTimetablesWithContext(line, month, gtfsContext)
//         lineTimetablesSyncStatus.linesSynced += 1
//       } catch (error) {
//         lineTimetablesSyncStatus.linesFailed += 1
//         lineTimetablesSyncStatus.failedLines.push({
//           lineNumber: line.number,
//           message: error instanceof Error ? error.message : 'Unknown error',
//         })
//       }
//     }

//     lineTimetablesSyncStatus.status = 'completed'
//     lineTimetablesSyncStatus.currentLine = null
//     lineTimetablesSyncStatus.finishedAt = new Date().toISOString()

//     return lineTimetablesSyncStatus
//   } catch (error) {
//     lineTimetablesSyncStatus.status = 'failed'
//     lineTimetablesSyncStatus.currentLine = null
//     lineTimetablesSyncStatus.finishedAt = new Date().toISOString()
//     lineTimetablesSyncStatus.linesFailed += 1
//     lineTimetablesSyncStatus.failedLines.push({
//       lineNumber: 'global',
//       message: error instanceof Error ? error.message : 'Unknown error',
//     })

//     return lineTimetablesSyncStatus
//   }
// }
