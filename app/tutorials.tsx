import { StyleSheet, Pressable, Image, Text, View, StatusBar, Platform, ScrollView } from 'react-native'
import { Link } from 'expo-router'

import React from 'react'
import RowCounter from '../assets/img/row-counter.png';
import Tutorials from '../assets/img/tutorials.png';
import Projects from '../assets/img/projects.png'; 
import Materials from '../assets/img/materials.png'; 
import Profile from '../assets/img/profile.png'; 
import Community from '../assets/img/community.png';     
import NavPanel from '../components/navPanel';


const Home = () => {
  return (
    <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.buttonsContainer}>
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
                    <Image style={{ width: 160, height: 160 }} source={Tutorials}></Image>
                </View>
                <Text  style={{ marginTop: 8 }}>Tutorials</Text>
            </View>
            <View style={{ alignItems: "center" }}>
                <View style={styles.buttons}>
                    <Image style={{ width: 160, height: 160 }} source={Projects}></Image>
                </View>    
                <Text  style={{ marginTop: 8 }}>Projects</Text>
            </View>
            <View style={{ alignItems: "center" }}>
                <View style={styles.buttons}>
                    <Image style={{ width: 160, height: 160 }} source={Materials}></Image>
                </View>    
                <Text  style={{ marginTop: 8 }}>My Materials</Text>
            </View>
            <View style={{ alignItems: "center" }}>
                <View style={styles.buttons}>
                    <Image style={{ width: 160, height: 160 }} source={Profile}></Image>
                </View>    
                <Text  style={{ marginTop: 8 }}>Profile</Text>
            </View>
            <View style={{ alignItems: "center" }}>
                <View style={styles.buttons}>
                    <Image style={{ width: 160, height: 160 }} source={Community}></Image>
                </View>    
                <Text  style={{ marginTop: 8 }}>Community</Text>
            </View>
            <View style={{ alignItems: "center" }}>
                <View style={styles.buttons}>
                    <Image style={{ width: 160, height: 160 }} source={Community}></Image>
                </View>    
                <Text  style={{ marginTop: 8 }}>Community</Text>
            </View>
            <View style={{ alignItems: "center" }}>
                <View style={styles.buttons}>
                    <Image style={{ width: 160, height: 160 }} source={Community}></Image>
                </View>    
                <Text  style={{ marginTop: 8 }}>Community</Text>
            </View>
        </ScrollView>
        <NavPanel />   
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
        gap: 20,
        paddingBottom: 100
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
    }
})