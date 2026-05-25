import React, { createContext, useContext, ReactNode } from 'react';

// Using the CSS variables defined in :root for theme-aware tokens.
const theme = {
  primary: 'var(--primary-green)',
  accent: 'var(--accent-green)',
  bg: 'var(--bg-main)',
  text: 'var(--text-main)',
  card: 'var(--card)',
  border: 'var(--border)',
};

const ThemeContext = createContext(theme);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
