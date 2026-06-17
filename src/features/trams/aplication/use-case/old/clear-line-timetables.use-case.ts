import { clearLineTimetables } from "../../../infrastructure/db/repositories/line-timetables.repository";

export async function clearLinesTimetables() {
  return await clearLineTimetables()
}
