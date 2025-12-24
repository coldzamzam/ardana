
# Ardana — Aplikasi Rekap Dana Jurusan

Full name: Sistem Manajemen Pengelolaan Dana Kegiatan Jurusan.

`ARDANA` = Aplikasi Rekap Dana Jurusan.

Purpose (plain language)

ARDANA (Aplikasi Rekap Dana Jurusan) helps the TIK department at Politeknik Negeri Jakarta manage activity funding simply and transparently. In everyday terms it lets people:

- Write and submit activity proposals with budget details.
- Attach supporting documents (proposals, TOR, receipts).
- Notify department reviewers when a proposal is ready.
- Record decisions (approved / rejected / needs changes).
- Track how much money is requested and paid, and keep final reports.

The goal is to make submitting, reviewing, and recording funding for departmental activities easier and more organised.
Primary users & roles

- Proposers: `Mahasiswa`, lecturers, or staff who create and submit proposals.
- Team members: `AnggotaTim` associated with a `Submisi`.
- Reviewers: admins or lecturers (role `admin`) who review and change submission status.
- Finance/Admin: manage `pendanaan` and finalize funding/reporting.

Primary users & roles

- Proposers: `Mahasiswa`, lecturers, or staff who create and submit proposals.
- Team members: `AnggotaTim` associated with a `Submisi`.
- Reviewers: admins or lecturers (role `admin`) who review and change submission status.
- Finance/Admin: manage `pendanaan` and finalize funding/reporting.

Core concepts (mapped to models)

- `Submisi` — submission/proposal (title, type, kegiatan type, creator).
- `DetailSubmisi` — narrative details: tujuan, manfaat, metode, dates, PIC, peserta.
- `Biaya` — budget line items (unit cost, multiplier, headcount, description).
- `AnggotaTim` — team members linked to a submission.
- `SubmisiFile` — attached supporting files (TOR, LPJ, receipts).
- `StatusSubmisi` & `StatusType` — review records and status history.

Business flow (typical)

1. Draft: proposer creates a `Submisi` and fills `DetailSubmisi`, `Biaya`, and `AnggotaTim`.
2. Attachments: upload supporting files via `SubmisiFile` (TOR, proposals, images, receipts).
3. Submit: proposer submits the `Submisi` which dispatches `SubmisiSubmitted` and creates database notifications for reviewers.
4. Review: reviewers (admin/dosen) inspect details and change state by creating `StatusSubmisi` (approve, reject, request changes). `SubmissionReviewed` event triggers notifications back to the proposer.
5. Funding: when approved, `pendanaan` records are created/managed and finance allocates funds; budget items (`Biaya`) are used to calculate totals (`Submisi::total_anggaran`).
6. Reporting: generate LPJ or follow-up documents (there is a parent/child relation for generated LPJ via `parent_tor_id`).

Notifications & reliability

- Submission and review events use `DatabaseNotification` entries and notification classes (`SubmissionSubmitted`, `SubmissionReviewedNotification`) to inform users.
- Listeners include idempotency checks to avoid duplicate notifications.

Tech & setup (quick)

- Stack: PHP 8.2, Laravel 12, Inertia + React, Vite, Node 20+.
- Production DB: Postgres (`pdo_pgsql` enabled in `Dockerfile`). Local/tests: SQLite (tests use in-memory DB via `phpunit.xml`).

Quick commands

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite # if using sqlite locally
php artisan migrate
npm run dev
php artisan serve
```

Docker

```bash
docker build -t ardana-app .
docker run -p 8080:8080 --env-file .env ardana-app
```

Tests

- Run backend tests: `php artisan test` (uses sqlite in `phpunit.xml`).

Where to look

- Backend code: `app/` (models, events, listeners, notifications)
- Frontend: `resources/js/` (Inertia + React)
- Routes: `routes/`
- Migrations: `database/migrations/`
- Docker: `Dockerfile`, `docker/start.sh`

Notes

- Switching between Postgres and SQLite is supported; data is not auto-migrated between DBs.
- The system includes PDF/asset tooling (`barryvdh/laravel-dompdf`, `spatie/browsershot`, `puppeteer`) for report generation.

License: MIT
