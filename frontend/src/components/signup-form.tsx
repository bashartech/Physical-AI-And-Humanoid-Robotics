
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { apiSignUp } from "../lib/api";
import { useHistory } from "@docusaurus/router";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    if (values.password !== values.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    const { success, message } = await apiSignUp(values.email, values.password);
    setIsLoading(false);

    if (success) {
      toast.success(message);
      history.push("/"); // redirect to home
    } else {
      toast.error(message);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input type="email" {...form.register("email")} placeholder="Email" />
      <input type="password" {...form.register("password")} placeholder="Password" />
      <input type="password" {...form.register("confirmPassword")} placeholder="Confirm Password" />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Sign Up"}
      </button>
    </form>
  );
}
