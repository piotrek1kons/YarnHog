import { StyleSheet, Text, View, Image, Pressable, TextInput, StatusBar, Platform, Touchable, TouchableOpacity } from 'react-native'
import { Link, router } from 'expo-router'
import { auth } from '../FirebaseConfig'
import { signInWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'

import Logo from '../assets/img/logo.png';
import Back from '../assets/img/back.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const signIn = async () => {
        try{
            const user = await signInWithEmailAndPassword(auth, email, password);
            if (user) router.replace('/home');
        }catch (error: any) {
            console.log(error);
            alert('Sign in failed: ' + error.message);
        }
    }
  return (
    <View style={styles.container}>
        <View>
            <Image source={Logo} style={{ width: 300, height: 300 }}></Image>
        </View>
        <View style={styles.form}>
            <Text style={{textAlign: "left"}}>Email:</Text>
            <TextInput placeholder='jan.kowalski@gmail.com' value={email} onChangeText={setEmail} style={styles.input}></TextInput>
            <Text>Password:</Text>
            <TextInput secureTextEntry={true} placeholder='password' value={password} onChangeText={setPassword} style={styles.input}></TextInput>
            <TouchableOpacity onPress={signIn} style={styles.button}>
                    <Text style={{ textAlign: "center", color: "#555", fontWeight: "bold" }}>SIGN IN!</Text>
            </TouchableOpacity>
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
        height: 300,
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
        
    },

    button:{
        width: 250,
        marginTop: 20,
        padding: 12,
        borderRadius: 8,
        backgroundColor: "#FFF8DB"
    }
})