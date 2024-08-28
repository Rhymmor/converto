export function required<T>(value: T | null | undefined, label: string): T {
  if (value === null || value === undefined) {
    throw new Error(`Value '${label}' is required`);
  }

  return value;
}
