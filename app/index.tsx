import { StyleSheet, Text, View, StatusBar, Platform, Pressable } from 'react-native';
import { Link } from 'expo-router';

import React from 'react';
import RowCounter from '../assets/img/row-counter.png';
import Tutorials from '../assets/img/tutorials.png';
import Projects from '../assets/img/projects.png';

import ImageButton from '../components/imageButton';

const palette = {
    background: '#FFFBF5',
    panel: '#FFF8DB',
    accent: '#E7B469',
    text: '#6B5E4B',
};

const Home = () => {
    return (
        <View style={styles.container}>
            <View style={styles.headerBlock}>
                <Text style={styles.header}>YARNHOG</Text>
                <Text style={styles.subheader}>Craft without signing in</Text>
            </View>
            <View style={styles.buttonsContainer}>
                <ImageButton
                    imageSource={RowCounter}
                    label="Row Counter"
                    link="/unSignedRowCounter"
                />
                <ImageButton
                    imageSource={Tutorials}
                    label="Tutorials"
                    link="/unSignedTutorials"
                />
                <ImageButton
                    imageSource={Projects}
                    label="Projects"
                    link="/unSignedProjects"
                />
            </View>
            <View style={styles.authButtons}>
                <Pressable
                    style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]}
                >
                    <Link href="/login" style={styles.ctaLabel}>Sign in</Link>
                </Pressable>
                <Pressable
                    style={({ pressed }) => [styles.ctaSecondary, pressed && styles.ctaButtonPressed]}
                >
                    <Link href="/register" style={styles.ctaSecondaryLabel}>Sign up</Link>
                </Pressable>
            </View>
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: palette.background,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        paddingHorizontal: 12,
    },
    headerBlock: {
        marginTop: 60,
        marginBottom: 24,
        alignItems: 'center',
    },
    header: {
        fontSize: 58,
        fontFamily: 'Merriweather',
        color: palette.text,
        letterSpacing: 1,
    },
    subheader: {
        marginTop: 10,
        fontSize: 16,
        color: '#8A7E70',
        fontWeight: '600',
    },
    buttonsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 18,
        paddingBottom: 20,
    },
    authButtons: {
        width: '100%',
        alignItems: 'center',
        gap: 12,
        marginTop: 10,
        paddingBottom: 20,
    },
    ctaButton: {
        width: 260,
        paddingVertical: 14,
        borderRadius: 16,
        backgroundColor: palette.accent,
        alignItems: 'center',
        shadowColor: 'rgba(0,0,0,0.14)',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 14,
        elevation: 10,
    },
    ctaSecondary: {
        width: 260,
        paddingVertical: 14,
        borderRadius: 16,
        backgroundColor: palette.panel,
        borderWidth: 1,
        borderColor: palette.accent,
        alignItems: 'center',
    },
    ctaButtonPressed: {
        transform: [{ scale: 0.98 }],
        opacity: 0.92,
    },
    ctaLabel: {
        color: '#1C1C1C',
        fontWeight: '800',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    ctaSecondaryLabel: {
        color: palette.text,
        fontWeight: '800',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
});