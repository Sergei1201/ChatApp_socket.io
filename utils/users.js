/* Dealing with rooms and users */

let users = []

// Join room
const joinRoom = (id, username, room) => {
    const user = {id, username, room}
    // Add user to a room
    users.push(user)
    return user
}

module.exports = {
    joinRoom,
}
