import { API_KEYS, API_URL } from '../config/api';
import { generatePrompt } from './promptGenerator';
import { BusinessReport } from '../../../lib/report';

export async function fetchAnalysis(
  idea: string,
  perspective: string,
  businessReport?: BusinessReport,
  followUpQuestion?: string
) {
  const apiKey = API_KEYS[perspective as keyof typeof API_KEYS];
  
  try {
    const response = await fetch(
      `${API_URL}?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: generatePrompt(idea, perspective, followUpQuestion, businessReport)
            }]
          }]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error in fetchAnalysis:', error);
    throw error;
  }
}