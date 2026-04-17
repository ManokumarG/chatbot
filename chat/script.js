async function sendMessage() {
  const input = document.getElementById("input");
  const messages = document.getElementById("messages");

  const text = input.value.trim(); // .trim() prevents sending empty spaces
  if (!text) return;

  // 1. Display user message (Safe from HTML injection)
  const userDiv = document.createElement("p");
  userDiv.innerHTML = `<b>You:</b> ${escapeHTML(text)}`;
  messages.appendChild(userDiv);
  
  input.value = "";

  // 2. Add a temporary "Loading..." indicator
  const loadingId = "loading-" + Date.now();
  messages.innerHTML += `<p id="${loadingId}"><i>Bot is thinking...</i></p>`;
  
  // Auto-scroll to bottom
  messages.scrollTop = messages.scrollHeight;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();

    // 3. Remove loading indicator and show the actual reply
    document.getElementById(loadingId).remove();
    
    const botDiv = document.createElement("p");
    botDiv.innerHTML = `<b>Bot:</b> ${data.reply}`; // Use .innerText if you don't want Markdown/HTML
    messages.appendChild(botDiv);

  } catch (error) {
    document.getElementById(loadingId).innerText = "Bot: Error connecting to server.";
  }

  // Final scroll to bottom
  messages.scrollTop = messages.scrollHeight;
}

// Simple helper to prevent users from "breaking" your site with <script> tags
function escapeHTML(str) {
  const p = document.createElement('p');
  p.textContent = str;
  return p.innerHTML;
}