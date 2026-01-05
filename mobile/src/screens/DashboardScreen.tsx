import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { AuthService, QuizService } from '../services';
import { Card, Loading } from '../components';
import type { QuizAttempt } from '../types';

interface DashboardScreenProps {
  navigation: any;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { user, refreshUser } = useAuth();
  const [stats, setStats] = useState({
    avgScore: 0,
    passedCount: 0,
    totalQuizzes: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      
      // 1. Refresh user context first (this fetches latest profile from DB)
      await refreshUser();
      
      // 2. Fetch quiz attempts to calculate fresh stats
      const attempts = await QuizService.getUserQuizAttempts(user.id);
      
      // 3. Calculate statistics from attempts
      let totalScore = 0;
      let passedCount = 0;
      
      attempts.forEach((attempt: QuizAttempt) => {
        totalScore += attempt.score;
        if (attempt.passed) {
          passedCount++;
        }
      });
      
      const avgScore = attempts.length > 0 
        ? Math.round(totalScore / attempts.length) 
        : 0;
      
      // 4. Update stats state
      setStats({
        avgScore,
        passedCount,
        totalQuizzes: attempts.length
      });

    } catch (err: any) {
      console.log('Error loading dashboard data:', err.message);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [user?.id])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (isLoading && !refreshing) {
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

      {/* Statistics Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistik Belajar</Text>
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{stats.avgScore}%</Text>
            <Text style={styles.statLabel}>Rata-rata Skor</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalQuizzes}</Text>
            <Text style={styles.statLabel}>Total Kuis</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{stats.passedCount}</Text>
            <Text style={styles.statLabel}>Kuis Lolos</Text>
          </Card>
        </View>
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

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tentang Platform Kami</Text>
        <Card style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>English Virtual Lab</Text>
          <Text style={styles.aboutText}>
            Sebuah platform pembelajaran bahasa Inggris yang dirancang khusus untuk membantu Anda menguasai bahasa Inggris melalui berbagai metode pembelajaran interaktif.
          </Text>
        </Card>
      </View>

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
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 8,
  },
  statCard: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
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
    borderColor: '#e5e7eb',
    borderWidth: 1,
    elevation: 1,
  },
  quickAccessIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickAccessLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  aboutCard: {
    marginHorizontal: 12,
    padding: 16,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
});

export default DashboardScreen;