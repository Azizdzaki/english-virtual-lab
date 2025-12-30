# English Virtual Lab - Mobile Application

## 📱 Deskripsi Aplikasi

English Virtual Lab adalah aplikasi mobile cross-platform yang dikembangkan menggunakan React Native dan Expo untuk membantu pengguna belajar bahasa Inggris melalui kursus interaktif, video pembelajaran, artikel, dan kuis.

## 🚀 Fitur Utama

### 1. **Autentikasi Pengguna**
- Sign Up dengan validasi email dan password
- Sign In untuk pengguna yang sudah terdaftar
- Integrasi dengan Supabase untuk manajemen pengguna
- Persistent session menggunakan AsyncStorage

### 2. **Dashboard**
- Menampilkan statistik pembelajaran pengguna
- Daftar kursus populer
- Quick access ke berbagai fitur
- Personalisasi berdasarkan profil pengguna

### 3. **Kursus Pembelajaran**
- Daftar lengkap kursus dengan kategori
- Detail kursus lengkap dengan durasi dan tingkat kesulitan
- Progress tracking per modul
- Status completion tracking

### 4. **Artikel Pembelajaran**
- Koleksi artikel yang dikurasi dengan baik
- Pencarian artikel berdasarkan judul dan konten
- Kategori artikel
- Informasi penulis dan tanggal publikasi

### 5. **Video Pembelajaran**
- Streaming video pembelajaran
- Informasi durasi video
- Kategori video
- Integrasi dengan platform video eksternal

### 6. **Kuis Interaktif**
- Multiple choice questions
- True/False questions
- Short answer questions
- Sistem scoring otomatis
- Tracking quiz attempts
- Sertifikat untuk quiz yang lulus

### 7. **Profil Pengguna**
- Informasi lengkap pengguna
- Edit profil
- Statistik pembelajaran
- Logout functionality

## 📋 Stack Teknologi

### Frontend
- **React Native 0.81.5** - Framework aplikasi mobile
- **Expo 54.0.25** - Platform build dan deployment
- **React Navigation 7.x** - Navigation library
- **TypeScript 5.9** - Type-safe programming

### Backend
- **Supabase** - Backend-as-a-Service untuk autentikasi dan database
- **PostgreSQL** - Database relasional

### Tools & Libraries
- **AsyncStorage** - Local data storage
- **React Native Reanimated** - Animation library
- **NativeWind** - Tailwind CSS untuk React Native
- **Jest** - Testing framework

## 📁 Struktur Folder

```
mobile/
├── src/
│   ├── screens/              # Semua screen pages
│   ├── components/           # Reusable UI components
│   ├── navigation/           # Navigation configuration
│   ├── contexts/             # React Context providers
│   ├── services/             # API dan business logic
│   ├── hooks/                # Custom hooks
│   ├── types/                # TypeScript type definitions
│   ├── utils/                # Utility functions
│   └── __tests__/            # Test files
├── App.tsx                   # Root component
├── app.json                  # Expo configuration
├── package.json              # Dependencies
├── babel.config.js           # Babel configuration
└── tsconfig.json             # TypeScript configuration
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 16+ dan npm/yarn
- Expo CLI
- Android Studio atau Xcode (untuk emulator)

### Installation Steps

1. **Install Dependencies**
```bash
cd mobile
npm install
```

2. **Setup Environment Variables**
```bash
cp .env.example .env.local
# Edit .env.local dengan Supabase credentials Anda
```

3. **Install Expo Go** (untuk testing di device)
```bash
npm install -g expo-cli
```

## 🚀 Running the App

### Development Mode
```bash
npm start
```

### Android
```bash
npm run android
```

### iOS
```bash
npm run ios
```

### Web
```bash
npm run web
```

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Run Tests dengan Coverage
```bash
npm test -- --coverage
```

## 📦 Build & Deployment

### Dengan EAS Build
```bash
npm install -g eas-cli
eas init
eas build --platform android
eas build --platform ios
```

### Generate APK Lokal
```bash
eas build --platform android --local
```

## 📱 Responsive Design

Aplikasi ini dirancang dengan prinsip mobile-first dan responsive di berbagai ukuran layar:
- Smartphone (320px - 480px)
- Tablet (481px - 768px)
- Large Tablet (769px+)

## 🎨 UI/UX Features

- **Color Scheme**: Blue (#3b82f6) sebagai primary, Gray sebagai secondary
- **Typography**: Clean dan readable fonts
- **Icons**: Emoji-based icons untuk simplicity
- **Bottom Tab Navigation**: 5 tab utama untuk easy access
- **Touch-friendly**: Proper touch targets (minimum 48x48 dp)

## 📊 Database Schema (Supabase)

### Tables
- `auth.users` - User authentication
- `public.courses` - Course information
- `public.modules` - Course modules
- `public.articles` - Learning articles
- `public.videos` - Video resources
- `public.quizzes` - Quiz questions
- `public.questions` - Quiz questions detail
- `public.quiz_attempts` - User quiz results
- `public.user_progress` - User learning progress

## 🔐 Security Features

- Password validation dengan strict rules
- Secure token storage di AsyncStorage
- HTTPS untuk semua API calls
- Input validation di frontend dan backend
- SQL injection prevention via Supabase
- CORS configuration

## 🐛 Known Issues & Limitations

1. Video playback memerlukan external app (YouTube, etc.)
2. Offline mode belum fully implemented
3. Real-time collaboration features tidak tersedia
4. Push notifications belum diimplementasikan

## 🔮 Future Enhancements

1. **Offline Mode**
   - Sync data ketika online
   - Download video untuk offline viewing

2. **Advanced Features**
   - Live tutoring sessions
   - Peer learning communities
   - Gamification (points, badges, leaderboard)
   - AI-powered pronunciation checking

3. **Performance**
   - Image optimization
   - Code splitting
   - Lazy loading

4. **Localization**
   - Multiple language support
   - RTL language support

## 📞 Support & Contact

Untuk support dan pertanyaan, silakan hubungi:
- Email: support@englishvirtuallab.com
- GitHub Issues: [Repository Issues]

## 📄 License

MIT License - Lihat file LICENSE untuk detail

## 👥 Contributors

- **Developer Team**: English Virtual Lab Development Team
- **Design Team**: UX/UI Design Team

## 📚 References

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation Guide](https://reactnavigation.org/)
- [Supabase Docs](https://supabase.com/docs)

---

**Version**: 1.0.0  
**Last Updated**: January 2025  
**Status**: Active Development
