import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { themes, ThemeType } from 'src/common/themes';

type ThemeContextType = {
  theme: ThemeType;
  mode: 'light' | 'dark';
  toggleTheme: () => void;
};

const AppThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useAppTheme = () => {
  const context = useContext(AppThemeContext);
  if (!context) throw new Error('useAppTheme must be used within AppThemeProvider');
  return context;
};

export const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const toggleTheme = useCallback(() => {
    setMode((prevMode) => (prevMode === 'dark' ? 'light' : 'dark'));
  }, []);

  const currentTheme: ThemeType = useMemo(() => themes[mode], [mode]);

  const contextValue: ThemeContextType = useMemo(
    () => ({ theme: currentTheme, mode, toggleTheme }),
    [currentTheme, mode, toggleTheme]
  );

  return (
    <AppThemeContext.Provider value={contextValue}>
      {children}
    </AppThemeContext.Provider>
  );
};
