/* Server-side script */
const express = require('express')
const { create } = require('node:domain')
const {createServer} = require('node:http')
const {Server} = require('socket.io')
const path = require('node:path')
require('dotenv').config()
const {formatMessage} = require('./utils/formatMessage')
const {userJoin, getUser, getUsers, userLeaves} = require('./utils/users')

// Port variable
const PORT = process.env.PORT || 5000

// Admin variable
const admin = 'Admin'

// Initialize express
const app = express()
// Create server
const server = createServer(app)
// Instantiate socket.io object and hook it up to the server
const io = new Server(server)

// Express static folder
app.use(express.static(path.join(__dirname, 'public')))

/* Implement socket.io */
/* Socket.io broadcast events' types
    socket.emit() - broadcast to the socket that's connected
    socket.broadcast.emit() - broadcast to every socket except for the one that's connected
    io.emit() - broadcast to every socket
*/

// Listen for a connection from the client
io.on('connection', (socket) => {
    
    // Listen for the joinUser event from the client
    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room)
        
        // Join the user to the passed in room from the client
        socket.join(user.room)
        console.log(user)

        // Send room's name and users to the client after a new user has joined the room
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getUsers(user.room)
        })

         // When a client connects, broadcast to the client and the other clients in the room (notify them that a new client has joined the chatroom)
        socket.emit('message', formatMessage(admin, `${user.username}, welcome to the chatroom`))
        socket.broadcast.to(user.room).emit('message', formatMessage(admin, `${user.username} has joined the chat`))

        // Catch the chatMessage event from the client and send it back to it 
        socket.on('chatMessage', (message) => {
            // Emit to every socket
            io.to(user.room).emit('message', formatMessage(user.username, message))
        })

        // Client disconnected
         socket.on('disconnect', () => {
        io.to(user.room).emit('message', formatMessage(admin, `${user.username} has left the chat`))
         })
    })
   
    })

// Start the server on port
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
