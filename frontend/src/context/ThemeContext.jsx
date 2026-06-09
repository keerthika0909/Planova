import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({
  children,
}) => {

  const [darkMode, setDarkMode] =
    useState(() => {

      const savedTheme =
        localStorage.getItem("theme");

      return savedTheme === "dark";
    });

  const toggleTheme = () => {

    setDarkMode((prev) => !prev);

  };

  useEffect(() => {

    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );

  }, [darkMode]);

  return (

    <ThemeContext.Provider
      value={{
        darkMode,
        toggleTheme,
      }}
    >

      <div
        className={
          darkMode
            ? "dark min-h-screen"
            : "min-h-screen"
        }
      >
        {children}
      </div>

    </ThemeContext.Provider>

  );
};

export const useTheme = () =>
  useContext(ThemeContext);