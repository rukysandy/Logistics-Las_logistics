import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ImageBackground,
  TextInput,
  Alert,
} from "react-native";

import { wait, SecureGet } from "../Utilities/helpers";
import Offline from "../Utilities/Offline";
import FadeInView from "../Utilities/FadeInView";
import AuthContainer from "../Auth/AuthComponents/AuthContainer";
import { Context as AuthContext } from "../../context/AuthContext";
import { LinearGradient } from "expo-linear-gradient"; 
import TruckRequest from "./Courier/TruckRequest";
import { dateMonthYearTimeFormat } from "../Helpers/timehelpers";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

const vehicleCategory = [
  {
    category: "Bike",
    categoryPics: require("../../../assets/Images/BIKE/BIKE3.png"),
    route: "BikeRequest",
  },
  {
    category: " 2T-Truck",
    categoryPics: require("../../../assets/Images/TRUCK/TRUCK3.png"),
    route: "TruckRequest",
  },
  {
    category: "5T-Truck",
    categoryPics: require("../../../assets/Images/TRUCK/TRUCK3.png"),
    route: "TruckRequest",
  },
  {
    category: " 20T-Truck",
    categoryPics: require("../../../assets/Images/TRUCK/TRUCK3.png"),
    route: "TruckRequest",
  },
  {
    category: "Ferry",
    categoryPics: require("../../../assets/Images/SHIP/SHIP3.png"),
    route: "FerryRequest",
  },
  {
    category: "Air-C1",
    categoryPics: require("../../../assets/Images/PLANE/PLANE3.png"),
    route: "AirRequest",
  },
  {
    category: "Air-C2",
    categoryPics: require("../../../assets/Images/PLANE/PLANE3.png"),
    route: "AirRequest",
  },
];

const orderDetails = [
  {
    trackingID: "#1234561",
    pickUpAddress: "No 42 Mongomery Road",
    dropOffAdress: "no 2 Adeboye street",
    orderDate: "21/8/2021",
    orderStatus: "pending",
  },
  {
    trackingID: "#1234564",
    pickUpAddress: "No 42 Mongomery Road",
    dropOffAdress: "no 2 Abike street",
    orderDate: "2/8/2021",
    orderStatus: "Delivered",
  },
];

const requestDetails = [
  {
    // trackingID: "#1234561",
    pickUpAddress: "No 42 Mongomery Road",
    dropOffAdress: "no 2 Adeboye street",
    orderDate: "21/8/2021",
    orderStatus: "New",
  },
  {
    // trackingID: "#1234564",
    pickUpAddress: "No 42 Mongomery Road",
    dropOffAdress: "no 2 Abike street",
    orderDate: "2/8/2021",
    orderStatus: "New",
  },
];

