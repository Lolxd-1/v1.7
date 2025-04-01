import { useState, useCallback } from 'react';
import { getReport } from '../lib/report';
import { getOrCreateSession } from '../lib/supabase';
import { API_URL, API_KEYS } from '../lib/chat/config';
import { formatBusinessContext } from '../lib/chat/formatters';
import { getAgentInstructions } from '../lib/chat/agents';
import type { ChatResponse, AgentProfile } from '../lib/chat/types';

export function useChat() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (profile: AgentProfile, message: string): Promise<ChatResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const sessionId = await getOrCreateSession();
      const report = await getReport(sessionId);

      const apiKey = API_KEYS[profile];
      const context = report ? formatBusinessContext(report) : 'No business report available yet.';
      const promptText = getAgentInstructions(profile, context);

      const response = await fetch(`${API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${promptText}\n\nUser Message: ${message}\n\nProvide a natural, contextually appropriate response that matches the user's tone and level of detail needed:`
            }]
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to get response from AI');
      }

      const data = await response.json();
      
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response format from AI');
      }

      const content = data.candidates[0].content.parts[0].text;

      return {
        role: 'assistant',
        content
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    sendMessage,
    isLoading,
    error
  };
}