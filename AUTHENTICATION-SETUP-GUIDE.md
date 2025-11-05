# Authentication & Profile Claim System - Setup Guide

This guide will walk you through setting up the complete user authentication and profile claim system.

## Overview

The system includes:
- User authentication (sign up/sign in)
- User dashboard
- Profile claim workflow
- Admin dashboard for reviewing claims
- Profile management for approved users

## Prerequisites

- Supabase account (free tier is fine)
- Node.js and npm installed

## Step 1: Create Supabase Project

1. Go to https://supabase.com and sign in (or create an account)
2. Click "New Project"
3. Fill in:
   - Project name: `bariatric-surgery-hub` (or your preferred name)
   - Database password: Generate a strong password and save it
   - Region: Choose closest to your users (e.g., Sydney, Australia)
4. Click "Create new project" and wait for setup to complete (1-2 minutes)

## Step 2: Get Supabase Credentials

1. In your Supabase project dashboard, go to Settings → API
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")
   - **service_role key** (under "Project API keys" - keep this secret!)

## Step 3: Update Environment Variables

Update your `.env` file with the Supabase credentials:

```bash
# Supabase Configuration
PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

Replace:
- `your-project-id` with your actual project ID
- `your-anon-key-here` with your anon key
- `your-service-role-key-here` with your service role key

## Step 4: Run Database Migrations

1. In your Supabase dashboard, go to "SQL Editor"
2. Open the file `supabase-migrations.sql` from this project
3. Copy the entire contents
4. Paste into the SQL Editor in Supabase
5. Click "Run" to execute all the SQL commands

This will create:
- `user_claims` table - stores profile claim requests
- `admin_users` table - stores admin user IDs
- `profile_updates` table - stores profile edits from users
- All necessary indexes and Row Level Security (RLS) policies

## Step 5: Configure Supabase Authentication

1. In Supabase, go to Authentication → Settings
2. Under "Site URL", add your site URL:
   - Development: `http://localhost:4321`
   - Production: `https://bariatricsurgeryhub.com`
3. Under "Redirect URLs", add:
   - Development: `http://localhost:4321/dashboard`
   - Production: `https://bariatricsurgeryhub.com/dashboard`
4. Enable email authentication:
   - Go to Authentication → Providers
   - Ensure "Email" is enabled
   - Configure email templates (optional, for customization)

## Step 6: Create Your First Admin User

1. Sign up for an account on your site: http://localhost:4321/signup
2. After signing up, go to Supabase dashboard → Authentication → Users
3. Find your user and copy the UUID (user ID)
4. Go to SQL Editor and run:

```sql
INSERT INTO admin_users (user_id) VALUES ('your-user-uuid-here');
```

Replace `your-user-uuid-here` with your actual user UUID.

5. Now you can access the admin dashboard at `/admin/claims`

## Step 7: Install Dependencies

The dependencies should already be installed, but if needed:

```bash
npm install @supabase/supabase-js @supabase/ssr
```

## Step 8: Test the System

### 1. Start the development server:

```bash
npm run dev
```

### 2. Test User Registration:
- Go to http://localhost:4321/signup
- Create a new account with email and password
- You should be redirected to the dashboard

### 3. Test Profile Claim:
- Click "Claim a Profile"
- Select a city
- Click "Claim this profile" on any surgeon
- Fill out the verification form
- Submit the claim

### 4. Test Admin Approval:
- Sign in as the admin user you created
- Go to http://localhost:4321/admin/claims
- You should see the pending claim
- Click "Approve" or "Reject"

### 5. Test Profile Management:
- As the user who claimed a profile (after approval)
- Go to dashboard
- Click "Manage" on the approved claim
- Edit the profile information
- Save changes

## File Structure

```
src/
├── lib/
│   ├── supabase.ts          # Supabase client setup
│   └── auth.ts              # Authentication helpers
├── layouts/
│   └── AuthLayout.astro     # Simple layout for auth pages
├── pages/
│   ├── login.astro          # Sign in page
│   ├── signup.astro         # Sign up page
│   ├── dashboard/
│   │   ├── index.astro      # User dashboard
│   │   ├── claim.astro      # Claim profile flow
│   │   └── manage/
│   │       └── [surgeonId].astro  # Edit profile
│   ├── admin/
│   │   └── claims.astro     # Admin dashboard
│   └── api/
│       ├── auth/
│       │   ├── signin.ts    # Sign in endpoint
│       │   ├── signup.ts    # Sign up endpoint
│       │   └── signout.ts   # Sign out endpoint
│       ├── claims/
│       │   ├── submit.ts    # Submit claim endpoint
│       │   └── update.ts    # Approve/reject claim
│       └── profile/
│           └── update.ts    # Update profile endpoint
```

## Database Schema

### user_claims
Stores profile claim requests:
- `id` - UUID primary key
- `user_id` - References auth.users
- `surgeon_id` - Surgeon slug/ID
- `status` - 'pending', 'approved', or 'rejected'
- `contact_name` - Claimer's name
- `contact_email` - Contact email
- `contact_phone` - Contact phone
- `verification_notes` - Additional notes
- `claimed_at` - Timestamp
- `reviewed_at` - Timestamp (when approved/rejected)

### admin_users
Simple table to mark users as admins:
- `user_id` - References auth.users
- `created_at` - Timestamp

### profile_updates
Stores profile edits from users:
- `id` - UUID primary key
- `surgeon_id` - Surgeon slug/ID
- `user_id` - References auth.users
- `updates` - JSONB object with field updates
- `applied` - Boolean flag
- `created_at` - Timestamp
- `applied_at` - Timestamp

## Security Features

1. **Row Level Security (RLS)**: All tables have RLS policies
   - Users can only see their own claims
   - Users can only edit profiles they've claimed
   - Admins can see and manage all data

2. **Authentication**: Required for all dashboard and admin routes
   - Cookies are httpOnly and secure
   - Session tokens expire after 7 days

3. **Authorization**: Claim verification
   - Only approved users can edit profiles
   - Only admins can approve/reject claims

## Common Issues & Troubleshooting

### Issue: "Missing Supabase environment variables"
**Solution**: Make sure your `.env` file has all three Supabase variables set correctly.

### Issue: Authentication not working
**Solution**:
1. Check that Supabase auth is enabled
2. Verify redirect URLs are configured
3. Clear cookies and try again

### Issue: "user_claims table does not exist"
**Solution**: Run the SQL migrations in Supabase SQL Editor.

### Issue: Can't access admin dashboard
**Solution**: Make sure you've added your user_id to the admin_users table.

### Issue: Profile updates not saving
**Solution**: Check that the `profile_updates` table exists (run migrations again if needed).

## Next Steps

1. **Email Notifications**: Integrate email service (Resend, SendGrid) to notify users when claims are approved
2. **Featured Listings**: Implement Feature 2 from AI-DIRECTORY-FEATURES-IMPLEMENTATION.md
3. **Badge Generator**: Implement Feature 3 for backlink strategy
4. **Schema Markup**: Add comprehensive schema.org markup for SEO

## Support

For issues or questions:
- Check Supabase logs: Dashboard → Database → Logs
- Check browser console for JavaScript errors
- Verify all environment variables are set
- Ensure all SQL migrations ran successfully

## Production Deployment

Before deploying to production:

1. Update `.env` with production Supabase URL and keys
2. Update Supabase Authentication settings with production URLs
3. Ensure all database migrations are applied
4. Set up proper email templates in Supabase
5. Configure production environment variables in Vercel/Netlify
6. Test all flows end-to-end

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Astro Documentation](https://docs.astro.build)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
