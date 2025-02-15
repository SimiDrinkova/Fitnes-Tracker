import '@react-native-async-storage/async-storage/jest/async-storage-mock';

// jest.setup.js
// jest.setup.js
global.FormData = global.FormData || class {
  append() {}
};