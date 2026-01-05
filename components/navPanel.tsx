import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, View, Text, Pressable, Animated, Easing, Platform, Image } from "react-native";
import { Link } from "expo-router";
import { getFirebaseImageUrl, FIREBASE_IMAGES } from '../utils/firebaseImages';

const NavPanel = () => {
    const [open, setOpen] = useState(false);
    const [imageUrls, setImageUrls] = useState({
        navArrow: '',
        tutorials: '',
        projects: '',
        profile: '',
        community: '',
        materials: '',
        home: '',
        rowCounter: ''
    });

    const heightAnim = useRef(new Animated.Value(80)).current;

    useEffect(() => {
        const loadImages = async () => {
            try {
                const [navArrow, tutorials, projects, profile, community, materials, home, rowCounter] = await Promise.all([
                    getFirebaseImageUrl(FIREBASE_IMAGES.NAV_ARROW),
                    getFirebaseImageUrl(FIREBASE_IMAGES.TUTORIALS),
                    getFirebaseImageUrl(FIREBASE_IMAGES.PROJECTS),
                    getFirebaseImageUrl(FIREBASE_IMAGES.PROFILE),
                    getFirebaseImageUrl(FIREBASE_IMAGES.COMMUNITY),
                    getFirebaseImageUrl(FIREBASE_IMAGES.MATERIALS),
                    getFirebaseImageUrl(FIREBASE_IMAGES.HOME),
                    getFirebaseImageUrl(FIREBASE_IMAGES.ROW_COUNTER),
                ]);
                
                setImageUrls({
                    navArrow,
                    tutorials,
                    projects,
                    profile,
                    community,
                    materials,
                    home,
                    rowCounter
                });
            } catch (error) {
                console.error('Error loading images:', error);
            }
        };

        loadImages();
    }, []); 

    const styles = StyleSheet.create({
        mainNavBar:{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#FFF8DB",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: heightAnim,
            marginBottom: Platform.OS === "android" ? 0 : 0, 
            alignItems: "center",
        },

        openNavBar:{
            flexDirection: 'row',
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 20,
            marginTop: 40
        },

        navButton:{
            width: '28%',
            aspectRatio: 1,
            borderRadius: 500,
            justifyContent: 'center',
            alignItems: 'center',
            
         },

         navImage:{
            aspectRatio: 1,
            borderRadius: 500,
            backgroundColor: '#F9E7C6',
            justifyContent: 'center',
            alignItems: 'center',
         },


        arrow:{
            width: 24, 
            height: 24, 
            marginTop: 10, 
            transform: [{rotate: open ? '180deg' : '0deg'}]
        }
    });

    const toggleSheet = () => {
        Animated.timing(heightAnim, {
        toValue: open ? 80 : 550, 
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
        }).start();

        setOpen(!open);
    };

    return (
        <Animated.View style={styles.mainNavBar} >
        <Pressable onPress={toggleSheet}>
            {imageUrls.navArrow ? <Image source={{ uri: imageUrls.navArrow }} style={styles.arrow} /> : null}
        </Pressable>
            {open && (
                <View style={styles.openNavBar}>
                    <View style={styles.navButton}>
                        <Pressable style={styles.navImage}><Link href="/rowCounter">{imageUrls.rowCounter ? <Image source={{ uri: imageUrls.rowCounter }} /> : null}</Link></Pressable>
                        <Text>Row Counter</Text>
                    </View>
                    <View style={styles.navButton}>
                        <Pressable style={styles.navImage}><Link href="/tutorials">{imageUrls.tutorials ? <Image source={{ uri: imageUrls.tutorials }} /> : null}</Link></Pressable>
                        <Text >Tutorials</Text>
                    </View>
                    <View style={styles.navButton}>
                        <Pressable style={styles.navImage}><Link href="/projects">{imageUrls.projects ? <Image source={{ uri: imageUrls.projects }} /> : null}</Link></Pressable>
                        <Text >Projects</Text>
                    </View>
                    <View style={styles.navButton}>
                        <Pressable style={styles.navImage}><Link href="/profile">{imageUrls.profile ? <Image source={{ uri: imageUrls.profile }} /> : null}</Link></Pressable>
                        <Text >Profile</Text>
                    </View>
                    <View style={styles.navButton}>
                        <Pressable style={styles.navImage}><Link href="/community">{imageUrls.community ? <Image source={{ uri: imageUrls.community }} /> : null}</Link></Pressable>
                        <Text >Community</Text>
                    </View>
                    <View style={styles.navButton}>
                        <Pressable style={styles.navImage}><Link href="/myMaterials">{imageUrls.materials ? <Image source={{ uri: imageUrls.materials }} /> : null}</Link></Pressable>
                        <Text >My Materials</Text>
                    </View>
                    <View style={styles.navButton}>
                        <Pressable style={styles.navImage}><Link href="/home">{imageUrls.home ? <Image style={{borderRadius: 500}} source={{ uri: imageUrls.home }} /> : null}</Link></Pressable>
                        <Text>Home</Text>
                    </View>
                    
                </View>
            )}
        </Animated.View>
  );
};

export default NavPanel;

