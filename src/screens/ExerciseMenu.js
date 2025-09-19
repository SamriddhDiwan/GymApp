import { ScrollView } from 'react-native';
import exercises from '../exercise';
import { useEffect, useState } from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Exercise from "../classes/ExerciseClass";
import ExerciseCard from '../components/ExerciseCard.js';
function loadNewExercises() {
    return exercises;
}

async function getExerices() {
    let avialableExercies = await loadNewExercises();
    var ExerciseList=[];
    for (let key in avialableExercies) {
        let ex=avialableExercies[key];
        ExerciseList.push(new Exercise(ex))
    }
    return ExerciseList;
}

export default function ExerciseMenu({route}) {
    var [allExercises, setExercises] = useState([]);
    var navigation = useNavigation();
    useEffect(() => {
        var newExercises = null;
        async function getNewExecise() {
            setExercises(await getExerices());
        }
        getNewExecise();
    },[])
    return (<SafeAreaProvider>
        <SafeAreaView edges={['top']}>
            <ScrollView >
                {
                    allExercises.map((exercise, i) =>(
                    <ExerciseCard
                        key={i}
                        exercise={exercise}
                    />
                ))
                }
            </ScrollView>
        </SafeAreaView>
    </SafeAreaProvider>
    );
}