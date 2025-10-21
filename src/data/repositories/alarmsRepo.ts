import { SQLiteDatabase } from '../sqlite/types';
import { Alarm } from './types';
import { booleanFromSQLite, mapRowToCamelCase } from './utils';

interface AlarmRow {
  id: number;
  user_id: number;
  label: string | null;
  alarm_time: string;
  recurrence: string | null;
  enabled: number;
  created_at: string;
  updated_at: string;
}

export interface CreateAlarmInput {
  userId: number;
  label?: string | null;
  alarmTime: string;
  recurrence?: string | null;
  enabled?: boolean;
}

export interface UpdateAlarmInput {
  label?: string | null;
  alarmTime?: string;
  recurrence?: string | null;
  enabled?: boolean;
}

export class AlarmsRepository {
  constructor(private readonly db: SQLiteDatabase) {}

  getAll(): Alarm[] {
    const statement = this.db.prepare<AlarmRow>(
      'SELECT * FROM alarms ORDER BY alarm_time ASC'
    );
    return statement.all().map((row) => this.mapRow(row));
  }

  getById(id: number): Alarm | null {
    const statement = this.db.prepare<AlarmRow>('SELECT * FROM alarms WHERE id = ?');
    const row = statement.get(id);
    return row ? this.mapRow(row) : null;
  }

  getByUser(userId: number): Alarm[] {
    const statement = this.db.prepare<AlarmRow>(
      'SELECT * FROM alarms WHERE user_id = ? ORDER BY alarm_time ASC'
    );
    return statement.all(userId).map((row) => this.mapRow(row));
  }

  create(input: CreateAlarmInput): Alarm {
    const statement = this.db.prepare(
      'INSERT INTO alarms (user_id, label, alarm_time, recurrence, enabled) VALUES (?, ?, ?, ?, ?)' 
    );
    const enabled = input.enabled ?? true;
    const result = statement.run(
      input.userId,
      input.label ?? null,
      input.alarmTime,
      input.recurrence ?? null,
      enabled ? 1 : 0
    );
    const id = Number(result.lastInsertRowid);
    return this.getById(id)!;
  }

  update(id: number, updates: UpdateAlarmInput): Alarm | null {
    const fields: string[] = [];
    const params: unknown[] = [];

    if (updates.label !== undefined) {
      fields.push('label = ?');
      params.push(updates.label);
    }
    if (updates.alarmTime !== undefined) {
      fields.push('alarm_time = ?');
      params.push(updates.alarmTime);
    }
    if (updates.recurrence !== undefined) {
      fields.push('recurrence = ?');
      params.push(updates.recurrence);
    }
    if (updates.enabled !== undefined) {
      fields.push('enabled = ?');
      params.push(updates.enabled ? 1 : 0);
    }

    if (fields.length === 0) {
      return this.getById(id);
    }

    const statement = this.db.prepare(
      `UPDATE alarms SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    );
    statement.run(...params, id);
    return this.getById(id);
  }

  delete(id: number): boolean {
    const statement = this.db.prepare('DELETE FROM alarms WHERE id = ?');
    const result = statement.run(id);
    return result.changes > 0;
  }

  private mapRow(row: AlarmRow): Alarm {
    const camel = mapRowToCamelCase<Omit<Alarm, 'enabled'> & { enabled: number }>(row);
    const { enabled, ...rest } = camel as unknown as Omit<Alarm, 'enabled'> & {
      enabled: number;
    };

    return {
      ...rest,
      enabled: booleanFromSQLite(enabled),
    } as Alarm;
  }
}
