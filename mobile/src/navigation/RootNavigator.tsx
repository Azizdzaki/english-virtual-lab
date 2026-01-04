import React from 'react';
import { Text } from 'react-native'; // Tambahkan import Text
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';
import {
  AuthScreen,
  DashboardScreen,
  ArticlesScreen,
  VideosScreen,
  QuizScreen,
  QuizDetailScreen,
  ProfileScreen,
  SplashScreen,
} from '../screens';
import { Loading } from '../components';

// 1. Definisikan Tipe Parameter Navigasi (PENTING untuk TypeScript)
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  App: undefined;
};

export type AuthStackParamList = {
  AuthScreen: undefined;
};

export type AppTabParamList = {
  DashboardStack: undefined;
  ArticlesStack: undefined;
  VideosStack: undefined;
  QuizStack: undefined;
  ProfileStack: undefined;
};

// 2. Buat Navigator dengan Generic Type
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<AppTabParamList>();
const AuthStackNav = createNativeStackNavigator<AuthStackParamList>();

// Stack untuk setiap Tab (bisa dibuat generic juga jika perlu, tapi ini cukup untuk menghilangkan error basic)
const DashboardStackNav = createNativeStackNavigator();
const ArticlesStackNav = createNativeStackNavigator();
const VideosStackNav = createNativeStackNavigator();
const QuizStackNav = createNativeStackNavigator();
const ProfileStackNav = createNativeStackNavigator();

const screenOptions = {
  headerShown: false,
};

// --- STACK COMPONENTS ---

const AuthStack = () => (
  <AuthStackNav.Navigator screenOptions={screenOptions}>
    <AuthStackNav.Screen name="AuthScreen" component={AuthScreen} />
  </AuthStackNav.Navigator>
);

const DashboardStack = () => (
  <DashboardStackNav.Navigator screenOptions={screenOptions}>
    <DashboardStackNav.Screen name="Dashboard" component={DashboardScreen} />
  </DashboardStackNav.Navigator>
);

const ArticlesStack = () => (
  <ArticlesStackNav.Navigator screenOptions={screenOptions}>
    <ArticlesStackNav.Screen name="ArticlesList" component={ArticlesScreen} />
  </ArticlesStackNav.Navigator>
);

const VideosStack = () => (
  <VideosStackNav.Navigator screenOptions={screenOptions}>
    <VideosStackNav.Screen name="VideosList" component={VideosScreen} />
  </VideosStackNav.Navigator>
);

const QuizStack = () => (
  <QuizStackNav.Navigator screenOptions={screenOptions}>
    <QuizStackNav.Screen name="QuizList" component={QuizScreen} />
    <QuizStackNav.Screen name="QuizDetail" component={QuizDetailScreen} />
  </QuizStackNav.Navigator>
);

const ProfileStack = () => (
  <ProfileStackNav.Navigator screenOptions={screenOptions}>
    <ProfileStackNav.Screen name="ProfileScreen" component={ProfileScreen} />
  </ProfileStackNav.Navigator>
);

// --- MAIN APP TABS ---

const AppStack = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#3b82f6',
      tabBarInactiveTintColor: '#9ca3af',
      tabBarStyle: {
        backgroundColor: '#ffffff',
        borderTopColor: '#e5e7eb',
        borderTopWidth: 1,
        paddingBottom: 5,
        paddingTop: 5,
        height: 60,
      },
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '500',
      },
    }}
  >
    <Tab.Screen
      name="DashboardStack"
      component={DashboardStack}
      options={{
        tabBarLabel: 'Dashboard',
        // PERBAIKAN: Gunakan prop 'color' agar ikon berubah warna saat aktif
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>🏠</Text>,
      }}
    />
    <Tab.Screen
      name="ArticlesStack"
      component={ArticlesStack}
      options={{
        tabBarLabel: 'Artikel',
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>📄</Text>,
      }}
    />
    <Tab.Screen
      name="VideosStack"
      component={VideosStack}
      options={{
        tabBarLabel: 'Video',
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>🎬</Text>,
      }}
    />
    <Tab.Screen
      name="QuizStack"
      component={QuizStack}
      options={{
        tabBarLabel: 'Kuis',
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>❓</Text>,
      }}
    />
    <Tab.Screen
      name="ProfileStack"
      component={ProfileStack}
      options={{
        tabBarLabel: 'Profil',
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>👤</Text>,
      }}
    />
  </Tab.Navigator>
);

// --- ROOT NAVIGATOR ---

const RootNavigator = () => {
  const { isSignedIn, isLoading } = useAuth();

  if (isLoading) {
    return <Loading message="Memuat aplikasi..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        {isSignedIn ? (
          <Stack.Screen name="App" component={AppStack} />
        ) : (
          <Stack.Group screenOptions={screenOptions}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Auth" component={AuthStack} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;