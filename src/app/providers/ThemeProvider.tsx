import React, { createContext, useContext, useMemo } from 'react';
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme, Theme as NavigationTheme } from '@react-navigation/native';

import { useSettings } from './settingsProvider';
import { darkThemeColors, lightThemeColors, ThemeColors } from '../../theme/colors';
import { typography } from '../../theme/typography';

type ThemeName = 'dark' | 'light';

type AppTheme = {
  name: ThemeName;
  colors: ThemeColors;
  typography: typeof typography;
  navigationTheme: NavigationTheme;
  statusBarStyle: 'light' | 'dark';
};

const createNavigationTheme = (name: ThemeName, colors: ThemeColors): NavigationTheme => {
  const base = name === 'dark' ? NavigationDarkTheme : NavigationDefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      background: colors.background,
      card: colors.card,
      border: colors.border,
      primary: colors.accent,
      text: colors.text,
      notification: colors.highlight
    }
  };
};

const themes: Record<ThemeName, AppTheme> = {
  dark: {
    name: 'dark',
    colors: darkThemeColors,
    typography,
    navigationTheme: createNavigationTheme('dark', darkThemeColors),
    statusBarStyle: 'light'
  },
  light: {
    name: 'light',
    colors: lightThemeColors,
    typography,
    navigationTheme: createNavigationTheme('light', lightThemeColors),
    statusBarStyle: 'dark'
  }
};

const ThemeContext = createContext<AppTheme>(themes.dark);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useSettings();

  const value = useMemo(() => themes[settings.theme] ?? themes.dark, [settings.theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): AppTheme => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
