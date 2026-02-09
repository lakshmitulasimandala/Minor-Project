"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("An error occurred during sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center py-12 px-4">
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-center text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent mb-2">
          Welcome Back
        </h1>
        <p className="text-center text-sm text-zinc-400">
          Sign in to continue
        </p>
      </div>

      <div className="mt-8 mx-auto w-full max-w-md">
        <div className="bg-[#1f1a16] p-8 rounded-2xl border border-white/5 shadow-xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm text-zinc-300 mb-1">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-lg bg-black border border-border px-3 py-2 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-300 mb-1">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-lg bg-black border border-border px-3 py-2 pr-10 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-orange-400"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
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
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-zinc-400">
            Don’t have an account?{" "}
            <a href="/auth/signup" className="text-orange-400 hover:underline">
              Create one
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
