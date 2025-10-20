import { useCallback } from 'react';
import { useRepositoriesContext } from '../context/RepositoriesProvider';
import {
  CreateDreamInput,
  Dream,
  DreamsRepository,
  UpdateDreamInput,
} from '../repositories/dreamsRepo';

export interface UseDreamsResult {
  ready: boolean;
  repository: DreamsRepository;
  list: () => Dream[];
  getById: (id: number) => Dream | null;
  getByUser: (userId: number) => Dream[];
  create: (input: CreateDreamInput) => Dream;
  update: (id: number, updates: UpdateDreamInput) => Dream | null;
  remove: (id: number) => boolean;
}

export function useDreams(): UseDreamsResult {
  const { ready, dreams } = useRepositoriesContext();

  const list = useCallback(() => dreams.getAll(), [dreams]);
  const getById = useCallback((id: number) => dreams.getById(id), [dreams]);
  const getByUser = useCallback(
    (userId: number) => dreams.getByUser(userId),
    [dreams]
  );
  const create = useCallback(
    (input: CreateDreamInput) => dreams.create(input),
    [dreams]
  );
  const update = useCallback(
    (id: number, updates: UpdateDreamInput) => dreams.update(id, updates),
    [dreams]
  );
  const remove = useCallback((id: number) => dreams.delete(id), [dreams]);

  return {
    ready,
    repository: dreams,
    list,
    getById,
    getByUser,
    create,
    update,
    remove,
  };
}
