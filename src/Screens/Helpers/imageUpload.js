import React, { useState, useContext, useEffect, useReducer } from "react";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import firebase from "firebase";
import "firebase/firestore";
import {
  StyleSheet,
  Image,
  Text,
  View,
  Alert,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Animated,
  Modal,
  Switch,
} from "react-native";

const ImageUpload = () => {
  const [progress, setProgress] = useState(0);

  const getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };
  const handleUpload = async (uri) => {
   /*  await checkNetworkConnection();
    if (!state.connected) {
      return;
    } */
    const storage = firebase.storage();
    //console.log('uri && global.userID ', uri, ' ', global.userID)
    //return
    
    if (uri && global.userID) {
      // add to image folder in firebase
      const imageExtension = uri.split(".")[uri.split(".").length - 1];
      const nameString = global.userName && global.userName.split(" ").join("");
      const newName = `${nameString}.${imageExtension}`;
      console.log("\nimageExtension && newName ", imageExtension, " ", newName);
      const response = await fetch(uri);
      const blob = await response.blob();
      const uploadTask = storage
        .ref(`UserProfilePics/${global.userID}/${newName}`)
        .put(blob);
      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          console.log(" progress value is ", progress);
          setProgress(progress);
        },
        (error) => {
          // error function ....
          console.log(error);
          setError(error);
        },
        () => {
          // complete function ....
          storage
            .ref(`UserProfilePics/${global.userID}`)
            .child(newName) // Upload the file and metadata
            .getDownloadURL() // get download url
            .then(async (url) => {
              console.log(url);
              const updateUserData = {
                type: "profileImage",
                profileImageURL: url,
                userEmail: global.userEmail,
                userID: global.userID,
                idToken: global.idToken,
              };
              global.profileImage = url;
              await setProfilePicture(url);
              await updateUserRequest(updateUserData);
              console.log("successfully uploded profile image ...");
            });
        }
      );
    } else {
      setError("Error please choose an image to upload");
    }
  };
  const _pickImage = async () => {
    /* await checkNetworkConnection();
    if (!state.connected) {
      return;
    } */
    await getPermissionAsync();
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        await handleUpload(result.uri);
      }
    } catch (E) {
      console.log(E);
    }
  };


  return (
    <View>
      <TouchableOpacity
        style={{
          borderRadius: 5,
          overflow: "hidden",
          backgroundColor: "#1A315C",
          width:20, height:20
        }}
        onPress={() => {
          if (progress === 0 || progress === 100) {
            _pickImage();
          } else {
            return;
          }
        }}
      >
        {progress !== 0 && progress !== 100 && (
          <ActivityIndicator
            size="large"
            color="#fff"
            style={{
              opacity: 1,
            }}
            animating={true}
          />
        )}
        {/* {(progress == 0 || progress == 100) && (
                <Image
                  source={
                    global.profileImage
                      ? { uri: global.profileImage }
                      : require("../../assets/PROFILE4.png")
                  }
                  style={{
                    width: 100,
                    height: 100,
                  }}
                  // resizeMode="contain"
                />
              )} */}

        {(progress == 0 || progress == 100) && (
          <Text
            style={{
              color: "white",
              backgroundColor: "rgba(0,0,0,0.2)",
              padding: 5,
              textAlign: "center",
              marginTop: -25,
              fontSize: 10,
            }}
          >
            Edit
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ImageUpload;
