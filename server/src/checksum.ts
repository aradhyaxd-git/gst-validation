import { CHAR_VALUE, VALUE_CHAR, CHECKSUM_WEIGHTS } from "./constants";
export function computeChecksum(gstin: string): string {
  let sum = 0;

  for (let i = 0; i < 14; i++) {
    const charVal = CHAR_VALUE[gstin[i]];

    if (charVal === undefined) {
      return "";
    }

    const product = charVal * CHECKSUM_WEIGHTS[i];
    sum += Math.floor(product / 36) + (product % 36);
  }

  const remainder = (36 - (sum % 36)) % 36;
  return VALUE_CHAR[remainder] ?? "";
}


export function verifyChecksum(gstin: string): boolean {
  const expected = computeChecksum(gstin);
  return expected !== "" && expected === gstin[14];
}
