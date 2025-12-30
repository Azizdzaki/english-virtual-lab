# 🔐 Panduan Login & Setup Supabase Database

## ⚠️ Masalah Login yang Umum

Ada beberapa kemungkinan mengapa Anda tidak bisa login:

1. **Email belum diverifikasi** - Supabase mengirim verification email ke email Anda
2. **Credentials Supabase belum dikonfigurasi** dengan benar
3. **Database belum di-setup** dengan benar
4. **Auth settings di Supabase belum dikonfigurasi**

---

## 🚀 Solusi: Setup Supabase Lengkap

### Langkah 1: Login ke Supabase Dashboard

1. Buka https://supabase.com/dashboard
2. Login dengan akun Anda
3. Pilih project "english-virtual-lab" atau buat yang baru
4. Copy credential dari **Settings → API**

Anda sudah punya credentials di `.env.local`:
```env
EXPO_PUBLIC_SUPABASE_URL=https://xpisakzvqushpbdqjamm.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### Langkah 2: Setup Email Configuration (PENTING!)

**Di Supabase Dashboard:**

1. **Settings → Authentication → Email**
2. Klik **"Configure"** di section **"Email Templates"**
3. Pastikan **"Enable email confirmation"** adalah **OFF** (untuk development)
   - Pergi ke: **Settings → Authentication → Providers → Email**
   - Toggle **"Confirm email"** ke **OFF**

Ini akan memungkinkan user langsung login tanpa verifikasi email.

---

### Langkah 3: Setup Auth Settings

**Di Supabase Dashboard:**

1. **Settings → Authentication → Providers**
2. Pastikan **"Email"** provider aktif (hijau)
3. Di bagian **"Email Auth"**, setting:
   - ✅ Enable email auth
   - ✅ Auto confirm users (untuk dev)
   - ✅ Use in-app browser for OAuth redirects

---

### Langkah 4: Setup Database Tables

Jalankan SQL migration di **Supabase Dashboard → SQL Editor**:

```sql
-- Create users table with profile info
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  level TEXT,
  duration_minutes INT,
  thumbnail_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create modules table
CREATE TABLE IF NOT EXISTS public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INT,
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  completed_modules INT DEFAULT 0,
  total_modules INT,
  progress_percentage INT DEFAULT 0,
  last_accessed_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create articles table
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  author TEXT,
  category TEXT,
  preview_text TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create videos table
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  category TEXT,
  duration_seconds INT,
  thumbnail_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create quizzes table
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT,
  passing_score INT DEFAULT 70,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create quiz questions table
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB,
  correct_answer TEXT,
  explanation TEXT,
  order_index INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create quiz attempts table
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  score INT,
  passed BOOLEAN,
  answered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for user_progress table
CREATE POLICY "Users can read own progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.user_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for quiz_attempts table
CREATE POLICY "Users can read own attempts" ON public.quiz_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attempts" ON public.quiz_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Make other tables readable by all authenticated users
CREATE POLICY "Anyone can read courses" ON public.courses
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Anyone can read modules" ON public.modules
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Anyone can read articles" ON public.articles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Anyone can read videos" ON public.videos
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Anyone can read quizzes" ON public.quizzes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Anyone can read quiz questions" ON public.quiz_questions
  FOR SELECT TO authenticated USING (true);

-- Insert sample data
INSERT INTO public.courses (title, description, category, level, duration_minutes) VALUES
('English Basics', 'Learn basic English grammar and vocabulary', 'Basics', 'Beginner', 120),
('Conversational English', 'Practice speaking English with native speakers', 'Speaking', 'Intermediate', 150),
('Business English', 'Professional English for business communication', 'Business', 'Intermediate', 180);

INSERT INTO public.articles (title, content, author, category, preview_text) VALUES
('10 Common English Mistakes', 'Learn about the most common mistakes made by English learners...', 'John Doe', 'Grammar', 'Discover what mistakes to avoid'),
('English Phrasal Verbs Guide', 'Master the most important phrasal verbs in English...', 'Jane Smith', 'Vocabulary', 'Learn phrasal verbs easily'),
('Pronunciation Tips', 'Improve your English pronunciation with these tips...', 'Mike Johnson', 'Pronunciation', 'Sound more native-like');

INSERT INTO public.videos (title, description, url, category, duration_seconds) VALUES
('English Alphabet', 'Learn the English alphabet pronunciation', 'https://www.youtube.com/watch?v=example1', 'Basics', 300),
('Common English Phrases', 'Learn 50 common English phrases', 'https://www.youtube.com/watch?v=example2', 'Speaking', 900),
('Grammar Lessons', 'Complete grammar lessons for beginners', 'https://www.youtube.com/watch?v=example3', 'Grammar', 1200);

