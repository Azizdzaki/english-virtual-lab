import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { RootNavigator } from './src/navigation';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar />
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
