import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../components';

interface SplashScreenProps {
  navigation: any;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📚</Text>
      <Text style={styles.title}>English Virtual Lab</Text>
      <Text style={styles.subtitle}>
        Belajar bahasa Inggris dengan cara yang menyenangkan
      </Text>
      
      <View style={styles.features}>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>🎓</Text>
          <Text style={styles.featureText}>Kursus Interaktif</Text>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>📹</Text>
          <Text style={styles.featureText}>Video Pembelajaran</Text>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>✍️</Text>
          <Text style={styles.featureText}>Latihan Soal</Text>
        </View>
      </View>

      <View style={styles.buttons}>
        <Button
          onPress={() => navigation.navigate('Auth')}
          title="Mulai Sekarang"
          variant="primary"
          size="large"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  emoji: {
    fontSize: 80,
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginTop: 24,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },
  features: {
    width: '100%',
    marginTop: 40,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  featureIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  buttons: {
    width: '100%',
  },
});

export default SplashScreen;
