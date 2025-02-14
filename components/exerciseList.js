import { useState, useEffect } from "react";
import { Text, View, StyleSheet, FlatList, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { setItem, getItem } from "@/utils/localStorageUtils";

function ExerciseList({ route }) {
  const { trainingName } = route.params;
  const [exercise, setExercise] = useState([]);
  const [newExercise, setNewExercise] = useState('');
  const [series, setSeries] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [expander, setExpander] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [editedExercise, setEditedExercise] = useState({});

  useEffect(() => {
    const loadExercises = async () => {
      const storedExercises = await getItem(`exerciseList_${trainingName}`);
      console.log(`Loaded exercises for ${trainingName} from localStorage:`, storedExercises);
      if (storedExercises) {
        setExercise(storedExercises);
      }
    };
    loadExercises();
  }, [trainingName]);

  useEffect(() => {
    const saveExercises = async () => {
      console.log(`Saving exercises for ${trainingName} to localStorage:`, exercise);
      await setItem(`exerciseList_${trainingName}`, exercise);
    };
    saveExercises();
  }, [exercise, trainingName]);

  const addExercise = () => {
    setIsAdding(true);
  };

  const deleteExercise = (exerciseDelete) => {
    const updatedExercises = exercise.filter((item) => item.id !== exerciseDelete.id);
    setExercise(updatedExercises);
    console.log("Exercise deleted: ", exerciseDelete);
  };

  const editExercise = (exerciseEdit) => {
    setEditMode(exerciseEdit.id);
    setEditedExercise(exerciseEdit);
  };

  const saveEditedExercise = () => {
    if (isNaN(editedExercise.series) || isNaN(editedExercise.reps) || isNaN(editedExercise.weight)) {
      alert('Series, Reps, and Weight must be numbers');
      return;
    }

    const updatedExercises = exercise.map((item) => {
      if (item.id === editMode) {
        return {
          ...item,
          name: editedExercise.name,
          series: parseInt(editedExercise.series),
          reps: parseInt(editedExercise.reps),
          weight: parseFloat(editedExercise.weight),
          expander: editedExercise.expander
        };
      }
      return item;
    });
    setExercise(updatedExercises);
    setEditMode(null);
    setEditedExercise({});
    console.log("Exercise edited: ", editedExercise);
  };

  const saveExercise = () => {
    console.log('saveExercise called');
    console.log({ newExercise, series, reps, weight, expander });
    if (isNaN(series) || isNaN(reps) || isNaN(weight)) {
      alert('Series, Reps, and Weight must be numbers');
      return;
    }

    if (!newExercise || !series || !reps) {
      alert('Please fill in all mandatory fields (Exercise, Series, Reps)');
      return;
    }
    if (newExercise && series && reps) {
      const newExerciseList = {
        id: (exercise.length + 1).toString(), // Ensure unique ID
        name: newExercise,
        series: parseInt(series),
        reps: parseInt(reps),
        weight: parseFloat(weight),
        expander: expander
      };
      const updatedExercises = [...exercise, newExerciseList];
      setExercise(updatedExercises);
      setNewExercise('');
      setSeries('');
      setReps('');
      setWeight('');
      setExpander('');
      setIsAdding(false);
    }
  };

  if (isAdding || editMode) {
    return (
      <View>
        <Text style={{
          fontSize: 20,
          fontWeight: "bold",
          margin: 20,
          fontStyle: "italic"
        }}>{editMode ? "EDIT EXERCISE" : "ADD NEW EXERCISE"}</Text>

        <TextInput
          style={styles.input}
          placeholder="Exercise name"
          value={editMode ? editedExercise.name : newExercise}
          onChangeText={text => editMode ? setEditedExercise({ ...editedExercise, name: text }) : setNewExercise(text)}>
        </TextInput>

        <TextInput
          style={styles.input}
          placeholder="Series"
          keyboardType="numeric"
          value={editMode ? editedExercise.series.toString() : series}
          onChangeText={text => editMode ? setEditedExercise({ ...editedExercise, series: text }) : setSeries(text)}>
        </TextInput>

        <TextInput
          style={styles.input}
          placeholder="Reps"
          keyboardType="numeric"
          value={editMode ? editedExercise.reps.toString() : reps}
          onChangeText={text => editMode ? setEditedExercise({ ...editedExercise, reps: text }) : setReps(text)}>
        </TextInput>

        <TextInput
          style={styles.input}
          placeholder="Weight"
          keyboardType="numeric"
          value={editMode ? editedExercise.weight.toString() : weight}
          onChangeText={text => editMode ? setEditedExercise({ ...editedExercise, weight: text }) : setWeight(text)}>
        </TextInput>

        <TextInput
          style={styles.input}
          placeholder="Expander"
          value={editMode ? editedExercise.expander : expander}
          onChangeText={text => editMode ? setEditedExercise({ ...editedExercise, expander: text }) : setExpander(text)}>
        </TextInput>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (editMode) {
              saveEditedExercise();
            } else {
              saveExercise();
            }
          }}>
          <Text style={styles.textButton}>{editMode ? "Save changes" : "Save exercise"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setIsAdding(false);
            setEditMode(null);
            setEditedExercise({});
          }}>
          <Text style={styles.textButton}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.trainingContainer}>
      <Text style={styles.mainTitle}>List of Exercises for {trainingName}</Text>
      <FlatList
        data={exercise} // Use the state directly
        keyExtractor={(item) => `${item.id}-${item.name}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => editExercise(item)}>
            <View style={styles.item}>
              <Text style={styles.itemText}>{`${item.name}`}</Text>
              <Text style={styles.itemText}>{`Series: ${item.series}`}</Text>
              <Text style={styles.itemText}>{`Reps: ${item.reps}`}</Text>
              {item.weight && <Text style={styles.itemText}>{`Weight: ${item.weight} kg`}</Text>}
              {item.expander && <Text style={styles.itemText}>{`Expander: ${item.expander}`}</Text>}
              <TouchableOpacity
                onPress={() => deleteExercise(item)}
                style={styles.button}>
                <Text style={styles.textButton}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={addExercise}>
        <Text style={styles.textButton}>Add new exercise</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  trainingContainer: {
    flex: 1,
    backgroundColor: "silver",
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 20,
    fontStyle: "italic",
  },
  item: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "lightgray",
    borderRadius: 10,
  },
  itemText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: "red",
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  textButton: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  }
});

export default ExerciseList;