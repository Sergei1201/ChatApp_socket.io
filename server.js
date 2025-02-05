/* Server-side script */
const express = require('express')
const {Server} = require('socket.io')
const {createServer} = require('node:http')
const path = require('path')
const { create } = require('node:domain')
require('dotenv').config()
const {formatMessage} = require('./utils/formatMessage')
const {joinRoom} = require('./utils/users')

// Port variable
const PORT = process.env.PORT || 5000

// Initialize express
const app = express()
// Create server
const server = createServer(app)
// Instantiate socket.io and hook it up to the server
const io = new Server(server)
// Admin
const chatBot = 'Admin'

// Express static folder
app.use(express.static(path.join(__dirname, 'public')))


/* Implement socket.io */
/* Socket.io event types
    socket.emit() - emit event to the socket that's connected to the server
    socket.broadcast.emit() - emit event to every socket except for the socket that's connected
    io.emit() - emit event to every socket in general
*/

// Listen for the connection event from the client
io.on('connection', (socket) => {

    // Listen for joinRoom event from the client to join a user to a room
    socket.on('joinRoom', ({username, room}) => {

            // Adding user to the room users
            const user = joinRoom(socket.id, username, room)
            // Actually join the room
            socket.join(user.room)
            console.log(user)

            // Emit message to the client after it's conneted
        socket.emit('message', formatMessage(chatBot, `${user.username}, welcome to the chatroom`))
        
        // Emit to every client that except for the client that's connecting that it's connecting
        socket.broadcast.to(user.room).emit('message', formatMessage(chatBot, `${user.username} has joined the chatroom`))

        // Listen for chatMessage from the client
        socket.on('chatMessage', (message) => {
            // Emit the message back to every socket for outputting it into the DOM
            io.to(user.room).emit('message', formatMessage(user.username, message))
        })

        // Client disconneted
        socket.on('disconnect', () => {
            // Emit to every socket after the client disconnected
            io.to(user.room).emit('message', formatMessage(chatBot, `${user.username} has left the chatroom`))
        })
        })

   
})

// Run the server
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))