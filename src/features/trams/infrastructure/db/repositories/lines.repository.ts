import { getDB } from "../../../../../shared/database/mongodb";
import { LinesRepository } from "../../../domain/ports/lines.repository";

export const mongoLinesRepository: LinesRepository = {
  async upsertLines(lines) {
    const updateLines = lines.map((line) => ({
      updateOne: {
        filter: {
          provider: line.provider,
          number: line.number,
        },
        update: {
          $set: line,
        },
        upsert: true,
      },
    }));

    const db = getDB();
    const col = db.collection("lines");

    const updateLinesResult = await col.bulkWrite(updateLines);

    return {
      upserted: updateLinesResult.upsertedCount,
      modified: updateLinesResult.modifiedCount,
    };
  },

  async findLines(page) {
    const db = getDB();
    const col = db.collection("lines");

    const docs = await col
      .find({})
      .project({ _id: 0, number: 1, name: 1 })
      .skip(page.skip)
      .limit(page.limit)
      .toArray();
    const total = await col.countDocuments();

    return {
      items: docs.map((doc) => ({
        id: doc.number,
        name: doc.name,
      })),
      total,
    };
  },
};

// export async function getLineByNumber(number: string) {
//   const db = getDB()
//   const col = db.collection('lines')

//   const doc = await col.findOne({ number })

//   if (!doc) {
//     return null
//   }

//   return {
//     number: doc.number,
//     name: doc.name,
//     provider: doc.provider,
//     syncedAt: doc.syncedAt,
//     destinationOutbound: doc.destinationOutbound,
//     destinationInbound: doc.destinationInbound,
//     stopsOutbound: doc.stopsOutbound,
//     stopsInbound: doc.stopsInbound,
//     detailSyncedAt: doc.detailSyncedAt,
//   }
// }

// export async function getAllLinesWithDetail() {
//   const db = getDB()
//   const col = db.collection('lines')

//   const docs = await col.find({}).toArray()

//   return docs.map(doc => ({
//     number: doc.number,
//     name: doc.name,
//     provider: doc.provider,
//     syncedAt: doc.syncedAt,
//     destinationOutbound: doc.destinationOutbound,
//     destinationInbound: doc.destinationInbound,
//     stopsOutbound: doc.stopsOutbound,
//     stopsInbound: doc.stopsInbound,
//     detailSyncedAt: doc.detailSyncedAt,
//   }))
// }

// export async function updateLineDetail(number: string, detail: LineDetail) {
//   const db = getDB()
//   const col = db.collection('lines')

//   await col.updateOne(
//     { number },
//     {
//       $set: detail,
//     }
//   )
// }

// export async function countLines() {
//   const db = getDB()
//   const col = db.collection('lines')

//   return col.countDocuments()
// }
