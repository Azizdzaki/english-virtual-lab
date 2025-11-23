import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Image 
        source={require('./assets/image.png')} 
        style={styles.image}
        resizeMode="contain"
        onError={(error) => console.log('Image error:', error)}
        onLoad={() => console.log('Image loaded successfully')}
      />
      <Text style={styles.tagline}>English Virtual Lab</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
  },
  tagline: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});