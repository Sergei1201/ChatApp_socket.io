/* Connecting to MongoDB using the mongoose object relational mapper */
const { ConnectionReadyEvent } = require('mongodb')
const mongoose = require('mongoose')

/* Connect to MongoDB asynchronously */
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected on ${conn.connection.host}`)
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}

module.exports = {
    connectDB,
}