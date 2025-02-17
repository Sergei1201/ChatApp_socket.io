/* Processing users and rooms */
let users = []

// User joins room
const userJoins = (id, username, room) => {
    
    // Get the user object
    const user = {id, username, room}
    
    // Push a new user to the users' array
    users.push(user)

    // Return the new user
    return user
}

// Get room users
const getRoomUsers = (room) => {
    return users.filter(user => user.room === room)
}

// Get current user
const getCurrentUser = (id) => {
    return users.find(user => user.id === id)
}

// User leaves the room
const userLeaves = (id) => {
    
    // Find index of that user who is leaving the chatroom
    const index = users.findIndex(user => user.id === id)

    // If there's user, splice it out from the array of users and return it
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}


module.exports = {
    userJoins,
    getRoomUsers,
    getCurrentUser,
    userLeaves,
}