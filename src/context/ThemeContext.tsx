import {
  createContext,
  useEffect,
  useState,
  useContext,
  ReactNode,
} from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const storedThemePreference = localStorage.getItem("darkMode");
    if (storedThemePreference) {
      return storedThemePreference === "true";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const className = "dark";
    const element = document.documentElement;

    if (isDarkMode) {
      element.classList.add(className);
    } else {
      element.classList.remove(className);
    }

    localStorage.setItem("darkMode", isDarkMode ? "true" : "false");
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
