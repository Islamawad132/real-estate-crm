-- Full-text search GIN index on properties for tsvector-based search
CREATE INDEX IF NOT EXISTS idx_properties_fulltext
  ON properties
  USING GIN (
    to_tsvector('english',
      coalesce("title", '') || ' ' ||
      coalesce("description", '') || ' ' ||
      coalesce("address", '') || ' ' ||
      coalesce("city", '') || ' ' ||
      coalesce("region", '')
    )
  );

-- Additional indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties ("price");
CREATE INDEX IF NOT EXISTS idx_properties_area ON properties ("area");
CREATE INDEX IF NOT EXISTS idx_clients_source ON clients ("source");
CREATE INDEX IF NOT EXISTS idx_invoices_status_paid_date ON invoices ("status", "paidDate");
