import { StyleSheet, Pressable, Image, Text, View, StatusBar, Platform, ScrollView } from 'react-native'
import { Link } from 'expo-router'

import React, {useEffect, useState} from 'react'
import { db, auth } from '../FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

import NavPanel from '../components/navPanel';
import ImageButton from '../components/imageButton';

const Projects = () => {
    type ProjectButton = { id: string; label: any; link: any; imageUrl: string };
    const [buttons, setButtons] = useState<ProjectButton[]>([]);
    const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchButtons = async () => {
      const snapshot = await getDocs(collection(db, "projects"));

      const data = snapshot.docs
        .filter(doc => {
          const item = doc.data();
          // Pokaż jeśli: projekt jest publiczny LUB należy do zalogowanego użytkownika
          return item.is_public === true || item.user_id === userId;
        })
        .map((doc) => {
          const item = doc.data();

          return {
            id: doc.id,
            label: item.title,        
            link: `/${doc.id}`,
            imageUrl: item.image, // Direct base64 or URL
          };
        });

      setButtons(data);
    };

    fetchButtons();
  }, [userId]);
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.buttonsContainer}>
        {buttons.map((btn: any) => (
          <ImageButton
            key={btn.id}
            imageSource={{ uri: btn.imageUrl }}
            label={btn.label}
            link={btn.link}
          
          />
        ))}
      </ScrollView>
      
      <View style={styles.addButton}>
        <Link href="/addProjects">
          <Text style={styles.addButtonText}>Add Project</Text>
        </Link>
      </View>
      
      <NavPanel />
    </View>
  )
}

export default Projects

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