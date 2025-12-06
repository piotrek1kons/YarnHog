import { StyleSheet, Pressable, Image, Text, View, StatusBar, Platform, ScrollView } from 'react-native'
import { Link } from 'expo-router'

import React, {useEffect, useState} from 'react'
import { db } from '../FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';   

import NavPanel from '../components/navPanel';
import ImageButton from '../components/imageButton';
import Materials from '../assets/img/materials.png'; 



const myMaterials = () => {     

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.buttonsContainer}>
        <Pressable style={styles.material}>
            <Image style={{width: 160, height:160}} source={Materials}></Image>
            <Text>Hook 3mm</Text>
            <Text>1</Text>
        </Pressable>
      </ScrollView>
      <NavPanel />
    </View>
  )
}

export default myMaterials

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
    },

    material:{
        width: "95%",
        flexDirection: "row",
    }
})