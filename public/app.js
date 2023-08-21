document.addEventListener("DOMContentLoaded", function () {
  var socket = io();
  var form = document.querySelector("form");
  var m = document.getElementById("m");
  var messages = document.getElementById("messages");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    socket.emit("chat message", m.value);
    m.value = "";
  });

  socket.on("chat message", function (msg) {
    var li = document.createElement("li");
    li.textContent = msg;
    messages.appendChild(li);
  });
});