// frontend/lib/api.ts

export async function apiSignUp(email: string, password: string) {
  const res = await fetch("http://localhost:4000/auth/signup/email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function apiSignIn(email: string, password: string) {
  const res = await fetch("http://localhost:4000/auth/signin/email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}
