import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginScreen = () => {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle login
  const handleLogin = () => {
    // Validate form
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Reset error and set loading
    setError(null);
    setIsLoading(true);

    // Simulate login request
    setTimeout(() => {
      setIsLoading(false);
      // Successful login would navigate to Home screen
      // This is handled in App.tsx via the isAuthenticated state
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-background-DEFAULT">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 p-8 justify-center">
          {/* Logo */}
          <View className="items-center mb-12">
            <View className="w-24 h-24 bg-background-card rounded-full items-center justify-center mb-4">
              <Text className="text-primary text-4xl font-bold">L</Text>
            </View>
            <Text className="text-text-primary text-3xl font-bold">Luci</Text>
            <Text className="text-text-secondary mt-2">AI Call Assistant</Text>
          </View>

          {/* Error message */}
          {error && (
            <View className="bg-primary bg-opacity-20 p-3 rounded-lg mb-4">
              <Text className="text-primary text-center">{error}</Text>
            </View>
          )}

          {/* Login form */}
          <View className="mb-6">
            <Text className="text-text-secondary mb-2">Email</Text>
            <TextInput
              className="bg-background-card text-text-primary rounded-lg p-4 mb-4"
              placeholder="Enter your email"
              placeholderTextColor="#7A7A7A"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Text className="text-text-secondary mb-2">Password</Text>
            <TextInput
              className="bg-background-card text-text-primary rounded-lg p-4"
              placeholder="Enter your password"
              placeholderTextColor="#7A7A7A"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Forgot password link */}
          <TouchableOpacity className="mb-8">
            <Text className="text-secondary text-right">Forgot password?</Text>
          </TouchableOpacity>

          {/* Login button */}
          <TouchableOpacity
            className={`py-4 rounded-lg ${isLoading ? 'bg-background-lighter' : 'bg-primary'}`}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-text-primary font-bold text-center">Login</Text>
            )}
          </TouchableOpacity>

          {/* Sign up link */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-text-secondary">Don't have an account? </Text>
            <TouchableOpacity>
              <Text className="text-secondary">Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen; 