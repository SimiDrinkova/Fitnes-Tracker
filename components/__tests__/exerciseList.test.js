import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ExerciseList from '../exerciseList';
import { setItem, getItem } from '@/utils/localStorageUtils';

jest.mock('@/utils/localStorageUtils');

describe('ExerciseList Component', () => {
  const route = { params: { trainingName: 'Test Training' } };

  beforeEach(() => {
    getItem.mockResolvedValue([
      { id: '1', name: 'Push Up', series: 3, reps: 15, weight: 0, expander: '' }
    ]);
    setItem.mockResolvedValue();
  });

  it('renders correctly', async () => {
    const { getByText } = render(<ExerciseList route={route} />);
    await waitFor(() => {
      expect(getByText('List of Exercises for Test Training')).toBeTruthy();
    });
  });

  it('adds a new exercise', async () => {
    const { getByTestId, getByPlaceholderText, getByText } = render(<ExerciseList route={route} />);
    await waitFor(() => getByTestId('addExerciseButton'));
    fireEvent.press(getByTestId('addExerciseButton'));
    fireEvent.changeText(getByPlaceholderText('Exercise name'), 'Pull Up');
    fireEvent.changeText(getByPlaceholderText('Series'), '4');
    fireEvent.changeText(getByPlaceholderText('Reps'), '10');
    fireEvent.changeText(getByPlaceholderText('Weight'), '5');
    fireEvent.press(getByTestId('saveButton'));
    await waitFor(() => {
      expect(getByText('Pull Up')).toBeTruthy();
    });
  });

  it('edits an existing exercise', async () => {
    const { getByTestId, getByText, getByPlaceholderText } = render(<ExerciseList route={route} />);
    await waitFor(() => getByText('Push Up'));
    fireEvent.press(getByText('Push Up'));
    fireEvent.changeText(getByPlaceholderText('Exercise name'), 'Edited Push Up');
    fireEvent.press(getByTestId('saveButton'));
    await waitFor(() => {
      expect(getByText('Edited Push Up')).toBeTruthy();
    });
  });

  it('deletes an exercise', async () => {
    const { getByTestId, getByText, queryByText } = render(<ExerciseList route={route} />);
    await waitFor(() => getByText('Push Up'));
    fireEvent.press(getByText('Push Up')); // Enter edit mode
    fireEvent.press(getByTestId('deleteButton-1')); // Press delete button
    await waitFor(() => {
      expect(queryByText('Push Up')).toBeNull();
    });
  });

  it('cancels adding/editing an exercise', async () => {
    const { getByTestId, getByText, queryByText } = render(<ExerciseList route={route} />);
    await waitFor(() => getByTestId('addExerciseButton'));
    fireEvent.press(getByTestId('addExerciseButton'));
    fireEvent.press(getByTestId('cancelButton'));
    await waitFor(() => {
      expect(queryByText('ADD NEW EXERCISE')).toBeNull();
    });

    fireEvent.press(getByText('Push Up'));
    fireEvent.press(getByTestId('cancelButton'));
    await waitFor(() => {
      expect(queryByText('EDIT EXERCISE')).toBeNull();
    });
  });
});
