import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { getUser, isAdmin } from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  // Verify user is authenticated and is admin
  const user = await getUser(cookies);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    return new Response(JSON.stringify({ error: 'Forbidden - Admin access required' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const body = await request.json();
  const { claim_id, status } = body;

  // Validate input
  if (!claim_id || !status) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!['approved', 'rejected'].includes(status)) {
    return new Response(JSON.stringify({ error: 'Invalid status' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Update the claim
  const { data, error } = await supabase
    .from('user_claims')
    .update({
      status,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', claim_id)
    .select()
    .single();

  if (error) {
    console.error('Error updating claim:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update claim. Please try again.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // TODO: Send email notification to user
  // You can integrate with an email service like Resend, SendGrid, etc.

  return new Response(JSON.stringify({ success: true, claim: data }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
