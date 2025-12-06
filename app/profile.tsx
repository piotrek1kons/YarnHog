import { StyleSheet, Pressable, Image, Text, View, StatusBar, Platform } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { auth, db } from "../FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

import React, { useEffect, useState } from 'react'
import RowCounter from '../assets/img/row-counter.png';
import Tutorials from '../assets/img/tutorials.png';
import Projects from '../assets/img/projects.png'; 
import Materials from '../assets/img/materials.png'; 
import Profile from '../assets/img/profile.png'; 
import Community from '../assets/img/community.png';     
import NavPanel from '../components/navPanel';


const Home = () => {
    const router = useRouter();
    const user = auth.currentUser;

    const [username, setUsername] = useState<string>("");

    useEffect(() => {
        const fetchUserData = async () => {
            if(!user) return;

            try{
                const ref = doc(db, "users", user.uid);
                const snap = await getDoc(ref);

                if(snap.exists()){
                    const data = snap.data();
                    setUsername(data.username);
                }
            }catch(err){
                console.log("Error fetching user data:", err);
            }
        };
        fetchUserData();
    }, [user]);

    const handleLogout = async() => {
        await auth.signOut();
        router.replace("/");
    }

  return (
    <View style={styles.container}>
        
        <View style={styles.profil}>
            <Image style={styles.profil} source={Profile}></Image>
            <Text style={{fontSize: 24, fontWeight: 'bold'}}>{username || "Loading..."}</Text>
        </View>
        <View style={{marginTop: 50}}>
            <Text style={{margin: 10, fontSize: 18, fontWeight: 'bold'}}>Email:</Text>
            <View style={styles.block}>
            </View>

        </View>
        <NavPanel/>
    </View>
    
  )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFFBF5', 
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },

    profil:{
        width: 200,
        height: 200,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },

    block: {
        width: 300,
        height: 200,
        backgroundColor: '#F9E7C6',
        borderRadius: 20,
        
    },  

    
})