import { supabase } from './supabaseClient';
import { Article } from '../types';

export class ArticleService {
  // Get all articles
  static async getArticles(limit = 20, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data as Article[];
    } catch (error: any) {
      throw {
        message: error.message || 'Failed to fetch articles',
        code: error.code || 'ARTICLES_ERROR',
        status: error.status || 500,
      };
    }
  }

  // Get article by ID
  static async getArticleById(articleId: string) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', articleId)
        .single();

      if (error) throw error;
      return data as Article;
    } catch (error: any) {
      throw {
        message: error.message || 'Failed to fetch article',
        code: error.code || 'ARTICLE_ERROR',
        status: error.status || 500,
      };
    }
  }

  // Get articles by category
  static async getArticlesByCategory(category: string, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('category', category)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as Article[];
    } catch (error: any) {
      throw {
        message: error.message || 'Failed to fetch articles',
        code: error.code || 'ARTICLES_ERROR',
        status: error.status || 500,
      };
    }
  }

  // Search articles
  static async searchArticles(query: string) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .order('published_at', { ascending: false });

      if (error) throw error;
      return data as Article[];
    } catch (error: any) {
      throw {
        message: error.message || 'Failed to search articles',
        code: error.code || 'SEARCH_ERROR',
        status: error.status || 500,
      };
    }
  }
}
