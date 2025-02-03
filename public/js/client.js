const socket = io()

// Get input fields from the form
const messages = document.getElementById('messages')
const form = document.getElementById('form')
const input = document.getElementById('input')

// Send a message from the client to the server when the form has been submitted
form.addEventListener('submit', (e) => {
    e.preventDefault()
    // Send message if the input is not empty
    if (input.value) {
        socket.emit('chatMessage', input.value)
        // Clear the fields after the message is sent
        input.value = ''
    }
})

// Use a query string package to parse a string from the URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

// Send the join room event to the server
socket.emit('joinRoom', { username, room })

// Listen for a message from the server and output it into the DOM
socket.on('message', (output) => {
    // Construct a new element
    const li = document.createElement('li')
    // Add a new class to the element
    li.className = "group-list-item"
    li.innerHTML = output
    // Append to the DOM
    messages.appendChild(li)
})