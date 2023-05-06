import React, { useEffect, useRef } from "react";
import { View, StyleSheet, TextInput, Dimensions } from "react-native";
import Constants from "expo-constants";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Input } from "react-native-elements";
const API_KEY = "AIzaSyDKbzMKjL7Xk7lvKFCdMa1_IZIQXMWGV84";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;
const AddressInputComponent = (props) => {
  return (
    <GooglePlacesAutocomplete
      placeholder={props.placeHolder}
      query={{
        key: API_KEY,
        language: "en", // language of the results
      }}
      onPress={(data, details) => {
        console.log(" data ", data, "details", details);
        if (props.type == " pickup") {
          props.setPickupAddress(data.description);
        } else {
          props.setDropoffAddress(data.description);
        }
      }}
      onFail={(error) => console.error(error)}
      suppressDefaultStyles={true}
      styles={{
        textInputContainer: props.style,
        textInput: {
          
          height: 36,
          borderRadius: 5,
          paddingVertical: 5,
          paddingHorizontal: 10,
          fontSize: 15,
          width:'100%',
    
        },
        listView: {
        
          position: "absolute",
          bottom: 40,
  
        },
        row: {
          backgroundColor: '#FFFFFF',
          padding: 13,
          height: 44,
          flexDirection: 'row',
          width: SCREEN_WIDTH * 0.8,
        },
        separator: {
          height: 0.5,
          backgroundColor: '#c8c7cc',
        },
      }}

      // textInputProps={{
      //   InputComp: Input,
      //   // leftIcon: {
      //   //   type: "ionicon",
      //   //   name:
      //   //     props.iconType == "pickup"
      //   //       ? "ios-location-outline"
      //   //       : "ios-flag-outline",
      //   //   color: props.iconType == "pickup" ? "#127AC5" : "#E32F8B",
      //   // },

      //   errorStyle: { color: "red" },
      //   inputContainerStyle: props.style,
      // }}
    />
  );
};

export default AddressInputComponent;
