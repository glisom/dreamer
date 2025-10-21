import { useCallback } from 'react';
import { useRepositoriesContext } from '../context/RepositoriesProvider';
import {
  CreateHoroscopeInput,
  Horoscope,
  HoroscopesRepository,
  UpdateHoroscopeInput,
} from '../repositories/horoscopesRepo';

export interface UseHoroscopesResult {
  ready: boolean;
  repository: HoroscopesRepository;
  latestForUser: (userId: number) => Horoscope | null;
  listByUser: (userId: number) => Horoscope[];
  getById: (id: number) => Horoscope | null;
  create: (input: CreateHoroscopeInput) => Horoscope;
  update: (id: number, updates: UpdateHoroscopeInput) => Horoscope | null;
  remove: (id: number) => boolean;
}

export function useHoroscopes(): UseHoroscopesResult {
  const { ready, horoscopes } = useRepositoriesContext();

  const latestForUser = useCallback(
    (userId: number) => horoscopes.getLatestForUser(userId),
    [horoscopes]
  );
  const listByUser = useCallback(
    (userId: number) => horoscopes.getByUser(userId),
    [horoscopes]
  );
  const getById = useCallback((id: number) => horoscopes.getById(id), [horoscopes]);
  const create = useCallback(
    (input: CreateHoroscopeInput) => horoscopes.create(input),
    [horoscopes]
  );
  const update = useCallback(
    (id: number, updates: UpdateHoroscopeInput) => horoscopes.update(id, updates),
    [horoscopes]
  );
  const remove = useCallback((id: number) => horoscopes.delete(id), [horoscopes]);

  return {
    ready,
    repository: horoscopes,
    latestForUser,
    listByUser,
    getById,
    create,
    update,
    remove,
  };
}
