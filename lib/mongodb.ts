import mongoose from "mongoose";

const MONGODB_URI = process.env.DATABASE_URL;

console.log("=== MongoDB Debug ===");
console.log("DATABASE_URL exists:", !!MONGODB_URI);

if (MONGODB_URI) {
  console.log(
    "URI preview:",
    MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@"),
  );
}

if (!MONGODB_URI) {
  throw new Error(
    "Please define the DATABASE_URL environment variable inside .env",
  );
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

let cached: MongooseCache = global.mongoose || {
  conn: null,
  promise: null,
};

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB() {
  console.log("[MongoDB] connectDB called");

  if (cached.conn) {
    console.log("[MongoDB] Using cached connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("[MongoDB] Creating new connection...");

    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI!, opts)
      .then((mongoose) => {
        console.log("[MongoDB] Connected successfully");
        return mongoose;
      })
      .catch((err) => {
        console.error("[MongoDB] Connection failed:");
        console.error("Name:", err.name);
        console.error("Message:", err.message);
        console.error("Code:", err.code);
        console.error("Full Error:", err);

        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    console.log("[MongoDB] Connection ready");
  } catch (e) {
    console.error("[MongoDB] Failed while awaiting connection:", e);
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;