import { StyleSheet, Pressable, Image, Text, View, StatusBar, Platform, ScrollView } from 'react-native'
import { Link } from 'expo-router'

import React, {useEffect, useState} from 'react'
import { db, auth } from '../FirebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';

import NavPanel from '../components/navPanel';
import ImageButton from '../components/imageButton';
import Materials from '../assets/img/materials.png'; 



const myMaterials = () => {     
  const [activeTab, setActiveTab] = useState<'yarn' | 'hook' | 'other'>('yarn');
  const [materials, setMaterials] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchMaterials(user.uid);
      } else {
        setUserId(null);
        setMaterials([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchMaterials = async (uid: string) => {
    try {
      setLoading(true);
      const q = query(collection(db, 'materials'), where('userId', '==', uid));
      const snapshot = await getDocs(q);
      
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      setMaterials(data);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMaterials = materials.filter((material) => material.type === activeTab);

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
        {loading ? (
          <Text style={styles.emptyText}>Loading materials...</Text>
        ) : filteredMaterials.length > 0 ? (
          filteredMaterials.map((material) => (
            <View key={material.id} style={styles.material}>
              <Image style={{width: 160, height:160}} source={Materials}></Image>
              <View style={{justifyContent: 'center', paddingLeft: 12, flex: 1}}>
                <Text style={{fontSize: 18, fontWeight: '600'}}>{material.name}</Text>
                {activeTab === 'yarn' && (
                  <>
                    <Text style={{fontSize: 14, color: '#6B5E4B'}}>Color: {material.color || 'N/A'}</Text>
                    <Text style={{fontSize: 14, color: '#6B5E4B'}}>Weight: {material.weight || 'N/A'}g</Text>
                    <Text style={{fontSize: 14, color: '#6B5E4B'}}>Length: {material.length || 'N/A'}m</Text>
                  </>
                )}
                {activeTab === 'hook' && (
                  <>
                    <Text style={{fontSize: 14, color: '#6B5E4B'}}>Size: {material.size || 'N/A'}mm</Text>
                    <Text style={{fontSize: 14, color: '#6B5E4B'}}>Qty: {material.quantity || 0}</Text>
                  </>
                )}
                {activeTab === 'other' && (
                  <>
                    <Text style={{fontSize: 14, color: '#6B5E4B'}}>Category: {material.category || 'N/A'}</Text>
                    <Text style={{fontSize: 14, color: '#6B5E4B'}}>Qty: {material.quantity || 0}</Text>
                  </>
                )}
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No materials in this category</Text>
        )}
      </ScrollView>
      <View style={styles.addButton} >
        <Link href="/addMaterial">
          <Text style={styles.addButtonText}>add materials</Text>
        </Link>
      </View>
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
    },

    addButton: {
        backgroundColor: '#FFF8DB',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 15,
        marginBottom: 100,
        marginTop: 10
    },

    addButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333'
    }
})