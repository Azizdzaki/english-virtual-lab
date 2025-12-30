# 📱 Panduan Preview Aplikasi Mobile

Aplikasi Expo Anda **sudah berjalan** dan siap untuk di-preview. Ada **3 cara** untuk melihat aplikasi:

---

## 1️⃣ Preview dengan Expo Go (REKOMENDASI - Paling Mudah)

**Keuntungan:**
- ✅ Tidak perlu emulator
- ✅ Bisa di device fisik (Android/iOS)
- ✅ Testing langsung di mobile

### Langkah-langkah:

#### A. Download Expo Go App
- **Android:** https://play.google.com/store/apps/details?id=host.exp.exponent
- **iOS:** https://apps.apple.com/us/app/expo-go/id982107779

#### B. Pastikan Metro Bundler Berjalan
Terminal harus menunjukkan:
```
Starting Metro Bundler
```

Dan akan menampilkan **QR Code** atau URL seperti:
```
Expo Go (Android): exp://192.168.x.x:8081
Expo Go (iOS): exp://192.168.x.x:8081
```

#### C. Buka Expo Go di Device
- **Android:** 
  1. Buka **Expo Go**
  2. Tap tombol **Scan**
  3. Arahkan ke **QR Code** di terminal
  4. Aplikasi otomatis load

- **iOS:**
  1. Buka **Camera** app
  2. Arahkan ke **QR Code** di terminal
  3. Tap link yang muncul
  4. Buka di **Expo Go**

#### D. Lihat Aplikasi Berjalan! 🎉
Aplikasi akan menampilkan:
- ✅ **Splash Screen** (Welcome screen)
- ✅ **Login/Register Page** (jika belum login)
- ✅ **Dashboard** (setelah login)
- ✅ **Bottom Navigation** (5 tabs)

---

## 2️⃣ Preview dengan Android Emulator

**Keuntungan:**
- ✅ Simulasi device Android di laptop
- ✅ Lebih lengkap dari Expo Go
- ✅ Debug lebih mudah

### Prasyarat:
- Android Studio sudah terinstall
- Emulator Android sudah setup

### Langkah-langkah:

#### A. Buka Android Emulator
1. Buka **Android Studio**
2. Buka **Device Manager** (Tools → Device Manager)
3. Klik **Play** (▶) untuk membuka emulator
4. Tunggu emulator startup (2-3 menit)

#### B. Run di Emulator
Dari terminal project Anda:
```powershell
cd C:\Coding\Github\english-virtual-lab\mobile
npm run android
```

Atau:
```powershell
npx expo start --android
```

#### C. Tunggu Build Selesai
Terminal akan menunjukkan progress:
```
Building APK...
Installing APK...
Launching app...
```

#### D. Lihat Aplikasi di Emulator 📱
Aplikasi akan otomatis membuka di emulator dengan fitur lengkap.

---

## 3️⃣ Preview di Web Browser

**Keuntungan:**
- ✅ Tidak perlu device/emulator
- ✅ Development cepat
- ✅ Debug di browser DevTools

**Keterbatasan:**
- ⚠️ Layout mobile tidak sempurna
- ⚠️ Some React Native features tidak support di web
- ⚠️ Testing terbatas

### Langkah-langkah:

#### A. Run Web Version
```powershell
cd C:\Coding\Github\english-virtual-lab\mobile
npm run web
```

Atau:
```powershell
npx expo start --web
```

#### B. Browser Otomatis Membuka
Biasanya akan membuka di `http://localhost:8081` atau `http://localhost:19006`

#### C. Lihat Aplikasi di Browser 🌐
- Tekan **W** di terminal untuk web mode
- Aplikasi akan load di browser
- Bisa lihat Splash, Login, Dashboard

---

## 📊 Perbandingan 3 Cara Preview

| Cara | Setup | Device | Fitur | Debug | Speed |
|------|-------|--------|-------|-------|-------|
| **Expo Go** | 5 min | Mobile/Tablet | ✅ Lengkap | ✅ Bagus | ⚡ Cepat |
| **Android Emulator** | 10 min | Virtual | ✅ Lengkap | ✅ Bagus | ⚠️ Lambat |
| **Web Browser** | Instant | Browser | ⚠️ Limited | ✅ Excellent | ⚡ Cepat |

**REKOMENDASI:** Gunakan **Expo Go** untuk hasil terbaik! 👍

