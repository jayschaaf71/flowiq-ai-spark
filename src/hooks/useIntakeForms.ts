
import { useIntakeQueries } from './intake/useIntakeQueries';
import { useIntakeMutations } from './intake/useIntakeMutations';
import { useIntakeAnalytics } from './intake/useIntakeAnalytics';
import { useIntakeDataTransform } from './intake/useIntakeDataTransform';

export type { IntakeForm, IntakeSubmission } from '@/types/intake';

export const useIntakeForms = () => {
  const { fetchedForms, fetchedSubmissions, formsLoading, submissionsLoading } = useIntakeQueries();
  const { forms, submissions, loading } = useIntakeDataTransform(
    fetchedForms,
    fetchedSubmissions,
    formsLoading,
    submissionsLoading
  );
  const mutations = useIntakeMutations();
  const { trackFormEvent } = useIntakeAnalytics();

  return {
    forms,
    submissions,
    loading,
    ...mutations,
    trackFormEvent,
  };
};
