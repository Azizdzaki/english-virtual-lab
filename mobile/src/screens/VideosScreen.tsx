import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { VideoService } from '../services';
import { Video } from '../types';
import { Card, Loading, Error } from '../components';
import { formatDate, formatDuration } from '../utils';

interface VideosScreenProps {
  navigation: any;
}

const VideosScreen: React.FC<VideosScreenProps> = ({ navigation }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadVideos = async () => {
    try {
      setError(null);
      const data = await VideoService.getVideos();
      setVideos(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load videos');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadVideos();
  };

  const handlePlayVideo = (url: string) => {
    Linking.openURL(url).catch(() => {
      alert('Tidak bisa membuka video');
    });
  };

  if (isLoading) {
    return <Loading message="Memuat video..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadVideos} />;
  }

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
        {videos.length > 0 ? (
          videos.map((video) => (
            <Card key={video.id} style={styles.videoCard}>
              <TouchableOpacity onPress={() => handlePlayVideo(video.video_url)}>
                <View style={styles.thumbnail}>
                  <Text style={styles.playIcon}>▶️</Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.videoTitle}>{video.title}</Text>
              <Text style={styles.description} numberOfLines={2}>
                {video.description}
              </Text>
              <View style={styles.metadata}>
                <Text style={styles.duration}>
                  ⏱️ {formatDuration(Math.ceil(video.duration_seconds / 60))}
                </Text>
                <Text style={styles.category}>{video.category}</Text>
              </View>
              <Text style={styles.date}>{formatDate(video.published_at)}</Text>
            </Card>
          ))
        ) : (
          <Text style={styles.noDataText}>Belum ada video</Text>
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
  },
  playIcon: {
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
