// test/checksum.test.ts
import { describe, it, expect } from "vitest";
import { computeChecksum, verifyChecksum } from "../src/checksum";
import { VALID_GSTINS, INVALID_GSTINS } from "./fixtures";

describe("Checksum Module", () => {
  describe("computeChecksum", () => {
    it("computes correct checksum for Maharashtra Firm GSTIN", () => {
      expect(computeChecksum("27AAPFU0939F1Z")).toBe("V");
    });

    it("computes correct checksum for Maharashtra Company GSTIN", () => {
      expect(computeChecksum("27AASCS2460H1Z")).toBe("0");
    });

    it("computes correct checksum for Karnataka Company GSTIN", () => {
      expect(computeChecksum("29AAGCB7383J1Z")).toBe("4");
    });

    it("computes correct checksum for Delhi Company GSTIN", () => {
      expect(computeChecksum("07AAACR5055K1Z")).toBe("9");
    });

    it("computes correct checksum for Tamil Nadu Trust GSTIN", () => {
      expect(computeChecksum("33AADTT1231E1Z")).toBe("1");
    });

    it("computes correct checksum for Gujarat AOP GSTIN", () => {
      expect(computeChecksum("24AAAAA1234D1Z")).toBe("O");
    });

    it("computes correct checksum for UP HUF GSTIN", () => {
      expect(computeChecksum("09AAAHH7720R1Z")).toBe("R");
    });

    it("returns empty string for invalid characters (special chars)", () => {
      expect(computeChecksum("27AAPFU0939F!Z")).toBe("");
    });

    it("returns empty string for lowercase input (CHAR_VALUE is uppercase-only)", () => {
      expect(computeChecksum("27aapfu0939f1z")).toBe("");
    });

    it("returns empty string for input with spaces", () => {
      expect(computeChecksum("27 AAPFU0939FZ")).toBe("");
    });

    it("returns empty string for empty string", () => {
      expect(computeChecksum("")).toBe("");
    });

    it("returns empty string for input shorter than 14 chars", () => {
      expect(computeChecksum("27AAPFU")).toBe("");
    });

    it("handles exactly 14 characters and computes correct checksum", () => {
      const first14 = VALID_GSTINS[0].slice(0, 14);
      const result = computeChecksum(first14);
      expect(result).toBe(VALID_GSTINS[0][14]);
    });

    it("ignores characters beyond position 14 (uses only first 14)", () => {
      // A full 15-char GSTIN — computeChecksum reads only indices 0-13
      const result = computeChecksum("27AAPFU0939F1ZV");
      expect(result).toBe("V");
    });
  });

  describe("verifyChecksum", () => {
    it("returns true for every valid GSTIN in fixtures", () => {
      VALID_GSTINS.forEach((gstin) => {
        expect(verifyChecksum(gstin)).toBe(true);
      });
    });

    it("returns false for every invalid-checksum GSTIN in fixtures", () => {
      INVALID_GSTINS.CHECKSUM.forEach((gstin) => {
        expect(verifyChecksum(gstin)).toBe(false);
      });
    });

    it("returns false for empty string", () => {
      expect(verifyChecksum("")).toBe(false);
    });

    it("returns false for a string shorter than 15 chars", () => {
      expect(verifyChecksum("27AAPFU0939F1Z")).toBe(false);
    });

    it("returns false when the last character is swapped", () => {
      // 27AAPFU0939F1ZV → change V to A
      expect(verifyChecksum("27AAPFU0939F1ZA")).toBe(false);
    });

    it("returns false for input containing invalid characters", () => {
      expect(verifyChecksum("27AAPFU0939F!ZV")).toBe(false);
    });

    it("returns true for all-zeros of length 15 (checksum of 14 zeros is 0)", () => {
      // Mathematically: 14 zeros → sum=0 → remainder=0 → checksum char '0'
      // Last char is '0' → matches. So this is TRUE.
      expect(verifyChecksum("000000000000000")).toBe(true);
    });
  });
});