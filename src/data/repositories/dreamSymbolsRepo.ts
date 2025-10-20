import { SQLiteDatabase } from '../sqlite/types';
import { DreamSymbol } from './types';
import { mapRowToCamelCase } from './utils';

interface DreamSymbolRow {
  id: number;
  dream_id: number | null;
  symbol: string;
  meaning: string | null;
  notes: string | null;
  created_at: string;
}

export interface CreateDreamSymbolInput {
  dreamId?: number | null;
  symbol: string;
  meaning?: string | null;
  notes?: string | null;
}

export interface UpdateDreamSymbolInput {
  dreamId?: number | null;
  meaning?: string | null;
  notes?: string | null;
}

export class DreamSymbolsRepository {
  constructor(private readonly db: SQLiteDatabase) {}

  getAll(): DreamSymbol[] {
    const statement = this.db.prepare<DreamSymbolRow>(
      'SELECT * FROM dream_symbols ORDER BY symbol ASC'
    );
    return statement.all().map((row) => this.mapRow(row));
  }

  getById(id: number): DreamSymbol | null {
    const statement = this.db.prepare<DreamSymbolRow>(
      'SELECT * FROM dream_symbols WHERE id = ?'
    );
    const row = statement.get(id);
    return row ? this.mapRow(row) : null;
  }

  getByDream(dreamId: number): DreamSymbol[] {
    const statement = this.db.prepare<DreamSymbolRow>(
      'SELECT * FROM dream_symbols WHERE dream_id = ? ORDER BY symbol ASC'
    );
    return statement.all(dreamId).map((row) => this.mapRow(row));
  }

  create(input: CreateDreamSymbolInput): DreamSymbol {
    const statement = this.db.prepare(
      `INSERT INTO dream_symbols (dream_id, symbol, meaning, notes) VALUES (?, ?, ?, ?)`
    );
    const result = statement.run(
      input.dreamId ?? null,
      input.symbol,
      input.meaning ?? null,
      input.notes ?? null
    );
    const id = Number(result.lastInsertRowid);
    return this.getById(id)!;
  }

  bulkInsert(symbols: CreateDreamSymbolInput[]): DreamSymbol[] {
    const created: DreamSymbol[] = [];
    for (const symbol of symbols) {
      created.push(this.create(symbol));
    }
    return created;
  }

  update(id: number, updates: UpdateDreamSymbolInput): DreamSymbol | null {
    const fields: string[] = [];
    const params: unknown[] = [];

    if (updates.dreamId !== undefined) {
      fields.push('dream_id = ?');
      params.push(updates.dreamId);
    }
    if (updates.meaning !== undefined) {
      fields.push('meaning = ?');
      params.push(updates.meaning);
    }
    if (updates.notes !== undefined) {
      fields.push('notes = ?');
      params.push(updates.notes);
    }

    if (fields.length === 0) {
      return this.getById(id);
    }

    const statement = this.db.prepare(
      `UPDATE dream_symbols SET ${fields.join(', ')} WHERE id = ?`
    );
    statement.run(...params, id);
    return this.getById(id);
  }

  delete(id: number): boolean {
    const statement = this.db.prepare('DELETE FROM dream_symbols WHERE id = ?');
    const result = statement.run(id);
    return result.changes > 0;
  }

  deleteByDream(dreamId: number): number {
    const statement = this.db.prepare('DELETE FROM dream_symbols WHERE dream_id = ?');
    const result = statement.run(dreamId);
    return result.changes;
  }

  private mapRow(row: DreamSymbolRow): DreamSymbol {
    return mapRowToCamelCase<DreamSymbol>(row);
  }
}
