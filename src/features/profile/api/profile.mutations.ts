import { useMutation } from '@tanstack/react-query';

import { createBugReport } from './profile.client';
import { CreateBugReportDto } from './profile.types';

export function useCreateBugReportMutation() {
  return useMutation({
    mutationFn: (dto: CreateBugReportDto) => createBugReport(dto),
  });
}
