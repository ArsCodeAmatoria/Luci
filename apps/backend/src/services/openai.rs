use anyhow::Result;
use async_openai::{
    types::{
        ChatCompletionRequestMessage, ChatCompletionRequestMessageArgs,
        CreateChatCompletionRequestArgs, Role,
    },
    Client,
};
use std::env;

use crate::models::{ActionRecommendation, IntentAnalysisResponse};

pub async fn analyze_intent(transcript: &str) -> Result<IntentAnalysisResponse> {
    let client = Client::new();

    let messages = vec![
        ChatCompletionRequestMessageArgs::default()
            .role(Role::System)
            .content(
                "You are an AI assistant that analyzes call transcripts to detect intent, \
                spam likelihood, and recommend actions. Format your response as JSON with the \
                following fields: intent, confidence, spam_likelihood, sentiment, suggested_response, \
                and action_recommendation (one of: Forward, TakeMessage, BlockCaller, OfferCallback).",
            )
            .build()?,
        ChatCompletionRequestMessageArgs::default()
            .role(Role::User)
            .content(format!(
                "Analyze the following call transcript and provide the analysis in JSON format: \
                 \"{}\"",
                transcript
            ))
            .build()?,
    ];

    let request = CreateChatCompletionRequestArgs::default()
        .model("gpt-4o")
        .messages(messages)
        .temperature(0.0)
        .build()?;

    let response = client.chat().create(request).await?;
    let content = response.choices[0].message.content.clone().unwrap_or_default();

    // Extract the JSON from the response
    let json_str = content
        .trim()
        .trim_start_matches("```json")
        .trim_end_matches("```")
        .trim();

    // Parse the JSON into our response type
    let mut analysis: IntentAnalysisResponse = serde_json::from_str(json_str)?;

    // Ensure the spam_likelihood is between 0 and 1
    analysis.spam_likelihood = analysis.spam_likelihood.clamp(0.0, 1.0);

    Ok(analysis)
}

pub async fn generate_response(prompt: &str) -> Result<String> {
    let client = Client::new();

    let messages = vec![
        ChatCompletionRequestMessageArgs::default()
            .role(Role::System)
            .content(
                "You are an AI voice assistant for call screening. Respond in a natural, \
                 conversational way. Keep responses brief (1-2 sentences), clear, and professional.",
            )
            .build()?,
        ChatCompletionRequestMessageArgs::default()
            .role(Role::User)
            .content(prompt.to_string())
            .build()?,
    ];

    let request = CreateChatCompletionRequestArgs::default()
        .model("gpt-4o")
        .messages(messages)
        .temperature(0.7)
        .max_tokens(100)
        .build()?;

    let response = client.chat().create(request).await?;
    let content = response.choices[0].message.content.clone().unwrap_or_default();

    Ok(content)
} 