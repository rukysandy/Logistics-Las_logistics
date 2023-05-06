import React from "react";
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
import * as Location from "expo-location";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import firebase from "firebase";
import "firebase/firestore";

export default class NewMap extends React.Component {
  state = {
    location: {
      coords: {
        longitude: 0,
        latitude: 0,
      },
    },
    longitude: 3.41642,
    latitude: 6.45929,
    address: " ",
    showAddresses: false,
    height: 51,
    markerMoved: false,
    // profilePictureURL: "../../assets/Images//badges/badgeQuality.png",
    // badges: ["Quality"],
    showSavedLocations: false,
    showSaveOptions: false,
    savedLocations: [],
    retrievedSavedLocations: false,
  };

  _getCurrentLocationAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    // let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });
      let HideLocationAlert = await AsyncStorage.getItem("HideLocationAlert");

      if (HideLocationAlert === "true") {
        await new Promise((resolve) => {
          setTimeout(resolve, 50);
        });
        Alert.alert(
          "You have not enabled location permissions. (Phone settings).",
          "",
          [
            {
              text: "Don't show this again",
              onPress: () => AsyncStorage.setItem("HideLocationAlert", "true"),
              style: "cancel",
            },
            {
              text: "OK",
              onPress: () => {
                console.log("OK Pressed");
              },
            },
          ],
          { cancelable: false }
        );
      }
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });
      return;
    }
    try {
      //console.log('this.props.addresstoMapScreen is: ',this.props.addresstoMapScreen);

      let location = await Location.getCurrentPositionAsync({ accuracy: 5 });
      await this.setState({
        location: {
          coords: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        },
      });
      this.updateAddress(this.state.location.coords);
    } catch (err) {
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });
      alert(err);
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });
    }
  };

  _getLocationAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    // let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });
      let HideLocationAlert = await AsyncStorage.getItem("HideLocationAlert");

      if (HideLocationAlert === "true") {
        await new Promise((resolve) => {
          setTimeout(resolve, 50);
        });
        Alert.alert(
          "You have not enabled location permissions. (Phone settings).",
          "",
          [
            {
              text: "Don't show this again",
              onPress: () => AsyncStorage.setItem("HideLocationAlert", "true"),
              style: "cancel",
            },
            {
              text: "OK",
              onPress: () => {
                console.log("OK Pressed");
              },
            },
          ],
          { cancelable: false }
        );
      }
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });
      return;
    }
    try {
      //console.log('this.props.addresstoMapScreen is: ',this.props.addresstoMapScreen);

      if (
        this.props.addresstoMapScreen == null ||
        this.props.addresstoMapScreen == undefined
      ) {
        let location = await Location.getCurrentPositionAsync({ accuracy: 5 });
        await this.setState({
          location: {
            coords: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
          },
        });
      } else {
        let coords = this.props.addresstoMapScreen;
        await this.setState({
          location: {
            coords: {
              latitude: coords.latitude,
              longitude: coords.longitude,
            },
          },
        });
      }
    } catch (err) {
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });
      alert(err);
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });
    }
  };

  async componentDidMount() {
    try {
      this._getLocationAsync();
      const myUserDoc = await firebase
        .firestore()
        .collection("Users")
        .doc(global.myUID)
        .collection("Maps")
        .doc("savedLocations")
        .get();
      let myUserLocations = [];
      if (myUserDoc.exists) {
        myUserLocations = myUserDoc.data().savedLocations || [];
      }
      //console.log("componentDidMount mapScreen... gotten myUserLocations", myUserLocations)
      this.setState({
        savedLocations: myUserLocations,
        retrievedSavedLocations: true,
      });
    } catch (err) {
      console.log("\n mapScreen.js error ", err);
    }
  }

  updateMap = async (e) => {
    try {
      let address = e.replace(/ /g, "+");
      let geoData = await fetch(
        "https://maps.googleapis.com/maps/api/geocode/json?address=" +
          address +
          "&key=AIzaSyBi_IkZq2WGqptedE4IaLdt7auklRYG0jg"
      );
      let locationJSON = await geoData.json();
      // console.log('geoData is: ', locationJSON,' and location data: ', e);
      await this.setState({
        location: {
          coords: {
            longitude: locationJSON.results[0].geometry.location.lng,
            latitude: locationJSON.results[0].geometry.location.lat,
          },
        },
        address: e,
        markers: [
          {
            latlng: {
              lat: locationJSON.results[0].geometry.location.lng,
              lng: locationJSON.results[0].geometry.location.lat,
            },
            title: "CK the Handyman",
            description: "I make epic stuff!",
          },
        ],
      });
      //  console.log( 'locationJSON location data is: ',this.state.location);
      if (this.state.showSavedLocations == false) {
        this.setState({ showSaveOptions: true });
      }

      this.props.getUpdatedLocation(
        this.state.address,
        this.state.location.coords
      );
    } catch (err) {
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });
      alert("please try again", err);
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });
      console.log(err);
    }
  };

  updateAddress = async (e) => {
    try {
      // let newAddress = await Expo.Location.reverseGeocodeAsync(e);
      let lat = Math.round(e.latitude * 1000000) / 1000000;
      let lng = Math.round(e.longitude * 1000000) / 1000000;

      let address = await fetch(
        "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
          lat +
          "," +
          lng +
          "&key=" +
          "AIzaSyBi_IkZq2WGqptedE4IaLdt7auklRYG0jg"
      );
      let addressJSON = await address.json();

      let ADDRESS =
        addressJSON && addressJSON.results && addressJSON.results.length > 0
          ? addressJSON.results[0].formatted_address
          : "Unknown Location";
      console.log(
        "address returned from Google Maps API with location: ",
        e,
        " is: ",
        ADDRESS,
        "\n"
      );

      await this.setState({ address: ADDRESS });

      console.log("HERE IS THE UPDATED MARKER LOCATION ", this.state.address);
      this.props.getUpdatedLocation(ADDRESS, e);
    } catch (err) {
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });
      alert("please try again, address not updated by marker", err);
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });
      console.log(err);
    }
  };

  savedLocation = async (address, coords) => {
    let i = 0;
    let copyExists = false;
    while (i < this.state.savedLocations.length) {
      if (address === this.state.savedLocations[i].address) {
        copyExists = true;
        return true;
      }
      i++;
    }
    if (copyExists == false) {
      const tmpLocations = this.state.savedLocations;
      tmpLocations.push({
        address: address,
        coords: coords,
      });
      await this.setState({ savedLocations: tmpLocations });

      //  this.props.updateSavedLocations(this.state.savedLocations);
      console.log("saved locations are:", this.state.savedLocations);
      return false;
    }
  };

  saveThisAddress = async () => {
    this.setState({ markerMoved: false });
    if (this.state.address == null || this.state.address == " ") {
      return;
    } else {
      let sameaddress = await this.savedLocation(
        this.state.address,
        this.state.location.coords
      );
      if (sameaddress == false) {
        this.setState({ showSaveOptions: false });
      }
      if (sameaddress == true) {
        this.setState({ showSaveOptions: false });
      }
      // if (sameaddress == true ){return}

      await this.uploadSavedLocations();
    }
  };

  uploadSavedLocations = async () => {
    try {
      if (!global.myUID) {
        throw new Error("No myUID");
      }
      if (!this.state.retrievedSavedLocations) {
        throw new Error(
          "Not retrieved locations",
          this.state.retrievedSavedLocations
        );
      }
      firebase
        .firestore()
        .collection("Users")
        .doc(global.myUID)
        .collection("Maps")
        .doc("savedLocations")
        .set(
          {
            savedLocations: this.state.savedLocations,
          },
          { merge: true }
        );
    } catch (err) {
      console.log(err);
      alert("Location could not be added. Try again later");
    }
  };

  render() {
    // const badges = {
    //   Quality: require("../../images/badges/badgeQuality.png"),
    //   Affordability: require("../../images/badges/badgeAffordability.png"),
    //   Professionality: require("../../images/badges/badgeProfessionality.png"),
    //   Timeliness: require("../../images/badges/badgeTimeliness.png"),
    // };
    return (
      <View style={{ width: "100%", height: "100%" }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <MapView
            style={styles.container}
            // provider = { MapView.PROVIDER_GOOGLE }
            customMapStyle={generatedMapStyle}
            showUserLocation={true}
            region={{
              latitude: this.state.location.coords.latitude,
              longitude: this.state.location.coords.longitude,
              latitudeDelta: 0.0922 / 5,
              longitudeDelta: 0.0421 / 5,
            }}
          >
            <MapView.Marker
              //coordinate = { {latitude: this.state.location.coords.latitude, longitude:this.state.location.coords.longitude}}
              title="you"
              pinColor="green"
              description="your location"
              draggable
              coordinate={this.state.location.coords}
              onDragEnd={(e) => {
                this.setState({
                  location: {
                    coords: {
                      latitude: e.nativeEvent.coordinate.latitude,
                      longitude: e.nativeEvent.coordinate.longitude,
                    },
                  },
                  showSavedLocations: false,
                  showSaveOptions: false,
                });
                console.log("THE MARKER IS NOW AT: ", e.nativeEvent.coordinate);
                this.updateAddress(e.nativeEvent.coordinate);
                this.setState({ markerMoved: true });
              }}
            ></MapView.Marker>
          </MapView>
        </TouchableWithoutFeedback>

        <View
          style={{
            position: "absolute",
            height: this.state.height,
            top: 90,
            width: "90%",
            alignSelf: "center",
            alignItems: "center",
          }}
        >
          {/*///////////////////////////CURRENT LOCATION BUTTON/////////////////////////////////////////////////////////////////////// */}
          <View
            style={{ width: "100%", alignItems: "flex-end", paddingRight: 10 }}
          >
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{
                  alignItems: "flex-end",
                  marginTop: -30,
                  marignRight: 30,
                  width: 40,
                  borderTopLeftRadius: 15,
                  borderBottomLeftRadius: 15,
                  borderColor: "white",
                  height: 40,
                  backgroundColor: "#fff",
                  shadowColor: "#333333",
                  borderWidth: 1,
                  shadowOffset: {
                    width: 1,
                    height: 2,
                  },
                  shadowRadius: 0.5,
                  shadowOpacity: 0.3,
                }}
                onPress={() => {
                  this._getCurrentLocationAsync();
                  this.setState({
                    showSaveOptions: false,
                    showSavedLocations: false,
                    markerMoved: false,
                  });
                }}
              >
                {/* <Image
                  source={require("../../images/icons/CurrentLocationIcon.png")}
                  style={{
                    alignSelf: "center",
                    top: 7,
                    height: 25,
                    width: 21,
                    position: "absolute",
                  }}
                ></Image> */}
              </TouchableOpacity>
              {/*//////////////////////////SHOW SAVED ADDRESSES BUTTON/////////////////////////////////////////////////////////////// */}
              {this.state.savedLocations.length != 0 ? (
                <TouchableOpacity
                  style={{
                    marginTop: -30,
                    width: 40,
                    marginHorizontal: 2,
                    borderTopRightRadius: 15,
                    borderBottomRightRadius: 15,
                    backgroundColor: "#fff",
                    shadowColor: "#333333",
                    borderWidth: 1,
                    // borderColor:'#01c513',
                    borderColor: "white",
                    shadowOffset: {
                      width: 1,
                      height: 2,
                    },
                    shadowRadius: 0.5,
                    shadowOpacity: 0.3,
                  }}
                  onPress={() => {
                    this.setState({ markerMoved: false });
                    if (this.state.showSavedLocations == false) {
                      this.setState({ showSavedLocations: true });
                    }
                    if (this.state.showSavedLocations == true) {
                      this.setState({ showSavedLocations: false });
                    }
                  }}
                >
                  {/* <Text style={{paddingVertical:10, paddingHorizontal:10, color:'blue',
            fontWeight:'bold', textAlign:'center',alignSelf:'center', justifyContent:'center'}}>S</Text> */}
                  {/* <Image
                    source={require("../../images/icons/SavedLocationIcon.png")}
                    style={{
                      alignSelf: "center",
                      top: 7,
                      height: 25,
                      width: 21,
                      position: "absolute",
                    }}
                  ></Image> */}
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
          {/*///////////////////////////SAVED PLACES AND MOVED MARKER ADDRESS DISPLAY CONTAINER//////////////////////////////////////////////////////////////////////////////////////////*/}

          <View
            style={{
              backgroundColor: "white",
              width: 300,
              marginTop: 50,
              alignItems: "center",
              position: "absolute",
            }}
          >
            {/*////////////////////////////WHEN MARKER IS MOVED ADDRESS DISPLAY//////////////////////////////////////////////////////////////////////////*/}
            {this.state.markerMoved && (
              <View
                style={{
                  backgroundColor: "white",
                  position: "absolute",
                  paddingVertical: 3,
                  width: 300,
                  alignSelf: "center",
                  alignItems: "center",
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                }}
              >
                <Text style={{ color: "black", padding: 5 }}>
                  {this.state.address}
                </Text>
                <View
                  style={{
                    alignItems: "center",
                    width: "100%",
                    borderTopWidth: 1,
                    borderColor: "#999999",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      marginHorizontal: 2,
                      marginTop: 5,
                    }}
                    onPress={() => {
                      this.saveThisAddress();
                    }}
                  >
                    <Text
                      style={{
                        backgroundColor: "rgba(255,255,255,0.6)",
                        padding: 5,
                        fontSize: 12,
                        color: "grey",
                      }}
                    >
                      Add address to saved places
                    </Text>
                    <Text
                      style={{
                        padding: 3,
                        paddingHorizontal: 8,
                        color: "grey",
                        fontWeight: "bold",
                        fontSize: 16,
                        color: "#01c513",
                      }}
                    >
                      +
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {/*/////////////////////////////// ADD TO SAVED PLACES BUTTON //////////////////////////////////////////////////////////////////////////////////////////*/}

            {!!this.state.showSaveOptions && (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  marginHorizontal: 2,
                  marginTop: 10,
                  backgroundColor: "#fff",
                }}
                onPress={() => {
                  this.saveThisAddress();
                }}
              >
                <Text
                  style={{
                    backgroundColor: "rgba(255,255,255,0.6)",
                    padding: 5,
                    fontSize: 12,
                    color: "grey",
                  }}
                >
                  Add address to saved places
                </Text>
                <Text
                  style={{
                    padding: 3,
                    paddingHorizontal: 8,
                    color: "#01c513",
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  +
                </Text>
              </TouchableOpacity>
            )}

            {/* /////////////////////////////////// SAVED PLACES /////////////////////////////////////////////////////////////////////////////////*/}
            {!!this.state.showSavedLocations && (
              <View
                style={{
                  backgroundColor: "white",
                  width: 300,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    marginTop: 10,
                    padding: 2,
                    fontSize: 11,
                    fontWeight: "bold",
                    color: "#01c513",
                    textAlign: "center",
                    paddingHorizontal: 5,
                    backgroundColor: "#ffffff",
                  }}
                >
                  SAVED PLACES
                </Text>

                {this.state.savedLocations.map((location, i) => {
                  return (
                    <View
                      key={i}
                      style={{
                        flex: 1,
                        marginVertical: 3,
                        flexDirection: "row",
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          paddingVertical: 3,
                          justifyContent: "center",
                          width: "87%",
                          borderBottomWidth: 1,
                          borderColor: "#dddddd",
                        }}
                        onPress={() => {
                          this.updateMap(location.address);
                          this.setState({ showSavedLocations: false });
                        }}
                      >
                        <Text
                          style={{ paddingHorizontal: 5, color: "#555555" }}
                        >
                          {location.address}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={async () => {
                          let List = this.state.savedLocations;
                          List.splice(i, 1);
                          console.log(
                            "Here are the new saved locations after one was deleted: ",
                            List
                          );
                          await this.setState({ savedLocations: List });
                          await this.uploadSavedLocations();
                        }}
                        style={{
                          marginLeft: 2,
                          justifyContent: "center",
                          alignItems: "center",
                          width: 30,
                          height: 30,
                        }}
                      >
                        <Text
                          style={{
                            paddingHorizontal: 10,
                            fontWeight: "bold",
                            fontSize: 10,
                            textAlign: "center",
                            color: "#555555",
                          }}
                        >
                          X
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
                <View
                  style={{
                    height: 20,
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                  }}
                ></View>
              </View>
            )}
          </View>
          <GooglePlacesAutocomplete
            placeholder="what's the address?"
            minLength={2} // minimum length of text to search
            // autoFocus={false}
            returnKeyType={"search"} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            //listViewDisplayed='false'// true/false/undefined
            //fetchDetails={true}
            renderDescription={(row) => row.description} // custom description render
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true

              this.updateMap(data.description);
              this.setState({ address: data.description, height: 50 });
              console.log(
                data,
                details,
                "the address pressed is: ",
                data.description
              );
            }}
            textInputProps={{
              onChangeText: (text) => {
                let height = 400;
                if (this.state.height == 51) {
                  height = 50;
                }
                this.setState({
                  showAddresses: true,
                  height,
                  showSavedLocations: false,
                  showSaveOptions: false,
                  markerMoved: false,
                });
                text.text = this.state.address;
              },
            }}
            onCancel={() => {
              this.setState({ height: 50 });
            }}
            onRef={(r) => {
              console.log("r is", r);
            }}
            getDefaultValue={() => ""}
            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: "AIzaSyBi_IkZq2WGqptedE4IaLdt7auklRYG0jg",
              language: "en", // language of the results
              radius: 20000,

              //types: '(cities)' default: 'geocode'
            }}
            styles={{
              textInputContainer: {
                width: "100%",
                height: 50,
                paddingTop: 5,
                backgroundColor: "rgba(0,0,0,0)",
                borderTopWidth: 0,
                borderBottomWidth: 0,
                justifyContent: "flex-start",
                shadowOffset: {
                  width: 2,
                  height: 2,
                },
                shadowRadius: 2,
                shadowOpacity: 0.3,
              },
              description: {
                fontWeight: "bold",
                color: Platform.OS === "ios" ? "black" : "#e3e8ef",
                backgroundColor:
                  Platform.OS === "ios"
                    ? "rgba(255,255,255,0.5)"
                    : "rgba(0,0,0,0.5)",
              },
              predefinedPlacesDescription: {
                color: "#1faadb",
              },
            }}
            // Will add a 'Current location' button at the top of the predefined places list
            //currentLocation={true}
            currentLocationLabel="Current location"
            nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            GoogleReverseGeocodingQuery={
              {
                // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
              }
            }
            GooglePlacesSearchQuery={{
              // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
              rankby: "distance",
              types: "address",
            }}
            GoogleGeocodingQuery={{}}
            filterReverseGeocodingByTypes={[
              "locality",
              "administrative_area_level_3",
            ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
            debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
            //currentLocation= {this.getCurrentAddress(this.state.location.coords)}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#000000',
    alignItems: "center",
    justifyContent: "center",
  },
});

const generatedMapStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#242f3e",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#746855",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#242f3e",
      },
    ],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#263c3f",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#6b9a76",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#38414e",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#212a37",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9ca5b3",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#746855",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#1f2835",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#f3d19c",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [
      {
        color: "#2f3948",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#17263c",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#515c6d",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#17263c",
      },
    ],
  },
];
