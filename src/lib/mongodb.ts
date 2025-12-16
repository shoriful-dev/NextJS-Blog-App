import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL as string;

if(!MONGODB_URL) {
  throw new Error('Please define the MONGODB_URL enviroment variable inside .env');
}

type CachedMongoose = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const cached = (globalThis as unknown as {mongooseCache: CachedMongoose}).mongooseCache || {conn: null, promise: null};

export async function connectDB(): Promise<typeof mongoose> {
  if(cached.conn && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }
  if(cached.promise) {
    cached.conn = await cached.promise;
    return cached.conn;
  }
  console.log('Establishing a new connection to MongoDB...');
  cached.promise = mongoose.connect(MONGODB_URL, {bufferCommands: false}).then((res) => {
    cached.conn = res;
    cached.promise = null;
    return res;
  }).catch((error) => {
    console.log('Mongodb Connection Error', error)
    cached.promise = null;
    throw error;
  })

  cached.conn = await cached.promise;
  (globalThis as unknown as { mongooseCache: CachedMongoose }).mongooseCache = cached;
  return cached.conn;
}


