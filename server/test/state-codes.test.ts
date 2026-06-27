// test/state-codes.test.ts
import { describe, it, expect } from "vitest";
import { getStateByCode, getCodeByState, STATE_CODES } from "../src/state-codes";

describe("State Codes Module", () => {
  describe("getStateByCode", () => {
    it("returns correct StateInfo for a standard state code", () => {
      const result = getStateByCode("27");
      expect(result).toEqual({ name: "Maharashtra", legacy: false });
    });

    it("returns correct StateInfo for various states", () => {
      expect(getStateByCode("07")).toEqual({ name: "Delhi", legacy: false });
      expect(getStateByCode("29")).toEqual({ name: "Karnataka", legacy: false });
      expect(getStateByCode("33")).toEqual({ name: "Tamil Nadu", legacy: false });
      expect(getStateByCode("32")).toEqual({ name: "Kerala", legacy: false });
    });

    it("returns StateInfo with legacy: true for legacy codes", () => {
      const result = getStateByCode("28");
      expect(result).not.toBeNull();
      expect(result!.legacy).toBe(true);
      expect(result!.name).toBe("Andhra Pradesh (old)");
    });

    it("returns StateInfo for code 25 (Andaman — legacy)", () => {
      const result = getStateByCode("25");
      expect(result).toEqual({ name: "Andaman and Nicobar Islands", legacy: true });
    });

    it("returns StateInfo for the newest state code (Ladakh)", () => {
      const result = getStateByCode("38");
      expect(result).toEqual({ name: "Ladakh", legacy: false });
    });

    it("returns null for unknown state codes", () => {
      expect(getStateByCode("00")).toBeNull();
      expect(getStateByCode("99")).toBeNull();
      expect(getStateByCode("50")).toBeNull();
      expect(getStateByCode("39")).toBeNull();
    });

    it("returns null for non-numeric or malformed codes", () => {
      expect(getStateByCode("")).toBeNull();
      expect(getStateByCode("AB")).toBeNull();
      expect(getStateByCode("1")).toBeNull();
      expect(getStateByCode("007")).toBeNull();
    });

    it("handles every code in STATE_CODES correctly", () => {
      for (const [code, expected] of Object.entries(STATE_CODES)) {
        const result = getStateByCode(code);
        expect(result).toEqual(expected);
      }
    });
  });

  describe("getCodeByState", () => {
    it("returns the code for a known state name", () => {
      expect(getCodeByState("Maharashtra")).toBe("27");
      expect(getCodeByState("Delhi")).toBe("07");
      expect(getCodeByState("Karnataka")).toBe("29");
    });

    it("returns the code for union territories", () => {
      expect(getCodeByState("Chandigarh")).toBe("04");
      expect(getCodeByState("Puducherry")).toBe("34");
      expect(getCodeByState("Lakshadweep")).toBe("31");
      expect(getCodeByState("Ladakh")).toBe("38");
    });

    it("returns null for unknown state names", () => {
      expect(getCodeByState("Narnia")).toBeNull();
      expect(getCodeByState("")).toBeNull();
      expect(getCodeByState("maharashtra")).toBeNull(); // case-sensitive
    });

    it("is case-sensitive", () => {
      expect(getCodeByState("MAHARASHTRA")).toBeNull();
      expect(getCodeByState("delhi")).toBeNull();
    });

    it("returns the first matching code for duplicate names", () => {
      // "Andaman and Nicobar Islands" appears under both "25" (legacy) and "35"
      const code = getCodeByState("Andaman and Nicobar Islands");
      expect(code).toBe("25"); // first match in iteration order
    });
  });
});
