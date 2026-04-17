// 🔑 YOUR API KEY
const API_KEY = "AQ.Ab8RN6I8mg-rYnT_sG-8loJw_2a6dMqz5LVRRJfXha1jA2eSow";

function sendMessage() {
  const input = document.getElementById("user-input");
  const text = input.value.trim();

  if (text === "") return;

  addMessage(text, "user");
  input.value = "";

  const typingId = addMessage("Typing...", "bot", true);

  getBotReply(text).then((reply) => {
    removeMessage(typingId);
    // Clean the reply before adding it
    const cleanReply = reply.replace(/\*\*/g, ""); 
    addMessage(cleanReply, "bot");
  });
}

function addMessage(text, type, isTyping = false) {
  const chatBox = document.getElementById("chat-box");
  const msg = document.createElement("div");
  
  msg.classList.add("message", type);
  
  // Use innerHTML to support clean line breaks and formatting
  msg.innerHTML = text.replace(/\n/g, "<br>");

  if (isTyping) {
    msg.id = "typing-message";
  }

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;

  return msg.id;
}

function removeMessage(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

async function getBotReply(input) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: input + " (Please do not use markdown bolding in your response)" }] }]
        }),
      }
    );

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return reply || "No response from AI";

  } catch (error) {
    console.error(error);
    return "Error connecting to Gemini API";
  }
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});
function addMessage(text, type, isTyping = false) {
  const chatBox = document.getElementById("chat-box");
  const msg = document.createElement("div");
  
  msg.classList.add("message", type);
  
  // Clean line breaks and formatting
  msg.innerHTML = text.replace(/\n/g, "<br>");

  if (isTyping) {
    msg.id = "typing-message";
  }

  chatBox.appendChild(msg);

  // Auto-scroll to bottom after a short delay to ensure rendering is complete
  setTimeout(() => {
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 10);

  return msg.id;
}