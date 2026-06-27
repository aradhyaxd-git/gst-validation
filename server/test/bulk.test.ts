import { describe, it, expect } from "vitest";
import { validateMany } from "../src/bulk";
import { VALID_GSTINS, INVALID_GSTINS } from "./fixtures";

describe("Bulk Validation Module", () => {
  describe("validateMany — basic behavior", () => {
    it("returns an empty array for empty input", () => {
      expect(validateMany([])).toEqual([]);
    });

    it("returns a single valid result for a single valid GSTIN", () => {
      const [result] = validateMany([VALID_GSTINS[0]]);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("returns a single invalid result for a single invalid GSTIN", () => {
      const [result] = validateMany([INVALID_GSTINS.CHECKSUM[0]]);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("validates all valid GSTINs from fixtures", () => {
      const results = validateMany(VALID_GSTINS);
      results.forEach((r) => {
        expect(r.valid).toBe(true);
        expect(r.errors).toEqual([]);
      });
    });

    it("validates all checksum-invalid GSTINs from fixtures", () => {
      const results = validateMany(INVALID_GSTINS.CHECKSUM);
      results.forEach((r) => {
        expect(r.valid).toBe(false);
        expect(r.errors).toContain("INVALID_CHECKSUM");
      });
    });
  });

  describe("validateMany — index alignment", () => {
    it("preserves input order in output", () => {
      const input = [VALID_GSTINS[0], INVALID_GSTINS.CHECKSUM[0], VALID_GSTINS[1]];
      const results = validateMany(input);

      expect(results).toHaveLength(3);
      expect(results[0].valid).toBe(true);
      expect(results[1].valid).toBe(false);
      expect(results[2].valid).toBe(true);
    });

    it("output length always equals input length", () => {
      const mixed = [...VALID_GSTINS, ...INVALID_GSTINS.CHECKSUM, ...INVALID_GSTINS.STATE];
      const results = validateMany(mixed);
      expect(results).toHaveLength(mixed.length);
    });

    it("handles duplicate GSTINs without deduplication", () => {
      const gstin = VALID_GSTINS[0];
      const results = validateMany([gstin, gstin, gstin]);
      expect(results).toHaveLength(3);
      results.forEach((r) => expect(r.valid).toBe(true));
    });
  });

  describe("validateMany — mixed input", () => {
    it("handles a realistic mixed batch correctly", () => {
      const batch = [
        VALID_GSTINS[0],               // valid
        "",                            // EMPTY
        INVALID_GSTINS.LENGTH[0],      // INVALID_LENGTH
        VALID_GSTINS[1],               // valid
        INVALID_GSTINS.STATE[0],       // INVALID_STATE_CODE
        INVALID_GSTINS.CHECKSUM[0],    // INVALID_CHECKSUM
      ];
      const results = validateMany(batch);

      expect(results[0].valid).toBe(true);
      expect(results[1].errors).toContain("EMPTY");
      expect(results[2].errors).toContain("INVALID_LENGTH");
      expect(results[3].valid).toBe(true);
      expect(results[4].errors).toContain("INVALID_STATE_CODE");
      expect(results[5].errors).toContain("INVALID_CHECKSUM");
    });

    it("normalizes whitespace within each entry (delegates to validateGSTIN)", () => {
      const results = validateMany(["  27AAPFU0939F1ZV  "]);
      expect(results[0].valid).toBe(true);
    });
  });

  describe("validateMany — runtime safety", () => {
    it("returns [] for null input without throwing", () => {
      expect(() => validateMany(null as unknown as string[])).not.toThrow();
      expect(validateMany(null as unknown as string[])).toEqual([]);
    });

    it("returns [] for undefined input without throwing", () => {
      expect(() => validateMany(undefined as unknown as string[])).not.toThrow();
      expect(validateMany(undefined as unknown as string[])).toEqual([]);
    });

    it("returns [] for a non-array object", () => {
      expect(validateMany({} as unknown as string[])).toEqual([]);
    });

    it("handles a large batch (1000 items) without errors", () => {
      const batch = Array(1000).fill(VALID_GSTINS[0]);
      const results = validateMany(batch);
      expect(results).toHaveLength(1000);
      results.forEach((r) => expect(r.valid).toBe(true));
    });
  });

  describe("validateMany — return shape", () => {
    it("every result has a valid boolean and errors array", () => {
      const results = validateMany([...VALID_GSTINS, ...INVALID_GSTINS.CHECKSUM]);
      results.forEach((r) => {
        expect(typeof r.valid).toBe("boolean");
        expect(Array.isArray(r.errors)).toBe(true);
      });
    });

    it("valid results always have empty errors array", () => {
      validateMany(VALID_GSTINS).forEach((r) => {
        if (r.valid) expect(r.errors).toEqual([]);
      });
    });

    it("invalid results always have non-empty errors array", () => {
      const allInvalid = [
        ...INVALID_GSTINS.EMPTY,
        ...INVALID_GSTINS.LENGTH,
        ...INVALID_GSTINS.CHECKSUM,
      ];
      validateMany(allInvalid).forEach((r) => {
        expect(r.valid).toBe(false);
        expect(r.errors.length).toBeGreaterThan(0);
      });
    });
  });
});
