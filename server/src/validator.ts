import { GSTIN_REGEX, GSTIN_LENGTH } from "./constants";
import { verifyChecksum } from "./checksum";
import { getStateByCode } from "./state-codes";
import type { GSTINErrorCode, ValidationResult } from "./types";

function normalize(value: string): string {
  return value.trim().toUpperCase();
}

export function validateGSTIN(value: string): ValidationResult {
  const errors: GSTINErrorCode[] = [];
  const normalized = normalize(value ?? "");

  if (normalized.length === 0) {
    return { valid: false, errors: ["EMPTY"] };
  }

  if (normalized.length !== GSTIN_LENGTH) {
    errors.push("INVALID_LENGTH");
  }

  if (normalized.length === GSTIN_LENGTH) {
    if (!GSTIN_REGEX.test(normalized)) {
      errors.push("INVALID_FORMAT");
    } else {
    
      const stateCode = normalized.slice(0, 2);
      if (getStateByCode(stateCode) === null) {
        errors.push("INVALID_STATE_CODE");
      }

      if (!verifyChecksum(normalized)) {
        errors.push("INVALID_CHECKSUM");
      }
    }
  }

  return { valid: errors.length === 0, errors };
}


export function isValidGSTIN(value: string): boolean {
  return validateGSTIN(value).valid;
}
