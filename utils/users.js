/* DB stuff */
const {connectDB} = require('../db')

const handleDBConnection =  async () => {
    
    const db = await connectDB()
    const usersCollection = db.collection('users')
    return usersCollection
}

// Users collection
const getUsersFromDB = async () => {

     const usersCollection = await handleDBConnection()
    // Fetch all users from DB and turn them into an array of objects
    const users = await usersCollection.find({}).toArray()

    return users

}

// User joins room
const userJoins = async (socketid, username, room) => {

    // When a user joins the room, add him to the database
    const newUser = {socketid, username, room} 

    const usersCollection = await handleDBConnection()
    // Add a new user to the database
    await usersCollection.insertOne(newUser)
    
    return newUser

}

const getRoomUsers = async (room) => {

    const usersCollection = await handleDBConnection()
    // Get room users
    const users = await usersCollection.find({
        room: room
    }).toArray()
    
    // Return the array of users objects
    return users
}
// Get current user
const getCurrentUser = async (id) => {

    const usersCollection = await handleDBConnection()
    const user = await usersCollection.findOne({
        socketid: id
    })


    return user
}

// User leaves the room
const userLeaves = async (id) => {

    const usersCollection = await handleDBConnection()

    // Delete a user from the database
    const user = await usersCollection.findOneAndDelete({
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