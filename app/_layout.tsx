import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StackScreen } from 'react-native-screens'

const RootLayout = () => {
  return (
    
    <Stack screenOptions={{
      headerStyle: {backgroundColor: '#FFFBF5'},
      headerTitleAlign: 'center',
      headerShadowVisible: false,
    }
    }>
      <Stack.Screen name='index' options={{headerShown: false}}/>
      <Stack.Screen name='login' options={{title: ''}}/>

    </Stack>
    
  )
}

export default RootLayout

const styles = StyleSheet.create({})