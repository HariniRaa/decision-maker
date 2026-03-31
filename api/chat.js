const Anthropic = require("@anthropic-ai/sdk");
const fs = require("fs");
const path = require("path");

const systemPrompt = fs.readFileSync(
  path.join(__dirname, "..", "system-prompt.txt"),
  "utf8"
);

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages,
    });

    const content = response.content[0].text;
    res.json({ role: "assistant", content });
  } catch (err) {
    console.error("API error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
