-- Create bg_removal_log table to track Gemini API usage for background removal
CREATE TABLE IF NOT EXISTS bg_removal_log (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamptz DEFAULT now() NOT NULL,
    product_id uuid REFERENCES products(id) ON DELETE SET NULL,
    image_index int NOT NULL DEFAULT 1,
    model_used text NOT NULL DEFAULT 'gemini-2.5-flash-image',
    status text NOT NULL DEFAULT 'success',
    input_bytes int DEFAULT 0,
    output_bytes int DEFAULT 0
);

-- Index for fast daily/monthly aggregation queries
CREATE INDEX IF NOT EXISTS idx_bg_removal_log_created_at ON bg_removal_log(created_at);
