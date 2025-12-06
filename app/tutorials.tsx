import { StyleSheet, Pressable, Image, Text, View, StatusBar, Platform, ScrollView } from 'react-native'
import { Link } from 'expo-router'

import React, {useEffect, useState} from 'react'
import { db } from '../FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage'; 
    
import NavPanel from '../components/navPanel';
import ImageButton from '../components/imageButton';

const tutorials = () => {
    type TutorialButton = { id: string; label: any; link: any; imageUrl: string };
    const [buttons, setButtons] = useState<TutorialButton[]>([]);

  useEffect(() => {
    const fetchButtons = async () => {
      const storage = getStorage();

      const snapshot = await getDocs(collection(db, "tutorials"));

      const data = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const item = doc.data();

          const symbolPath = item.image?.symbol; 

          let symbolUrl = "";
          try {
            const imgRef = ref(storage, symbolPath);
            symbolUrl = await getDownloadURL(imgRef);
          } catch (err) {
            console.log("Błąd pobierania symbolu:", err);
          }

          return {
            id: doc.id,
            label: item.name,        
            link: "/tutorial/" + doc.id,
            imageUrl: symbolUrl,     
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
            imageSource={{ uri: btn.imageUrl }}
            label={btn.label}
            link="/home"
            
          />
        ))}
      </ScrollView>

      <NavPanel />
    </View>
  )
}

export default tutorials

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