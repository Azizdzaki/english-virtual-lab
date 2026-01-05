import { supabase } from './supabaseClient';
import { User, AuthSession } from '../types';

export class AuthService {
  // Sign up dengan email dan password
  static async signUp(email: string, password: string, fullName: string) {
    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (authError) throw authError;

      // Wait a bit for the trigger to complete
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Fetch the created user profile
      if (authData.user) {
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('auth_id', authData.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        }

        return profile;
      }

      return null;
    } catch (error: any) {
      throw {
        message: error.message || 'Sign up failed',
        code: error.code || 'SIGNUP_ERROR',
        status: error.status || 500,
      };
    }
  }

  // Sign in dengan email dan password
  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      throw {
        message: error.message || 'Sign in failed',
        code: error.code || 'SIGNIN_ERROR',
        status: error.status || 500,
      };
    }
  }

  // Sign out
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return true;
    } catch (error: any) {
      throw {
        message: error.message || 'Sign out failed',
        code: error.code || 'SIGNOUT_ERROR',
        status: error.status || 500,
      };
    }
  }

  // Get current session
  static async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    } catch (error: any) {
      throw {
        message: error.message || 'Failed to get session',
        code: error.code || 'SESSION_ERROR',
        status: error.status || 500,
      };
    }
  }

  // Get current user with full profile from users table
  static async getCurrentUserWithProfile() {
    try {
      const { data: authUser, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;

      if (!authUser.user?.id) {
        return null;
      }

      // Get user profile from users table
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_id', authUser.user.id)
        .single();

      if (profileError) {
        // If profile doesn't exist, return basic user info
        return {
          id: authUser.user.id,
          auth_id: authUser.user.id,
          email: authUser.user.email || '',
          full_name: authUser.user.user_metadata?.full_name || '',
          avatar_url: authUser.user.user_metadata?.avatar_url,
          learning_level: 'beginner' as const,
          total_quizzes_taken: 0,
          total_score: 0,
          average_score: 0,
          is_active: true,
          created_at: authUser.user.created_at,
          updated_at: authUser.user.updated_at,
        };
      }

      return userProfile as any;
    } catch (error: any) {
      throw {
        message: error.message || 'Failed to get user profile',
        code: error.code || 'USER_ERROR',
        status: error.status || 500,
      };
    }
  }

  // Reset password
  static async resetPassword(email: string) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://your-app-url/auth/callback',
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      throw {
        message: error.message || 'Password reset failed',
        code: error.code || 'RESET_ERROR',
        status: error.status || 500,
      };
    }
  }

  // Update user profile
  static async updateProfile(updates: { 
    full_name?: string; 
    avatar_url?: string;
    bio?: string;
    phone_number?: string;
    country?: string;
    learning_level?: 'beginner' | 'intermediate' | 'advanced';
  }) {
    try {
      // Get current user
      const { data: authUser, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;

      if (!authUser.user?.id) {
        throw new Error('User not authenticated');
      }

      // Update auth metadata
      const authUpdateData: any = {};
      if (updates.full_name) authUpdateData.full_name = updates.full_name;
      if (updates.avatar_url) authUpdateData.avatar_url = updates.avatar_url;

      if (Object.keys(authUpdateData).length > 0) {
        const { error: authUpdateError } = await supabase.auth.updateUser({
          data: authUpdateData,
        });
        if (authUpdateError) throw authUpdateError;
      }

      // Update users table
      const userUpdateData: any = {};
      if (updates.full_name) userUpdateData.full_name = updates.full_name;
      if (updates.avatar_url) userUpdateData.avatar_url = updates.avatar_url;
      if (updates.bio !== undefined) userUpdateData.bio = updates.bio;
      if (updates.phone_number !== undefined) userUpdateData.phone_number = updates.phone_number;
      if (updates.country !== undefined) userUpdateData.country = updates.country;
      if (updates.learning_level) userUpdateData.learning_level = updates.learning_level;

      const { data, error } = await supabase
        .from('users')
        .update(userUpdateData)
        .eq('auth_id', authUser.user.id)
        .select();

      if (error) throw error;
      
      // Return first item if array, otherwise return data as is
      const result = Array.isArray(data) ? data[0] : data;
      return result;
    } catch (error: any) {
      throw {
        message: error.message || 'Profile update failed',
        code: error.code || 'UPDATE_ERROR',
        status: error.status || 500,
      };
    }
  }

  // Listen to auth state changes
  static onAuthStateChange(callback: (event: any, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }

  // Update user statistics after quiz
  static async updateUserStats(userId: string, quizScore: number, quizPassed: boolean) {
    try {
      // Get current user stats
      const { data: userStats, error: getError } = await supabase
        .from('users')
        .select('total_quizzes_taken, total_score, average_score')
        .eq('id', userId)
        .single();

      if (getError) throw getError;

      const newTotalQuizzes = (userStats?.total_quizzes_taken || 0) + 1;
      const newTotalScore = (userStats?.total_score || 0) + Math.round(quizScore);
      const newAverage = Math.round(newTotalScore / newTotalQuizzes);

      // Update user stats
      const { data, error } = await supabase
        .from('users')
        .update({
          total_quizzes_taken: newTotalQuizzes,
          total_score: newTotalScore,
          average_score: newAverage,
        })
        .eq('id', userId)
        .select();

      if (error) throw error;
      return Array.isArray(data) ? data[0] : data;
    } catch (error: any) {
      throw {
        message: error.message || 'Failed to update stats',
        code: error.code || 'STATS_ERROR',
        status: error.status || 500,
      };
    }
  }
}
