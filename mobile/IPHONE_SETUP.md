# 📱 Panduan Membuka Aplikasi di iPhone dengan Expo Go

**Status:** ✅ Aplikasi sudah siap di-preview di iPhone Anda!

Metro Bundler sedang berjalan dan siap untuk di-connect. Ikuti langkah-langkah berikut:

---

## 🎯 Langkah-Langkah untuk iPhone

### 1️⃣ Download Expo Go (Jika Belum Ada)
- **App Store:** https://apps.apple.com/us/app/expo-go/id982107779
- Cari "Expo Go"
- Download & install

### 2️⃣ Setup Network Connection
**Pastikan:**
- ✅ iPhone dan laptop/computer dalam **satu WiFi network yang sama**
- ✅ WiFi nyala di iPhone
- ✅ WiFi dihubungkan ke router yang sama

### 3️⃣ Buka Camera App di iPhone

Lihat di terminal Anda, akan ada URL seperti ini:
```
exp://192.168.x.x:8081
or
exp://YOUR_IP_ADDRESS:8081
```

**Di iPhone:**
1. Buka **Camera** app
2. Arahkan ke layar computer Anda (tempat Metro Bundler berjalan)
3. Lihat QR Code di terminal/browser

### 4️⃣ Scan QR Code

**Di iPhone Camera App:**
- Arahkan kamera ke QR Code
- Notification akan muncul: "Open with Expo Go?"
- Tap notification
- **Expo Go akan buka otomatis**

### 5️⃣ Tunggu Loading

Aplikasi akan:
- Loading dependencies
- Building aplikasi
- Menampilkan aplikasi Anda! 🎉

### 6️⃣ Lihat Aplikasi Berjalan! 📱

Anda sekarang bisa melihat:
- ✅ **Splash Screen** (halaman welcome)
- ✅ **Navigation** (swipe antar tabs)
- ✅ **All Screens** (Dashboard, Articles, Videos, Quiz, Profile)
- ✅ **Animations & Transitions**

---

## ⚙️ Jika QR Code Tidak Muncul

**Terminal Expo akan menampilkan pilihan:**

```
Press a to open Android
Press i to open iOS simulator
Press w to open web
Press o to toggle logging
Press c to show QR code
...
```

Jika QR Code tidak terlihat:
1. **Tekan `c`** di terminal
2. QR Code akan ditampilkan di terminal
3. Scan dengan iPhone

---

## 🔗 Alternatif: Buka Dengan Link

Jika scan QR code tidak berhasil:

### Cara 1: Copy URL dari Terminal
1. Di terminal, cari URL seperti: `exp://192.168.1.100:8081`
2. Copy URL tersebut
3. Di iPhone, buka **Expo Go**
4. Tap search bar
5. Paste URL
6. Enter

### Cara 2: Buka Browser di iPhone
1. Di computer, buka browser: `http://localhost:8081`
2. Akan muncul QR Code di browser
3. iPhone scan QR Code dari browser

---

## 🐛 Troubleshooting

### ❌ "Cannot Connect to Metro"

**Solusi:**
```
1. Pastikan laptop & iPhone di WiFi sama
2. Di laptop: Buka CMD/Terminal di folder project
3. Run: ipconfig (Windows) atau ifconfig (Mac)
4. Cari IPv4 Address (misal: 192.168.1.100)
5. Pastikan IP address itu muncul di Metro Bundler
```

### ❌ "Network Timeout"

**Solusi:**
```
1. Restart WiFi di iPhone
2. Atau, gunakan USB tethering:
   - Connect iPhone ke laptop dengan USB cable
   - Enable Personal Hotspot di iPhone
   - Connect laptop ke hotspot iPhone
```

### ❌ "Expo Go Not Found"

**Solusi:**
```
1. Buka App Store di iPhone
2. Search: "Expo Go"
3. Download & install
4. Try again
```

### ❌ Loading Lambat/Error

**Solusi:**
```
1. Close Expo Go app
2. Restart Metro Bundler (Ctrl+C, then npm start)
3. Clear cache: npm start --clear
4. Buka Expo Go lagi dan scan QR
```

---

## 📡 Networking Tips

### Jika Laptop & iPhone Di Network Berbeda

