# CLAUDE.md

Guidance for Claude Code (or any AI agent) working in this repository.

## Overview

**ez-parking-back** is the API for a parking-lot management system: organizations
(parking lots) track vacancies (physical spots), vehicles, clients (vehicle owners) and
collaborators (staff who operate the lot), and log each vehicle's stay via check-in /
check-out. It pairs with the `ez-parking-front` frontend (Nuxt 3 + Tailwind v4 + Nuxt
UI) — see that repo's own CLAUDE.md. (There's also a sibling `ez-parking` folder that
looks similar but is a stale, abandoned scaffold — not the real frontend, ignore it.)

Personal/solo project (single author, `alalan55`), currently local-dev only. No CI, no
deploy pipeline. `config/db.js` points straight at a committed `database.sqlite` file
with real seed-ish data in it. A local `.env` (gitignored, copy from `.env.example`)
holds `JWT_SECRET` and `PORT` — see Authentication below.

**Authentication is real (added 2026-09-05).** JWT-based, see the Authentication section
below. Every route except `/`, `/api-docs`, `/auth/register` and `/auth/login` requires a
valid Bearer token, and controllers pull `organizationId`/`collaboratorId` from the
verified `req.auth` (not from the request body) for every write path. Every route whose
URL carries an organization id (metrics, vagas dashboard, audit log, client/collaborator/
vehicle lists, organization self-lookup) is now also guarded by `ownOrganizationOnly()`
(2026-09-06) — a token from org A gets a 403 reading org B's data by URL, verified live
with a second registered organization. **What's still open**: individual-record routes
that take only a bare entity id with no organization in the URL at all — `PUT/PATCH/
DELETE /collaborator/:id`, `GET/PUT/DELETE /client/:id`, `GET/PUT/DELETE /vehicle/:id` —
don't check that the targeted record belongs to the caller's own organization; a
same-role collaborator from another org could act on a record by guessing/knowing its
id. Fixing this needs a service-layer check (compare the loaded record's
`organizationId` to `req.auth.organizationId`), not just a route-level guard, since the
org isn't in the URL to check before loading the record.

## Stack

- Node.js, **type: module** (ESM everywhere — no `require`)
- Express 5
- Sequelize 6 + `sqlite3` (dialect: sqlite, storage: `./database.sqlite`, committed to git)
- Zod for request validation
- Node's built-in `crypto` (`scryptSync`) for password hashing — see
  `shared/security/password.js`. No bcrypt/argon2/passport dependency exists.
- `jsonwebtoken` for session tokens (`shared/security/jwt.js`), `dotenv` for `.env`
  (`JWT_SECRET`, `PORT`) — see the Authentication section below.
