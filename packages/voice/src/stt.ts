import axios from 'axios';
import FormData from 'form-data';

/**
 * Supported STT providers
 */
export enum Provider {
  WHISPER = 'whisper',
  GOOGLE = 'google',
}

/**
 * STT configuration options
 */
export interface STTConfig {
  provider: Provider;
  apiKey?: string;
  language?: string;
  model?: string;
}

/**
 * Transcription result
 */
export interface TranscriptionResult {
  text: string;
  confidence?: number;
  language?: string;
}

/**
 * Default configuration
 */
const defaultConfig: STTConfig = {
  provider: Provider.WHISPER,
  language: 'en',
  model: 'whisper-1',
};

/**
 * Convert speech audio to text
 */
export async function transcribe(
  audioData: ArrayBuffer | Blob,
  config: Partial<STTConfig> = {}
): Promise<TranscriptionResult> {
  // Merge default config with provided config
  const fullConfig: STTConfig = { ...defaultConfig, ...config };

  switch (fullConfig.provider) {
    case Provider.WHISPER:
      return transcribeWithWhisper(audioData, fullConfig);
    case Provider.GOOGLE:
      throw new Error('Google STT not implemented yet');
    default:
      throw new Error(`Unsupported STT provider: ${fullConfig.provider}`);
  }
}

/**
 * Transcribe audio using OpenAI's Whisper API
 */
async function transcribeWithWhisper(
  audioData: ArrayBuffer | Blob,
  config: STTConfig
): Promise<TranscriptionResult> {
  if (!config.apiKey) {
    throw new Error('OpenAI API key is required for Whisper');
  }

  const formData = new FormData();
  formData.append('model', config.model || defaultConfig.model);
  
  // Handle different audio input formats
  if (audioData instanceof Blob) {
    formData.append('file', audioData, 'audio.wav');
  } else {
    const blob = new Blob([audioData], { type: 'audio/wav' });
    formData.append('file', blob, 'audio.wav');
  }
  
  // Add optional language parameter
  if (config.language) {
    formData.append('language', config.language);
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          ...formData.getHeaders(),
        },
      }
    );

    return {
      text: response.data.text,
      // Whisper doesn't provide confidence scores directly
      confidence: 0.9,
      language: config.language,
    };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Whisper API error: ${error.response?.status} ${error.response?.statusText}`);
    }
    throw error;
  }
} 