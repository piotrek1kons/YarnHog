import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

interface imageButton {
  imageSource: any;       
  label: string;          
  link: string;           
  size?: number;          
  backgroundColor?: string; 
}

const imageButton: React.FC<imageButton> = ({
  imageSource,
  label,
  link,
  size = 160,
  backgroundColor = "#FFF8DB",
}) => {
  return (
    <View style={{ alignItems: "center"}}>
      <Link href={link} asChild style={{backgroundColor: backgroundColor, borderRadius: 20}}>
        <TouchableOpacity
          style={[styles.button, { width: size, height: size }]}
        >
          <Image source={imageSource} style={{ width: size, height: size }} />
        </TouchableOpacity>
      </Link>
      <Text style={{ marginTop: 8 }}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default imageButton;