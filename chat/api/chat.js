export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message } = req.body;
  
  // Safety check for empty messages
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // Use the environment variable for security
  const API_KEY = process.env.GEMINI_API_KEY;

  try {
    const response = await fetch(
       `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: message }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          }
        })
      }
    );

    const data = await response.json();

    // Check if the API returned an error (like invalid key or quota)
    if (data.error) {
      console.error("Gemini API Error:", data.error);
      return res.status(data.error.code || 500).json({ error: data.error.message });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I couldn't generate a response. Please try again.";

    res.status(200).json({ reply });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ reply: "Internal server error" });
  }
}