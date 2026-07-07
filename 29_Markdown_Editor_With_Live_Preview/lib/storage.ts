export const storage = {
  getMarkdown: (): string => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("markdown-content") || "";
  },
  setMarkdown: (content: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem("markdown-content", content);
  },
  getDarkMode: (): boolean => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("darkMode") === "true";
  },
  setDarkMode: (isDark: boolean): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem("darkMode", String(isDark));
  },
};
