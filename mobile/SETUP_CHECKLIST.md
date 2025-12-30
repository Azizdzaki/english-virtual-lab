# ✅ Database & Login Setup - Complete Checklist

## 🎯 Tujuan

✅ Aplikasi mobile bisa login dengan Supabase  
✅ Database terhubung dan bisa fetch data  
✅ Demo account siap untuk testing  

---

## 📋 Step-by-Step Checklist

### PHASE 1: Environment Setup ✅ (DONE)

- [x] Expo installed & running
- [x] .env.local file created
- [x] EXPO_PUBLIC_SUPABASE_URL set
- [x] EXPO_PUBLIC_SUPABASE_ANON_KEY set
- [x] Metro Bundler running
- [x] App opens di iPhone/Emulator

**Status:** ✅ COMPLETE

---

### PHASE 2: Supabase Project Setup 🔲 (TO DO)

**Follow these steps:**

#### Step 1: Verify Supabase Project
- [ ] Login ke https://supabase.com/dashboard
- [ ] Select "english-virtual-lab" project
- [ ] Go to Settings → API
- [ ] Copy Project URL: `https://xpisakzvqushpbdqjamm.supabase.co`
- [ ] Copy Anon Key: `eyJhbGciOi...` (copy full key)
- [ ] Verify credentials match .env.local

#### Step 2: Configure Authentication
- [ ] Go to Settings → Authentication → Providers → Email
- [ ] Toggle **"Confirm email"** → OFF (for development)
- [ ] Toggle **"Enable email signup"** → ON
- [ ] Save changes

#### Step 3: Create Database Tables
- [ ] Go to SQL Editor
- [ ] Copy entire SQL migration from LOGIN_GUIDE.md
- [ ] Paste into SQL Editor
- [ ] Click "Run" button
- [ ] Wait for "SQL executed successfully"
- [ ] Check for any errors

**Verify tables created:**
- [ ] courses table
- [ ] modules table
- [ ] articles table
- [ ] videos table
- [ ] quizzes table
- [ ] quiz_questions table
- [ ] users table (public)
- [ ] user_progress table
- [ ] quiz_attempts table

#### Step 4: Configure RLS Policies
- [ ] Go to Authentication → Policies
- [ ] Check "Enable RLS" for each table
- [ ] Verify policies for:
  - [x] courses (SELECT for authenticated)
  - [x] articles (SELECT for authenticated)
  - [x] videos (SELECT for authenticated)
  - [x] quizzes (SELECT for authenticated)
  - [x] users (SELECT own profile)
  - [x] user_progress (SELECT/UPDATE own)
  - [x] quiz_attempts (SELECT/INSERT own)

---

### PHASE 3: Demo Account Setup 🔲 (TO DO)

**Choose ONE method:**

#### Method A: Manual Setup (via Dashboard)

- [ ] Go to Authentication → Users
- [ ] Click "Create User" button
- [ ] Fill form:
  - Email: `demo@englishvirtuallab.com`
  - Password: `Demo12345!`
- [ ] Click "Create User"
- [ ] Repeat for 2nd account:
  - Email: `student@englishvirtuallab.com`
  - Password: `Student12345!`

#### Method B: Automated Setup (via SQL)

- [ ] Go to SQL Editor
- [ ] Run this SQL (from LOGIN_GUIDE.md):

```sql
-- Create demo user in auth
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_user_meta_data, is_super_admin, raw_app_meta_data
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000001',
  'authenticated', 'authenticated',
  'demo@englishvirtuallab.com',
  crypt('Demo12345!', gen_salt('bf')),
  NOW(), NOW(), NOW(),
  '{"full_name": "Demo User"}', false,
  '{"provider": "email", "providers": ["email"]}'
);

-- Create profile
INSERT INTO public.users (id, email, full_name) VALUES
('00000000-0000-0000-0000-000000000001', 'demo@englishvirtuallab.com', 'Demo User');
```

- [ ] Click "Run"
- [ ] Wait for success

**Verify users created:**
- [ ] Go to Authentication → Users
- [ ] Should see both demo accounts
- [ ] Check "email_confirmed_at" column filled

---

### PHASE 4: Test Sample Data 🔲 (TO DO)

**Verify data inserted:**

#### Check Courses
- [ ] Go to SQL Editor
- [ ] Run: `SELECT * FROM public.courses;`
- [ ] Should see 3 courses:
  - English Basics
  - Conversational English
  - Business English

#### Check Articles
- [ ] Run: `SELECT * FROM public.articles;`
- [ ] Should see 3 articles

#### Check Videos
- [ ] Run: `SELECT * FROM public.videos;`
- [ ] Should see 3 videos

#### Check Quizzes
- [ ] Run: `SELECT * FROM public.quizzes;`
- [ ] Should see 3 quizzes

