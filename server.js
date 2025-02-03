/* Server-side script */
const express = require('express')
const { createServer } = require('node:http')
require('dotenv').config()
const { Server } = require('socket.io')
const path = require('node:path')
const { joinRoom } = require('./utils/users')
// Initialize express
const app = express()

// Port variable
const PORT = process.env.PORT || 5000

// Create server
const server = createServer(app)

// Instantiate a socket object and hook it up to the server
const io = new Server(server)

// Add static folder 
app.use(express.static(path.join(__dirname, 'public')))

/* Implementing socket.io */

/* Socket.io broadcasts' type 
    socket.emit() - emits message to the connected socket (client)
    socket.broadcast.emit - emits message to every socket (client) except for the connected socket (client)
    io.emit() - emits to every socket 
*/

/* Listen for connection from the client */
io.on('connection', (socket) => {

    // Listen for join room event from the client
    socket.on('joinRoom', ({ username, room }) => {
        const user = joinRoom(socket.id, username, room)

        // Join the user to a specific room (socket)
        socket.join(user.room)


        // Emit a message to the client after it's connected
        socket.emit('message', `Welcome to the chat`)

        // Emit to every client except for the connected client
        socket.broadcast.to(user.room).emit('message', `${user.username} has joined the chat`)

        // Listen for a message from the client and send it back to the client
        socket.on('chatMessage', (message) => {

            // Emit the message back to the client
            io.to(user.room).emit('message', message)
        })


        socket.on('disconnect', () => {
            io.to(user.room).emit('message', `${user.username} has left the chat`)
        })
    })

})

// Run the server on 
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))