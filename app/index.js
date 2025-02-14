import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TrainingThreads from "../components/trainingThreads.js";
import ExerciseList from "../components/exerciseList.js";

const Stack = createNativeStackNavigator(); // definujeme si stack navigator, cize navigation

export default function Index() {
  return (
      <Stack.Navigator>
        {/* Hlavná obrazovka s tréningovými threadmi */}
        <Stack.Screen
          name="Home"
          options={{ headerShown: false }} // Skryjeme header, aby to vyzeralo ako pôvodný dizajn
        >
          {(props) => (
            <SafeAreaView style={styles.container}>
              {/* Komponent s threadmi */}
              <TrainingThreads {...props} />
            </SafeAreaView>
          )}
        </Stack.Screen>

        {/* Detailná obrazovka tréningu */}
        <Stack.Screen
          name="List of Exercises"
          component={ExerciseList}
          options={({ route }) => ({
            title: route.params.trainingName, // Nastavíme názov tréningu ako názov obrazovky
          })}
        />
      </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "silver",
  },
});
