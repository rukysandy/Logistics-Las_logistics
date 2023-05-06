import React, { useState, useEffect } from "react";
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
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { getDistance, getPreciseDistance } from "geolib";
import MapViewDirections from "react-native-maps-directions";
import HomeSearch from "../../../../Components/HomeSearch";
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

const HomeMapRoute = ({ route, navigation }) => {
  const [coordinates, setCoordinates] = useState(0);
  const [pickupLocation, setPickupLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [dropoffLocation, setdropoffLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [orderParameters, setOrderParameters] = useState({});
  const [totalDistance, setTotalDistance] = useState(0);
  const [price, setPrice] = useState(5000);
  const CourierDetails = [
    {
      id: "0",
      type: "RIDE",
      speedLimit: 15.65, // m/s
      baseTime: 600, //  seconds
      baseCharge: 0, //Naira
      tripRate: 0.425, //Naira per Minute
      DRM: 0,
    },
    {
      id: "1",
      type: "2T-Truck",
      speedLimit: 15.65, // m/s
      baseTime: 600, //  seconds
      baseCharge: 0, //Naira
      tripRate: 0.425, //Naira per Minute
      DRM: 0,
    },
    {
      id: "2",
      type: "5T-Truck",
      speedLimit: 15.65, // m/s
      baseTime: 600, //  seconds
      baseCharge: 0, //Naira
      tripRate: 0.425, //Naira per Minute
      DRM: 0,
    },
    {
      id: "3",
      type: "20T-Truck",
      speedLimit: 15.65, // m/s
      baseTime: 600, //  seconds
      baseCharge: 0, //Naira
      tripRate: 0.425, //Naira per Minute
      DRM: 0,
    },

    {
      id: "4",
      type: "ferry",
      speedLimit: 15.65, // m/s
      baseTime: 600, //  seconds
      baseCharge: 0, //Naira
      tripRate: 0.425, //Naira per Minute
      DRM: 0,
    },
    {
      id: "5",
      type: "Air-C1",
      speedLimit: 15.65, // m/s
      baseTime: 600, //  seconds
      baseCharge: 0, //Naira
      tripRate: 0.425, //Naira per Minute\
      DRM: 0,
    },
    {
      id: "6",
      type: "Air-C2",
      speedLimit: 15.65, // m/s
      baseTime: 600, //  seconds
      baseCharge: 0, //Naira
      tripRate: 0.425, //Naira per Minute
      DRM: 0,
    },
  ];

  useEffect(() => {
    (async () => {
      if (route?.params?.coordinates) {
        setCoordinates(route.params.coordinates);
        setPickupLocation(route.params.coordinates.pickupCoords.coords);
        setdropoffLocation(route.params.coordinates.dropoffCoords.coords);
      }
      console.log("pickup coordinates  are ... ", pickupLocation);
      console.log(" dropoff coordinates  are ... ", dropoffLocation);
    })();
  }, []);
  useEffect(() => {
    if (route?.params?.orderParameters) {
      setOrderParameters(route?.params?.orderParameters);
    }

    // console.log(
    //   "OrderParameters in HomeMapRoute  are ... ",
    //   route?.params?.orderParameters
    // );
    // console.log(
    //   "OrderParameters set with new values are ... ",
    //   orderParameters
    // );

    const routeDistance = getPreciseDistance(
      {
        latitude: pickupLocation.latitude,
        longitude: pickupLocation.longitude,
      },
      {
        latitude: dropoffLocation.latitude,
        longitude: dropoffLocation.longitude,
      }
    );
    console.log("distance route", routeDistance);

    setTotalDistance(routeDistance);
    console.log("distance from state", totalDistance);

    setOrderParameters({ ...orderParameters, price });
    console.log("oda params ", orderParameters);

    // console.log("new order params", orderParameters);

    // const costObject = CourierDetails.filter(
    //   (details) => details.type == orderParameters.carrierType
    // );
    // console.log("Total cost is :", costObject[0]);

    // const costObject = CourierDetails.find(
    //   (row) => row.type === orderParameters.carrierType
    // );
    // console.log(" new Total cost is :", costObject);
  });
  // useEffect(() => {
  //   if (route?.params?.coordinates) {
  //     setCoordinates(route?.params?.coordinates);
  //     setPickupLocation(route?.params?.coordinates?.pickupCoords);
  //     setdropoffLocation(route?.params?.coordinates?.dropoffCoords);
  //     // let data = route?.params?.coordinates;
  //     // (data["email"] = user?.email), (data["userID"] = global?.userID);
  //     // setOrderParameters(data);
  //   }
  //   console.log("coordinates  are ... ", pickupLocation);
  //   console.log("coordinates  are ... ", dropoffLocation);
  // }, []);
  const getImage = (type) => {
    if (type === "bike") {
      return require("../../../../assets/Images/BIKE/BIKE3.png");
    }
    if (type === "2T-Truck") {
      return require("../../../../assets/Images/TRUCK/TRUCK3.png");
    }
    if (type === "5T-Truck") {
      return require("../../../../assets/Images/TRUCK/TRUCK3.png");
    }

    if (type === "20T-Truck") {
      return require("../../../../assets/Images/TRUCK/TRUCK3.png");
    }
    if (type === "ferry") {
      return require("../../../../assets/Images/SHIP/SHIP3.png");
    }
    if (type === "Air-C1") {
      return require("../../../../assets/Images/PLANE/PLANE3.png");
    }
    if (type === "Air-C2") {
      return require("../../../../assets/Images/PLANE/PLANE3.png");
    }
    require("../../../../assets/Images/PLANE/PLANE3.png");
  };

  // const routeDistance = getDistance(
  //   {
  //     latitude: pickupLocation.latitude,
  //     longitude: pickupLocation.longitude,
  //   },
  //   {
  //     latitude: dropoffLocation.latitude,
  //     longitude: dropoffLocation.longitude,
  //   }
  // );

  // const getTotalCost = () => {

  // let cost = 0;
  // let type = orderParameters.carrierType;
  // CourierDetails.filter((details) => {
  // });
  // return (
  //   CourierDetails.baseCharge +
  //   CourierDetails.tripRate * totalDistance +
  //   CourierDetails.DRM
  // );
  // };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
      }}
    >
      <MapView
        initialRegion={{
          latitude: pickupLocation.latitude,
          longitude: pickupLocation.longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.02,
        }}
        provider={PROVIDER_GOOGLE}
        style={{
          ...StyleSheet.absoluteFillObject,
          zIndex: -1,
        }}
      >
        {/* {CourierDetails.map((car) => (
        <Marker
          key={car.id}
          coordinate={{ latitude: car.latitude, longitude: car.longitude }}
        >
          <Image
            style={{
              width: 70,
              height: 70,
              resizeMode: "contain",
            }}
            // source={getImage("car.type")}
            source={require("./Assets/Images/BIKE3.png")}
          />
        </Marker>
      ))} */}

        {/* {CourierDetails.map((car) => (
        <Marker
          // coordinate={{ latitude: 37.78936, longitude: -122.4324 }}
          key={car.id}
        >
          <Image
            style={{
              width: 30,
              height: 30,
              resizeMode: "contain",
              // transform: [
              //   {
              //     rotate: `${car.heading}deg`,
              //   },
              // ],
            }}
            // source={require("./Assets/Images/BIKE3.png")}
            source={getImage(car.type)}
          />
        </Marker>
      ))} */}

        <Marker
          coordinate={{
            latitude: pickupLocation.latitude,
            longitude: pickupLocation.longitude,
          }}
        >
          <Image
            style={{
              width: 30,
              height: 30,
              resizeMode: "contain",
            }}
            source={require("../../../../assets/Images/BIKE/BIKE3.png")}
          />
        </Marker>
        <Marker
          coordinate={{
            latitude: dropoffLocation.latitude,
            longitude: dropoffLocation.longitude,
          }}
        >
          <Image
            style={{
              width: 30,
              height: 30,
              resizeMode: "contain",
            }}
            source={require("../../../../assets/Images/BIKE/BIKE3.png")}
          />
        </Marker>

        <MapViewDirections
          origin={{
            latitude: pickupLocation.latitude,
            longitude: pickupLocation.longitude,
          }}
          destination={{
            latitude: dropoffLocation.latitude,
            longitude: dropoffLocation.longitude,
          }}
          apikey={"AIzaSyDKbzMKjL7Xk7lvKFCdMa1_IZIQXMWGV84"}
          strokeWidth={5}
          strokeColor="blue"
        />
      </MapView>
      <View style={styles.bottomMapCard}>
        <View style={styles.costRow}>
          <Text
            style={{
              fontFamily: "Montserrat-Bold",
              fontSize: 20,
              color: "#000",
            }}
          >
            Delivery Cost:
          </Text>
          <Text
            style={{
              fontFamily: "Montserrat-Bold",
              fontSize: 20,
              color: "#E32F8B",
            }}
          >
            N{price}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text t style={styles.titleText}>
            Courier Type:
          </Text>
          <Image
            style={{
              width: 30,
              height: 30,
              resizeMode: "contain",
            }}
            source={require("../../../../assets/Images/BIKE/BIKE3.png")}
          />
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.titleText}> Estimated distance :</Text>
          <Text style={styles.valueText}>113km</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.titleText}>Estimated delivery Time</Text>
          <Text style={styles.valueText}>23hours</Text>
        </View>
        <View>
          <TouchableOpacity
            style={styles.submitButton}
            // onPress={() => navigation.navigate("OrderDetailsPage")}
            onPress={() =>
              navigation.navigate("OrderConfirmation", {
                orderParameters: orderParameters,
              })
            }
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
          <View style={{ height: 100 }}></View>
        </View>
      </View>
    </View>
  );
};

