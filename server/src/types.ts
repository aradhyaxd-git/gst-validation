
export type GSTINErrorCode =
  | "EMPTY" // Input is blank after trimming
  | "INVALID_LENGTH" // Not exactly 15 characters
  | "INVALID_FORMAT" // Fails the GSTIN regex
  | "INVALID_STATE_CODE" // First 2 chars are not a known state code
  | "INVALID_CHECKSUM"; // Luhn mod-36 checksum mismatch

export interface ValidationResult {
  valid: boolean;
  errors: GSTINErrorCode[];
}

export type PanHolderType =
  | "Individual" // P
  | "Company" // C
  | "HUF" // H — Hindu Undivided Family
  | "Firm" // F
  | "AOP" // A — Association of Persons
  | "Trust" // T
  | "BOI" // B — Body of Individuals
  | "LocalAuthority" // L
  | "Government" // J
  | "LLP"; // G — Limited Liability Partnership



/**
 * A single entry from the state-codes data.
 * legacy: true means the code belonged to a pre-reorganization state/UT.
 * Old GSTINs with these codes are still valid — we flag rather than reject.
 */
export interface StateInfo {
  name: string;
  legacy: boolean;
}

export interface ParsedGSTIN {
    raw: string;
    stateCode: string;
    stateName: string | null;
    pan: string;
    panHolderType: PanHolderType | null;
    entityNumber: string;
    defaultChar: string;
    checksum: string;
}
