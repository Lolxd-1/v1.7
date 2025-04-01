import { supabase } from '../supabase';
import { BusinessReport } from './types';

export async function getBusinessReports(sessionId: string): Promise<BusinessReport[]> {
  try {
    const { data, error } = await supabase
      .from('business_reports')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching business reports:', error);
    return [];
  }
}

export async function saveBusinessReport(
  report: Omit<BusinessReport, 'id' | 'createdAt' | 'updatedAt'>
): Promise<void> {
  try {
    const { error } = await supabase
      .from('business_reports')
      .insert([report]);

    if (error) throw error;
  } catch (error) {
    console.error('Error saving business report:', error);
    throw error;
  }
}