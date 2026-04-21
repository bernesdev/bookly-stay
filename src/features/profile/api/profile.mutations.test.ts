import { useMutation } from '@tanstack/react-query';

import { createBugReport } from './profile.client';
import { useCreateBugReportMutation } from './profile.mutations';

const mockUseMutation = useMutation as unknown as jest.Mock;
const mockCreateBugReport = createBugReport as jest.Mock;

jest.mock('@tanstack/react-query', () => ({
  useMutation: jest.fn(),
}));

jest.mock('./profile.client', () => ({
  createBugReport: jest.fn(),
}));

describe('profile.mutations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should configure useMutation with createBugReport as mutationFn', async () => {
    const mutationReturn = { mutate: jest.fn() };
    mockUseMutation.mockReturnValue(mutationReturn);
    mockCreateBugReport.mockResolvedValue(undefined);

    const result = useCreateBugReportMutation();
    const config = mockUseMutation.mock.calls[0][0];

    const dto = { whatWentWrong: 'App crashed', userId: 'user-1' };
    await config.mutationFn(dto);

    expect(result).toBe(mutationReturn);
    expect(mockUseMutation).toHaveBeenCalledTimes(1);
    expect(mockCreateBugReport).toHaveBeenCalledWith(dto);
  });
});
