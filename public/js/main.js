
const chatForm = document.querySelector('#chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.querySelector('#room-name');
const userList = document.querySelector('#users');


// get username and room from URL
const { username, room, img } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

// join chatroom
socket.emit('joinRoom', { username, room, img });

// get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

socket.on('message', message => {

    console.log(message); // refers to welcome message to chatcord in server.js file (socket.emit)
    outputMessage(message);
    // scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;

});

// Create a variable to track typing status
let isTyping = false;
let typingTimeout = null;

// Add event listeners for input events
chatForm.addEventListener('input', () => {
    if (!isTyping) {
        socket.emit('typing', true);
        isTyping = true;
    }

    // Clear the previous timeout
    clearTimeout(typingTimeout);

    // Set a new timeout to show the "is typing" message after 400 milliseconds
    typingTimeout = setTimeout(() => {
        if (isTyping) {
            socket.emit('typing', false);
            isTyping = false;
        }
    }, 4000);

});


// message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get message text
    const msg = document.querySelector('#msg').value;

    //emit message to server
    socket.emit('chatMessage', msg) // get the msg from the text input (enter message) and log it on the client side

    // Stop typing when form is submitted
    if (isTyping) {
        socket.emit('typing', false);
        isTyping = false;
    }

    // Clear the typing timeout
    clearTimeout(typingTimeout);

    // clear input
    document.querySelector('#msg').value = '';
    document.querySelector('#msg').focus();
});

// output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
    <img src="${message.img}"  width="30" height="30">
    <p class="meta"> ${message.username} <span> ${message.time}</span></p>
    <p class="text">
    ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// add users to DOM
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}


socket.on('isTyping', (username) => {
    const isTypingElement = document.querySelector('#isTyping');
    isTypingElement.textContent = username ? `${username} is typing...` : '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
});


// Get a reference to the radio buttons
const radioButtons = document.querySelectorAll('input[type="radio"]');
console.log(radioButtons);
// Attach event listener to each radio button
radioButtons.forEach(radioButton => {
    radioButton.addEventListener('change', () => {
        // Check if the radio button is selected
        if (radioButton.checked) {
            console.log('Radio button selected');
            // Retrieve the value of the selected radio button
            const img = radioButton.value;
            console.log(img);
        }
    });
});
