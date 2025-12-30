import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Card, Button, Input } from '../components';
import { getInitials } from '../utils';

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || '');

  const handleLogout = async () => {
    Alert.alert('Logout', 'Apakah Anda yakin ingin logout?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            await signOut();
          } catch (error: any) {
            Alert.alert('Error', error.message);
          }
        },
      },
    ]);
  };

  const handleSaveProfile = () => {
    // TODO: Implement update profile
    Alert.alert('Berhasil', 'Profil berhasil diperbarui');
    setIsEditing(false);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.noUserText}>Pengguna tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(user.full_name)}</Text>
          </View>
        </View>
        <Text style={styles.userName}>{user.full_name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informasi Akun</Text>
        <Card>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nama Lengkap</Text>
            {isEditing ? (
              <Input
                value={fullName}
                onChangeText={setFullName}
                placeholder="Masukkan nama lengkap"
              />
            ) : (
              <Text style={styles.infoValue}>{user.full_name}</Text>
            )}
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Bergabung</Text>
            <Text style={styles.infoValue}>
              {new Date(user.created_at).toLocaleDateString('id-ID')}
            </Text>
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pengaturan</Text>
        <Card>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Text style={styles.settingLabel}>
              {isEditing ? 'Batal Edit Profil' : 'Edit Profil'}
            </Text>
            <Text style={styles.settingIcon}>{isEditing ? '✕' : '✎'}</Text>
          </TouchableOpacity>
        </Card>
      </View>

      {isEditing && (
        <View style={styles.section}>
          <Button
            onPress={handleSaveProfile}
            title="Simpan Perubahan"
            variant="success"
            size="large"
          />
        </View>
      )}

      <View style={styles.section}>
        <Button
          onPress={handleLogout}
          title="Logout"
          variant="danger"
          size="large"
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>English Virtual Lab v1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  noUserText: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: 20,
  },
  header: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingTop: 32,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0369a1',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#dbeafe',
  },
  section: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  infoRow: {
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  settingItem: {
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
  },
  settingIcon: {
    fontSize: 18,
    color: '#3b82f6',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
  },
});

export default ProfileScreen;
