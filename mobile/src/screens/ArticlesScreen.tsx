import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { ArticleService } from '../services';
import { Article } from '../types';
import { Card, Loading, Error } from '../components';
import { formatDate, truncateText } from '../utils';

interface ArticlesScreenProps {
  navigation: any;
}

const ArticlesScreen: React.FC<ArticlesScreenProps> = ({ navigation }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadArticles = async () => {
    try {
      setError(null);
      const data = await ArticleService.getArticles();
      setArticles(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load articles');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadArticles();
  };

  if (isLoading) {
    return <Loading message="Memuat artikel..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadArticles} />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Artikel Pembelajaran</Text>
        <Text style={styles.subtitle}>
          Baca artikel menarik tentang bahasa Inggris
        </Text>
      </View>

      <View style={styles.contentContainer}>
        {articles.length > 0 ? (
          articles.map((article) => (
            <Card key={article.id} style={styles.articleCard}>
              <Text style={styles.articleTitle}>{article.title}</Text>
              <Text style={styles.author}>Oleh: {article.author}</Text>
              <Text style={styles.category}>{article.category}</Text>
              <Text style={styles.contentText} numberOfLines={2}>
                {truncateText(article.content, 150)}
              </Text>
              <Text style={styles.date}>{formatDate(article.published_at)}</Text>
            </Card>
          ))
        ) : (
          <Text style={styles.noDataText}>Belum ada artikel</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#dbeafe',
  },
  contentContainer: {
    paddingVertical: 8,
  },
  articleCard: {
    marginHorizontal: 12,
    marginVertical: 8,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
    lineHeight: 22,
  },
  author: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '500',
    marginBottom: 8,
  },
  contentText: {
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 18,
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: '#9ca3af',
  },
  noDataText: {
    textAlign: 'center',
    color: '#9ca3af',
    marginVertical: 20,
  },
});

export default ArticlesScreen;
