import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { runMigrations } from '../sqlite/migrations';
import { SQLiteDatabase } from '../sqlite/types';
import {
  AlarmsRepository,
  DreamSymbolsRepository,
  DreamsRepository,
  HoroscopesRepository,
  SynchronicitiesRepository,
  UserProfileRepository,
} from '../repositories';

interface RepositoryInstances {
  alarms: AlarmsRepository;
  dreamSymbols: DreamSymbolsRepository;
  dreams: DreamsRepository;
  horoscopes: HoroscopesRepository;
  synchronicities: SynchronicitiesRepository;
  userProfile: UserProfileRepository;
}

export interface RepositoryContextValue extends RepositoryInstances {
  ready: boolean;
}

export interface RepositoriesProviderProps {
  database: SQLiteDatabase;
  autoMigrate?: boolean;
  children: React.ReactNode;
  onReady?: () => void;
  onError?: (error: unknown) => void;
}

const RepositoriesContext = createContext<RepositoryContextValue | null>(null);

export const RepositoriesProvider: React.FC<RepositoriesProviderProps> = ({
  database,
  autoMigrate = true,
  children,
  onReady,
  onError,
}) => {
  const repositories = useMemo<RepositoryInstances>(
    () => ({
      alarms: new AlarmsRepository(database),
      dreamSymbols: new DreamSymbolsRepository(database),
      dreams: new DreamsRepository(database),
      horoscopes: new HoroscopesRepository(database),
      synchronicities: new SynchronicitiesRepository(database),
      userProfile: new UserProfileRepository(database),
    }),
    [database]
  );

  const [ready, setReady] = useState(!autoMigrate);

  useEffect(() => {
    let cancelled = false;

    if (!autoMigrate) {
      setReady(true);
      onReady?.();
      return;
    }

    (async () => {
      try {
        await runMigrations(database);
        if (!cancelled) {
          setReady(true);
          onReady?.();
        }
      } catch (error) {
        if (!cancelled) {
          onError?.(error);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [autoMigrate, database, onError, onReady]);

  const value = useMemo<RepositoryContextValue>(
    () => ({
      ready,
      ...repositories,
    }),
    [ready, repositories]
  );

  return (
    <RepositoriesContext.Provider value={value}>
      {children}
    </RepositoriesContext.Provider>
  );
};

export function useRepositoriesContext(): RepositoryContextValue {
  const context = useContext(RepositoriesContext);
  if (!context) {
    throw new Error('useRepositoriesContext must be used within a RepositoriesProvider');
  }
  return context;
}
