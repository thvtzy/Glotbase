# How to Add Screenshots to GitHub README

## Method 1: Upload Screenshots to Repository (Recommended)

### Step 1: Create Screenshots Folder
```bash
# Create folder di root project
mkdir screenshots
```

### Step 2: Take Screenshots
1. **Buka aplikasi** (http://localhost:5173)
2. **Ambil screenshots** untuk setiap fitur:
   - Dashboard
   - Smart Lexicon
   - Affix Calculator
   - Export/Import

**Windows Shortcut:**
- `Win + Shift + S` → Snipping Tool
- Save as PNG

**Nama File yang Bagus:**
```
screenshots/
  ├── dashboard.png
  ├── lexicon.png
  ├── affix-calculator.png
  └── export-import.png
```

### Step 3: Upload ke GitHub

**Jika upload manual (via web):**
1. Buka repository di GitHub
2. Klik **Add file** → **Upload files**
3. Drag & drop semua screenshots
4. Commit

**Jika pakai Git:**
```bash
git add screenshots/
git commit -m "Add screenshots"
git push
```

### Step 4: Update README.md

Di README, gambar sudah otomatis link ke path yang benar:
```markdown
![Dashboard](screenshots/dashboard.png)
```

GitHub akan otomatis render gambar dari folder `screenshots/`.

---

## Method 2: Use GitHub Issues (Quick & Easy)

### Step 1: Create Dummy Issue
1. Buka repository di GitHub
2. **Issues** tab → **New issue**
3. Title: "Screenshots" (atau apa saja)

### Step 2: Upload Images
1. Di comment box, **drag & drop** atau paste screenshot
2. GitHub auto-upload dan generate URL seperti:
   ```
   https://user-images.githubusercontent.com/xxx/xxx.png
   ```
3. **Copy URL** yang di-generate
4. Bisa close issue atau leave open

### Step 3: Update README
Replace path dengan URL:
```markdown
![Dashboard](https://user-images.githubusercontent.com/12345/dashboard.png)
```

**Pros:**
- ✅ Cepat, drag & drop
- ✅ Tidak perlu commit file besar
- ✅ CDN hosting dari GitHub

**Cons:**
- ❌ URL jelek
- ❌ Tergantung issue tidak dihapus

---

## Method 3: Use imgur.com (External Hosting)

### Step 1: Upload ke Imgur
1. Buka https://imgur.com
2. **New post** → Upload screenshots
3. Copy **Direct link** (ends with .png or .jpg)

### Step 2: Update README
```markdown
![Dashboard](https://i.imgur.com/abc123.png)
```

**Pros:**
- ✅ Tidak perlu repository space
- ✅ Fast CDN

**Cons:**
- ❌ External dependency
- ❌ Bisa dihapus kapan saja

---

## Recommended Approach

**Best Practice: Method 1 (Upload to Repository)**

1. Create `screenshots/` folder
2. Add good quality PNG screenshots
3. Keep file sizes reasonable (<500KB each)
4. Upload to repository
5. Link in README relative to repo root

**File Structure:**
```
glotbase/
├── screenshots/
│   ├── dashboard.png
│   ├── lexicon.png
│   ├── affix-calculator.png
│   └── export-import.png
├── src/
├── public/
├── README.md
└── package.json
```

**In README.md:**
```markdown
## 📸 Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)
*Real-time statistics and progress tracking*

### Smart Lexicon
![Lexicon](screenshots/lexicon.png)
*Multi-script word entry with comprehensive fields*

### Affix Calculator
![Affix Calculator](screenshots/affix-calculator.png)
*Automatic word derivation engine*

### Export/Import
![Export](screenshots/export-import.png)
*Backup and restore your lexicon*
```

---

## Tips Membuat Screenshots yang Bagus

### 1. **Full Window Screenshot**
- Tampilkan full interface, tidak separuh-separuh
- Pastikan sidebar dan content terlihat

### 2. **Add Sample Data**
- Jangan screenshot empty state
- Tambah 2-3 sample words dulu
- Fill in semua fields di form

### 3. **Good Lighting/Contrast**
- Dark mode sudah bagus untuk contrast
- Pastikan text readable

### 4. **Consistent Window Size**
- Resize browser ke ukuran yang sama (e.g., 1280x800)
- Semua screenshots punya aspect ratio sama

### 5. **Hide Personal Data**
- Tidak ada data pribadi di screenshots
- Use dummy/example data

---

## Image Optimization (Optional)

Sebelum upload, compress images:

**Online Tools:**
- https://tinypng.com (best for PNG)
- https://squoosh.app (Google's tool)

**Target Size:**
- <300KB per screenshot ideal
- <500KB acceptable
- >1MB too large (compress!)

---

## Quick Checklist

- [ ] Create `screenshots/` folder
- [ ] Take 4 screenshots (Dashboard, Lexicon, Affix, Export)
- [ ] Save as PNG with good names
- [ ] (Optional) Compress images
- [ ] Upload to GitHub repository
- [ ] Verify images show in README
- [ ] Delete example image paths if not using

---

**Done!** Screenshots akan muncul di GitHub README. 📸✨
