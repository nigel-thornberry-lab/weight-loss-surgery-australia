# Profile Image Upload Setup Guide

## Overview
Users with approved profile claims can now upload one profile image (free plan feature). Images are stored in Supabase Storage and the URLs are saved in the `profile_updates` table.

## Features
- **File Upload**: JPG, PNG, or WebP formats
- **Size Limit**: 5MB maximum
- **Image Preview**: Live preview before upload
- **Progress Bar**: Visual feedback during upload
- **Secure Storage**: Images stored in user-specific folders
- **Public Access**: Uploaded images are publicly accessible

## Setup Instructions

### Step 1: Run Storage Setup SQL

1. Go to your Supabase Dashboard
2. Navigate to: **SQL Editor**
3. Run the SQL in `supabase-storage-setup.sql`
4. This will:
   - Create the `profile-images` storage bucket
   - Set up storage policies for upload/read/update/delete
   - Add `profile_image_url` column to `profile_updates` table

### Step 2: Verify Storage Bucket

1. In Supabase Dashboard, go to **Storage**
2. You should see `profile-images` bucket
3. Settings:
   - **Public**: Yes (for public image access)
   - **File size limit**: 5MB
   - **Allowed MIME types**: image/jpeg, image/jpg, image/png, image/webp

### Step 3: Test the Feature

1. Log in to your account
2. Navigate to **Dashboard** → **Claim a Profile**
3. Claim the test surgeon profile
4. As admin, approve the claim (via admin dashboard)
5. Go to **Manage Profile** for that surgeon
6. Upload a profile image:
   - Select an image file (JPG, PNG, or WebP)
   - See live preview
   - Click "Save Changes"
   - Watch progress bar
   - See success message

### Step 4: Verify Upload

1. In Supabase Dashboard, go to **Storage** → **profile-images**
2. Navigate to the folder with your user ID
3. You should see the uploaded image
4. Check **Database** → Table Editor → `profile_updates`
5. Find your latest update
6. The `profile_image_url` field should contain the public URL

## How It Works

### Upload Flow

1. **User selects image** → Preview shown immediately
2. **User clicks "Save Changes"**
3. **Frontend**:
   - Validates file size (5MB max)
   - Gets user session from Supabase Auth
   - Uploads image to `profile-images/{userId}/{timestamp}.{ext}`
   - Shows progress bar
   - Gets public URL from Supabase
4. **Frontend sends profile data + image URL to API**
5. **Backend**:
   - Verifies user has approved claim
   - Saves all data including `profile_image_url` to `profile_updates` table
6. **Admin reviews** the profile update and image
7. **Admin applies** changes to live site

### Storage Structure

```
profile-images/
├── {user-id-1}/
│   ├── 1699123456789.jpg
│   └── 1699234567890.png
├── {user-id-2}/
│   └── 1699345678901.webp
```

### Security

- **Upload**: Only authenticated users can upload
- **Folder Access**: Users can only upload to their own user ID folder
- **Read**: Public read access to all images (needed for displaying on site)
- **Update/Delete**: Users can only modify their own images
- **File Types**: Limited to image formats only
- **Size**: 5MB maximum per file

## File Locations

### Frontend
- **Form**: `src/pages/dashboard/manage/[surgeonId].astro`
  - Image upload field with preview
  - File validation
  - Upload progress indicator

### Backend
- **API**: `src/pages/api/profile/update.ts`
  - Receives image URL in request
  - Saves to `profile_updates` table

### Database
- **Setup SQL**: `supabase-storage-setup.sql`
  - Creates storage bucket
  - Sets up policies
  - Adds column to table

## Database Schema

### profile_updates Table (Updated)

```sql
CREATE TABLE profile_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  surgeon_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  updates JSONB NOT NULL,
  profile_image_url TEXT,  -- NEW COLUMN
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  applied BOOLEAN DEFAULT FALSE
);
```

### Storage Policies

