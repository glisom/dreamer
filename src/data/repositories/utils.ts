export type RowRecord = Record<string, unknown>;

export function mapRowToCamelCase<T>(row: RowRecord): T {
  const result: RowRecord = {};

  for (const [key, value] of Object.entries(row)) {
    const camelKey = key.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase());
    result[camelKey] = value;
  }

  return result as T;
}

export function booleanFromSQLite(value: unknown): boolean {
  return value === 1 || value === true;
}
