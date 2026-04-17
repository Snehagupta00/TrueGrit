import dns from "node:dns";
import mongoose from "mongoose";

let cached = global.mongoose;

const DEFAULT_DNS_FALLBACK_SERVERS = ["8.8.8.8", "1.1.1.1"];

/**
 * Get DNS fallback servers from environment or use defaults
 * @returns {string[]} Array of DNS server IPs
 */
const getDnsFallbackServers = () => {
  const configuredServers = process.env.MONGO_DNS_SERVERS
    ?.split(",")
    .map((server) => server.trim())
    .filter(Boolean);

  return configuredServers?.length
    ? configuredServers
    : DEFAULT_DNS_FALLBACK_SERVERS;
};

/**
 * Check if the error is a MongoDB SRV DNS resolution error
 * @param {Error} error - The error object
 * @param {string} mongoUri - MongoDB connection URI
 * @returns {boolean} True if it's an SRV DNS resolution error
 */
const isSrvDnsResolutionError = (error, mongoUri) =>
  typeof mongoUri === "string" &&
  mongoUri.startsWith("mongodb+srv://") &&
  (error?.code === "ECONNREFUSED" || error?.code === "ENOTFOUND") &&
  (error?.syscall === "querySrv" || error?.syscall === "getaddrinfo");

/**
 * Connect to MongoDB with DNS fallback support
 * @param {string} mongoUri - MongoDB connection URI
 * @returns {Promise} Mongoose connection promise
 */
const connectWithDnsFallback = async (mongoUri) => {
  const mongooseOptions = {
    bufferCommands: true,
    serverSelectionTimeoutMS: 10000, // 10 seconds timeout
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    minPoolSize: 1,
    maxIdleTimeMS: 30000,
    retryWrites: true,
    w: 'majority'
  };

  try {
    console.log("🔄 Attempting MongoDB connection...");
    return await mongoose.connect(mongoUri, mongooseOptions);
  } catch (error) {
    console.error("❌ Initial MongoDB connection failed:", error.message);
    
    if (!isSrvDnsResolutionError(error, mongoUri)) {
      throw error;
    }

    const fallbackServers = getDnsFallbackServers();
    dns.setServers(fallbackServers);

    console.warn(
      `⚠️ MongoDB SRV lookup failed with system DNS. Retrying with fallback DNS servers: ${fallbackServers.join(", ")}`
    );

    try {
      return await mongoose.connect(mongoUri, mongooseOptions);
    } catch (fallbackError) {
      console.error("❌ MongoDB connection failed even with DNS fallback:", fallbackError.message);
      throw fallbackError;
    }
  }
};

// Initialize cache if it doesn't exist
if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

/**
 * Connect to MongoDB database with caching and DNS fallback
 * @returns {Promise} MongoDB connection
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("❌ MONGO_URI environment variable is not configured");
  }

  // Return existing connection if available
  if (cached.conn) {
    console.log("♻️ Using existing MongoDB connection");
    return cached.conn;
  }

  // Create new connection promise if none exists
  if (!cached.promise) {
    cached.promise = connectWithDnsFallback(mongoUri);
  }

  try {
    cached.conn = await cached.promise;
    console.log("✅ MongoDB connected successfully");
    
    // Setup connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('🔗 MongoDB connection established');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
      // Clear cache on disconnect
      cached.conn = null;
      cached.promise = null;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

    return cached.conn;
  } catch (error) {
    // Clear promise on error to allow retry
    cached.promise = null;
    console.error("❌ Failed to connect to MongoDB:", error.message);
    throw error;
  }
};

/**
 * Gracefully close MongoDB connection
 */
const disconnectDB = async () => {
  try {
    if (cached.conn) {
      await mongoose.connection.close();
      cached.conn = null;
      cached.promise = null;
      console.log("🔌 MongoDB connection closed gracefully");
    }
  } catch (error) {
    console.error("❌ Error closing MongoDB connection:", error.message);
  }
};

export default connectDB;
export { disconnectDB };