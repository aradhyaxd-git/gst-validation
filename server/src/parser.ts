import { validateGSTIN } from "./validator";
import { getStateByCode } from "./state-codes";
import { getPanHolderType } from "./pan";
import type { ParsedGSTIN } from "./types";

export function parseGSTIN(value: string): ParsedGSTIN | null {
  const normalized = (value ?? "").trim().toUpperCase();

  if (!validateGSTIN(normalized).valid) {
    return null;
  }

  const stateCode = normalized.slice(0, 2);
  const pan = normalized.slice(2, 12);
  const entityNumber = normalized[12];
  const defaultChar = normalized[13];
  const checksum = normalized[14];

  const stateInfo = getStateByCode(stateCode);

  const panHolderType = getPanHolderType(pan[3]);

  return {
    raw: normalized,
    stateCode,
    stateName: stateInfo ? stateInfo.name : null,
    pan,
    panHolderType,
    entityNumber,
    defaultChar,
    checksum,
  };
}
