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

  const formData = await request.formData();
  const surgeonId = formData.get('surgeon_id')?.toString();
  const contactName = formData.get('contact_name')?.toString();
  const contactEmail = formData.get('contact_email')?.toString();
  const contactPhone = formData.get('contact_phone')?.toString();
  const verificationNotes = formData.get('verification_notes')?.toString();

  // Validate required fields
  if (!surgeonId || !contactName || !contactEmail || !contactPhone) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Check if surgeon is already claimed
  const { data: existingClaim, error: checkError } = await supabase
    .from('user_claims')
    .select('id, status')
    .eq('surgeon_id', surgeonId)
    .single();

  if (existingClaim) {
    return new Response(
      JSON.stringify({
        error: `This profile has already been claimed and is ${existingClaim.status}`
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Create the claim
  const { data, error } = await supabase
    .from('user_claims')
    .insert({
      user_id: user.id,
      surgeon_id: surgeonId,
      contact_name: contactName,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      verification_notes: verificationNotes || null,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating claim:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to submit claim. Please try again.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  return new Response(JSON.stringify({ success: true, claim: data }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
