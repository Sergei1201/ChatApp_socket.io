/* Define messages schema */
const mongoose = require('mongoose')

/* Messages schema */
const messageSchema = new mongoose.Schema({
    message: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},
{timestamps: true}
)

module.exports = mongoose.model('Message', messageSchema)