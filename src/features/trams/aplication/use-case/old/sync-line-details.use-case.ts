// import { getAllLinesWithDetail, getLineByNumber, updateLineDetail } from "../../infrastructure/db/repositories/lines.repository";
// import { getLineDetail } from "../../infrastructure/providers/titsa/open-data/titsa.connector";

// type LineDetailsSyncStatus = {
//   status: 'idle' | 'running' | 'completed' | 'failed'
//   synced: number
//   failed: number
//   total: number
//   currentLine: string | null
//   startedAt: string | null
//   finishedAt: string | null
//   failedLines: { lineNumber: string, message: string }[]
// }

// const lineDetailsSyncStatus: LineDetailsSyncStatus = {
//   status: 'idle',
//   synced: 0,
//   failed: 0,
//   total: 0,
//   currentLine: null,
//   startedAt: null,
//   finishedAt: null,
//   failedLines: [],
// }

// function wait(ms: number) {
//   return new Promise(resolve => setTimeout(resolve, ms))
// }

// export function getLineDetailsSyncStatus() {
//   return lineDetailsSyncStatus
// }

// export async function syncLineDetail(id: string) {
//   const line = await getLineByNumber(id)

//   if (!line) {
//     return { synced: 0 }
//   }

//   const detail = await getLineDetail(id)

//   if (!detail) {
//     return { synced: 0 }
//   }

//   await updateLineDetail(id, detail)

//   return { synced: 1 }
// }

// export async function syncAllLineDetails() {
//   if (lineDetailsSyncStatus.status === 'running') {
//     return lineDetailsSyncStatus
//   }

//   lineDetailsSyncStatus.status = 'running'
//   lineDetailsSyncStatus.synced = 0
//   lineDetailsSyncStatus.failed = 0
//   lineDetailsSyncStatus.total = 0
//   lineDetailsSyncStatus.currentLine = null
//   lineDetailsSyncStatus.startedAt = new Date().toISOString()
//   lineDetailsSyncStatus.finishedAt = null
//   lineDetailsSyncStatus.failedLines = []

//   try {
//     const lines = await getAllLinesWithDetail()
//     lineDetailsSyncStatus.total = lines.length

//     for (const line of lines) {
//       lineDetailsSyncStatus.currentLine = line.number

//       try {
//         const detail = await getLineDetail(line.number)

//         if (detail) {
//           await updateLineDetail(line.number, detail)
//           lineDetailsSyncStatus.synced += 1
//         }
//       } catch (error) {
//         lineDetailsSyncStatus.failed += 1
//         lineDetailsSyncStatus.failedLines.push({
//           lineNumber: line.number,
//           message: error instanceof Error ? error.message : 'Unknown error',
//         })
//       }

//       await wait(300)
//     }

//     lineDetailsSyncStatus.status = 'completed'
//     lineDetailsSyncStatus.currentLine = null
//     lineDetailsSyncStatus.finishedAt = new Date().toISOString()

//     return lineDetailsSyncStatus
//   } catch (error) {
//     lineDetailsSyncStatus.status = 'failed'
//     lineDetailsSyncStatus.currentLine = null
//     lineDetailsSyncStatus.finishedAt = new Date().toISOString()
//     lineDetailsSyncStatus.failed += 1
//     lineDetailsSyncStatus.failedLines.push({
//       lineNumber: 'global',
//       message: error instanceof Error ? error.message : 'Unknown error',
//     })

//     return lineDetailsSyncStatus
//   }
// }
