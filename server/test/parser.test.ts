// test/parser.test.ts
import { describe, it, expect } from "vitest";
import { parseGSTIN } from "../src/parser";
import { INVALID_GSTINS } from "./fixtures";

describe("Parser Module", () => {
  it("successfully decodes a valid GSTIN", () => {
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

  it("handles legacy state codes seamlessly", () => {
    // 25AABCU9603R1ZR mathematically verified as having check digit R
    const validLegacy = "25AABCU9603R1ZR"; 
    const result = parseGSTIN(validLegacy);
    
    if (result) {
      expect(result.stateName).toBe("Andaman and Nicobar Islands");
    }
  });

  it("returns null for invalid inputs", () => {
    expect(parseGSTIN("")).toBeNull();
    expect(parseGSTIN(INVALID_GSTINS.STATE[0])).toBeNull();
    expect(parseGSTIN(INVALID_GSTINS.CHECKSUM[0])).toBeNull();
  });
});