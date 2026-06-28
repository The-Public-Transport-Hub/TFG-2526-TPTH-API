import { getDB } from "../../../../../shared/database/mongodb";
import { TramRepository } from "../../../domain/ports/tram.repository";
import { TramDocument } from "../schemas/tram-document.schema";
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

  async findTramById(id, direction) {
    const db = getDB();
    const col = db.collection<TramDocument>("trams");

    const doc = await col.findOne({ number: id });

    if (!doc) {
      return null;
    }

    const selectedDirection = doc.directions.find(
      (item) => item.direction === direction,
    );

    if (!selectedDirection) {
      return null;
    }

    return {
      id: doc.number,
      name: doc.name,
      direction: selectedDirection.direction,
      destination: selectedDirection.destination,
      stops: selectedDirection.stops.map((stop) => ({
        id: stop.code,
        name: stop.name,
        order: stop.order,
      })),
    };
  },
};
