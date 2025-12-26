import { StyleSheet, Pressable, Image, Text, View, StatusBar, Platform, ScrollView, Modal } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { auth, db } from "../FirebaseConfig";
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

import React, { useEffect, useState } from 'react'
import Profile from '../assets/img/profile.png'; 
import NavPanel from '../components/navPanel';
import ImageButton from '../components/imageButton';
import * as ImagePicker from 'expo-image-picker';
import { TextInput, Alert } from 'react-native';


const ProfileScreen = () => {
    const router = useRouter();
    const user = auth.currentUser;

    const [username, setUsername] = useState<string>("");
    const [avatarUrl, setAvatarUrl] = useState<string>("");
    const [userProjects, setUserProjects] = useState<any[]>([]);
    const [userPosts, setUserPosts] = useState<any[]>([]);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editUsername, setEditUsername] = useState("");
    const [editAvatarUrl, setEditAvatarUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            if(!user) return;

            try{
                const ref = doc(db, "users", user.uid);
                const snap = await getDoc(ref);

                if(snap.exists()){
                    const data = snap.data();
                    setUsername(data.username);
                    setAvatarUrl(data.avatarUrl || "");
                    setEmail(user.email || "");
                    setEditUsername(data.username);
                    setEditAvatarUrl(data.avatarUrl || "");
                }
            }catch(err){
                console.log("Error fetching user data:", err);
            }
        };
        fetchUserData();
    }, [user]);

    useEffect(() => {
        const fetchUserProjects = async () => {
            if(!user) return;

            try{
                const q = query(collection(db, "projects"), where("user_id", "==", user.uid));
                const snap = await getDocs(q);
                
                const projects = snap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
                setUserProjects(projects);
            }catch(err){
                console.log("Error fetching user projects:", err);
            }
        };
        fetchUserProjects();
    }, [user]);

    useEffect(() => {
        const fetchUserPosts = async () => {
            if(!user) return;

            try{
                const q = query(collection(db, "posts"), where("user_id", "==", user.uid));
                const snap = await getDocs(q);
                
                const posts = snap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
                setUserPosts(posts);
            }catch(err){
                console.log("Error fetching user posts:", err);
            }
        };
        fetchUserPosts();
    }, [user]);

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

            setEditAvatarUrl(imageBase64);
            Alert.alert('Success', 'Avatar selected. Click Save to confirm.');
        } catch (e) {
            console.log('Avatar upload failed', e);
            Alert.alert('Error', 'Could not upload avatar.');
        } finally {
            setUploading(false);
        }
    };

    const handleSaveProfile = async () => {
        if (!user) return;

        if (!editUsername.trim()) {
            Alert.alert('Error', 'Username cannot be empty.');
            return;
        }

        setLoading(true);
        try {
            const usernameQuery = query(collection(db, 'users'), where('username', '==', editUsername.trim()));
            const usernameSnap = await getDocs(usernameQuery);
            
            if (usernameSnap.docs.length > 0) {
                const existingUser = usernameSnap.docs[0];
                if (existingUser.id !== user.uid) {
                    Alert.alert('Error', 'This username is already taken.');
                    setLoading(false);
                    return;
                }
            }

            const ref = doc(db, 'users', user.uid);
            await updateDoc(ref, {
                username: editUsername.trim(),
                avatarUrl: editAvatarUrl,
            });

            setUsername(editUsername.trim());
            setAvatarUrl(editAvatarUrl);
            Alert.alert('Success', 'Profile updated.');
            setIsEditModalVisible(false);
        } catch (e) {
            console.log('Update failed', e);
            Alert.alert('Error', 'Could not update profile.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setEditUsername(username);
        setEditAvatarUrl(avatarUrl);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setIsEditModalVisible(false);
    };

    const handleLogout = async () => {
        await auth.signOut();
        router.replace("/");
    };

    const handleChangePassword = async () => {
        if (!user || !user.email) return;

        if (!currentPassword.trim()) {
            Alert.alert('Error', 'Please enter your current password.');
            return;
        }

        if (!newPassword.trim()) {
            Alert.alert('Error', 'Please enter a new password.');
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert('Error', 'New password must be at least 6 characters.');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);
            
            await updatePassword(user, newPassword);
            Alert.alert('Success', 'Password changed successfully.');
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            console.log('Password change failed:', error);
            if (error.code === 'auth/wrong-password') {
                Alert.alert('Error', 'Current password is incorrect.');
            } else {
                Alert.alert('Error', 'Could not change password. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Profile Section */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        {avatarUrl ? (
                            <Image 
                                style={styles.avatar} 
                                source={{ uri: avatarUrl }}
                                resizeMode="cover"
                            />
                        ) : (
                            <Image style={styles.avatar} source={Profile} />
                        )}
                    </View>
                    <Text style={styles.username}>{username || "Loading..."}</Text>
                    
                    <Pressable 
                        style={styles.editButton} 
                        onPress={() => setIsEditModalVisible(true)}
                    >
                        <Text style={styles.editButtonText}>Edit Profile</Text>
                    </Pressable>

                    <Pressable 
                        style={styles.logoutButton} 
                        onPress={handleLogout}
                    >
                        <Text style={styles.logoutButtonText}>Logout</Text>
                    </Pressable>
                </View>

                {/* My Projects Section */}
                {userProjects.length > 0 && (
                    <View style={styles.projectsCard}>
                        <Text style={styles.sectionTitle}>My Projects</Text>
                        <View style={styles.projectsGrid}>
                            {userProjects.map((project) => (
                                <View key={project.id} style={styles.projectButtonContainer}>
                                    <ImageButton
                                        imageSource={{ uri: project.image }}
                                        label={project.title}
                                        link={`/(projects)/${project.id}`}
                                        size={130}
                                        backgroundColor="#FFF8DB"
                                    />
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* My Posts Section */}
                {userPosts.length > 0 && (
                    <View style={styles.postsCard}>
                        <Text style={styles.sectionTitle}>My Posts</Text>
                        {userPosts.map((post) => (
                            <View key={post.id} style={styles.postItem}>
                                {post.image && (
                                    <Image source={{ uri: post.image }} style={styles.postImage} />
                                )}
                                <View style={styles.postContent}>
                                    <Text style={styles.postTitle}>{post.title}</Text>
                                    <Text style={styles.postPreview} numberOfLines={2}>
                                        {post.content}
                                    </Text>
                                    {post.project_title && (
                                        <Text style={styles.postProjectTag}>
                                            📌 {post.project_title}
                                        </Text>
                                    )}
                                    <View style={styles.postStats}>
                                        <Text style={styles.statText}>❤️ {post.likes?.length || 0}</Text>
                                        <Text style={styles.statText}>💬 {post.comments?.length || 0}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* Edit Profile Modal */}
            <Modal
                visible={isEditModalVisible}
                animationType="slide"
                transparent={false}
                onRequestClose={handleCancel}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Edit Profile</Text>
                    </View>

                    <ScrollView contentContainerStyle={styles.modalContent}>
                        {/* Username */}
                        <View style={styles.section}>
                            <Text style={styles.label}>Username</Text>
                            <TextInput
                                style={styles.input}
                                value={editUsername}
                                onChangeText={setEditUsername}
                                placeholder="Your name"
                                placeholderTextColor="#B0A898"
                            />
                        </View>

                        {/* Email */}
                        <View style={styles.section}>
                            <Text style={styles.label}>Email (read-only)</Text>
                            <TextInput 
                                style={styles.input} 
                                value={email} 
                                editable={false}
                                placeholderTextColor="#B0A898"
                            />
                        </View>

                        {/* Avatar */}
                        <View style={styles.section}>
                            <Text style={styles.label}>Avatar</Text>
                            {editAvatarUrl ? (
                                <View style={styles.imagePreviewContainer}>
                                    <Image source={{ uri: editAvatarUrl }} style={styles.avatarPreview} />
                                </View>
                            ) : (
                                <Text style={styles.help}>No avatar yet. Pick from gallery to add.</Text>
                            )}
                            <Pressable 
                                style={[styles.imagePickerButton, uploading && styles.buttonDisabled]} 
                                onPress={pickAndUploadAvatar} 
                                disabled={uploading}
                            >
                                <Text style={styles.imagePickerButtonText}>
                                    {uploading ? 'Uploading...' : editAvatarUrl ? 'Change avatar' : 'Choose avatar'}
                                </Text>
                            </Pressable>
                        </View>

                        {/* Change Password Section */}
                        <View style={styles.divider}>
                            <Text style={styles.dividerText}>Change Password</Text>
                        </View>

                        {/* Current Password */}
                        <View style={styles.section}>
                            <Text style={styles.label}>Current Password</Text>
                            <TextInput
                                style={styles.input}
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                placeholder="Enter current password"
                                placeholderTextColor="#B0A898"
                                secureTextEntry
                            />
                        </View>

                        {/* New Password */}
                        <View style={styles.section}>
                            <Text style={styles.label}>New Password</Text>
                            <TextInput
                                style={styles.input}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                placeholder="Enter new password"
                                placeholderTextColor="#B0A898"
                                secureTextEntry
                            />
                        </View>

                        {/* Confirm Password */}
                        <View style={styles.section}>
                            <Text style={styles.label}>Confirm New Password</Text>
                            <TextInput
                                style={styles.input}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder="Confirm new password"
                                placeholderTextColor="#B0A898"
                                secureTextEntry
                            />
                        </View>

                        {/* Buttons */}
                        <View style={styles.buttonContainer}>
                            <Pressable 
                                style={[styles.button, styles.cancelButton]} 
                                onPress={handleCancel}
                                disabled={loading}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </Pressable>
                            <Pressable 
                                style={[styles.button, styles.saveButton, loading && styles.buttonDisabled]} 
                                onPress={handleSaveProfile} 
                                disabled={loading}
                            >
                                <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save changes'}</Text>
                            </Pressable>
                        </View>

                        {(currentPassword || newPassword || confirmPassword) && (
                            <Pressable 
                                style={[styles.button, styles.changePasswordButton, loading && styles.buttonDisabled]} 
                                onPress={handleChangePassword} 
                                disabled={loading}
                            >
                                <Text style={styles.changePasswordButtonText}>
                                    {loading ? 'Changing...' : 'Change Password'}
                                </Text>
                            </Pressable>
                        )}
                    </ScrollView>
                </View>
            </Modal>

            <NavPanel/>
        </View>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFBF5', 
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },

    scrollContent: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        paddingBottom: 100,
    },

    profileCard: {
        backgroundColor: '#FFF8DB',
        borderWidth: 2,
        borderColor: '#E7B469',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },

    avatarContainer: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        borderRadius: 100,
        marginBottom: 16,
    },

    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#E7B469',
    },

    username: {
        fontSize: 24,
        fontWeight: '700',
        color: '#6B5E4B',
        marginBottom: 16,
    },

    editButton: {
        paddingVertical: 12,
        paddingHorizontal: 28,
        backgroundColor: '#E7B469',
        borderRadius: 12,
        marginBottom: 8,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 3,
    },

    editButtonText: {
        color: '#1C1C1C',
        fontSize: 15,
        fontWeight: '600',
    },

    logoutButton: {
        paddingVertical: 12,
        paddingHorizontal: 28,
        backgroundColor: '#F0E5D8',
        borderWidth: 1,
        borderColor: '#E7B469',
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
    },

    logoutButtonText: {
        color: '#6B5E4B',
        fontSize: 15,
        fontWeight: '600',
    },

    projectsCard: {
        backgroundColor: '#FFF8DB',
        borderWidth: 2,
        borderColor: '#E7B469',
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingVertical: 24,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },

    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#6B5E4B',
        marginBottom: 20,
        textAlign: 'center',
    },

    projectsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        gap: 12,
    },

    projectButtonContainer: {
        marginBottom: 12,
        alignItems: 'center',
    },

    // Modal styles
    modalContainer: {
        flex: 1,
        backgroundColor: '#FFFBF5',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    modalHeader: {
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: '#F9E7C6',
        borderBottomWidth: 1,
        borderBottomColor: '#E7B469',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#6B5E4B',
        textAlign: 'center',
    },
    modalContent: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        paddingBottom: 60,
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
    imagePreviewContainer: {
        marginBottom: 12,
        alignItems: 'center',
    },
    avatarPreview: {
        width: 120,
        height: 120,
        borderRadius: 60,
        resizeMode: 'cover',
    },
    help: {
        fontSize: 12,
        color: '#6B5E4B',
        marginTop: 8,
        marginBottom: 12,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    imagePickerButton: {
        backgroundColor: '#E7B469',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    imagePickerButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1C1C1C',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: '#F0E5D8',
        borderWidth: 1,
        borderColor: '#E7B469',
    },
    saveButton: {
        backgroundColor: '#E7B469',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B5E4B',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1C1C1C',
    },
    divider: {
        marginVertical: 24,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#E7B469',
        borderBottomWidth: 1,
        borderBottomColor: '#E7B469',
    },
    dividerText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B5E4B',
        textAlign: 'center',
    },
    changePasswordButton: {
        backgroundColor: '#E7B469',
        marginTop: 12,
    },
    changePasswordButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1C1C1C',
    },
    postsCard: {
        backgroundColor: '#FFF8DB',
        borderWidth: 2,
        borderColor: '#E7B469',
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingVertical: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    postItem: {
        backgroundColor: '#FFFBF5',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E7B469',
        flexDirection: 'column',
    },
    postImage: {
        width: '100%',
        height: 180,
        resizeMode: 'cover',
    },
    postContent: {
        padding: 14,
    },
    postTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#6B5E4B',
        marginBottom: 6,
    },
    postPreview: {
        fontSize: 13,
        color: '#1C1C1C',
        lineHeight: 18,
        marginBottom: 8,
    },
    postProjectTag: {
        fontSize: 12,
        color: '#6B5E4B',
        backgroundColor: '#F9E7C6',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 8,
        alignSelf: 'flex-start',
        fontWeight: '600',
    },
    postStats: {
        flexDirection: 'row',
        gap: 16,
    },
    statText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B5E4B',
    },
});