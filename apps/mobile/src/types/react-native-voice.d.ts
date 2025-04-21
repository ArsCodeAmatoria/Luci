declare module 'react-native-voice' {
  export interface SpeechResultsEvent {
    value?: string[];
  }

  export interface SpeechErrorEvent {
    error?: { message: string };
  }

  export type Events = 'onSpeechStart' | 'onSpeechEnd' | 'onSpeechResults' | 'onSpeechError';

  export default {
    onSpeechStart: ((e: any) => void) | null;
    onSpeechEnd: ((e: any) => void) | null;
    onSpeechResults: ((e: SpeechResultsEvent) => void) | null;
    onSpeechError: ((e: SpeechErrorEvent) => void) | null;
    
    start: (locale?: string) => Promise<void>;
    stop: () => Promise<void>;
    cancel: () => Promise<void>;
    destroy: () => Promise<void>;
    removeAllListeners: () => void;
    isAvailable: () => Promise<boolean>;
    isRecognizing: () => Promise<boolean>;
    addListener: (eventName: Events, callback: (e: any) => void) => void;
    removeListener: (eventName: Events, callback: (e: any) => void) => void;
  };
} 