export type AgentProfile = 'finance' | 'sales' | 'hr' | 'business' | 'strategy';

export interface ChatResponse {
  role: 'assistant';
  content: string;
}

export interface AgentInstructions {
  role: string;
  focusAreas: string[];
  additionalContext?: string;
}