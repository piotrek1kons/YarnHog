import { StyleSheet, View, Text, Image, ScrollView, Platform, StatusBar } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { db } from "../../FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

type Project = {
    title: string;
    image: string;
    materials: string;
    description: string;
};

const ProjectDetails = () => {
    const { id } = useLocalSearchParams();
    const [project, setProject] = useState<Project | null>(null);

    useEffect(() => {
        const fetchProject = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, "projects", id as string);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data() as Project;
                    setProject(data);
                } else {
                    console.log("Project does not exist");
                }
            } catch (error) {
                console.log("Project download error:", error);
            }
        };
        fetchProject();
    }, [id]);

    const materialItems = (project?.materials || "")
        .split(/[\n,]+/)
        .map((item) => item.trim())
        .filter(Boolean);

    if (!project) {
        return (
            <View style={[styles.container, styles.centered]}>
                <Text style={styles.loadingText}>Loading project...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>{project.title}</Text>

                {project.image && (
                    <Image source={{ uri: project.image }} style={styles.heroImage} />
                )}

                <View style={styles.section}>
                    <Text style={styles.label}>Materials</Text>
                    {materialItems.length ? (
                        <View style={styles.chipRow}>
                            {materialItems.map((item, index) => (
                                <View key={`${item}-${index}`} style={styles.chip}>
                                    <Text style={styles.chipText}>{item}</Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text style={styles.bodyMuted}>No materials listed</Text>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Description</Text>
                    {project.description ? (
                        <Text style={styles.body}>{project.description}</Text>
                    ) : (
                        <Text style={styles.bodyMuted}>No description available</Text>
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

export default ProjectDetails;

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
    chipRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    chip: {
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
});