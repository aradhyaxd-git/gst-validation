// test/checksum.test.ts
import { describe, it, expect } from "vitest";
import { computeChecksum, verifyChecksum } from "../src/checksum";
import { VALID_GSTINS, INVALID_GSTINS } from "./fixtures";

describe("Checksum Module", () => {
  describe("computeChecksum", () => {
    it("should compute the correct checksum for valid GSTINs", () => {
      expect(computeChecksum("27AAPFU0939F1Z")).toBe("V");
      expect(computeChecksum("27AASCS2460H1Z")).toBe("0");
      expect(computeChecksum("29AAGCB7383J1Z")).toBe("4");
    });

    it("should return empty string for invalid character sets", () => {
      expect(computeChecksum("27AAPFU0939F!Z")).toBe("");
    });
  });

  describe("verifyChecksum", () => {
    it("should return true for valid checksums", () => {
      VALID_GSTINS.forEach((gstin) => {
        expect(verifyChecksum(gstin)).toBe(true);
      });
    });

    it("should return false for invalid checksums", () => {
      INVALID_GSTINS.CHECKSUM.forEach((gstin) => {
        expect(verifyChecksum(gstin)).toBe(false);
      });
    });
  });
});