// index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

/* --------------------------- Helper: Safe JSON Parsing --------------------------- */
function safeParseJSON(text) {
  try {
    const match = text.match(/\{[\s\S]*\}/); // Extract JSON if surrounded by text
    if (match) return JSON.parse(match[0]);
  } catch (err) {
    console.error("❌ JSON parse error:", err);
  }
  return null;
}

/* --------------------------- Generate Quiz Endpoint --------------------------- */
app.get("/quiz", async (req, res) => {
  const topic = req.query.topic || "General Knowledge";

  const prompt = `
Generate exactly 5 multiple-choice questions on the topic "${topic}".
Return only valid JSON in this structure (no extra text):
{
  "questions": [
    {
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "answer": "B"
    }
  ]
}`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const data = safeParseJSON(text);

    if (!data || !data.questions) {
      console.error("⚠️ Invalid JSON returned by Gemini:", text);
      return res.status(500).json({ error: "AI returned invalid JSON." });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("❌ Quiz generation error:", err);
    res.status(500).json({ error: "Failed to generate quiz." });
  }
});

/* --------------------------- Generate Feedback Endpoint --------------------------- */
app.post("/feedback", async (req, res) => {
  const { topic, score, total } = req.body;

  const prompt = `
The user scored ${score}/${total} on a quiz about "${topic}".
Write a short, personalized feedback message (2-3 friendly sentences).`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ feedback: text });
  } catch (err) {
    console.error("❌ Feedback generation error:", err);
    res.status(500).json({ error: "Failed to generate feedback." });
  }
});

/* --------------------------- Server Config --------------------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running at: http://localhost:${PORT}`)
);
