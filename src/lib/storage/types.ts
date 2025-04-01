export interface UserData {
  id: string;
  userId: string;
  chatHistory: ChatMessage[];
  responses: QuestionResponse[];
  businessReports: BusinessReport[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  profile: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface QuestionResponse {
  id: string;
  sessionId: string;
  sectionId: string;
  questionId: string;
  answer: any;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessReport {
  id: string;
  sessionId: string;
  report: any;
  createdAt: string;
  updatedAt: string;
}