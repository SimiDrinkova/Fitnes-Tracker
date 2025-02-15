import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TrainingThreads from '../../components/trainingThreads';
import { setItem, getItem } from '@/utils/localStorageUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

// FILE: fitness-tracker/components/trainingThreads.test.js

jest.mock('@/utils/localStorageUtils');

describe('TrainingThreads', () => {
  beforeEach(() => {
    getItem.mockResolvedValue(['FullBody', 'Upper/Lower', 'Core']);
    setItem.mockResolvedValue();
  });

  it('renders correctly', async () => {
    const { getByText } = render(<TrainingThreads />);
    await waitFor(() => {
      expect(getByText('CHOOSE YOUR TRAINING')).toBeTruthy();
    });
  });

  it('adds a new training', async () => {
    const { getByPlaceholderText, getByText } = render(<TrainingThreads />);
    const input = getByPlaceholderText('Add new training');
    const addButton = getByText('Add');

    fireEvent.changeText(input, 'New Training');
    fireEvent.press(addButton);

    await waitFor(() => {
      expect(getByText('New Training')).toBeTruthy();
    });
  });

  it('deletes a training', async () => {
    const { getByText, queryByText, getByTestId } = render(<TrainingThreads />);
    await waitFor(() => {
      expect(getByText('FullBody')).toBeTruthy();
    });

    const deleteButton = getByTestId('deleteButton-FullBody');
    fireEvent.press(deleteButton);

    await waitFor(() => {
      expect(queryByText('FullBody')).toBeNull();
    });
  });

  it('edits a training', async () => {
    const { getByText, getByDisplayValue, getByTestId } = render(<TrainingThreads />);
    await waitFor(() => {
      expect(getByText('FullBody')).toBeTruthy();
    });

    const editButton = getByTestId('editButton-FullBody');
    fireEvent.press(editButton);

    const input = getByDisplayValue('FullBody');
    fireEvent.changeText(input, 'Edited Training');
    const saveButton = getByTestId('saveButton');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(getByText('Edited Training')).toBeTruthy();
    });
  });

  it('cancels edit mode', async () => {
    const { getByText, queryByText, getByTestId } = render(<TrainingThreads />);
    await waitFor(() => {
      expect(getByText('FullBody')).toBeTruthy();
    });

    const editButton = getByTestId('editButton-FullBody');
    fireEvent.press(editButton);

    const cancelButton = getByTestId('cancelButton');
    fireEvent.press(cancelButton);

    await waitFor(() => {
      expect(queryByText('EDIT TRAINING')).toBeNull();
      expect(getByText('FullBody')).toBeTruthy();
    });
  });
});