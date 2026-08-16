import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

let mongoClient: MongoClient | null = null;

async function getMongoDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;
  try {
    if (!mongoClient) {
      mongoClient = new MongoClient(uri);
      await mongoClient.connect();
      console.log("Connected successfully to MongoDB Atlas database");
    }
    return mongoClient.db(process.env.MONGODB_DB_NAME || "bhavani_law_firm");
  } catch (err) {
    console.error("MongoDB Atlas connection error:", err);
    return null;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser with 10mb limit for PDF order copies & profile photos
  app.use(express.json({ limit: "10mb" }));

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      firm: "Bhavani Singh & Associates",
      mongodbConfigured: Boolean(process.env.MONGODB_URI)
    });
  });

  // MongoDB Status Endpoint
  app.get("/api/mongodb/status", async (_req, res) => {
    const db = await getMongoDB();
    return res.json({
      configured: Boolean(process.env.MONGODB_URI),
      connected: Boolean(db),
      databaseName: process.env.MONGODB_DB_NAME || "bhavani_law_firm"
    });
  });

  // GET Cases from MongoDB Atlas
  app.get("/api/cases", async (_req, res) => {
    try {
      const db = await getMongoDB();
      if (!db) {
        return res.json({ success: false, source: "none", cases: [] });
      }
      const cases = await db.collection("client_cases").find({}).toArray();
      return res.json({ success: true, source: "mongodb", cases });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // POST Upsert Case in MongoDB Atlas
  app.post("/api/cases", async (req, res) => {
    try {
      const db = await getMongoDB();
      const caseData = req.body;
      if (!caseData || !caseData.id) {
        return res.status(400).json({ error: "Case ID is required." });
      }
      if (!db) {
        return res.json({ success: false, message: "MongoDB URI not configured. Saved in local storage." });
      }
      await db.collection("client_cases").updateOne(
        { id: caseData.id },
        { $set: { ...caseData, updatedAt: new Date() } },
        { upsert: true }
      );
      return res.json({ success: true, message: "Case successfully stored in MongoDB Atlas!" });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // POST Sync All Cases to MongoDB Atlas
  app.post("/api/cases/sync-all", async (req, res) => {
    try {
      const db = await getMongoDB();
      const { cases } = req.body;
      if (!Array.isArray(cases)) {
        return res.status(400).json({ error: "Cases array required." });
      }
      if (!db) {
        return res.json({ success: false, message: "MongoDB Atlas connection not active. Data is stored in client browser storage." });
      }
      for (const c of cases) {
        if (c.id) {
          await db.collection("client_cases").updateOne(
            { id: c.id },
            { $set: { ...c, updatedAt: new Date() } },
            { upsert: true }
          );
        }
      }
      return res.json({ success: true, message: `${cases.length} client cases & order copies synced to MongoDB Atlas!` });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // DELETE Case from MongoDB Atlas
  app.delete("/api/cases/:id", async (req, res) => {
    try {
      const db = await getMongoDB();
      const { id } = req.params;
      if (db && id) {
        await db.collection("client_cases").deleteOne({ id });
      }
      return res.json({ success: true, message: "Case deleted." });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // GET Firm Profile from MongoDB Atlas
  app.get("/api/firm-profile", async (_req, res) => {
    try {
      const db = await getMongoDB();
      if (!db) return res.json({ success: false, profile: null });
      const profile = await db.collection("firm_profile").findOne({ _id: "main_profile" as any });
      return res.json({ success: true, profile });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // POST Save Firm Profile to MongoDB Atlas
  app.post("/api/firm-profile", async (req, res) => {
    try {
      const db = await getMongoDB();
      const profileData = req.body;
      if (!db) {
        return res.json({ success: false, message: "MongoDB not configured. Saved in local storage." });
      }
      await db.collection("firm_profile").updateOne(
        { _id: "main_profile" as any },
        { $set: { ...profileData, updatedAt: new Date() } },
        { upsert: true }
      );
      return res.json({ success: true, message: "Firm Profile & Photo saved to MongoDB Atlas!" });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // AI Legal Query Assistant Endpoint
  app.post("/api/legal-ai", async (req, res) => {
    try {
      const { query, practiceArea } = req.body;
      if (!query) {
        return res.status(400).json({ error: "Query string is required." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        return res.json({
          reply: `Thank you for your legal inquiry regarding "${practiceArea || "Legal Matters"}". Advocate Bhavani Singh & Associates provides expert legal counsel and trial advocacy at Allahabad High Court (Prayagraj), District Courts, and Board of Revenue. Please book an official appointment via our portal or contact us directly at +91 9415211990 or chambers.bhavanisingh@gmail.com for personalized legal counsel.`,
          isFallback: true
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are an AI legal consultation assistant for 'Bhavani Singh & Associates Advocates & Legal Consultants', a premier Indian law firm led by Senior Advocate Bhavani Singh practicing at the Hon'ble High Court of Judicature at Allahabad (Prayagraj Bench), Board of Revenue, and District Courts.
The user is asking a legal question: "${query}" in the category of "${practiceArea || "General Legal Counsel"}".
Provide a helpful, well-structured, professional legal summary based on Indian statutes and High Court/Supreme Court precedents (e.g., Bharatiya Nyaya Sanhita, IPC, CrPC, CPC, Constitution of India Writ Jurisdiction, Civil & Criminal Writs, Land Laws, Service Matters, Hindu Marriage Act, NI Act, etc.).
Keep your response professional, reassuring, and concise (3 short paragraphs or bullet points).
Conclude with a clear reminder that this is for preliminary information only and encourage booking a formal consultation with Advocate Bhavani Singh & Associates at +91 9415211990.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const replyText = response.text || "Thank you for reaching out. Please consult our legal experts for detailed case advice.";
      return res.json({ reply: replyText, isFallback: false });
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      return res.status(500).json({
        reply: "Thank you for your inquiry. Our legal team at Bhavani Singh & Associates is ready to assist you. Please book an appointment or call +91 9415211990 for immediate guidance.",
        error: err.message
      });
    }
  });

  // Vite middleware for development vs production static serve
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Law Firm Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
