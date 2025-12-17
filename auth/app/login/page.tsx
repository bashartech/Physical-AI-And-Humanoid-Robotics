"use client"

import type React from "react"

import { useState } from "react"
import { createAuthClient } from "better-auth/react"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")

  const client = createAuthClient({
    baseURL:
      process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
      process.env.BETTER_AUTH_URL ||
      "https://physical-ai-and-humanoid-robotics-ebon-seven.vercel.app/",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const result = await client.signIn.email({
        email: formData.email,
        password: formData.password,
      })

      if (result.error) {
        setError(result.error.message || result.error.code || "Login failed")
      } else {
        window.location.href =
          process.env.NEXT_PUBLIC_FRONTEND_URL || "https://physical-ai-and-humanoid-robotics-x.vercel.app/"
      }
    } catch (err) {
      setError("An error occurred during login")
      console.error(err)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000000",
        position: "relative",
        overflow: "hidden",
        padding: "2rem",
      }}
    >
      {/* Animated background layer */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 25% 30%, rgba(14, 165, 233, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 75% 70%, rgba(139, 92, 246, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.08) 0%, transparent 70%)
          `,
          pointerEvents: "none",
        }}
      />

      {/* Main Content Area - Centered */}
      <div
        style={{
          maxWidth: "480px",
          width: "100%",
          background: "rgba(10, 10, 15, 0.95)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          border: "1px solid rgba(14, 165, 233, 0.2)",
          borderRadius: "20px",
          padding: "3.5rem",
          boxShadow: "0 24px 64px rgba(0, 0, 0, 1), 0 0 32px rgba(14, 165, 233, 0.3)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Top gradient border */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: "linear-gradient(90deg, transparent, #0ea5e9, #06b6d4, transparent)",
            borderRadius: "20px 20px 0 0",
          }}
        />

        <div>
          <h2
            style={{
              marginTop: 0,
              marginBottom: "2.5rem",
              textAlign: "center",
              fontSize: "2.25rem",
              fontWeight: "800",
              background: "linear-gradient(135deg, #0ea5e9, #06b6d4, #38bdf8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.03em",
            }}
          >
            Sign in to your account
          </h2>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          {error && (
            <div
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#ef4444",
                padding: "1.25rem",
                borderRadius: "10px",
                fontSize: "0.9rem",
              }}
            >
              {error}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  marginBottom: "0.75rem",
                  color: "#a1a1aa",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                }}
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  background: "rgba(17, 17, 22, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  borderRadius: "10px",
                  color: "#ffffff",
                  fontSize: "0.95rem",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#0ea5e9"
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(14, 165, 233, 0.25), 0 4px 12px rgba(14, 165, 233, 0.2)"
                  e.currentTarget.style.background = "rgba(17, 17, 22, 0.95)"
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)"
                  e.currentTarget.style.boxShadow = "none"
                  e.currentTarget.style.background = "rgba(17, 17, 22, 0.8)"
                }}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  marginBottom: "0.75rem",
                  color: "#a1a1aa",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                }}
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  background: "rgba(17, 17, 22, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  borderRadius: "10px",
                  color: "#ffffff",
                  fontSize: "0.95rem",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#0ea5e9"
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(14, 165, 233, 0.25), 0 4px 12px rgba(14, 165, 233, 0.2)"
                  e.currentTarget.style.background = "rgba(17, 17, 22, 0.95)"
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)"
                  e.currentTarget.style.boxShadow = "none"
                  e.currentTarget.style.background = "rgba(17, 17, 22, 0.8)"
                }}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "16px",
                background: "linear-gradient(135deg, #0ea5e9, #06b6d4)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 16px rgba(14, 165, 233, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)"
                e.currentTarget.style.boxShadow =
                  "0 8px 24px rgba(14, 165, 233, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow =
                  "0 4px 16px rgba(14, 165, 233, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
              }}
            >
              Login
            </button>
          </div>
        </form>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <p style={{ fontSize: "0.9rem", color: "#71717a" }}>
            Don't have an account?{" "}
            <a
              href="/signup"
              style={{
                color: "#0ea5e9",
                textDecoration: "none",
                fontWeight: "600",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#06b6d4")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#0ea5e9")}
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
