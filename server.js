/* Server-side script */
const express = require('express')
const { createPrivateKey } = require('node:crypto')
const {createServer} = require('node:http')
require('dotenv').config()
const path = require('node:path')
const {Server} = require('socket.io')
const {userJoins, getCurrentUser, getRoomUsers, userLeaves} = require('./utils/users')
const {formatMessage} = require('./utils/formatMessage')    
//const {connectDB} = require('./db')
const {MongoClient} = require('mongodb')

// Port variable
const PORT = process.env.PORT || 5000

// Connect to MongoDB
const connectDB = async () => {

    // Instantiate the MongoClient class
    const client = new MongoClient(process.env.MONGO_URI)

    // Try connecting to MongoDB
    try {
        await client.connect()
        console.log('MongoDB connected...')
        const db = client.db()
        
        // Create a new collection in our chatapp database
        let chat = db.collection('chat')
        
    } catch (error) {
        console.log(error)
        process.exit(-1)
    }
}

connectDB()

// Admin variable
const admin = 'Admin'

// Initialize express
const app = express()

// Create server
const server = createServer(app)

// Instantiate socket.io object and hook it up to our server
const io = new Server(server)

// Create express static folder
app.use(express.static(path.join(__dirname, 'public')))

/* Implement socket.io */
/* Define socket.io broadcast event's types  
    socket.emit() - emit event to the socket that's connected
    socket.broadcast.emit() - emit event to every socket except for the socket that's connected
    io.emit() - emit to every socket in general
  */
 
// Listen for a connection from the client
io.on('connection', (socket) => {

    // When a client connects for the first time, create a new collection in the chatapp database (MongoDB)

    // Listen for the joinRoom event from the client to join room
    socket.on('joinRoom', ({username, room}) => {

        // Get user object with user.id, username, room
        const user = userJoins(socket.id, username, room)

        // Actually join the room
        socket.join(user.room)

        console.log(user)
    
        // When a user joins the chatroom, emit to every socket info with room users and the room itself
        io.to(user.room).emit('roomUsers', {
            users: getRoomUsers(user.room),
            room: user.room
        })

        // When a client connected, emit the message to that client
        socket.emit('message', formatMessage(admin, `${user.username}, welcome to the ${user.room} chatroom`))

        // Emit message to every client except for the client connected
        socket.broadcast.to(user.room).emit('message', formatMessage(admin, `${user.username} has joined ${user.room} chatroom`))

        // Listen for the chatMessage event from the client
        socket.on('chatMessage', (message) => {

            // Get the current user that emitted a message to send it to the client
            const user = getCurrentUser(socket.id)

            // Emit it back to every client (because it's a public chatroom)
            io.to(user.room).emit('message', formatMessage(user.username, message))
        })

        // When a client disconnected
        socket.on('disconnect', () => {

            // Get the user that is leaving the chatroom
            const user = userLeaves(socket.id)

            // If there's a user, emit upgraded info about users to the client to be displayed in the DOM
            if (user) {

            // Broadcast to every socket, when a client disconnected
            io.to(user.room).emit('message', formatMessage(`${user.username} has left ${user.room} chatroom`))

            // Emit the upgraded array of users to the client
            io.to(user.room).emit('roomUsers', {
                users: getRoomUsers(user.room),
                room: user.room
            })

            }
        })
        })

    })

// Listen on port 
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
