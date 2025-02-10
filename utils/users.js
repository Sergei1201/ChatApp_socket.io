/* Dealing with users and rooms */
let users = []

// User joins a room
const userJoin = (id, username, room) => {
    const user = {id, username, room}
    // Push a user into a room
    users.push(user)
    // Return a new user
    return user
}

// Get users from the current room
const getUsers = (room) => {
    users.map(user => {
        user.room == room
    })
    return users
}

module.exports = {
    userJoin,
    getUsers,
}