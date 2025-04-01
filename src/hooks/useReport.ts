import { useState, useEffect } from 'react';
import { BusinessReport, generateBusinessReport, getReport } from '../lib/report';
import { useAuth } from './useAuth';

export function useReport() {
  const [report, setReport] = useState<BusinessReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadReport = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        setError(null);

        let businessReport = await getReport(user.id);

        if (!businessReport) {
          businessReport = await generateBusinessReport(user.id);
        }

        setReport(businessReport);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load report');
      } finally {
        setIsLoading(false);
      }
    };

    loadReport();
  }, [user?.id]);

  const refreshReport = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      const businessReport = await generateBusinessReport(user.id);
      setReport(businessReport);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh report');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    report,
    isLoading,
    error,
    refreshReport
  };
}