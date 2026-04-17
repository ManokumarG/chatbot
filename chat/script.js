async function sendMessage() {
  const input = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");
  const text = input.value.trim();

  if (!text) return;

  // 1. Add User Message
  const userDiv = document.createElement("div");
  userDiv.className = "message user";
  userDiv.textContent = text;
  chatBox.appendChild(userDiv);

  input.value = "";
  
  // 2. Add Loading State
  const loadingId = "loading-" + Date.now();
  const botDiv = document.createElement("div");
  botDiv.className = "message bot";
  botDiv.id = loadingId;
  botDiv.innerHTML = "<i>Thinking...</i>";
  chatBox.appendChild(botDiv);

  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();
    
    // 3. Replace Loading with actual reply
    const loadingElem = document.getElementById(loadingId);
    if (data.reply) {
      loadingElem.innerText = data.reply;
    } else {
      loadingElem.innerText = "Error: " + (data.error || "Unknown error");
    }

  } catch (error) {
    document.getElementById(loadingId).innerText = "Error connecting to server.";
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}

// Support for Enter key
document.getElementById("user-input").addEventListener("keypress", function(e) {
  if (e.key === "Enter") sendMessage();
});