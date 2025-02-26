/* Handle messages for saving them in the database */
const Message = require('../models/Message')

const insertMessagesIntoDB = async (userId, message) => {

    // Getting all documents from User model
    const msg = await Message.insertOne({
        message,
        user: userId
    })
    return msg
}

module.exports = {
    insertMessagesIntoDB,
}