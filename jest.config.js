module.exports = {
  moduleFileExtensions: ['js', 'json', 'vue', 'ts'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: ['**/tests/unit/**/*.spec.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  snapshotSerializers: ['jest-serializer-vue'],
  testEnvironment: 'jsdom',
};
