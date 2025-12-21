import { StyleSheet, Text, View, Image, StatusBar, Platform, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

import NavPanel from '../components/navPanel';

const rowCounter = () => {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCount();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      saveCount();
    }
  }, [count]);

  const loadCount = async () => {
    try {
      const savedCount = await AsyncStorage.getItem('rowCount');
      if (savedCount !== null) {
        setCount(parseInt(savedCount, 10));
      }
    } catch (error) {
      console.error('Error loading count:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCount = async () => {
    try {
      await AsyncStorage.setItem('rowCount', count.toString());
    } catch (error) {
      console.error('Error saving count:', error);
    }
  };

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(Math.max(0, count - 1));

  return (
    <View style={styles.container}>
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
    
      <NavPanel />
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

    counter:{
      flexDirection: 'row',
      flexWrap: "wrap",
      alignItems: 'center',
      justifyContent: "center",
      gap: 60,
    },

    sizing: {
      fontSize: 56,
      textAlign: "center",
      lineHeight: 60,
    },

    button:{
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#FFF8DB',
      justifyContent: 'center',
      alignItems: 'center', 
    },

    navBar:{
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 60,
      backgroundColor: "#FFF8DB",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: Platform.OS === "android" ? 40 : 0,
    },
})