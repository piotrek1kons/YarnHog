import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { auth, db } from '../FirebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Counter = ({ id }: { id?: number }) => {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const user = auth.currentUser;
  const counterId = id ? `counter_${id}` : 'counter_default';

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    loadCount();
  }, [id, user]);

  useEffect(() => {
    if (!isLoading && user) {
      saveCount();
    }
  }, [count]);

  const loadCount = async () => {
    if (!user) return;
    try {
      const docRef = doc(db, 'users', user.uid, 'counters', counterId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setCount(docSnap.data().value || 0);
      }
    } catch (error) {
      console.error('Error loading count:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCount = async () => {
    if (!user) return;
    try {
      const docRef = doc(db, 'users', user.uid, 'counters', counterId);
      await setDoc(docRef, {
        value: count,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error saving count:', error);
    }
  };

  const increment = () => setCount(prev => prev + 1);

  const decrement = () => setCount(prev => (prev > 0 ? prev - 1 : 0));
  return (
    <View style={styles.counter}>
        <Pressable style={styles.button} onPress={decrement}>
            <Text style={styles.sizing}>-</Text>
        </Pressable>
        <View>
          <Text style={styles.sizing}>{count}</Text>
        </View>
        <Pressable style={styles.button} onPress={increment}>
            <Text style={styles.sizing}>+</Text>
        </Pressable>
      </View>
  );
};

export default Counter;

const styles = StyleSheet.create({
    counter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFF8DB',
      paddingVertical: 14,
      paddingHorizontal: 22,
      borderRadius: 999,
      gap: 40,
      marginBottom: 20,
      borderWidth: 2,
      borderColor: '#E7B469',
      shadowColor: 'rgba(0,0,0,0.12)',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 18,
      elevation: 10,
    },

    sizing: {
      fontSize: 52,
      textAlign: 'center',
      lineHeight: 60,
      color: '#6B5E4B',
      fontWeight: '700',
      minWidth: 80,
    },

    button: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: '#F9E7C6',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#E7B469',
      shadowColor: 'rgba(0,0,0,0.08)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 10,
      elevation: 6,
    }
})