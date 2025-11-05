# Customize Supabase Authentication Emails

## The Issue
Supabase sends generic confirmation emails with no mention of "Bariatric Surgery Hub". Users need branded emails.

## How to Customize Email Templates

### Step 1: Access Email Templates
1. Go to your Supabase Dashboard
2. Navigate to: **Authentication** → **Email Templates**
3. You'll see templates for:
   - Confirm signup
   - Magic Link
   - Change Email Address
   - Reset Password

### Step 2: Customize "Confirm Signup" Template

Click on **"Confirm signup"** and replace the default template with this:

```html
<h2>Welcome to Bariatric Surgery Hub!</h2>

<p>Thank you for creating an account with Bariatric Surgery Hub, Australia's trusted platform for finding qualified bariatric surgeons.</p>

<p>To complete your registration and access your dashboard, please confirm your email address by clicking the button below:</p>

<p><a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">Confirm Your Email</a></p>

<p>Or copy and paste this link into your browser:</p>
<p>{{ .ConfirmationURL }}</p>

<p><strong>What's Next?</strong></p>
<ul>
  <li>Claim your surgeon profile</li>
  <li>Update your practice information</li>
  <li>Connect with patients across Australia</li>
</ul>

<p>If you didn't create an account with Bariatric Surgery Hub, you can safely ignore this email.</p>

<hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">

<p style="font-size: 12px; color: #6b7280;">
  <strong>Bariatric Surgery Hub</strong><br>
  Australia's #1 platform for bariatric surgery information<br>
  Website: <a href="https://bariatricsurgeryhub.com">bariatricsurgeryhub.com</a>
</p>
```

### Step 3: Customize "Magic Link" Template (Optional)

If you want to enable magic link login:

```html
<h2>Sign in to Bariatric Surgery Hub</h2>

<p>Click the button below to securely sign in to your Bariatric Surgery Hub account:</p>

<p><a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">Sign In</a></p>

<p>Or copy and paste this link:</p>
<p>{{ .ConfirmationURL }}</p>

<p>This link expires in 1 hour for security.</p>

<p>If you didn't request this email, please ignore it.</p>

<hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">

<p style="font-size: 12px; color: #6b7280;">
  <strong>Bariatric Surgery Hub</strong><br>
  Website: <a href="https://bariatricsurgeryhub.com">bariatricsurgeryhub.com</a>
</p>
```

### Step 4: Customize "Reset Password" Template

```html
<h2>Reset Your Password</h2>

<p>You requested to reset your password for your Bariatric Surgery Hub account.</p>

<p>Click the button below to choose a new password:</p>

<p><a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">Reset Password</a></p>

<p>Or copy and paste this link:</p>
<p>{{ .ConfirmationURL }}</p>

<p>This link expires in 1 hour.</p>

<p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>

<hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">

<p style="font-size: 12px; color: #6b7280;">
  <strong>Bariatric Surgery Hub</strong><br>
  Website: <a href="https://bariatricsurgeryhub.com">bariatricsurgeryhub.com</a>
</p>
```

### Step 5: Configure Email Settings

1. Go to: **Authentication** → **Settings** → **SMTP Settings** (optional)
2. You can use:
   - **Supabase's built-in SMTP** (default, limited but free)
   - **Your own SMTP** (recommended for production)
     - Gmail, SendGrid, AWS SES, etc.

### Step 6: Test the Emails

1. After saving templates, create a test account
2. Check your email inbox
3. Verify the branded email appears correctly
4. Test the confirmation link

## Email Variables Available

You can use these variables in your templates:
- `{{ .ConfirmationURL }}` - The confirmation/magic link URL
- `{{ .Token }}` - The confirmation token
- `{{ .TokenHash }}` - Hashed token
- `{{ .SiteURL }}` - Your site URL (configured in settings)
- `{{ .Email }}` - User's email address

## Advanced: Use Your Own Email Service

For production, consider using a dedicated email service:

### Option 1: SendGrid
1. Create SendGrid account
2. Get API key
3. In Supabase: Authentication → Settings → SMTP
4. Enter SendGrid SMTP details

### Option 2: AWS SES
1. Set up AWS SES
2. Verify domain
3. Configure SMTP credentials
4. Add to Supabase

### Option 3: Resend (Modern Alternative)
1. Sign up at resend.com
2. Get API key
3. Use Supabase Edge Functions to send emails
4. Full control over email design

## Email From Address

To change "from" address:

1. Go to: **Authentication** → **Settings**
2. Find **"Sender email"** field
3. Enter: `noreply@bariatricsurgeryhub.com`
4. Verify domain ownership (for production)

## Email Rate Limits

Supabase free tier limits:
- **Built-in SMTP**: Limited emails per hour
- **Custom SMTP**: Depends on your provider
- **Production**: Use custom SMTP to avoid limits

## Testing Checklist

- [ ] Sign up with test email
- [ ] Check inbox for branded confirmation email
- [ ] Verify "Bariatric Surgery Hub" appears in subject
- [ ] Click confirmation link
- [ ] Ensure redirect works to dashboard
- [ ] Test "from" address shows your brand
- [ ] Check email renders well on mobile

## Troubleshooting

### Emails not sending?
1. Check Supabase logs: Dashboard → Database → Logs
2. Verify email confirmation is enabled
3. Check spam folder
4. Try different email provider (Gmail, Outlook)

### Wrong redirect URL?
1. Go to: Authentication → URL Configuration
2. Update **Site URL** to your domain
3. Add redirect URLs to whitelist

### Emails look broken?
1. Test HTML in email preview tool
2. Avoid complex CSS
3. Use inline styles
4. Test across email clients

## Quick Copy-Paste Setup

**Minimal Branded Confirmation Email:**

```html
<h2>Confirm Your Email - Bariatric Surgery Hub</h2>
<p>Click here to confirm: <a href="{{ .ConfirmationURL }}">Confirm Email</a></p>
<p>Bariatric Surgery Hub - Australia's Trusted Bariatric Surgeon Directory</p>
```

This minimal version ensures branding while keeping it simple.

---

**Status after this**: ✅ All auth emails will mention Bariatric Surgery Hub
