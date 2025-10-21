import { SQLiteDatabase } from '../sqlite/types';
import {
  CreateDreamSymbolInput,
  DreamSymbol,
  DreamSymbolsRepository,
} from '../repositories/dreamSymbolsRepo';

export const DEFAULT_DREAM_SYMBOLS: CreateDreamSymbolInput[] = [
  {
    symbol: 'Water',
    meaning: 'Emotional flow, intuition, and the subconscious mind.',
  },
  {
    symbol: 'Flight',
    meaning: 'Freedom, elevated perspective, or a desire to escape.',
  },
  {
    symbol: 'Falling',
    meaning: 'Loss of control, anxiety, or uncertainty about the future.',
  },
  {
    symbol: 'Forest',
    meaning: 'Exploration of the unknown, spiritual growth, or mystery.',
  },
  {
    symbol: 'Mirror',
    meaning: 'Self-reflection, identity, and personal transformation.',
  },
];

export interface SeedDreamSymbolsOptions {
  overwrite?: boolean;
}

export function seedDreamSymbols(
  db: SQLiteDatabase,
  symbols: CreateDreamSymbolInput[] = DEFAULT_DREAM_SYMBOLS,
  options: SeedDreamSymbolsOptions = {}
): DreamSymbol[] {
  const repository = new DreamSymbolsRepository(db);
  const existing = repository.getAll();

  if (!options.overwrite && existing.length > 0) {
    const existingSymbols = new Set(existing.map((symbol) => symbol.symbol.toLowerCase()));
    const newSymbols = symbols.filter(
      (symbol) => !existingSymbols.has(symbol.symbol.toLowerCase())
    );

    if (newSymbols.length === 0) {
      return existing;
    }

    for (const symbol of newSymbols) {
      repository.create(symbol);
    }
    return repository.getAll();
  }

  if (options.overwrite) {
    for (const current of existing) {
      repository.delete(current.id);
    }
  }

  for (const symbol of symbols) {
    repository.create(symbol);
  }

  return repository.getAll();
}
