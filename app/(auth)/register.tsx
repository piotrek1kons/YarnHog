import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, StatusBar, Platform, Alert } from 'react-native';
import { router, Link } from 'expo-router';
import { auth, db } from '../../FirebaseConfig';
import { collection, query, where, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';

import Logo from '../../assets/img/logo.png';

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

    return (
        <View style={styles.container}>
            <View style={styles.logoBlock}>
                <Image source={Logo} style={styles.logo} />
                <Text style={styles.title}>Create account</Text>
                <Text style={styles.subtitle}>Join the YarnHog community</Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                    placeholder='jan.kowalski'
                    placeholderTextColor="#9A8F80"
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />

                <Text style={styles.label}>Email</Text>
                <TextInput
                    placeholder='jan.kowalski@gmail.com'
                    placeholderTextColor="#9A8F80"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    secureTextEntry
                    placeholder='••••••••'
                    placeholderTextColor="#9A8F80"
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                />

                <Text style={styles.label}>Confirm password</Text>
                <TextInput
                    secureTextEntry
                    placeholder='••••••••'
                    placeholderTextColor="#9A8F80"
                    style={styles.input}
                    value={password2}
                    onChangeText={setPassword2}
                />

                <TouchableOpacity onPress={handleRegister} style={styles.button}>
                    <Text style={styles.buttonLabel}>Sign up</Text>
                </TouchableOpacity>

                <View style={styles.footerRow}>
                    <Text style={styles.footerText}>Already have an account?</Text>
                    <Link href="/login" style={styles.footerLink}>Sign in</Link>
                </View>
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
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        paddingHorizontal: 12,
    },

    logoBlock: {
        alignItems: 'center',
        marginTop: 8,
    },

    logo: {
        width: 250,
        height: 250,
        resizeMode: 'contain',
    },

    title: {
        marginTop: 4,
        fontSize: 24,
        fontWeight: '800',
        color: '#6B5E4B',
        letterSpacing: 0.3,
    },

    subtitle: {
        marginTop: 2,
        fontSize: 13,
        color: '#8A7E70',
        fontWeight: '600',
    },

    form:{
        width: '100%',
        maxWidth: 340,
        borderRadius: 16,
        backgroundColor: '#FFF8DB',
        borderWidth: 1,
        borderColor: '#E7B469',
        gap: 10,
        marginTop: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        shadowColor: 'rgba(0,0,0,0.10)',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 12,
        elevation: 8,
    },

    label: {
        fontSize: 14,
        fontWeight: '700',
        color: '#6B5E4B',
    },

    input:{
        width: '100%',
        height: 44,
        borderColor: '#E7B469',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        fontSize: 14.5,
        color: '#1C1C1C',
    },

    button:{
        width: '100%',
        marginTop: 6,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#E7B469',
        alignItems: 'center',
        shadowColor: 'rgba(0,0,0,0.10)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 6,
    },

    buttonLabel: {
        fontWeight: '800',
        color: '#1C1C1C',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },

    footerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
        marginTop: 4,
    },

    footerText: {
        color: '#6B5E4B',
        fontSize: 13,
    },

    footerLink: {
        color: '#C67A20',
        fontWeight: '700',
        fontSize: 13,
    },
})