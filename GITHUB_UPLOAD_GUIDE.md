# Upload GlotBase ke GitHub - Manual Guide

## Cara 1: Via GitHub Web (Tanpa Git)

### Step 1: Buat Repository di GitHub
1. Buka https://github.com dan login
2. Klik tombol **+** (kanan atas) → **New repository**
3. Isi form:
   - **Repository name:** glotbase
   - **Description:** Conlang Archive & Builder - A modern web app for constructed languages
   - **Public** atau **Private** (pilih sesuai keinginan)
   - ❌ JANGAN centang "Add a README file" (sudah ada)
   - ❌ JANGAN add .gitignore (sudah ada)
4. Klik **Create repository**

### Step 2: Upload Files
1. Di halaman repository baru, klik **uploading an existing file**
2. **Drag & drop** atau **choose files**:
   - Upload semua file KECUALI folder `node_modules`
   - Folder yang perlu di-upload:
     - `src/` (semua isi folder)
     - `public/`
     - `index.html`
     - `package.json`
     - `vite.config.ts`
     - `tsconfig.json`
     - `README.md`
     - `.gitignore`
3. Tulis commit message: "Initial commit - GlotBase v1.0"
4. Klik **Commit changes**

### ⚠️ PENTING: Jangan Upload
- ❌ `node_modules/` folder (terlalu besar, tidak perlu)
- ❌ `dist/` folder (file build, bisa di-generate ulang)

---

## Cara 2: Via Git Command Line (Setelah Install Git)

```bash
# Step 1: Initialize git
git init

# Step 2: Add all files
git add .

# Step 3: Commit
git commit -m "Initial commit - GlotBase v1.0"

# Step 4: Add remote (ganti USERNAME dengan GitHub username Anda)
git remote add origin https://github.com/USERNAME/glotbase.git

# Step 5: Push
git branch -M main
git push -u origin main
```

---

## Setelah Upload

### Clone & Run di Device Lain:
```bash
git clone https://github.com/USERNAME/glotbase.git
cd glotbase
npm install
npm run dev
```

### Update Repository:
```bash
# Add changes
git add .

# Commit with message
git commit -m "Your update message"

# Push
git push
```

---

## Deploy ke GitHub Pages (Optional - Free Hosting!)

### Step 1: Update vite.config.ts
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/glotbase/', // Tambahkan ini
})
```

### Step 2: Build
```bash
npm run build
```

### Step 3: Deploy
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

### Step 4: Enable GitHub Pages
1. Buka repository di GitHub
2. Settings → Pages
3. Source: **gh-pages** branch
4. Save

Aplikasi akan live di: `https://USERNAME.github.io/glotbase/`

---

## Tips

1. **Backup Data:**
   - Export lexicon ke JSON sebelum deploy
   - LocalStorage akan clear kalau ganti device

2. **Update README:**
   - Tambahkan live demo link
   - Tambahkan screenshots
   - Update installation instructions

3. **Add License:**
   - Buat file `LICENSE`
   - Pilih MIT, GPL, atau Apache

4. **Git Best Practices:**
   - Commit secara regular
   - Gunakan descriptive commit messages
   - Create branches untuk features baru

---

**Happy Coding!** 🚀
