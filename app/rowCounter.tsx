import { StyleSheet, Text, View, Image, StatusBar, Platform, ScrollView, Pressable } from 'react-native'
import React, { useState } from 'react'

import Counter from '../components/counter';
import { count } from 'firebase/firestore';
import NavPanel from '@/components/navPanel';

const rowCounter = () => {
  
  const [counters, setCounters] = useState([{ id: 1 }]);
  const [nextId, setNextId] = useState(2);

  const addCounter = () => {
    setCounters(prev => [...prev, { id: nextId }]);
    setNextId(prev => prev + 1);
  };

  const removeCounter = (id: number) => {
    if(counters.length === 1) return;
    setCounters(prev => prev.filter(counter => counter.id !== id));
  };
  
  return (
    <View style={styles.container}>
        <ScrollView style={styles.scroll}>
            {counters.map((counter) => (
                <View key={counter.id} style={styles.counters}>
                    <Counter />
                    {counters.length > 1 && (
                    <Pressable style={styles.deleteButton} onPress={() => removeCounter(counter.id)}>
                        <Text style={styles.deleteButtonText}>X</Text>
                    </Pressable>
                    )}
                </View>
            ))}
        </ScrollView>
        <Pressable style={styles.addCounter} onPress={addCounter}>
            <Text style={styles.addCounterText}>Add Counter</Text>
        </Pressable>
        <NavPanel/>
    </View>
  )
}

export default rowCounter

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#FFFBF5', 
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },

    scroll:{
        maxHeight: "80%", 
    },

    addCounter:{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F9E7C6",
        borderRadius: 40,
        marginBottom: 20,
        width: 300,
        height: 60,
    },

    addCounterText: {
        fontSize: 24,          
        fontWeight: "600",
        textAlign: "center",
    },

    deleteButton: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        backgroundColor: "#F4C2C2",
        borderRadius: 20,
    },

    deleteButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
        textAlign: "center",
    },

    counters:{
        marginTop: 10,
    }
})