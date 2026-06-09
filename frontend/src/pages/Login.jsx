import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { loginUser } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const { darkMode } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError(
        "Email and Password are required"
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data =
        await loginUser(
          email,
          password
        );

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex justify-center items-center min-h-screen px-4 ${
        darkMode
          ? "bg-slate-950"
          : "bg-slate-100"
      }`}
    >
      <div
        className={`w-full max-w-md p-8 md:p-10 rounded-3xl border shadow-xl ${
          darkMode
            ? "bg-slate-900 border-white/10"
            : "bg-white border-slate-200"
        }`}
      >
        <h1
          className={`text-4xl font-bold mb-2 text-center ${
            darkMode
              ? "text-white"
              : "text-slate-900"
          }`}
        >
          Welcome Back
        </h1>

        <p
          className={`text-center mb-8 ${
            darkMode
              ? "text-slate-400"
              : "text-slate-600"
          }`}
        >
          Login to continue using Planova
        </p>

        {error && (
          <div className="mb-5 bg-red-500/20 border border-red-500 text-red-500 p-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            className={`w-full p-4 rounded-xl outline-none border ${
              darkMode
                ? "bg-slate-800 text-white border-white/10"
                : "bg-slate-100 text-slate-900 border-slate-200"
            }`}
          />

          <div className="relative">
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className={`w-full p-4 rounded-xl outline-none border ${
                darkMode
                  ? "bg-slate-800 text-white border-white/10"
                  : "bg-slate-100 text-slate-900 border-slate-200"
              }`}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              className="absolute right-4 top-4"
            >
              {showPassword ? (
                <EyeOff
                  size={20}
                  className="text-slate-400"
                />
              ) : (
                <Eye
                  size={20}
                  className="text-slate-400"
                />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-xl text-white font-bold text-lg hover:scale-[1.02] transition disabled:opacity-60"
          >
            {loading
              ? "Logging In..."
              : "Login"}
          </button>
        </form>

        <p
          className={`mt-6 text-center ${
            darkMode
              ? "text-slate-400"
              : "text-slate-600"
          }`}
        >
          Don't have an account?

          <Link
            to="/register"
            className="text-purple-500 font-semibold ml-2"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;