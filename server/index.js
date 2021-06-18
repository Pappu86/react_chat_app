const express = require('express');
const http= require('http');
const socketIo= require('socket.io');
let cors = require('cors');
const {addUser, removeUser, getUserById}=require('../users');

const port = 4000;
const app = express();
app.use(cors());

const httpServer= http.createServer(app);
const io = socketIo(httpServer, { cors: {origin: '*'}});

app.set('view engine', "ejs");

io.on('connection', socket => {
  console.log('a user connected', socket.id);

  socket.on("join", (data, callback)=>{
    // console.log("Join data: ", data);
    const {name, room}=data;
    const {error, user}=addUser({id:socket.id, name, room});

    socket.join(room);
    socket.emit("message", {user:"system", text:`Welcome ${name} to ${room}.`});
    socket.broadcast.to(room).emit("message", {user:"system", text:`${name} just joined ${room}.`});

    if(error){
      callback(error);
    }
    callback();
  });

  socket.on("message", (message)=>{
    console.log("message: ", message);
    const user=getUserById(socket.id);

    console.log("user: ", user);

    io.to(user.room).emit("message", {
      user:user.name, 
      text:message
    });
    console.log("io: ", users);
  });

  socket.on('disconnect',()=>{
    console.log('user disconnected', socket.id);
    const user=removeUser(socket.id);

    if(user){      
      io.to(user.room).emit("message", {
        user:"system", 
        text:`${user.name} just left ${user.room}.`
      });
    }
  });

});

httpServer.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})