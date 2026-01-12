"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUp() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 👁️ UI-only states (no logic impact)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      router.push("/auth/signin");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center py-12 px-4">
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-center text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent mb-2">
          Create Account
        </h1>
        <p className="text-center text-sm text-zinc-400">
          Admin / Moderator access
        </p>
      </div>

      <div className="mt-8 mx-auto w-full max-w-md">
        <div className="bg-[#1f1a16] p-8 rounded-2xl border border-white/5 shadow-xl">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Name */}
            <input
              name="name"
              type="text"
              placeholder="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg bg-black border border-border px-3 py-2 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            />

            {/* Email */}
            <input
              name="email"
              type="text"
              placeholder="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg bg-black border border-border px-3 py-2 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            />

            {/* Password */}
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-lg bg-black border border-border px-3 py-2 pr-10 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-orange-400"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="confirm password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-lg bg-black border border-border px-3 py-2 pr-10 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-orange-400"
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-400 transition disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Sign up"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-orange-400 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