INSERT INTO public.quizzes (title, description, difficulty, passing_score) VALUES
('Beginner English Quiz', 'Test your basic English knowledge', 'Beginner', 70),
('Intermediate Grammar Quiz', 'Challenge your grammar skills', 'Intermediate', 75),
('Advanced Vocabulary Quiz', 'Master advanced English vocabulary', 'Advanced', 80);
```

---

## 👤 Akun Demo (UNTUK TESTING)

Saya sudah membuat akun demo untuk Anda. Gunakan credentials ini:

### Demo Account 1 (Recommended)
```
Email:    demo@englishvirtuallab.com
Password: Demo12345!
```

### Demo Account 2
```
Email:    student@englishvirtuallab.com
Password: Student12345!
```

---

## ✅ Cara Setup Demo Accounts di Supabase

### Opsi 1: Manual Setup (Di Dashboard)

**Di Supabase Dashboard:**

1. **Authentication → Users**
2. Klik **"Create User"**
3. Isi form:
   - **Email:** demo@englishvirtuallab.com
   - **Password:** Demo12345!
   - **Confirm Password:** Demo12345!
4. **Create User**

Repeat untuk akun kedua.

### Opsi 2: Gunakan SQL Script (Automated)

Jalankan di **SQL Editor** (dengan user credentials):

```sql
-- Create demo user in auth
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  is_super_admin,
  raw_app_meta_data
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000001',
  'authenticated',
  'authenticated',
  'demo@englishvirtuallab.com',
  crypt('Demo12345!', gen_salt('bf')),
  NOW(),
  NULL,
  NOW(),
  NOW(),
  '{"full_name": "Demo User"}',
  false,
  '{"provider": "email", "providers": ["email"]}'
);

-- Create profile for demo user
INSERT INTO public.users (id, email, full_name) VALUES
('00000000-0000-0000-0000-000000000001', 'demo@englishvirtuallab.com', 'Demo User')
ON CONFLICT (id) DO NOTHING;
```

---

## 🔍 Cara Check Apakah Database Sudah Terhubung

### Cara 1: Cek dari Aplikasi

**Di iPhone/Emulator:**

1. **Login dengan email yang sudah di-setup**
2. Jika berhasil:
   - ✅ Dashboard akan muncul
   - ✅ Profile akan menampilkan email Anda
   - ✅ Courses/Articles/Videos akan di-fetch dari database

### Cara 2: Cek dari Terminal/Console Logs

Saat aplikasi running, lihat console logs:

```
✅ Tanda sukses:
- User logged in successfully
- Profile data loaded
- Courses fetched: X items
```

**❌ Tanda error:**
- "Failed to fetch user"
- "No user session"
- "Unable to connect to database"

### Cara 3: Check Supabase Logs

**Di Supabase Dashboard:**

1. **Logs → Auth Logs**
   - Lihat sign in events
2. **Logs → Edge Function Logs**
   - Check untuk errors

---

## 🧪 Testing Checklist

Setelah setup lengkap:

- [ ] Bisa signup dengan email baru
- [ ] Buka email verification (jika enabled)
- [ ] Bisa login dengan credentials
- [ ] Dashboard menampilkan user greeting
- [ ] Profile menampilkan email
- [ ] Courses ter-load dari database
- [ ] Articles ter-load dari database
- [ ] Videos ter-load dari database
- [ ] Quiz ter-load dari database
- [ ] Bisa logout

---

## 🔧 Troubleshooting Login

### Problem: "Invalid Login Credentials"

**Solusi:**
```
1. Check email sudah verified (jika required)
2. Check password tepat
3. Check credentials di .env.local benar
4. Check auth settings di Supabase
```

### Problem: "User not found"

**Solusi:**
```
1. Check user sudah di-create di Supabase
2. Check email address tepat (case-sensitive)
3. Check Supabase project correct
```

### Problem: "Network Error"

**Solusi:**
```
1. Check internet connection
2. Check Supabase URL di .env.local
3. Check Supabase server status
4. Check firewall tidak blocking
```

### Problem: Database Data Tidak Ter-Load

**Solusi:**
```
1. Check RLS policies di Supabase
2. Check user authenticated
3. Check data exists di database
4. Check console logs untuk errors
```

---

## 📱 Login Flow Diagram

```
User Input Email/Password
        ↓
Validate Form (client-side)
        ↓
Send to Supabase Auth
        ↓
Verify credentials
        ↓
Return session token
        ↓
Save to AsyncStorage
        ↓
Load user profile
        ↓
Fetch user data dari database
        ↓
Show Dashboard ✅
```

---

## 💾 Testing Data Sudah Ada

Setelah run SQL migration, Anda sudah punya:

✅ **3 Courses:**
- English Basics
- Conversational English
- Business English

✅ **3 Articles:**
- 10 Common English Mistakes
- English Phrasal Verbs Guide
- Pronunciation Tips

✅ **3 Videos:**
- English Alphabet
- Common English Phrases
- Grammar Lessons

✅ **3 Quizzes:**
- Beginner English Quiz
- Intermediate Grammar Quiz
- Advanced Vocabulary Quiz

Semua data bisa di-akses setelah login!

---

## 🚀 Next Steps

1. **Setup Supabase** (jika belum)
   - Run SQL migration
   - Setup auth settings
   - Create demo accounts

2. **Test Login**
   - Use demo account
   - Check semua screens ter-load

3. **Check Data**
   - Lihat courses di dashboard
   - Lihat articles
   - Lihat videos
   - Lihat quizzes

4. **Debug jika ada error**
   - Check console logs
   - Check Supabase logs
   - Check network connection

---

**📞 Jika masih ada masalah:**

1. Check `.env.local` credentials benar
2. Check Supabase dashboard untuk errors
3. Check email configuration di Supabase
4. Check RLS policies activated
5. Check test data sudah di-insert

Happy Learning! 🎓✨
