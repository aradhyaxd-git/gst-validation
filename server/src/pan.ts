import type { PanHolderType } from "./types";

export const PAN_HOLDER_TYPE: Readonly<Record<string, PanHolderType>> = {
  P: "Individual",
  C: "Company",
  H: "HUF",
  F: "Firm",
  A: "AOP",
  T: "Trust",
  B: "BOI",
  L: "LocalAuthority",
  J: "Government",
  G: "LLP",
};


export function getPanHolderType(char: string): PanHolderType | null {
  return PAN_HOLDER_TYPE[char] ?? null;
}
