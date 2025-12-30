import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Image,
  Dimensions,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { CourseService } from '../services';
import { Course } from '../types';
import { Card, Loading, Error, Button } from '../components';
import { formatDuration, getDifficultyLabel, getDifficultyColor } from '../utils';

interface DashboardScreenProps {
  navigation: any;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadCourses = async () => {
    try {
      setError(null);
      const data = await CourseService.getCourses();
      setCourses(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load courses');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadCourses();
  };

  if (isLoading) {
    return <Loading message="Memuat kursus..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadCourses} />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Selamat datang! 👋</Text>
        <Text style={styles.userName}>{user?.full_name || 'Pengguna'}</Text>
        <Text style={styles.subtitle}>
          Lanjutkan belajar dan tingkatkan kemampuan bahasa Inggris Anda
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{courses.length}</Text>
          <Text style={styles.statLabel}>Kursus Tersedia</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Selesai</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kursus Populer</Text>
        {courses.length > 0 ? (
          courses.slice(0, 5).map((course) => (
            <Card key={course.id} style={styles.courseCard}>
              <View style={styles.courseContent}>
                <View style={styles.courseInfo}>
                  <Text style={styles.courseTitle} numberOfLines={2}>
                    {course.title}
                  </Text>
                  <Text style={styles.courseCategory}>{course.category}</Text>
                  <View style={styles.courseMetadata}>
                    <Text style={styles.difficulty}>
                      {getDifficultyLabel(course.difficulty_level)}
                    </Text>
                    <Text style={styles.duration}>
                      {formatDuration(course.duration_minutes)}
                    </Text>
                  </View>
                </View>
              </View>
              <Button
                onPress={() =>
                  navigation.navigate('Courses', { courseId: course.id })
                }
                title="Lihat Detail"
                variant="primary"
                size="small"
              />
            </Card>
          ))
        ) : (
          <Text style={styles.noDataText}>Belum ada kursus</Text>
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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
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
  courseCard: {
    marginHorizontal: 12,
    marginVertical: 8,
  },
  courseContent: {
    marginBottom: 12,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  courseCategory: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  courseMetadata: {
    flexDirection: 'row',
    gap: 12,
  },
  difficulty: {
    fontSize: 12,
    fontWeight: '500',
    color: '#3b82f6',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  duration: {
    fontSize: 12,
    color: '#6b7280',
  },
  noDataText: {
    textAlign: 'center',
    color: '#9ca3af',
    marginVertical: 20,
  },
});

export default DashboardScreen;
