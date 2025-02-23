/* Connection to MongoDB */
const {MongoClient} = require('mongodb')

// Connect to MongoDB
const connectDB = async () => {

    // Instantiate the MongoClient class by creating a new object for DB connection
    const client = new MongoClient(process.env.MONGO_URI)

    // Connect to the database
    try {
        await client.connect()
        console.log('MongoDB connected...')
        return client.db() // Returning the database itself

    } catch (err) {
        console.log(err)
        process.exit(-1)
    }
}

module.exports = {
    connectDB,
}