import { validateGSTIN } from "./validator";
import type { ValidationResult } from "./types";

export function validateMany(values: string[]): ValidationResult[] {
  if (!Array.isArray(values)) return [];
  return values.map(validateGSTIN);
}
