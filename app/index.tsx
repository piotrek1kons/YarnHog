import { StyleSheet, Pressable, Image, Text, View, StatusBar, Platform } from 'react-native'
import { Link } from 'expo-router'

import React from 'react'
import RowCounter from '../assets/img/row-counter.png';
import Tutorials from '../assets/img/tutorials.png';
import Projects from '../assets/img/projects.png';  

import ImageButton from '../components/imageButton';

const Home = () => {
  return (
    <View style={styles.container}>
        <View style={{ marginTop: 70, marginBottom: 20 }}>
            <Text style={styles.header}>YARNHOG</Text>
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
        <View>
            <Pressable disabled={true}
                style={({ pressed }) => [
                    {
                        width: 250,
                        marginTop: 20,
                        padding: 12,
                        borderRadius: 8,
                        backgroundColor: "#FFF8DB", // kolor disabled
                        opacity: pressed ? 0.6 : 1
                    }
                ]}>
                    <Link href="/login" style={{ textAlign: "center", color: "#555", fontWeight: "bold" }}>SIGN IN!</Link>
            </Pressable>
            <Pressable disabled={true}
                style={({ pressed }) => [
                    {
                        width: 250,
                        marginTop: 20,
                        padding: 12,
                        borderRadius: 8,
                        backgroundColor: "#FFF8DB", // kolor disabled
                        opacity: pressed ? 0.6 : 1
                    }
                ]}>
                    <Link href="/register" style={{ textAlign: "center", color: "#555", fontWeight: "bold" }}>SIGN UP!</Link>
            </Pressable>

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
    }
})