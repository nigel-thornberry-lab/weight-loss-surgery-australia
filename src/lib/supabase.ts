import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database tables
export interface UserClaim {
  id: string;
  user_id: string;
  surgeon_id: string;
  status: 'pending' | 'approved' | 'rejected';
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  verification_notes?: string;
  claimed_at: string;
  reviewed_at?: string;
}

export interface Surgeon {
  id: string;
  name: string;
  suburb: string;
  state: string;
  phone?: string;
  website?: string;
  email?: string;
  address?: string;
  [key: string]: any;
}
