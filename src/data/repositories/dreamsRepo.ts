import { SQLiteDatabase } from '../sqlite/types';
import { Dream } from './types';
import { mapRowToCamelCase } from './utils';

interface DreamRow {
  id: number;
  user_id: number;
  title: string;
  narrative: string | null;
  mood: string | null;
  lucidity_level: number | null;
  sleep_quality: number | null;
  dream_date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDreamInput {
  userId: number;
  title: string;
  dreamDate: string;
  narrative?: string | null;
  mood?: string | null;
  lucidityLevel?: number | null;
  sleepQuality?: number | null;
}

export interface UpdateDreamInput {
  title?: string;
  narrative?: string | null;
  mood?: string | null;
  lucidityLevel?: number | null;
  sleepQuality?: number | null;
  dreamDate?: string;
}

export class DreamsRepository {
  constructor(private readonly db: SQLiteDatabase) {}

  getAll(): Dream[] {
    const statement = this.db.prepare<DreamRow>(
      'SELECT * FROM dreams ORDER BY dream_date DESC, id DESC'
    );
    return statement.all().map((row) => this.mapRow(row));
  }

  getById(id: number): Dream | null {
    const statement = this.db.prepare<DreamRow>('SELECT * FROM dreams WHERE id = ?');
    const row = statement.get(id);
    return row ? this.mapRow(row) : null;
  }

  getByUser(userId: number): Dream[] {
    const statement = this.db.prepare<DreamRow>(
      'SELECT * FROM dreams WHERE user_id = ? ORDER BY dream_date DESC, id DESC'
    );
    return statement.all(userId).map((row) => this.mapRow(row));
  }

  create(input: CreateDreamInput): Dream {
    const statement = this.db.prepare(
      `INSERT INTO dreams (user_id, title, narrative, mood, lucidity_level, sleep_quality, dream_date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    );
    const result = statement.run(
      input.userId,
      input.title,
      input.narrative ?? null,
      input.mood ?? null,
      input.lucidityLevel ?? null,
      input.sleepQuality ?? null,
      input.dreamDate
    );
    const id = Number(result.lastInsertRowid);
    return this.getById(id)!;
  }

  update(id: number, updates: UpdateDreamInput): Dream | null {
    const fields: string[] = [];
    const params: unknown[] = [];

    if (updates.title !== undefined) {
      fields.push('title = ?');
      params.push(updates.title);
    }
    if (updates.narrative !== undefined) {
      fields.push('narrative = ?');
      params.push(updates.narrative);
    }
    if (updates.mood !== undefined) {
      fields.push('mood = ?');
      params.push(updates.mood);
    }
    if (updates.lucidityLevel !== undefined) {
      fields.push('lucidity_level = ?');
      params.push(updates.lucidityLevel);
    }
    if (updates.sleepQuality !== undefined) {
      fields.push('sleep_quality = ?');
      params.push(updates.sleepQuality);
    }
    if (updates.dreamDate !== undefined) {
      fields.push('dream_date = ?');
      params.push(updates.dreamDate);
    }

    if (fields.length === 0) {
      return this.getById(id);
    }

    const statement = this.db.prepare(
      `UPDATE dreams SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    );
    statement.run(...params, id);
    return this.getById(id);
  }

  delete(id: number): boolean {
    const statement = this.db.prepare('DELETE FROM dreams WHERE id = ?');
    const result = statement.run(id);
    return result.changes > 0;
  }

  private mapRow(row: DreamRow): Dream {
    return mapRowToCamelCase<Dream>(row);
  }
}
