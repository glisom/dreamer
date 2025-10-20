import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import * as SQLite from 'expo-sqlite';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const DATABASE_NAME = 'dreamer.db';

type ExperienceContextValue = {
  database: SQLite.WebSQLDatabase;
  speakMantra: (utterance: string) => void;
  configureSoundscape: () => Promise<void>;
  scheduleReminder: (title: string, body: string) => Promise<string | null>;
  isDatabaseReady: boolean;
};

const ExperienceContext = createContext<ExperienceContextValue | undefined>(undefined);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
});

export const ExperienceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const database = useMemo(() => SQLite.openDatabase(DATABASE_NAME), []);
  const [isDatabaseReady, setIsDatabaseReady] = useState(false);

  useEffect(() => {
    database.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS experiences (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)',
        [],
        () => {
          setIsDatabaseReady(true);
          return true;
        }
      );
    });
  }, [database]);

  const speakMantra = useCallback((utterance: string) => {
    Speech.speak(utterance, {
      pitch: 1.05,
      rate: 0.95,
      language: 'en-US'
    });
  }, []);

  const configureSoundscape = useCallback(async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false
    });
  }, []);

  const scheduleReminder = useCallback(async (title: string, body: string) => {
    const permissions = await Notifications.getPermissionsAsync();
    if (!permissions.granted) {
      const request = await Notifications.requestPermissionsAsync();
      if (!request.granted) {
        return null;
      }
    }

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body
      },
      trigger: {
        seconds: 2,
        repeats: false
      }
    });

    return identifier;
  }, []);

  const value = useMemo<ExperienceContextValue>(
    () => ({
      database,
      speakMantra,
      configureSoundscape,
      scheduleReminder,
      isDatabaseReady
    }),
    [configureSoundscape, database, isDatabaseReady, scheduleReminder, speakMantra]
  );

  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>;
};

export const useExperience = (): ExperienceContextValue => {
  const context = useContext(ExperienceContext);
  if (!context) {
    throw new Error('useExperience must be used within an ExperienceProvider');
  }
  return context;
};
