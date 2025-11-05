# Disable Email Confirmation for Development

## The Issue

When you sign up, Supabase is trying to send an email confirmation link. In development, this causes errors because:
1. Email confirmation is enabled by default
2. The email link expires quickly
3. It redirects to the wrong port (3000 instead of 4321)

## Quick Fix for Development

### Option 1: Disable Email Confirmation (Recommended for Dev)

1. Go to your Supabase Dashboard
2. Navigate to: **Authentication** → **Providers** → **Email**
3. Scroll down to **"Email Settings"**
4. Toggle OFF: **"Confirm email"**
5. Click **Save**

This allows users to sign up without email verification in development.

### Option 2: Use Auto-Confirm (Alternative)

If you want to keep email confirmation enabled but auto-confirm in development:

1. Go to: **Authentication** → **Settings**
2. Find **"Disable email confirmations"**
3. Enable this setting temporarily

## Testing After Fixing

1. **Clear your browser data** (important!)
   - Open DevTools (F12)
   - Right-click the refresh button
   - Select "Empty Cache and Hard Reload"

2. **Try signing up again**:
   - Go to: http://localhost:4321/signup
   - Email: test@example.com
   - Password: testpassword123
   - Click "Sign up"

3. **Should work now**:
   - No email confirmation required
   - Automatically signed in
   - Redirected to dashboard

## For Production

When you deploy to production, you should:

1. **Re-enable email confirmation**:
   - Go to: Authentication → Providers → Email
   - Enable "Confirm email"

2. **Set up email templates**:
   - Customize the confirmation email
   - Use your domain in the links

3. **Configure SMTP** (optional):
   - Use your own email service
   - Or use Supabase's default (limited)

## Additional Settings to Check

### Site URL Configuration

1. Go to: **Authentication** → **URL Configuration**
2. Set **Site URL** to:
   - Development: `http://localhost:4321`
   - Production: `https://bariatricsurgeryhub.com`

### Redirect URLs

1. Add to **Redirect URLs** list:
   - `http://localhost:4321/dashboard`
   - `http://localhost:4321/**` (for dev)
   - `https://bariatricsurgeryhub.com/dashboard` (for production)
   - `https://bariatricsurgeryhub.com/**` (for production)

## Verification

After disabling email confirmation, test the full flow:

```bash
# 1. Clear browser cache
# 2. Go to signup page
# 3. Enter credentials
# 4. Click Sign up
# 5. Should redirect to dashboard immediately
```

## Troubleshooting

### Still getting email confirmation errors?

1. **Check if setting saved**:
   - Go back to Authentication → Providers → Email
   - Verify "Confirm email" is OFF

2. **Clear Supabase cache**:
   - Wait 1-2 minutes for settings to propagate
   - Try again

3. **Check user in database**:
   - Go to: Authentication → Users
   - Look for your test user
   - Check if `email_confirmed_at` is set

### Manual email confirmation (if needed)

If you have users stuck in unconfirmed state:

```sql
-- In Supabase SQL Editor
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'test@example.com';
```

## Alternative: Test with Real Email

If you want to test with email confirmation:

1. Use a real email address (Gmail, etc.)
2. Keep email confirmation enabled
3. Check your inbox for confirmation link
4. Click the link to confirm

Note: The link goes to port 3000 by mistake, just change it to 4321 in the URL.

## Summary

**Quick Fix**:
1. Supabase Dashboard → Authentication → Providers → Email
2. Disable "Confirm email"
3. Save
4. Try signup again

This will allow immediate sign up and sign in without email verification for development!

---

**Status after this fix**: ✅ Sign up should work without email confirmation
