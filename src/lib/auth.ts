import type { AstroCookies } from 'astro';
import { supabase } from './supabase';

export interface User {
  id: string;
  email: string;
  [key: string]: any;
}

/**
 * Get the current user from Astro cookies
 */
export async function getUser(cookies: AstroCookies): Promise<User | null> {
  const accessToken = cookies.get('sb-access-token')?.value;
  const refreshToken = cookies.get('sb-refresh-token')?.value;

  if (!accessToken || !refreshToken) {
    return null;
  }

  const { data, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error || !data.user) {
    return null;
  }

  return {
    id: data.user.id,
    email: data.user.email || '',
    ...data.user,
  };
}

/**
 * Check if user is an admin
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', userId)
    .single();

  return !error && !!data;
}

/**
 * Sign out user
 */
export async function signOut(cookies: AstroCookies): Promise<void> {
  cookies.delete('sb-access-token', { path: '/' });
  cookies.delete('sb-refresh-token', { path: '/' });
  await supabase.auth.signOut();
}
