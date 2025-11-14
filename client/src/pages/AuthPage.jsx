import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const { setUser } = useAuth();
  const [tab, setTab] = useState("login");
  const [role, setRole] = useState("customer");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    try {
      e.preventDefault();

      const result = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { email, role, password }
      );

      let token = result.headers.authorization;

      if (token?.startsWith("Bearer ")) {
        token = token.split(" ")[1];
      }

      localStorage.setItem("token", token);

      setUser(result.data.user);

      toast.success(result.data.message);

      if (role === "customer") {
        navigate("/transactions");
      } else {
        navigate("/accounts");
      }

      setEmail("");
      setRole("customer");
      setPassword("");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const handleSignup = async () => {
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        { name, email, password }
      );

      toast.success(result.data.message);

      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-primary to-secondary p-4">
      <div className="bg-primary backdrop-blur-lg shadow-xl rounded-2xl p-10 w-full max-w-md border border-gray-700">
        {/* ICON */}
        <div className="flex justify-center mb-4">
          <div className="bg-secondary p-4 rounded-full shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 1.75L1.75 6v12L12 22.25 22.25 18V6z" />
            </svg>
          </div>
        </div>

        {/* TITLE */}
        <h2 className="text-center text-2xl font-bold text-white mb-2">
          SecureBank
        </h2>
        <p className="text-center text-grey mb-6">
          {tab === "login" ? "Sign in to your account" : "Create a new account"}
        </p>

        {/* TABS */}
        <div className="flex mb-6 bg-secondary rounded-xl overflow-hidden">
          <button
            className={`w-1/2 py-2 font-semibold ${
              tab === "login" ? "bg-ternary text-white" : "text-grey"
            }`}
            onClick={() => setTab("login")}
          >
            Login
          </button>

          <button
            className={`w-1/2 py-2 font-semibold ${
              tab === "signup" ? "bg-ternary text-white" : "text-grey"
            }`}
            onClick={() => setTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {tab === "login" && (
          <form onSubmit={handleLogin}>
            <label className="text-grey">Email</label>
            <input
              type="email"
              className="w-full p-3 rounded-lg bg-secondary text-white mb-4"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label className="text-grey">Password</label>
            <input
              type="password"
              className="w-full p-3 rounded-lg bg-secondary text-white mb-6"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="mb-6">
              <label className="text-grey block mb-2">Login As</label>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setRole("customer")}
                  className={`flex-1 py-2 rounded-lg ${
                    role === "customer"
                      ? "bg-ternary text-white"
                      : "bg-secondary text-white"
                  }`}
                >
                  Customer
                </button>

                <button
                  type="button"
                  onClick={() => setRole("banker")}
                  className={`flex-1 py-2 rounded-lg ${
                    role === "banker"
                      ? "bg-ternary text-white"
                      : "bg-secondary text-white"
                  }`}
                >
                  Banker
                </button>
              </div>
            </div>

            <button className="w-full bg-ternary hover:bg-secondary text-white p-3 rounded-lg font-semibold">
              Log In
            </button>
          </form>
        )}

        {tab === "signup" && (
          <form onSubmit={handleSignup}>
            <label className="text-grey">Full Name</label>
            <input
              type="text"
              className="w-full p-3 rounded-lg bg-secondary text-white mb-4"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label className="text-grey">Email</label>
            <input
              type="email"
              className="w-full p-3 rounded-lg bg-secondary text-white mb-4"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label className="text-grey">Password</label>
            <input
              type="password"
              className="w-full p-3 rounded-lg bg-secondary text-white mb-6"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="w-full bg-ternary hover:bg-secondary text-white p-3 rounded-lg font-semibold">
              Create Account
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
