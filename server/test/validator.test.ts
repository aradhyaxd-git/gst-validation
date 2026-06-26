// test/validator.test.ts
import { describe, it, expect } from "vitest";
import { isValidGSTIN, validateGSTIN } from "../src/validator";
import { VALID_GSTINS, INVALID_GSTINS } from "./fixtures";

describe("Validator Module", () => {
  describe("isValidGSTIN", () => {
    it("returns true for valid GSTINs", () => {
      VALID_GSTINS.forEach((gstin) => {
        expect(isValidGSTIN(gstin)).toBe(true);
      });
    });

    it("handles lowercase and whitespace padding", () => {
      expect(isValidGSTIN("  27aapfu0939f1zv  ")).toBe(true);
    });

    it("returns false for invalid GSTINs", () => {
      expect(isValidGSTIN(INVALID_GSTINS.LENGTH[0])).toBe(false);
      expect(isValidGSTIN(INVALID_GSTINS.STATE[0])).toBe(false);
    });
  });

  describe("validateGSTIN", () => {
    it("returns valid: true with empty errors for correct GSTINs", () => {
      const result = validateGSTIN(VALID_GSTINS[0]);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("detects EMPTY", () => {
      const result = validateGSTIN("   ");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("EMPTY");
    });

    it("detects INVALID_LENGTH", () => {
      const result = validateGSTIN(INVALID_GSTINS.LENGTH[0]);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("INVALID_LENGTH");
    });

    it("detects INVALID_FORMAT", () => {
      const result = validateGSTIN("27AAPFU0939F1Z!");
      expect(result.valid).toBe(false);
      // Fails both regex and checksum computation due to invalid char
      expect(result.errors).toContain("INVALID_FORMAT"); 
    });

    it("detects INVALID_STATE_CODE", () => {
      const result = validateGSTIN("99AAPFU0939F1ZV");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("INVALID_STATE_CODE");
    });

    it("detects INVALID_CHECKSUM", () => {
      const result = validateGSTIN(INVALID_GSTINS.CHECKSUM[0]);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("INVALID_CHECKSUM");
    });
  });
});