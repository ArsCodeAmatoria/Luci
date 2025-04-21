import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  Call: { callId?: string; callerNumber: string; callerName?: string };
  History: undefined;
  Settings: undefined;
  Login: undefined;
}; 