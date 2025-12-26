import { StyleSheet, Text, View, StatusBar, Platform, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React from 'react';
import RowCounter from '../assets/img/row-counter.png';
import Tutorials from '../assets/img/tutorials.png';
import Projects from '../assets/img/projects.png';
import Materials from '../assets/img/materials.png';
import Profile from '../assets/img/profile.png';
import Community from '../assets/img/community.png';
import ImageButton from '../components/imageButton';

const palette = {
    background: '#FFFBF5',
    panel: '#FFF8DB',
    accent: '#E7B469',
    text: '#6B5E4B',
};

const tiles = [
    { image: RowCounter, label: 'Row Counter', link: '/rowCounter' },
    { image: Tutorials, label: 'Tutorials', link: '/tutorials' },
    { image: Projects, label: 'Projects', link: '/projects' },
    { image: Materials, label: 'My Materials', link: '/myMaterials' },
    { image: Profile, label: 'Profile', link: '/profile' },
    { image: Community, label: 'Community', link: '/community' },
];

const Home = () => {
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
            if (!user) router.replace('/');
        });

        return unsubscribe;
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.headerBlock}>
                <Text style={styles.header}>YARNHOG</Text>
                <Text style={styles.subheader}>Your cozy makerspace</Text>
            </View>

            <View style={styles.buttonsContainer}>
                {tiles.map((tile) => (
                    <ImageButton
                        key={tile.link}
                        imageSource={tile.image}
                        label={tile.label}
                        link={tile.link}
                        size={150}
                    />
                ))}
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={() => getAuth().signOut()}>
                <Text style={styles.logoutLabel}>Log out</Text>
            </TouchableOpacity>
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
        marginTop: 16,
        marginBottom: 10,
        alignItems: 'center',
    },
    header: {
        fontSize: 56,
        fontFamily: 'Merriweather',
        color: palette.text,
        letterSpacing: 1,
    },
    subheader: {
        marginTop: 6,
        fontSize: 16,
        color: '#8A7E70',
        fontWeight: '600',
    },
    buttonsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 18,
        paddingBottom: 12,
    },
    logoutButton: {
        marginTop: 22,
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 16,
        backgroundColor: palette.panel,
        borderWidth: 1,
        borderColor: palette.accent,
        shadowColor: 'rgba(0,0,0,0.12)',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 12,
        elevation: 8,
    },
    logoutLabel: {
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontWeight: '700',
        color: palette.text,
    },
});