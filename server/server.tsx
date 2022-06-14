const path = require('path')
const cors = require('cors')
const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server,{
  cors:{
    origin: '*',
    methods: ['GET','POST']
  }
});

app.use(cors(),express.static(path.join(__dirname,"..","build")))

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(8000,()=>{
  console.log('listening on port 8000');
});