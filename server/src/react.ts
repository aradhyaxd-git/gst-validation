import { useMemo } from "react";
import { validateGSTIN, parseGSTIN } from "gstin-toolkit";
import type { ValidationResult, ParsedGSTIN } from "gstin-toolkit";

export interface GSTINValidationResult {
  valid: boolean;
  errors: ValidationResult["errors"];
  parsed: ParsedGSTIN | null;
}

export function useGSTINValidation(value: string): GSTINValidationResult {
  return useMemo(() => {
    const { valid, errors } = validateGSTIN(value);
    const parsed = valid ? parseGSTIN(value) : null;
    return { valid, errors, parsed };
  }, [value]);
}