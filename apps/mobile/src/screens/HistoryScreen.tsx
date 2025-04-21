import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import CallCard from '../components/CallCard';

type HistoryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'History'>;

// Mock data type
interface CallHistoryItem {
  id: string;
  callerNumber: string;
  callerName?: string;
  timestamp: string;
  duration?: number;
  isSpam: boolean;
  status: 'completed' | 'missed' | 'blocked';
}

const HistoryScreen = () => {
  const navigation = useNavigation<HistoryScreenNavigationProp>();

  // Mock data for call history
  const [callHistory] = useState<CallHistoryItem[]>([
    {
      id: '1',
      callerNumber: '+15551234567',
      callerName: 'John Doe',
      timestamp: new Date().toISOString(),
      duration: 125,
      isSpam: false,
      status: 'completed',
    },
    {
      id: '2',
      callerNumber: '+15559876543',
      callerName: 'Unknown Caller',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      isSpam: true,
      status: 'blocked',
    },
    {
      id: '3',
      callerNumber: '+15552223333',
      callerName: 'Jane Smith',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      isSpam: false,
      status: 'missed',
    },
    {
      id: '4',
      callerNumber: '+15551112222',
      callerName: 'Bob Johnson',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      duration: 45,
      isSpam: false,
      status: 'completed',
    },
    {
      id: '5',
      callerNumber: '+15553334444',
      timestamp: new Date(Date.now() - 259200000).toISOString(),
      isSpam: true,
      status: 'blocked',
    },
  ]);

  // Group calls by date
  const groupedCalls = callHistory.reduce<Record<string, CallHistoryItem[]>>((acc, call) => {
    const date = format(new Date(call.timestamp), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(call);
    return acc;
  }, {});

  // Convert to array for FlatList
  const sections = Object.entries(groupedCalls).map(([date, calls]) => ({
    date,
    calls,
    formattedDate: format(new Date(date), 'EEEE, MMMM d'),
  }));

  const renderCallItem = ({ item }: { item: CallHistoryItem }) => (
    <CallCard
      callId={item.id}
      callerNumber={item.callerNumber}
      callerName={item.callerName}
      timestamp={item.timestamp}
      isSpam={item.isSpam}
      onPress={() => {
        navigation.navigate('Call', {
          callId: item.id,
          callerNumber: item.callerNumber,
          callerName: item.callerName,
        });
      }}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-background-DEFAULT">
      <FlatList
        data={sections}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <View className="mb-6">
            <Text className="text-text-secondary font-medium px-4 mb-2">
              {item.formattedDate}
            </Text>
            {item.calls.map((call) => renderCallItem({ item: call }))}
          </View>
        )}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-10">
            <Text className="text-text-secondary text-center">No call history available.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default HistoryScreen; 