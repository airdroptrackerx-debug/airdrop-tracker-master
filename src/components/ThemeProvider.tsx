'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      return savedTheme || 'dark';
    }
    return 'dark';
  });
  const [mounted, setMounted] = useState(false);

  // Apply theme immediately on mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Apply theme class to document element whenever theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark');
    // Add current theme class
    root.classList.add(theme);
    // Set color scheme for form controls
    root.style.colorScheme = theme;
    // Save to localStorage
    localStorage.setItem('theme', theme);
    
    console.log('Theme applied to html element:', theme);
    console.log('HTML classes:', root.className);
  }, [theme]);

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
  };

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
