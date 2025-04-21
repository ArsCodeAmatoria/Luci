import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import CallScreen from './src/screens/CallScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import LoginScreen from './src/screens/LoginScreen';

// Types
import { RootStackParamList } from './src/types/navigation';

// Create navigation stack
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  // Simulating authentication check
  const isAuthenticated = true;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName={isAuthenticated ? 'Home' : 'Login'}
          screenOptions={{
            headerStyle: {
              backgroundColor: '#121212',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            contentStyle: {
              backgroundColor: '#121212',
            },
          }}
        >
          {isAuthenticated ? (
            <>
              <Stack.Screen 
                name="Home" 
                component={HomeScreen} 
                options={{ title: 'Luci' }} 
              />
              <Stack.Screen 
                name="Call" 
                component={CallScreen} 
                options={{ title: 'Active Call' }} 
              />
              <Stack.Screen 
                name="History" 
                component={HistoryScreen} 
                options={{ title: 'Call History' }} 
              />
              <Stack.Screen 
                name="Settings" 
                component={SettingsScreen} 
                options={{ title: 'Settings' }} 
              />
            </>
          ) : (
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ headerShown: false }} 
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
