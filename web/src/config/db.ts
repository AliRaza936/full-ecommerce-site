import mongoose from "mongoose"

const mongodbUrl = process.env.MONGODB_URL

if (!mongodbUrl) {
    throw new Error("MONGODB_URL is not defined in environment variables")
}

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

const ConnectDb = async () => {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(mongodbUrl, {
            serverSelectionTimeoutMS: 10000, // 10 seconds to find a server
            socketTimeoutMS: 45000,          // 45 seconds socket timeout
            bufferCommands: false,
        }).then((conn) => conn.connection)
    }

    try {
        cached.conn = await cached.promise
        return cached.conn
    } catch (error) {
        // Reset promise so the next call will retry the connection
        cached.promise = null
        console.error("MongoDB connection error:", error)
        throw error
    }
}

export default ConnectDb