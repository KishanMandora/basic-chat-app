const socket = io();

const userName = document.getElementById("username");
const chatUserTitle = document.getElementById("chat-title");
const modal = document.getElementById("signinModal");
const closeModalBtn = document.getElementById("sign-in-btn");
const guestSignInBtn = document.getElementById("guest-sign-in");
const form = document.querySelector("form");
const m = document.getElementById("m");
const messages = document.getElementById("messages");

const devilFruits = [
  "Ice",
  "Magma",
  "Flame",
  "Smoke",
  "Sand",
  "Rubber",
  "Darkness",
  "Gravity",
  "Thunder",
  "Quake",
];
const onePieceCharacters = [
  "Luffy",
  "Zoro",
  "Nami",
  "Usopp",
  "Sanji",
  "Chopper",
  "Robin",
  "Franky",
  "Brook",
  "Jinbe",
];

let username;

closeModalBtn.onclick = function () {
  if (!userName.value.trim()) return;

  const chatTitle = document.createElement("h1");
  chatTitle.textContent = userName.value;
  username = userName.value;
  chatUserTitle.appendChild(chatTitle);

  console.log("clicked", userName.value);
  modal.style.display = "none";
};

form.addEventListener("submit", function (event) {
  event.preventDefault();
  if (!m.value.trim()) return;
  socket.emit("chat message", m.value);
  m.value = "";
});

guestSignInBtn.addEventListener("click", function () {
  const chatTitle = document.createElement("h1");
  username =
    devilFruits[Math.floor(Math.random() * 10)] +
    " " +
    onePieceCharacters[Math.floor(Math.random() * 10)];
  chatTitle.textContent = username;
  chatUserTitle.appendChild(chatTitle);

  modal.style.display = "none";
});

socket.on("chat message", function (msg) {
  const li = document.createElement("li");
  const chatPp = document.createElement("div");
  const ppInitials = document.createElement("span");
  const chatMsg = document.createElement("div");
  const chatName = document.createElement("span");
  const chatMessage = document.createElement("p");

  const splitUsername = username.split(" ");

  ppInitials.textContent =
    splitUsername.length > 1
      ? splitUsername[0][0] + splitUsername[1][0]
      : splitUsername[0][0];

  chatName.textContent = username;
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
