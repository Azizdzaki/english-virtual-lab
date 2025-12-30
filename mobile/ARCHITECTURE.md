# UML & Architecture Documentation

## 1. Use Case Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        System Boundary                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────┐         ┌──────────────────────────────────┐  │
│  │  User    │────────▶│  Authenticate (Login/Register)  │  │
│  └──────────┘         └──────────────────────────────────┘  │
│       │                                                       │
│       ├──────────────┐                                        │
│       │              │                                        │
│  ┌────▼────┐  ┌──────▼──────────────────────────────────┐   │
│  │ Browse  │  │  Browse & Manage Courses               │   │
│  │ Articles├──┤  - View course list                     │   │
│  └─────────┘  │  - View course details                 │   │
│       │       │  - Track progress                      │   │
│       │       │  - View modules                        │   │
│       │       └──────────────────────────────────────────┘   │
│       │                                                       │
│       ├──────────────────────────┐                           │
│       │                          │                           │
│  ┌────▼──────────┐  ┌───────────▼──────────────────────┐    │
│  │ Watch Videos  │  │  Take Quizzes & Assessments     │    │
│  │ - Stream      │  │  - View quiz list                │    │
│  │ - Search      │  │  - Take quiz                     │    │
│  └───────────────┘  │  - View results                  │    │
│       │             │  - Track attempts                │    │
│       │             └───────────────────────────────────┘    │
│       │                                                       │
│       └──────────────┬──────────────────────────────────┐    │
│                      │                                  │    │
│          ┌───────────▼───────────────────────────────┐ │    │
│          │ Manage Profile                            │ │    │
│          │ - View profile                            │ │    │
│          │ - Edit profile information                │ │    │
│          │ - View learning statistics                │ │    │
│          │ - Logout                                  │ │    │
│          └───────────────────────────────────────────┘ │    │
│                                                          │    │
│          ┌──────────────────────────────────────────┐   │    │
│          │ View Progress & Statistics               │   │    │
│          │ - Overall progress                       │   │    │
│          │ - Courses completed                      │   │    │
│          │ - Quiz scores                            │   │    │
│          └──────────────────────────────────────────┘   │    │
│                                                          │    │
└──────────────────────────────────────────────────────────────┘
```

## 2. Sequence Diagram - User Login Flow

```
User          App          AuthService       Supabase        AsyncStorage
 │             │                │               │                │
 ├─login───────▶│                │               │                │
 │             │                │               │                │
 │             ├──signIn────────▶│               │                │
 │             │                │               │                │
 │             │                ├──verify───────▶│                │
 │             │                │               │                │
 │             │                │◀──token───────┤                │
 │             │                │               │                │
 │             │                ├──save token──────────────────▶ │
 │             │                │               │                │
 │             │◀──response──────┤               │                │
 │             │                │               │                │
 │◀──success───┤                │               │                │
 │             │                │               │                │
 └─navigate────▶│                │               │                │
       to
    Dashboard
```

## 3. Activity Diagram - Course Learning Flow

```
                            ┌─────────────┐
                            │   Start     │
                            └──────┬──────┘
                                   │
                        ┌──────────▼──────────┐
                        │ Browse Course List  │
                        └──────────┬──────────┘
                                   │
                        ┌──────────▼──────────────┐
                        │ Select Course          │
                        └──────────┬──────────────┘
                                   │
                        ┌──────────▼──────────────────┐
                        │ View Course Details        │
                        │ - Title                    │
                        │ - Description              │
                        │ - Modules                  │
                        └──────────┬──────────────────┘
                                   │
                        ┌──────────▼──────────────────┐
                        │ Start Learning Module      │
                        └──────────┬──────────────────┘
                                   │
                    ┌──────────────▼──────────────────┐
                    │ Read Module Content            │
                    │ Track Progress                 │
                    └──────────────┬──────────────────┘
                                   │
                    ┌──────────────▼──────────────────┐
                    │ More Modules?                  │
                    └──┬──────────────────────┬───────┘
                       │ Yes                 │ No
        ┌──────────────▼──┐        ┌────────▼──────────────┐
        │ Next Module     │        │ Complete Course       │
        └────────┬────────┘        └──────────┬────────────┘
                 │                            │
                 └────────────┬───────────────┘
                              │
                   ┌──────────▼──────────────┐
                   │ Take Quiz (Optional)   │
                   └──────────┬──────────────┘
                              │
                   ┌──────────▼──────────────┐
                   │ View Results           │
                   └──────────┬──────────────┘
                              │
                   ┌──────────▼──────────────┐
                   │ Update Progress        │
                   └──────────┬──────────────┘
                              │
                   ┌──────────▼──────────────┐
                   │       End              │
                   └───────────────────────┘
