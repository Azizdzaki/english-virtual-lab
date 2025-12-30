# 🔧 Troubleshooting Login & Database Connection

## 📋 Quick Checklist

Sebelum memulai, pastikan:

- [ ] Email sudah terverifikasi (atau verify disabled di Supabase)
- [ ] Password minimal 6 karakter
- [ ] `.env.local` sudah punya credentials Supabase
- [ ] Database tables sudah di-create (run SQL migration)
- [ ] RLS policies sudah enabled
- [ ] User sudah ter-create di Supabase Auth

---

## 🚨 Common Problems & Solutions

### ❌ Problem: "Invalid Login Credentials"

**Penyebab:**
- Email/password salah
- User belum di-create
- Email belum verified (jika required)

**Solusi:**

1. **Double-check credentials:**
   - Copy-paste email (hindari whitespace)
   - Pastikan password benar
   - Case-sensitive untuk email

2. **Check user di Supabase:**
   ```
   Dashboard → Authentication → Users
   → Cari email Anda
   → Pastikan email_confirmed_at terisi
   ```

3. **Disable email verification (development):**
   ```
   Dashboard → Settings → Authentication → Providers → Email
   → Toggle "Confirm email" OFF
   → Apply
   ```

4. **Recreate user:**
   - Delete user dari Supabase
   - Signup ulang
   - Check email confirmation

---

### ❌ Problem: "User Not Found"

**Penyebab:**
- User belum di-create di auth
- User id tidak cocok di users table

**Solusi:**

1. **Create user di Supabase:**
   ```
   Dashboard → Authentication → Users
   → Click "Create User"
   → Fill email & password
   → Save
   ```

2. **Check auth.users table:**
   ```
   Dashboard → SQL Editor
   → SELECT * FROM auth.users;
   → Pastikan user exist
   ```

3. **Create profile di users table:**
   ```sql
   INSERT INTO public.users (id, email, full_name)
   VALUES ('user-id-here', 'email@example.com', 'User Name');
   ```

---

### ❌ Problem: "No Session / Session Expired"

**Penyebab:**
- AsyncStorage tidak load session
- Token expired
- Network error

**Solusi:**

1. **Clear app data & cache:**
   ```
   iOS: Settings → General → iPhone Storage → App → Offload
   Android: Settings → Apps → App → Clear Cache
   ```

2. **Check AsyncStorage:**
   ```typescript
   // Add ini di development
   import AsyncStorage from '@react-native-async-storage/async-storage';
   const session = await AsyncStorage.getItem('sb-xpisakzvqushpbdqjamm-auth-token');
   console.log('Session:', session);
   ```

3. **Re-login:**
   - Logout
   - Login ulang
   - Check session saved

---

### ❌ Problem: "Network Error / Cannot Connect"

**Penyebab:**
- Internet connection off
- Supabase URL salah
- Firewall blocking
- Supabase server down

**Solusi:**

1. **Check internet:**
   ```
   Ping google.com
   Check WiFi/cellular
   ```

2. **Verify credentials di .env.local:**
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://xpisakzvqushpbdqjamm.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
   (Pastikan tidak ada typo)

3. **Check Supabase status:**
   ```
   https://status.supabase.com
   → Look for any incidents
   ```

4. **Test dengan Postman:**
   ```
   GET https://xpisakzvqushpbdqjamm.supabase.co/rest/v1/courses
   Headers:
   - apikey: ANON_KEY
   - Authorization: Bearer ANON_KEY
   ```

---

### ❌ Problem: "Database Queries Return Empty"

**Penyebab:**
- Tables belum di-create
- Data belum di-insert
- RLS policies blocking
- Query error

**Solusi:**

1. **Check tables exist:**
   ```sql
   -- Run di SQL Editor
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

2. **Check data exist:**
   ```sql
   SELECT COUNT(*) FROM public.courses;
   SELECT COUNT(*) FROM public.articles;
   SELECT COUNT(*) FROM public.videos;
   SELECT COUNT(*) FROM public.quizzes;
   ```

3. **Check RLS policies:**
   ```
   Dashboard → Authentication → Policies
   → Pastikan ada policy untuk table
   → Policy harus allow SELECT untuk authenticated users
   ```

4. **Disable RLS untuk testing:**
   ```sql
   ALTER TABLE public.courses DISABLE ROW LEVEL SECURITY;
   -- Test jika data muncul
   ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
   ```

---

### ❌ Problem: "Permission Denied / 403 Error"

**Penyebab:**
- RLS policies terlalu ketat
- User tidak authenticated
- Policy not allowing operation

**Solusi:**

1. **Check authenticated status:**
   ```typescript
   const { data: { session } } = await supabase.auth.getSession();
   console.log('Authenticated:', !!session?.user);
   ```

2. **Review RLS policies:**
   ```
   Dashboard → Authentication → Policies
   → Check "SELECT" policy
   → Should be: 'true' atau 'auth.role() = 'authenticated''
   ```

3. **Fix RLS policy:**
   ```sql
   -- Allow all authenticated users to read
   CREATE POLICY "Allow read for authenticated" ON public.courses
   FOR SELECT TO authenticated USING (true);
   ```

---

## 🧪 Testing dengan Debug Tools

### Use DebugSupabaseScreen

Add ini ke App.tsx untuk development:

```typescript
// App.tsx
import DebugSupabaseScreen from './src/screens/DebugSupabaseScreen';

