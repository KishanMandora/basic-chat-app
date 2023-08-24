const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "/index.html"));
});

let activeUsersObj = {};

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("register user", (username) => {
    activeUsersObj[socket.id] = username; // Storing with socket id as key
    io.emit("active users", Object.values(activeUsersObj)); // Send list of usernames
  });

  socket.on("chat message", (data) => {
    io.emit("chat message", {
      user: data.user,
      message: data.message,
      id: data.id,
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    delete activeUsersObj[socket.id];
    io.emit("active users", Object.values(activeUsersObj));
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
