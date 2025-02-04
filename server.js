/* Server-side script */
const express = require('express')
const {createServer} = require('node:http')
const path = require('node:path')
const {Server} = require('socket.io')
require('dotenv').config()
const {formatMessage} = require('./utils/formatMessage')
const {joinRoom} = require('./utils/users')

// Botname
const botName = 'Admin'
// Port variable
const PORT = process.env.PORT || 3000

// Initialize express
const app = express()
// Create server
const server = createServer(app)
// Instantiate socket.io and hook it up to the server
const io = new Server(server)

// Express static folder
app.use(express.static(path.join(__dirname, 'public')))

/* Implementing socket.io */

/* Socket types of broadcasting
    socket.emit() - emit to the socket that's connected to the server
    socket.broadcast.emit() - emit to all sockets except for the socket that's connected to the server
    io.emit() - emit to every socket
*/
// Listen for an comming connection from the client
io.on('connection', (socket) => {
    
    // Join room after the client connects to the server
    socket.on('joinRoom', ({username, room}) => {
        const user = joinRoom(socket.id, username, room)
        // Actually join a particular room
        socket.join(user.room)
        console.log(user)
        socket.to(user.room).emit('message', formatMessage(botName, `${user.username}, welcome to the chatroom`))
        socket.broadcast.to(user.room).emit('message', formatMessage(botName,`${user.username} has joined the chatroom`))

    // Listen for chat message from the client
        socket.on('chatMessage', (message) => {
        // Emit to every client
        io.to(user.room).emit('message', formatMessage(user.username, message))
           })
    // Disconnect
        socket.on('disconnect', () => {
        // Notify every client that the user has left the chat
        io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chatroom`))
          })
        })

})

// Start server
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))