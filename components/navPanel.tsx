import React, { useRef, useState } from "react";
import { StyleSheet, View, Text, Pressable, Animated, Easing, Platform, Image } from "react-native";
import NavArrow from '../assets/img/nav-arrow.png';
import Tutorials from '../assets/img/tutorials.png';
import Projects from '../assets/img/projects.png';
import Profile from '../assets/img/profile.png';
import Community from '../assets/img/community.png';
import Materials from '../assets/img/materials.png';
import Home from '../assets/img/home.png';
import RowCounter from '../assets/img/row-counter.png';
import { Link } from "expo-router";

const NavPanel = () => {
    const [open, setOpen] = useState(false);

    const heightAnim = useRef(new Animated.Value(80)).current; 

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
            <Image source={NavArrow} style={styles.arrow} />
        </Pressable>
            {open && (
                <View style={styles.openNavBar}>
                    <View style={styles.navButton}>
                        <Pressable style={styles.navImage}><Link href="/rowCounter"><Image source={RowCounter} /></Link></Pressable>
                        <Text>Row Counter</Text>
                    </View>
                    <View style={styles.navButton}>
                        <Pressable style={styles.navImage}><Link href="/tutorials"><Image source={Tutorials} /></Link></Pressable>
                        <Text >Tutorials</Text>
                    </View>
                    <View style={styles.navButton}>
                        <Pressable style={styles.navImage}><Link href="/"><Image source={Projects} /></Link></Pressable>
                        <Text >Projects</Text>
                    </View>
                    <View style={styles.navButton}>
                        <Pressable style={styles.navImage}><Link href="/profile"><Image source={Profile} /></Link></Pressable>
                        <Text >Profile</Text>
                    </View>
                    <View style={styles.navButton}>
                        <Pressable style={styles.navImage}><Link href="/"><Image source={Community} /></Link></Pressable>
                        <Text >Community</Text>
                    </View>
                    <View style={styles.navButton}>
                        <Pressable style={styles.navImage}><Link href="/"><Image source={Materials} /></Link></Pressable>
                        <Text >My Materials</Text>
                    </View>
                    <View style={styles.navButton}>
                        <Pressable style={styles.navImage}><Link href="/home"><Image style={{borderRadius: 500}} source={Home} /></Link></Pressable>
                        <Text>Home</Text>
                    </View>
                    
                </View>
            )}
        </Animated.View>
  );
};

export default NavPanel;

