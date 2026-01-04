import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Article } from '../types';
import { Card, Loading } from '../components';
import { formatDate } from '../utils';

interface ArticlesScreenProps {
  navigation: any;
}

// Hardcoded articles data
const ARTICLES_DATA: Article[] = [
  {
    id: "1",
    title: "The Importance of Grammar in English Communication",
    content: "Understanding the foundational role of grammar in effective communication.",
    author: 'Grammar Beginner',
    category: "Grammar",
    url: "https://5minuteenglish.com/mastering-english-grammar-for-effective-communication/",
    published_at: '2025-12-30',
    created_at: '2025-12-30',
    updated_at: '2025-12-30',
  },
  {
    id: "2",
    title: "10 Tips to Improve Your English Vocabulary",
    content: "Practical strategies to expand your English word knowledge effectively.",
    author: "Vocabulary Intermediate",
    category: "Vocabulary",
    url: "https://ghoorilearning.com/blogs/tips-to-improve-english-vocabulary",
    published_at: '2025-12-30',
    created_at: '2025-12-30',
    updated_at: '2025-12-30',
  },
  {
    id: "3",
    title: "Common English Idioms and Their Meanings",
    content: "Learn popular English expressions used in everyday conversations.",
    author: "Idioms Intermediate",
    category: "Idioms",
    url: "https://englishexplorer.com.sg/english-idioms",
    published_at: '2025-12-30',
    created_at: '2025-12-30',
    updated_at: '2025-12-30',
  },
  {
    id: "4",
    title: "Business English: Professional Email Writing",
    content: "Master the art of writing clear and professional emails in English.",
    author: "Business Advanced",
    category: "Business",
    url: "https://aforabhishek.com/online-communication-skills/",
    published_at: '2025-12-30',
    created_at: '2025-12-30',
    updated_at: '2025-12-30',
  },
  {
    id: "5",
    title: "English Pronunciation Guide for Non-Native Speakers",
    content: "Tips and techniques to improve your English pronunciation.",
    author: "Pronunciation Beginner",
    category: "Pronunciation",
    url: "https://www.speakometer.net/",
    published_at: '2025-12-30',
    created_at: '2025-12-30',
    updated_at: '2025-12-30',
  },
  {
    id: "6",
    title: "Understanding English Tenses: A Complete Guide",
    content: "Comprehensive overview of all English tenses with examples.",
    author: "Grammar Intermediate",
    category: "Grammar",
    url: "https://5minuteenglish.com/mastering-english-grammar-for-effective-communication/",
    published_at: '2025-12-30',
    created_at: '2025-12-30',
    updated_at: '2025-12-30',
  },
];

const ArticlesScreen: React.FC<ArticlesScreenProps> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleOpenArticle = (article: Article) => {
    if (article.url) {
      Linking.openURL(article.url).catch(() => {
        alert('Tidak bisa membuka artikel');
      });
    } else {
      alert('Link artikel tidak tersedia');
    }
  };

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
        {ARTICLES_DATA.map((article) => (
          <TouchableOpacity 
            key={article.id}
            onPress={() => handleOpenArticle(article)}
            activeOpacity={0.7}
          >
            <Card style={styles.articleCard}>
              <Text style={styles.articleTitle}>{article.title}</Text>
              <Text style={styles.category}>{article.category}</Text>
              <Text style={styles.contentText}>
                {article.content}
              </Text>
              <Text style={styles.date}>{formatDate(article.created_at)}</Text>
            </Card>
          </TouchableOpacity>
        ))}
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
