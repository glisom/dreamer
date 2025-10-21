import { useCallback } from 'react';
import { useRepositoriesContext } from '../context/RepositoriesProvider';
import {
  CreateDreamSymbolInput,
  DreamSymbol,
  DreamSymbolsRepository,
  UpdateDreamSymbolInput,
} from '../repositories/dreamSymbolsRepo';

export interface UseDreamSymbolsResult {
  ready: boolean;
  repository: DreamSymbolsRepository;
  list: () => DreamSymbol[];
  getById: (id: number) => DreamSymbol | null;
  getByDream: (dreamId: number) => DreamSymbol[];
  create: (input: CreateDreamSymbolInput) => DreamSymbol;
  bulkInsert: (symbols: CreateDreamSymbolInput[]) => DreamSymbol[];
  update: (id: number, updates: UpdateDreamSymbolInput) => DreamSymbol | null;
  remove: (id: number) => boolean;
  removeByDream: (dreamId: number) => number;
}

export function useDreamSymbols(): UseDreamSymbolsResult {
  const { ready, dreamSymbols } = useRepositoriesContext();

  const list = useCallback(() => dreamSymbols.getAll(), [dreamSymbols]);
  const getById = useCallback(
    (id: number) => dreamSymbols.getById(id),
    [dreamSymbols]
  );
  const getByDream = useCallback(
    (dreamId: number) => dreamSymbols.getByDream(dreamId),
    [dreamSymbols]
  );
  const create = useCallback(
    (input: CreateDreamSymbolInput) => dreamSymbols.create(input),
    [dreamSymbols]
  );
  const bulkInsert = useCallback(
    (symbols: CreateDreamSymbolInput[]) => dreamSymbols.bulkInsert(symbols),
    [dreamSymbols]
  );
  const update = useCallback(
    (id: number, updates: UpdateDreamSymbolInput) => dreamSymbols.update(id, updates),
    [dreamSymbols]
  );
  const remove = useCallback((id: number) => dreamSymbols.delete(id), [dreamSymbols]);
  const removeByDream = useCallback(
    (dreamId: number) => dreamSymbols.deleteByDream(dreamId),
    [dreamSymbols]
  );

  return {
    ready,
    repository: dreamSymbols,
    list,
    getById,
    getByDream,
    create,
    bulkInsert,
    update,
    remove,
    removeByDream,
  };
}
