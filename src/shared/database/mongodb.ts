import type { MongoClient, Db } from "mongodb";
import { env } from "../config/env";

let client: MongoClient | null = null;
let db: Db | null = null;

export const connectToDatabase = async () => {
  if (db) {
    return db;
  }

  const { MongoClient } = await import("mongodb");

  client = new MongoClient(env.MONGO_URI, {
    serverSelectionTimeoutMS: env.MONGO_SERVER_SELECTION_TIMEOUT_MS,
  });
  await client.connect();
  db = client.db(env.DB_NAME);

  return db;
};

export function getDB() {
  if (!db) {
    throw new Error("Database not connected");
  }

  return db;
}

export async function closeDB() {
  if (!client) {
    return;
  }

  await client.close();

  client = null;
  db = null;
}
