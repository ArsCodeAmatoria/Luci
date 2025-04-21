import React, { useState } from 'react';
import { View, Text, Switch, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingsScreen = () => {
  // Settings state
  const [callScreening, setCallScreening] = useState(true);
  const [autoSpamBlock, setAutoSpamBlock] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [darkTheme, setDarkTheme] = useState(true);

  // Mock voices
  const voiceOptions = [
    { id: 'v1', name: 'Rachel (Default)', gender: 'Female' },
    { id: 'v2', name: 'Michael', gender: 'Male' },
    { id: 'v3', name: 'Sophia', gender: 'Female' },
    { id: 'v4', name: 'James', gender: 'Male' },
  ];
  
  const [selectedVoice, setSelectedVoice] = useState(voiceOptions[0]);

  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // Handle logout logic here
            console.log('User logged out');
          },
        },
      ]
    );
  };

  // Settings section component
  const SettingsSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View className="mb-8">
      <Text className="text-text-primary font-bold text-lg mb-2">{title}</Text>
      <View className="bg-background-card rounded-xl overflow-hidden">
        {children}
      </View>
    </View>
  );

  // Toggle settings item component
  const ToggleItem = ({ 
    title, 
    description, 
    value, 
    onValueChange 
  }: { 
    title: string; 
    description?: string; 
    value: boolean; 
    onValueChange: (value: boolean) => void;
  }) => (
    <View className="flex-row justify-between items-center p-4 border-b border-background-lighter">
      <View className="flex-1 mr-4">
        <Text className="text-text-primary font-medium">{title}</Text>
        {description && (
          <Text className="text-text-secondary text-sm mt-1">{description}</Text>
        )}
      </View>
      <Switch
        trackColor={{ false: '#3e3e3e', true: '#FF6B82' }}
        thumbColor={value ? '#ffffff' : '#f4f3f4'}
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background-DEFAULT">
      <ScrollView className="flex-1 p-4">
        {/* Call Screening Settings */}
        <SettingsSection title="Call Screening">
          <ToggleItem
            title="Enable Call Screening"
            description="Let Luci answer and screen your calls"
            value={callScreening}
            onValueChange={setCallScreening}
          />
          <ToggleItem
            title="Auto-block Spam"
            description="Automatically block calls identified as spam"
            value={autoSpamBlock}
            onValueChange={setAutoSpamBlock}
          />
        </SettingsSection>

        {/* Voice Settings */}
        <SettingsSection title="Voice Settings">
          <View className="p-4 border-b border-background-lighter">
            <Text className="text-text-primary font-medium mb-2">Assistant Voice</Text>
            {voiceOptions.map((voice) => (
              <TouchableOpacity
                key={voice.id}
                className={`flex-row items-center p-3 my-1 rounded-lg ${
                  selectedVoice.id === voice.id ? 'bg-primary-dark' : 'bg-background-lighter'
                }`}
                onPress={() => setSelectedVoice(voice)}
              >
                <View className="flex-1">
                  <Text className="text-text-primary">{voice.name}</Text>
                  <Text className="text-text-secondary text-xs">{voice.gender}</Text>
                </View>
                {selectedVoice.id === voice.id && (
                  <Text className="text-text-primary">✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </SettingsSection>

        {/* Notification Settings */}
        <SettingsSection title="Notifications">
          <ToggleItem
            title="Enable Notifications"
            description="Get notified about missed calls and callbacks"
            value={notifications}
            onValueChange={setNotifications}
          />
        </SettingsSection>

        {/* Appearance Settings */}
        <SettingsSection title="Appearance">
          <ToggleItem
            title="Dark Theme"
            value={darkTheme}
            onValueChange={setDarkTheme}
          />
        </SettingsSection>

        {/* Account */}
        <SettingsSection title="Account">
          <TouchableOpacity
            className="p-4 border-b border-background-lighter"
            onPress={() => Alert.alert('Feature not available', 'This feature is coming soon')}
          >
            <Text className="text-text-primary">Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="p-4"
            onPress={handleLogout}
          >
            <Text className="text-primary">Logout</Text>
          </TouchableOpacity>
        </SettingsSection>

        <Text className="text-text-muted text-center mt-4 mb-8">
          Luci v0.1.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen; 