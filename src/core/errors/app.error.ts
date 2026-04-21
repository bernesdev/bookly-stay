export class AppError extends Error {
  code: string;
  shouldReport: boolean;

  constructor(code: string, message: string, { shouldReport = false } = {}) {
    super(message);
    this.code = code;
    this.name = 'AppError';
    this.shouldReport = shouldReport;
  }
}
