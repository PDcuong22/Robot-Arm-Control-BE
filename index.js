const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bodyParser = require("body-parser");
const db = require("./configs/db");
const recordRouter =  require("./routers/recordRouter");

db.connectDB();

const app = express();
const server = http.createServer(app);

let statusESP = false;
let socketIDESP = null;
let servoCurrent = [];

// Cấu hình CORS cho express
app.use(cors({
  origin: 'http://localhost:5173', // Chỉ cho phép từ frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/api/record", recordRouter);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Cho phép frontend truy cập
  },
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  if(socket.id !== socketIDESP){
    socket.emit('ESP-status', {"status": statusESP, "currentServos": servoCurrent});
  }

  socket.on('servo-control', (data) => {
    // console.log(data);
    if(statusESP){
      const {servoId, angle} = data;
      servoCurrent[servoId] = angle;
      socket.broadcast.emit('control', data);  
    }
  });

  socket.on('ESP-reply', (data) => {
    // console.log('Received from ESP: ', data);
    const {currServoValue} = data;
    servoCurrent = currServoValue;
    statusESP = true;
    socketIDESP = socket.id;
    socket.broadcast.emit('ESP-status', {"status": statusESP, "currentServos": servoCurrent});
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    if(socket.id === socketIDESP){
      statusESP = false;
      socketIDESP = null;
      socket.broadcast.emit('ESP-status', statusESP);
    }
  });

});

server.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
