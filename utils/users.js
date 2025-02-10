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
    return users.filter(user => {
        user.room === room
    })
}

// Get current user
const getUser = (id) => {
    return users.find(user => {
        user.id === id
    })
}

// User leaves the chat
const userLeaves = (id) => {
    const index = users.find(user => user.id === id)
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}



module.exports = {
    userJoin,
    getUsers,
    getUser,
    userLeaves,
}