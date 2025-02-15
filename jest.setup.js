import '@react-native-async-storage/async-storage/jest/async-storage-mock';

// jest.setup.js
global.FormData = class {
  append() {}
};