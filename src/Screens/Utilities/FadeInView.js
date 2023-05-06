import React, { useEffect, useState, useContext, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform, 
  Alert,
  Animated,
} from "react-native";

const FadeInView = (props) => {
    const fadeAnim = useRef(new Animated.Value(0)).current  // Initial value for opacity: 0

    React.useEffect(() => {
        Animated.timing(
            fadeAnim,
            {
                toValue: 1,
                duration: props.duration || 2000,
                useNativeDriver: true
            }
        ).start();
    }, [fadeAnim])

    return (
        <Animated.View
            // Special animatable View
            style={{
                ...props.style,
                opacity: fadeAnim         // Bind opacity to animated value
            }}
        >
            {props.children}
        </Animated.View>
    );
}

export default FadeInView