"use client"

import type React from "react"

import { useState } from "react"
import { createAuthClient } from "better-auth/react"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    skillLevel: "",
    hardwareExperience: "",
    softwareExperience: "",
    programmingLevel: "",
    preferredLearningStyle: "",
    preferredLanguage: "en",
  })
  const [error, setError] = useState("")

  const client = createAuthClient({
    baseURL:
      process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
      process.env.BETTER_AUTH_URL ||
      "https://physical-ai-and-humanoid-robotics-ebon-seven.vercel.app/",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const userResult = await client.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name || formData.email.split("@")[0],
      })

      if (userResult.error) {
        setError(userResult.error.message || userResult.error.code || "Signup failed")
        return
      }

      let userId: string | undefined

      if (userResult && typeof userResult === "object") {
        if ("user" in userResult && userResult.user && typeof userResult.user === "object" && "id" in userResult.user) {
          userId = (userResult.user as { id: string }).id
        } else if (
          "data" in userResult &&
          userResult.data &&
          typeof userResult.data === "object" &&
          "user" in userResult.data &&
          userResult.data.user &&
          typeof userResult.data.user === "object" &&
          "id" in userResult.data.user
        ) {
          userId = (userResult.data.user as { id: string }).id
        }
      }

      if (!userId) {
        setError("User creation failed - no user ID returned")
        return
      }

      const profileResponse = await fetch("/api/user-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          skillLevel: formData.skillLevel,
          hardwareExperience: formData.hardwareExperience,
          softwareExperience: formData.softwareExperience,
          programmingLevel: formData.programmingLevel,
          preferredLearningStyle: formData.preferredLearningStyle,
          preferredLanguage: formData.preferredLanguage,
        }),
      })

      if (profileResponse.ok) {
        window.location.href =
          process.env.NEXT_PUBLIC_FRONTEND_URL || "https://physical-ai-and-humanoid-robotics-x.vercel.app/"
      } else {
        const errorData = await profileResponse.json()
        setError(errorData.message || "Profile creation failed")
      }
    } catch (err) {
      setError("An error occurred during signup")
      console.error(err)
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "14px 18px",
    background: "rgba(17, 17, 22, 0.8)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    borderRadius: "10px",
    color: "#ffffff",
    fontSize: "0.95rem",
    transition: "all 0.3s ease",
  }

  const labelStyle = {
    display: "block",
    marginBottom: "0.75rem",
    color: "#a1a1aa",
    fontSize: "0.9rem",
    fontWeight: "500",
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

      {/* Main Content Area - Centered with scrollbar */}
      <div
        style={{
          maxWidth: "600px",
          width: "100%",
          background: "rgba(10, 10, 15, 0.95)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          border: "1px solid rgba(14, 165, 233, 0.2)",
          borderRadius: "20px",
          padding: "3.5rem",
          boxShadow: "0 24px 64px rgba(0, 0, 0, 1), 0 0 32px rgba(14, 165, 233, 0.3)",
          position: "relative",
          maxHeight: "90vh",
          overflowY: "auto",
          zIndex: 1,
        }}
        className="signup-form-container"
      >
        {/* Professional custom scrollbar styling */}
        <style jsx>{`
          .signup-form-container::-webkit-scrollbar {
            width: 12px;
          }

          .signup-form-container::-webkit-scrollbar-track {
            background: rgba(17, 17, 22, 0.4);
            border-radius: 10px;
            margin: 10px 0;
          }

          .signup-form-container::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #0ea5e9, #06b6d4);
            border-radius: 10px;
            border: 2px solid rgba(10, 10, 15, 0.95);
            box-shadow: 0 0 10px rgba(14, 165, 233, 0.5);
          }

          .signup-form-container::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, #06b6d4, #38bdf8);
            box-shadow: 0 0 15px rgba(14, 165, 233, 0.8);
          }

          .signup-form-container::-webkit-scrollbar-thumb:active {
            background: linear-gradient(135deg, #0284c7, #0891b2);
          }

          /* Firefox scrollbar */
          .signup-form-container {
            scrollbar-width: thin;
            scrollbar-color: #0ea5e9 rgba(17, 17, 22, 0.4);
          }
        `}</style>

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
            Create your account
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
              <label htmlFor="name" style={labelStyle}>
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                style={inputStyle}
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
              <label htmlFor="email" style={labelStyle}>
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
                style={inputStyle}
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
              <label htmlFor="password" style={labelStyle}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                style={inputStyle}
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
              <label htmlFor="skillLevel" style={labelStyle}>
                Skill Level
              </label>
              <select
                id="skillLevel"
                name="skillLevel"
                required
                value={formData.skillLevel}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="" style={{ background: "#0a0a0f" }}>
                  Select your skill level
                </option>
                <option value="beginner" style={{ background: "#0a0a0f" }}>
                  Beginner
                </option>
                <option value="intermediate" style={{ background: "#0a0a0f" }}>
                  Intermediate
                </option>
                <option value="advanced" style={{ background: "#0a0a0f" }}>
                  Advanced
                </option>
              </select>
            </div>

            <div>
              <label htmlFor="hardwareExperience" style={labelStyle}>
                Hardware Experience
              </label>
              <textarea
                id="hardwareExperience"
                name="hardwareExperience"
                rows={3}
                placeholder="Describe your experience with hardware development..."
                value={formData.hardwareExperience}
                onChange={handleChange}
                style={inputStyle}
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
              <label htmlFor="softwareExperience" style={labelStyle}>
                Software Experience
              </label>
              <textarea
                id="softwareExperience"
                name="softwareExperience"
                rows={3}
                placeholder="Describe your experience with software development..."
                value={formData.softwareExperience}
                onChange={handleChange}
                style={inputStyle}
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
              <label htmlFor="programmingLevel" style={labelStyle}>
                Programming Level
              </label>
              <input
                type="text"
                id="programmingLevel"
                name="programmingLevel"
                placeholder="Your programming experience level..."
                value={formData.programmingLevel}
                onChange={handleChange}
                style={inputStyle}
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
              <label htmlFor="preferredLearningStyle" style={labelStyle}>
                Preferred Learning Style
              </label>
              <select
                id="preferredLearningStyle"
                name="preferredLearningStyle"
                value={formData.preferredLearningStyle}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="" style={{ background: "#0a0a0f" }}>
                  Select your preferred learning style
                </option>
                <option value="visual" style={{ background: "#0a0a0f" }}>
                  Visual
                </option>
                <option value="auditory" style={{ background: "#0a0a0f" }}>
                  Auditory
                </option>
                <option value="reading" style={{ background: "#0a0a0f" }}>
                  Reading/Writing
                </option>
                <option value="kinesthetic" style={{ background: "#0a0a0f" }}>
                  Kinesthetic
                </option>
              </select>
            </div>

            <div>
              <label htmlFor="preferredLanguage" style={labelStyle}>
                Preferred Language
              </label>
              <select
                id="preferredLanguage"
                name="preferredLanguage"
                value={formData.preferredLanguage}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="en" style={{ background: "#0a0a0f" }}>
                  English
                </option>
                <option value="ur" style={{ background: "#0a0a0f" }}>
                  Urdu
                </option>
              </select>
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
              Sign up
            </button>
          </div>
        </form>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <p style={{ fontSize: "0.9rem", color: "#71717a" }}>
            Already have an account?{" "}
            <a
              href="/login"
              style={{
                color: "#0ea5e9",
                textDecoration: "none",
                fontWeight: "600",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#06b6d4")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#0ea5e9")}
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
