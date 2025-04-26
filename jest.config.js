module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts', '**/*.spec.ts', '**/test/*.ts'],
  verbose: true,
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
