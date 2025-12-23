import { StyleSheet, Pressable, Image, Text, View, StatusBar, Platform, ScrollView, FlatList } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { auth, db } from "../FirebaseConfig";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

import React, { useEffect, useState } from 'react'
import RowCounter from '../assets/img/row-counter.png';
import Tutorials from '../assets/img/tutorials.png';
import Projects from '../assets/img/projects.png'; 
import Materials from '../assets/img/materials.png'; 
import Profile from '../assets/img/profile.png'; 
import Community from '../assets/img/community.png';     
import NavPanel from '../components/navPanel';
import ImageButton from '../components/imageButton';


const Home = () => {
    const router = useRouter();
    const user = auth.currentUser;

    const [username, setUsername] = useState<string>("");
    const [avatarUrl, setAvatarUrl] = useState<string>("");
    const [userProjects, setUserProjects] = useState<any[]>([]);

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

    const handleLogout = async() => {
        await auth.signOut();
        router.replace("/");
    }

  return (
    <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.profileSection}>
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
                <Pressable style={styles.editButton} onPress={() => router.push('/editProfile')}>
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                </Pressable>
            </View>

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
        </ScrollView>
        <NavPanel/>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFBF5', 
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },

    scrollContent: {
        alignItems: 'center',
        paddingBottom: 100,
    },

    profileSection: {
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
        paddingHorizontal: 20,
    },

    avatarContainer: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        borderRadius: 100,
    },

    avatar: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 4,
        borderColor: '#E7B469',
    },

    username: {
        fontSize: 26,
        fontWeight: '700',
        color: '#6B5E4B',
        marginTop: 24,
        marginBottom: 12,
    },

    editButton: {
        marginTop: 8,
        paddingVertical: 12,
        paddingHorizontal: 28,
        backgroundColor: '#E7B469',
        borderRadius: 24,
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

    projectsSection: {
        width: '100%',
        paddingHorizontal: 16,
        marginTop: 20,
        marginBottom: 20,
    },

    projectsCard: {
        width: '90%',
        marginHorizontal: '5%',
        marginTop: 30,
        marginBottom: 20,
        paddingHorizontal: 20,
        paddingVertical: 24,
        backgroundColor: '#FFF8DB',
        borderRadius: 24,
        borderWidth: 2,
        borderColor: '#E7B469',
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
})