import { getLineTimetable } from "../../../infrastructure/db/repositories/line-timetables.repository";

export async function obtainLineTimetable(
  id: string,
  month: string,
  dayType: 'weekday' | 'saturday' | 'sunday_or_holiday',
  direction: 'outbound' | 'inbound'
) {
  return getLineTimetable(id, month, dayType, direction)
}
