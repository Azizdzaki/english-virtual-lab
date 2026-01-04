import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { AuthService, QuizService } from '../services';
import { Card, Loading } from '../components';

interface DashboardScreenProps {
  navigation: any;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    if (!user) return;
    try {
      const quizzesData = await QuizService.getQuizzes();
      const attemptsData = await QuizService.getUserQuizAttempts(user.id);
      
      // Also refresh user profile to get latest stats
      const updatedUser = await AuthService.getCurrentUserWithProfile();
      
      setQuizzes(quizzesData);
      setAttempts(attemptsData);
    } catch (err: any) {
      console.log('Error loading dashboard data:', err);
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

  // Hitung average score dari attempts atau dari user stats
  const avgScore = user?.average_score || (attempts.length > 0
    ? Math.round(attempts.reduce((sum, a) => sum + (a.score || 0), 0) / attempts.length)
    : 0);

  // Count passed quizzes - use user stats jika ada
  const passedCount = user?.total_quizzes_taken || attempts.filter(a => a.passed).length;
  
  // Total quizzes taken
  const totalQuizzesTaken = user?.total_quizzes_taken || attempts.length;

  if (isLoading) {
    return <Loading message="Memuat dashboard..." />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Selamat datang! 👋</Text>
        <Text style={styles.userName}>{user?.full_name || 'Pengguna'}</Text>
        <Text style={styles.subtitle}>
          Platform pembelajaran bahasa Inggris interaktif untuk meningkatkan kemampuan Anda
        </Text>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tentang Platform Kami</Text>
        <Card style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>English Virtual Lab</Text>
          <Text style={styles.aboutText}>
            Sebuah platform pembelajaran bahasa Inggris yang dirancang khusus untuk membantu Anda menguasai bahasa Inggris melalui berbagai metode pembelajaran interaktif yaitu artikel, video, dan kuis.
          </Text>
        </Card>
      </View>

      {/* Quick Access */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Menu Utama</Text>
        <View style={styles.quickAccessContainer}>
          <TouchableOpacity
            style={styles.quickAccessBtn}
            onPress={() => navigation.navigate('ArticlesStack')}
          >
            <Text style={styles.quickAccessIcon}>📄</Text>
            <Text style={styles.quickAccessLabel}>Artikel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAccessBtn}
            onPress={() => navigation.navigate('VideosStack')}
          >
            <Text style={styles.quickAccessIcon}>🎬</Text>
            <Text style={styles.quickAccessLabel}>Video</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAccessBtn}
            onPress={() => navigation.navigate('QuizStack')}
          >
            <Text style={styles.quickAccessIcon}>❓</Text>
            <Text style={styles.quickAccessLabel}>Kuis</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAccessBtn}
            onPress={() => navigation.navigate('ProfileStack')}
          >
            <Text style={styles.quickAccessIcon}>👤</Text>
            <Text style={styles.quickAccessLabel}>Profil</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistik Belajar</Text>
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{avgScore}%</Text>
            <Text style={styles.statLabel}>Rata-rata Skor</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{totalQuizzesTaken}</Text>
            <Text style={styles.statLabel}>Total Kuis Dikerjakan</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{passedCount}</Text>
            <Text style={styles.statLabel}>Kuis Lolos</Text>
          </Card>
        </View>
      </View>

      {/* Footer spacing */}
      <View style={{ height: 20 }} />
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
  greeting: {
    fontSize: 16,
    color: '#e0e7ff',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#dbeafe',
    lineHeight: 20,
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
    marginTop: 16,
  },
  aboutCard: {
    marginHorizontal: 12,
    marginVertical: 8,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3b82f6',
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  features: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  quickAccessContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 12,
  },
  quickAccessBtn: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    borderColor: '#e5e7eb',
    borderWidth: 1,
  },
  quickAccessIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  quickAccessLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  statsGrid: {
    paddingHorizontal: 12,
    gap: 12,
  },
  statCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default DashboardScreen;
