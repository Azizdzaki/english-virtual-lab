import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { QuizService } from '../services';
import { useAuth } from '../contexts/AuthContext';
import { Quiz, QuizAttempt } from '../types';
import { Card, Loading, Error, Button } from '../components';
import { formatDate } from '../utils';

interface QuizScreenProps {
  navigation: any;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    if (!user) return;
    try {
      setError(null);
      const quizzesData = await QuizService.getQuizzes();
      const attemptsData = await QuizService.getUserQuizAttempts(user.id);
      setQuizzes(quizzesData);
      setAttempts(attemptsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load quizzes');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleStartQuiz = (quiz: Quiz) => {
    navigation.navigate('QuizDetail', { quizId: quiz.id });
  };

  if (isLoading) {
    return <Loading message="Memuat kuis..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Kuis Pembelajaran</Text>
        <Text style={styles.subtitle}>Uji pemahaman Anda dengan kuis interaktif</Text>
      </View>

      <View style={styles.statsSection}>
        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>Total Kuis</Text>
          <Text style={styles.statValue}>{quizzes.length}</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>Kuis Selesai</Text>
          <Text style={styles.statValue}>{attempts.length}</Text>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daftar Kuis</Text>
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => {
            const attempt = attempts.find((a) => a.quiz_id === quiz.id);
            return (
              <Card key={quiz.id} style={styles.quizCard}>
                <Text style={styles.quizTitle}>{quiz.title}</Text>
                <Text style={styles.quizDescription}>{quiz.description}</Text>
                <View style={styles.quizMetadata}>
                  <Text style={styles.metadataItem}>
                    ❓ {quiz.total_questions} pertanyaan
                  </Text>
                  <Text style={styles.metadataItem}>
                    ⏱️ {quiz.duration_minutes} menit
                  </Text>
                </View>
                {attempt && (
                  <View style={styles.attemptInfo}>
                    <Text style={[
                      styles.score,
                      { color: attempt.passed ? '#10b981' : '#ef4444' }
                    ]}>
                      Skor: {attempt.score}%
                    </Text>
                    <Text style={styles.attemptDate}>
                      {formatDate(attempt.completed_at)}
                    </Text>
                  </View>
                )}
                <Button
                  onPress={() => handleStartQuiz(quiz)}
                  title={attempt ? 'Ulangi Kuis' : 'Mulai Kuis'}
                  variant="primary"
                  size="small"
                />
              </Card>
            );
          })
        ) : (
          <Text style={styles.noDataText}>Belum ada kuis</Text>
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
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  section: {
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    paddingHorizontal: 20,
    marginBottom: 12,
    marginTop: 8,
  },
  quizCard: {
    marginHorizontal: 12,
    marginVertical: 8,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  quizDescription: {
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 18,
    marginBottom: 12,
  },
  quizMetadata: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  metadataItem: {
    fontSize: 12,
    color: '#6b7280',
  },
  attemptInfo: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  score: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  attemptDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  noDataText: {
    textAlign: 'center',
    color: '#9ca3af',
    marginVertical: 20,
  },
});

export default QuizScreen;
