document.addEventListener("DOMContentLoaded", function () {
  const socket = io();
  const form = document.querySelector("form");
  const m = document.getElementById("m");
  const messages = document.getElementById("messages");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    socket.emit("chat message", m.value);
    m.value = "";
  });

  socket.on("chat message", function (msg) {
    const li = document.createElement("li");
    li.textContent = msg;
    messages.appendChild(li);
  });
});
