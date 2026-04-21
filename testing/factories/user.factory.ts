export type MockUser = {
  uid: string;
  displayName: string | null;
  email: string | null;
  providerData: { providerId: string }[];
  updateProfile: jest.Mock;
  updatePassword: jest.Mock;
};

export function makeUser(overrides: Partial<MockUser> = {}): MockUser {
  return {
    uid: 'user-1',
    displayName: 'John',
    email: 'john@example.com',
    providerData: [{ providerId: 'password' }],
    updateProfile: jest.fn().mockResolvedValue(undefined),
    updatePassword: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}
