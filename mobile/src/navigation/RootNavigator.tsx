import React from 'react';
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
  ProfileScreen,
  SplashScreen,
} from '../screens';
import { Loading } from '../components';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = {
  headerShown: false,
};

// Auth Stack
const AuthStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="AuthScreen" component={AuthScreen} />
  </Stack.Navigator>
);

// Dashboard Stack
const DashboardStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
  </Stack.Navigator>
);

// Articles Stack
const ArticlesStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="ArticlesList" component={ArticlesScreen} />
  </Stack.Navigator>
);

// Videos Stack
const VideosStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="VideosList" component={VideosScreen} />
  </Stack.Navigator>
);

// Quiz Stack
const QuizStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="QuizList" component={QuizScreen} />
  </Stack.Navigator>
);

// Profile Stack
const ProfileStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
  </Stack.Navigator>
);

// Main App Stack (with bottom tabs)
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
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🏠</Text>,
      }}
    />
    <Tab.Screen
      name="ArticlesStack"
      component={ArticlesStack}
      options={{
        tabBarLabel: 'Artikel',
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📄</Text>,
      }}
    />
    <Tab.Screen
      name="VideosStack"
      component={VideosStack}
      options={{
        tabBarLabel: 'Video',
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🎬</Text>,
      }}
    />
    <Tab.Screen
      name="QuizStack"
      component={QuizStack}
      options={{
        tabBarLabel: 'Kuis',
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>❓</Text>,
      }}
    />
    <Tab.Screen
      name="ProfileStack"
      component={ProfileStack}
      options={{
        tabBarLabel: 'Profil',
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>👤</Text>,
      }}
    />
  </Tab.Navigator>
);

// Root Navigator
const RootNavigator = () => {
  const { isSignedIn, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        {isSignedIn ? (
          <Stack.Screen name="App" component={AppStack} />
        ) : (
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Auth" component={AuthStack} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
