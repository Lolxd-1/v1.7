import { useState, useEffect } from 'react';
import { FormData } from '../types/questionnaire';
import { saveResponse } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useQuestionnaireForm() {
  const [formData, setFormData] = useState<FormData>({});
  const { user } = useAuth();

  const updateFormData = async (sectionId: string, questionId: string, value: any) => {
    if (!user?.id) return;

    try {
      await saveResponse(user.id, sectionId, questionId, value);
      
      const newFormData = {
        ...formData,
        [questionId]: value,
      };
      setFormData(newFormData);
    } catch (error) {
      console.error('Failed to save response:', error);
    }
  };

  return {
    formData,
    updateFormData,
  };
}