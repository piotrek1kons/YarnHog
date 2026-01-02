import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, StatusBar, Platform, Alert, ScrollView, KeyboardAvoidingView } from 'react-native';
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
    const [showPasswordInfo, setShowPasswordInfo] = useState(false);
    const [usernameExists, setUsernameExists] = useState(false);
    const [checkingUsername, setCheckingUsername] = useState(false);

    const isEmailValid = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isPasswordValid = (pwd: string) => {
        return pwd.length >= 6 && 
               /[A-Z]/.test(pwd) && 
               /[0-9]/.test(pwd) && 
               /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    };

    const checkUsernameAvailability = async (name: string) => {
        if (!name.trim()) {
            setUsernameExists(false);
            return;
        }
        setCheckingUsername(true);
        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("username", "==", name));
            const querySnapshot = await getDocs(q);
            setUsernameExists(!querySnapshot.empty);
        } catch (error) {
            console.log("Error checking username:", error);
        } finally {
            setCheckingUsername(false);
        }
    };

    const handleUsernameChange = (text: string) => {
        setUsername(text);
        const timeoutId = setTimeout(() => {
            checkUsernameAvailability(text);
        }, 500);
        return () => clearTimeout(timeoutId);
    };

    const handleRegister = async () => {
        if (!username || !email || !password || !password2) {
            Alert.alert("Error", "Please complete all fields.");
            return;
        }

        if (password !== password2) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters long.");
            return;
        }

        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (!hasUpperCase) {
            Alert.alert("Error", "Password must contain at least one uppercase letter.");
            return;
        }

        if (!hasNumber) {
            Alert.alert("Error", "Password must contain at least one number.");
            return;
        }

        if (!hasSpecialChar) {
            Alert.alert("Error", "Password must contain at least one special character (!@#$%^&*(),.?\":{}|<>).");
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
        <KeyboardAvoidingView 
            style={{ flex: 1 }} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView 
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
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
                    style={[
                        styles.input,
                        username.length > 0 && (usernameExists ? styles.inputInvalid : styles.inputValid)
                    ]}
                    value={username}
                    onChangeText={handleUsernameChange}
                    autoCapitalize="none"
                />
                {username.length > 0 && usernameExists && (
                    <Text style={styles.errorText}>Username already taken</Text>
                )}
                {username.length > 0 && !usernameExists && !checkingUsername && (
                    <Text style={styles.successText}>Username available ✓</Text>
                )}

                <Text style={styles.label}>Email</Text>
                <TextInput
                    placeholder='jan.kowalski@gmail.com'
                    placeholderTextColor="#9A8F80"
                    style={[
                        styles.input,
                        email.length > 0 && (isEmailValid(email) ? styles.inputValid : styles.inputInvalid)
                    ]}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <View style={styles.labelRow}>
                    <Text style={styles.label}>Password</Text>
                    <TouchableOpacity onPress={() => setShowPasswordInfo(!showPasswordInfo)}>
                        <Text style={styles.infoIcon}>ℹ️</Text>
                    </TouchableOpacity>
                </View>
                {showPasswordInfo && (
                    <View style={styles.passwordInfoBox}>
                        <Text style={styles.passwordInfoTitle}>Password requirements:</Text>
                        <View style={styles.requirementRow}>
                            <Text style={password.length >= 6 ? styles.checkValid : styles.checkInvalid}>
                                {password.length >= 6 ? '✓' : '✗'}
                            </Text>
                            <Text style={styles.passwordInfoItem}>At least 6 characters</Text>
                        </View>
                        <View style={styles.requirementRow}>
                            <Text style={/[A-Z]/.test(password) ? styles.checkValid : styles.checkInvalid}>
                                {/[A-Z]/.test(password) ? '✓' : '✗'}
                            </Text>
                            <Text style={styles.passwordInfoItem}>At least one uppercase letter (A-Z)</Text>
                        </View>
                        <View style={styles.requirementRow}>
                            <Text style={/[0-9]/.test(password) ? styles.checkValid : styles.checkInvalid}>
                                {/[0-9]/.test(password) ? '✓' : '✗'}
                            </Text>
                            <Text style={styles.passwordInfoItem}>At least one number (0-9)</Text>
                        </View>
                        <View style={styles.requirementRow}>
                            <Text style={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? styles.checkValid : styles.checkInvalid}>
                                {/[!@#$%^&*(),.?":{}|<>]/.test(password) ? '✓' : '✗'}
                            </Text>
                            <Text style={styles.passwordInfoItem}>At least one special character (!@#$%...)</Text>
                        </View>
                    </View>
                )}
                <TextInput
                    secureTextEntry
                    placeholder='••••••••'
                    placeholderTextColor="#9A8F80"
                    style={[
                        styles.input,
                        password.length > 0 && (isPasswordValid(password) ? styles.inputValid : styles.inputInvalid)
                    ]}
                    value={password}
                    onChangeText={setPassword}
                />

                <Text style={styles.label}>Confirm password</Text>
                <TextInput
                    secureTextEntry
                    placeholder='••••••••'
                    placeholderTextColor="#9A8F80"
                    style={[
                        styles.input,
                        password2.length > 0 && (password === password2 ? styles.inputValid : styles.inputInvalid)
                    ]}
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
            </ScrollView>
        </KeyboardAvoidingView>
  )
}

export default Register

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: '#FFFBF5',
    },

    container: {
        alignItems: 'center',
        backgroundColor: '#FFFBF5',
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 8 : 16,
        paddingHorizontal: 12,
        paddingBottom: 40,
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

    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    infoIcon: {
        fontSize: 20,
        marginLeft: 8,
    },

    passwordInfoBox: {
        backgroundColor: '#FFF8DB',
        borderWidth: 1,
        borderColor: '#E7B469',
        borderRadius: 12,
        padding: 12,
        marginTop: 8,
    },

    passwordInfoTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#6B5E4B',
        marginBottom: 6,
    },

    passwordInfoItem: {
        fontSize: 12,
        color: '#6B5E4B',
        lineHeight: 18,
        flex: 1,
    },

    requirementRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        gap: 8,
    },

    checkValid: {
        fontSize: 16,
        fontWeight: '700',
        color: '#27AE60',
        minWidth: 20,
    },

    checkInvalid: {
        fontSize: 16,
        fontWeight: '700',
        color: '#E74C3C',
        minWidth: 20,
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

    inputValid: {
        borderColor: '#27AE60',
        borderWidth: 2,
    },

    inputInvalid: {
        borderColor: '#E74C3C',
        borderWidth: 2,
    },

    errorText: {
        fontSize: 12,
        color: '#E74C3C',
        marginTop: 4,
        fontWeight: '600',
    },

    successText: {
        fontSize: 12,
        color: '#27AE60',
        marginTop: 4,
        fontWeight: '600',
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