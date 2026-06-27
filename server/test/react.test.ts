
import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useGSTINValidation } from "../src/react";
import { VALID_GSTINS, INVALID_GSTINS } from "./fixtures";

describe("useGSTINValidation hook", () => {
  describe("valid GSTIN", () => {
    it("returns valid: true for a valid GSTIN", () => {
      const { result } = renderHook(() => useGSTINValidation(VALID_GSTINS[0]));
      expect(result.current.valid).toBe(true);
    });

    it("returns empty errors array for a valid GSTIN", () => {
      const { result } = renderHook(() => useGSTINValidation(VALID_GSTINS[0]));
      expect(result.current.errors).toEqual([]);
    });

    it("returns parsed object for a valid GSTIN", () => {
      const { result } = renderHook(() => useGSTINValidation("27AAPFU0939F1ZV"));
      expect(result.current.parsed).not.toBeNull();
      expect(result.current.parsed?.stateName).toBe("Maharashtra");
      expect(result.current.parsed?.panHolderType).toBe("Firm");
    });

    it("returns valid for all fixture GSTINs", () => {
      VALID_GSTINS.forEach((gstin) => {
        const { result } = renderHook(() => useGSTINValidation(gstin));
        expect(result.current.valid).toBe(true);
        expect(result.current.parsed).not.toBeNull();
      });
    });
  });

  describe("invalid GSTIN", () => {
    it("returns valid: false for empty string", () => {
      const { result } = renderHook(() => useGSTINValidation(""));
      expect(result.current.valid).toBe(false);
    });

    it("returns parsed: null for invalid GSTIN", () => {
      const { result } = renderHook(() => useGSTINValidation(""));
      expect(result.current.parsed).toBeNull();
    });

    it("returns EMPTY error for empty string", () => {
      const { result } = renderHook(() => useGSTINValidation(""));
      expect(result.current.errors).toContain("EMPTY");
    });

    it("returns INVALID_CHECKSUM for checksum mismatch", () => {
      const { result } = renderHook(() => useGSTINValidation(INVALID_GSTINS.CHECKSUM[0]));
      expect(result.current.errors).toContain("INVALID_CHECKSUM");
    });

    it("returns INVALID_STATE_CODE for bad state", () => {
      const { result } = renderHook(() => useGSTINValidation(INVALID_GSTINS.STATE[0]));
      expect(result.current.errors).toContain("INVALID_STATE_CODE");
    });

    it("returns INVALID_LENGTH for wrong length", () => {
      const { result } = renderHook(() => useGSTINValidation(INVALID_GSTINS.LENGTH[0]));
      expect(result.current.errors).toContain("INVALID_LENGTH");
    });
  });

  describe("recomputation behavior", () => {
    it("updates result when value changes from invalid to valid", () => {
      let value = INVALID_GSTINS.CHECKSUM[0];
      const { result, rerender } = renderHook(() => useGSTINValidation(value));

      expect(result.current.valid).toBe(false);

      value = VALID_GSTINS[0];
      rerender();

      expect(result.current.valid).toBe(true);
      expect(result.current.parsed).not.toBeNull();
    });

    it("updates result when value changes from valid to empty", () => {
      let value = VALID_GSTINS[0];
      const { result, rerender } = renderHook(() => useGSTINValidation(value));

      expect(result.current.valid).toBe(true);

      value = "";
      rerender();

      expect(result.current.valid).toBe(false);
      expect(result.current.parsed).toBeNull();
    });
  });

  describe("return shape", () => {
    it("always returns an object with valid, errors, and parsed", () => {
      const { result } = renderHook(() => useGSTINValidation(""));
      expect(result.current).toHaveProperty("valid");
      expect(result.current).toHaveProperty("errors");
      expect(result.current).toHaveProperty("parsed");
    });

    it("errors is always an array", () => {
      const inputs = [VALID_GSTINS[0], "", INVALID_GSTINS.CHECKSUM[0]];
      inputs.forEach((input) => {
        const { result } = renderHook(() => useGSTINValidation(input));
        expect(Array.isArray(result.current.errors)).toBe(true);
      });
    });

    it("parsed is null when valid is false", () => {
      const { result } = renderHook(() => useGSTINValidation(INVALID_GSTINS.STATE[0]));
      expect(result.current.valid).toBe(false);
      expect(result.current.parsed).toBeNull();
    });
  });
});