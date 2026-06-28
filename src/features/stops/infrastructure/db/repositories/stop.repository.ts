import { getDB } from "../../../../../shared/database/mongodb";
import { StopRepository } from "../../../domain/ports/stop.repository";
import { escapeRegex } from "../../../../../shared/utils/regex";

export const mongoStopsRepository: StopRepository = {
  async upsertStops(stops) {
    const updateStops = stops.map((stop) => ({
      updateOne: {
        filter: {
          provider: stop.provider,
          code: stop.code,
        },
        update: {
          $set: stop,
        },
        upsert: true,
      },
    }));

    const db = getDB();
    const col = db.collection("stops");

    const updateStopsResult = await col.bulkWrite(updateStops);

    return {
      upserted: updateStopsResult.upsertedCount,
      modified: updateStopsResult.modifiedCount,
    };
  },

  async findStops(request) {
    const db = getDB();
    const col = db.collection("stops");

    const search = request.search?.trim();

    const filter = {
      ...(request.provider ? { provider: request.provider } : {}),
      ...(search
        ? {
            $or: [
              { code: { $regex: escapeRegex(search), $options: "i" } },
              { name: { $regex: escapeRegex(search), $options: "i" } },
            ],
          }
        : {}),
    };

    const docs = await col
      .find(filter)
      .project({ _id: 0, code: 1, name: 1 })
      .skip(request.skip)
      .limit(request.limit)
      .toArray();
    const total = await col.countDocuments(filter);

    return {
      items: docs.map((doc) => ({
        id: doc.code,
        name: doc.name,
      })),
      total,
    };
  },

  async findStopByCode(code) {
    const db = getDB();
    const col = db.collection("stops");

    const doc = await col.findOne({ code });

    if (!doc) {
      return null;
    }

    return {
      id: doc.code,
      name: doc.name,
      latitude: doc.latitude,
      longitude: doc.longitude,
      lines: [],
      arrivals: [],
    };
  },
};