//Request component
const Request = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.modalCard}>
      <Text style={styles.orderText}>Requests</Text>
      {requestDetails.map((item, i) => {
        return (
          <TouchableOpacity
            key={i}
            onPress={() => {
              navigation.navigate("RequestDetails");
            }}
            style={styles.requestCard}
          >
            <View style={styles.requestCard}>
              <View style={styles.bluecard}>
                <View style={styles.textView}>
                  <Image
                    style={styles.locationImage}
                    resizeMode="contain"
                    source={require("../../../assets/Images/LOCATIONFROM/FROM2.png")}
                  />
                </View>

                <View style={styles.textContainer}>
                  <Text style={styles.title}>From</Text>
                  <Text style={styles.inputText}>{item.pickUpAddress}</Text>
                </View>
              </View>

              <View style={styles.pinkcard}>
                <View style={styles.textView}>
                  <Image
                    style={styles.locationImage}
                    resizeMode="contain"
                    source={require("../../../assets/Images/LOCATIONFROM/HOMEICON2.png")}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.pinktitle}>To:</Text>
                  <Text style={styles.inputText}>{item.dropOffAdress}</Text>
                </View>
              </View>

              <View style={styles.dateDetails}>
                <Text style={styles.dateText}>
                  Order Date: {item.orderDate}
                </Text>
                <Text style={styles.newText}>{item.orderStatus}</Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const { state, checkNetworkConnection, getUserType, setUserType } =
    useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const getCredentials = async () => {
    console.log("calling getIDtoken...");
    try {
      let r = await SecureGet("signInData");
      let r2 = JSON.parse(r);
      global.idToken = r2.idToken;
      global.email = r2.email;
    } catch (err) {
      console.log("had issues fetching data in homescreen ", err);
    }
  };
  useEffect(() => {
    getCredentials();
  },[]);
  const fetchOrder = async () => {
    try {
      console.log("globaluser is ", global.userID, " in fetchorder");
      const ORDERS = await firebase
        .firestore()
        .collection("Orders")
        .where("user", "==", global.userID);
      ORDERS.get().then((querySnapshot) => {
        const tempDoc = [];
        querySnapshot.forEach((doc) => {
          tempDoc.push({ id: doc.id, ...doc.data() });
        });
        setOrders(tempDoc);
        console.log(tempDoc);
      });

      console.log("Orders found ", orders);
    } catch (err) {
      console.log("error fetching data by id ", err);
    }
  };
  const userTypeSetting = async () => {
    getUserType();
    if (state.userType == "user" || state.userType == "courier") {
      return;
    }
    setUserType();
  };
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    //const user = await firebase.auth().currentUser;
    fetchOrder();
    console.log("userData fetched in onRefresh is... ", orders);
    //setUser(user);
    wait(2000).then(() => setRefreshing(false));
  }, []);
  useEffect(() => {
    if (state.userType == "unknown") {
      userTypeSetting();
    }
    console.log("SCREEN_HEIGHT ", Dimensions.get("window").height);
    console.log("SCREEN_WIDTH ", Dimensions.get("window").width);
    console.log(
      "state.userType in homescreen from context is ",
      state.userType
    );
  }, [state.userType]);

  useEffect(() => {
    checkNetworkConnection();
    console.log("network status in homescreen is ", state.connected);
  }, [state.connected]);

  useEffect(() => {
    fetchOrder();
  }, [orders.length]);
  return (
    <AuthContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            //refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {!state.connected && (
          <View style={{ marginTop: 60 }}>
            <FadeInView duration={500}>
              <Offline />
            </FadeInView>
          </View>
        )}
        <View
          style={{
            marginHorizontal: 4,
            justifyContent: "space-around",
            marginVertical: 10,
            marginTop: 10,
          }}
        >
          <View style={styles.bannerImage}>
            <LinearGradient
              colors={["#E48D49", "#E32F8B"]}
              style={styles.bannerView}
            >
              <View style={styles.bannerTextView}>
                <Text style={styles.bannerText}>
                  Send Your Cargo Anywhere Locally And Internatonal
                </Text>
              </View>
              <Image
                source={require("./banner3.png")}
                style={{
                  height: 210,
                  width: SCREEN_WIDTH * 0.95,
                  resizeMode: "contain",
                  bottom: 65,
                }}
              />
            </LinearGradient>
          </View>

          <View style={styles.tileCatView}>
            <Text style={styles.categoryTitle}>Categories</Text>
          </View>

          <View style={styles.categoriesView}>
            {vehicleCategory.map((item, id) => {
              return (
                <TouchableOpacity
                  style={styles.categoriesCard}
                  key={id}
                  onPress={() => navigation.navigate(item.route)}
                >
                  <Image
                    style={styles.categoryImage}
                    source={item.categoryPics}
                    resizeMode="contain"
                  />
                  <Text style={styles.categoryText}>{item.category}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.modalCard}>
          <Text style={styles.orderText}>My Order</Text>
          {orders &&
            orders.map((item, i) => {
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => navigation.navigate("OrderResponse")}
                  style={styles.card}
                >
                  <View style={styles.card}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignSelf: "center",
                      }}
                    >
                      <Text style={styles.text}>
                        TrackingID: {item.trackingID}
                      </Text>
                      <Image
                        source={require("../../../assets/Images/BIKE/BIKE.png")}
                        style={styles.bikeImage}
                        resizeMode="contain"
                      />
                    </View>

                    <View style={styles.bluecard}>
                      <View style={styles.textView}>
                        <Image
                          style={styles.locationImage}
                          resizeMode="contain"
                          source={require("../../../assets/Images/LOCATIONFROM/FROM2.png")}
                        />
                      </View>

                      <View style={styles.textContainer}>
                        <Text style={styles.title}>From</Text>
                        <Text style={styles.inputText}>
                          {item.pickupLocation}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.pinkcard}>
                      <View style={styles.textView}>
                        <Image
                          style={styles.locationImage}
                          resizeMode="contain"
                          source={require("../../../assets/Images/LOCATIONFROM/HOMEICON2.png")}
                        />
                      </View>
                      <View style={styles.textContainer}>
                        <Text style={styles.pinktitle}>To:</Text>
                        <Text style={styles.inputText}>{item.destination}</Text>
                      </View>
                    </View>

                    <View style={styles.dateDetails}>
                      <Text style={styles.dateText}>
                        Order Date:{" "}
                        {dateMonthYearTimeFormat(
                          item.timeCreated.seconds,
                          item.timeCreated.nanoseconds
                        )}
                      </Text>
                      <Text style={styles.pendingText}>Pending</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
        </View>

        <View style={{ marginTop: 30 }}>
          <Request />
        </View>
        <View style={{ height: 80 }}></View>
      </ScrollView>
    </AuthContainer>
  );
};
export default HomeScreen;

