import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { QuizService } from '../services';
import { AuthService } from '../services';
import { useAuth } from '../contexts/AuthContext';
import { Card, Loading, Button } from '../components';
import { QUIZZES_DATA, QUESTIONS_DATA } from '../data/quizzes';

interface QuizDetailScreenProps {
  navigation: any;
  route: any;
}

const QuizDetailScreen: React.FC<QuizDetailScreenProps> = ({ navigation, route }) => {
  const { user } = useAuth();
  const { quizId } = route.params;
  
  const quiz = QUIZZES_DATA.find(q => q.id === quizId);
  const questions = QUESTIONS_DATA[quizId] || [];

  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!quiz || !user || questions.length === 0) return;

    // Hitung score
    let correctAnswers = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct_answer) {
        correctAnswers++;
      }
    });

    const score = (correctAnswers / questions.length) * 100;
    const passed = score >= 60;

    setIsSubmitting(true);
    try {
      // Submit quiz attempt
      await QuizService.submitQuizAttempt(
        user.id,
        quizId,
        answers,
        score,
        questions.length
      );

      // Update user statistics
      await AuthService.updateUserStats(user.id, score, passed);

      Alert.alert(
        'Hasil Kuis',
        `Skor Anda: ${Math.round(score)}%\n${passed ? '✓ Lolos' : '✗ Tidak Lolos'}`,
        [
          {
            text: 'Kembali',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to submit quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!quiz || questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>Kuis tidak ditemukan</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{quiz.title}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Pertanyaan {currentQuestionIndex + 1} dari {questions.length}
        </Text>
      </View>

      <View style={styles.content}>
        <Card style={styles.questionCard}>
          <Text style={styles.questionText}>{currentQuestion.question_text}</Text>

          {currentQuestion.question_type === 'multiple_choice' && currentQuestion.options && (
            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.option,
                    answers[currentQuestion.id] === option && styles.optionSelected,
                  ]}
                  onPress={() => handleAnswerSelect(currentQuestion.id, option)}
                >
                  <View style={styles.optionRadio}>
                    {answers[currentQuestion.id] === option && (
                      <View style={styles.optionRadioSelected} />
                    )}
                  </View>
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {currentQuestion.question_type === 'true_false' && (
            <View style={styles.optionsContainer}>
              {['True', 'False'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.option,
                    answers[currentQuestion.id] === option && styles.optionSelected,
                  ]}
                  onPress={() => handleAnswerSelect(currentQuestion.id, option)}
                >
                  <View style={styles.optionRadio}>
                    {answers[currentQuestion.id] === option && (
                      <View style={styles.optionRadioSelected} />
                    )}
                  </View>
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </Card>

        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[styles.navButton, currentQuestionIndex === 0 && styles.navButtonDisabled]}
            onPress={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
          >
            <Text style={styles.navButtonText}>← Sebelumnya</Text>
          </TouchableOpacity>

          {currentQuestionIndex === questions.length - 1 ? (
            <TouchableOpacity
              style={[styles.navButton, styles.submitButton]}
              onPress={handleSubmitQuiz}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Mengirim...' : 'Kirim Jawaban'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
            >
              <Text style={styles.navButtonText}>Selanjutnya →</Text>
            </TouchableOpacity>
          )}
        </View>
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
  backButton: {
    fontSize: 14,
    color: '#dbeafe',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#1e40af',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#dbeafe',
  },
  content: {
    padding: 16,
  },
  questionCard: {
    padding: 16,
    marginBottom: 16,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 20,
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  optionSelected: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  optionRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionRadioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3b82f6',
  },
  optionText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  submitButton: {
    backgroundColor: '#10b981',
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  noDataText: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: 40,
  },
});

export default QuizDetailScreen;
