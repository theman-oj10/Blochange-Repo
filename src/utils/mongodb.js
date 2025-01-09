// /lib/mongodb.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // Your MongoDB connection string
const options = {
  // You can add additional options here if needed
};

// Check if the MongoDB URI is provided
if (!uri) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

// Global is used here to maintain a cached connection across hot reloads
// in development. This prevents connections from growing exponentially
// during API route usage.
let globalWithMongo = global;

let cached = globalWithMongo.mongo;

if (!cached) {
  cached = globalWithMongo.mongo = { client: null, promise: null };
}

async function connectToDatabase() {
  if (cached.client) {
    return cached.client;
  }

  if (!cached.promise) {
    const client = new MongoClient(uri, {
      ...options,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Optional: Set pool size to limit the number of connections
    });

    cached.promise = client.connect().then((client) => {
      cached.client = client;
      return client;
    });
  }

  cached.client = await cached.promise;
  return cached.client;
}

export default connectToDatabase;
