import { supabase } from './supabaseClient';
import { Quiz, Question, QuizAttempt } from '../types';

export class QuizService {
  // Get all quizzes
  static async getQuizzes(limit = 20) {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as Quiz[];
    } catch (error: any) {
      throw {
        message: error.message || 'Failed to fetch quizzes',
        code: error.code || 'QUIZZES_ERROR',
        status: error.status || 500,
      };
    }
  }

  // Get quiz by ID
  static async getQuizById(quizId: string) {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', quizId)
        .single();

      if (error) throw error;
      return data as Quiz;
    } catch (error: any) {
      throw {
        message: error.message || 'Failed to fetch quiz',
        code: error.code || 'QUIZ_ERROR',
        status: error.status || 500,
      };
    }
  }

  // Get questions for a quiz
  static async getQuizQuestions(quizId: string) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('order', { ascending: true });

      if (error) throw error;
      return data as Question[];
    } catch (error: any) {
      throw {
        message: error.message || 'Failed to fetch questions',
        code: error.code || 'QUESTIONS_ERROR',
        status: error.status || 500,
      };
    }
  }

  // Submit quiz attempt
  static async submitQuizAttempt(
    userId: string,
    quizId: string,
    answers: Record<string, string>,
    score: number,
    totalQuestions: number
  ) {
    try {
      const passed = score >= 60; // 60% passing score
      
      const { data, error } = await supabase
        .from('quiz_attempts')
        .insert([
          {
            user_id: userId,
            quiz_id: quizId,
            score: Math.round(score),
            total_questions: totalQuestions,
            passed,
            started_at: new Date().toISOString(),
            completed_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data as QuizAttempt;
    } catch (error: any) {
      throw {
        message: error.message || 'Failed to submit quiz',
        code: error.code || 'SUBMIT_QUIZ_ERROR',
        status: error.status || 500,
      };
    }
  }

  // Get quiz attempts by user
  static async getUserQuizAttempts(userId: string) {
    try {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (error) throw error;
      return data as QuizAttempt[];
    } catch (error: any) {
      throw {
        message: error.message || 'Failed to fetch quiz attempts',
        code: error.code || 'ATTEMPTS_ERROR',
        status: error.status || 500,
      };
    }
  }

  // Get quiz attempt detail
  static async getQuizAttemptDetail(attemptId: string) {
    try {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('id', attemptId)
        .single();

      if (error) throw error;
      return data as QuizAttempt;
    } catch (error: any) {
      throw {
        message: error.message || 'Failed to fetch attempt detail',
        code: error.code || 'ATTEMPT_DETAIL_ERROR',
        status: error.status || 500,
      };
    }
  }
}
