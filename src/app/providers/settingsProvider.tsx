import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = '@dreamer/settings';

type ThemePreference = 'dark' | 'light';

type Settings = {
  theme: ThemePreference;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
};

type SettingsContextValue = {
  settings: Settings;
  isLoading: boolean;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => Promise<void>;
  resetSettings: () => Promise<void>;
};

const defaultSettings: Settings = {
  theme: 'dark',
  notificationsEnabled: true,
  soundEnabled: true
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>({ ...defaultSettings });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedSettings) {
          const parsed = JSON.parse(storedSettings) as Partial<Settings>;
          setSettings((prev) => ({ ...prev, ...parsed }));
        }
      } catch (error) {
        console.warn('Failed to load settings', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const persistSettings = useCallback(async (next: Settings) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
      console.warn('Failed to persist settings', error);
    }
  }, []);

  const updateSetting = useCallback<SettingsContextValue['updateSetting']>(
    async (key, value) => {
      let nextSettings: Settings | null = null;
      setSettings((prev) => {
        nextSettings = { ...prev, [key]: value } as Settings;
        return nextSettings;
      });
      if (nextSettings) {
        await persistSettings(nextSettings);
      }
    },
    [persistSettings]
  );

  const resetSettings = useCallback(async () => {
    setSettings({ ...defaultSettings });
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to reset settings', error);
    }
  }, []);

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      isLoading,
      updateSetting,
      resetSettings
    }),
    [isLoading, resetSettings, settings, updateSetting]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = (): SettingsContextValue => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
