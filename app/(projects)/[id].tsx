import { StyleSheet, View, Text, Image, ScrollView, Platform, StatusBar, Modal, TouchableOpacity, Pressable, Animated } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { db } from "../../FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

type ProjectSection = {
    name: string;
    description: string;
    image?: string;
};

type Project = {
    title: string;
    image: string;
    materials: string;
    sections?: ProjectSection[];
};

const parseMaterials = (text: string): string[] => {
    return text
        .split(';') // Split primarily by semicolon
        .map((item) => item.trim()) // Remove whitespace
        .filter((item) => item.length > 0) // Remove empty strings
        .map((item) => item.replace(/^\s*[\u2022•\-–—]\s*/, "")) // Remove bullets (• - – —)
        .map((item) => item.replace(/^\d+[\.\)\-]\s+/, "")) // Remove ONLY list numbering (1. 1) 1- at start)
        .map((item) => item.trim())
        .filter((item) => item.length > 0) // Remove empty after processing
        .filter((item, index, self) => self.indexOf(item) === index); // Remove exact duplicates
};

const ProjectDetails = () => {
    const { id } = useLocalSearchParams();
    const [project, setProject] = useState<Project | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [showOverlay, setShowOverlay] = useState(true);
    const fadeAnim = React.useRef(new Animated.Value(1)).current;

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

    useEffect(() => {
        const timer = setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start(() => {
                setShowOverlay(false);
            });
        }, 1500);

        return () => clearTimeout(timer);
    }, [fadeAnim]);

    const materialItems = parseMaterials(project?.materials || "");

    const sectionItems = (project?.sections || []).filter(
        (section) => section.name || section.description || section.image
    );

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
                    <TouchableOpacity onPress={() => setSelectedImage(project.image)} activeOpacity={0.9}>
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: project.image }} style={styles.heroImage} />
                            {showOverlay && (
                                <Animated.View style={[styles.imageOverlay, { opacity: fadeAnim }]}>
                                    <Text style={styles.zoomText}>🔍 Click to zoom</Text>
                                </Animated.View>
                            )}
                        </View>
                    </TouchableOpacity>
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
                    <Text style={styles.label}>Project Details</Text>
                    {sectionItems.length ? (
                        sectionItems.map((section, index) => (
                            <View key={`${section.name}-${index}`} style={styles.sectionCard}>
                                <Text style={styles.sectionTitle}>{section.name || `Section ${index + 1}`}</Text>
                                {section.image ? (
                                    <TouchableOpacity onPress={() => setSelectedImage(section.image!)} activeOpacity={0.9}>
                                        <View style={styles.imageContainer}>
                                            <Image source={{ uri: section.image }} style={styles.sectionImage} />
                                            {showOverlay && (
                                                <Animated.View style={[styles.imageOverlay, { opacity: fadeAnim }]}>
                                                    <Text style={styles.zoomText}>🔍 Click to zoom</Text>
                                                </Animated.View>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                ) : null}
                                {section.description ? (
                                    <Text style={styles.body}>{section.description}</Text>
                                ) : (
                                    <Text style={styles.bodyMuted}>No description for this section</Text>
                                )}
                            </View>
                        ))
                    ) : (
                        <Text style={styles.bodyMuted}>No details available</Text>
                    )}
                </View>
            </View>

            {/* Image Zoom Modal */}
            <Modal
                visible={!!selectedImage}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setSelectedImage(null)}
            >
                <Pressable 
                    style={styles.modalOverlay}
                    onPress={() => setSelectedImage(null)}
                >
                    <View style={styles.modalContent}>
                        <Pressable onPress={() => setSelectedImage(null)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>✕</Text>
                        </Pressable>
                        {selectedImage && (
                            <Image 
                                source={{ uri: selectedImage }} 
                                style={styles.fullImage}
                                resizeMode="contain"
                            />
                        )}
                    </View>
                </Pressable>
            </Modal>
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
    sectionCard: {
        marginTop: 10,
        padding: 12,
        backgroundColor: "#FFF8DB",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E7B469",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#6B5E4B",
        marginBottom: 8,
    },
    imageContainer: {
        position: "relative",
        marginBottom: 8,
    },
    imageOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
    },
    zoomText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "700",
        textAlign: "center",
        backgroundColor: "rgba(231, 180, 105, 0.9)",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        overflow: "hidden",
    },
    sectionImage: {
        width: "100%",
        height: 220,
        borderRadius: 10,
        resizeMode: "cover",
    },
    heroImage: {
        width: "100%",
        height: 250,
        resizeMode: "cover",
        borderRadius: 12,
    },
    chipRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 6,
    },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: "#FFF1CC",
        borderWidth: 1,
        borderColor: "#E7B469",
        marginRight: 8,
        marginBottom: 8,
    },
    chipText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#6B5E4B",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: "95%",
        height: "90%",
        position: "relative",
    },
    fullImage: {
        width: "100%",
        height: "100%",
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 10,
        backgroundColor: "#E7B469",
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    closeButtonText: {
        fontSize: 24,
        fontWeight: "700",
        color: "#1C1C1C",
    },
});