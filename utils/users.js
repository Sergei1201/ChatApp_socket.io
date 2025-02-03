/* Utils functions */

// Initialize an empty array of users
let users = []
// Join room
const joinRoom = (id, username, room) => {
    const user = { id, username, room }
    // Add a user to a room
    users.push(user)
    // Return the user
    return user
}

module.exports = {
    joinRoom,
}