```

## 4. Class Diagram (Core Components)

```
┌──────────────────────────────┐
│         AuthService          │
├──────────────────────────────┤
│ - signUp()                   │
│ - signIn()                   │
│ - signOut()                  │
│ - resetPassword()            │
│ - getCurrentUser()           │
└──────────────────────────────┘

┌──────────────────────────────┐
│      CourseService           │
├──────────────────────────────┤
│ - getCourses()               │
│ - getCourseById()            │
│ - getModules()               │
│ - updateProgress()           │
└──────────────────────────────┘

┌──────────────────────────────┐
│      ArticleService          │
├──────────────────────────────┤
│ - getArticles()              │
│ - getArticleById()           │
│ - getArticlesByCategory()    │
│ - searchArticles()           │
└──────────────────────────────┘

┌──────────────────────────────┐
│      VideoService            │
├──────────────────────────────┤
│ - getVideos()                │
│ - getVideoById()             │
│ - getVideosByCategory()      │
│ - searchVideos()             │
└──────────────────────────────┘

┌──────────────────────────────┐
│      QuizService             │
├──────────────────────────────┤
│ - getQuizzes()               │
│ - getQuizById()              │
│ - getQuizQuestions()         │
│ - submitQuizAttempt()        │
│ - getUserQuizAttempts()      │
└──────────────────────────────┘
```

## 5. Entity Relationship Diagram (ERD)

```
┌─────────────────┐
│     users       │
├─────────────────┤
│ id (PK)         │
│ email           │
│ full_name       │
│ avatar_url      │
│ created_at      │
│ updated_at      │
└────────┬────────┘
         │
         │ 1:N
         │
    ┌────▼──────────────┐
    │  user_progress    │
    ├───────────────────┤
    │ id (PK)           │
    │ user_id (FK)      │
    │ course_id (FK)    │
    │ module_id (FK)    │
    │ progress_percent  │
    │ is_completed      │
    │ last_accessed     │
    │ created_at        │
    │ updated_at        │
    └───────────────────┘

┌─────────────────┐
│     courses     │
├─────────────────┤
│ id (PK)         │
│ title           │
│ description     │
│ category        │
│ thumbnail_url   │
│ difficulty_lvl  │
│ duration_mins   │
│ created_at      │
└────────┬────────┘
         │
         │ 1:N
         │
     ┌───▼───────┐
     │  modules  │
     ├───────────┤
     │ id (PK)   │
     │ course_id │
     │ title     │
     │ content   │
     │ order     │
     └───────────┘

┌─────────────────┐
│    quizzes      │
├─────────────────┤
│ id (PK)         │
│ title           │
│ description     │
│ total_ques      │
│ passing_score   │
│ duration_mins   │
│ created_at      │
└────────┬────────┘
         │
         │ 1:N
         │
┌────────▼──────────────┐
│     questions         │
├───────────────────────┤
│ id (PK)               │
│ quiz_id (FK)          │
│ question_text         │
│ question_type         │
│ options               │
│ correct_answer        │
│ explanation           │
│ order                 │
└───────────────────────┘

┌──────────────────────┐
│  quiz_attempts       │
├──────────────────────┤
│ id (PK)              │
│ user_id (FK)         │
│ quiz_id (FK)         │
│ score                │
│ total_questions      │
│ passed               │
│ started_at           │
│ completed_at         │
└──────────────────────┘

┌─────────────────┐
│    articles     │
├─────────────────┤
│ id (PK)         │
│ title           │
│ content         │
│ author          │
│ category        │
│ thumbnail_url   │
│ published_at    │
│ updated_at      │
└─────────────────┘

