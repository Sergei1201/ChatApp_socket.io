/* Utils functions */

let users = []

// Join user to room
const joinRoom = (id, username, room) => {
    const user = {id, username, room}
    // Push user to users that are already in the room
    users.push(user)
    // Return the user
    return user
}

module.exports = {
    joinRoom,
}