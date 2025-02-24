/* Handle messages for saving them in the database */
const { ObjectId } = require('mongodb')
const {connectDB} = require('../db')

const handleDBMessages = async (message) => {
    const db = await connectDB()
    const msgCollection = db.collection('messages')
    const msg = await msgCollection.insertOne({
        message,
        })
    return msg
}

module.exports = {
    handleDBMessages,
}