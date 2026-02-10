const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const socketManager = require('./socket');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  pingTimeout: 30000,
  pingInterval: 5000
});

socketManager(io);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});