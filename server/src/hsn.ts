const HSN_VALID_LENGTHS = new Set([4, 6, 8]);
const SAC_LENGTH = 6;
const DIGITS_ONLY = /^\d+$/;


export function isValidHSN(code: string): boolean {
  if (typeof code !== "string") return false;
  const trimmed = code.trim();
  return DIGITS_ONLY.test(trimmed) && HSN_VALID_LENGTHS.has(trimmed.length);
}

export function isValidSAC(code: string): boolean {
  if (typeof code !== "string") return false;
  const trimmed = code.trim();
  return DIGITS_ONLY.test(trimmed) && trimmed.length === SAC_LENGTH;
}