export interface CreateBugReportDto {
  whatWentWrong: string;
  expectedToHappen?: string;
  issueCategory?: string;
  happenedWhere?: string;
  issueFrequency?: string;
  userId?: string;
}
