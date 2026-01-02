import { StyleSheet, Text, View, Image, StatusBar, Platform, ScrollView, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import { auth, db } from '../FirebaseConfig';
import { doc, getDoc, setDoc, collection, onSnapshot } from 'firebase/firestore';
import Counter from '../components/counter';
import NavPanel from '@/components/navPanel';

const rowCounter = () => {
  
  const [counters, setCounters] = useState([{ id: 1 }]);
  const [nextId, setNextId] = useState(2);
  const [isLoading, setIsLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    loadCounters();
  }, [user]);

  useEffect(() => {
    if (!isLoading && user) {
      saveCounters();
    }
  }, [counters, nextId, isLoading]);

  const loadCounters = async () => {
    if (!user) return;
    try {
      const docRef = doc(db, 'users', user.uid, 'rowCounterSettings', 'config');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCounters(data.counters || [{ id: 1 }]);
        setNextId(data.nextId || 2);
      }
    } catch (error) {
      console.error('Error loading counters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCounters = async () => {
    if (!user) return;
    try {
      const docRef = doc(db, 'users', user.uid, 'rowCounterSettings', 'config');
      await setDoc(docRef, {
        counters: counters,
        nextId: nextId,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error saving counters:', error);
    }
  };

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
                    <Counter id={counter.id} />
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