- `swagger-jsdoc` / `swagger-ui-express` — served at `/api-docs` from `swagger.yaml`
  (hand-written, not generated from code — check it's not stale before trusting it)
- `nodemon` for dev reload

## Commands

```bash
npm install
npm run dev     # nodemon app.js — only script that actually works cross-platform
```

`npm run migration:cjs` in package.json is a Windows-`cmd`-only one-liner (batch `for`
loop) to rename migration files to `.cjs`; it will not run under bash/PowerShell as-is.
There is no `npm test` (placeholder only) and no lint script.

Server listens on `PORT` env var, default `8080`. Health check: `GET /`.

## Architecture — fully modular (migration complete)

The old flat legacy structure (`models/`, `controller/`, `services/`, `routes/`) was
fully removed. Everything lives under `modules/<domain>/`, layered:

- `*.model.js` — Sequelize model (no associations attached here)
- `*.repository.js` — Sequelize queries, one options-object argument per method
- `*.service.js` — business logic, receives repos (and other services, e.g.
  `auditLogService`) via constructor injection
- `*.factory.js` — wires repos/services → service instance (e.g. `makeClientService()`),
  the only place that calls `new XService(...)`
- `*.controller.js` — thin, parses req/res, throws `AppError` on validation failure
- `*.routes.js` — Express router
- `*.schema.js` — Zod schemas, checked with `.safeParse()` in the controller

Current modules: `client`, `clientOrganization`, `clientVehicle`, `collaborator`,
`metric`, `occupancySnapshot`, `organization`, `parkingLog`, `vacancy`, `vehicle`,
`auditLog`. `app.js` imports only `modules/models.js` + each domain's routes file —
nothing outside `modules/` is imported anymore.

**Associations live in exactly one place: `modules/models.js`.** It imports every
`modules/<domain>/<domain>.model.js` and wires all `belongsTo`/`hasMany`/`belongsToMany`
there. If you add a new domain, define its model only in
`modules/<domain>/<domain>.model.js`, wire associations only in `modules/models.js`, and
never call `sequelize.define()` a second time for the same entity anywhere else.

**Join tables** (`ClientOrganizations`, `ClientVehicles`, `OrganizationVehicles`) were
originally created by Sequelize's implicit-through mechanism (`belongsToMany(...,
{through: "TableName"})` as a string), which gives them a **composite primary key**
(the two FK columns) and **no `id` column**. `clientOrganization.model.js` and
`clientVehicle.model.js` are explicit models over those same tables (needed because
their repositories call `.create()`/`.destroy()` directly) — they must declare
`id: false` with `primaryKey: true` on both FK columns to match the real table, or
inserts fail with `table X has no column named id`. Keep this in mind if you add a new
join table with its own explicit model.

**`auditLog` is a singleton factory** (`makeAuditLogService()` caches its instance)
because `client`, `organization`, `collaborator` and `parkingLog` services all need to
call `.record(...)` on the *same* instance. Every other factory returns a fresh instance
per call — don't copy the singleton pattern unless you have the same "many callers, one
shared thing" need.

**Altering an existing table's schema**: `database.sync()` only *creates missing
tables* — it never adds a column to a table that already exists. The `active` column on
`Collaborators` was added to an existing table, so `app.js`'s startup IIFE has a small
self-healing guard (`describeTable` + `addColumn` if missing) right after `sync()`. This
means the checked-in `database.sqlite` doesn't need to already have that column — it
gets added on first boot after a fresh `git checkout -- database.sqlite`. If you add a
column to an *existing* table again, add the same kind of guard rather than assuming
`sync()` handles it (brand-new tables don't need this — `sync()` creates those fine).

## Authentication

`modules/auth/` (register/login/me) plus two shared pieces:

- [shared/security/jwt.js](shared/security/jwt.js) — `signToken(payload)` /
  `verifyToken(token)`, HS256, 7-day expiry, secret from `process.env.JWT_SECRET` (falls
  back to a hardcoded insecure dev value with a console warning if `.env` is missing —
  copy `.env.example` to `.env` and set a real value; `.env` is gitignored).
- [shared/http/authenticate.js](shared/http/authenticate.js) — `authenticate` middleware
  reads `Authorization: Bearer <token>`, verifies it, and attaches `req.auth =
  { collaboratorId, organizationId, role }`; throws `AppError(401)` if missing/invalid.
  `requireRole(...roles)` is a second middleware factory for role-gated routes (e.g.
  `requireRole(0, 1)` — Super admin/Admin only — used on collaborator management and
  organization update). `ownOrganizationOnly(paramName)` is a third one — for any route
  whose URL carries an organization id (e.g. `router.get("/:orgId",
  ownOrganizationOnly("orgId"), ...)`), 403s unless it matches `req.auth.organizationId`.

**Mounting order in `app.js` matters**: `/`, `/api-docs`, and `/auth` (register/login)
are mounted *before* `app.use(authenticate)`, so they stay public; everything mounted
after that line requires a valid token. `/auth/me` is the one exception inside the
public `/auth` router — it applies `authenticate` directly on that one route.

**`POST /auth/register` creates an organization AND its first collaborator together**,
as Super admin (role `0`) — this is the org's "owner". There is no separate self-signup;
every other collaborator is created from inside the app (`POST /collaborator`, itself
gated to role 0/1) by that owner or another Admin.

**Controller pattern for trusting identity**: a controller that used to read
`organizationId`/`collaboratorId` from `req.body` now overwrites those fields from
`req.auth` *before* validation/service call — e.g.
`req.body.organizationId = req.auth.organizationId;` at the top of `client.controller.js
#create`. This means the request body can still *carry* those fields (harmless, ignored)
but can never spoof them. Follow this pattern for any new write endpoint rather than
trusting a body-provided org/collaborator id.

