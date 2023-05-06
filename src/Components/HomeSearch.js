import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { AntDesign, MaterialIcons, Entypo, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AddressInputComponent from "./AddressInputComponent";
import "firebase/firestore";
// import { useNavigation } from "@react-navigation/native";
// import { TouchableOpacity } from "react-native-gesture-handler";
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;
const HomeSearch = (props) => {
  const navigation = useNavigation();
  const [pickupAddress, setPickupAddress] = useState(" ");
  const [dropoffAddress, setDropoffAddress] = useState(" ");
  const [pickupCoords, setPickUpCoords] = useState(6.45407);
  const [dropoffCoords, setDopOffCoords] = useState(3.39467);
  const [orderParameters, setOrderParameters] = useState({});
  const updateMap = async (e, type) => {
    try {
      let address = e.replace(/ /g, "+");
      let geoData = await fetch(
        "https://maps.googleapis.com/maps/api/geocode/json?address=" +
          address +
          "&key=AIzaSyDKbzMKjL7Xk7lvKFCdMa1_IZIQXMWGV84"
      );
      let locationJSON = await geoData.json();
      // console.log('geoData is: ', locationJSON,' and location data: ', e);
      console.log(" locationJSON is ", locationJSON);
      if (type == " Pickup") {
        setPickUpCoords({
          coords: {
            longitude: locationJSON.results[0].geometry.location.lng,
            latitude: locationJSON.results[0].geometry.location.lat,
          },
        });
      } else {
        setDopOffCoords({
          coords: {
            longitude: locationJSON.results[0].geometry.location.lng,
            latitude: locationJSON.results[0].geometry.location.lat,
          },
        });
      }

      /* s */
      //  console.log( 'locationJSON location data is: ',this.state.location);
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
  useEffect(() => {
    if (props?.orderParameters) {
      setOrderParameters(props.orderParameters);
    }
    // console.log("OrderParameters in HomeSearch  are ... ", props.orderParameters);
    console.log(
      "OrderParameters set with new values are ... ",
      orderParameters
    );
  }, []);
  return (
    <View
      style={{
        backgroundColor: "white",
        height:
          SCREEN_HEIGHT >= 800 ? SCREEN_HEIGHT * 0.4 : SCREEN_HEIGHT * 0.4,
        width: "100%",
        top: SCREEN_HEIGHT >= 800 ? 470 : 340,

        borderRadius: 15,
        paddingTop: 20,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-start",
          // backgroundColor: "yellow",
          margin:
            SCREEN_HEIGHT >= 800 ? SCREEN_HEIGHT * 0.04 : SCREEN_HEIGHT * 0.017,
        }}
      >
        <Ionicons name="location" size={35} color="#FF33A5" />
        <AddressInputComponent
          style={styles.pinkcard}
          placeHolder=" ENTER PICKUP LOCATION"
          type={" pickup"}
          setPickupAddress={async (e) => {
            setPickupAddress(e);
            setOrderParameters((prevState) => {
              return {
                ...prevState,
                pickupLocation: e,
              };
            });
            await updateMap(e, " Pickup");
          }}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-start",
          // backgroundColor: "yellow",
          margin: 15,
          padding: 5,
        }}
      >
        <Ionicons name="location" size={34} color="#335FFF" />

        <AddressInputComponent
          style={styles.bluecard}
          placeHolder="ENTER DROPOFF  LOCATION"
          type={" dropoff"}
          setDropoffAddress={async (e) => {
            setDropoffAddress(e);
            setOrderParameters((prevState) => {
              return {
                ...prevState,
                destination: e,
              };
            });
            await updateMap(e, " Dropoff");
          }}
        />
      </View>
      <TouchableOpacity
        style={{
          height: 50,
          width: "90%",
          backgroundColor: "#335FFF",
          padding: 10,
          margin: 5,
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
          borderRadius: 15,
        }}
        disabled={!pickupCoords && !dropoffCoords}
        onPress={() => {
          navigation.navigate("HomeMapRoute", {
            coordinates: { pickupCoords, dropoffCoords },
            orderParameters: {
              ...orderParameters,
              coordinates: { pickupCoords, dropoffCoords },
            },
          });
        }}
      >
        <Text style={{ color: "#FFF", fontSize: 20 }}> Next</Text>
        <TouchableOpacity style={{ height: 0 }} />
      </TouchableOpacity>
    </View>
  );
};

export default HomeSearch;

const styles = StyleSheet.create({
  // container: {
  //   backgroundColor: "#FFFFFF",
  //   height: 200,
  //   width: 400,
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
  // inputBox: {
  //   backgroundColor: "#e7e7e7",
  //   margin: 10,
  //   padding: 10,
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  // },
  bluecard: {
    // paddingVertical: 8,
    width: SCREEN_WIDTH * 0.8,
    // paddingHorizontal: 5,
    backgroundColor: "#F2F5FF",
    borderColor: "#127AC533",
    borderWidth: 1,
    borderRadius: 15,
    // flexDirection: "row",
    alignItems: "center",
    justifyContent:'center',
    // marginTop: 15,
    padding: 15,
    height: 43,
  },
  pinkcard: {
    //height: 50,
    // paddingVertical: 8,
    width: SCREEN_WIDTH * 0.8,
    padding: 10,
    backgroundColor: "#FFEFF7",
    borderColor: "#E32F8B33",
    borderWidth: 1,
    borderRadius: 15,
    padding: 15,

    // flexDirection: "row",
    alignItems: "center",
    justifyContent:'center',
    // marginTop: 15,
    height: 43,
  },
  inputText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#434343",
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 100,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 50,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderColor: "#dbdbdb",
    backgroundColor: "#fff",
  },
  iconContainer: {
    backgroundColor: "#b3b3b3",
    padding: 10,
    borderRadius: 25,
  },
  destinationText: {
    marginLeft: 10,
    fontWeight: "500",
    fontSize: 16,
  },
  textContainer: {
    alignSelf: "flex-start",
  },
});
