import { serverTimestamp } from "firebase/firestore";
import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

const Counter = () => {
  const [count, setCount] = useState(0);

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
    counter:{
      flexDirection: 'row',
      flexWrap: "wrap",
      alignItems: 'center',
      justifyContent: "center",
      backgroundColor: "#F9E7C6",
      padding: 10,
      borderRadius: 40,
      gap: 60,
      marginBottom: 20,
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
    }
})