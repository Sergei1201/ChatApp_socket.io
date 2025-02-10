/* Format messages */
const moment = require('moment')

const formatMessage = (from, message) => {
    // Return an object
    return {
        from,
        message,
        time: moment().format('h:mm:ss a')
    }
}

module.exports = {
    formatMessage,
}