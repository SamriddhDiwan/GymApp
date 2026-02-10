import { Text, StyleSheet, View, Image } from 'react-native';

export default function ExerciseRow({ exercise }){
  const totalSets = exercise.sets.length;
  return (
    <View style={stylesExerciseRow.row}>
      <Image source={require("./image.png")} style={stylesExerciseRow.image} />
      <Text style={stylesExerciseRow.text}>{totalSets} Sets {exercise.exerciseId}</Text>
    </View>
  )
}


const stylesExerciseRow = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12
  },
  image: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    backgroundColor:'#fff'
  },
  text: {
    color: "#E5E7EB",
    fontSize: 14,
  },
})