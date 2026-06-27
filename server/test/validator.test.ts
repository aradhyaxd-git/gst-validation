// test/validator.test.ts
import { describe, it, expect } from "vitest";
import { isValidGSTIN, validateGSTIN } from "../src/validator";
import { VALID_GSTINS, INVALID_GSTINS } from "./fixtures";

describe("Validator Module", () => {
  // ─── isValidGSTIN ───────────────────────────────────────────────

  describe("isValidGSTIN", () => {
    it("returns true for every valid GSTIN in fixtures", () => {
      VALID_GSTINS.forEach((gstin) => {
        expect(isValidGSTIN(gstin)).toBe(true);
      });
    });

    it("handles lowercase input (normalized internally)", () => {
      expect(isValidGSTIN("27aapfu0939f1zv")).toBe(true);
    });

    it("handles whitespace padding", () => {
      expect(isValidGSTIN("  27AAPFU0939F1ZV  ")).toBe(true);
    });

    it("handles mixed case with whitespace", () => {
      expect(isValidGSTIN("  27AaPfU0939f1Zv  ")).toBe(true);
    });

    it("handles tab and newline padding", () => {
      expect(isValidGSTIN("\t27AAPFU0939F1ZV\n")).toBe(true);
    });

    it("returns false for empty inputs", () => {
      INVALID_GSTINS.EMPTY.forEach((gstin) => {
        expect(isValidGSTIN(gstin)).toBe(false);
      });
    });

    it("returns false for wrong-length inputs", () => {
      INVALID_GSTINS.LENGTH.forEach((gstin) => {
        expect(isValidGSTIN(gstin)).toBe(false);
      });
    });

    it("returns false for format violations", () => {
      INVALID_GSTINS.FORMAT.forEach((gstin) => {
        expect(isValidGSTIN(gstin)).toBe(false);
      });
    });

    it("returns false for invalid state codes", () => {
      INVALID_GSTINS.STATE.forEach((gstin) => {
        expect(isValidGSTIN(gstin)).toBe(false);
      });
    });

    it("returns false for checksum mismatches", () => {
      INVALID_GSTINS.CHECKSUM.forEach((gstin) => {
        expect(isValidGSTIN(gstin)).toBe(false);
      });
    });
  });

  // ─── validateGSTIN ──────────────────────────────────────────────

  describe("validateGSTIN", () => {
    // --- valid inputs ---
    it("returns { valid: true, errors: [] } for every valid GSTIN", () => {
      VALID_GSTINS.forEach((gstin) => {
        const result = validateGSTIN(gstin);
        expect(result.valid).toBe(true);
        expect(result.errors).toEqual([]);
      });
    });

    it("normalizes lowercase before validation", () => {
      const result = validateGSTIN("27aapfu0939f1zv");
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("trims whitespace before validation", () => {
      const result = validateGSTIN("  27AAPFU0939F1ZV  ");
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    // --- EMPTY ---
    it("detects EMPTY for empty string", () => {
      const result = validateGSTIN("");
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(["EMPTY"]);
    });

    it("detects EMPTY for whitespace-only input", () => {
      const result = validateGSTIN("   ");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("EMPTY");
    });

    it("detects EMPTY for tab/newline input", () => {
      const result = validateGSTIN("\t\n");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("EMPTY");
    });

    // --- INVALID_LENGTH ---
    it("detects INVALID_LENGTH for too-short input (14 chars)", () => {
      const result = validateGSTIN(INVALID_GSTINS.LENGTH[0]);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("INVALID_LENGTH");
    });

    it("detects INVALID_LENGTH for too-long input (17 chars)", () => {
      const result = validateGSTIN(INVALID_GSTINS.LENGTH[1]);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("INVALID_LENGTH");
    });

    it("detects INVALID_LENGTH for single character", () => {
      const result = validateGSTIN("A");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("INVALID_LENGTH");
    });

    it("only reports INVALID_LENGTH (not format/state/checksum) for wrong-length input", () => {
      // The validator short-circuits: wrong length → skip regex/state/checksum
      const result = validateGSTIN("27AAPFU0939F1Z"); // 14 chars
      expect(result.errors).toEqual(["INVALID_LENGTH"]);
    });

    // --- INVALID_FORMAT ---
    it("detects INVALID_FORMAT for special characters", () => {
      const result = validateGSTIN("27AAPFU0939F1!V");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("INVALID_FORMAT");
    });

    it("detects INVALID_FORMAT when letters appear in state-code positions", () => {
      const result = validateGSTIN("ZZAAPFU0939F1ZV");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("INVALID_FORMAT");
    });

    it("detects INVALID_FORMAT when entity number is 0", () => {
      const result = validateGSTIN("27AAPFU0939F0ZV");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("INVALID_FORMAT");
    });

    // --- INVALID_STATE_CODE ---
    it("detects INVALID_STATE_CODE for code 99", () => {
      const result = validateGSTIN("99AAPFU0939F1ZV");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("INVALID_STATE_CODE");
    });

    it("detects INVALID_STATE_CODE for code 50", () => {
      const result = validateGSTIN("50AAPFU0939F1ZV");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("INVALID_STATE_CODE");
    });

    // --- INVALID_CHECKSUM ---
    it("detects INVALID_CHECKSUM when check digit is wrong", () => {
      const result = validateGSTIN(INVALID_GSTINS.CHECKSUM[0]);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("INVALID_CHECKSUM");
    });

    it("detects INVALID_CHECKSUM for every checksum fixture", () => {
      INVALID_GSTINS.CHECKSUM.forEach((gstin) => {
        const result = validateGSTIN(gstin);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain("INVALID_CHECKSUM");
      });
    });

    // --- multiple errors in a single call ---
    it("can report INVALID_STATE_CODE and INVALID_CHECKSUM together", () => {
      // State 99 is unknown; checksum also won't match for this input
      const result = validateGSTIN("99AAPFU0939F1ZV");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("INVALID_STATE_CODE");
      expect(result.errors).toContain("INVALID_CHECKSUM");
    });

    // --- return shape invariants ---
    it("always returns an object with { valid: boolean, errors: GSTINErrorCode[] }", () => {
      const validResult = validateGSTIN(VALID_GSTINS[0]);
      expect(validResult).toHaveProperty("valid");
      expect(validResult).toHaveProperty("errors");
      expect(Array.isArray(validResult.errors)).toBe(true);

      const invalidResult = validateGSTIN("");
      expect(invalidResult).toHaveProperty("valid");
      expect(invalidResult).toHaveProperty("errors");
      expect(Array.isArray(invalidResult.errors)).toBe(true);
    });

    it("errors array is always empty when valid is true", () => {
      VALID_GSTINS.forEach((gstin) => {
        const result = validateGSTIN(gstin);
        if (result.valid) {
          expect(result.errors).toEqual([]);
        }
      });
    });

    it("errors array is always non-empty when valid is false", () => {
      const allInvalid = [
        ...INVALID_GSTINS.EMPTY,
        ...INVALID_GSTINS.LENGTH,
        ...INVALID_GSTINS.CHECKSUM,
      ];
      allInvalid.forEach((gstin) => {
        const result = validateGSTIN(gstin);
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });

    // --- never throws ---
    it("never throws for any input", () => {
      const edgeCases = ["", "   ", "A", "123", "null", "undefined", "ZZZZZZZZZZZZZZZ"];
      edgeCases.forEach((input) => {
        expect(() => validateGSTIN(input)).not.toThrow();
      });
    });

    it("handles null/undefined gracefully via ?? fallback", () => {
      // TypeScript types say string, but at runtime callers may pass null/undefined.
      // The ?? guard on line 12 of validator.ts handles this.
      const resultNull = validateGSTIN(null as unknown as string);
      expect(resultNull.valid).toBe(false);
      expect(resultNull.errors).toContain("EMPTY");

      const resultUndefined = validateGSTIN(undefined as unknown as string);
      expect(resultUndefined.valid).toBe(false);
      expect(resultUndefined.errors).toContain("EMPTY");
    });
  });
});