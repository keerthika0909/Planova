import React, { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Eye,
  EyeOff,
} from "lucide-react";

import { useTheme } from "../context/ThemeContext";
import { registerUser } from "../services/authService";

function Register() {
  const navigate = useNavigate();

  const { darkMode } = useTheme();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const handleRegister =
    async (e) => {
      e.preventDefault();

      setError("");

      if (
        !name ||
        !email ||
        !password ||
        !confirmPassword
      ) {
        setError(
          "All fields are required"
        );
        return;
      }

      if (
        password !==
        confirmPassword
      ) {
        setError(
          "Passwords do not match"
        );
        return;
      }

      try {
        setLoading(true);

        await registerUser(
          name,
          email,
          password
        );

        alert(
          "Registration Successful"
        );

        navigate("/login");
      } catch (err) {
        setError(
          err.response?.data
            ?.message ||
            "Registration Failed"
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
          Create Account
        </h1>

        <p
          className={`text-center mb-8 ${
            darkMode
              ? "text-slate-400"
              : "text-slate-600"
          }`}
        >
          Join Planova and manage
          your projects
        </p>

        {error && (
          <div className="mb-5 bg-red-500/20 border border-red-500 text-red-500 p-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleRegister}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            className={`w-full p-4 rounded-xl outline-none border ${
              darkMode
                ? "bg-slate-800 text-white border-white/10"
                : "bg-slate-100 text-slate-900 border-slate-200"
            }`}
          />

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

          <div className="relative">
            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              placeholder="Confirm Password"
              value={
                confirmPassword
              }
              onChange={(e) =>
                setConfirmPassword(
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
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              className="absolute right-4 top-4"
            >
              {showConfirmPassword ? (
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
              ? "Creating Account..."
              : "Register"}
          </button>
        </form>

        <p
          className={`mt-6 text-center ${
            darkMode
              ? "text-slate-400"
              : "text-slate-600"
          }`}
        >
          Already have an account?

          <Link
            to="/login"
            className="text-purple-500 font-semibold ml-2"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;