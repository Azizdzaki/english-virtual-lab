import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Linking,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Video } from '../types';
import { Card } from '../components';
import { formatDate, formatDuration } from '../utils';

interface VideosScreenProps {
  navigation: any;
}

// Hardcoded videos data
const VIDEOS_DATA: Video[] = [
  {
    id: '1',
    title: 'English Alphabet',
    description: 'Learn the English alphabet pronunciation',
    video_url: 'https://www.youtube.com/watch?v=ZX3w8iYmNEw',
    thumbnail_url: 'https://via.placeholder.com/400x200?text=Alphabet',
    duration_seconds: 300,
    category: 'Basics',
    published_at: '2025-12-30',
    created_at: '2025-12-30',
  },
  {
    id: '2',
    title: 'Grammar Lessons',
    description: 'Complete grammar lessons for beginners',
    video_url: 'https://www.youtube.com/watch?v=qVg2EXCnLAE',
    thumbnail_url: 'https://via.placeholder.com/400x200?text=Grammar',
    duration_seconds: 1200,
    category: 'Grammar',
    published_at: '2025-12-30',
    created_at: '2025-12-30',
  },
];

const VideosScreen: React.FC<VideosScreenProps> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  const handlePlayVideo = (url: string | undefined) => {
    if (!url || typeof url !== 'string') {
      alert('Link video tidak tersedia');
      return;
    }

    let videoUrl = url.trim();
    
    if (videoUrl.includes('youtube.com')) {
      const videoId = videoUrl.split('v=')[1]?.split('&')[0];
      if (videoId) {
        videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      }
    } else if (videoUrl.includes('youtu.be')) {
      const videoId = videoUrl.split('/')[3]?.split('?')[0];
      if (videoId) {
        videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      }
    }
    
    Linking.openURL(videoUrl).catch(() => {
      alert('Tidak bisa membuka video');
    });
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Video Pembelajaran</Text>
        <Text style={styles.subtitle}>
          Tonton video tutorial bahasa Inggris
        </Text>
      </View>

      <View style={styles.content}>
        {VIDEOS_DATA.map((video) => (
          <Card key={video.id} style={styles.videoCard}>
            {video.video_url ? (
              <TouchableOpacity onPress={() => handlePlayVideo(video.video_url)}>
                <View style={styles.thumbnail}>
                  {video.thumbnail_url ? (
                    <Image
                      source={{ uri: video.thumbnail_url }}
                      style={styles.thumbnailImage}
                    />
                  ) : null}
                  <View style={styles.playIconOverlay}>
                    <Text style={styles.playIcon}>▶️</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ) : (
              <View style={styles.thumbnail}>
                <Text style={styles.noPlayIcon}>🔒</Text>
              </View>
            )}
            <Text style={styles.videoTitle}>{video.title}</Text>
            <Text style={styles.description} numberOfLines={3}>
              {video.description}
            </Text>
            <View style={styles.metadata}>
              <Text style={styles.duration}>
                ⏱️ {formatDuration(Math.ceil(video.duration_seconds / 60))}
              </Text>
              <Text style={styles.category}>{video.category}</Text>
            </View>
            <Text style={styles.date}>{formatDate(video.created_at)}</Text>
          </Card>
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
  content: {
    paddingVertical: 8,
  },
  videoCard: {
    marginHorizontal: 12,
    marginVertical: 8,
  },
  thumbnail: {
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  playIconOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  playIcon: {
    fontSize: 48,
  },
  noPlayIcon: {
    fontSize: 48,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
    lineHeight: 22,
  },
  description: {
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 18,
    marginBottom: 8,
  },
  metadata: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  duration: {
    fontSize: 12,
    color: '#6b7280',
  },
  category: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '500',
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

export default VideosScreen;
