import { supabase } from './supabaseClient';
import { Video } from '../types';

export class VideoService {
  // Get all videos
  static async getVideos(limit = 20, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data as Video[];
    } catch (error: any) {
      throw {
        message: error.message || 'Failed to fetch videos',
        code: error.code || 'VIDEOS_ERROR',
        status: error.status || 500,
      };
    }
  }

  // Get video by ID
  static async getVideoById(videoId: string) {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('id', videoId)
        .single();

      if (error) throw error;
      return data as Video;
    } catch (error: any) {
      throw {
        message: error.message || 'Failed to fetch video',
        code: error.code || 'VIDEO_ERROR',
        status: error.status || 500,
      };
    }
  }

  // Get videos by category
  static async getVideosByCategory(category: string, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('category', category)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as Video[];
    } catch (error: any) {
      throw {
        message: error.message || 'Failed to fetch videos',
        code: error.code || 'VIDEOS_ERROR',
        status: error.status || 500,
      };
    }
  }

  // Search videos
  static async searchVideos(query: string) {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order('published_at', { ascending: false });

      if (error) throw error;
      return data as Video[];
    } catch (error: any) {
      throw {
        message: error.message || 'Failed to search videos',
        code: error.code || 'SEARCH_ERROR',
        status: error.status || 500,
      };
    }
  }
}
