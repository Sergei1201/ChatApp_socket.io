/* Users helper functions */
let users = []

// User joins room
const joinRoom = (id, username, room) => {
    const user = {id, username, room}
    
    // Push a new user to the users array (the users that are already in the chosen room)
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

const userLeaves = (id) => {
    
    // Find index of the leaving user
    const index = users.findIndex(user => user.id === id)
    

    // If there's user, splice it out from the array and return it
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

module.exports = {
    joinRoom,
    getRoomUsers,
    getCurrentUser,
    userLeaves,
}