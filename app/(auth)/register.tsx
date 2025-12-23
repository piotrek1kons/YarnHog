import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, StatusBar, Platform, Alert } from 'react-native'
import { router, Link } from 'expo-router'
import { auth, db } from '../../FirebaseConfig'
import { collection, query, where, getDocs, doc, setDoc, serverTimestamp } from "firebase/firestore";
import React, { useState } from 'react'
import { createUserWithEmailAndPassword} from 'firebase/auth'


import Logo from '../../assets/img/logo.png';
import Back from '../../assets/img/back.png';

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState("");

    const handleRegister = async () => {
        if (!username || !email || !password || !password2) {
            Alert.alert("Error", "Please complete all fields.");
            return;
        }

        if (password !== password2) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }

        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("username", "==", username));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                Alert.alert("Error", "Username already taken. Please choose another.");
                return;
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (!auth.currentUser) {
                throw new Error("User not logged in yet.");
            }

            await setDoc(doc(db, "users", user.uid), {
                ID: user.uid,           
                username: username,
                email: email,
                avatarUrl: "",             
                createdAt: serverTimestamp()
            });

            Alert.alert("Success", "Account created!");

            router.replace("/home"); 
        } catch (error: any) {
            Alert.alert("Registration error", error.message);
        }
    };

    const signUp = async () => {
        try {
        const user = await createUserWithEmailAndPassword(auth, email, password)
        if (user) router.replace('/home');
        } catch (error: any) {
        console.log(error)
        alert('Sign up failed: ' + error.message);
        }
    }

    return (
        <View style={styles.container}>
            <View>
                <Image source={Logo} style={{ width: 250, height: 250 }}></Image>
            </View>
            <View style={styles.form}>
                <Text style={{textAlign: "left"}}>Username:</Text>
                <TextInput placeholder='jan.kowalski' style={styles.input} value={username} onChangeText={setUsername}></TextInput>
                <Text style={{textAlign: "left"}}>Email:</Text>
                <TextInput placeholder='jan.kowalski@gmail.com' style={styles.input} value={email} onChangeText={setEmail}></TextInput>
                <Text>Password:</Text>
                <TextInput secureTextEntry={true} placeholder='password' style={styles.input} value={password} onChangeText={setPassword}></TextInput>
                <Text>Confirm Password:</Text>
                <TextInput secureTextEntry={true} placeholder='password' style={styles.input} value={password2} onChangeText={setPassword2}></TextInput>
                <TouchableOpacity onPress={handleRegister} style={styles.button}>
                    <Text>SIGN UP!</Text>
                </TouchableOpacity>
            </View>
        </View>
  )
}

export default Register

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
        
    },

    button:{
        width: 250,
        marginTop: 20,
        padding: 12,
        borderRadius: 8,
        backgroundColor: "#FFF8DB"
    }
})