import { StyleSheet, Pressable, Image, Text, View, StatusBar, Platform, ScrollView } from 'react-native'

import React, {useEffect, useState} from 'react'
import { db } from '../FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

import NavPanel from '../components/navPanel';
import ImageButton from '../components/imageButton';

const Projects = () => {
    type ProjectButton = { id: string; label: any; link: any; imageUrl: string };
    const [buttons, setButtons] = useState<ProjectButton[]>([]);

  useEffect(() => {
    const fetchButtons = async () => {
      const storage = getStorage();

      const snapshot = await getDocs(collection(db, "projects"));

      const data = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const item = doc.data();

          const imagePath = item.image; 

          let imageUrl = "";
          try {
            const imgRef = ref(storage, imagePath);
            imageUrl = await getDownloadURL(imgRef);
          } catch (err) {
            console.log("Błąd pobierania symbolu:", err);
          }

          return {
            id: doc.id,
            label: item.title,        
            link: `/${doc.id}`,
            imageUrl: imageUrl,     
          };
        })
      );

      setButtons(data);
    };

    fetchButtons();
  }, []);
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
})