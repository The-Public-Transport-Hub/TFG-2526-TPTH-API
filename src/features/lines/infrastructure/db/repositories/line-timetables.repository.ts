import { getDB } from "../../../../../shared/database/mongodb";
import { LineTimetableDocument } from "../schemas/line-timetable.schema";

export async function getLineTimetable(
  lineNumber: string,
  month: string,
  dayType: 'weekday' | 'saturday' | 'sunday_or_holiday',
  direction: 'outbound' | 'inbound'
) {
  const db = getDB()
  const col = db.collection('line_timetables')

  const doc = await col.findOne({ lineNumber, month, dayType, direction })

  if (!doc) {
    return null
  }

  return {
    lineNumber: doc.lineNumber,
    lineName: doc.lineName,
    provider: doc.provider,
    month: doc.month,
    dayType: doc.dayType,
    direction: doc.direction,
    variants: doc.variants,
    source: doc.source,
  }
}

export async function upsertLineTimetable(timetable: LineTimetableDocument) {
  const db = getDB()
  const col = db.collection('line_timetables')

  await col.updateOne(
    {
      lineNumber: timetable.lineNumber,
      month: timetable.month,
      dayType: timetable.dayType,
      direction: timetable.direction,
    },
    {
      $set: timetable,
    },
    {
      upsert: true,
    }
  )
}

export async function clearLineTimetables() {
  const db = getDB()
  const col = db.collection('line_timetables')

  const result = await col.deleteMany({})

  return {
    deleted: result.deletedCount,
  }
}

export async function clearLineTimetablesByLine(lineNumber: string) {
  const db = getDB()
  const col = db.collection('line_timetables')

  const result = await col.deleteMany({ lineNumber })

  return {
    deleted: result.deletedCount,
  }
}