const styles = StyleSheet.create({
  headerText: {
    fontFamily: "Montserrat-Bold",
    fontSize: 22,
    color: "#7B84AC",
  },
  bannerView: {
    // position: "absolute",
    height: SCREEN_HEIGHT * 0.21,
    width: SCREEN_WIDTH * 0.95,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,

    alignItems: "center",
    marginTop: 35,
  },
  bannerImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: SCREEN_WIDTH * 0.9,
    alignSelf: "center",
  },
  bannerTextView: {
    width: "39%",
  },
  tileCatView: {
    width: SCREEN_WIDTH * 0.95,
    paddingHorizontal: 22,
    alignItems: "flex-start",
    marginTop: 30,
  },
  title: {
    fontFamily: "Montserrat-Bold",
    fontSize: 20,
    // color: "#E32F8B",
  },
  bannerText: {
    fontFamily: "Montserrat-Bold",
    fontSize: 15,
    color: "#FFFFFF",
    right: 90,
    top: 115,
  },

  submitButton: {
    height: SCREEN_HEIGHT * 0.065,
    width: SCREEN_WIDTH * 0.35,
    backgroundColor: "#E68D41",
    borderRadius: 15,
    padding: 10,
    margin: 15,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
  buttonText: {
    color: "#FFFFFF",
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
  },
  categoriesCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
    borderWidth: 0.5,
    height: SCREEN_WIDTH * 0.41,
    width: SCREEN_WIDTH * 0.4,
    borderRadius: 14,
    justifyContent: "space-around",
    alignItems: "center",
    margin: 15,
    padding: 4,
  },
  categoriesView: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },
  categoryImage: {
    height: "75%",
    width: "75%",
    resizeMode: "contain",
  },
  categoryText: {
    color: "#127AC5",
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
  },
  categoryTitle: {
    color: "#FFFFFF",
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
  },
  titleView: { width: SCREEN_WIDTH, justifyContent: "center" },
  modalCard: {
    width: "100%",
    minHeight: 150,
    backgroundColor: "#F2F5FF",
    borderRadius: 22,
    alignItems: "center",
    paddingTop: 20,
    overflow: "hidden",
  },
  orderText: {
    color: "#7B84AC",
    fontFamily: "Montserrat-Bold",
    fontSize: 22,
  },
  card: {
    //height: SCREEN_HEIGHT * 0.5,
    paddingVertical: 20,
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    flexDirection: "column",
    alignItems: "center",
    marginTop: 20,
    overflow: "hidden",
    marginBottom: 30,
  },
  requestCard: {
    paddingVertical: 4,
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    flexDirection: "column",
    alignItems: "center",
    marginTop: 20,
    overflow: "hidden",
    marginBottom: 30,
  },

  textContainer: {
    alignSelf: "flex-start",
  },
  bluecard: {
    //height: 50,
    paddingVertical: 8,
    width: SCREEN_WIDTH * 0.8,
    paddingHorizontal: 5,
    backgroundColor: "#F2F5FF",
    borderColor: "#127AC533",
    borderWidth: 1,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    paddingLeft: 0,
  },
  pinkcard: {
    //height: 50,
    paddingVertical: 8,
    width: SCREEN_WIDTH * 0.8,
    paddingHorizontal: 5,
    backgroundColor: "#FFEFF7",
    borderColor: "#E32F8B33",
    borderWidth: 1,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  userImage: {
    height: SCREEN_HEIGHT * 0.35,
    width: 150,
    resizeMode: "contain",
  },
  bikeImage: {
    height: SCREEN_HEIGHT * 0.045,
    width: 40,
    resizeMode: "contain",
  },
  locationImage: {
    height: SCREEN_HEIGHT * 0.045,
    width: 20,
    resizeMode: "contain",
  },
  // imageView: {
  //   height: SCREEN_HEIGHT * 0.23,
  //   width: 200,
  //   // backgroundColor: "yellow",
  //   overflow: "hidden",
  // },
  textView: {
    width: 50,
    overflow: "hidden",
    alignSelf: "flex-start",
    alignItems: "center",
    marginLeft: 5,
  },
  title: {
    fontFamily: "Montserrat-Bold",
    fontSize: 14,
    color: "#127AC5",
    textAlign: "left",
  },
  pinktitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 14,
    color: "#E32F8B",
    textAlign: "left",
  },
  title2: {
    fontFamily: "Montserrat-Bold",
    fontSize: 14,
    color: "#127AC5",
    textAlign: "left",
  },
  text: {
    fontFamily: "Montserrat-Bold",
    fontSize: 16,
    paddingTop: 10,
    textAlign: "left",
    paddingLeft: 2,
    width: SCREEN_WIDTH * 0.67,
    color: "#7B84AC",
  },
  dateDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: SCREEN_WIDTH * 0.78,
    //width: "78%",
    marginTop: 20,
  },
  pendingText: {
    color: "#E68D41",
    fontFamily: "Montserrat-Bold",
    fontSize: 14,
  },
  newText: {
    color: "#1dd626",
    fontFamily: "Montserrat-Bold",
    fontSize: 14,
  },
  dateText: {
    color: "#7B84AC",
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
  },
  inputText: {
    color: "#3B3A3A",
    fontFamily: "Montserrat-Regular",
  },
});
