import React, { useState, useEffect } from "react";
import { Image, View, StyleSheet } from "react-native";
import * as Location from "expo-location";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import HomeSearch from "./HomeSearch";
const cars = [
  {
    id: "0",
    type: "bike",
    latitude: 28.650627,
    longitude: -16.263045,
    heading: 47,
  },
  {
    id: "1",
    type: "2T-Truck",
    latitude: 28.456312,
    longitude: -16.252929,
    heading: 190,
  },
  {
    id: "2",
    type: "5T-Truck",
    latitude: 28.476208,
    longitude: -16.259098,
    heading: 99,
  },
  {
    id: "3",
    type: "20T-Truck",
    latitude: 28.454357,
    longitude: -16.258618,
    heading: 120,
  },

  {
    id: "4",
    type: "ferry",
    latitude: 28.454892,
    longitude: -16.258558,
    heading: 120,
  },
  {
    id: "5",
    type: "Air-C1",
    latitude: 28.454892,
    longitude: -16.258638,
    heading: 120,
  },
  {
    id: "6",
    type: "Air-C2",
    latitude: 28.454832,
    longitude: -16.25458,
    heading: 120,
  },
];
const HomeMap = (props) => {
  const [region, setRegion] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [orderParameters, setOrderParameters] = useState({});

  // useEffect(() => {
  //   (async () => {
  //     if (route?.params?.coordinates) {
  //       setCoordinates(route?.params?.coordinates);
  //       setPickupLocation(route?.params?.coordinates?.pickupCoords?.coords);
  //       setdropoffLocation(route?.params?.coordinates?.dropoffCoords?.coords);
  //     }
  //     console.log("pickup coordinates  are ... ", pickupLocation);
  //     console.log(" dropoff coordinates  are ... ", dropoffLocation);
  //   })();
  // }, []);
  useEffect(() => {
    if (props?.orderParameters) {
      setOrderParameters(props.orderParameters);
    }
    console.log("OrderParameters in Home Map are ... ", props.orderParameters);
    console.log(
      "OrderParameters set with new values are ... ",
      orderParameters
    );
  }, []);
  const _getUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    console.log("locations", location);
    if (location?.coords) {
      setRegion(location.coords);
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    }

    // console.log("latitude", location.coords.latitude);
  };

  useEffect(() => {
    if (!latitude) {
      _getUserLocation();
    } else {
      console.log("region is", region);
      console.log("latitude is", latitude);
      console.log("longitude is", longitude);
    }
    setOrderParameters((prevState) => {
      return {
        ...prevState,
        coordinates: region,
      };
    });
  }, [region]);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (region) {
    text = JSON.stringify(region);
  }

  const getImage = (type) => {
    if (type === "bike") {
      return require("../assets/Images/BIKE/BIKE3.png");
    }
    if (type === "2T-Truck") {
      return require("../assets/Images/TRUCK/TRUCK3.png");
    }
    if (type === "5T-Truck") {
      return require("../assets/Images/TRUCK/TRUCK3.png");
    }

    if (type === "20T-Truck") {
      return require("../assets/Images/TRUCK/TRUCK3.png");
    }
    if (type === "ferry") {
      return require("../assets/Images/SHIP/SHIP3.png");
    }
    if (type === "Air-C1") {
      return require("../assets/Images/PLANE/PLANE3.png");
    }
    if (type === "Air-C2") {
      return require("../assets/Images/PLANE/PLANE3.png");
    }
    require("../assets/Images/PLANE/PLANE3.png");
  };
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
      }}
    >
      <MapView
        initialRegion={{
          latitude: 6.45407,
          longitude: 3.39467,
          latitudeDelta: 0.455,
          longitudeDelta: 0.0121,
        }}
        provider={PROVIDER_GOOGLE}
        style={{
          ...StyleSheet.absoluteFillObject,
          zIndex: -1,
        }}
      />

      <HomeSearch
        orderParameters={props.orderParameters}
        // style={{
        //   position: "absolute",
        //   bottom: 50,
        //   left: 10,
        //   backgroundColor: "rgba(255, 255, 255, 1)",
        // }}
      />
    </View>
  );
};

export default HomeMap;

// import React, { Component } from "react";
// import { Dimensions, StyleSheet } from "react-native";
// import MapView from "react-native-maps";
// import MapViewDirections from "react-native-maps-directions";

// const { width, height } = Dimensions.get("window");
// const ASPECT_RATIO = width / height;
// const LATITUDE = 37.771707;
// const LONGITUDE = -122.4053769;
// const LATITUDE_DELTA = 0.0922;
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// const GOOGLE_MAPS_APIKEY = "…";

// class HomeMap extends Component {
//   constructor(props) {
//     super(props);

//     // AirBnB's Office, and Apple Park
//     this.state = {
//       coordinates: [
//         {
//           latitude: 37.3317876,
//           longitude: -122.0054812,
//         },
//         {
//           latitude: 37.771707,
//           longitude: -122.4053769,
//         },
//       ],
//     };

//     this.mapView = null;
//   }

//   onMapPress = (e) => {
//     this.setState({
//       coordinates: [...this.state.coordinates, e.nativeEvent.coordinate],
//     });
//   };

//   render() {
//     return (
//       <MapView
//         initialRegion={{
//           latitude: LATITUDE,
//           longitude: LONGITUDE,
//           latitudeDelta: LATITUDE_DELTA,
//           longitudeDelta: LONGITUDE_DELTA,
//         }}
//         style={StyleSheet.absoluteFill}
//         ref={(c) => (this.mapView = c)}
//         onPress={this.onMapPress}
//       >
//         {this.state.coordinates.map((coordinate, index) => (
//           <MapView.Marker key={`coordinate_${index}`} coordinate={coordinate} />
//         ))}
//         {this.state.coordinates.length >= 2 && (
//           <MapViewDirections
//             origin={this.state.coordinates[0]}
//             waypoints={
//               this.state.coordinates.length > 2
//                 ? this.state.coordinates.slice(1, -1)
//                 : undefined
//             }
//             destination={
//               this.state.coordinates[this.state.coordinates.length - 1]
//             }
//             apikey={"AIzaSyDKbzMKjL7Xk7lvKFCdMa1_IZIQXMWGV84"}
//             strokeWidth={3}
//             strokeColor="hotpink"
//             optimizeWaypoints={true}
//             onStart={(params) => {
//               console.log(
//                 `Started routing between "${params.origin}" and "${params.destination}"`
//               );
//             }}
//             onReady={(result) => {
//               console.log(`Distance: ${result.distance} km`);
//               console.log(`Duration: ${result.duration} min.`);

//               this.mapView.fitToCoordinates(result.coordinates, {
//                 edgePadding: {
//                   right: width / 20,
//                   bottom: height / 20,
//                   left: width / 20,
//                   top: height / 20,
//                 },
//               });
//             }}
//             onError={(errorMessage) => {
//               // console.log('GOT AN ERROR');
//             }}
//           />
//         )}
//       </MapView>
//     );
//   }
// }

// export default HomeMap;
