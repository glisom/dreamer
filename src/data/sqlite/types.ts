export interface SQLiteRunResult {
  changes: number;
  lastInsertRowid?: number | bigint;
}

export interface SQLiteStatement<Row = unknown> {
  run(...params: unknown[]): SQLiteRunResult;
  get(...params: unknown[]): Row | undefined;
  all(...params: unknown[]): Row[];
}

export interface SQLiteDatabase {
  exec(sql: string): unknown;
  prepare<Row = unknown>(sql: string): SQLiteStatement<Row>;
}
