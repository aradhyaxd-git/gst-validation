# PRD — GSTIN Validator (open-source, npm)

## 1. Problem

GSTIN (GST Identification Number) validation in JS/TS is currently served by a handful of
abandoned packages — last published 3–6 years ago, no TypeScript, inconsistent error
handling, stale state-code data. There is no free, actively maintained, well-documented
library that developers can `npm install` and trust.

## 2. Goal

Ship a small, dependency-free, TypeScript-first npm package that validates and decodes
GSTINs correctly, with clear error messages, and is genuinely pleasant to read the source
of. Free, MIT-licensed, no monetization.

## 3. Non-goals (do not build these — keeps scope sane)

- No live "is this GSTIN actually registered" lookup baked into core (that needs a paid
  third-party API key — out of scope, maybe a separate optional package later).
- No UI / web app in the core package.
- No monorepo, no microservices, no database. It's a validation library — keep it a
  single npm package.
- No support (in v1) for non-standard GSTIN formats (UN bodies, embassies, TDS-specific
  entity codes) — flagged as a known limitation, not silently guessed at.

## 4. Target users

Devs building: invoicing/billing tools, vendor onboarding forms, accounting software,
e-commerce checkout (B2B GST field), bulk vendor-master cleanup scripts.

## 5. Full feature list (high level)

| # | Feature | Phase |
|---|---|---|
| 1 | `isValidGSTIN()` — boolean check | 1 |
| 2 | `validateGSTIN()` — detailed result with error reason | 1 |
| 3 | `parseGSTIN()` — decode into state, PAN, entity number, checksum | 1 |
| 4 | State code data + `getStateByCode` / `getCodeByState` | 1 |
| 5 | PAN holder-type decode (Individual/Company/Firm/etc.) | 1 |
| 6 | Test suite with real-world fixtures | 1 |
| 7 | README + usage docs | 1 |
| 8 | HSN/SAC code format validators | 2 |
| 9 | CLI (`npx gstin-toolkit check <value>`) | 2 |
| 10 | Bulk validation (array/CSV in, array out) | 2 |
| 11 | Zod schema adapter | 2 |
| 12 | React hook adapter | 2 |
| 13 | Docs site / interactive demo | 2 |

Phase 2 builds **only** on top of what Phase 1 exports — no Phase 2 feature should need
to reach into Phase 1 internals.

---

## 6. Phase 1 — Owner: You (core library)

This phase ships the whole foundation. Everything else depends on it, so it needs to be
finished and documented (types + README) before handing off.

### 6.1 `isValidGSTIN(value: string): boolean`
Quick true/false check. Trims input, uppercases, runs regex + checksum.

### 6.2 `validateGSTIN(value: string): ValidationResult`
```ts
interface ValidationResult {
  valid: boolean;
  errors: GSTINErrorCode[]; // empty if valid
}

type GSTINErrorCode =
  | "EMPTY"
  | "INVALID_LENGTH"
  | "INVALID_FORMAT"        // regex fails
  | "INVALID_STATE_CODE"
  | "INVALID_CHECKSUM";
```
Collects *all* applicable errors in one pass, not just the first one — better for form UX.

### 6.3 `parseGSTIN(value: string): ParsedGSTIN | null`
Returns `null` if invalid (don't throw — see design.md for rationale).
```ts
interface ParsedGSTIN {
  raw: string;
  stateCode: string;
  stateName: string | null;   // null if code is unrecognized/legacy
  pan: string;
  panHolderType: PanHolderType | null;
  entityNumber: string;       // 13th char
  defaultChar: string;        // 14th char, normally "Z"
  checksum: string;
}
```

### 6.4 Checksum algorithm
Implement the GSTN-published Luhn mod-36 algorithm from scratch (see backend.md for the
exact spec). Must match the official sample code's output for all test fixtures.

### 6.5 State code data
A maintained `state-codes.ts` data file, 01–38, including the legacy/merged codes (25, 28)
marked as `legacy: true` rather than removed — see backend.md.

### 6.6 PAN holder-type decode
4th character of the embedded PAN maps to entity type (P, C, H, F, A, T, etc.) — small
static lookup table.

### 6.7 Deliverables checklist for handoff to Phase 2
- [ ] `src/` core implemented, typed, tested (>90% coverage)
- [ ] Public exports finalized in `index.ts` (this is the contract Phase 2 builds on)
- [ ] README with install + 3 usage examples
- [ ] CHANGELOG started
- [ ] Tag `v0.1.0` published to npm

---

## 7. Phase 2 — Owner: Collaborator (extensions)

Everything here imports from the Phase 1 package — never duplicates its logic.

### 7.1 HSN/SAC validators
`isValidHSN(code)`, `isValidSAC(code)` — format-only checks (digit-length rules), same
pattern as core (no live lookup against the HSN master list — that's a huge dataset and
out of scope).

### 7.2 CLI
`npx gstin-toolkit check 27AAB...` → pretty-prints `parseGSTIN()` output to terminal.
Built with a tiny arg parser, no heavy CLI framework needed.

### 7.3 Bulk validation
`validateMany(values: string[]): ValidationResult[]` — thin wrapper that maps
`validateGSTIN` over a list. CSV-in/out is just a usage example in docs, not a feature to
hand-build (let users pipe through `papaparse` themselves).

### 7.4 Zod adapter (separate sub-export, e.g. `gstin-toolkit/zod`)
A `gstinSchema = z.string().refine(isValidGSTIN, ...)` — a few lines, with its own
optional peer dependency on zod.

### 7.5 React hook adapter (`gstin-toolkit/react`)
`useGSTINValidation(value)` → `{ valid, errors, parsed }`, recomputed on change. Optional
peer dependency on react.

### 7.6 Docs site
A single static page (can be plain HTML or a docs framework, collaborator's call) with a
live "paste a GSTIN, see it decoded" demo using the published package.

---

## 8. Success criteria

- `npm install gstin-toolkit` (or chosen name) just works, types included.
- Checksum logic passes every fixture from the GSTN sample code.
- A developer can read `src/checksum.ts` and understand the algorithm without external
  docs — code is the explanation.
- Zero required runtime dependencies in the core package.