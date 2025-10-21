import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the context
const ThemeContext = createContext();

// Create a provider component
export const ThemeProvider = ({ children }) => {
  // State to hold the current theme. We check localStorage first,
  // then the user's system preference, and default to 'light'.
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme || (userPrefersDark ? 'dark' : 'light');
  });

  // Effect to apply the theme class to the body and save to localStorage
  useEffect(() => {
    document.body.className = ''; // Clear existing classes
    document.body.classList.add(`${theme}-theme`);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Function to toggle the theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context easily in any component
// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);