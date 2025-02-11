/* Format messages function */
const moment = require('moment')

const formatMessage = (from, message) => {
    return {
        from,
        message,
        time: moment().format('h:mm:ss a')
    }
}

module.exports = {
    formatMessage,
}