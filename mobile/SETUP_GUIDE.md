# Setup Guide - English Virtual Lab Mobile

## 🎯 Prerequisites

Sebelum memulai, pastikan Anda sudah memiliki:

### Required Software
- **Node.js** >= 16.0 (Download dari https://nodejs.org/)
- **npm** >= 8.0 atau **yarn** >= 1.22
- **Git** untuk version control
- **Expo CLI** untuk development

### For Android
- **Android Studio** dengan emulator, atau
- **Physical Android device** dengan USB debugging enabled

### For iOS (Mac only)
- **Xcode** >= 14.0
- **CocoaPods**
- **Physical iPhone/iPad** atau iOS simulator

## 📦 Installation Steps

### 1. Clone Repository
```bash
git clone https://github.com/Azizdzaki/english-virtual-lab.git
cd english-virtual-lab/mobile
```

### 2. Install Dependencies
```bash
npm install
# atau
yarn install
```

### 3. Install Expo CLI (Global)
```bash
npm install -g expo-cli
# atau
yarn global add expo-cli
```

### 4. Setup Environment Variables
```bash
# Copy environment template
cp .env.example .env.local

# Edit dengan text editor
# Masukkan Supabase credentials Anda
```

### Sample .env.local
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
EXPO_PUBLIC_APP_VERSION=1.0.0
EXPO_PUBLIC_APP_NAME=English Virtual Lab
EXPO_PUBLIC_APP_ENV=development
```

## 🚀 Running the App

### Development Mode (Expo Go)
```bash
npm start
# atau
expo start
```

Output akan menunjukkan QR code. Scan dengan Expo Go app di device Anda.

### Android Emulator
```bash
npm run android
# atau
expo start --android
```

### iOS Simulator (Mac only)
```bash
npm run ios
# atau
expo start --ios
```

### Web Preview
```bash
npm run web
# atau
expo start --web
```

## 🔧 Configuration Files

### app.json
Konfigurasi Expo dan app metadata:
```json
{
  "expo": {
    "name": "English Virtual Lab",
    "slug": "english-virtual-lab",
    "version": "1.0.0",
    ...
  }
}
```

### tsconfig.json
TypeScript configuration:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "jsx": "react-native",
    ...
  }
}
```

### babel.config.js
Babel preset untuk Expo dan NativeWind:
```javascript
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    'nativewind/babel',
    'react-native-reanimated/plugin',
  ],
};
```

## 🔌 Supabase Setup

### 1. Create Supabase Project
- Kunjungi https://supabase.com
- Click "New Project"
- Fill in project details
- Copy Project URL dan Anon Key

### 2. Create Tables
Run SQL migrations di Supabase:

```sql
-- Users table (automatically created by Supabase Auth)

-- Courses table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  description TEXT,
  category VARCHAR,
  thumbnail_url VARCHAR,
  difficulty_level VARCHAR CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  duration_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Modules table
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  content TEXT,
  order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Articles table
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  content TEXT,
  author VARCHAR,
  category VARCHAR,
  thumbnail_url VARCHAR,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Videos table
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  description TEXT,
  video_url VARCHAR NOT NULL,
  thumbnail_url VARCHAR,
  duration_seconds INTEGER,
  category VARCHAR,
  published_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quizzes table
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  title VARCHAR NOT NULL,
  description TEXT,
  total_questions INTEGER,
  passing_score INTEGER DEFAULT 60,
  duration_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Questions table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type VARCHAR CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer')),
  options JSONB,
  correct_answer VARCHAR,
  explanation TEXT,
  order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz Attempts table
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  score INTEGER,
  total_questions INTEGER,
  passed BOOLEAN,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Progress table
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  progress_percentage INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  last_accessed TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_modules_course_id ON modules(course_id);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_videos_category ON videos(category);
CREATE INDEX idx_quizzes_course_id ON quizzes(course_id);
CREATE INDEX idx_questions_quiz_id ON questions(quiz_id);
CREATE INDEX idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
```

## 🧪 Testing

### Run Unit Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Run Linter
```bash
npm run lint
```

## 📱 Device Testing

### Android Physical Device
1. Enable USB debugging on device
2. Connect via USB
3. Run `npm run android`

### iOS Physical Device
1. Open project in Xcode
2. Select your device
3. Run build

## 🏗️ Build for Production

### Android APK
```bash
eas build --platform android
# atau local
eas build --platform android --local
```

### iOS
```bash
eas build --platform ios
```

## 📂 Project Structure

```
mobile/
├── src/
│   ├── screens/              # UI Screens
│   ├── components/           # Reusable components
│   ├── services/             # API & business logic
│   ├── contexts/             # Context providers
│   ├── hooks/                # Custom hooks
│   ├── navigation/           # Navigation config
│   ├── types/                # TypeScript types
│   ├── utils/                # Utilities
│   └── __tests__/            # Tests
├── assets/                   # Images, icons
├── App.tsx                   # Root component
├── app.json                  # Expo config
├── package.json              # Dependencies
└── babel.config.js           # Babel config
```

## 🆘 Troubleshooting

### Port 8081 already in use
```bash
# Kill process on port 8081
lsof -i :8081 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Metro bundler issues
```bash
# Clear cache
rm -rf node_modules/.cache
npm start -- --reset-cache
```

### Supabase connection error
- Verify .env.local credentials
- Check internet connection
- Ensure Supabase project is active

### Build errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## 📚 Useful Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Supabase Guide](https://supabase.com/docs)
- [React Navigation](https://reactnavigation.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## ✅ Verification Checklist

- [ ] Node.js dan npm terinstal
- [ ] Repository di-clone
- [ ] Dependencies terinstal
- [ ] .env.local sudah dikonfigurasi
- [ ] Supabase project setup selesai
- [ ] Expo Go terinstal di device
- [ ] App berjalan di emulator/device
- [ ] Semua tests passing

---

**Happy Coding! 🚀**
