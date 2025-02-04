/* Client-side script */

// Connecting to the server from the client
const socket = io()

// Get query string params of username and room using 'name' properties
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

// Send the join room event to the server using query string params 
socket.emit('joinRoom', {username, room})

// Get form variables
const messages = document.getElementById('messages')
const form = document.getElementById('form')
const input = document.getElementById('input')


// Send message to the server
form.addEventListener('submit', (e) => {
    e.preventDefault()
    if (input.value) {
        socket.emit('chatMessage', input.value)
        input.value = ''
    }
})

// Catch message from the server and output it into the DOM
socket.on('message', (message) => {
    // Create element
    const li = document.createElement('li')
    // Add class
    li.className = 'list-group-item'
    li.textContent = `${message.time} from ${message.username} : ${message.text}`
    // Append to the DOM
    messages.appendChild(li)
    // Scroll messages after appending one into the DOM
    window.scrollTo(0, document.body.scrollHeight)
})