// import React, { useState } from "react";
// import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
// import { Dimensions, Image, Text } from "react-native";
// import { Input } from "react-native-elements";
// const SCREEN_HEIGHT = Dimensions.get("window").height;
// const SCREEN_WIDTH = Dimensions.get("window").width;

// const GooglePlacesInput = (props) => {
//   const [address, setAddress] = useState(null);
//   const [height, setHeight] = useState(null);
//   const [lat, setLat] = useState(null);
//   const [showAddresses, setShowAddresses] = useState(false);

//   const [markerMoved, setMarkerMoved] = useState(false);
//   const [showSavedLocations, setShowSavedLocations] = useState(false);
//   const [showSaveOptions, setShowSaveOptions] = useState(false);
//   const [savedLocations, setSavedLocations] = useState(false);
//   const [retrievedSavedLocations, setRetrievedSavedLocations] = useState(false);
//   const [location, setLocation] = useState({
//     coords: {
//       longitude: 0,
//       latitude: 0,
//     },
//   });

//   const updateMap = async (e) => {
//     try {
//       let address = e.replace(/ /g, "+");
//       let geoData = await fetch(
//         "https://maps.googleapis.com/maps/api/geocode/json?address=" +
//           address +
//           "&key=AIzaSyDKbzMKjL7Xk7lvKFCdMa1_IZIQXMWGV84"
//       );
//       let locationJSON = await geoData.json();
//       // console.log('geoData is: ', locationJSON,' and location data: ', e);
//       setLocation((prevState) => ({
//         ...prevState,
//         coords: {
//           longitude: locationJSON.results[0].geometry.location.lng,
//           latitude: locationJSON.results[0].geometry.location.lat,
//         },
//       }));
//       setAddress(e);

//       await this.setState({
//         // location: {
//         //   coords: {
//         //     longitude: locationJSON.results[0].geometry.location.lng,
//         //     latitude: locationJSON.results[0].geometry.location.lat,
//         //   },
//         // },
//         // address: e,
//         markers: [
//           {
//             latlng: {
//               lat: locationJSON.results[0].geometry.location.lng,
//               lng: locationJSON.results[0].geometry.location.lat,
//             },
//             title: "CK the Handyman",
//             description: "I make epic stuff!",
//           },
//         ],
//       });
//       //  console.log( 'locationJSON location data is: ',this.state.location);
//       if (this.state.showSavedLocations == false) {
//         this.setState({ showSaveOptions: true });
//       }

//       this.props.getUpdatedLocation(
//         this.state.address,
//         this.state.location.coords
//       );
//     } catch (err) {
//       await new Promise((resolve) => {
//         setTimeout(resolve, 50);
//       });
//       alert("please try again", err);
//       await new Promise((resolve) => {
//         setTimeout(resolve, 50);
//       });
//       console.log(err);
//     }
//   };

//   return (
//     <GooglePlacesAutocomplete
//       placeholder=" Enter  address?"
//       minLength={2} // minimum length of text to search
//       // autoFocus={false}
//       returnKeyType={"search"} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
//       //listViewDisplayed='false'// true/false/undefined
//       //fetchDetails={true}
//       renderDescription={(row) => row.description} // custom description render
//       onPress={(data, details = null) => {
//         // 'details' is provided when fetchDetails = true

//         this.updateMap(data.description);
//         // setAddress(data.description);
//         setHeight(50);
//         // this.setState({ address: data.description, height: 50 });
//         console.log(
//           data,
//           details,
//           "the address pressed is: ",
//           data.description
//         );
//       }}
//       textInputProps={{
//         onChangeText: (text) => {
//           let newHeight = 400;
//           if (height == 51) {
//             height = 50;
//           }
//           this.setState({
//             showAddresses: true,
//             height,
//             showSavedLocations: false,
//             showSaveOptions: false,
//             markerMoved: false,
//           });
//           text.text = this.state.address;
//         },
//       }}
//       onCancel={() => {
//         this.setState({ height: 50 });
//       }}
//       onRef={(r) => {
//         console.log("r is", r);
//       }}
//       getDefaultValue={() => ""}
//       query={{
//         // available options: https://developers.google.com/places/web-service/autocomplete
//         key: "AIzaSyDKbzMKjL7Xk7lvKFCdMa1_IZIQXMWGV84",
//         language: "en", // language of the results
//         radius: 20000,

