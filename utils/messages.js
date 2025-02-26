/* Handle messages for saving them in the database */
const Message = require('../models/Message')
const User = require('../models/Message')

const handleDBMessages = async (userId, message) => {

    // Getting all documents from User model
    const msg = await Message.insertOne({
        message,
        user: userId
    })
    return msg
}

module.exports = {
    handleDBMessages,
}