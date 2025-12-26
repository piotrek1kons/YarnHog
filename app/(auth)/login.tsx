import { StyleSheet, Text, View, Image, TextInput, StatusBar, Platform, TouchableOpacity, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { auth } from '../../FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';

import Logo from '../../assets/img/logo.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const signIn = async () => {
        try {
            const user = await signInWithEmailAndPassword(auth, email, password);
            if (user) router.replace('/home');
        } catch (error: any) {
            Alert.alert('Sign in failed', error.message);
        }
    };

  return (
    <View style={styles.container}>
        <View style={styles.logoBlock}>
            <Image source={Logo} style={styles.logo} />
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
                placeholder='jan.kowalski@gmail.com'
                placeholderTextColor="#9A8F80"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
                secureTextEntry
                placeholder='••••••••'
                placeholderTextColor="#9A8F80"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
            />

            <TouchableOpacity onPress={signIn} style={styles.button}>
                <Text style={styles.buttonLabel}>Sign in</Text>
            </TouchableOpacity>

            <View style={styles.footerRow}>
                <Text style={styles.footerText}>Don't have an account?</Text>
                <Link href="/register" style={styles.footerLink}>Sign up</Link>
            </View>
        </View>
    </View>
  );
}

export default Login

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
        marginTop: 65,
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