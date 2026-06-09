export const themeStyles = (darkMode) => ({
  page: darkMode
    ? "bg-slate-950 text-white"
    : "bg-slate-100 text-slate-900",

  sidebar: darkMode
    ? "bg-slate-900 border-white/10"
    : "bg-white border-slate-200",

  navbar: darkMode
    ? "bg-slate-900 border-white/10"
    : "bg-white border-slate-200",

  card: darkMode
    ? "bg-slate-800 border-white/10"
    : "bg-white border-slate-200",

  input: darkMode
    ? "bg-slate-800 text-white"
    : "bg-slate-100 text-slate-900",
});