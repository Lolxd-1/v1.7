import { supabase } from '../client';
import { handleSupabaseOperation } from '../operations';
import type { BusinessReport } from '../../report';

export async function saveBusinessReport(
  userId: string,
  report: BusinessReport
): Promise<void> {
  const storageKey = `report_${userId}`;

  await handleSupabaseOperation(
    async () => {
      await supabase
        .from('business_reports')
        .upsert({
          user_id: userId,
          report: JSON.stringify(report),
          created_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
    },
    undefined,
    storageKey
  );
}