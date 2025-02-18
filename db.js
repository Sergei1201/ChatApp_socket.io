/* Connection to MongoDB */
const {MongoClient, ConnectionReadyEvent} = require('mongodb')

const connectDB = async () => {

    // Instantiate the MongoClient class to create a new MongoClient object
    const client = new MongoClient(process.env.MONGO_URI)

    // Try connecting to MongoDB
    try {
        await client.connect()
        console.log('MongoDB connected...')
        return client.db()

    } catch (error) {
        console.log(error)
        process.exit(-1)
    

}
}

module.exports = {
    connectDB,
    
}   