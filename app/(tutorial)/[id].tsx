import { StyleSheet, View, Text, Image, ScrollView, Platform, StatusBar } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { db } from "../../FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import YouTubeVideo from "../../components/youtubeVideo";

type Tutorial = {
    name: string;
    description: string;
    shortcut: string;
    video: string;
    image: string;
};

const getYouTubeId = (url: string) => {
  const regex = /v=([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : "";
};

const TutorialDetails = () => {
    const { id } = useLocalSearchParams();
    const [tutorial, setTutorial] = useState<Tutorial | null>(null);

    useEffect(() => {
        const fetchTutorial = async () => {
            if (!id) return;
            try{
                const docRef = doc(db, "tutorials", id as string);
                const docSnap = await getDoc(docRef);

                if(docSnap.exists()){
                    const data = docSnap.data() as Tutorial;
                    setTutorial(data);
                }else{
                    console.log("File dosen't exist");
                }
            }catch (error){
                console.log("Tutorial download error:", error);
            }
        };
        fetchTutorial();
    }, [id]);

    if (!tutorial) {
        return (
            <View style={[styles.container, styles.centered]}>
                <Text style={styles.loadingText}>Loading tutorial...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>{tutorial.name}</Text>

                {tutorial.image && (
                    <Image source={{ uri: tutorial.image }} style={styles.heroImage} />
                )}

                <View style={styles.section}>
                    <Text style={styles.label}>Description</Text>
                    <Text style={styles.body}>{tutorial.description}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Shortcut</Text>
                    <View style={styles.chip}>
                        <Text style={styles.chipText}>{tutorial.shortcut || "N/A"}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Video</Text>
                    <View style={styles.videoContainer}>
                        {tutorial.video ? (
                            <YouTubeVideo videoId={getYouTubeId(tutorial.video)} />
                        ) : (
                            <Text style={styles.bodyMuted}>No video available</Text>
                        )}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

export default TutorialDetails;

const styles = StyleSheet.create({
  container: {
        padding: 16,
        paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 8 : 16,
        backgroundColor: "#FFFBF5",
  },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        fontSize: 16,
        color: "#6B5E4B",
    },
    card: {
        backgroundColor: "#FFF8DB",
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 6,
        borderWidth: 1,
        borderColor: "#E7B469",
    },
  title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#6B5E4B",
        textAlign: "center",
        marginBottom: 12,
  },
    section: {
        marginTop: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: "700",
        color: "#6B5E4B",
        marginBottom: 6,
    },
    body: {
        fontSize: 15,
        lineHeight: 22,
        color: "#1C1C1C",
    },
    bodyMuted: {
        fontSize: 14,
        color: "#8A7E70",
    },
    heroImage: {
        width: "100%",
        height: 220,
        resizeMode: "cover",
        borderRadius: 12,
        marginBottom: 12,
    },
    chip: {
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: "#FFF1CC",
        borderWidth: 1,
        borderColor: "#E7B469",
    },
    chipText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#6B5E4B",
    },
    videoContainer: {
        width: "100%",
        height: 220,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#FFF8DB",
        borderWidth: 1,
        borderColor: "#E7B469",
        marginTop: 6,
    },
});