// test/pan.test.ts
import { describe, it, expect } from "vitest";
import { getPanHolderType, PAN_HOLDER_TYPE } from "../src/pan";

describe("PAN Module", () => {
  describe("getPanHolderType", () => {
    it("returns 'Individual' for 'P'", () => {
      expect(getPanHolderType("P")).toBe("Individual");
    });

    it("returns 'Company' for 'C'", () => {
      expect(getPanHolderType("C")).toBe("Company");
    });

    it("returns 'HUF' for 'H'", () => {
      expect(getPanHolderType("H")).toBe("HUF");
    });

    it("returns 'Firm' for 'F'", () => {
      expect(getPanHolderType("F")).toBe("Firm");
    });

    it("returns 'AOP' for 'A'", () => {
      expect(getPanHolderType("A")).toBe("AOP");
    });

    it("returns 'Trust' for 'T'", () => {
      expect(getPanHolderType("T")).toBe("Trust");
    });

    it("returns 'BOI' for 'B'", () => {
      expect(getPanHolderType("B")).toBe("BOI");
    });

    it("returns 'LocalAuthority' for 'L'", () => {
      expect(getPanHolderType("L")).toBe("LocalAuthority");
    });

    it("returns 'Government' for 'J'", () => {
      expect(getPanHolderType("J")).toBe("Government");
    });

    it("returns 'LLP' for 'G'", () => {
      expect(getPanHolderType("G")).toBe("LLP");
    });

    it("returns null for unknown characters", () => {
      expect(getPanHolderType("X")).toBeNull();
      expect(getPanHolderType("Z")).toBeNull();
      expect(getPanHolderType("1")).toBeNull();
      expect(getPanHolderType("")).toBeNull();
    });

    it("is case-sensitive (lowercase returns null)", () => {
      expect(getPanHolderType("p")).toBeNull();
      expect(getPanHolderType("c")).toBeNull();
      expect(getPanHolderType("f")).toBeNull();
    });

    it("covers every entry in PAN_HOLDER_TYPE", () => {
      for (const [char, expected] of Object.entries(PAN_HOLDER_TYPE)) {
        expect(getPanHolderType(char)).toBe(expected);
      }
    });
  });
});
