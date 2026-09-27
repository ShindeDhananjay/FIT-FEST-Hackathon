import mongoose from 'mongoose';
import dns from 'dns';

// Fix for Node.js DNS resolver on Windows where local/ISP routers refuse SRV lookups (_mongodb._tcp)
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore in environments where setServers is restricted
}

const MONGODB_URI = process.env.MONGODB_URI;

// Direct replica set fallback URI — loaded from env, never hardcoded
const MONGODB_FALLBACK_URI = process.env.MONGODB_FALLBACK_URI || '';

// Resolves mongodb+srv:// to direct node hosts via public DNS if standard resolution fails
async function resolveMongoUri(rawUri: string): Promise<string> {
  if (!rawUri || !rawUri.startsWith('mongodb+srv://')) {
    return rawUri || MONGODB_FALLBACK_URI;
  }

  try {
    const resolver = new dns.promises.Resolver();
    resolver.setServers(['8.8.8.8', '1.1.1.1']);

    const srvMatch = rawUri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^\/\?]+)(\/?[^?]*)(.*)/);
    if (srvMatch) {
      const [, user, pass, host, db, query] = srvMatch;
      const records = await resolver.resolveSrv(`_mongodb._tcp.${host}`);
      if (records && records.length > 0) {
        const hosts = records.map((r) => `${r.name}:${r.port}`).join(',');
        const queryParams = query.includes('?') ? `${query}&ssl=true&authSource=admin` : '?ssl=true&authSource=admin';
        return `mongodb://${user}:${pass}@${hosts}${db}${queryParams}`;
      }
    }
  } catch (err: any) {
    console.warn('⚠️ Dynamic SRV resolution note, using direct replica fallback:', err.message);
  }

  return MONGODB_FALLBACK_URI;
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose | null> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!MONGODB_URI && !MONGODB_FALLBACK_URI) {
    console.warn('⚠️ No MongoDB URI configured. Set MONGODB_URI or MONGODB_FALLBACK_URI in .env.local');
    return null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    };

    cached.promise = (async () => {
      // 1. Resolve to direct host connection string
      const resolvedUri = await resolveMongoUri(MONGODB_URI || '');

      try {
        const instance = await mongoose.connect(resolvedUri, opts);
        console.log('✅ Connected to MongoDB Atlas successfully.');
        return instance;
      } catch (err: any) {
        console.warn('⚠️ Primary MongoDB connection attempt failed, trying direct replica set fallback:', err.message);
      }

      // 2. Try direct static fallback
      if (MONGODB_FALLBACK_URI && resolvedUri !== MONGODB_FALLBACK_URI) {
        try {
          const instance = await mongoose.connect(MONGODB_FALLBACK_URI, opts);
          console.log('✅ Connected to MongoDB Atlas via direct replica set.');
          return instance;
        } catch (fallbackErr: any) {
          console.warn('⚠️ MongoDB direct replica set connection attempt failed:', fallbackErr.message);
        }
      }

      return null;
    })();
  }

  try {
    cached.conn = await cached.promise;
    if (!cached.conn || mongoose.connection.readyState !== 1) {
      cached.promise = null;
      return null;
    }
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    console.error('MongoDB connection resolution error:', e);
    return null;
  }
}
