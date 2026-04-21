import { afterEach } from '@jest/globals';
import { cleanup } from '@testing-library/react-native';

import 'react-native-gesture-handler/jestSetup';

afterEach(() => {
  cleanup();
});
