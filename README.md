# English Virtual Lab

[![React Native](https://img.shields.io/badge/React%20Native-0.76-61DAFB?logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~54.0-000020?logo=expo)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase)](https://supabase.com/)


## 🎯 Tentang Proyek

**English Virtual Lab** adalah aplikasi pembelajaran bahasa Inggris berbasis web dan mobile yang dirancang dengan pendekatan **User-Centered Design (UCD)** dan **Systems Thinking**. Aplikasi ini menyediakan platform interaktif untuk meningkatkan kemampuan bahasa Inggris melalui berbagai metode pembelajaran.

## ✨ Fitur Utama

### 🔐 Authentication & User Management
- Register dengan validasi email
- Login dengan session persistence
- Password reset flow
- Auto-login pada app start
- Profile management

### 📚 Learning Features
- **Courses**: Kursus terstruktur dengan modul bertahap
- **Articles**: Artikel pembelajaran dengan kategori
- **Videos**: Video pembelajaran eksternal
- **Quizzes**: Assessment interaktif dengan instant feedback
- **Progress Tracking**: Visualisasi progress real-time

### 📊 Dashboard & Analytics
- User statistics (average score, quizzes taken, pass rate)
- Learning progress visualization
- Course recommendations
- Achievement tracking

### 🎨 UI/UX Features
- Mobile-responsive design
- Bottom tab navigation
- Pull-to-refresh
- Loading states & error handling
- Accessible design (WCAG AA compliant)



## 🛠 Tech Stack

### Frontend
- **React Native** `0.76.0` - Framework mobile
- **Expo** `~54.0.0` - Development platform
- **TypeScript** `~5.9.2` - Type safety
- **React Navigation** `^6.x` - Navigation library

### Backend & Services
**Supabase** `^2.84.0` - Backend as a Service
  - Authentication
  - PostgreSQL Database
  - Real-time subscriptions
  - Storage

### State Management & Utils
- **React Context API** - Global state management
- **AsyncStorage** - Local data persistence
- **Custom Hooks** - Reusable logic

### Development Tools
- **ESLint** `^8.50.0` - Code linting
- **TypeScript ESLint** - Type-safe linting
- **Babel** - JavaScript compiler


## 🚀 Instalasi & Setup

### Prasyarat

Pastikan Anda sudah menginstal:
- **Node.js** (v18 atau lebih tinggi)
- **npm** atau **yarn**
- **Expo CLI** (opsional)
- **Android Studio** (untuk Android) atau **Xcode** (untuk iOS)

### Langkah Instalasi

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd english-virtual-lab/mobile
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` dan isi dengan credentials Supabase Anda:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Setup Supabase Database**
   
   Jalankan SQL migrations berikut di Supabase SQL Editor:

   ```sql
   -- Create users table with trigger
   CREATE OR REPLACE FUNCTION public.handle_new_user()
   RETURNS TRIGGER AS $$
   BEGIN
     INSERT INTO public.users (
       auth_id, email, full_name, learning_level,
       total_quizzes_taken, total_quizzes_passed,
       total_score, average_score, is_active
     )
     VALUES (
       NEW.id,
       NEW.email,
       COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
       'beginner', 0, 0, 0, 0, true
     );
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW
     EXECUTE FUNCTION public.handle_new_user();
   ```



## 🏃 Menjalankan Aplikasi

### Development Mode

```bash
# Start Expo development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web
```

### Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Linting

```bash
# Check code quality
npm run lint

# Auto-fix linting issues
npm run lint -- --fix
```





## 📁 Struktur Proyek

```
mobile/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Loading.tsx
│   │   ├── Error.tsx
│   │   ├── ProgressBar.tsx
│   │   └── index.ts
│   │
│   ├── contexts/            # React Context providers
│   │   └── AuthContext.tsx
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuthContext.ts
│   │   ├── useAsync.ts
│   │   ├── useForm.ts
│   │   └── index.ts
│   │
│   ├── navigation/          # Navigation setup
│   │   ├── RootNavigator.tsx
│   │   └── index.ts
│   │
│   ├── screens/             # Application screens
│   │   ├── AuthScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── ArticlesScreen.tsx
│   │   ├── VideosScreen.tsx
│   │   ├── QuizScreen.tsx
│   │   ├── QuizDetailScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── SplashScreen.tsx
│   │   └── index.ts
│   │
│   ├── services/            # API & business logic
│   │   ├── supabaseClient.ts
│   │   ├── authService.ts
│   │   ├── courseService.ts
│   │   ├── articleService.ts
│   │   ├── videoService.ts
│   │   ├── quizService.ts
│   │   └── index.ts
│   │
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   │
│   └── utils/               # Utility functions
│       ├── formatting.ts
│       └── index.ts
│
├── assets/                  # Static assets
├── .expo/                   # Expo configuration
├── App.tsx                  # Root component
├── app.json                 # Expo app configuration
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript configuration
├── babel.config.js          # Babel configuration
├── jest.config.js           # Jest testing configuration
├── .env                     # Environment variables (gitignored)
├── .env.example             # Environment template
│
└── Documentation/
    ├── README.md            # This file
    ├── SETUP_GUIDE.md       # Setup instructions
    ├── ARCHITECTURE.md      # System architecture & UML
    ├── DESIGN_THINKING_UCD.md    # Design documentation
    ├── SYSTEMS_THINKING.md       # Systems analysis
    ├── IMPLEMENTATION_GUIDE.md   # Implementation details
    ├── TESTING_REPORT.md         # Test results
    └── DEPLOYMENT.md             # Deployment guide
```



## 🚀 Deployment

### Build for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios

# Build for both
eas build --platform all
```

### Environment Setup

```bash
# Production environment
cp .env.example .env.production

# Edit production variables
EXPO_PUBLIC_SUPABASE_URL=your_production_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_production_key
```