import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { getUser } from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  // Verify user is authenticated
  const user = await getUser(cookies);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const body = await request.json();
  const { surgeon_id, ...profileData } = body;

  if (!surgeon_id) {
    return new Response(JSON.stringify({ error: 'Surgeon ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Verify user has an approved claim for this surgeon
  const { data: claim, error: claimError } = await supabase
    .from('user_claims')
    .select('id')
    .eq('user_id', user.id)
    .eq('surgeon_id', surgeon_id)
    .eq('status', 'approved')
    .single();

  if (!claim) {
    return new Response(
      JSON.stringify({ error: 'You do not have permission to edit this profile' }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // For now, we'll store profile updates in a separate table
  // In production, you would update the actual surgeon data
  // or create a staging table for review before publishing

  // Create profile_updates table if needed (run this in Supabase SQL editor):
  /*
    CREATE TABLE IF NOT EXISTS profile_updates (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      surgeon_id TEXT NOT NULL,
      user_id UUID NOT NULL REFERENCES auth.users(id),
      updates JSONB NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      applied BOOLEAN DEFAULT FALSE
    );
  */

  const { data, error } = await supabase
    .from('profile_updates')
    .insert({
      surgeon_id,
      user_id: user.id,
      updates: profileData,
      applied: false,
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving profile update:', error);

    // If table doesn't exist, return a helpful message
    if (error.code === '42P01') {
      return new Response(
        JSON.stringify({
          error: 'Profile updates feature not yet configured. Please contact support.',
          details: 'The profile_updates table needs to be created in the database.'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Failed to save profile update. Please try again.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Profile update saved successfully. Changes will be reviewed and applied soon.',
      update: data,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};
