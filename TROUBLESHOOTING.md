## Troubleshooting Certificate Upload Issues

Jika Anda mengalami error "Failed to fetch" atau "Network error" saat upload certificate, coba langkah berikut:

### 1. **Cek Koneksi Backend**

- Lihat status "Backend online/offline" di navbar
- Pastikan backend berjalan di: `https://portofolio-backend-beta.vercel.app`
- Coba buka URL backend di browser untuk memastikan server aktif

### 2. **Cek Console Log**

Error log akan menampilkan detail:

```
Creating certification...
- isFormData: true
- url: https://...
- hasToken: true
- baseUrl: https://...
```

### 3. **Penyebab Umum**

- **Backend offline**: Server Vercel mungkin sedang sleep atau error
- **CORS issue**: Backend belum configure CORS untuk frontend URL
- **File terlalu besar**: Maximum 10MB (sudah ada validasi)
- **Token expired**: Login ulang jika sudah lama
- **Browser extension**: Extension seperti ad blocker bisa block request

### 4. **Solusi Quick Fix**

#### A. Test Backend Connection

```bash
# Test health endpoint
curl https://portofolio-backend-beta.vercel.app/api/health

# Should return: {"status":"OK","message":"Server is running"}
```

#### B. Clear Browser Cache

1. Buka DevTools (F12)
2. Network tab → Disable cache
3. Application tab → Clear storage
4. Refresh halaman

#### C. Check CORS Headers

Di backend, pastikan ada:

```javascript
app.use(
  cors({
    origin: ["http://localhost:3000", "https://your-frontend.vercel.app"],
    credentials: true,
  })
);
```

#### D. Try Different Browser

Test di browser lain untuk isolate issue

### 5. **Error Messages Guide**

| Error Message              | Penyebab                               | Solusi                      |
| -------------------------- | -------------------------------------- | --------------------------- |
| "Request timeout"          | File terlalu besar atau koneksi lambat | Gunakan file < 5MB          |
| "Cannot connect to server" | Backend offline atau CORS              | Cek backend status          |
| "Upload timeout"           | File > 10MB atau koneksi terputus      | Compress file, cek internet |
| "Backend offline"          | Vercel cold start atau down            | Tunggu 30 detik, coba lagi  |

### 6. **File Size Tips**

- **Images**: Compress ke < 2MB menggunakan TinyPNG
- **PDF**: Compress menggunakan iLovePDF atau Smallpdf
- Optimal size: 1-3MB untuk balance quality/speed

### 7. **Backend Wake Up**

Jika backend Vercel sleep:

1. Buka `https://portofolio-backend-beta.vercel.app/api/health`
2. Tunggu 10-15 detik untuk cold start
3. Refresh dashboard
4. Coba upload lagi

### 8. **Development Mode**

Jika run locally:

```bash
# Backend (port 5000)
cd portfolio-backend
npm run dev

# Frontend (port 3000)
cd portfolio-dashboard
npm run dev

# Update .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 9. **Contact Support**

Jika masalah persist, capture:

- Console error screenshot
- Network tab (DevTools) showing failed request
- Backend logs (jika akses)
