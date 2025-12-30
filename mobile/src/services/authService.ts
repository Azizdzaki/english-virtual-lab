import { supabase } from './supabaseClient';
import { User, AuthSession } from '../types';

export class AuthService {
  // Sign up dengan email dan password
  static async signUp(email: string, password: string, fullName: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;
      return data;
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

  // Get current user
  static async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data.user;
    } catch (error: any) {
      throw {
        message: error.message || 'Failed to get user',
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

  // Listen to auth state changes
  static onAuthStateChange(callback: (event: any, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}
