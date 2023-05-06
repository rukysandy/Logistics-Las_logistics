import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions, 
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator
} from "react-native";  
import { Image } from 'react-native-elements';
import { Context as AuthContext } from "../../context/AuthContext"; 
import Constants from "expo-constants"; 
import "firebase/firestore";
import firebase from "firebase";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { ScrollView } from "react-native-gesture-handler";
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;
const RegEx = /^[a-zA-Z0-9_ ]*$/;
const DOCUMENT_CATEGORIES = [
  {
    label: "Operating Licenses",
    value: "Licenses",
  },
  {
    label: "Vehicle Documents",
    value: "VehicleDocs",
  },
  {
    label: "Others",
    value: "OtherDocs",
  },
];
const DOCTYPE = [
  { label: "Document", value: "Document" },
  { label: "Image", value: "Image" },
];

/* const DocUpload = (props) => { 
  const [input, setInput] = useState("")
  const [errors, setErrors]= useState({"inputError":"","typeError":"", "categoryError":""})
  const [documentType, setDocumentType] = useState(DOCTYPE)
  const [openDocType, setOpenDocType] = useState(false);
  const [valueDocType, setValueDocType] = useState(null);
  const [documentCategory, setDocumentCategory] = useState(DOCUMENT_CATEGORIES)
  const [openDocCategory, setOpenDocCategory] = useState(false);
  const [valueDocCategory, setValueDocCategory] = useState(null);
  
  return (
    <View style={{ marginTop: 20 }}> 
          <View style={styles.photoCardView}>
           {(errors.inputError !=="")&&
              <Text style={{ fontSize: 12, color: "#FF0D10", textAlign: "left", marginBottom:10 }}>
               {errors?.inputError}
              </Text> }
            <TextInput
              value={input}
              style={styles.inputStyle}
              onChangeText={(text)=>{ 
                setInput(text)
                if(input.trim().length >=3){
                  setErrors(prevState=>{
                    return{
                      ...prevState,inputError:""
                    }
                  })
              }}  
            }
              placeholder="Enter document name"
            /> 
            {(errors.typeError !=="")&&
              <Text style={{ fontSize: 12, color: "#FF0D10", textAlign: "left", marginBottom:10 }}>
               {errors?.typeError}
              </Text> }
            <DropDownPicker 
              defaultValue=""
              open={openDocType}
              value={valueDocType}
              items={documentType}
              setOpen={setOpenDocType}
              setValue={setValueDocType}
              setItems={setDocumentType}
              translation={{
                PLACEHOLDER: "Choose Document Format",
              }}
              style={{...styles.dropDownStyle, 
                marginBottom: openDocType?50:10}}
              textStyle={styles.placeHolders}
            /> 
            {(errors.categoryError !=="")&&
              <Text style={{ fontSize: 12, color: "#FF0D10", textAlign: "left", marginBottom:10 }}>
               {errors?.categoryError}
              </Text> }
             <DropDownPicker
              defaultValue=""
              open={openDocCategory}
              value={valueDocCategory}
              items={documentCategory}
              setOpen={setOpenDocCategory}
              setValue={setValueDocCategory} 
              setItems={setDocumentCategory}
              translation={{
                PLACEHOLDER: "Choose Document Type",
              }}
              style={{...styles.dropDownStyle, marginTop:openDocType?40:10,
                marginBottom: openDocCategory?40:10}}
              textStyle={styles.placeHolders}
            />
            <TouchableOpacity
              style={styles.uploadButton} 
              onPress={async()=>{ 
                console.log(" values are ", input," ",valueDocType, " ",valueDocCategory)
                if(input.trim().length <3){
                  setErrors(prevState=>{
                    return{
                      ...prevState,inputError:"invalid naming, need atleast 3 letters"
                    }
                  })
                  console.log("errors ", errors)
                  return
                }
                else if(!valueDocType){
                  setErrors(prevState=>{
                    return{
                      ...prevState,typeError:"pls select a document type"
                    }
                  })
                  console.log("errors ", errors)
                  return
                }
                else if(!valueDocCategory){
                  setErrors(prevState=>{
                    return{
                      ...prevState,categoryError:"pls select a document category"
                    }
                  })
                  console.log("errors ", errors)
                  return
                }else{
                  setErrors(prevState=>{
                    return{
                      ...prevState,"inputError":"","typeError":"", "categoryError":""
                    }
                  })
                  await props.pickImage(input, valueDocCategory);
                }
                   
                }}>
              <Text style={styles.uploadButtonText}>Upload Document</Text>
            </TouchableOpacity>
          </View>  
    </View>
  );
}; */

