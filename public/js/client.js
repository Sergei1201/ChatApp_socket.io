// Connect client-side library (socket.io)
const socket = io()

// Get form fields
const messages = document.getElementById('messages')
const form = document.getElementById('form')
const input = document.getElementById('input')
const roomName = document.querySelector('.room-name')
const chatUsers = document.getElementById('chat-users')

// Grab the username and the room from the query string params of the URL to send them to the server
const {username, room} = Qs.parse(location.search, {

    // Ignore the leading question mark in the URL params so that we get only username and room
    ignoreQueryPrefix: true
})

/* Function definition */

// Output messages into the DOM that have been caught from the server side
const outputMessage = (msg) => {
    
    // Create a new element (li)
    const li = document.createElement('li')
    
    // Add class
    li.className = 'list-group-item'

    // Add messge to the li
    li.textContent = `${msg.time} from ${msg.from}: ${msg.message}`
    
    // Output the message into the DOM
    messages.appendChild(li)

    // Scroll the messages after outputting one into the DOM
    window.scrollTo(0, document.body.scrollHeight)
}

// Output room name into the DOM
const outputRoom = (room) => {
    roomName.textContent = room
}

// Output room users into the DOM
const outputRoomUsers = (users) => {
    
    // Clear the ul at first (for refreshing the list of users in the room)
    while (chatUsers.firstChild) {
        chatUsers.removeChild(chatUsers.firstChild)
    }
    // Loop through the array of users and output them into the DOM
    users.forEach(user => {

        // Create a new element (li)
        const li = document.createElement('li')

        // Add a class
        li.className = 'list-group-item'

        // Add textcontent
        li.textContent = user.username

        // Append to the DOM
        chatUsers.appendChild(li)

        // Scroll users after appending one into the DOM
        window.scrollTo(0, document.body.scrollHeight)
    })
}

// Emit a message to the server after submitting the form
form.addEventListener('submit', (e) => {
    e.preventDefault()
    
    // Emit to the server if there's a message typed in
    if (input.value) {
        socket.emit('chatMessage', input.value)

        // Clear input after sending message
        input.value = ''

        // Focus on the input
        input.focus()
    }
})

// Emit the joinRoom event to the server after getting username and room fields from the query string params of the URL
socket.emit('joinRoom', {username, room})

// Listen for roomUsers event from the server and output rooms and users information into the DOM
socket.on('roomUsers', ({room, users}) => {

    // Output room
    outputRoom(room)

    // Output an array of user objects
    outputRoomUsers(users)
    console.log(users)
})

// Catch the message evernt from the server and output a message into the DOM
socket.on('message', (message) => {
    outputMessage(message)
})
