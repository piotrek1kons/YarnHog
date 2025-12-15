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
  const [activeTab, setActiveTab] = useState<'yarn' | 'hook' | 'other'>('yarn');

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <Pressable
          onPress={() => setActiveTab('yarn')}
          style={[styles.tabButton, activeTab === 'yarn' && styles.tabButtonActive]}
        >
          <Text style={[styles.tabText, activeTab === 'yarn' && styles.tabTextActive]}>yarn</Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab('hook')}
          style={[styles.tabButton, activeTab === 'hook' && styles.tabButtonActive]}
        >
          <Text style={[styles.tabText, activeTab === 'hook' && styles.tabTextActive]}>hook</Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab('other')}
          style={[styles.tabButton, activeTab === 'other' && styles.tabButtonActive]}
        >
          <Text style={[styles.tabText, activeTab === 'other' && styles.tabTextActive]}>other</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.buttonsContainer}>
        {activeTab === 'hook' ? (
          <Pressable style={styles.material}>
              <Image style={{width: 160, height:160}} source={Materials}></Image>
              <View style={{justifyContent: 'center', paddingLeft: 12}}>
                <Text style={{fontSize: 18, fontWeight: '600'}}>Hook 3mm</Text>
                <Text style={{fontSize: 16}}>1</Text>
              </View>
          </Pressable>
        ) : (
          <Text style={styles.emptyText}>Brak materiałów w tej kategorii</Text>
        )}
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

    tabsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: '100%',
      paddingVertical: 10,
      backgroundColor: '#F9E7C6',
      borderBottomWidth: 1,
      borderBottomColor: '#E7B469'
    },
    tabButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 16,
    },
    tabButtonActive: {
      backgroundColor: '#E7B469',
    },
    tabText: {
      fontSize: 16,
      color: '#6B5E4B',
      fontWeight: '600'
    },
    tabTextActive: {
      color: '#1C1C1C',
      fontWeight: '700'
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
    },
    emptyText:{
      marginTop: 24,
      fontSize: 16,
      color: '#6B5E4B'
    }
})