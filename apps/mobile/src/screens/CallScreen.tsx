import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import Tts from 'react-native-tts';
import Voice from 'react-native-voice';

type CallScreenRouteProp = RouteProp<RootStackParamList, 'Call'>;
type CallScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Call'>;

const CallScreen = () => {
  const route = useRoute<CallScreenRouteProp>();
  const navigation = useNavigation<CallScreenNavigationProp>();
  const { callerNumber, callerName, callId } = route.params;

  // Call state
  const [callState, setCallState] = useState<'connecting' | 'screening' | 'speaking' | 'options'>('connecting');
  const [transcript, setTranscript] = useState<string>('');
  const [spamScore, setSpamScore] = useState<number | null>(null);
  const [intent, setIntent] = useState<string | null>(null);

  // Initialize TTS and Voice
  useEffect(() => {
    // TTS setup
    Tts.setDefaultLanguage('en-US');
    Tts.setDefaultRate(0.5);
    Tts.setDefaultPitch(1.0);

    // Voice setup
    Voice.onSpeechStart = () => console.log('Speech started');
    Voice.onSpeechEnd = () => console.log('Speech ended');
    Voice.onSpeechResults = (e: any) => {
      if (e.value && e.value.length > 0) {
        setTranscript(prev => prev + ' ' + e.value[0]);
      }
    };
    Voice.onSpeechError = (e: any) => console.error('Speech error:', e);

    return () => {
      // Clean up
      Tts.stop();
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  // Simulate call flow
  useEffect(() => {
    // Simulate connecting
    setTimeout(() => {
      setCallState('screening');
      handleCallScreening();
    }, 2000);
  }, []);

  const handleCallScreening = async () => {
    // Luci introduces itself
    await speakText("Hello, this is Luci, an AI assistant for " + (callerName || "Unknown") + ". May I ask who's calling and the purpose of your call?");
    
    // Simulate listening for response
    setTimeout(() => {
      // Simulate a transcript
      setTranscript("Hi, this is Sarah from marketing. I wanted to discuss a potential collaboration opportunity.");
      
      // Analyze intent after getting transcript
      analyzeIntent();
    }, 5000);
  };

  const analyzeIntent = () => {
    // Simulate intent analysis
    setTimeout(() => {
      setIntent('Business inquiry');
      setSpamScore(0.05); // Low spam score
      setCallState('options');
    }, 3000);
  };

  const speakText = async (text: string) => {
    return new Promise<void>((resolve) => {
      Tts.speak(text);
      // Use a timeout instead of event listener for simplicity
      setTimeout(() => {
        resolve();
      }, text.length * 50); // Rough estimate of speech duration
    });
  };

  const handleAcceptCall = () => {
    speakText("Connecting you now.").then(() => {
      // Simulate connecting call
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    });
  };

  const handleDeclineCall = () => {
    speakText("I'm sorry, they're not available right now. Can I take a message?").then(() => {
      // Simulate taking message
      setTimeout(() => {
        navigation.goBack();
      }, 3000);
    });
  };

  const handleScheduleCallback = () => {
    speakText("I'll let them know you called and schedule a callback.").then(() => {
      // Simulate scheduling
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background-DEFAULT">
      <View className="flex-1 p-4">
        {/* Caller info */}
        <View className="items-center my-8">
          <View className="w-20 h-20 rounded-full bg-background-card items-center justify-center mb-4">
            <Text className="text-text-primary text-3xl">
              {(callerName?.[0] || 'U').toUpperCase()}
            </Text>
          </View>
          <Text className="text-text-primary text-xl font-bold">
            {callerName || 'Unknown Caller'}
          </Text>
          <Text className="text-text-secondary">{callerNumber}</Text>
        </View>

        {/* Call state */}
        <View className="bg-background-card p-4 rounded-xl mb-4">
          <Text className="text-text-primary font-bold mb-2">Status:</Text>
          <View className="flex-row items-center">
            {callState === 'connecting' && (
              <>
                <ActivityIndicator color="#FF6B82" />
                <Text className="text-text-secondary ml-2">Connecting...</Text>
              </>
            )}
            {callState === 'screening' && (
              <>
                <ActivityIndicator color="#FF6B82" />
                <Text className="text-text-secondary ml-2">Luci is screening the call...</Text>
              </>
            )}
            {callState === 'speaking' && (
              <Text className="text-text-secondary">Caller is speaking...</Text>
            )}
            {callState === 'options' && (
              <Text className="text-text-primary font-semibold">Ready to decide</Text>
            )}
          </View>
        </View>

        {/* Transcript */}
        {transcript && (
          <View className="bg-background-card p-4 rounded-xl mb-4">
            <Text className="text-text-primary font-bold mb-2">Transcript:</Text>
            <Text className="text-text-secondary">{transcript}</Text>
          </View>
        )}

        {/* Analysis */}
        {intent && (
          <View className="bg-background-card p-4 rounded-xl mb-4">
            <Text className="text-text-primary font-bold mb-2">Analysis:</Text>
            <View className="flex-row justify-between mb-2">
              <Text className="text-text-secondary">Intent:</Text>
              <Text className="text-text-primary">{intent}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-text-secondary">Spam Likelihood:</Text>
              <Text className={`${spamScore && spamScore > 0.5 ? 'text-primary' : 'text-text-primary'}`}>
                {spamScore !== null ? `${Math.round(spamScore * 100)}%` : 'Analyzing...'}
              </Text>
            </View>
          </View>
        )}

        {/* Action buttons */}
        <View className="mt-auto">
          {callState === 'options' && (
            <>
              <TouchableOpacity
                className="bg-secondary py-3 rounded-xl mb-3"
                onPress={handleAcceptCall}
              >
                <Text className="text-text-primary font-bold text-center">Accept Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-primary py-3 rounded-xl mb-3"
                onPress={handleDeclineCall}
              >
                <Text className="text-text-primary font-bold text-center">Decline & Take Message</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-background-card py-3 rounded-xl"
                onPress={handleScheduleCallback}
              >
                <Text className="text-text-primary font-bold text-center">Schedule Callback</Text>
              </TouchableOpacity>
            </>
          )}
          {callState !== 'options' && (
            <TouchableOpacity
              className="bg-primary py-3 rounded-xl"
              onPress={() => navigation.goBack()}
            >
              <Text className="text-text-primary font-bold text-center">End Call</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CallScreen; 