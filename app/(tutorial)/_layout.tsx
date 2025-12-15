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
        <Stack.Screen name='[id]' options={{title: ''}}/>
    </Stack>
    
  )
}

export default AuthLayout

const styles = StyleSheet.create({})