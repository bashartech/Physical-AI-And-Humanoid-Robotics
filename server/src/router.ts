import express from "express";
import { auth } from "./auth.js";

export const router = express.Router();

// Signup
router.post("/auth/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    // Use auth.handler to handle request
    const response = await auth.handler(
      new Request("http://localhost:4000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      })
    );

    const data = await response.json();
    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Signin
router.post("/auth/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    const response = await auth.handler(
      new Request("http://localhost:4000/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
    );

    const data = await response.json();
    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});
