import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import CallCard from '../components/CallCard';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // Mock data for recent calls
  const recentCalls = [
    { id: '1', callerNumber: '+15551234567', callerName: 'John Doe', timestamp: new Date().toISOString(), isSpam: false },
    { id: '2', callerNumber: '+15559876543', callerName: 'Unknown Caller', timestamp: new Date(Date.now() - 3600000).toISOString(), isSpam: true },
    { id: '3', callerNumber: '+15552223333', callerName: 'Jane Smith', timestamp: new Date(Date.now() - 86400000).toISOString(), isSpam: false },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background-DEFAULT">
      <ScrollView className="flex-1 px-4">
        {/* Status Card */}
        <View className="bg-background-card rounded-xl p-4 mt-4 shadow">
          <Text className="text-text-primary font-bold text-lg">Luci is active</Text>
          <Text className="text-text-secondary mt-1">Call screening is enabled</Text>
          <View className="flex-row justify-between mt-4">
            <TouchableOpacity 
              className="bg-primary px-4 py-2 rounded-lg"
              onPress={() => navigation.navigate('Settings')}
            >
              <Text className="text-text-primary font-semibold">Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="bg-secondary px-4 py-2 rounded-lg"
              onPress={() => navigation.navigate('History')}
            >
              <Text className="text-text-primary font-semibold">History</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Calls */}
        <Text className="text-text-primary font-bold text-xl mt-8 mb-2">Recent Calls</Text>
        {recentCalls.map((call) => (
          <CallCard 
            key={call.id}
            callId={call.id}
            callerName={call.callerName}
            callerNumber={call.callerNumber}
            timestamp={call.timestamp}
            isSpam={call.isSpam}
            onPress={() => navigation.navigate('Call', { 
              callId: call.id,
              callerNumber: call.callerNumber,
              callerName: call.callerName
            })}
          />
        ))}

        {/* Test Call Button */}
        <TouchableOpacity 
          className="bg-primary my-6 py-3 rounded-lg"
          onPress={() => navigation.navigate('Call', { 
            callerNumber: '+15551234567',
            callerName: 'Test Call'
          })}
        >
          <Text className="text-text-primary font-bold text-center">Simulate Incoming Call</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen; 