**Local dev login (organization 1, the seed data)**: the seed collaborators predate
password hashing entirely — their `hashPassword` was `null`, so none of them could
actually log in. Collaborator id `3` ("Alberto Oliveira") was given a real password by
hand on 2026-09-05 so there's a way into the seed org's data:
- email: `alberto@ezparking.com`
- password: `ezparking123`
- role: `0` (Super admin, promoted from `2`)

This was a direct DB write (`collaborator.hashPassword = hashPassword(...); await
collaborator.save();`), not something the app's own UI can do for a first login — there
was no other admin account yet to grant it through. If you need to do this again for
another seed collaborator, same approach: a one-off script using
`shared/security/password.js#hashPassword` and `CollaboratorModel`, run with the backend
stopped. Change this password from the Colaboradores screen once logged in if it matters
to you — it was set here in plaintext.

## Conventions

- **Repository pattern**: repos take a single options object, not positional args —
  e.g. `findById({ id, transaction })`, `create({ transaction, payload })`.
- **Services** receive their repos via constructor injection and are instantiated by a
  `*.factory.js` (`makeXService()`), never `new XService()` directly outside the
  factory — see `modules/client/client.factory.js` for the pattern with multiple repos.
- **Transactions**: a service method that touches more than one table wraps itself in
  `sequelize.transaction(async (transaction) => {...})` and threads `transaction`
  through every repo call. See `parkingLog.service.js#checkin` for the fullest example
  (organization → collaborator → vehicle → vacancy → parking-log → audit log, all one
  transaction).
- **Errors**: throw `shared/errors/appError.js`'s `AppError(message, statusCode)` for
  anything expected (not-found, validation, business-rule violations). Express 5
  forwards thrown errors from async route handlers automatically — controllers do
  **not** need try/catch. `shared/http/errorHandler.js` is the single error middleware,
  registered last in `app.js`.
- **Validation**: Zod schemas per module in `*.schema.js`, checked with
  `.safeParse(req.body)` in the controller, errors surfaced via `AppError(errors, 400)`.
  Not every module has full coverage yet — check before assuming a body is validated.
- **Responses**: always `ResponseHandler(message, content)` from `helpers/helpers.js` —
  `{ message, content }`.
- **Audit trail**: any real create/update/delete that matters to an operator should call
  `auditLogService.record({ organizationId, collaboratorId, action, resource,
  resourceId, description, metadata, transaction })` right after the write succeeds
  (see `client.service.js` or `collaborator.service.js` for the pattern). `record()`
  swallows its own errors — an audit failure must never break the real operation.
  `metadata` is a plain array of `{field, before, after}` when you have a real diff;
  omit it otherwise. Never fabricate fields (IP, session id, hash) that the system
  doesn't actually know.
- **Never leak `hashPassword`**: `collaborator.service.js` has a `sanitize()` helper
  that strips it before returning — follow that pattern for any new sensitive field.

## Key files

- [app.js](app.js) — wiring: middleware, route mounts, `database.sync()` + schema
  self-heal on boot.
- [modules/models.js](modules/models.js) — the single source of truth for associations.
- [shared/errors/appError.js](shared/errors/appError.js),
  [shared/http/errorHandler.js](shared/http/errorHandler.js) — error contract.
