document.addEventListener("DOMContentLoaded", function () {
  const socket = io();
  const form = document.querySelector("form");
  const m = document.getElementById("m");
  const messages = document.getElementById("messages");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!m.value.trim()) return;
    socket.emit("chat message", m.value);
    m.value = "";
  });

  socket.on("chat message", function (msg) {
    const li = document.createElement("li");
    const chatPp = document.createElement("div");
    const ppInitials = document.createElement("span");
    const chatMsg = document.createElement("div");
    const chatName = document.createElement("span");
    const chatMessage = document.createElement("p");

    ppInitials.textContent = "JS";
    chatName.textContent = "Jinbe";
    chatMessage.textContent = msg;
    ppInitials.classList.add("pp-initials");
    chatPp.classList.add("chat-pp");
    chatMsg.classList.add("chat-msg", "msg-secondary");
    chatName.classList.add("chat-name");
    chatMessage.classList.add("chat-message");
    li.classList.add("message-container");

    chatPp.appendChild(ppInitials);
    chatMsg.appendChild(chatName);
    chatMsg.appendChild(chatMessage);
    li.appendChild(chatPp);
    li.appendChild(chatMsg);
    messages.appendChild(li);
  });
});

// devil fruit names : Ice, Magma, Flame, Smoke, Sand,
