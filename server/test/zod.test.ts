import { describe, it, expect } from "vitest";
import { z } from "zod";
import { gstinSchema, optionalGstinSchema } from "../src/zod";
import { VALID_GSTINS, INVALID_GSTINS } from "./fixtures";

describe("Zod Adapter", () => {
  describe("gstinSchema", () => {
    describe("valid inputs", () => {
      it("passes parse for every valid GSTIN fixture", () => {
        VALID_GSTINS.forEach((gstin) => {
          expect(() => gstinSchema.parse(gstin)).not.toThrow();
        });
      });

      it("returns the GSTIN value unchanged on success", () => {
        const result = gstinSchema.parse(VALID_GSTINS[0]);
        expect(result).toBe(VALID_GSTINS[0]);
      });

      it("safeParse returns success: true for valid GSTIN", () => {
        const result = gstinSchema.safeParse(VALID_GSTINS[0]);
        expect(result.success).toBe(true);
      });
    });

    describe("invalid inputs — throws ZodError", () => {
      it("throws for empty string", () => {
        expect(() => gstinSchema.parse("")).toThrow(z.ZodError);
      });

      it("throws for invalid state code", () => {
        expect(() => gstinSchema.parse(INVALID_GSTINS.STATE[0])).toThrow(z.ZodError);
      });

      it("throws for invalid checksum", () => {
        expect(() => gstinSchema.parse(INVALID_GSTINS.CHECKSUM[0])).toThrow(z.ZodError);
      });

      it("throws for wrong length", () => {
        expect(() => gstinSchema.parse(INVALID_GSTINS.LENGTH[0])).toThrow(z.ZodError);
      });

      it("throws for non-string input (number)", () => {
        expect(() => gstinSchema.parse(27 as unknown as string)).toThrow(z.ZodError);
      });

      it("throws for null", () => {
        expect(() => gstinSchema.parse(null)).toThrow(z.ZodError);
      });
    });

    describe("error message quality", () => {
      it("includes an error code in the message for empty input", () => {
        const result = gstinSchema.safeParse("");
        expect(result.success).toBe(false);
        if (!result.success) {
          const msg = result.error.issues[0].message;
          expect(msg).toContain("EMPTY");
        }
      });

      it("includes INVALID_CHECKSUM in the message for checksum mismatch", () => {
        const result = gstinSchema.safeParse(INVALID_GSTINS.CHECKSUM[0]);
        expect(result.success).toBe(false);
        if (!result.success) {
          const msg = result.error.issues[0].message;
          expect(msg).toContain("INVALID_CHECKSUM");
        }
      });

      it("includes INVALID_STATE_CODE in the message for bad state", () => {
        const result = gstinSchema.safeParse(INVALID_GSTINS.STATE[0]);
        expect(result.success).toBe(false);
        if (!result.success) {
          const msg = result.error.issues[0].message;
          expect(msg).toContain("INVALID_STATE_CODE");
        }
      });
    });

    describe("composition with z.object", () => {
      const schema = z.object({ gstin: gstinSchema });

      it("passes for valid nested GSTIN", () => {
        expect(() => schema.parse({ gstin: VALID_GSTINS[0] })).not.toThrow();
      });

      it("fails for invalid nested GSTIN", () => {
        expect(() => schema.parse({ gstin: "" })).toThrow(z.ZodError);
      });

      it("includes the field path in the ZodError", () => {
        const result = schema.safeParse({ gstin: "" });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].path).toContain("gstin");
        }
      });
    });
  });

  describe("optionalGstinSchema", () => {
    it("passes for empty string", () => {
      expect(() => optionalGstinSchema.parse("")).not.toThrow();
    });

    it("passes for valid GSTIN", () => {
      expect(() => optionalGstinSchema.parse(VALID_GSTINS[0])).not.toThrow();
    });

    it("fails for non-empty invalid GSTIN", () => {
      expect(() => optionalGstinSchema.parse(INVALID_GSTINS.CHECKSUM[0])).toThrow(z.ZodError);
    });

    it("fails for wrong-length non-empty string", () => {
      expect(() => optionalGstinSchema.parse(INVALID_GSTINS.LENGTH[0])).toThrow(z.ZodError);
    });
  });
});