**Option 1: Gunakan USB (Recommended)**
```
1. Connect iPhone ke laptop dengan USB cable
2. Trust connection di iPhone
3. Buka Terminal/CMD
4. Run: adb reverse tcp:8081 tcp:8081
5. Scan QR code dari laptop screen
```

**Option 2: Hotspot**
```
1. iPhone: Settings → Personal Hotspot → On
2. Laptop: Connect ke iPhone hotspot
3. Scan QR code
4. Aplikasi akan load via hotspot
```

---

## 🎨 Apa Yang Bisa Dilihat

### Screens yang Sudah Ada:
1. **Splash Screen** ✅
   - Welcome message
   - Feature list
   - Get Started button

2. **Auth Screen** ✅ (Belum connect ke Supabase)
   - Login form
   - Register form
   - Email & password input

3. **Dashboard** ✅ (Belum ada data)
   - User greeting
   - Statistics
   - Course list

4. **Articles** ✅ (Belum ada data)
   - Article list
   - Search functionality
   - Category filter

5. **Videos** ✅ (Belum ada data)
   - Video list
   - Play button
   - Video details

6. **Quizzes** ✅ (Belum ada data)
   - Quiz list
   - Statistics
   - Take quiz button

7. **Profile** ✅ (Belum ada user data)
   - User profile
   - Account settings
   - Logout button

### Fitur yang Bisa Di-Test:
- ✅ Navigation (swipe, tap tabs)
- ✅ Loading states
- ✅ Error messages
- ✅ Button interactions
- ✅ Form inputs
- ✅ Responsive layout
- ✅ Animations

### Belum Jalan:
- ⚠️ Login/Register (butuh Supabase)
- ⚠️ Data dari backend (database belum setup)
- ⚠️ Real API calls

---

## 🔄 Hot Reload (Auto Refresh)

**Keuntungan Expo Go:**
- Edit code → Save → Aplikasi otomatis reload
- Tidak perlu rebuild atau restart

**Contoh:**
```typescript
// Dalam file App.tsx atau component apapun
const greeting = "Welcome!"; // Edit ini

// Tekan Ctrl+S (atau Cmd+S di Mac)
// Aplikasi otomatis refresh di iPhone!
```

---

## 📸 Tips Menggunakan Aplikasi

### Dev Menu (Shake to Open)
**Di iPhone dengan Expo Go:**
1. Shake device (atau Cmd+D kalau simulator)
2. Menu akan muncul dengan opsi:
   - ✅ Reload
   - ✅ View logs
   - ✅ Performance monitor
   - ✅ Element inspector

### Lihat Console Logs
1. Buka Dev Menu (shake device)
2. Tap "View logs"
3. Lihat console output
4. Useful untuk debugging!

---

## 🚀 Next Steps

Setelah preview di iPhone berhasil:

### 1. Setup Supabase (untuk login/data)
- Buat project di supabase.com
- Copy credentials ke .env.local
- Run SQL migrations

### 2. Setup Database
- Create tables untuk courses, articles, videos, quizzes
- Insert sample data
- Test API connections

### 3. Testing
- Coba login
- Coba fetch data
- Test semua features

### 4. Build APK/IPA
- Run: eas build --platform ios
- Download IPA file
- Submit ke App Store

---

## 📞 Quick Reference

| Action | Shortcut |
|--------|----------|
| Reload App | Dev Menu → Reload |
| View Logs | Dev Menu → View logs |
| Performance Monitor | Dev Menu → Perf Monitor |
| Toggle DevTools | Shake device |
| Stop Metro | Ctrl+C |

---

## ✅ Checklist

- [ ] Downloaded Expo Go dari App Store
- [ ] Laptop & iPhone same WiFi
- [ ] Metro Bundler running (npm start)
- [ ] QR Code visible di terminal
- [ ] Scanned QR dengan iPhone camera
- [ ] Expo Go opened otomatis
- [ ] Aplikasi loading di iPhone
- [ ] Bisa lihat Splash Screen
- [ ] Bisa swipe antar tabs
- [ ] Bisa open Dev Menu (shake)

---

**🎉 Selesai! Aplikasi sudah bisa dibuka di iPhone Anda!**

Enjoy development dengan Expo Go! 📱✨
