import React, { useState, useEffect, useContext, useRef } from "react";  
import firebase from "firebase";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Input } from "react-native-elements";
import HomeMap from "../../../../Components/HomeMap";
import HomeSearch from "../../../../Components/HomeSearch";

const API_KEY = "AIzaSyDKbzMKjL7Xk7lvKFCdMa1_IZIQXMWGV84";
import "firebase/firestore";

import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";

//import firebase from "firebase";
import "firebase/firestore";
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function AddDestination({ route, navigation }) {  
  const AddressInputComponent = (props) => {
    return (
      <GooglePlacesAutocomplete
        placeholder={props.placeHolder}
        query={{
          key: API_KEY,
          language: "en", // language of the results
        }}
        onPress={(data, details) => {
          console.log(" data details", data, details)
        }}
        onFail={(error) => console.error(error)}
        suppressDefaultStyles={true}
        textInputProps={{
          InputComp: Input,
          leftIcon: {
            type: "ionicon",
            name:
              props.iconType == "iconType"
                ? "ios-location-outline"
                : "ios-flag-outline",
            color: props.iconType == "pickup" ? "#127AC5" : "#E32F8B",
          },

          errorStyle: { color: "red" },
          inputContainerStyle: props.style,
        }}
      />
    );
  };

  return (
    <>
      <HomeMap orderParameters={route?.params?.orderParameters}/>
    </>
  );
}
