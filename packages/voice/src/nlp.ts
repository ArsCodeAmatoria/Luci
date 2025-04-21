import axios from 'axios';

/**
 * Supported NLP providers
 */
export enum Provider {
  OPENAI = 'openai',
  HUGGINGFACE = 'huggingface',
}

/**
 * NLP configuration options
 */
export interface NLPConfig {
  provider: Provider;
  apiKey?: string;
  model?: string;
  temperature?: number;
}

/**
 * Intent analysis result
 */
export interface IntentAnalysisResult {
  intent: string;
  confidence: number;
  spamLikelihood: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  suggestedResponse?: string;
  actionRecommendation: ActionRecommendation;
}

/**
 * Action recommendation types
 */
export enum ActionRecommendation {
  FORWARD = 'forward',
  TAKE_MESSAGE = 'take_message',
  BLOCK_CALLER = 'block_caller',
  OFFER_CALLBACK = 'offer_callback',
}

/**
 * Default configuration
 */
const defaultConfig: NLPConfig = {
  provider: Provider.OPENAI,
  model: 'gpt-4o',
  temperature: 0.0,
};

/**
 * Analyze the intent of a transcript
 */
export async function analyzeIntent(
  transcript: string,
  config: Partial<NLPConfig> = {}
): Promise<IntentAnalysisResult> {
  // Merge default config with provided config
  const fullConfig: NLPConfig = { ...defaultConfig, ...config };

  switch (fullConfig.provider) {
    case Provider.OPENAI:
      return analyzeIntentWithOpenAI(transcript, fullConfig);
    case Provider.HUGGINGFACE:
      throw new Error('HuggingFace NLP not implemented yet');
    default:
      throw new Error(`Unsupported NLP provider: ${fullConfig.provider}`);
  }
}

/**
 * Analyze intent using OpenAI's GPT models
 */
async function analyzeIntentWithOpenAI(
  transcript: string,
  config: NLPConfig
): Promise<IntentAnalysisResult> {
  if (!config.apiKey) {
    throw new Error('OpenAI API key is required');
  }

  const prompt = `
    Analyze the following call transcript to detect intent, spam likelihood, and recommend actions.
    Format your response as a JSON object with the following fields:
    - intent: A short description of the caller's intent
    - confidence: A number between 0 and 1 indicating confidence in the intent detection
    - spamLikelihood: A number between 0 and 1 indicating how likely this is a spam call
    - sentiment: One of "positive", "neutral", or "negative"
    - suggestedResponse: A brief response suggestion for the recipient
    - actionRecommendation: One of "forward", "take_message", "block_caller", or "offer_callback"

    Transcript: "${transcript}"
  `;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: config.model || defaultConfig.model,
        messages: [
          {
            role: 'system',
            content:
              'You are an AI assistant that analyzes call transcripts to detect intent, spam likelihood, and recommend actions.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: config.temperature ?? defaultConfig.temperature,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey}`,
        },
      }
    );

    const content = response.data.choices[0].message.content;
    const jsonStart = content.indexOf('{');
    const jsonEnd = content.lastIndexOf('}') + 1;
    const jsonStr = content.substring(jsonStart, jsonEnd);

    // Parse the JSON and validate the response format
    const result = JSON.parse(jsonStr);
    
    // Ensure result has all required fields
    if (!result.intent || typeof result.confidence !== 'number' || 
        typeof result.spamLikelihood !== 'number' || !result.sentiment ||
        !result.actionRecommendation) {
      throw new Error('Invalid response format from OpenAI');
    }

    return {
      intent: result.intent,
      confidence: result.confidence,
      spamLikelihood: result.spamLikelihood,
      sentiment: result.sentiment as 'positive' | 'neutral' | 'negative',
      suggestedResponse: result.suggestedResponse,
      actionRecommendation: mapActionRecommendation(result.actionRecommendation),
    };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(`OpenAI API error: ${error.response?.status} ${error.response?.statusText}`);
    }
    throw error;
  }
}

/**
 * Map the action recommendation string to enum
 */
function mapActionRecommendation(action: string): ActionRecommendation {
  switch (action.toLowerCase()) {
    case 'forward':
      return ActionRecommendation.FORWARD;
    case 'take_message':
      return ActionRecommendation.TAKE_MESSAGE;
    case 'block_caller':
      return ActionRecommendation.BLOCK_CALLER;
    case 'offer_callback':
      return ActionRecommendation.OFFER_CALLBACK;
    default:
      return ActionRecommendation.TAKE_MESSAGE; // Default to take message
  }
}

/**
 * Generate a response based on a prompt
 */
export async function generateResponse(
  prompt: string,
  config: Partial<NLPConfig> = {}
): Promise<string> {
  // Merge default config with provided config
  const fullConfig: NLPConfig = { 
    ...defaultConfig, 
    ...config,
    // Increase temperature for more natural responses
    temperature: config.temperature ?? 0.7,
    model: config.model ?? 'gpt-4o',
  };

  if (!fullConfig.apiKey) {
    throw new Error('OpenAI API key is required');
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: fullConfig.model,
        messages: [
          {
            role: 'system',
            content: 
              'You are a helpful, friendly voice assistant for call screening. ' +
              'Keep responses brief (1-2 sentences), clear, and professional.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: fullConfig.temperature,
        max_tokens: 100,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${fullConfig.apiKey}`,
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(`OpenAI API error: ${error.response?.status} ${error.response?.statusText}`);
    }
    throw error;
  }
} 