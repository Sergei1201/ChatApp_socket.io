/* DB stuff */
const User = require('../models/User')


// User joins room
const userJoins = async (socketid, username, room) => {

    // When a user joins the room, add him to the database
    const newUser = {socketid, username, room} 

    // Add a new user to the database on when he joins the room
    await User.insertOne(newUser)
    
    return newUser

}

const getRoomUsers = async (room) => {

    // Get room users from the database
    const users = await User.find({
        room: room
    })
    
    // Return the array of users objects
    return users
}
// Get current user
const getCurrentUser = async (id) => {

    // Get the current user from the database
    const user = await User.findOne({
        socketid: id
    })


    return user
}

// User leaves the room
const userLeaves = async (id) => {

    // Delete a user from the database
    const user = await User.findOneAndDelete({
        socketid: id
    })

    // Return the deleted user
    return user
}


module.exports = {
    userJoins,
    getRoomUsers,
    getCurrentUser,
    userLeaves,
}