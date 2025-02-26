/* Define a User schema with mongoose */
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    socketid: {
        type: String
    },
    username: {
        type: String,
        required: true
    },
    room: {
        type: String,
        required: true
    }
},
    {timestamps: true}
) 

module.exports = mongoose.model('User', userSchema)
