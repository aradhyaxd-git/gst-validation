import { describe, it, expect } from "vitest";
import { execSync } from "child_process";
import { resolve } from "path";

// Path to the compiled CLI — must run `npm run build` before testing
const CLI = resolve(__dirname, "../dist/cli.js");

function run(args: string): { stdout: string; stderr: string; code: number } {
  try {
    const stdout = execSync(`node ${CLI} ${args}`, { encoding: "utf8" });
    return { stdout, stderr: "", code: 0 };
  } catch (err: any) {
    return { stdout: err.stdout ?? "", stderr: err.stderr ?? "", code: err.status ?? 1 };
  }
}

describe("CLI smoke tests", () => {
  // These tests require `npm run build` to have been run first.
  // They are intentionally minimal — logic coverage is in unit tests.

  it("exits 0 and prints valid for a known-good GSTIN", () => {
    const { code, stdout } = run("check 27AAPFU0939F1ZV");
    expect(code).toBe(0);
    expect(stdout).toContain("Valid GSTIN");
    expect(stdout).toContain("Maharashtra");
    expect(stdout).toContain("Firm");
  });

  it("exits 1 and prints invalid for a bad checksum", () => {
    const { code, stdout } = run("check 27AAPFU0939F1ZQ");
    expect(code).toBe(1);
    expect(stdout).toContain("Invalid GSTIN");
    expect(stdout).toContain("INVALID_CHECKSUM");
  });

  it("exits 2 and prints usage when no args given", () => {
    const { code, stdout, stderr } = run("");
    expect(code).toBe(2);
    const combined = stdout + stderr;
    expect(combined).toContain("Usage:");
  });

  it("exits 2 for unknown command", () => {
    const { code } = run("validate 27AAPFU0939F1ZV");
    expect(code).toBe(2);
  });

  it("exits 2 when check command is given without a value", () => {
    const { code } = run("check");
    expect(code).toBe(2);
  });

  it("prints all GSTIN fields for a valid input", () => {
    const { stdout } = run("check 27AAPFU0939F1ZV");
    expect(stdout).toContain("State Code");
    expect(stdout).toContain("State Name");
    expect(stdout).toContain("PAN");
    expect(stdout).toContain("Holder Type");
    expect(stdout).toContain("Entity No.");
    expect(stdout).toContain("Checksum");
  });
});