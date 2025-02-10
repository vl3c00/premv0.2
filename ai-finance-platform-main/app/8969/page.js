"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TokenPage() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // List of valid tokens from environment
  const validTokens = process.env.NEXT_PUBLIC_ACCESS_TOKENS?.split(",") || [];

  useEffect(() => {
    const lastVerified = localStorage.getItem("access_token_verified_at");

    if (lastVerified) {
      const lastVerifiedTime = parseInt(lastVerified, 10);
      const currentTime = Date.now();
      const timeDiff = currentTime - lastVerifiedTime;

      // 16 hours in milliseconds (16 * 60 * 60 * 1000)
      const maxSessionDuration = 16 * 60 * 60 * 1000;

      if (timeDiff < maxSessionDuration) {
        router.push("/dashboard"); // Redirect to dashboard if still within time
      } else {
        // Force re-authentication after 16 hours
        localStorage.removeItem("access_token_verified");
        localStorage.removeItem("access_token_verified_at");
      }
    }

    setLoading(false); // Stop loading once check is done
  }, [router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validTokens.includes(token)) {
      // Store token in localStorage and record the timestamp
      localStorage.setItem("access_token_verified", "true");
      localStorage.setItem("access_token_verified_at", Date.now().toString());

      // Redirect to sign-in page after token verification
      router.push(
        "http://localhost:3001/sign-in?sign_in_force_redirect_url=http%3A%2F%2Flocalhost%3A3001%2Fdashboard&redirect_url=http%3A%2F%2Flocalhost%3A3001%2F"
      );
    } else {
      alert("Invalid token. Please try again.");
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-lg font-bold mb-4">Enter Access Token</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <input
          type="text"
          placeholder="Enter token (default 123456)"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="p-2 border rounded-md"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
