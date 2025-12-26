import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StackScreen } from 'react-native-screens'

function AuthLayout() {
  return (
    
    <Stack screenOptions={{
      headerStyle: {backgroundColor: '#FFFBF5'},
      headerTitleAlign: 'center',
      headerShadowVisible: false,
    }
    }>
        <Stack.Screen name='login' options={{headerShown: false}}/>
        <Stack.Screen name='register' options={{headerShown: false}}/>
        <Stack.Screen name='unSignedProjects' options={{title: 'Projects'}}/>
        <Stack.Screen name='unSignedTutorials' options={{title: 'Tutorials'}}/>
        <Stack.Screen name='unSignedRowCounter' options={{title: 'Row Counter'}}/>
    </Stack>
    
  )
}

export default AuthLayout

const styles = StyleSheet.create({})