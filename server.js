/* Server-side script */
const express = require('express')
const { create } = require('node:domain')
const {createServer} = require('node:http')
const path = require('path')
const {Server} = require('socket.io')
require('dotenv').config()
const {joinRoom, getRoomUsers, getCurrentUser, userLeaves} = require('./utils/users')
const {formatMessage} = require('./utils/formatMessage')

// Admin constant
const admin = 'Admin'

// PORT constant
const PORT = process.env.PORT || 5000

// Initialize express
const app = express()
// Create http server
const server = createServer(app)
// Instantiate socket.io new object and hook it up to the server
const io = new Server(server)

// Express static folder
app.use(express.static(path.join(__dirname, 'public')))

/* Implement socket.io */

/* Socket.io broadcast event types for out application 
    socket.emit() - emit an event to the socket that's connected
    socket.broadcast.emit()- emit an event to every socket except for the socket that's connected
    io.emit() - emit to every socket in general
*/ 

// Listen for connection from the client
io.on('connection', (socket) => {

    /* Listen from the joinRoom event from the client */
    socket.on('joinRoom', ({username, room}) => {

        // Join room function
        const user = joinRoom(socket.id, username, room)

        // Actually join the room
        socket.join(user.room)

        console.log(user)

        // Send the current room's name and room's users when the client connects 
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })

         /* Emit when a socket is connected */
    
        // Emit to the socket that's connected
        socket.emit('message', formatMessage(admin, `${user.username}, welcome to the chatroom`))
    
        // Emit to all sockets except for the socket that's connected
        socket.broadcast.to(user.room).emit('message', formatMessage(admin, `${user.username} has joined the chatroom`))

        // Catch the chatMessage event from the client and emit it back
        socket.on('chatMessage', (message) => {
            const user = getCurrentUser(socket.id)
            io.to(user.room).emit('message', formatMessage(user.username, message))
             })
             
        // Emit when a socket is disconnected
        socket.on('disconnect', () => {
            
            const user = userLeaves(socket.id)
            if (user) {
                    
                    // Emit to every socket when a client is disconnected
                     io.to(user.room).emit('message', formatMessage(admin, `${user.username} has left the chatroom`))

                     // Emit to the client the list of users in the room for refreshing it on the client
                     io.to(user.room).emit('roomUsers', {
                        room: user.room,
                        users: getRoomUsers(user.room)
                     })
            }       

                })
    }) 

})

// Listen on port
server.listen(PORT, console.log(`Server is running on port ${PORT}`))