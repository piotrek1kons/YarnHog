import { StyleSheet, Text, View, Image, Pressable, TextInput, StatusBar, Platform } from 'react-native'
import { Link } from 'expo-router'
import React from 'react'

import Logo from '../assets/img/logo.png';
import Back from '../assets/img/back.png';

const Login = () => {
  return (
    <View style={styles.container}>
        <View>
            <Image source={Logo} style={{ width: 250, height: 250 }}></Image>
        </View>
        <View style={styles.form}>
            <Text style={{textAlign: "left"}}>Username:</Text>
            <TextInput placeholder='jan.kowalski' style={styles.input}></TextInput>
            <Text style={{textAlign: "left"}}>Email:</Text>
            <TextInput placeholder='jan.kowalski@gmail.com' style={styles.input}></TextInput>
            <Text>Password:</Text>
            <TextInput placeholder='********' style={styles.input}></TextInput>
            <Text>Confirm Password:</Text>
            <TextInput placeholder='********' style={styles.input}></TextInput>
            <Pressable disabled={true}
                style={({ pressed }) => [
                {
                        width: 250,
                        marginTop: 20,
                        padding: 12,
                        borderRadius: 8,
                        backgroundColor: "#FFF8DB", // kolor disabled
                        opacity: pressed ? 0.6 : 1
                }
                ]}>
                    <Link href="/login" style={{ textAlign: "center", color: "#555", fontWeight: "bold" }}>SIGN UP!</Link>
            </Pressable>
        </View>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFFBF5',
    },

    form:{
        width: 300,
        height: 400,
        borderRadius: 20,
        backgroundColor: '#F9E7C6',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: 10,
        marginTop: 20,
        paddingLeft: 25,
    },

    input:{
        width: 250,
        height: 40,
        borderColor: '#555',
        backgroundColor: '#FFF',
        borderWidth: 1,
        
    }
})