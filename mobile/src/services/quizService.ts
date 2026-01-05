import { supabase } from './supabaseClient';
import { Quiz, Question, QuizAttempt } from '../types';
import { QUIZZES_DATA } from '../data/quizzes';

export class QuizService {
  // Get all quizzes (from hardcoded data)
  static async getQuizzes(limit = 20) {
    try {
      return QUIZZES_DATA.slice(0, limit);
    } catch (error: any) {
      throw {
        message: error.message || 'Failed to fetch quizzes',
        code: error.code || 'QUIZZES_ERROR',
        status: error.status || 500,
      };
    }
  }

  // Get quiz by ID (from hardcoded data)
  static async getQuizById(quizId: string) {
    try {
      const quiz = QUIZZES_DATA.find(q => q.id === quizId);
      if (!quiz) {
        throw new Error('Quiz not found');
      }
      return quiz;
    } catch (error: any) {
      throw {
        message: error.message || 'Failed to fetch quiz',
        code: error.code || 'QUIZ_ERROR',
        status: error.status || 500,
      };
    }
  }

  // Get questions for a quiz (from hardcoded data)
  static async getQuizQuestions(quizId: string) {
    try {
      // Questions are retrieved from QUESTIONS_DATA in QuizDetailScreen
      // This method is kept for compatibility
      return [];
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

      // Retrieve the quiz title
      const quiz = QUIZZES_DATA.find(q => q.id === quizId);
      const quizTitle = quiz ? quiz.title : 'Unknown Quiz';
      
      // Debug log
      console.log('Submitting quiz attempt:', {
        user_id: userId,
        quiz_id: quizId,
        score: Math.round(score),
        total_questions: totalQuestions,
        passed,
      });

      const { data, error } = await supabase
        .from('quiz_results')
        .insert([
          {
            user_id: userId,
            quiz_id: quizId,
            quiz_title: quizTitle,
            score: Math.round(score),
            total_questions: totalQuestions,
            passed,
          },
        ])
        .select();

      if (error) {
        console.error('Quiz attempt error:', error);
        throw error;
      }

      // Handle array response
      const result = Array.isArray(data) ? data[0] : data;
      return result as QuizAttempt;
    } catch (error: any) {
      console.error('Submit quiz attempt error:', error);
      throw {
        message: error.message || 'Failed to submit quiz',
        code: error.code || 'SUBMIT_QUIZ_ERROR',
        status: error.status || 500,
        details: error.details || error,
      };
    }
  }

  // Get quiz attempts by user
  static async getUserQuizAttempts(userId: string) {
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

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
        .from('quiz_results')
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
