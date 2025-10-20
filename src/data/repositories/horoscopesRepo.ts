import { SQLiteDatabase } from '../sqlite/types';
import { Horoscope } from './types';
import { mapRowToCamelCase } from './utils';

interface HoroscopeRow {
  id: number;
  user_id: number;
  zodiac_sign: string;
  reading_date: string;
  summary: string | null;
  compatibility: string | null;
  lucky_numbers: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateHoroscopeInput {
  userId: number;
  zodiacSign: string;
  readingDate: string;
  summary?: string | null;
  compatibility?: string | null;
  luckyNumbers?: string | null;
}

export interface UpdateHoroscopeInput {
  summary?: string | null;
  compatibility?: string | null;
  luckyNumbers?: string | null;
  readingDate?: string;
}

export class HoroscopesRepository {
  constructor(private readonly db: SQLiteDatabase) {}

  getLatestForUser(userId: number): Horoscope | null {
    const statement = this.db.prepare<HoroscopeRow>(
      `SELECT * FROM horoscopes WHERE user_id = ? ORDER BY reading_date DESC, id DESC LIMIT 1`
    );
    const row = statement.get(userId);
    return row ? this.mapRow(row) : null;
  }

  getById(id: number): Horoscope | null {
    const statement = this.db.prepare<HoroscopeRow>('SELECT * FROM horoscopes WHERE id = ?');
    const row = statement.get(id);
    return row ? this.mapRow(row) : null;
  }

  getByUser(userId: number): Horoscope[] {
    const statement = this.db.prepare<HoroscopeRow>(
      `SELECT * FROM horoscopes WHERE user_id = ? ORDER BY reading_date DESC, id DESC`
    );
    return statement.all(userId).map((row) => this.mapRow(row));
  }

  create(input: CreateHoroscopeInput): Horoscope {
    const statement = this.db.prepare(
      `INSERT INTO horoscopes (user_id, zodiac_sign, reading_date, summary, compatibility, lucky_numbers)
       VALUES (?, ?, ?, ?, ?, ?)`
    );
    const result = statement.run(
      input.userId,
      input.zodiacSign,
      input.readingDate,
      input.summary ?? null,
      input.compatibility ?? null,
      input.luckyNumbers ?? null
    );
    const id = Number(result.lastInsertRowid);
    return this.getById(id)!;
  }

  update(id: number, updates: UpdateHoroscopeInput): Horoscope | null {
    const fields: string[] = [];
    const params: unknown[] = [];

    if (updates.summary !== undefined) {
      fields.push('summary = ?');
      params.push(updates.summary);
    }
    if (updates.compatibility !== undefined) {
      fields.push('compatibility = ?');
      params.push(updates.compatibility);
    }
    if (updates.luckyNumbers !== undefined) {
      fields.push('lucky_numbers = ?');
      params.push(updates.luckyNumbers);
    }
    if (updates.readingDate !== undefined) {
      fields.push('reading_date = ?');
      params.push(updates.readingDate);
    }

    if (fields.length === 0) {
      return this.getById(id);
    }

    const statement = this.db.prepare(
      `UPDATE horoscopes SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    );
    statement.run(...params, id);
    return this.getById(id);
  }

  delete(id: number): boolean {
    const statement = this.db.prepare('DELETE FROM horoscopes WHERE id = ?');
    const result = statement.run(id);
    return result.changes > 0;
  }

  private mapRow(row: HoroscopeRow): Horoscope {
    return mapRowToCamelCase<Horoscope>(row);
  }
}
