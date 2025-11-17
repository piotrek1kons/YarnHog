import { StyleSheet, Text, View, Image, StatusBar, Platform } from 'react-native'
import React from 'react'

import NavPanel from '../components/navPanel';

const rowCounter = () => {
  return (
    <View style={styles.container}>
      <View style={styles.counter}>
        <View style={styles.button}>
          <Text style={styles.sizing}>-</Text>
        </View>
        <View>
          <Text style={styles.sizing}>0</Text>
        </View>
        <View style={styles.button}>
          <Text style={styles.sizing}>+</Text>
        </View>
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