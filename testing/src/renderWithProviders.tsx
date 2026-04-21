import { ReactElement, ReactNode } from 'react';

import {
  QueryClient,
  QueryClientProvider,
  QueryClientConfig,
} from '@tanstack/react-query';
import {
  render,
  RenderOptions,
  RenderResult,
} from '@testing-library/react-native';

export interface RenderWithProvidersOptions extends Omit<
  RenderOptions,
  'wrapper'
> {
  queryClient?: QueryClient;
  queryClientConfig?: QueryClientConfig;
}

function createTestQueryClient(config?: QueryClientConfig) {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
    ...config,
  });
}

export function renderWithProviders(
  ui: ReactElement,
  options: RenderWithProvidersOptions = {},
): RenderResult {
  const { queryClient, queryClientConfig, ...renderOptions } = options;
  const testQueryClient =
    queryClient ?? createTestQueryClient(queryClientConfig);

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={testQueryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}
