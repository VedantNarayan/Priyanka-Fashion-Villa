-- Add size_chart column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS size_chart JSONB;
