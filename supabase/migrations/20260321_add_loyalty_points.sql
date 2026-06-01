-- Migration: Add loyalty_points to profiles table
-- Description: Supports the new Villa Points rewards engine.

ALTER TABLE public.profiles
ADD COLUMN loyalty_points INTEGER DEFAULT 0;

-- Optional: Create a function to increment loyalty points (for automated reward issuing)
CREATE OR REPLACE FUNCTION add_loyalty_points(user_id UUID, points_to_add INTEGER)
RETURNS void AS $$
BEGIN
    UPDATE public.profiles
    SET loyalty_points = COALESCE(loyalty_points, 0) + points_to_add
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
