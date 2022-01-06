/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  detectOpenHandles: true,
  // setupFilesAfterEnv: ['./src/test/setup.ts'],
  // setupFiles: ['./src/utils/config.ts'],
};
