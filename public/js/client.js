/* Client-side script */

// Connect the client side to the socket.io
const socket = io()

// Get form fields
const messages = document.getElementById('messages')
const form = document.getElementById('form')
const input = document.getElementById('input')

// Parse query string params from URL to get usrename and room
const {username, room} = Qs.parse(location.search, {
    // Bypass the leading question mark in the query string
    ignoreQueryPrefix: true
        }
)

// Output message to the DOM
const output = (data) => {
    // Create a new element
    const li = document.createElement('li')
    // Add class
    li.className = 'list-group-item'
    // Put data inside the li
    li.textContent = `${data.time} from ${data.username} : ${data.message}` 
    // Append element into the DOM
    messages.appendChild(li)
    // Scroll after appending a new element
    window.scrollTo(0, document.body.scrollHeight)
}

// Emit public chatMessage event to the server after the form is submitted
form.addEventListener('submit', (e) => {
    e.preventDefault()
    if (input.value) {
        socket.emit('chatMessage', input.value)
        input.value = ''
        input.focus()
    }
})

// Catch message event from the server
socket.on('message', (data) => {
    output(data)
})

// Emit joinRoom event to the server to join a user to a chatroom
socket.emit('joinRoom', {username, room})
