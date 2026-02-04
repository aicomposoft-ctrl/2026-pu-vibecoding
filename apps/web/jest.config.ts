import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', {}],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@ai-sales-trainer/config$': '<rootDir>/../../packages/config/src/index.ts',
    '^@ai-sales-trainer/shared-types$': '<rootDir>/../../packages/shared-types/src/index.ts',
  },
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
};

export default config;
