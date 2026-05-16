"use client";

import { createClient } from "@/utils/supabase/client";
import { Sparkles, GitBranch } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleGithubLogin = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Login error:", error.message);
      alert("Could not log in with GitHub.");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Login error:", error.message);
      alert("Could not log in with Google.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md p-8 glass-card rounded-2xl relative z-10 text-center border border-zinc-800">
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="text-indigo-400 h-8 w-8" />
            <span className="font-bold text-2xl tracking-tight">Portfolio.ai</span>
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
        <p className="text-zinc-400 mb-8 text-sm">Sign in to save and publish your portfolios.</p>
        
        <div className="space-y-4">
          <button
            onClick={handleGithubLogin}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-zinc-900 border border-zinc-800 rounded-full font-semibold flex items-center justify-center gap-3 hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            <GitBranch className="w-5 h-5" />
            Continue with GitHub
          </button>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-white text-black rounded-full font-semibold flex items-center justify-center gap-3 hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
