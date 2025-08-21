# FlowIQ AI Spark — Sleep Impressions ETL

## Quickstart

1. Copy env
   - `cp env.example .env`
   - Fill Supabase and SFTP values
   - Optional: `export NODE_OPTIONS=--dns-result-order=ipv4first`
2. Verify DB connectivity
   - `npm run verify-db`
3. Apply schema (prefer SQL migrations; script provided as fallback)
   - `npm run apply-schema`
   - Apply unique indexes from `supabase/migrations/20250814120000_add_unique_constraints_and_rls.sql`
4. Test SFTP
   - `npm run test-etl`
5. Run ETL
   - `npm run etl`

## Canonical ETL
`enhanced-etl-processor.js` is the canonical ETL entry point. `automated-etl.js` is similar; `run-etl.js` is deprecated.

## Triggering ETL
Vercel cron calls `/api/etl/sleepimpressions` every 6 hours. Manual trigger: POST `/api/sleep-impressions/trigger`.

## Security
- Do not expose service-role keys to the client. All database reads should go through API routes.


