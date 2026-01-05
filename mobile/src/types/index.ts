// User Types
export interface User {
  id: string;
  auth_id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  phone_number?: string;
  country?: string;
  learning_level: 'beginner' | 'intermediate' | 'advanced';
  total_quizzes_taken: number;
  total_quizzes_passed: number;
  total_score: number;
  average_score: number;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at: number;
  token_type: string;
  user: User;
}

// Course Types
export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail_url?: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  duration_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string;
  content: string;
  order: number;
  created_at: string;
}

// Article Types
export interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  url?: string; // Link ke artikel lengkap
  thumbnail_url?: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

// Video Types
export interface Video {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url?: string;
  duration_seconds: number;
  category: string;
  published_at: string;
  created_at: string;
}

// Quiz Types
export interface Quiz {
  id: string;
  course_id?: string;
  title: string;
  description: string;
  total_questions: number;
  passing_score: number;
  duration_minutes: number;
  created_at: string;
}

export interface Question {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correct_answer: string;
  explanation: string;
  order: number;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  total_questions: number;
  passed: boolean;
  started_at: string;
  created_at: string;
}

// Progress Types
export interface UserProgress {
  id: string;
  user_id: string;
  course_id: string;
  module_id: string;
  progress_percentage: number;
  is_completed: boolean;
  last_accessed: string;
  created_at: string;
  updated_at: string;
}

// Error Types
export interface ApiError {
  message: string;
  code: string;
  status: number;
}






