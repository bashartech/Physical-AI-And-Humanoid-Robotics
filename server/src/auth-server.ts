import express from "express";
import cors from "cors";
import { auth } from "./auth.js";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000", // your frontend
    credentials: true,
  })
);

// ------------------------------
// ⭐ Correct Express → Fetch bridge
// ------------------------------
app.all("*", async (req, res) => {
  try {
    // 1) Convert Express req → Fetch Request
    const url = `http://localhost:4000${req.originalUrl}`;
    const fetchRequest = new Request(url, {
      method: req.method,
      headers: req.headers as any,
      body: req.method !== "GET" && req.method !== "HEAD" ? JSON.stringify(req.body) : undefined,
    });

    // 2) Send ONLY ONE argument into handler
    const response = await auth.handler(fetchRequest);

    // 3) Convert Fetch Response → Express Response
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    const responseBody = await response.text();
    res.status(response.status).send(responseBody);
  } catch (err) {
    console.error("❌ Handler error:", err);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

app.listen(4000, () => {
  console.log("Auth server running at http://localhost:4000");
});
