import React from "react";

import {
  Moon,
  Sun,
} from "lucide-react";

import {
  useTheme,
} from "../../context/ThemeContext";

function ThemeToggle() {

  const {
    darkMode,
    toggleTheme,
  } = useTheme();

  return (

    <button
      onClick={toggleTheme}
      className="
      p-3
      rounded-xl
      bg-purple-600
      hover:bg-purple-700
      text-white
      transition
      "
    >

      {darkMode ? (
        <Sun size={20} />
      ) : (
        <Moon size={20} />
      )}

    </button>

  );
}

export default ThemeToggle;