---

### PHASE 5: Test Login & Connection 🔲 (TO DO)

#### Test 1: Connection Test
- [ ] Open app di iPhone/Emulator
- [ ] Should see Splash Screen
- [ ] Should see Auth Screen

#### Test 2: Login Test
- [ ] Input email: `demo@englishvirtuallab.com`
- [ ] Input password: `Demo12345!`
- [ ] Click "Login" button
- [ ] Should load Dashboard (no errors)

#### Test 3: Dashboard Data
- [ ] Check Dashboard visible
- [ ] Check greeting shows email
- [ ] Check courses visible
- [ ] Check statistics shown

#### Test 4: Navigation Test
- [ ] Swipe to Articles tab
- [ ] Check articles loading
- [ ] Swipe to Videos tab
- [ ] Check videos loading
- [ ] Swipe to Quiz tab
- [ ] Check quizzes loading
- [ ] Swipe to Profile tab
- [ ] Check profile shows email

#### Test 5: Logout Test
- [ ] Go to Profile tab
- [ ] Click "Logout" button
- [ ] Should return to Auth Screen

---

### PHASE 6: Database Connection Verification 🔲 (TO DO)

#### Method A: Check Console Logs
```
App running → Open dev menu (shake) → View logs
Should see:
✅ Supabase instance created
✅ Can get auth session
✅ Can query courses (3 courses found)
✅ Can query articles (3 articles found)
```

#### Method B: Use Debug Tools
- [ ] Add DebugSupabaseScreen to App.tsx
- [ ] Press "Test Connection" button
- [ ] Check all tests pass (✅)
- [ ] Press "Diagnosis" button
- [ ] Check output

#### Method C: Manual SQL Test
```sql
-- Test queries
SELECT COUNT(*) as total_courses FROM public.courses;
SELECT COUNT(*) as total_articles FROM public.articles;
SELECT COUNT(*) as total_users FROM public.users;
SELECT COUNT(*) as total_quizzes FROM public.quizzes;
```

All should return > 0

---

## 🎓 Demo Accounts Reference

**Account 1 (Recommended):**
```
Email:    demo@englishvirtuallab.com
Password: Demo12345!
Role:     Student (Testing)
```

**Account 2:**
```
Email:    student@englishvirtuallab.com
Password: Student12345!
Role:     Student (Testing)
```

**Note:** Can signup new accounts anytime!

---

## 🧪 Testing Order

1. **Environment** → App runs
2. **Supabase Setup** → Tables created
3. **Auth Setup** → Demo users created
4. **Connection Test** → Can query database
5. **Login Test** → Can login with demo
6. **Data Test** → Can see courses/articles/videos
7. **Navigation Test** → All tabs work
8. **Logout Test** → Can logout

---

## ⚠️ Common Issues & Quick Fixes

### Issue: "Invalid Login Credentials"
```
Fix:
1. Check email correct (case-sensitive)
2. Check password exact (case-sensitive)
3. Check user created in Supabase
4. Check email_confirmed_at filled
```

### Issue: "Cannot Connect"
```
Fix:
1. Check .env.local credentials
2. Check SUPABASE_URL correct
3. Check SUPABASE_KEY correct
4. Check internet connection
```

### Issue: "No Data Showing"
```
Fix:
1. Check tables exist (run SQL)
2. Check data inserted (count rows)
3. Check RLS policies enabled
4. Check user authenticated
```

### Issue: "Database Error"
```
Fix:
1. Check SQL migration ran successfully
2. Check for syntax errors in SQL
3. Check user has permission
4. Check database not full
```

---

## 📞 Support

**If you're stuck:**

1. Check TROUBLESHOOTING.md
2. Check LOGIN_GUIDE.md
3. Check console logs
4. Check Supabase dashboard
5. Verify all steps completed

---

## ✨ Success Indicators

When everything working correctly, you should see:

✅ App opens without errors  
✅ Auth screen displays  
✅ Can login with demo account  
✅ Dashboard shows greeting  
✅ Courses/articles/videos load  
✅ All tabs work  
✅ Can logout  
✅ Can login again  

---

## 📊 Progress Tracking

- [ ] Phase 1: Environment Setup (DONE)
- [ ] Phase 2: Supabase Setup (DO NOW)
- [ ] Phase 3: Demo Accounts (DO NOW)
- [ ] Phase 4: Sample Data (DO NOW)
- [ ] Phase 5: Login Testing (DO NOW)
- [ ] Phase 6: Connection Verification (DO NOW)

**Estimated time:** 30-45 minutes for all phases

---

**🚀 Ready to start? Begin with Phase 2!**

Follow each step carefully, and you'll have a fully functional app with login! 🎉
