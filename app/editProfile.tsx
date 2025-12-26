import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert, StatusBar, Platform, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { auth, db } from '../FirebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';

const EditProfile = () => {
    const router = useRouter();
    const user = auth.currentUser;

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                const ref = doc(db, 'users', user.uid);
                const snap = await getDoc(ref);
                if (snap.exists()) {
                    const data = snap.data() as any;
                    setUsername(data.username || '');
                    setAvatarUrl(data.avatarUrl || '');
                }
                setEmail(user.email || '');
            } catch (e) {
                console.log('Failed to load profile', e);
            }
        };
        fetchProfile();
    }, [user]);

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const ref = doc(db, 'users', user.uid);
            await updateDoc(ref, {
                username: username.trim(),
                avatarUrl: avatarUrl,
            });
            Alert.alert('Success', 'Profile updated.');
            router.back();
        } catch (e) {
            console.log('Update failed', e);
            Alert.alert('Error', 'Could not update profile.');
        } finally {
            setLoading(false);
        }
    };

    const uploadImage = async (uri: string): Promise<string> => {
        try {
            console.log('Converting avatar to base64...');
            
            const response = await fetch(uri);
            const blob = await response.blob();
            
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const base64 = reader.result as string;
                    console.log('Avatar converted, length:', base64.length);
                    resolve(base64);
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error('Error converting image:', error);
            throw error;
        }
    };

    const pickAndUploadAvatar = async () => {
        if (!user) return;
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('No permission', 'Allow the app to access the gallery.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });
            
            if (result.canceled) return;

            const asset = result.assets?.[0];
            if (!asset?.uri) return;

            setUploading(true);

            const imageBase64 = await uploadImage(asset.uri);
            console.log('Avatar converted to base64');

            setAvatarUrl(imageBase64);
            await updateDoc(doc(db, 'users', user.uid), {
                avatarUrl: imageBase64,
            });

            Alert.alert('Success', 'Avatar uploaded and saved.');
        } catch (e) {
            console.log('Avatar upload failed', e);
            Alert.alert('Error', 'Could not upload avatar.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Edit Profile</Text>

                <View style={styles.section}>
                    <Text style={styles.label}>Username</Text>
                    <TextInput
                        style={styles.input}
                        value={username}
                        onChangeText={setUsername}
                        placeholder="Your name"
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Email (read-only)</Text>
                    <TextInput style={styles.input} value={email} editable={false} />
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Avatar</Text>
                    {avatarUrl ? (
                        <Image source={{ uri: avatarUrl }} style={styles.avatarPreview} />
                    ) : (
                        <Text style={styles.help}>No avatar yet. Pick from gallery to add.</Text>
                    )}
                    <Pressable 
                        style={[styles.pickButton, uploading && styles.buttonDisabled]} 
                        onPress={pickAndUploadAvatar} 
                        disabled={uploading}
                    >
                        <Text style={styles.pickButtonText}>
                            {uploading ? 'Uploading...' : avatarUrl ? 'Change avatar' : 'Choose avatar'}
                        </Text>
                    </Pressable>
                </View>

                <Pressable style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSave} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? 'Saving...' : 'Save changes'}</Text>
                </Pressable>

                <Pressable style={[styles.secondaryButton]} onPress={() => router.back()}>
                    <Text style={styles.secondaryButtonText}>Cancel</Text>
                </Pressable>
            </ScrollView>
        </View>
    );
};

export default EditProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFBF5',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        paddingBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 20,
        textAlign: 'center',
        color: '#6B5E4B',
    },
    section: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B5E4B',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFF8DB',
        borderWidth: 1,
        borderColor: '#E7B469',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
        color: '#1C1C1C',
    },
    avatarPreview: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginTop: 12,
        marginBottom: 12,
        alignSelf: 'center',
        resizeMode: 'cover',
    },
    help: {
        fontSize: 12,
        color: '#6B5E4B',
        marginTop: 8,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    button: {
        backgroundColor: '#E7B469',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignItems: 'center',
        marginTop: 10,
    },
    pickButton: {
        backgroundColor: '#E7B469',
        marginTop: 8,
    },
    pickButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1C1C1C',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1C1C1C',
    },
    secondaryButton: {
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignItems: 'center',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#E7B469',
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#E7B469',
    },
});