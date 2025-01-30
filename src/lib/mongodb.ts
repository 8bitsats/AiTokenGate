import mongoose, {
  Document,
  Model,
} from 'mongoose';

const MONGODB_URI = 'mongodb+srv://chesh:bbjp@grindao.crvz0.mongodb.net/';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Define User document interface
interface IUser extends Document {
  walletAddress: string;
  username: string;
  isVerified: boolean;
  verificationToken?: string;
  twitterHandle?: string;
  telegramHandle?: string;
  discordId?: string;
  createdAt: Date;
}

// Define mongoose cache interface
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Initialize mongoose cache in browser or Node.js environment
const globalThis = (typeof window !== 'undefined' ? window : global) as unknown as {
  mongoose?: MongooseCache;
};
globalThis.mongoose = globalThis.mongoose || { conn: null, promise: null };

// Get mongoose cache
const mongooseCache = globalThis.mongoose;

/**
 * Connect to MongoDB database
 * @returns Promise<typeof mongoose>
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  try {
    if (mongooseCache.conn) {
      return mongooseCache.conn;
    }

    if (!mongooseCache.promise) {
      const opts = {
        bufferCommands: false,
      };

      mongooseCache.promise = mongoose.connect(MONGODB_URI, opts);
    }

    mongooseCache.conn = await mongooseCache.promise;
    return mongooseCache.conn;
  } catch (e) {
    mongooseCache.promise = null;
    throw e;
  }
}

// Define User Schema
const UserSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20,
    match: /^[a-zA-Z0-9_]+$/, // Only allow letters, numbers, and underscores
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  twitterHandle: String,
  telegramHandle: String,
  discordId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add indexes
UserSchema.index({ username: 1 });
UserSchema.index({ walletAddress: 1 });

// Export User model with interface
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
