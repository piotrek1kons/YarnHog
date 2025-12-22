import { StyleSheet, View, Text, Image, ScrollView, Platform, StatusBar} from "react-native";
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
            try{
                const docRef = doc(db, "projects", id as string);
                const docSnap = await getDoc(docRef);

                if(docSnap.exists()){
                    const data = docSnap.data() as Project;
                    setProject(data);
                }else{
                    console.log("File dosen't exist");
                }
            }catch (error){
                console.log("Project download error:", error);
            }
        };
        fetchProject();
    }, [id]);

    if(!project){
        return(
            <View style={styles.container}>
                <Text>Loading data...</Text>
            </View>
        )
    }
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{project.title}</Text>
            {project.image && <Image source={{ uri: project.image }} style={styles.image} />}
            <Text style={styles.label}>Materials:</Text>
            <Text>{project.materials}</Text>
            <Text style={styles.label}>Description:</Text>
            <Text>{project.description}</Text>
        </ScrollView>
    )
}

export default ProjectDetails;

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

  videoContainer: {
  width: "100%",
  height: 200,
  marginBottom: 60
},

});