// Di development, show debug screen
const isDevelopment = process.env.EXPO_PUBLIC_APP_ENV === 'development';

if (isDevelopment) {
  return <DebugSupabaseScreen />;
}
```

### Or run tests dari component:

```typescript
import { testSupabaseConnection, diagnosisSupabase, testLogin } from './src/utils/supabaseTest';

// Di useEffect atau button press:
useEffect(() => {
  testSupabaseConnection();
  diagnosisSupabase();
  testLogin('demo@englishvirtuallab.com', 'Demo12345!');
}, []);

// Lihat logs di console
```

---

## 🔍 Manual Testing Steps

### Step 1: Verify Supabase Project

```
1. Login ke https://supabase.com/dashboard
2. Select project "english-virtual-lab"
3. Go to Settings → API
4. Copy Project URL & Anon Key
5. Compare dengan .env.local
6. Should match exactly (dengan prefix https://)
```

### Step 2: Run Database Migration

```
1. Go to SQL Editor
2. Copy semua SQL dari LOGIN_GUIDE.md
3. Paste ke SQL editor
4. Click "Run"
5. Wait untuk completion
6. Check untuk errors
```

### Step 3: Create Demo User

```
Method A (Manual):
1. Go to Authentication → Users
2. Click "Create User"
3. Email: demo@englishvirtuallab.com
4. Password: Demo12345!
5. Click "Create User"

Method B (SQL):
Run SQL dari LOGIN_GUIDE.md untuk create users
```

### Step 4: Test Login dari App

```
1. Open app di iPhone/Emulator
2. Go ke Auth Screen
3. Input: demo@englishvirtuallab.com
4. Input: Demo12345!
5. Click "Login"
6. Check Console logs
7. Should see Dashboard
```

### Step 5: Verify Data Load

```
1. Cek Dashboard → should show courses
2. Cek Articles → should show articles
3. Cek Videos → should show videos
4. Cek Quiz → should show quizzes
5. If empty → check RLS policies
```

---

## 📱 Console Logs untuk Debugging

Saat development, lihat logs ini:

**✅ Success logs:**
```
✅ Test 1: Supabase instance created
✅ Test 2: Can get auth session
✅ Test 3: Can query courses (3 courses found)
✅ Test 4: Can query articles (3 articles found)
...
User logged in successfully
Profile data loaded
Dashboard data ready
```

**❌ Error logs:**
```
❌ Test 3 FAILED: Query courses failed - relation "public.courses" does not exist
❌ Test 4 FAILED: Query articles failed - permission denied for schema public
Error: Invalid login credentials
Failed to fetch user
Unable to connect to database
```

---

## 🚀 Quick Fix Checklist

Jika semuanya tidak jalan:

1. **Clear app cache:**
   ```
   rm -rf ~/Library/Developer/Xcode/DerivedData (Mac)
   Delete %APPDATA%\Android\Sdk\emulator (Windows)
   ```

2. **Restart Metro Bundler:**
   ```
   Ctrl+C di terminal
   npm start --clear
   ```

3. **Reinstall dependencies:**
   ```
   rm -rf node_modules
   npm install
   ```

4. **Check .env.local:**
   ```
   - File exists
   - EXPO_PUBLIC_SUPABASE_URL set
   - EXPO_PUBLIC_SUPABASE_ANON_KEY set
   - No extra spaces/tabs
   ```

5. **Verify Supabase database:**
   ```
   - Tables created
   - Data inserted
   - RLS policies set
   - Auth providers configured
   ```

---

## 📞 Still Not Working?

Check di order ini:

1. **Console logs** - Lihat error message
2. **Supabase dashboard logs** - Check server-side errors
3. **Network monitor** - Check request/response
4. **Email configuration** - Check auth settings
5. **RLS policies** - Check permissions
6. **Database schema** - Check tables exist
7. **Test credentials** - Use demo@englishvirtuallab.com
8. **Browser console** - Check CORS errors
9. **Network firewall** - Check blocking
10. **Ask for support** - Share error logs

---

## 📚 Resources

- **Supabase Docs:** https://supabase.com/docs/guides/auth
- **Supabase Status:** https://status.supabase.com
- **React Native Docs:** https://reactnative.dev/docs
- **Expo Docs:** https://docs.expo.dev/

---

**Remember:** Most login issues are related to:
1. Email not verified
2. RLS policies too strict
3. Database not setup
4. Wrong credentials

**Start debugging dari sini!** 🚀
