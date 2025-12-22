import { StyleSheet, Pressable, Image, Text, View, StatusBar, Platform, ScrollView } from 'react-native'

import React, {useEffect, useState} from 'react'
import { db } from '../../FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

    
import ImageButton from '../../components/imageButton';

const unSignedProjects = () => {
    type ProjectButton = { id: string; label: any; link: any; imageUrl: string };
    const [buttons, setButtons] = useState<ProjectButton[]>([]);

  useEffect(() => {
    const fetchButtons = async () => {
      const snapshot = await getDocs(collection(db, "projects"));

      const data = snapshot.docs
        .filter(doc => doc.data().is_public === true)
        .map((doc) => {
          const item = doc.data();

          return {
            id: doc.id,
            label: item.title,        
            link: `/${doc.id}`,
            imageUrl: item.image || '',     
          };
        });

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

    </View>
  )
}

export default unSignedProjects

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