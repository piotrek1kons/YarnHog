import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert, StatusBar, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { auth, db, storage } from '../FirebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, uploadString, getDownloadURL } from 'firebase/storage';
import * as FileSystem from 'expo-file-system';

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
                avatarUrl: avatarUrl.trim(),
            });
            Alert.alert('Sukces', 'Profil zaktualizowany.');
            router.back();
        } catch (e) {
            console.log('Update failed', e);
            Alert.alert('Błąd', 'Nie udało się zaktualizować profilu.');
        } finally {
            setLoading(false);
        }
    };

    const pickAndUploadAvatar = async () => {
        if (!user) return;
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Brak uprawnień', 'Zezwól aplikacji na dostęp do galerii.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.8,
            });
            if (result.canceled) return;

            const asset = result.assets?.[0];
            if (!asset?.uri) return;

            setUploading(true);

            const fileExt = (asset.fileName?.split('.').pop() || asset.uri.split('.').pop() || 'jpg').toLowerCase();
            const safeName = (username || '').trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || user.uid;
            const storagePath = `avatars/${safeName}.${fileExt}`;
            const storageRef = ref(storage, storagePath);
/*
            const base64 = await FileSystem.readAsStringAsync(asset.uri, { encoding: FileSystem.EncodingType.Base64 });
            await uploadString(storageRef, base64, 'base64');
            const url = await getDownloadURL(storageRef);

            setAvatarUrl(url);
            await updateDoc(doc(db, 'users', user.uid), {
                avatarUrl: url,
                avatarPath: storagePath,
            });
*/
            Alert.alert('Sukces', 'Avatar wgrany i zapisany w profilu.');
        } catch (e) {
            console.log('Avatar upload failed', e);
            Alert.alert('Błąd', 'Nie udało się wgrać avatara.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edytuj profil</Text>

            <View style={styles.section}>
                <Text style={styles.label}>Nazwa użytkownika</Text>
                <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Twoja nazwa"
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Email (tylko podgląd)</Text>
                <TextInput style={styles.input} value={email} editable={false} />
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Avatar</Text>
                {avatarUrl ? (
                    <Image source={{ uri: avatarUrl }} style={styles.avatarPreview} />
                ) : (
                    <Text style={styles.help}>Brak avatara. Wybierz z galerii, aby dodać.</Text>
                )}
                <Pressable style={[styles.button, styles.pickButton, uploading && styles.buttonDisabled]} onPress={pickAndUploadAvatar} disabled={uploading}>
                    <Text style={styles.buttonText}>{uploading ? 'Wgrywanie...' : 'Wybierz z galerii'}</Text>
                </Pressable>
            </View>

            <Pressable style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSave} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Zapisywanie...' : 'Zapisz zmiany'}</Text>
            </Pressable>

            <Pressable style={[styles.secondaryButton]} onPress={() => router.back()}>
                <Text style={styles.secondaryButtonText}>Anuluj</Text>
            </Pressable>
        </View>
    );
};

export default EditProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFBF5',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 20,
        textAlign: 'center',
    },
    section: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F9E7C6',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
    },
    avatarPreview: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginTop: 12,
        alignSelf: 'center',
    },
    help: {
        fontSize: 12,
        color: '#555',
        marginTop: 8,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#E7B469',
        borderRadius: 20,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    pickButton: {
        backgroundColor: '#FFD28A',
        marginTop: 8,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1C1C1C',
    },
    secondaryButton: {
        borderRadius: 20,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#E7B469',
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#E7B469',
    },
});