┌─────────────────┐
│     videos      │
├─────────────────┤
│ id (PK)         │
│ title           │
│ description     │
│ video_url       │
│ thumbnail_url   │
│ duration_secs   │
│ category        │
│ published_at    │
└─────────────────┘
```

## 6. System Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                        Mobile Application                           │
│  (React Native / Expo - Android & iOS)                             │
└─────────────────────────────────────┬──────────────────────────────┘
                                      │
                     ┌────────────────▼─────────────────┐
                     │   React Navigation Layer         │
                     │ - Stack Navigator                │
                     │ - Bottom Tab Navigator           │
                     │ - Drawer Navigator (optional)    │
                     └────────────────┬─────────────────┘
                                      │
                     ┌────────────────▼─────────────────┐
                     │   Service Layer                  │
                     │ - AuthService                    │
                     │ - CourseService                  │
                     │ - ArticleService                 │
                     │ - VideoService                   │
                     │ - QuizService                    │
                     └────────────────┬─────────────────┘
                                      │
                     ┌────────────────▼─────────────────┐
                     │   Context & State Management     │
                     │ - AuthContext                    │
                     │ - useAsync Hook                  │
                     │ - useForm Hook                   │
                     └────────────────┬─────────────────┘
                                      │
                     ┌────────────────▼─────────────────┐
                     │   Supabase Client                │
                     │ (REST API / Real-time)           │
                     └────────────────┬─────────────────┘
                                      │
        ┌─────────────────────────────▼─────────────────────────────┐
        │                   Backend Services                         │
        ├─────────────────────────────────────────────────────────────┤
        │                                                              │
        │  ┌──────────────────┐      ┌──────────────────┐           │
        │  │  Supabase Auth   │      │  PostgreSQL DB   │           │
        │  │  - User Auth     │      │  - Tables        │           │
        │  │  - Sessions      │      │  - Relationships │           │
        │  │  - Tokens        │      │  - Indexes       │           │
        │  └──────────────────┘      └──────────────────┘           │
        │                                                              │
        │  ┌──────────────────┐      ┌──────────────────┐           │
        │  │ Storage (S3)     │      │  Extensions      │           │
        │  │ - User avatars   │      │  - UUID          │           │
        │  │ - Thumbnails     │      │  - Timescaledb   │           │
        │  │ - Documents      │      │  - pgvector      │           │
        │  └──────────────────┘      └──────────────────┘           │
        │                                                              │
        └─────────────────────────────────────────────────────────────┘
                                      │
        ┌─────────────────────────────▼─────────────────────────────┐
        │              External Services                             │
        ├─────────────────────────────────────────────────────────────┤
        │  - YouTube (Video Integration)                             │
        │  - Email Service (Password Reset)                          │
        │  - Analytics Service                                       │
        └─────────────────────────────────────────────────────────────┘
```

## 7. Data Flow Diagram

```
┌─────────┐
│  User   │
└────┬────┘
     │
     │ Input (Email, Password, etc)
     │
     ▼
┌──────────────────┐
│  User Interface  │
│  - Input Fields  │
│  - Buttons       │
└────┬─────────────┘
     │
     │ Form Data
     │
     ▼
┌─────────────────┐
│  Validation     │
│  - Email check  │
│  - Password val │
└────┬────────────┘
     │
     │ Validated Data
     │
     ▼
┌──────────────────┐
│  Service Layer   │
│  (AuthService)   │
└────┬─────────────┘
     │
     │ API Request
     │
     ▼
┌──────────────────┐
│  Supabase        │
│  REST API        │
└────┬─────────────┘
     │
     │ Query
     │
     ▼
┌──────────────────┐
│  PostgreSQL      │
│  Database        │
└────┬─────────────┘
     │
     │ Database Response
     │
     ▼
┌──────────────────┐
│  Supabase        │
│  REST API        │
└────┬─────────────┘
     │
     │ API Response
     │
     ▼
┌──────────────────┐
│  Service Layer   │
│  (Process Data)  │
└────┬─────────────┘
     │
     │ Processed Data
     │
     ▼
┌──────────────────┐
│  Context         │
│  (State Update)  │
└────┬─────────────┘
     │
     │ State Changes
     │
     ▼
┌──────────────────┐
│  UI Component    │
│  (Re-render)     │
└────┬─────────────┘
     │
     │ Display
     │
     ▼
┌─────────┐
│  User   │
└─────────┘
```

## 8. Component Hierarchy

```
App.tsx
├── AuthProvider (Context)
│   └── RootNavigator
│       ├── SplashScreen
│       │   └── Button
│       │
│       ├── AuthStack
│       │   └── AuthScreen
│       │       ├── Input
│       │       ├── Button
│       │       └── Loading
│       │
│       └── AppStack (Bottom Tab Navigator)
│           ├── DashboardStack
│           │   └── DashboardScreen
│           │       ├── Card
│           │       ├── Button
│           │       ├── Loading
│           │       └── Error
│           │
│           ├── ArticlesStack
│           │   └── ArticlesScreen
│           │       ├── Card
│           │       ├── Loading
│           │       └── Error
│           │
│           ├── VideosStack
│           │   └── VideosScreen
│           │       ├── Card
│           │       ├── Button
│           │       ├── Loading
│           │       └── Error
│           │
│           ├── QuizStack
│           │   └── QuizScreen
│           │       ├── Card
│           │       ├── Button
│           │       ├── Loading
│           │       └── Error
│           │
│           └── ProfileStack
│               └── ProfileScreen
│                   ├── Card
│                   ├── Input
│                   ├── Button
│                   └── Loading
```

---

**Note**: Diagram ini merupakan representasi visual dari arsitektur aplikasi English Virtual Lab mobile. Untuk informasi lebih detail, silakan lihat dokumentasi code dan comments di dalam source code.
