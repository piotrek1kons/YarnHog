import { StyleSheet, Pressable, Image, Text, View, StatusBar, Platform, TouchableOpacity } from 'react-native'
import { Link, router } from 'expo-router'
import { auth } from '../FirebaseConfig'
import { getAuth } from 'firebase/auth';


import React from 'react'
import RowCounter from '../assets/img/row-counter.png';
import Tutorials from '../assets/img/tutorials.png';
import Projects from '../assets/img/projects.png'; 
import Materials from '../assets/img/materials.png'; 
import Profile from '../assets/img/profile.png'; 
import Community from '../assets/img/community.png';     


const Home = () => {
    getAuth().onAuthStateChanged((user) => {
        if (!user) router.replace('/');
    });


  return (
    <View style={styles.container}>
        <View style={{ marginTop: 10}}>
            <Text style={styles.header}>YARNHOG</Text>
        </View>
        <View style={styles.buttonsContainer}>
            <View style={{ alignItems: "center" }}>
                <View style={styles.buttons}>
                    <Link href="/rowCounter">
                        <Image style={{ width: 160, height: 160 }} source={RowCounter}></Image>
                    </Link>
                </View>
                <Text  style={{ marginTop: 8 }}>Row Counter</Text>
            </View>
            <View style={{ alignItems: "center" }}>
                <View style={styles.buttons}>
                    <Link href="/tutorials">
                        <Image style={{ width: 160, height: 160 }} source={Tutorials}></Image>
                    </Link>
                </View>
                <Text  style={{ marginTop: 8 }}>Tutorials</Text>
            </View>
            <View style={{ alignItems: "center" }}>
                <View style={styles.buttons}>
                    <Link href="/projects">
                        <Image style={{ width: 160, height: 160 }} source={Projects}></Image>
                    </Link>
                </View>    
                <Text  style={{ marginTop: 8 }}>Projects</Text>
            </View>
            <View style={{ alignItems: "center" }}>
                <View style={styles.buttons}>
                    <Link href="/myMaterials">
                        <Image style={{ width: 160, height: 160 }} source={Materials}></Image>
                    </Link>
                </View>    
                <Text  style={{ marginTop: 8 }}>My Materials</Text>
            </View>
            <View style={{ alignItems: "center" }}>
                <View style={styles.buttons}>
                    <Link href="/profile">
                        <Image style={{ width: 160, height: 160 }} source={Profile}></Image>
                    </Link>
                </View>    
                <Text  style={{ marginTop: 8 }}>Profile</Text>
            </View>
            <View style={{ alignItems: "center" }}>
                <View style={styles.buttons}>
                    <Link href="/community">
                        <Image style={{ width: 160, height: 160 }} source={Community}></Image>
                    </Link>
                </View>    
                <Text  style={{ marginTop: 8 }}>Community</Text>
            </View>
        </View>
        <View>
        <TouchableOpacity style={styles.logoutButton} onPress={() => auth.signOut()}>
                    <Text>LOGOUT</Text>
        </TouchableOpacity>

        </View>
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
    header: {
        fontSize: 64,
        fontFamily: 'Merriweather',
        marginBottom: 20
    },  

    buttonsContainer: {
        flexDirection: 'row',
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 20
    },

    buttons: {
        width: 160,
        height: 160,
        borderRadius: 20,
        backgroundColor: '#FFF8DB'
    },

    button:{
        width: 200,
        marginTop: 20
    },

    logoutButton:{
        width: 250,
        marginTop: 20,
        padding: 12,
        borderRadius: 8,
        backgroundColor: "#FFF8DB"
    }
})