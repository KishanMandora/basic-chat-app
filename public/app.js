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
const membersCount = document.getElementById("members-count");
const membersList = document.getElementById("members-list");

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

const commands = ["/help", "/random", "/clear", "/rem", "/calc"];

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
const remObj = {};

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

  socket.emit("register user", username);

  modal.style.display = "none";
};

guestSignInBtn.addEventListener("click", function () {
  username =
    devilFruits[Math.floor(Math.random() * 10)] +
    " " +
    onePieceCharacters[Math.floor(Math.random() * 10)];

  chatUserTitle.innerText = username;
  socket.emit("register user", username);

  modal.style.display = "none";
});

closeHelpModalBtn.onclick = function () {
  const helpModal = document.getElementById("help-modal");
  helpModal.style.display = "none";
};

function runHelpCommand() {
  const helpModal = document.getElementById("help-modal");
  helpModal.style.display = "block";
}

function addDetailsToMessage(username, message) {
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
  chatMessage.textContent = message;
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

function runRandomCommand() {
  const message = `Here's a random number: ${Math.floor(
    Math.random() * 100000
  )}`;

  addDetailsToMessage(username, message);
}

function runClearCommand() {
  messages.innerHTML = "";
}

function runRemCommand(value) {
  const splitValue = value.trim().split(" ");
  console.log(splitValue);

  if (splitValue.length <= 1) {
    console.log("No key provided");
    const li = document.createElement("li");
    li.innerText = "Please provide a name and value";
    li.classList.add("action-message");
    messages.appendChild(li);
    return;
  } else if (splitValue.length <= 2 && !remObj[splitValue[1]]) {
    const li = document.createElement("li");
    li.innerText = "Please provide a Value";
    li.classList.add("action-message");
    messages.appendChild(li);
    return;
  } else if (remObj[splitValue[1]]) {
    addDetailsToMessage(username, remObj[splitValue[1]]);
    return;
  }

  remObj[splitValue[1]] = splitValue[2];
  const li = document.createElement("li");
  li.innerText = `${splitValue[1]} has been set to ${splitValue[2]}`;
  li.classList.add("action-message");
  messages.appendChild(li);
  console.log(remObj);
}

function runCalcCommand(value) {
  const calcStr = value.substring(6);
  const calculatedValue = eval(calcStr);
  const message = `The answer is ${calculatedValue}`;
  addDetailsToMessage(username, message);
  return;
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  if (!m.value.trim()) return;

  const inputMsg = m.value.split(" ");
  const isCommand = commands.includes(inputMsg[0]);

  if (isCommand) {
    switch (inputMsg[0]) {
      case "/help":
        runHelpCommand();
        m.value = "";
        return;
      case "/random":
        runRandomCommand();
        m.value = "";
        return;
      case "/clear":
        runClearCommand();
        m.value = "";
        return;
      case "/rem":
        runRemCommand(m.value);
        m.value = "";
        return;
      case "/calc":
        runCalcCommand(m.value);
        m.value = "";
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

socket.on("active users", function (users) {
  membersCount.innerText = users.length;

  console.log("list is", membersList.children);

  while (membersList.firstChild) {
    membersList.removeChild(membersList.firstChild);
  }

  users.forEach((user) => {
    const member = document.createElement("li");
    const memberName = document.createElement("span");
    const memberInitials = document.createElement("div");
    const initialsText = document.createElement("span");
    memberName.innerText = user;
    const splitUsername = user.split(" ");
    initialsText.innerText =
      splitUsername.length > 1
        ? splitUsername[0][0] + splitUsername[1][0]
        : splitUsername[0][0];

    member.classList.add("member");
    memberName.classList.add("member-name");
    memberInitials.classList.add("member-initials");
    initialsText.classList.add("initials-text");

    member.appendChild(memberName);
    member.appendChild(memberInitials);
    memberInitials.appendChild(initialsText);

    membersList.appendChild(member);
  });
});