export default function DocumentUpload(props) {
  const { state, checkNetworkConnection } = useContext(AuthContext);
  const [progress, setProgress] = useState(0);
  const [Documents, setDocuments] = useState([]);
  useEffect(() => {
    if (props.userData?.Documents) {
      setDocuments(props.userData?.Documents);
    }
  }, [props.userData]);
  const generateRandomChars = () => {
    var length = 7;
    let a = `${Math.round(Math.random() * 10000)}`;
    let b = new Date();
    let B = b.getTime();
    let randchar = a + B;
    var trimmedString = randchar.substring(0, length);
    console.log("reference geenrated is ", trimmedString);
    return trimmedString;
  };
  const getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  const handleUpload = async (uri) => {
    await checkNetworkConnection();
    if (!state.connected) {
      return;
    }
    const storage = firebase.storage();
    //console.log('uri && global.userID ', uri, ' ', global.userID)
    //return

    if (uri && global.userID) {
      // add to image folder in firebase
      let randName = generateRandomChars();
      const imageExtension = uri.split(".")[uri.split(".").length - 1];
      //const nameString = global.userID && global.userID.split(" ").join("");
      const newName = `${randName}.${imageExtension}`;
      console.log("\nimageExtension && newName ", imageExtension, " ", newName);
      const response = await fetch(uri);
      const blob = await response.blob();
      const uploadTask = storage
        .ref(`Documents/${global.userID}/${newName}`)
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
            .ref(`Documents/${global.userID}`)
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
              //global.profileImage = url;
              firebase
                .firestore()
                .collection("Courier")
                .doc(global.userID)
                .get()
                .then((doc) => {
                  console.log("doc is ", doc);
                  let DOCUMENTS = doc.data()?.Documents;
                  if (DOCUMENTS) {
                    DOCUMENTS.push(url);
                    console.log(
                      "global.userID is ",
                      global.userID,
                      " Document A is ",
                      DOCUMENTS
                    );
                    firebase
                      .firestore()
                      .collection("Courier")
                      .doc(global.userID)
                      .update({ Documents: DOCUMENTS });
                  } else {
                    DOCUMENTS = [];
                    DOCUMENTS.push(url);
                    console.log(
                      "global.userID is ",
                      global.userID,
                      " Document B is ",
                      DOCUMENTS
                    );
                    firebase
                      .firestore()
                      .collection("Courier")
                      .doc(global.userID)
                      .update({ Documents: DOCUMENTS });
                  }
                  setDocuments(DOCUMENTS);
                  props.updateDocuments(DOCUMENTS)
                });
              console.log("successfully uploded profile image ..."); 
             
            });
        }
      );
    } else {
      Alert.alert("something went wrong. pls try again...");
      setError("Error please choose an image to upload");
    }
  };
  const _pickImage = async () => {
    await checkNetworkConnection();
    if (!state.connected) {
      return;
    }
    await getPermissionAsync();
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.cancelled) {
        await handleUpload(result.uri);
      }
    } catch (E) {
      console.log(E);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollStyle}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <View style={styles.headerView}>
          <Text style={styles.headertext}>Documents.</Text>
        </View>
        <View style={{ ...styles.plateNoCard, ...styles.shadowProp }}>
          <TouchableOpacity style={styles.uploadButton} onPress={_pickImage}>
            <Text style={styles.uploadButtonText}>Upload Document</Text>
          </TouchableOpacity>
          {(Documents.length > 0 ) && <View style={{alignSelf:"center"}}>
                {Documents.map((doc, i) => {
                  return (
                    <Image
                      key={i}
                      source={{
                        uri: doc,
                      }}
                      style={{
                        width: SCREEN_WIDTH * 0.68,
                        height: 150,
                        borderRadius: 20,
                        marginVertical:10
                      }}
                      PlaceholderContent={<ActivityIndicator size="large"
                  color="#F2F5FF"
                  style={{
                    opacity: 1,
                  }}
                  animating={true} />}
                    />
                  );
                })}
             </View>
            }
          {(progress !==0 )&& (progress !== 100) && <Text>{progress}</Text>}
        </View>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => {
            props.showCourierModal();
          }}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 100 }}></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F5FF",
    alignItems: "center",
    justifyContent: "flex-start",
    width: SCREEN_WIDTH * 0.98,
    height: SCREEN_HEIGHT,
    paddingTop: 30,
  },
  scrollStyle: {
    alignItems: "center",
    backgroundColor: "#F2F5FF",
  },
  headerView: {
    marginBottom: 20,
    width: SCREEN_WIDTH * 0.8,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderColor: "#C0C0C0",
    // alignSelf: "center",
  },
  headertext: {
    color: "#33395C",
    fontFamily: "Montserrat-Regular",
    fontSize: 22,
    textAlign: "left",
  },  
  categoryText: {
    color: "#127AC5",
    fontFamily: "Montserrat-Regular",
    fontSize: 18,
  },
  shadowProp: {
    shadowColor: "#190036",
    shadowOffset: { width: -3, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  plateNoCard: { 
    width: SCREEN_WIDTH * 0.84,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
  },  
  profileImageCard: {
    backgroundColor: "#FFFFFF",
    height: SCREEN_HEIGHT * 0.2,
    width: SCREEN_WIDTH * 0.43,
    borderRadius: 15,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  uploadButtonText: {
    color: "#FFF",
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
  }, 
  submitButton: {
    height: SCREEN_HEIGHT * 0.065,
    width: SCREEN_WIDTH * 0.8,
    backgroundColor: "#E68D41",
    borderRadius: 15, 
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
  },
  uploadButton: {
    width: SCREEN_WIDTH * 0.8,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#127AC5",
  },
});
