-- LogiScan AI Database Schema
-- PostgreSQL / Supabase
--
-- This schema defines the core package tracking table used by LogiScan AI.
-- Run this in your Supabase SQL Editor to set up the database.

-- ==============================================================================
-- PACKAGES TABLE
-- ==============================================================================
-- Stores package information extracted from manifests and verified via scanning
--
-- Design Philosophy:
-- - Composite unique key on (unit, last_four) prevents duplicate entries
-- - Upsert-friendly: Same package scanned twice updates rather than duplicates
-- - Minimal columns for fast queries and simple joins
-- ==============================================================================

CREATE TABLE IF NOT EXISTS packages (
  -- Primary identifier
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Package location identifier (e.g., "C01K", "B02J")
  -- This is the unit number where the package should be delivered
  unit TEXT NOT NULL,

  -- Recipient name extracted from package manifest
  guest_name TEXT,

  -- Last 4 characters of tracking number for verification
  -- Used to match physical packages against database records
  last_four TEXT NOT NULL,

  -- Audit trail
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Composite constraint: No duplicate packages with same unit + tracking
  CONSTRAINT unique_package UNIQUE(unit, last_four)
);

-- ==============================================================================
-- INDEXES
-- ==============================================================================
-- Optimize common query patterns used by the application

-- Index for fast unit lookups (used in search and filtering)
CREATE INDEX IF NOT EXISTS idx_packages_unit ON packages(unit);

-- Index for tracking number searches
CREATE INDEX IF NOT EXISTS idx_packages_last_four ON packages(last_four);

-- Index for time-based queries (recent packages, audit reports)
CREATE INDEX IF NOT EXISTS idx_packages_created_at ON packages(created_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================
-- Supabase requires RLS policies for secure data access
-- This setup allows anonymous read/write for the application
-- For production with user authentication, adjust these policies

-- Enable RLS
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all operations for now (adjust for production auth)
CREATE POLICY "Allow all operations for anon users"
  ON packages
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- ==============================================================================
-- TRIGGERS
-- ==============================================================================
-- Automatically update updated_at timestamp on record changes

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_packages_updated_at
  BEFORE UPDATE ON packages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- SAMPLE DATA (Optional - for testing)
-- ==============================================================================
-- Uncomment to insert test data

-- INSERT INTO packages (unit, guest_name, last_four) VALUES
--   ('C01K', 'John Smith', '1234'),
--   ('C02A', 'Jane Doe', '5678'),
--   ('B03M', 'Bob Johnson', '9012'),
--   ('D04L', 'Alice Williams', '3456');

-- ==============================================================================
-- USEFUL QUERIES
-- ==============================================================================

-- Count total packages in system
-- SELECT COUNT(*) FROM packages;

-- List all packages for a specific unit
-- SELECT * FROM packages WHERE unit = 'C01K';

-- Find packages by partial tracking number
-- SELECT * FROM packages WHERE last_four LIKE '%123%';

-- Get recent package entries (last 24 hours)
-- SELECT * FROM packages WHERE created_at > NOW() - INTERVAL '24 hours';

-- Clear all packages (start of shift reset)
-- DELETE FROM packages WHERE created_at < NOW();
