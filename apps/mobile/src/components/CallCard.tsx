import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { formatDistanceToNow } from 'date-fns';

interface CallCardProps {
  callId: string;
  callerName?: string;
  callerNumber: string;
  timestamp: string;
  isSpam: boolean;
  onPress: () => void;
}

const CallCard: React.FC<CallCardProps> = ({
  callId,
  callerName,
  callerNumber,
  timestamp,
  isSpam,
  onPress,
}) => {
  // Format the timestamp to a relative time
  const timeAgo = formatDistanceToNow(new Date(timestamp), { addSuffix: true });

  return (
    <TouchableOpacity 
      className="bg-background-card rounded-xl p-4 mb-3 shadow"
      onPress={onPress}
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-text-primary font-semibold text-lg">
            {callerName || 'Unknown'}
          </Text>
          <Text className="text-text-secondary">{callerNumber}</Text>
          <Text className="text-text-muted text-xs mt-1">{timeAgo}</Text>
        </View>
        {isSpam && (
          <View className="bg-primary-dark px-3 py-1 rounded-full">
            <Text className="text-text-primary text-xs font-semibold">Spam</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CallCard; 