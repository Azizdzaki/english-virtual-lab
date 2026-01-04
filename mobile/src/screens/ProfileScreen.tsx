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
  const { user, signOut, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSaveProfile = async () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Nama tidak boleh kosong');
      return;
    }

    setIsSaving(true);
    try {
      if (updateProfile) {
        await updateProfile({ full_name: fullName });
      }
      Alert.alert('Berhasil', 'Profil berhasil diperbarui');
      setIsEditing(false);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Gagal update profil');
    } finally {
      setIsSaving(false);
    }
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
        <Card style={styles.cardContent}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nama Lengkap</Text>
            <Text style={styles.infoValue}>{user.full_name || '-'}</Text>
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
        <Card style={styles.cardContent}>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Text style={styles.settingLabel}>Edit Profil</Text>
            <Text style={styles.settingIcon}>✎</Text>
          </TouchableOpacity>
        </Card>
      </View>

      {isEditing && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Edit Informasi</Text>
          <Card style={styles.cardContent}>
            <View style={styles.editRow}>
              <Text style={styles.infoLabel}>Nama Lengkap</Text>
            </View>
            <Input
              value={fullName}
              onChangeText={setFullName}
              placeholder="Masukkan nama lengkap"
            />
            <View style={styles.editButtonRow}>
              <TouchableOpacity
                style={[styles.editButton, styles.cancelButton]}
                disabled={isSaving}
                onPress={() => {
                  setFullName(user?.full_name || '');
                  setIsEditing(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.editButton,
                  styles.saveButton,
                  isSaving && styles.saveButtonDisabled,
                ]}
                disabled={isSaving}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveButtonText}>
                  {isSaving ? 'Menyimpan...' : 'Simpan'}
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
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
    marginBottom: 12,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
    textAlign: 'center',
  },
  email: {
    fontSize: 14,
    color: '#dbeafe',
    textAlign: 'center',
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
  cardContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  infoRow: {
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editRow: {
    paddingVertical: 8,
    marginBottom: 8,
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
  editButtonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  editButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#e5e7eb',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
  },
  saveButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
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
