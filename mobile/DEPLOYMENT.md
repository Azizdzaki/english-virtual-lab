## EAS Build Configuration

Untuk melakukan build APK menggunakan EAS (Expo Application Services), ikuti langkah-langkah berikut:

### 1. Setup EAS CLI
```bash
npm install -g eas-cli
eas login
```

### 2. Initialize EAS Project
```bash
eas init
# Pilih existing project
```

### 3. Build APK untuk Android
```bash
# Build untuk testing
eas build --platform android

# Build APK lokal (tanpa server)
eas build --platform android --local
```

### 4. Build untuk iOS (memerlukan Mac)
```bash
eas build --platform ios
```

### 5. Preview Build Sebelum Submit
```bash
eas submit --platform android --latest
```

### Configuration (eas.json)
```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "preview2": {
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "buildType": "simulator"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./service-account-key.json"
      }
    }
  }
}
```

### Important Notes
- Pastikan semua environment variables sudah set
- Pastikan app.json sudah dikonfigurasi dengan benar
- APK yang dihasilkan bisa langsung diinstall di Android device

### Troubleshooting

**Build gagal karena dependencies:**
```bash
rm -rf node_modules package-lock.json
npm install
eas build --platform android --local --clear-cache
```

**Issues dengan Supabase:**
- Pastikan EXPO_PUBLIC_SUPABASE_URL dan EXPO_PUBLIC_SUPABASE_ANON_KEY sudah correct
- Check Supabase project settings

**Image atau asset tidak ditemukan:**
- Pastikan semua file di folder assets sudah ada
- Rebuild dari fresh: `eas build --platform android --local --clear-cache`
