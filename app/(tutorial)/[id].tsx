import { StyleSheet, View, Text, Image, ScrollView} from "react-native";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { db } from "../../FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { WebView } from "react-native-webview";

type Tutorial = {
    name: string;
    description: string;
    shortcut: string;
    video: string;
    image: {
        photo: string;
        symbol: string;
    };
};

const TutorialDetails = () => {
    const { id } = useLocalSearchParams();
    const [tutorial, setTutorial] = useState<Tutorial | null>(null);
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [symbolUrl, setSymbolUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchTutorial = async () => {
            if (!id) return;
            try{
                const docRef = doc(db, "tutorials", id as string);
                const docSnap = await getDoc(docRef);

                if(docSnap.exists()){
                    const data = docSnap.data() as Tutorial;
                    setTutorial(data);
                    
                    const storage = getStorage();

                    if(data.image?.photo){
                        try{
                            const photoRef = ref(storage, data.image.photo);
                            const photoDownloadUrl = await getDownloadURL(photoRef);
                            setPhotoUrl(photoDownloadUrl);
                        }catch (err){
                            console.log("Error fetching photo URL:", err);
                        }
                    }

                    if(data.image?.symbol){
                        try{
                            const symbolRef = ref(storage, data.image.symbol);
                            const symbolDownloadUrl = await getDownloadURL(symbolRef);
                            setSymbolUrl(symbolDownloadUrl);
                        }catch (err){
                            console.log("Error fetching symbol URL:", err);
                        }
                    }
                }else{
                    console.log("File dosen't exist");
                }
            }catch (error){
                console.log("Tutorial download error:", error);
            }
        };
        fetchTutorial();
    }, [id]);

    if(!tutorial){
        return(
            <View style={styles.container}>
                <Text>Loading data...</Text>
            </View>
        )
    }
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{tutorial.name}</Text>
            {photoUrl && <Image source={{ uri: photoUrl }} style={styles.image} />}
            <Text style={styles.label}>Opis:</Text>
            <Text>{tutorial.description}</Text>
            <Text style={styles.label}>Skrót:</Text>
            <Text>{tutorial.shortcut}</Text>
            <Text style={styles.label}>Video:</Text>
            <WebView
                style={{ width: "100%", height: 200 }}
                source={{ uri: tutorial.video }}
            />
            {symbolUrl && <Image source={{ uri: symbolUrl }} style={styles.symbol} />}
        </ScrollView>
    )
}

export default TutorialDetails;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#FFFBF5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
  },
  label: {
    fontWeight: "bold",
    marginTop: 12,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 12,
  },
  symbol: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginTop: 12,
  },
});