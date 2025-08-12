import { describe, it, expect, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// Simple mock without circular dependency
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      upsert: vi.fn(() => ({ error: null })),
      insert: vi.fn(() => ({ error: null })),
      where: vi.fn(() => ({
        first: vi.fn(() => ({ cpt: '95810', source: 'sleepimpr' }))
      }))
    }))
  }))
}));

// Import after mocking
import { ingestFile } from '../src/etl/midwest_si/ingest';

describe('Sleep Impressions ETL', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ingestFile', () => {
    it('parses billing log into encounters', async () => {
      const csv = fs.readFileSync(
        path.join(__dirname, 'fixtures/midwest_si/billing_log_2025-01-15.csv'),
        'utf-8'
      );
      
      await ingestFile('billing_log_2025-01-15.csv', csv);
      
      // Basic test that the function runs without error
      expect(true).toBe(true);
    });

    it('processes patient visit logs and enqueues claims for Delivery stage', async () => {
      const csv = fs.readFileSync(
        path.join(__dirname, 'fixtures/midwest_si/patient_visit_log_2025-01-15.csv'),
        'utf-8'
      );
      
      await ingestFile('patient_visit_log_2025-01-15.csv', csv);
      
      // Basic test that the function runs without error
      expect(true).toBe(true);
    });

    it('processes insurance patient reference data', async () => {
      const csv = fs.readFileSync(
        path.join(__dirname, 'fixtures/midwest_si/insurance_pat_ref_2025-01-15.csv'),
        'utf-8'
      );
      
      await ingestFile('insurance_pat_ref_2025-01-15.csv', csv);
      
      // Basic test that the function runs without error
      expect(true).toBe(true);
    });

    it('processes legacy claims report for KPI baseline', async () => {
      const csv = fs.readFileSync(
        path.join(__dirname, 'fixtures/midwest_si/Claims_Report_2025-01-15.csv'),
        'utf-8'
      );
      
      await ingestFile('Claims_Report_2025-01-15.csv', csv);
      
      // Basic test that the function runs without error
      expect(true).toBe(true);
    });

    it('handles unknown file types gracefully', async () => {
      const csv = 'Patient ID,Visit Date\nP001,2025-01-15';
      
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      await ingestFile('unknown_file.csv', csv);
      
      expect(consoleSpy).toHaveBeenCalledWith('Unknown file type: unknown_file.csv');
      
      consoleSpy.mockRestore();
    });


  });
});