export default HomeMapRoute;
const styles = StyleSheet.create({
  bottomMapCard: {
    backgroundColor: "white",
    height: SCREEN_HEIGHT >= 800 ? SCREEN_HEIGHT * 0.49 : SCREEN_HEIGHT * 0.55,
    width: "100%",
    top: SCREEN_HEIGHT >= 800 ? 350 : 243,
    // bottom: 0,
    borderRadius: 15,
    paddingTop: 20,
    paddingHorizontal: 20,
    // alignItems: "center",
  },
  detailsrow: {
    // flexDirection: "row",
    // justifyContent: "space-between",
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "#F2F5FF",
    width: SCREEN_WIDTH * 0.95,
    marginVertical: 10,
    padding: 10,
    borderRadius: 15,
  },

  titleText: {
    fontFamily: "Montserrat-Bold",
    fontSize: 16,
    color: "#127AC5",
  },
  costRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    alignItems: "center",

    width: SCREEN_WIDTH * 0.95,
    marginVertical: 10,
    padding: 10,
    borderRadius: 15,
  },
  valueText: {
    fontFamily: "Montserrat-Bold",
    fontSize: 16,
    color: "#000",
  },
  submitButton: {
    backgroundColor: "#E68D41",
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    width: SCREEN_WIDTH * 0.9,
    alignItems: "center",
    justifyContent: "center",
    // marginTop: SCREEN_HEIGHT >= 800 ? SCREEN_HEIGHT * 0.2 : 0,
  },
});