//         //types: '(cities)' default: 'geocode'
//       }}
//       styles={{
//         textInputContainer: {
//           width: "100%",
//           height: 50,
//           paddingTop: 5,
//           backgroundColor: "rgba(0,0,0,0)",
//           borderTopWidth: 0,
//           borderBottomWidth: 0,
//           justifyContent: "flex-start",
//           shadowOffset: {
//             width: 2,
//             height: 2,
//           },
//           shadowRadius: 2,
//           shadowOpacity: 0.3,
//         },
//         description: {
//           fontWeight: "bold",
//           color: Platform.OS === "ios" ? "black" : "#e3e8ef",
//           backgroundColor:
//             Platform.OS === "ios" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
//         },
//         predefinedPlacesDescription: {
//           color: "#1faadb",
//         },
//       }}
//       // Will add a 'Current location' button at the top of the predefined places list
//       //currentLocation={true}
//       currentLocationLabel="Current location"
//       nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
//       GoogleReverseGeocodingQuery={
//         {
//           // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
//         }
//       }
//       GooglePlacesSearchQuery={{
//         // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
//         rankby: "distance",
//         types: "address",
//       }}
//       GoogleGeocodingQuery={{}}
//       filterReverseGeocodingByTypes={[
//         "locality",
//         "administrative_area_level_3",
//       ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
//       debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
//       //currentLocation= {this.getCurrentAddress(this.state.location.coords)}
//     />
//     // <GooglePlacesAutocomplete
//     //   query={{
//     //     key: "AIzaSyDKbzMKjL7Xk7lvKFCdMa1_IZIQXMWGV84",
//     //     language: "en",
//     //   }}
//     //   // placeholder="Search"
//     //   onPress={(data, details = null) => {
//     //     // 'details' is provided when fetchDetails = true
//     //     console.log( "datadetails",data, details);
//     //   }}
//     //   listViewDisplayed='True'
//     //   minLength={2}
//     //   listViewDisplayed='auto'
//     //   autoFocus={false}
//     //   returnKeyType={"default"}
//     //   fetchDetails={true}
//     //   suppressDefaultStyles={true}
//     //   enablePoweredByContainer={false}
//     //   // renderDescription={row => row.description}onPress={(data, details = null) => {
//     //   //   // 'details' is provided when fetchDetails = true
//     //   //   setAddress(data.description)
//     //   //   setCoordinates( `${details.geometry.location.lat},${details.geometry.location.lng}` )

//     //   //   console.log("Adresses",  address)
//     //   // }}

//     //   textInputProps={{
//     //     label: "From",
//     //     InputComp: Input,
//     //     leftIcon: (
//     //       <Image
//     //         style={{
//     //           height: SCREEN_HEIGHT * 0.040,
//     //           width: 19,
//     //           resizeMode: "contain",
//     //         }}
//     //         resizeMode="contain"
//     //         source={require("../../../assets/Images/LOCATIONFROM/FROM2.png")}
//     //       />
//     //     ),
//     //     // errorStyle: { color: "red" },
//     //     placeholder: 'enter "pick up " address',
//     //     inputContainerStyle: props.inputStyle,
//     //     leftIconContainerStyle: {
//     //       paddingHorizontal: 10,
//     //       marginHorizontal: 10,
//     //     },
//     //   }}

//     // />
//   );
// };

// export default GooglePlacesInput;

import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  Platform,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView from "react-native-maps";
import Constants from "expo-constants";
import * as Location from "expo-location";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
const Maps = () => {
  const [location, setLocation] = useState({
    coords: {
      longitude: 0,
      latitude: 0,
    },
  });
  const [errorMsg, setErrorMsg] = useState(null);

  const _getCurrentLocationAsync = async (e) => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    // setLocation(location);
    setLocation((prevState) => ({
      ...prevState,
      coords: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    }));
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS === "android" && !Constants.isDevice) {
        setErrorMsg(
          "Oops, this will not work on Snack in an Android emulator. Try it on your device!"
        );
        return;
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation((prevState) => ({
        ...prevState,
        coords: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      }));
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{text}</Text>
    </View>
  );
};
export default Maps;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: "center",
  },
});
