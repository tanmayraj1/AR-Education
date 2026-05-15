import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/predict-colleges", async (req, res) => {
    try {
      const { rank, category, state, course, examTarget, score } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
         return res.status(500).json({ error: "Gemini API key is not configured on the server." });
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `You are an expert ${examTarget} admission counsellor in India.
A student has provided the following details:
- Exam: ${examTarget}
- Course target: ${course}
- Rank: ${rank}
- Score: ${score || 'Not provided'}
- Category: ${category}
- Domicile State: ${state}

Based on historical cutoff trends (assume 2023/2024 data approximate) and the student's details, predict the top 5 to 7 colleges they have a chance of getting into. Also evaluate their chance ('High', 'Medium', or 'Low') for each. Be realistic and precise. Provide the response as a JSON array of objects, with each object having exactly these keys: "collegeName", "state", "course", "closingRank" (a realistic number, approx expected cutoff rank), "chance" (High/Medium/Low). Don't include any extra text, only the JSON.

Example output:
[
  { "collegeName": "Example College", "state": "Delhi", "course": "B.Tech CS", "closingRank": 12000, "chance": "High" }
]`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response.text || "";
      const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
      
      let predictions = [];
      if (jsonMatch) {
        predictions = JSON.parse(jsonMatch[0]);
      } else {
        predictions = JSON.parse(text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, ''));
      }

      const processed = predictions.map((c: any) => {
         const r = Number(rank);
         const diff = Number(c.closingRank) - r;
         let scoreValue = diff;
         
         let chanceColor = 'bg-error-container/20 text-error';
         if (c.chance === 'High' || c.chance === 'Very High') chanceColor = 'bg-emerald-100 text-emerald-700';
         else if (c.chance === 'Medium') chanceColor = 'bg-guidance-gold/20 text-guidance-gold-container';
         
         return {
           ...c,
           chanceColor,
           scoreValue,
           id: Math.random().toString(36).substring(7)
         };
      });

      res.json({ predictions: processed });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate predictions" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:\${PORT}`);
  });
}

startServer();
