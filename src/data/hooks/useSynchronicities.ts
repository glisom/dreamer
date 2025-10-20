import { useCallback } from 'react';
import { useRepositoriesContext } from '../context/RepositoriesProvider';
import {
  CreateSynchronicityInput,
  SynchronicitiesRepository,
  Synchronicity,
  UpdateSynchronicityInput,
} from '../repositories/synchronicitiesRepo';

export interface UseSynchronicitiesResult {
  ready: boolean;
  repository: SynchronicitiesRepository;
  list: () => Synchronicity[];
  getById: (id: number) => Synchronicity | null;
  getByDream: (dreamId: number) => Synchronicity[];
  create: (input: CreateSynchronicityInput) => Synchronicity;
  update: (id: number, updates: UpdateSynchronicityInput) => Synchronicity | null;
  remove: (id: number) => boolean;
  removeByDream: (dreamId: number) => number;
}

export function useSynchronicities(): UseSynchronicitiesResult {
  const { ready, synchronicities } = useRepositoriesContext();

  const list = useCallback(() => synchronicities.getAll(), [synchronicities]);
  const getById = useCallback(
    (id: number) => synchronicities.getById(id),
    [synchronicities]
  );
  const getByDream = useCallback(
    (dreamId: number) => synchronicities.getByDream(dreamId),
    [synchronicities]
  );
  const create = useCallback(
    (input: CreateSynchronicityInput) => synchronicities.create(input),
    [synchronicities]
  );
  const update = useCallback(
    (id: number, updates: UpdateSynchronicityInput) =>
      synchronicities.update(id, updates),
    [synchronicities]
  );
  const remove = useCallback(
    (id: number) => synchronicities.delete(id),
    [synchronicities]
  );
  const removeByDream = useCallback(
    (dreamId: number) => synchronicities.deleteByDream(dreamId),
    [synchronicities]
  );

  return {
    ready,
    repository: synchronicities,
    list,
    getById,
    getByDream,
    create,
    update,
    remove,
    removeByDream,
  };
}
