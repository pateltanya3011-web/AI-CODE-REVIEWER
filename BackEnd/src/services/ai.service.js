// npm install groq-sdk
const Groq = require("groq-sdk");
const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function generateContent(prompt) {
  try {
    const result = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are a helpful code reviewer. Check the code and suggest improvements. Explain things in simple words." },
        { role: "user", content: prompt }
      ],
    });
    return result.choices[0].message.content;
  } catch (error) {
    console.error("Groq API error:", error.message);
    return "AI is unavailable right now. Please try again later.";
  }
}

module.exports = generateContent;