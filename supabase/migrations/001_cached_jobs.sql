-- cached_jobs: stores job listings fetched from Remotive API
-- Cache expires after 1 hour (checked in application layer)
-- Entries older than 24 hours purged by daily cron

CREATE TABLE IF NOT EXISTS cached_jobs (
  id                 TEXT PRIMARY KEY,
  title              TEXT NOT NULL,
  company_name       TEXT NOT NULL,
  company_logo       TEXT,
  category           TEXT,
  job_type           TEXT,
  publication_date   TIMESTAMPTZ,
  location           TEXT,
  salary             TEXT,
  description_text   TEXT,
  url                TEXT NOT NULL,
  tags               TEXT[],
  fetched_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS immediately — before any data is inserted
ALTER TABLE cached_jobs ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read cached jobs
CREATE POLICY "authenticated users can read cached jobs"
  ON cached_jobs
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Index for fast fetched_at lookups (cache expiry checks)
CREATE INDEX IF NOT EXISTS cached_jobs_fetched_at_idx ON cached_jobs (fetched_at);