1. **Upload**: Users can upload to `profile-images/{their-user-id}/*`
2. **Read**: Anyone can read from `profile-images/*`
3. **Update**: Users can update `profile-images/{their-user-id}/*`
4. **Delete**: Users can delete `profile-images/{their-user-id}/*`

## User Experience

### Before Upload
```
┌─────────────────────────────────┐
│ Profile Image                   │
├─────────────────────────────────┤
│ ┌──────┐                        │
│ │ 👤   │  [Choose File]         │
│ │      │  No file chosen        │
│ └──────┘                        │
│ JPG, PNG or WebP. Max 5MB       │
└─────────────────────────────────┘
```

### After Selecting Image
```
┌─────────────────────────────────┐
│ Profile Image                   │
├─────────────────────────────────┤
│ ┌──────┐                        │
│ │[IMG] │  [profile-photo.jpg]   │
│ │      │                        │
│ └──────┘                        │
│ ████████░░ Uploading... 80%     │
└─────────────────────────────────┘
```

### After Upload Success
```
┌─────────────────────────────────┐
│ ✓ Profile updated successfully! │
│   Your changes will be reviewed │
│   before going live.             │
└─────────────────────────────────┘
```

## Troubleshooting

### "Not authenticated" Error
- User's session has expired
- Ask user to log out and log back in
- Check Supabase Auth is working

### "Image upload failed: new row violates row-level security policy"
- Storage bucket policies not set up correctly
- Run the SQL in `supabase-storage-setup.sql` again
- Verify policies exist in Supabase Dashboard → Storage → Policies

### "Image must be less than 5MB"
- User selected file larger than 5MB
- Ask them to compress or resize the image
- Recommend online tools like TinyPNG or ImageOptim

### Image uploads but doesn't save to database
- Check `profile_updates` table has `profile_image_url` column
- Run the ALTER TABLE command from `supabase-storage-setup.sql`
- Check browser console for API errors

### Upload button disabled after error
- JavaScript error in browser console
- Refresh page and try again
- Check Supabase credentials are correct

## Future Enhancements

### Potential Improvements
1. **Image Optimization**:
   - Auto-resize to 400x400px
   - Convert to WebP for smaller file size
   - Generate thumbnails

2. **Multiple Images**:
   - Allow gallery of images on paid plans
   - Before/after photos
   - Facility photos

3. **Cropping Tool**:
   - In-browser image cropper
   - Ensure square aspect ratio
   - Zoom and reposition

4. **CDN Integration**:
   - Use Cloudflare or similar CDN
   - Faster image delivery
   - Automatic optimization

5. **Image Moderation**:
   - AI-based content moderation
   - Flag inappropriate images
   - Auto-reject violating content

## Testing Checklist

- [ ] Storage bucket created in Supabase
- [ ] Policies set up correctly
- [ ] `profile_image_url` column added to table
- [ ] Can select image file
- [ ] Preview shows correctly
- [ ] File size validation works (try 6MB file)
- [ ] Upload progress bar shows
- [ ] Image uploads to correct folder
- [ ] Public URL is accessible
- [ ] Profile update saved with image URL
- [ ] Success message displays
- [ ] Form resets properly
- [ ] Can upload another image

## API Reference

### Upload Image (Client-Side)

```javascript
const { data, error } = await supabase.storage
  .from('profile-images')
  .upload(`${userId}/${timestamp}.${ext}`, file, {
    cacheControl: '3600',
    upsert: false
  });

const { data: { publicUrl } } = supabase.storage
  .from('profile-images')
  .getPublicUrl(fileName);
```

### Save Profile Update (API)

```javascript
POST /api/profile/update
Content-Type: application/json

{
  "surgeon_id": "test-surgeon-sydney",
  "business_name": "Updated Name",
  "profile_image_url": "https://xxx.supabase.co/storage/v1/object/public/profile-images/user-id/123.jpg",
  ...other fields
}
```

## Support

If you encounter issues:
1. Check Supabase Dashboard logs
2. Check browser console for errors
3. Verify storage bucket settings
4. Test with a different image file
5. Try logging out and back in

---

**Status**: ✅ Ready to test after running SQL setup
