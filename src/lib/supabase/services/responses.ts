import { supabase } from '../client';
import { handleSupabaseOperation } from '../operations';

export async function saveResponse(
  userId: string,
  sectionId: string,
  questionId: string,
  answer: any
): Promise<void> {
  const storageKey = `response_${userId}_${sectionId}_${questionId}`;

  await handleSupabaseOperation(
    async () => {
      await supabase
        .from('responses')
        .delete()
        .match({
          user_id: userId,
          section_id: sectionId,
          question_id: questionId
        });

      await supabase
        .from('responses')
        .insert({
          user_id: userId,
          section_id: sectionId,
          question_id: questionId,
          answer: JSON.stringify(answer)
        });
    },
    undefined,
    storageKey
  );
}