- [shared/security/password.js](shared/security/password.js) — password hashing.
- [modules/client/](modules/client/) — reference implementation for module shape.
- [modules/auditLog/](modules/auditLog/) — reference implementation for the audit trail;
  copy this pattern when wiring a new module's writes into auditing.
- [modules/parkingLog/parkingLog.service.js](modules/parkingLog/parkingLog.service.js)
  — the check-in/check-out state machine (vacancy allocation, "already parked", "no
  vacancies available"); read this before changing vacancy/parking-log behavior.
- `swagger.yaml` — hand-written API docs; verify against actual routes before trusting.

## Testing

None. `npm test` is a stub. Manual verification so far has been via `curl` against a
running `node app.js`. If you add tests, there's no existing convention to follow — pick
one and note it here.

## Migrations

`migrations/` has only 3 old entries (original `Client`/`Vehicle`/`Organization` core
columns), unused since — every schema change since has gone through `database.sync()`
(new tables) or the self-heal-on-boot pattern described above (new columns on existing
tables). `sequelize-cli` is a devDependency but not actually wired to run against this
ESM project. If this project ever needs a second real environment (staging/prod), the
migration history will need to be reconciled with the actual committed
`database.sqlite` schema first.

## Deployment

Not deployed anywhere yet. No Dockerfile, no CI, no `.env`. `config/db.js` always
targets the committed `database.sqlite` — there's no environment-based config switch.

## Real feature inventory (verified 2026-09-05 — don't trust an older summary)

Built and real, backed by actual DB state, no fabricated data: vacancy/check-in/
check-out, client + vehicle management, metrics (occupancy/revenue/stay/hourly
check-ins with real period-over-period trends via `OccupancySnapshot` event sourcing),
audit trail, collaborator management (hashed passwords, active/inactive, roles),
**authentication** (JWT login/register, route protection, role-gated permissions on
collaborator management and organization update — see the Authentication section above
for the one known gap: some read endpoints aren't yet tenant-scoped).

**Not real yet — don't build on top of these as if they existed:**
- No pricing/tariff table anywhere in this backend. The frontend's "revenue" figure is
  computed from a hardcoded hourly rate constant on the client side, not stored or
  configurable server-side.
- No financial module at all: no cash register, no payment method tracking, no
  reconciliation, no gateway integration.
- No monthly-pass (mensalista), no convênio/discount concept.
- No tickets/QR codes — check-in is plate lookup only.
- No hardware integration (LPR, gate control, printers, barcode readers).

## Roadmap (phased, decided 2026-09-05 — competitive gap analysis vs. an existing
Brazilian competitor, PARKEER)

Priority order for a solid MVP, each phase building on the last. **Phase 1 (real
authentication) shipped 2026-09-05** — see the Authentication section above.

1. ~~Real authentication~~ — done, including tenant-scoped reads (2026-09-06). One
   narrower follow-up remains: individual-record routes with no org in the URL (see the
   Authentication section's "what's still open" note).
2. **Configurable tariffs** — a real, persisted price table (by vehicle type / period),
   replacing the frontend's hardcoded hourly rate. Prerequisite for real revenue.
3. **Basic financial module** — cash register per operator (open/close), payment method
   recorded per transaction (manual entry — no gateway yet).
4. **Monthly passes (mensalistas)** — plan, due date, renewal, delinquency tracking;
   extends the existing client/vehicle model.
5. ~~Visual consistency~~ — done (2026-09-06): `pages/internal/organization.vue` on the
   frontend now matches the flat "Terminal Operational Console" language every other
   screen already used. Every real screen is now consistent.
6. Later, in roughly this order: tickets/QR codes, convênios, advanced
   metrics/reports (average ticket, revenue by operator/payment method), a client-facing
   PWA, hardware automation (LPR/gates/printers).
