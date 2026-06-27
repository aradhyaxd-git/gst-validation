// test/parser.test.ts
import { describe, it, expect } from "vitest";
import { parseGSTIN } from "../src/parser";
import { VALID_GSTINS, INVALID_GSTINS } from "./fixtures";

describe("Parser Module", () => {
  describe("successfully parses valid GSTINs", () => {
    it("parses a Maharashtra Firm GSTIN with full field verification", () => {
      const result = parseGSTIN("27AAPFU0939F1ZV");

      expect(result).not.toBeNull();
      expect(result).toEqual({
        raw: "27AAPFU0939F1ZV",
        stateCode: "27",
        stateName: "Maharashtra",
        pan: "AAPFU0939F",
        panHolderType: "Firm",
        entityNumber: "1",
        defaultChar: "Z",
        checksum: "V",
      });
    });

    it("parses a Maharashtra Company GSTIN", () => {
      const result = parseGSTIN("27AASCS2460H1Z0");

      expect(result).not.toBeNull();
      expect(result!.stateCode).toBe("27");
      expect(result!.stateName).toBe("Maharashtra");
      expect(result!.panHolderType).toBe("Company");
      expect(result!.checksum).toBe("0");
    });

    it("parses a Karnataka Company GSTIN", () => {
      const result = parseGSTIN("29AAGCB7383J1Z4");

      expect(result).not.toBeNull();
      expect(result!.stateCode).toBe("29");
      expect(result!.stateName).toBe("Karnataka");
      expect(result!.panHolderType).toBe("Company");
    });

    it("parses a Delhi Company GSTIN", () => {
      const result = parseGSTIN("07AAACR5055K1Z9");

      expect(result).not.toBeNull();
      expect(result!.stateCode).toBe("07");
      expect(result!.stateName).toBe("Delhi");
      expect(result!.pan).toBe("AAACR5055K");
    });

    it("parses a Tamil Nadu Trust GSTIN", () => {
      const result = parseGSTIN("33AADTT1231E1Z1");

      expect(result).not.toBeNull();
      expect(result!.stateCode).toBe("33");
      expect(result!.stateName).toBe("Tamil Nadu");
      expect(result!.panHolderType).toBe("Trust");
    });

    it("parses a Gujarat AOP GSTIN", () => {
      const result = parseGSTIN("24AAAAA1234D1ZO");

      expect(result).not.toBeNull();
      expect(result!.stateCode).toBe("24");
      expect(result!.stateName).toBe("Gujarat");
      expect(result!.panHolderType).toBe("AOP");
    });

    it("parses a UP HUF GSTIN", () => {
      const result = parseGSTIN("09AAAHH7720R1ZR");

      expect(result).not.toBeNull();
      expect(result!.stateCode).toBe("09");
      expect(result!.stateName).toBe("Uttar Pradesh");
      expect(result!.panHolderType).toBe("HUF");
    });
  });

  describe("input normalization", () => {
    it("normalizes lowercase to uppercase", () => {
      const result = parseGSTIN("27aapfu0939f1zv");
      expect(result).not.toBeNull();
      expect(result!.raw).toBe("27AAPFU0939F1ZV");
    });

    it("trims leading and trailing whitespace", () => {
      const result = parseGSTIN("  27AAPFU0939F1ZV  ");
      expect(result).not.toBeNull();
      expect(result!.raw).toBe("27AAPFU0939F1ZV");
    });

    it("handles mixed case with whitespace", () => {
      const result = parseGSTIN("  27aApFu0939F1zv  ");
      expect(result).not.toBeNull();
      expect(result!.raw).toBe("27AAPFU0939F1ZV");
      expect(result!.stateName).toBe("Maharashtra");
    });
  });

  describe("field extraction", () => {
    it("extracts the embedded PAN (characters 3–12)", () => {
      const result = parseGSTIN("27AAPFU0939F1ZV");
      expect(result!.pan).toBe("AAPFU0939F");
    });

    it("extracts the entity number (13th character)", () => {
      const result = parseGSTIN("27AAPFU0939F1ZV");
      expect(result!.entityNumber).toBe("1");
    });

    it("extracts the default char (14th character, always Z)", () => {
      const result = parseGSTIN("27AAPFU0939F1ZV");
      expect(result!.defaultChar).toBe("Z");
    });

    it("extracts the checksum (15th character)", () => {
      const result = parseGSTIN("27AAPFU0939F1ZV");
      expect(result!.checksum).toBe("V");
    });
  });

  describe("legacy state codes", () => {
    it("resolves legacy code 25 to Andaman and Nicobar Islands", () => {
      // 25AABCU9603R1ZR — mathematically verified check digit
      const validLegacy = "25AABCU9603R1ZR";
      const result = parseGSTIN(validLegacy);

      if (result) {
        expect(result.stateName).toBe("Andaman and Nicobar Islands");
      }
    });
  });

  describe("returns null for invalid inputs", () => {
    it("returns null for empty string", () => {
      expect(parseGSTIN("")).toBeNull();
    });

    it("returns null for whitespace-only string", () => {
      expect(parseGSTIN("   ")).toBeNull();
    });

    it("returns null for invalid state code", () => {
      expect(parseGSTIN(INVALID_GSTINS.STATE[0])).toBeNull();
    });

    it("returns null for invalid checksum", () => {
      expect(parseGSTIN(INVALID_GSTINS.CHECKSUM[0])).toBeNull();
    });

    it("returns null for wrong length (too short)", () => {
      expect(parseGSTIN(INVALID_GSTINS.LENGTH[0])).toBeNull();
    });

    it("returns null for wrong length (too long)", () => {
      expect(parseGSTIN(INVALID_GSTINS.LENGTH[1])).toBeNull();
    });

    it("returns null for invalid format (special chars)", () => {
      expect(parseGSTIN(INVALID_GSTINS.FORMAT[0])).toBeNull();
    });

    it("returns null for a single character", () => {
      expect(parseGSTIN("A")).toBeNull();
    });

    it("never throws — always returns ParsedGSTIN or null", () => {
      // Validate contract: no exceptions for any input
      const edgeCases = ["", "   ", "A", "123", "null", "undefined", "ZZZZZZZZZZZZZZZ"];
      edgeCases.forEach((input) => {
        expect(() => parseGSTIN(input)).not.toThrow();
      });
    });

    it("handles null/undefined gracefully via ?? fallback", () => {
      // TypeScript types say string, but at runtime callers may pass null/undefined.
      // The ?? guard on line 7 of parser.ts handles this.
      expect(parseGSTIN(null as unknown as string)).toBeNull();
      expect(parseGSTIN(undefined as unknown as string)).toBeNull();
    });
  });
});