import { supabase } from './supabaseClient';
import { Course, Module, UserProgress } from '../types';

export class CourseService {
  // Get all courses
  static async getCourses() {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Course[];
    } catch (error: any) {
      throw {
        message: error.message || 'Failed to fetch courses',
        code: error.code || 'COURSES_ERROR',
        status: error.status || 500,
      };
    }
  }

  // Get course by ID
  static async getCourseById(courseId: string) {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (error) throw error;
      return data as Course;
    } catch (error: any) {
      throw {
        message: error.message || 'Failed to fetch course',
        code: error.code || 'COURSE_ERROR',
        status: error.status || 500,
      };
    }
  }

  // Get modules for a course
  static async getModules(courseId: string) {
    try {
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .eq('course_id', courseId)
        .order('order', { ascending: true });

      if (error) throw error;
      return data as Module[];
    } catch (error: any) {
      throw {
        message: error.message || 'Failed to fetch modules',
        code: error.code || 'MODULES_ERROR',
        status: error.status || 500,
      };
    }
  }

  // Get module by ID
  static async getModuleById(moduleId: string) {
    try {
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .eq('id', moduleId)
        .single();

      if (error) throw error;
      return data as Module;
    } catch (error: any) {
      throw {
        message: error.message || 'Failed to fetch module',
        code: error.code || 'MODULE_ERROR',
        status: error.status || 500,
      };
    }
  }

  // Get user progress
  static async getUserProgress(userId: string, courseId: string) {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId);

      if (error) throw error;
      return data as UserProgress[];
    } catch (error: any) {
      throw {
        message: error.message || 'Failed to fetch progress',
        code: error.code || 'PROGRESS_ERROR',
        status: error.status || 500,
      };
    }
  }

  // Update user progress
  static async updateProgress(
    userId: string,
    courseId: string,
    moduleId: string,
    progressPercentage: number,
    isCompleted: boolean
  ) {
    try {
      const { data: existingProgress, error: fetchError } = await supabase
        .from('user_progress')
        .select('id')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .eq('module_id', moduleId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingProgress) {
        // Update existing progress
        const { data, error } = await supabase
          .from('user_progress')
          .update({
            progress_percentage: progressPercentage,
            is_completed: isCompleted,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingProgress.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new progress record
        const { data, error } = await supabase
          .from('user_progress')
          .insert([
            {
              user_id: userId,
              course_id: courseId,
              module_id: moduleId,
              progress_percentage: progressPercentage,
              is_completed: isCompleted,
              last_accessed: new Date().toISOString(),
            },
          ])
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    } catch (error: any) {
      throw {
        message: error.message || 'Failed to update progress',
        code: error.code || 'UPDATE_PROGRESS_ERROR',
        status: error.status || 500,
      };
    }
  }

  // Get course progress overview
  static async getCourseProgressOverview(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('course_id, progress_percentage, is_completed')
        .eq('user_id', userId);

      if (error) throw error;
      return data;
    } catch (error: any) {
      throw {
        message: error.message || 'Failed to fetch course progress overview',
        code: error.code || 'PROGRESS_OVERVIEW_ERROR',
        status: error.status || 500,
      };
    }
  }
}
