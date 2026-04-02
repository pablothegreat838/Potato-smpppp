// USERNAME SYSTEM
function setName() {
  let name = document.getElementById("username").value;
  let users = JSON.parse(localStorage.getItem("users") || "[]");

  if (users.includes(name)) {
    alert("Sorry but this username is already taken");
    return;
  }

  users.push(name);
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("username", name);
  alert("Username set!");
}

// CHAT
function sendMessage() {
  let msg = document.getElementById("message").value;
  let user = localStorage.getItem("username");

  if (!user) return alert("Set username!");

  push(ref(db, "chat"), {
    user: user,
    text: msg
  });
}

function loadChat() {
  let box = document.getElementById("chatBox");
  if (!box) return;

  onValue(ref(db, "chat"), (snapshot) => {
    let data = snapshot.val();
    box.innerHTML = "";

    for (let id in data) {
      let m = data[id];
      box.innerHTML += `<div><b>${m.user}:</b> ${m.text}</div>`;
    }
  });
}

// NEWS
function addNews() {
  let text = document.getElementById("newsInput").value;
  push(ref(db, "news"), { text });
}

function loadNews() {
  let container = document.getElementById("news") || document.getElementById("newsList");
  if (!container) return;

  onValue(ref(db, "news"), (snapshot) => {
    let data = snapshot.val();
    container.innerHTML = "";

    for (let id in data) {
      let n = data[id];

      container.innerHTML += `
        <div>
          ${n.text}
          ${document.getElementById("newsList") ? `
            <button onclick="deleteNews('${id}')">❌</button>
            <button onclick="editNews('${id}')">✏️</button>
          ` : ""}
        </div>
      `;
    }
  });
}

function deleteNews(id) {
  remove(ref(db, "news/" + id));
}

function editNews(id) {
  let newText = prompt("Edit news:");
  if (!newText) return;
  update(ref(db, "news/" + id), { text: newText });
}

// RULES
function saveRules() {
  let text = document.getElementById("rulesInput").value;
  set(ref(db, "rules"), { text });
}

function loadRules() {
  onValue(ref(db, "rules"), (snap) => {
    let data = snap.val();
    if (!data) return;

    let box = document.getElementById("rulesText");
    let input = document.getElementById("rulesInput");

    if (box) box.innerText = data.text;
    if (input) input.value = data.text;
  });
}

// STAFF LOGIN
function login() {
  let pass = document.getElementById("password").value;

  if (pass === "0923") {
    document.getElementById("login").style.display = "none";
    document.getElementById("panel").style.display = "block";
  } else {
    alert("Wrong password");
  }
}

// LOADERS
loadChat();
loadNews();
loadRules();