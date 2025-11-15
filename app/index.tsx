import { StyleSheet, Pressable, Image, Text, View } from 'react-native'
import React from 'react'

const Home = () => {
  return (
    <View style={styles.container}>
        <View>
            <Text style={styles.header}>YARNHOG</Text>
        </View>
        <View style={styles.buttonsContainer}>
            <View style={{ alignItems: "center" }}>
                <View style={styles.buttons}>
                    <Image style={{ width: 160, height: 160 }} source={require("../assets/row-counter.png")}></Image>
                </View>
                <Text  style={{ marginTop: 8 }}>Row Counter</Text>
            </View>
            <View style={{ alignItems: "center" }}>
                <View style={styles.buttons}>
                    <Image style={{ width: 160, height: 160 }} source={require("../assets/tutorials.png")}></Image>
                </View>
                <Text  style={{ marginTop: 8 }}>Tutorials</Text>
            </View>
            <View style={{ alignItems: "center" }}>
                <View style={styles.buttons}>
                    <Image style={{ width: 160, height: 160 }} source={require("../assets/projects.png")}></Image>
                </View>    
                <Text  style={{ marginTop: 8 }}>Projects</Text>
            </View>
        </View>
        <View>
            <Pressable disabled={true}
                style={({ pressed }) => [
                    {
                        width: 250,
                        marginTop: 20,
                        padding: 12,
                        borderRadius: 8,
                        backgroundColor: "#FFF8DB", // kolor disabled
                        opacity: pressed ? 0.6 : 1
                    }
                ]}>
                    <Text style={{ textAlign: "center", color: "#555", fontWeight: "bold" }}>
                        SIGN IN!
                    </Text>
            </Pressable>
            <Pressable disabled={true}
                style={({ pressed }) => [
                    {
                        width: 250,
                        marginTop: 20,
                        padding: 12,
                        borderRadius: 8,
                        backgroundColor: "#FFF8DB", // kolor disabled
                        opacity: pressed ? 0.6 : 1
                    }
                ]}>
                    <Text style={{ textAlign: "center", color: "#555", fontWeight: "bold" }}>
                        SIGN UP!
                    </Text>
            </Pressable>

        </View>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFBF5'
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
        gap: 20
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