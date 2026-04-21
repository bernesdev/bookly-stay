import { useUserStore } from './useUserStore';

describe('useUserStore', () => {
  beforeEach(() => {
    useUserStore.setState({
      id: undefined,
      name: undefined,
      email: undefined,
      provider: undefined,
      isLoggedIn: false,
    });
    jest.clearAllMocks();
  });

  it('should initialize with empty credentials and logged out state', () => {
    const state = useUserStore.getState();

    expect(state.id).toBeUndefined();
    expect(state.name).toBeUndefined();
    expect(state.email).toBeUndefined();
    expect(state.provider).toBeUndefined();
    expect(state.isLoggedIn).toBe(false);
  });

  it('should set credentials and mark user as logged in when id is present', () => {
    useUserStore.getState().setCredentials({
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      provider: 'email',
    });

    const state = useUserStore.getState();

    expect(state.id).toBe('user-1');
    expect(state.name).toBe('John Doe');
    expect(state.email).toBe('john@example.com');
    expect(state.provider).toBe('email');
    expect(state.isLoggedIn).toBe(true);
  });

  it('should keep user logged out when credentials have no id', () => {
    useUserStore.getState().setCredentials({
      id: undefined,
      name: 'Guest',
      email: 'guest@example.com',
      provider: 'google',
    });

    const state = useUserStore.getState();

    expect(state.id).toBeUndefined();
    expect(state.name).toBe('Guest');
    expect(state.email).toBe('guest@example.com');
    expect(state.provider).toBe('google');
    expect(state.isLoggedIn).toBe(false);
  });

  it('should clear credentials and set logged out state', () => {
    useUserStore.setState({
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      provider: 'apple',
      isLoggedIn: true,
    });

    useUserStore.getState().clearCredentials();

    const state = useUserStore.getState();

    expect(state.id).toBeUndefined();
    expect(state.name).toBeUndefined();
    expect(state.email).toBeUndefined();
    expect(state.isLoggedIn).toBe(false);
  });
});
