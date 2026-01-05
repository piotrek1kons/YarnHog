import { StyleSheet, Text, View, StatusBar, Platform, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React from 'react';
import { getFirebaseImageUrl, FIREBASE_IMAGES } from '../utils/firebaseImages';
import ImageButton from '../components/imageButton';

const palette = {
    background: '#FFFBF5',
    panel: '#FFF8DB',
    accent: '#E7B469',
    text: '#6B5E4B',
};

const Home = () => {
    const [tiles, setTiles] = useState<Array<{ image: any, label: string, link: string }>>([]);

    useEffect(() => {
        const loadImages = async () => {
            try {
                const [rowCounter, tutorials, projects, materials, profile, community] = await Promise.all([
                    getFirebaseImageUrl(FIREBASE_IMAGES.ROW_COUNTER),
                    getFirebaseImageUrl(FIREBASE_IMAGES.TUTORIALS),
                    getFirebaseImageUrl(FIREBASE_IMAGES.PROJECTS),
                    getFirebaseImageUrl(FIREBASE_IMAGES.MATERIALS),
                    getFirebaseImageUrl(FIREBASE_IMAGES.PROFILE),
                    getFirebaseImageUrl(FIREBASE_IMAGES.COMMUNITY),
                ]);
                
                setTiles([
                    { image: rowCounter, label: 'Row Counter', link: '/rowCounter' },
                    { image: tutorials, label: 'Tutorials', link: '/tutorials' },
                    { image: projects, label: 'Projects', link: '/projects' },
                    { image: materials, label: 'My Materials', link: '/myMaterials' },
                    { image: profile, label: 'Profile', link: '/profile' },
                    { image: community, label: 'Community', link: '/community' },
                ]);
            } catch (error) {
                console.error('Error loading images:', error);
            }
        };
        loadImages();
    }, []);

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