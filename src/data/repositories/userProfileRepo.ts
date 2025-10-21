import { SQLiteDatabase } from '../sqlite/types';
import { UserProfile } from './types';
import { mapRowToCamelCase } from './utils';

interface UserProfileRow {
  id: number;
  display_name: string;
  timezone: string | null;
  birthdate: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpsertUserProfileInput {
  displayName: string;
  timezone?: string | null;
  birthdate?: string | null;
  bio?: string | null;
}

export class UserProfileRepository {
  constructor(private readonly db: SQLiteDatabase) {}

  getProfile(): UserProfile | null {
    const statement = this.db.prepare<UserProfileRow>('SELECT * FROM user_profile LIMIT 1');
    const row = statement.get();
    return row ? this.mapRow(row) : null;
  }

  upsertProfile(input: UpsertUserProfileInput): UserProfile {
    const current = this.getProfile();

    if (current) {
      const statement = this.db.prepare(
        `UPDATE user_profile SET display_name = ?, timezone = ?, birthdate = ?, bio = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
      );
      statement.run(
        input.displayName,
        input.timezone ?? null,
        input.birthdate ?? null,
        input.bio ?? null,
        current.id
      );
      return this.getProfile()!;
    }

    const statement = this.db.prepare(
      `INSERT INTO user_profile (display_name, timezone, birthdate, bio) VALUES (?, ?, ?, ?)`
    );
    const result = statement.run(
      input.displayName,
      input.timezone ?? null,
      input.birthdate ?? null,
      input.bio ?? null
    );
    const id = Number(result.lastInsertRowid);
    const createdStatement = this.db.prepare<UserProfileRow>('SELECT * FROM user_profile WHERE id = ?');
    const row = createdStatement.get(id);
    return this.mapRow(row!);
  }

  deleteProfile(): boolean {
    const profile = this.getProfile();
    if (!profile) {
      return false;
    }
    const statement = this.db.prepare('DELETE FROM user_profile WHERE id = ?');
    const result = statement.run(profile.id);
    return result.changes > 0;
  }

  private mapRow(row: UserProfileRow): UserProfile {
    return mapRowToCamelCase<UserProfile>(row);
  }
}
