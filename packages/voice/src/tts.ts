import axios from 'axios';

/**
 * Supported voice providers
 */
export enum Provider {
  ELEVEN_LABS = 'elevenlabs',
  AWS_POLLY = 'aws_polly',
}

/**
 * Voice configuration options
 */
export interface VoiceConfig {
  provider: Provider;
  voiceId?: string;
  apiKey?: string;
  stability?: number;
  similarityBoost?: number;
}

/**
 * Default configuration
 */
const defaultConfig: VoiceConfig = {
  provider: Provider.ELEVEN_LABS,
  voiceId: 'EXAVITQu4vr4xnSDxMaL', // Rachel voice
  stability: 0.5,
  similarityBoost: 0.5,
};

/**
 * Generate text-to-speech audio
 */
export async function generateSpeech(
  text: string,
  config: Partial<VoiceConfig> = {}
): Promise<ArrayBuffer> {
  // Merge default config with provided config
  const fullConfig: VoiceConfig = { ...defaultConfig, ...config };

  switch (fullConfig.provider) {
    case Provider.ELEVEN_LABS:
      return generateElevenLabsSpeech(text, fullConfig);
    case Provider.AWS_POLLY:
      throw new Error('AWS Polly not implemented yet');
    default:
      throw new Error(`Unsupported TTS provider: ${fullConfig.provider}`);
  }
}

/**
 * Generate speech using ElevenLabs API
 */
async function generateElevenLabsSpeech(
  text: string,
  config: VoiceConfig
): Promise<ArrayBuffer> {
  if (!config.apiKey) {
    throw new Error('ElevenLabs API key is required');
  }

  const voiceId = config.voiceId || defaultConfig.voiceId;
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

  try {
    const response = await axios.post(
      url,
      {
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: config.stability || defaultConfig.stability,
          similarity_boost: config.similarityBoost || defaultConfig.similarityBoost,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': config.apiKey,
        },
        responseType: 'arraybuffer',
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`ElevenLabs API error: ${error.response?.status} ${error.response?.statusText}`);
    }
    throw error;
  }
} 