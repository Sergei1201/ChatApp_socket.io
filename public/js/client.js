// Connect the client with the server
const socket = io()

// Get form fields in variables
const messages = document.getElementById('messages')
const form = document.getElementById('form')
const input = document.getElementById('input')

/* Define functions */

// Output message caught from the server into the DOM
const output = (message) => {
    // Construct a new element (li)
    const li = document.createElement('li')
    // Add class
    li.className = 'list-group-item'
    // Add message to the li
    li.textContent = `${message.time} from ${message.from}: ${message.message} `
    // Append to the list
    messages.appendChild(li)
    // Scroll messages after appending a new one into the DOM
    window.scrollTo(0, document.body.scrollHeight)
}

// Get user and room from the query string params
const {username, room} = Qs.parse(location.search, {
    // Ignore query prefix to bypass the leading question mark in the URL params
    ignoreQueryPrefix: true
}) 

// Emit the joinRoom event to the server with the username, room object
socket.emit('joinRoom', {username, room})

// Submit form and emit a message to the server
form.addEventListener('submit', (e) => {
    e.preventDefault()
    socket.emit('chatMessage', input.value)
    // Clear fields after emitting the message
    input.value = ''
    // Focues after sending a message
    input.focus()

})

// Catch the message event from the server and output the message into the dom
socket.on('message', (message) => {
    output(message)
})
