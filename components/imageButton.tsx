import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from "react-native";
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
  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={{ alignItems: "center"}}>
      <Link href={link} asChild>
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          <Animated.View
            style={[
              styles.buttonContainer,
              { 
                width: size, 
                height: size,
                transform: [{ scale: scaleAnim }],
              }
            ]}
          >
            <Image 
              source={imageSource} 
              style={[styles.image, { width: size, height: size }]}
            />
            <View style={styles.overlay} />
          </Animated.View>
        </TouchableOpacity>
      </Link>
      <Text style={styles.label} numberOfLines={2}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#E7B469",
    shadowColor: "#6B5E4B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    backgroundColor: "#FFF8DB",
  },
  image: {
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(107, 94, 75, 0.08)",
    borderRadius: 24,
  },
  label: {
    marginTop: 14,
    fontSize: 13,
    fontWeight: "700",
    color: "#6B5E4B",
    textAlign: "center",
    maxWidth: 150,
    lineHeight: 18,
  },
});

export default imageButton;