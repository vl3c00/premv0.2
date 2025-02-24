"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Cookies from "js-cookie";

const EnterTokenPage = () => {
  const [token, setToken] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard"; // Default redirect

  useEffect(() => {
    const storedToken = Cookies.get("userToken");
    if (storedToken) {
      router.push(redirectPath);
    }
  }, [router, redirectPath]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const validToken = process.env.NEXT_PUBLIC_USER_TOKEN || "1234567890";

    if (token === validToken) {
      // Store token in cookies with expiration (e.g., 1 hour)
      const expirationTime = new Date();
      expirationTime.setHours(expirationTime.getHours() + 1); // 1 hour expiration

      Cookies.set("userToken", token, { expires: expirationTime, path: "/" });
      Cookies.set("userTokenExpiration", expirationTime.toISOString(), { expires: expirationTime, path: "/" });

      toast.success("Token validated successfully!");
      router.push(redirectPath);
    } else {
      toast.error("Invalid token. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Enter Token</h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="border p-2 rounded-md mb-4"
            placeholder="Enter your token"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnterTokenPage;
