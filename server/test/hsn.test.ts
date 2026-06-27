// test/hsn.test.ts
import { describe, it, expect } from "vitest";
import { isValidHSN, isValidSAC } from "../src/hsn";

describe("HSN Validators", () => {
  describe("isValidHSN", () => {
    // Valid cases
    it("accepts a 4-digit HSN", () => expect(isValidHSN("1001")).toBe(true));
    it("accepts a 6-digit HSN", () => expect(isValidHSN("100110")).toBe(true));
    it("accepts an 8-digit HSN", () => expect(isValidHSN("10011010")).toBe(true));
    it("accepts HSN with leading zeros", () => expect(isValidHSN("0101")).toBe(true));
    it("trims whitespace before validating", () => expect(isValidHSN("  1001  ")).toBe(true));

    // Invalid length
    it("rejects 1-digit code", () => expect(isValidHSN("1")).toBe(false));
    it("rejects 3-digit code", () => expect(isValidHSN("100")).toBe(false));
    it("rejects 5-digit code", () => expect(isValidHSN("10011")).toBe(false));
    it("rejects 7-digit code", () => expect(isValidHSN("1001101")).toBe(false));
    it("rejects 9-digit code", () => expect(isValidHSN("100110100")).toBe(false));
    it("rejects empty string", () => expect(isValidHSN("")).toBe(false));

    // Non-digit content
    it("rejects alpha characters", () => expect(isValidHSN("ABCD")).toBe(false));
    it("rejects mixed alphanumeric", () => expect(isValidHSN("10A1")).toBe(false));
    it("rejects special characters", () => expect(isValidHSN("10-01")).toBe(false));
    it("rejects decimal point", () => expect(isValidHSN("10.01")).toBe(false));

    // Runtime safety
    it("returns false for null (JS callers)", () =>
      expect(isValidHSN(null as unknown as string)).toBe(false));
    it("returns false for undefined", () =>
      expect(isValidHSN(undefined as unknown as string)).toBe(false));
    it("returns false for a number passed as value", () =>
      expect(isValidHSN(1001 as unknown as string)).toBe(false));
    it("never throws for any input", () => {
      const cases = ["", "   ", "ABCD", "1234567890", null, undefined, 0];
      cases.forEach((c) => expect(() => isValidHSN(c as unknown as string)).not.toThrow());
    });
  });

  describe("isValidSAC", () => {
    // Valid cases
    it("accepts a 6-digit SAC", () => expect(isValidSAC("996311")).toBe(true));
    it("accepts another 6-digit SAC", () => expect(isValidSAC("998399")).toBe(true));
    it("accepts SAC with leading zeros", () => expect(isValidSAC("000000")).toBe(true));
    it("trims whitespace before validating", () => expect(isValidSAC("  996311  ")).toBe(true));

    // Wrong length
    it("rejects 4-digit code", () => expect(isValidSAC("9963")).toBe(false));
    it("rejects 5-digit code", () => expect(isValidSAC("99631")).toBe(false));
    it("rejects 7-digit code", () => expect(isValidSAC("9963110")).toBe(false));
    it("rejects 8-digit code", () => expect(isValidSAC("99631100")).toBe(false));
    it("rejects empty string", () => expect(isValidSAC("")).toBe(false));

    // Non-digit content
    it("rejects alpha characters", () => expect(isValidSAC("ABCDEF")).toBe(false));
    it("rejects mixed content", () => expect(isValidSAC("99A311")).toBe(false));
    it("rejects special chars", () => expect(isValidSAC("99-311")).toBe(false));

    // Runtime safety
    it("returns false for null", () =>
      expect(isValidSAC(null as unknown as string)).toBe(false));
    it("returns false for undefined", () =>
      expect(isValidSAC(undefined as unknown as string)).toBe(false));
    it("never throws for any input", () => {
      const cases = ["", "   ", "ABCDEF", "123456789", null, undefined];
      cases.forEach((c) => expect(() => isValidSAC(c as unknown as string)).not.toThrow());
    });
  });
});