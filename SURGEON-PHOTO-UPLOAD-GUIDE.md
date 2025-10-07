# Surgeon Photo Upload & Optimization Guide

## 📸 Quick Start

### Step 1: Upload Raw Photos

Upload surgeon photos to this folder:
```
public/surgeons/images/raw/
```

**Naming Convention:**
- Use the surgeon's slug from the CSV (column 19)
- Format: `{surgeon-slug}.jpg` or `{surgeon-slug}.png`
- Example: `dr-devesh-kaushal-gregory-hills.jpg`

### Step 2: Run the Optimization Script

```bash
node scripts/optimize-surgeon-photos.cjs
```

This script will:
- ✅ Resize images to optimal dimensions (800x1000px)
- ✅ Convert to WebP format (90% smaller file size)
- ✅ Generate multiple sizes (thumbnail, medium, large)
- ✅ Add SEO-friendly alt text
- ✅ Update the CSV with new photo paths
- ✅ Generate optimized files to `public/surgeons/images/`

### Step 3: Regenerate Site

```bash
node scripts/generate-all-profiles.cjs
```

### Step 4: Deploy

```bash
git add -A
git commit -m "Add optimized surgeon photos"
git push origin main
vercel --prod --yes
```

---

## 📋 Detailed Workflow

### Photo Requirements

**Source Requirements:**
- Minimum resolution: 600x800px
- Preferred format: JPG or PNG
- Professional headshot or official website photo
- Clear face visibility
- Professional attire

**Output Specifications:**
- Format: WebP (modern, 80-90% smaller than JPG)
- Dimensions: 800x1000px (4:5 ratio for profile cards)
- Quality: 85% (optimal balance of quality/size)
- File size target: < 100KB per photo

### Finding Best Photos

**Priority Order:**
1. Official surgeon website profile photo
2. Hospital/clinic website staff photo  
3. LinkedIn professional photo
4. Medical directory listings
5. Conference/presentation photos

**What to Avoid:**
- Group photos (unless can crop individual)
- Low resolution images
- Casual/vacation photos
- Photos with watermarks
- Screenshots (unless high quality)

---

## 🗂️ File Structure

```
public/surgeons/images/
├── raw/                          # Upload your raw photos here
│   ├── dr-devesh-kaushal-gregory-hills.jpg
│   ├── dr-paul-burton-brighton.jpg
│   └── ...
│
├── optimized/                    # Auto-generated optimized photos
│   ├── dr-devesh-kaushal-gregory-hills.webp
│   ├── dr-paul-burton-brighton.webp
│   └── ...
│
└── thumbnails/                   # Auto-generated thumbnails
    ├── dr-devesh-kaushal-gregory-hills.webp
    └── ...
```

---

## 🔍 Finding Surgeon Slugs

**Option 1: Check the CSV**
```bash
cat surgeons-with-bios.csv | cut -d',' -f2,19 | column -t -s','
```

**Option 2: List all surgeon pages**
```bash
find src/pages/surgeons -name "dr-*.astro" -o -name "mr-*.astro" -o -name "prof-*.astro" | sed 's/.*\///' | sed 's/.astro//' | sort
```

**Option 3: Reference list in CSV** (Column 19 = slug)

---

## 🎯 Batch Processing

### Process All at Once
1. Download all photos from surgeon websites
2. Name them with correct slugs
3. Place all in `public/surgeons/images/raw/`
4. Run optimization script once
5. Review output
6. Deploy

### Process in Batches
- Sydney surgeons (batch 1)
- Melbourne surgeons (batch 2)
- Other cities (batch 3)

---

## ✅ Quality Checklist

Before uploading:
- [ ] Photo is high resolution (600x800px minimum)
- [ ] Clear face visibility
- [ ] Professional appearance
- [ ] No watermarks or text overlays
- [ ] Named with correct surgeon slug
- [ ] Format is JPG or PNG

After optimization:
- [ ] WebP conversion successful
- [ ] File size < 100KB
- [ ] Image quality acceptable
- [ ] Photo displays correctly on profile
- [ ] Alt text generated correctly

---

## 🚀 Quick Commands

### Check how many surgeons need photos
```bash
grep -c 'surgeon_photo.*svg' surgeons-with-bios.csv
```

### List surgeons without photos
```bash
cat surgeons-with-bios.csv | awk -F',' '$26 ~ /svg/ {print $2 " - " $19}'
```

### Test optimization on one photo
```bash
node scripts/optimize-surgeon-photos.cjs --test dr-devesh-kaushal-gregory-hills
```

---

## 📊 Expected Results

**Before:**
- 70 surgeons with placeholder icons or poor quality photos
- Large file sizes (200KB+ per photo)
- Inconsistent image dimensions

**After:**
- 70 surgeons with professional, optimized photos
- Small file sizes (< 100KB per photo)
- Consistent 800x1000px dimensions
- Modern WebP format (better quality, smaller size)
- Faster page loads
- Better SEO with descriptive alt text

---

## 💡 Tips

1. **Batch download**: Use a browser extension to download all photos from a surgeon's website
2. **Consistent naming**: Keep a spreadsheet mapping surgeon names to slugs
3. **Quality over quantity**: Better to have 10 excellent photos than 70 mediocre ones
4. **Start with top surgeons**: Prioritize high-traffic profiles first
5. **Check mobile**: Verify photos look good on mobile devices

---

## 🔧 Troubleshooting

**Photo doesn't appear:**
- Check file name matches slug exactly
- Verify file is in `raw/` folder
- Check file extension (jpg/png only)

**Photo quality poor after optimization:**
- Try higher quality setting in script (90% instead of 85%)
- Ensure source image is high resolution

**Script fails:**
- Install dependencies: `npm install sharp`
- Check Node.js version: `node --version` (need v14+)

---

## 📞 Need Help?

Run the optimization script with `--help` flag:
```bash
node scripts/optimize-surgeon-photos.cjs --help
```

