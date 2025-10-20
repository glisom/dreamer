import { SQLiteDatabase } from '../sqlite/types';
import { Synchronicity } from './types';
import { mapRowToCamelCase } from './utils';

interface SynchronicityRow {
  id: number;
  dream_id: number | null;
  description: string;
  occurred_on: string | null;
  correlation_score: number | null;
  created_at: string;
}

export interface CreateSynchronicityInput {
  dreamId?: number | null;
  description: string;
  occurredOn?: string | null;
  correlationScore?: number | null;
}

export interface UpdateSynchronicityInput {
  dreamId?: number | null;
  description?: string;
  occurredOn?: string | null;
  correlationScore?: number | null;
}

export class SynchronicitiesRepository {
  constructor(private readonly db: SQLiteDatabase) {}

  getAll(): Synchronicity[] {
    const statement = this.db.prepare<SynchronicityRow>(
      'SELECT * FROM synchronicities ORDER BY created_at DESC'
    );
    return statement.all().map((row) => this.mapRow(row));
  }

  getById(id: number): Synchronicity | null {
    const statement = this.db.prepare<SynchronicityRow>(
      'SELECT * FROM synchronicities WHERE id = ?'
    );
    const row = statement.get(id);
    return row ? this.mapRow(row) : null;
  }

  getByDream(dreamId: number): Synchronicity[] {
    const statement = this.db.prepare<SynchronicityRow>(
      'SELECT * FROM synchronicities WHERE dream_id = ? ORDER BY created_at DESC'
    );
    return statement.all(dreamId).map((row) => this.mapRow(row));
  }

  create(input: CreateSynchronicityInput): Synchronicity {
    const statement = this.db.prepare(
      `INSERT INTO synchronicities (dream_id, description, occurred_on, correlation_score)
       VALUES (?, ?, ?, ?)`
    );
    const result = statement.run(
      input.dreamId ?? null,
      input.description,
      input.occurredOn ?? null,
      input.correlationScore ?? null
    );
    const id = Number(result.lastInsertRowid);
    return this.getById(id)!;
  }

  update(id: number, updates: UpdateSynchronicityInput): Synchronicity | null {
    const fields: string[] = [];
    const params: unknown[] = [];

    if (updates.dreamId !== undefined) {
      fields.push('dream_id = ?');
      params.push(updates.dreamId);
    }
    if (updates.description !== undefined) {
      fields.push('description = ?');
      params.push(updates.description);
    }
    if (updates.occurredOn !== undefined) {
      fields.push('occurred_on = ?');
      params.push(updates.occurredOn);
    }
    if (updates.correlationScore !== undefined) {
      fields.push('correlation_score = ?');
      params.push(updates.correlationScore);
    }

    if (fields.length === 0) {
      return this.getById(id);
    }

    const statement = this.db.prepare(
      `UPDATE synchronicities SET ${fields.join(', ')} WHERE id = ?`
    );
    statement.run(...params, id);
    return this.getById(id);
  }

  delete(id: number): boolean {
    const statement = this.db.prepare('DELETE FROM synchronicities WHERE id = ?');
    const result = statement.run(id);
    return result.changes > 0;
  }

  deleteByDream(dreamId: number): number {
    const statement = this.db.prepare('DELETE FROM synchronicities WHERE dream_id = ?');
    const result = statement.run(dreamId);
    return result.changes;
  }

  private mapRow(row: SynchronicityRow): Synchronicity {
    return mapRowToCamelCase<Synchronicity>(row);
  }
}
