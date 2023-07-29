const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin , getCurrentUser, userLeave,getRoomUsers} = require('./utils/users');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = ' Bot';
const botImg = 'http://localhost:3000/Avatar/bot.jpg';

//Run when client connects
io.on('connection' , socket =>{

    socket.on('joinRoom',({username, room, img})=>{
        const user = userJoin(socket.id, username, room, img);
       
        socket.join(user.room);

        //welcome current user 
        socket.emit('message', formatMessage(botName , 'Welcome to Chat room!', botImg)) ;

        //Broadcast when a user connects
        socket.broadcast
        .to(user.room)
        .emit('message' ,formatMessage(botName, `${user.username} has joined the chat`, botImg));

        //Send users and room info
        io.to(user.room).emit('roomUsers' , {
            room: user.room,
            users: getRoomUsers(user.room)
        });

    })

        //Listen for chat message
        socket.on('chatMessage' , (msg) =>{

            const user = getCurrentUser(socket.id);

           io.to(user.room).emit('message', formatMessage(user.username , msg, user.img));
        });
        // Listen for typing event
            let isUserTyping = false;

            // Listen for typing event
            socket.on('typing', (typingStatus) => {
                const user = getCurrentUser(socket.id);
                if (user) {
                if (typingStatus && !isUserTyping) {
                    // User started typing
                    isUserTyping = true;
                    socket.to(user.room).emit('isTyping', user.username);
                } else if (!typingStatus && isUserTyping) {
                    // User stopped typing
                    isUserTyping = false;
                    socket.to(user.room).emit('isTyping', '');
                }
                }
            });
  

        //Run when client disconnects
        socket.on('disconnect' , ()=>{
            const user =userLeave(socket.id);

            if(user){
                io.to(user.room).emit('message' , formatMessage(botName , `${user.username} has left the chat`, botImg));

                 //Send users and room info
                io.to(user.room).emit('roomUsers' , {
                    room: user.room,
                    users: getRoomUsers(user.room)
                });
            }
        });
})

const PORT = 3000;

server.listen(PORT , ()=> console.log(`Server running on port ${PORT}`));
