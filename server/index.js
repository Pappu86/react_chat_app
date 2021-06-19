const express = require('express');
const http= require('http');
const socketIo= require('socket.io');
let cors = require('cors');
const {addUser, removeUser, getUserById, getRoomUsers}=require('../users');

const port = 4000;
const app = express();
app.use(cors());

const httpServer= http.createServer(app);
const io = socketIo(httpServer, { cors: {origin: '*'}});

app.set('view engine', "ejs");

io.on('connection', socket => {
  console.log('a user connected', socket.id);

  socket.on("join", (data, callback)=>{
    const {name, room}=data;
    const {error, user}=addUser({id:socket.id, name, room});

    socket.join(room);
    socket.emit("message", {user:"system", text:`Welcome ${name} to ${room}.`});
    socket.broadcast.to(room).emit("message", {user:"system", text:`${name} just joined ${room}.`});

    const roomUsers=getRoomUsers(room);
    io.sockets.to(room).emit("userList", { roomUsers });

    if(error){
      callback(error);
    }
    callback();
  });

  socket.on("message", (message)=>{
    const user=getUserById(socket.id);

    if(user){     
      io.sockets.emit("message", {
        user:user.name, 
        text:message
      });      
    }
  });

  socket.on('disconnect',()=>{
    console.log('user disconnected', socket.id);
    const user=removeUser(socket.id);

    if(user){      
      io.sockets.emit("message", {
        user:"system", 
        text:`${user.name} just left ${user.room}.`
      });

      const roomUsers=getRoomUsers(user.room);
      io.sockets.to(user.room).emit("userList", { roomUsers });
    }
  });

});

httpServer.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})