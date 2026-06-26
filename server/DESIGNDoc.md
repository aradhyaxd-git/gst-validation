# Design Doc — GSTIN Validator

## 1. Architecture: keep it one package

No monorepo, no microservices. A single npm package with multiple **subpath exports** is
enough — this gets you the "core stays light, extras are optional" benefit without the
tooling overhead of a monorepo.

```
gstin-toolkit         -> core (Phase 1)
gstin-toolkit/zod     -> Phase 2, optional peer dep on zod
gstin-toolkit/react   -> Phase 2, optional peer dep on react
gstin-toolkit/cli     -> Phase 2, bin entry
```

If it later genuinely outgrows this (e.g. the docs site needs its own deploy pipeline),
split *that* out — don't pre-split now.

## 2. Folder structure

```
src/
  constants.ts        # regex, char→value map for mod-36, weight pattern
  checksum.ts          # checksum calculation + verification
  state-codes.ts        # state code data + lookups
  pan.ts               # PAN holder-type decode
  parser.ts            # parseGSTIN
  validator.ts         # isValidGSTIN, validateGSTIN
  types.ts             # shared TS interfaces
  index.ts             # public exports (the contract)
  zod.ts               # Phase 2, separate entry
  react.ts             # Phase 2, separate entry
  cli.ts               # Phase 2, separate entry
test/
  fixtures.ts          # list of real-world valid/invalid GSTINs with expected results
  checksum.test.ts
  validator.test.ts
  parser.test.ts
```

Flat, one concept per file. No `utils/`, no `helpers/`, no nested folders — there isn't
enough code here to need them.

## 3. Public API surface (the contract between Phase 1 and Phase 2)

`index.ts` exports exactly:
```ts
export { isValidGSTIN, validateGSTIN } from "./validator";
export { parseGSTIN } from "./parser";
export { getStateByCode, getCodeByState } from "./state-codes";
export type { ValidationResult, ParsedGSTIN, GSTINErrorCode, PanHolderType } from "./types";
```
Phase 2 code only ever imports from this list — never from internal files directly. If
Phase 2 needs something not exported here, that's a sign Phase 1's contract needs a small
addition (discuss before silently reaching into internals).

## 4. Error handling strategy: return values, not exceptions

- `parseGSTIN` returns `null` on invalid input, never throws.
- `validateGSTIN` always returns a `ValidationResult`, never throws.
- Reserve `throw` only for genuine programmer errors (e.g. calling with a non-string
  type in JS usage) — not for "this GSTIN is invalid," which is an expected, common case
  a form will hit constantly.

Rationale: a validator that throws on bad input forces every caller into try/catch for
normal operation. Returning a typed result keeps call sites simple.

## 5. Data design

Two small static data files, plain TS objects (no JSON-fetching, no async):

- `state-codes.ts`: `Record<string, { name: string; legacy?: boolean }>` — codes 01–38,
  with 25 and 28 marked `legacy: true` rather than omitted (so old GSTINs still parse
  with a clear flag instead of silently returning `stateName: null`).
- `pan.ts`: `Record<string, PanHolderType>` for the 4th-PAN-character lookup
  (P, C, H, F, A, T, B, J, G, L — see backend.md for the full table).

Both are small enough to hardcode and review in a PR — no external data source needed.

## 6. Naming conventions

- Functions: `verbNoun` — `isValidGSTIN`, `parseGSTIN`, `validateGSTIN`.
- Types: PascalCase, no `I` prefix (`ParsedGSTIN`, not `IParsedGSTIN`).
- Error codes: SCREAMING_SNAKE_CASE strings, not numeric codes — readable in test output
  and in any consumer's error-handling UI.

## 7. Build & tooling

- **TypeScript**, strict mode on.
- **tsup** for the build — dual ESM + CJS output with `.d.ts` generation, minimal config.
  No webpack/rollup hand-rolled config needed for something this small.
- **vitest** for tests — fast, TS-native, no separate ts-jest setup.
- **eslint + prettier**, default-ish configs. Don't spend time customizing these.
- `package.json` `exports` map wires up the subpaths from §1.

## 8. Versioning / release

Manual semver, no changesets/release-bots needed at this size:
- `0.x` while the API surface in §3 might still shift.
- `1.0.0` once Phase 1 + Phase 2 are both shipped and the public exports are stable.
- Tag releases on GitHub, `npm publish` manually. Automate later only if it becomes
  annoying — don't pre-build CI/CD machinery for a project with one or two maintainers.

## 9. Documentation approach

- Phase 1: README with install + 3 code examples (valid check, validate-with-errors,
  parse). JSDoc comments on every exported function (shows up in editor tooltips —
  this *is* the documentation for most users, more than the README).
- Phase 2: adds a docs site only once the core is stable — don't build docs
  infrastructure before there's a finished v1 to document.