---

## 🎯 Apa Yang Bisa Anda Lakukan di Preview

### Screen yang Sudah Ada:
1. **Splash Screen** - Welcome dengan features
2. **Auth Screen** - Login/Register (belum ada backend)
3. **Dashboard** - Main dashboard dengan stats
4. **Articles** - List artikel (belum ada data)
5. **Videos** - List video (belum ada data)
6. **Quizzes** - List quiz (belum ada data)
7. **Profile** - Profile user & logout

### Fitur yang Bisa Di-Test:
- ✅ Navigation (swipe tabs, back button)
- ✅ UI components (buttons, cards, input)
- ✅ Loading states
- ✅ Error handling
- ✅ Responsive layout
- ✅ Scroll & animations

### Fitur yang Belum Jalan:
- ⚠️ Login/Register (butuh Supabase setup)
- ⚠️ Data dari backend (butuh database)
- ⚠️ Real API calls (butuh credentials)

---

## 🔧 Troubleshooting Preview

### ❌ QR Code Tidak Muncul
**Solusi:**
```powershell
# Pastikan port 8081 tidak terpakai
netstat -ano | findstr :8081

# Jika terpakai, kill process
taskkill /PID <PID> /F

# Restart Expo
npm start
```

### ❌ "Cannot connect to Metro"
**Solusi:**
```powershell
# Pastikan device di network yang sama
# Check IP address Expo memberikan
# Restart device & Expo

npm start --clear
```

### ❌ Emulator Not Found
**Solusi:**
1. Buka Android Studio
2. Create virtual device di AVD Manager
3. Jalankan emulator sebelum `npm run android`

### ❌ Web Version Blank/Error
**Solusi:**
```powershell
# Clear cache dan restart
rm -Force node_modules/.cache
npm start --web
```

---

## 📸 Screenshot & Recording

### Recording Screen di Device:

**Android (dengan ADB):**
```powershell
adb shell screenrecord /sdcard/record.mp4
adb pull /sdcard/record.mp4
```

**iOS:**
- Gunakan QuickTime di Mac (tekan Cmd+Ctrl+Space)

---

## 🚀 Hot Reload & Fast Refresh

Ketika Anda edit code, aplikasi otomatis update:

1. **Edit file** (misal: `App.tsx`)
2. **Save file** (Ctrl+S)
3. **Aplikasi reload otomatis** tanpa rebuild penuh

**Contoh:**
```typescript
// App.tsx
const greeting = "Welcome!"; // Edit ini
// Save → Aplikasi langsung update tanpa refresh manual
```

---

## 📝 Tips Development

### 1. Gunakan Expo Go untuk Development
```powershell
npm start
# Scan QR code di Expo Go
# Edit code → Auto reload
```

### 2. Debug dengan Console Logs
```typescript
// Di component
console.log('Debug message:', data);

// Lihat di Expo Go → More → View logs
```

### 3. Toggle Dev Menu (di Expo Go)
- **Android:** Shake device atau Ctrl+M
- **iOS:** Shake device atau Cmd+D
- **Menu options:**
  - ✅ Reload
  - ✅ View logs
  - ✅ Toggle performance monitoring
  - ✅ Toggle element inspector

### 4. Performance Monitor
- Buka Dev Menu
- Tap "Toggle Performance Monitor"
- Lihat FPS, memory usage, dll

---

## 🎓 Learning Path

### Fase 1: Setup & Preview (SEKARANG)
- ✅ Setup npm dependencies
- ✅ Run Expo server
- ✅ Preview di Expo Go/Emulator
- 🔄 Explore UI & navigate

### Fase 2: Backend Integration (NEXT)
- Setup Supabase project
- Add environment variables
- Test login/register
- Test data fetch

### Fase 3: Testing & Debugging
- Run unit tests
- Debug dengan console logs
- Performance monitoring
- Error handling

### Fase 4: Build & Deployment
- Build APK (Android)
- Build IPA (iOS)
- Submit ke App Store

---

## 📞 Support

**Jika ada masalah:**
1. Check [Expo Documentation](https://docs.expo.dev/)
2. Check console logs di app
3. Try restart Metro Bundler (`npm start`)
4. Try clear cache (`npm start --clear`)

---

**🎉 Sekarang silakan preview aplikasi Anda!** 

Pilih salah satu dari 3 cara di atas dan nikmati development experience Anda!
