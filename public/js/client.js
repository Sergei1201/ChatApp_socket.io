/* Client-side script */
const socket = io()

/* Get form fields to the javascript variables */
const messages = document.getElementById('messages')
const form = document.getElementById('form')
const input = document.getElementById('input')
const chatUsers = document.getElementById('chat-users')
const roomName = document.querySelector('.room-name')

/* Parse the query string from the URL params to get username and room (by their names in the index.html file) */
const {username, room} = Qs.parse(location.search, {

    // In order to escape leading question mark in the query string of the URL params ignore the query prefix (? mark)
    ignoreQueryPrefix: true
})

// Emit joinRoom event to the server
socket.emit('joinRoom', {username, room})

/* Function definitions */

// Output message into the DOM
const outputMessage = (msg) => {
    
    // Construct a DOM element
    const li = document.createElement('li')
    
    // Add class
    li.className = 'list-group-items'

    // Put a message to the li
    li.textContent = `${msg.time} from ${msg.from}: ${msg.message}`

    // Append the element into the DOM
    messages.appendChild(li)

    // Scroll messages after outputting into the DOM
    window.scrollTo(0, document.body.scrollHeight)
}

// Output room users
const outputUsers = (users) => {

    // Clear the list of the users before outputting them (upgrade users in the DOM)
    while (chatUsers.firstChild) {
        chatUsers.removeChild(chatUsers.firstChild)
    }

    // Loop through the array of users and output them into the DOM
    users.forEach(user => {

        // Create a new DOM element
        const li = document.createElement('li')
        
        // Add a class
        li.className = 'list-group-item'

        // Add textcontent
        li.textContent = user.username

        // Append into the DOM
        chatUsers.appendChild(li)

    })
}

// Output room
const outputRoom = (room) => {
    roomName.innerHTML = room
}

/* Listen for a message from the server */
socket.on('message', (message) => {
    outputMessage(message)
})

// Listen for roomUsers event from the server and output info into the DOM
socket.on('roomUsers', ({users, room}) => {

    console.log(users, room)

    // Output users - array of objects
    outputUsers(users)

    // Output room
    outputRoom(room)
})

/* Submit form */
form.addEventListener('submit', (e) => {
    e.preventDefault()
    // Emit message to the server if there's one
    if (input.value) {
        socket.emit('chatMessage', input.value)
        // Clear fields
        input.value = ''
        // Focues
        input.focus()
    }
})