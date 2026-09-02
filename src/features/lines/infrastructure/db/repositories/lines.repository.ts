import { getDB } from "../../../../../shared/database/mongodb";
import { LinesRepository } from "../../../domain/ports/lines.repository";
import { escapeRegex } from "../../../../../shared/utils/regex";
import { LineDocument } from "../schemas/line-document.schema";

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

  async findLines(request) {
    const db = getDB();
    const col = db.collection("lines");

    const search = request.search?.trim();

    const filter = search
      ? {
          $or: [
            { number: { $regex: escapeRegex(search), $options: "i" } },
            { name: { $regex: escapeRegex(search), $options: "i" } },
          ],
        }
      : {};

    const docs = await col
      .find(filter)
      .collation({ locale: "es", numericOrdering: true })
      .sort({ number: 1 })
      .project({ _id: 0, number: 1, name: 1 })
      .skip(request.skip)
      .limit(request.limit)
      .toArray();
    const total = await col.countDocuments(filter);

    return {
      items: docs.map((doc) => ({
        id: doc.number,
        name: doc.name,
      })),
      total,
    };
  },

  async findLineDetails(number) {
    const db = getDB();
    const col = db.collection<LineDocument>("lines");

    const doc = await col.findOne({ number });

    if (!doc) {
      return null;
    }

    return {
      id: doc.number,
      name: doc.name,
      directions: doc.directions.map((direction) => ({
        direction: direction.direction,
        destination: direction.destination,
        stops: direction.stops.map((stop) => ({
          id: stop.code,
          name: stop.name,
          order: stop.order,
        })),
      })),
    };
  },
};
