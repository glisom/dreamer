import fs from 'fs';
import path from 'path';
import { SQLiteDatabase } from './types';

export interface MigrationRunnerOptions {
  schemaFiles?: string[];
  schemaDirectory?: string;
  onBeforeExecute?: (filePath: string, sql: string) => void;
  onAfterExecute?: (filePath: string) => void;
}

let hasExecuted = false;

const DEFAULT_SCHEMA_FILES = ['schema.sql'];

export const resetMigrationState = () => {
  hasExecuted = false;
};

export async function runMigrations(
  db: SQLiteDatabase,
  options: MigrationRunnerOptions = {}
): Promise<void> {
  if (hasExecuted) {
    return;
  }

  const schemaDirectory = options.schemaDirectory ?? __dirname;
  const schemaFiles = options.schemaFiles ?? DEFAULT_SCHEMA_FILES;

  for (const file of schemaFiles) {
    const filePath = path.isAbsolute(file) ? file : path.join(schemaDirectory, file);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Schema file not found: ${filePath}`);
    }

    const sql = fs.readFileSync(filePath, 'utf-8');

    options.onBeforeExecute?.(filePath, sql);
    const result = db.exec(sql);
    if (isPromise(result)) {
      await result;
    }
    options.onAfterExecute?.(filePath);
  }

  hasExecuted = true;
}

function isPromise<T = unknown>(value: unknown): value is Promise<T> {
  return !!value && typeof (value as Promise<T>).then === 'function';
}
