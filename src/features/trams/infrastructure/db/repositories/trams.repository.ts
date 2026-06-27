import { getDB } from "../../../../../shared/database/mongodb";
import { TramRepository } from "../../../domain/ports/tram.repository";
import { escapeRegex } from "../../../../../shared/utils/regex";

export const mongoTramsRepository: TramRepository = {
  async upsertTrams(trams) {
    const updateTrams = trams.map((tram) => ({
      updateOne: {
        filter: {
          provider: tram.provider,
          number: tram.number,
        },
        update: {
          $set: tram,
        },
        upsert: true,
      },
    }));

    const db = getDB();
    const col = db.collection("trams");

    const updateTramResult = await col.bulkWrite(updateTrams);

    return {
      upserted: updateTramResult.upsertedCount,
      modified: updateTramResult.modifiedCount,
    };
  },

  async findTrams(search) {
    const db = getDB();
    const col = db.collection("trams");

    const searchText = search?.trim();

    const filter = searchText
      ? {
          $or: [
            { number: { $regex: escapeRegex(searchText), $options: "i" } },
            { name: { $regex: escapeRegex(searchText), $options: "i" } },
          ],
        }
      : {};

    const docs = await col
      .find(filter)
      .project({ _id: 0, number: 1, name: 1 })
      .sort({ number: 1 })
      .toArray();

    return docs.map((doc) => ({
      id: doc.number,
      name: doc.name,
    }));
  },
};
