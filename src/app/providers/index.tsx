import React from 'react';

import { SettingsProvider } from './settingsProvider';
import { ThemeProvider } from './ThemeProvider';
import { ExperienceProvider } from './ExperienceProvider';

type ProvidersProps = {
  children: React.ReactNode;
};

export const AppProviders: React.FC<ProvidersProps> = ({ children }) => (
  <SettingsProvider>
    <ExperienceProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </ExperienceProvider>
  </SettingsProvider>
);
