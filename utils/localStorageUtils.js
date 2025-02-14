import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to set an item in localStorage
export const setItem = async (key, value) => {
  try {
   // console.log(`Setting item in AsyncStorage: ${key}`, value);
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
  //  console.error('Error setting item in AsyncStorage', error);
  }
};

// Function to get an item from localStorage
export const getItem = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
   // console.log(`Getting item from AsyncStorage: ${key}`, value);
    return value ? JSON.parse(value) : null;
  } catch (error) {
   // console.error('Error getting item from AsyncStorage', error);
  }
};

// Function to remove an item from localStorage
export const removeItem = async (key) => {
  try {
  //  console.log(`Removing item from AsyncStorage: ${key}`);
    await AsyncStorage.removeItem(key);
  } catch (error) {
   // console.error('Error removing item from AsyncStorage', error);
  }
};

// Function to update an item in localStorage
export const updateItem = async (key, newValue) => {
  const existingValue = await getItem(key);
  if (existingValue) {
    const updatedValue = { ...existingValue, ...newValue };
    //console.log(`Updating item in AsyncStorage: ${key}`, updatedValue);
    await setItem(key, updatedValue);
  } else {
    await setItem(key, newValue);
  }
};



