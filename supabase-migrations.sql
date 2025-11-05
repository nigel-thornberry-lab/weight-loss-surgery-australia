-- Supabase Database Schema for User Authentication and Claims System
-- Run these commands in your Supabase SQL Editor

-- 1. Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create user_claims table
CREATE TABLE IF NOT EXISTS user_claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  surgeon_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  verification_notes TEXT,
  claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(surgeon_id) -- One claim per surgeon profile
);

-- 3. Create index for faster queries
CREATE INDEX idx_user_claims_user_id ON user_claims(user_id);
CREATE INDEX idx_user_claims_surgeon_id ON user_claims(surgeon_id);
CREATE INDEX idx_user_claims_status ON user_claims(status);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE user_claims ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies

-- Users can read their own claims
CREATE POLICY "Users can view their own claims"
  ON user_claims
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create claims
CREATE POLICY "Users can create claims"
  ON user_claims
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending claims
CREATE POLICY "Users can update their own pending claims"
  ON user_claims
  FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- Admins can read all claims (you'll need to set up admin role)
-- For now, we'll create a simple admin table
CREATE TABLE IF NOT EXISTS admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin policy for reading all claims
CREATE POLICY "Admins can view all claims"
  ON user_claims
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE user_id = auth.uid()
    )
  );

-- Admin policy for updating claims (approve/reject)
CREATE POLICY "Admins can update claims"
  ON user_claims
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE user_id = auth.uid()
    )
  );

-- 6. Create function to send email on approval (optional, for later integration)
-- You can use Supabase Edge Functions or external email service for this

-- 7. Comments for documentation
COMMENT ON TABLE user_claims IS 'Stores surgeon profile claim requests from users';
COMMENT ON COLUMN user_claims.status IS 'Status of the claim: pending, approved, or rejected';
COMMENT ON COLUMN user_claims.surgeon_id IS 'References the surgeon identifier from your main surgeon data';

-- To manually add an admin user, run:
-- INSERT INTO admin_users (user_id) VALUES ('your-user-uuid-here');

-- 8. Create profile_updates table for storing surgeon profile edits
CREATE TABLE IF NOT EXISTS profile_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  surgeon_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  updates JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  applied BOOLEAN DEFAULT FALSE,
  applied_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for profile_updates
CREATE INDEX idx_profile_updates_surgeon_id ON profile_updates(surgeon_id);
CREATE INDEX idx_profile_updates_user_id ON profile_updates(user_id);
CREATE INDEX idx_profile_updates_applied ON profile_updates(applied);

-- Enable RLS for profile_updates
ALTER TABLE profile_updates ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile updates
CREATE POLICY "Users can view their own profile updates"
  ON profile_updates
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create profile updates for their claimed surgeons
CREATE POLICY "Users can create profile updates for claimed surgeons"
  ON profile_updates
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_claims
      WHERE user_id = auth.uid()
      AND surgeon_id = profile_updates.surgeon_id
      AND status = 'approved'
    )
  );

-- Admins can view all profile updates
CREATE POLICY "Admins can view all profile updates"
  ON profile_updates
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE user_id = auth.uid()
    )
  );

-- Admins can update profile updates (mark as applied)
CREATE POLICY "Admins can update profile updates"
  ON profile_updates
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE user_id = auth.uid()
    )
  );

COMMENT ON TABLE profile_updates IS 'Stores pending profile updates from claimed surgeon accounts';
COMMENT ON COLUMN profile_updates.updates IS 'JSONB object containing the profile field updates';
COMMENT ON COLUMN profile_updates.applied IS 'Whether the update has been applied to the live data';
