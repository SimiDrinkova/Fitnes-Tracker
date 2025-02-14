import { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, FlatList, TextInput, TouchableOpacity, Touchable } from "react-native";
import React from "react";
import { setItem, getItem } from '@/utils/localStorageUtils';

function TrainingThreads({ navigation }) {
  const [training, setTraining] = useState(['FullBody', 'Upper/Lower', 'Core']);
  const [newTraining, setNewTraining] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [newTrainingName, setNewTrainingName] = useState('');

  useEffect(() => {
    const loadTrainings = async () => {
      const storedTrainings = await getItem('trainingList');
      console.log('Loaded trainings from localStorage:', storedTrainings);
      if (storedTrainings) {
        setTraining(storedTrainings);
      } else {
        setTraining(training); // Initialize with data from data.js
      }
    };
    loadTrainings();
  }, []);

   useEffect(() => {
     const saveTrainings = async () => {
       console.log('Saving trainings to localStorage:', training);
       await setItem('trainingList', training);
     };
     saveTrainings();
   }, [training]);


  const addTraining = () => {
    if(newTraining.trim() === '') {
      alert('Please enter a training type');
      return;
    }
    setTraining([...training, newTraining]);
    setNewTraining('');
    console.log("Training added: ", newTraining);
  }

  const deleteTraining =(trainingDelete) => {
    const updateTraining = training.filter((item) => item !== trainingDelete);
    setTraining(updateTraining);
    console.log("Training deleted: ", newTraining);
  }

  const editTraining = (trainingEdit) => {
    setEditMode(trainingEdit);
    setNewTrainingName(trainingEdit);
  }

  const saveEditTodo = () => {
    const updateTraining = training.map((item) => {
      if(item === editMode) {
        return newTrainingName;
      }
      return item;
    });
    setTraining(updateTraining);
    setEditMode(null);
    setNewTrainingName('');
  }
  if(editMode) {
    return (
      <View>
        <Text style={{
        fontSize: 20,
        fontWeight: "bold",
        margin: 20,
        fontStyle: "italic"
    }}>EDIT TRAINING</Text>

        <TextInput
          style={styles.input}
          value={newTrainingName}
          onChangeText={setNewTrainingName}>
        </TextInput>

        <TouchableOpacity
          style={styles.button}
          title="Save"
          onPress={saveEditTodo}>
          <Text style={styles.textButton}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
        style={styles.button}
        title="Cancel"
        onPress={() => setEditMode(null)}>
          <Text style={styles.textButton}>Cancel</Text>
        </TouchableOpacity>

      </View>
    )
  }

  return (
    <View style={styles.trainingContainer}>
      <Text style={styles.mainTitle}>CHOOSE YOUR TRAINING</Text>

      <FlatList
        data={training}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (

          <View style={styles.trainingThreadContainer}>

            <TouchableOpacity
            style={styles.title}
            onPress={() => navigation.navigate('List of Exercises', { trainingName: item })}>
            <Text style={styles.title}>{item}</Text>
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => deleteTraining(item)}
              >
                <Text style={styles.textButton}>Delete</Text>
              </TouchableOpacity>
            
              <TouchableOpacity
                style={styles.button}
                onPress={() => editTraining(item)}
              >
                <Text style={styles.textButton}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        >
      </FlatList>
      
      <View>
        <TextInput
          style={styles.input}
          placeholder="Add new training"
          value={newTraining}
          onChangeText={setNewTraining}>
        </TextInput>

        <TouchableOpacity
          style={styles.button}
          onPress={addTraining}
          >
            <Text
            style={styles.textButton}>Add</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  trainingContainer: {
    flex: 1,
    backgroundColor: "silver",
  },
  trainingThreadContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    alignItems: "center",
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    margin: 10,
    flexShrink: 1,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 20,
    fontStyle: "italic",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: "row",
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
})

export default TrainingThreads;