const socket = io();

const userName = document.getElementById("username");
const chatUserTitle = document.getElementById("chat-title");
const emojiModeBtn = document.getElementById("emoji-mode");
const textModeBtn = document.getElementById("text-mode");
const modal = document.getElementById("signinModal");
const closeModalBtn = document.getElementById("sign-in-btn");
const closeHelpModalBtn = document.getElementById("close-help");
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

const commands = ["/help", "/random", "/clear"];

const emojis = {
  react: "⚛️",
  hey: "👋",
  fire: "🔥",
  woah: "😮",
  lol: "😂",
  like: "👍",
  love: "💛",
  congratulations: "🎉",
};

let username;
const userId = crypto.randomUUID();
let chatMode = "emoji";

emojiModeBtn.addEventListener("click", function () {
  if (chatMode === "emoji") return;

  emojiModeBtn.classList.add("active-switch");
  textModeBtn.classList.remove("active-switch");
  chatMode = "emoji";
});

textModeBtn.addEventListener("click", function () {
  if (chatMode === "text") return;

  textModeBtn.classList.add("active-switch");
  emojiModeBtn.classList.remove("active-switch");
  chatMode = "text";
});

closeModalBtn.onclick = function () {
  if (!userName.value.trim()) return;

  username = userName.value;
  chatUserTitle.innerText = userName.value;

  modal.style.display = "none";
};

closeHelpModalBtn.onclick = function () {
  const helpModal = document.getElementById("help-modal");
  helpModal.style.display = "none";
};

guestSignInBtn.addEventListener("click", function () {
  username =
    devilFruits[Math.floor(Math.random() * 10)] +
    " " +
    onePieceCharacters[Math.floor(Math.random() * 10)];

  chatUserTitle.innerText = username;

  modal.style.display = "none";
});

function runHelpCommand() {
  const helpModal = document.getElementById("help-modal");
  helpModal.style.display = "block";
}

function runRandomCommand() {
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
  chatMessage.textContent = `Here's a random number: ${Math.floor(
    Math.random() * 100000
  )}`;
  ppInitials.classList.add("pp-initials");
  chatPp.classList.add("chat-pp", "margin-left");
  chatMsg.classList.add("chat-msg", "msg-primary", "border-radius-right0");
  chatName.classList.add("chat-name");
  chatMessage.classList.add("chat-message");
  li.classList.add("message-container-reverse");

  chatPp.appendChild(ppInitials);
  chatMsg.appendChild(chatName);
  chatMsg.appendChild(chatMessage);
  li.appendChild(chatPp);
  li.appendChild(chatMsg);
  messages.appendChild(li);
  li.scrollIntoView();
}

function runClearCommand() {
  messages.innerHTML = "";
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  if (!m.value.trim()) return;

  const inputMsg = m.value.split(" ");
  const isCommand = commands.includes(inputMsg[0]);

  if (isCommand) {
    switch (inputMsg[0]) {
      case "/help":
        m.value = "";
        runHelpCommand();
        return;
      case "/random":
        m.value = "";
        runRandomCommand();
        return;
      case "/clear":
        m.value = "";
        runClearCommand();
        return;
      default:
        break;
    }
  }

  let sendersMsg;

  if (chatMode === "emoji") {
    const msg = inputMsg.map((word) => {
      const lowercaseWord = word.toLowerCase();

      if (lowercaseWord in emojis) {
        return emojis[lowercaseWord];
      }
      return word;
    });

    sendersMsg = msg.join(" ");
  } else {
    sendersMsg = m.value;
  }

  socket.emit("chat message", {
    user: username,
    message: sendersMsg,
    id: userId,
  });
  m.value = "";
});

socket.on("chat message", function (data) {
  const li = document.createElement("li");
  const chatPp = document.createElement("div");
  const ppInitials = document.createElement("span");
  const chatMsg = document.createElement("div");
  const chatName = document.createElement("span");
  const chatMessage = document.createElement("p");

  const splitUsername = data.user.split(" ");

  const isSameUser = data.id === userId;

  ppInitials.textContent =
    splitUsername.length > 1
      ? splitUsername[0][0] + splitUsername[1][0]
      : splitUsername[0][0];

  chatName.textContent = data.user;
  chatMessage.textContent = data.message;
  ppInitials.classList.add("pp-initials");
  chatPp.classList.add("chat-pp", isSameUser ? "margin-left" : "margin-right");
  chatMsg.classList.add(
    "chat-msg",
    isSameUser ? "msg-primary" : "msg-secondary",
    isSameUser ? "border-radius-right0" : "border-radius-left0"
  );
  chatName.classList.add("chat-name");
  chatMessage.classList.add("chat-message");
  li.classList.add(
    isSameUser ? "message-container-reverse" : "message-container"
  );

  chatPp.appendChild(ppInitials);
  chatMsg.appendChild(chatName);
  chatMsg.appendChild(chatMessage);
  li.appendChild(chatPp);
  li.appendChild(chatMsg);
  messages.appendChild(li);
  li.scrollIntoView();
});
