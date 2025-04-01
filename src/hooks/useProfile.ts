import { useState, useEffect } from 'react';
import { useChat } from './useChat';
import { supabase, saveChatMessage, saveGoal, updateGoalStatus, deleteGoal, fetchChatHistory, fetchGoals } from '../lib/supabase';
import { useAuth } from './useAuth';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface Goal {
  id: string;
  text: string;
  completed: boolean;
}

const welcomeMessages: Record<string, string> = {
  dashboard: "Welcome to your Business Dashboard! Here's an overview of your business health.",
  finance: "Hi! I'm your financial advisor. How can I help you analyze your business finances today?",
  sales: "Hello! I'm your sales consultant. Ready to boost your revenue and optimize your sales strategy?",
  hr: "Hi there! I'm your HR specialist. Need help with staffing, management, or workplace optimization?",
  business: "Hey! I'm your business consultant. Let's work on improving your overall business performance.",
  strategy: "Hello! I'm your strategy expert. Ready to develop effective plans for your business growth?",
  report: "Welcome to your business report! How can I help you understand your analysis better?"
};

export function useProfile() {
  const [activeProfile, setActiveProfile] = useState('dashboard');
  const [chatHistory, setChatHistory] = useState<Record<string, Message[]>>({});
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const { sendMessage: sendChatMessage } = useChat();

  useEffect(() => {
    const initializeData = async () => {
      if (!user?.id) return;

      try {
        const history = await fetchChatHistory(user.id);
        const formattedHistory: Record<string, Message[]> = {};
        
        Object.keys(welcomeMessages).forEach(profile => {
          formattedHistory[profile] = [{
            id: `welcome-${profile}`,
            role: 'assistant',
            content: welcomeMessages[profile],
            timestamp: Date.now() - 1000
          }];
        });

        history.forEach(msg => {
          if (formattedHistory[msg.profile]) {
            formattedHistory[msg.profile].push({
              id: msg.id,
              role: msg.role,
              content: msg.content,
              timestamp: new Date(msg.created_at).getTime()
            });
          }
        });

        Object.keys(formattedHistory).forEach(profile => {
          formattedHistory[profile].sort((a, b) => a.timestamp - b.timestamp);
        });

        setChatHistory(formattedHistory);

        const goalsList = await fetchGoals(user.id);
        setGoals(goalsList.map(g => ({
          id: g.id,
          text: g.text,
          completed: g.completed
        })));
      } catch (error) {
        console.error('Failed to initialize data:', error);
      }
    };

    initializeData();
  }, [user?.id]);

  const sendMessage = async (profile: string, content: string) => {
    if (!user?.id) return;
    setIsLoading(true);

    try {
      const userMessage = {
        id: `temp-${Date.now()}`,
        role: 'user' as const,
        content,
        timestamp: Date.now()
      };

      setChatHistory(prev => ({
        ...prev,
        [profile]: [...(prev[profile] || []), userMessage]
      }));

      await saveChatMessage(user.id, profile, 'user', content);

      const response = await sendChatMessage(profile, content);
      
      await saveChatMessage(user.id, profile, 'assistant', response.content);

      const aiMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant' as const,
        content: response.content,
        timestamp: Date.now()
      };

      setChatHistory(prev => ({
        ...prev,
        [profile]: [...(prev[profile] || []), aiMessage]
      }));
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addGoal = async (text: string) => {
    if (!user?.id) return;
    try {
      await saveGoal(user.id, text);
      const updatedGoals = await fetchGoals(user.id);
      setGoals(updatedGoals.map(g => ({
        id: g.id,
        text: g.text,
        completed: g.completed
      })));
    } catch (error) {
      console.error('Failed to add goal:', error);
    }
  };

  const removeGoal = async (id: string) => {
    try {
      await deleteGoal(id);
      setGoals(prev => prev.filter(goal => goal.id !== id));
    } catch (error) {
      console.error('Failed to remove goal:', error);
    }
  };

  const toggleGoal = async (id: string) => {
    try {
      const goal = goals.find(g => g.id === id);
      if (goal) {
        await updateGoalStatus(id, !goal.completed);
        setGoals(prev => prev.map(g => 
          g.id === id ? { ...g, completed: !g.completed } : g
        ));
      }
    } catch (error) {
      console.error('Failed to toggle goal:', error);
    }
  };

  return {
    activeProfile,
    setActiveProfile,
    chatHistory,
    sendMessage,
    goals,
    addGoal,
    removeGoal,
    toggleGoal,
    isLoading
  };
}