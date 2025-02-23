/* Processing users and rooms */
const {connectDB} = require('../db')


// Get users from the database
const getUsersFromDB = async () => {
    const db = await connectDB()
    const userCollection = db.collection('users') // Creates a chats collection if it does not exist
    const users = await userCollection.find({}.toArray())
    return users 
}


// Create a new chat collection in the chatapp db
let users = []

// User joins room
const userJoins = async (username, room) => {
    
    // Connect to Mongo
    const db = await connectDB()
    const userCollection = db.collection('users')
    const newUser = {username, room}
    
    // Add a new user to the database
    await userCollection.insertOne(newUser)
    console.log(newUser)
    
    // Push a new user to the users' array
    //users.push(user)

    // Return the new user
    return newUser
}

// Get room users
const getRoomUsers = async (room) => {

    // Connect to Mongo
    const db = await connectDB()
    const userCollection = db.collection('users')
    const users = await userCollection.find({room: room}).toArray()

    console.log(users)
    //return users.filter(user => user.room === room)
    //return users
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