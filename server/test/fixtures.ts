// test/fixtures.ts
//
// Ground truth for every test file.
// Every GSTIN below has its checksum verified against the
// Luhn mod-36 implementation in src/checksum.ts.
//
// PAN holder type is determined by the 4th character of the
// embedded PAN (GSTIN position 5, zero-indexed): P=Individual,
// C=Company, H=HUF, F=Firm, A=AOP, T=Trust, B=BOI, L=LocalAuth,
// J=Government, G=LLP.

export const VALID_GSTINS = [
  "27AAPFU0939F1ZV", // Maharashtra — Firm       (pan[3]=F)
  "27AASCS2460H1Z0", // Maharashtra — Company    (pan[3]=C)
  "29AAGCB7383J1Z4", // Karnataka — Company      (pan[3]=C)
  "07AAACR5055K1Z9", // Delhi — Company           (pan[3]=C, checksum=9)
  "33AADTT1231E1Z1", // Tamil Nadu — Trust        (pan[3]=T, checksum=1)
  "24AAAAA1234D1ZO", // Gujarat — AOP             (pan[3]=A, checksum=O)
  "09AAAHH7720R1ZR", // Uttar Pradesh — HUF       (pan[3]=H, checksum=R)
];

export const INVALID_GSTINS = {
  EMPTY: ["", "   ", "\t\n"],
  LENGTH: [
    "27AAPFU0939F1Z",    // 14 chars — too short
    "27AAPFU0939F1ZXX",  // 17 chars — too long
    "A",                 // 1 char
    "27AAPFU0939F1Z22",  // 17 chars — trailing digits
  ],
  FORMAT: [
    "27AAPFU0939F1!V",   // Special char in body
    "ZZAAPFU0939F1ZV",   // Letters where state-code digits should be
    "27AAPFU0939F0ZV",   // Entity number '0' — regex requires [1-9A-Z]
  ],
  STATE: [
    "99AAPFU0939F1ZV",   // 99 — no such state
    "00AAPFU0939F1ZV",   // 00 — no such state
    "50AAPFU0939F1ZV",   // 50 — out of range
  ],
  CHECKSUM: [
    "27AAPFU0939F1ZQ",   // Wrong checksum (V → Q)
    "27AASCS2460H1ZZ",   // Wrong checksum (0 → Z)
    "29AAGCB7383J1Z0",   // Wrong checksum (4 → 0)
  ],
};