# Quick Test Guide - Authentication System

## Prerequisites
- Supabase project created
- Database migrations run
- Environment variables set in `.env`

## Quick Test Steps

### 1. Start Development Server
```bash
npm run dev
```

### 2. Test Sign Up (5 min)
1. Open: http://localhost:4321/signup
2. Enter email: `test@example.com`
3. Enter password: `password123`
4. Click "Sign up"
5. ✅ Should redirect to `/dashboard`

### 3. Test Dashboard (2 min)
1. Should see: "Welcome back, test@example.com"
2. Should see: "No claims yet" message
3. Should see: "Claim a Profile" button
4. ✅ Dashboard loads correctly

### 4. Test Sign Out (1 min)
1. Click "Sign Out" button
2. ✅ Should redirect to `/login`

### 5. Test Sign In (2 min)
1. Enter same email and password
2. Click "Sign in"
3. ✅ Should redirect back to `/dashboard`

### 6. Test Claim Flow (5 min)
1. Click "Claim a Profile"
2. Select a city (e.g., "Sydney")
3. Wait for surgeons to load
4. Click "Claim this profile" on any surgeon
5. Fill form:
   - Name: `John Smith`
   - Email: `john@example.com`
   - Phone: `0400 000 000`
   - Notes: `Practice Manager`
6. Click "Submit Claim"
7. ✅ Should redirect to dashboard with claim showing as "Pending"

### 7. Create Admin User (3 min)
1. Go to Supabase dashboard
2. Navigate to: Authentication → Users
3. Copy your user UUID
4. Go to: SQL Editor
5. Run:
```sql
INSERT INTO admin_users (user_id) VALUES ('paste-your-uuid-here');
```
6. ✅ Admin user created

### 8. Test Admin Dashboard (5 min)
1. Go to: http://localhost:4321/admin/claims
2. Should see pending claim from step 6
3. Click "Approve"
4. Confirm approval
5. ✅ Claim should disappear (now approved)

### 9. Test Profile Management (5 min)
1. Go back to: http://localhost:4321/dashboard
2. Claim should now show "Approved" status
3. Click "Manage" button
4. Edit some fields (e.g., phone number)
5. Click "Save Changes"
6. ✅ Should see success message

### 10. Test Security (3 min)
1. Sign out
2. Try to access: http://localhost:4321/dashboard
3. ✅ Should redirect to `/login`
4. Try to access: http://localhost:4321/admin/claims
5. ✅ Should redirect to `/login`

## Verification Checklist

- [ ] Sign up works
- [ ] Sign in works
- [ ] Sign out works
- [ ] Dashboard displays correctly
- [ ] Claim flow works
- [ ] Claims appear in admin dashboard
- [ ] Admin can approve/reject claims
- [ ] Profile management page loads
- [ ] Profile updates save
- [ ] Protected routes redirect to login
- [ ] Non-admin can't access admin pages

## Common Test Issues

### Issue: "Missing Supabase environment variables"
**Fix**: Check `.env` file has all three Supabase variables

### Issue: Sign up fails
**Fix**:
1. Check Supabase auth is enabled
2. Verify migrations ran successfully
3. Check browser console for errors

### Issue: Claim submission fails
**Fix**:
1. Verify `user_claims` table exists
2. Check RLS policies are active
3. Look at Supabase logs

### Issue: Can't access admin dashboard
**Fix**: Make sure you ran the `INSERT INTO admin_users` query

## Database Queries for Testing

### Check if user exists:
```sql
SELECT * FROM auth.users WHERE email = 'test@example.com';
```

### Check pending claims:
```sql
SELECT * FROM user_claims WHERE status = 'pending';
```

### Check if user is admin:
```sql
SELECT * FROM admin_users WHERE user_id = 'your-user-uuid';
```

### View all claims:
```sql
SELECT
  c.*,
  u.email as user_email
FROM user_claims c
JOIN auth.users u ON c.user_id = u.id
ORDER BY c.claimed_at DESC;
```

### View profile updates:
```sql
SELECT * FROM profile_updates ORDER BY created_at DESC;
```

## Next Steps After Testing

Once all tests pass:

1. **Production Setup**:
   - Create production Supabase project
   - Update production environment variables
   - Run migrations on production database

2. **Email Integration**:
   - Set up email service (Resend, SendGrid)
   - Configure Supabase email templates
   - Add email notifications on approval

3. **UI Polish**:
   - Add loading states
   - Improve error messages
   - Add toast notifications

4. **Feature 2**:
   - Implement Featured Listings
   - Add Stripe integration
   - Create payment flow

## Success Criteria

✅ All checklist items pass
✅ No console errors
✅ Supabase logs show no errors
✅ Can complete full user journey from signup to profile edit
✅ Admin can review and approve claims

---

**Estimated Testing Time**: 30 minutes

**Ready for**: Production deployment or Feature 2 implementation
