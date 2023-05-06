import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  TextInput,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Login from "../Screens/Auth/Login";
import SignUp from "../Screens/Auth/SignUp";
import NewOrder from "../Screens/Main/Orders/NewOrder";
import OrderDetailsPage from  "../Screens/Main/Orders/OrderProcess/OrderDetailsPage";
import OrderDetails from "../Screens/Main/Orders/OrderDetails";
import OrderPackageDetail from "../Screens/Main/Orders/OrderProcess/OrderPackageDetail";
import AddDestination from "../Screens/Main/Orders/OrderProcess/AddDestination";

import HomeMapRoute from "../Screens/Main/Orders/OrderProcess/HomeMapRoute";
import CourierSelect from "../Screens/Main/Orders/CourierSelect";
import OrderConfirmation from "../Screens/Main/Orders/OrderProcess/OrderConfirmation";
import Payments from "../Screens/Main/Orders/Payments";
import OrderSuccessful from "../Screens/Main/Orders/OrderSuccessful";
import HomeScreen from "../Screens/Main/HomeScreen";
import EditProfileScreen from "../Screens/Main/EditProfileScreen";
import RequestDetails from "../Screens/Main/Courier/RequestDetails";
import Support from "../Screens/Support/Support";
import { Context as AuthContext } from "../context/AuthContext";
// import backarrow from "../../assets/backarrow.svg"

//Admin
import AdminHome from "../Screens/Main/Admin/AdminHome";
import AdminUsers from "../Screens/Main/Admin/AdminUsers";
import AdminOrders from "../Screens/Main/Admin/AdminOrders";
import UserDetails from "../Screens/Main/Admin/UserDetails";
import UserOrders from "../Screens/Main/Admin/UserOrders";
import ShipperSignUp from "../Screens/Auth/ShipperSignUp";
import UserSignUp from "../Screens/Auth/UserSignUp";
//import DocumentUpload from "../Screens/Auth/DocumentUpload";
import ResetPassWord from "../Screens/Auth/ResetPassWord";
import { SecureGet } from "../Screens/Utilities/helpers";

// Tab components

import ProfileScreen from "../Screens/Main/ProfileScreen";
import Notifications from "../Screens/Main/Notifications";

import { Ionicons, Entypo } from "@expo/vector-icons";
import AirRequest from "../Screens/Main/Courier/AirRequest";
import BikeRequest from "../Screens/Main/Courier/BikeRequest";
import TruckRequest from "../Screens/Main/Courier/TruckRequest";
import FerryRequest from "../Screens/Main/Courier/FerryRequest";
import MyRequestDetails from "../Screens/Main/Courier/MyRequestDetails";
import OrderResponse from "../Screens/Main/Orders/OrderResponse";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

const Tab = createBottomTabNavigator();

const BottomTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        initialRouteName: "Home",
        tabBarActiveTintColor: "#e91e63",
        tabBarStyle: {
          position: "absolute",
          bottom: 25,
          left: 20,
          // right: 170,
          right: SCREEN_WIDTH * 0.5,
          elevation: 0,
          backgroundColor: "#FFFF",
          borderRadius: 15,
          height: 60,
          paddingBottom: 20,
          ...styles.shadow,
        },
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerShown: false,
          // tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 15,
              }}
            >
              <Ionicons name="home-outline" size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={{
          tabBarLabel: "Notification",
          tabBarIcon: ({ color, size }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 15,
              }}
            >
              <Ionicons
                name="notifications-outline"
                size={size}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name=" ProfileScreen"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 15,
              }}
            >
              <Ionicons name="md-person-outline" size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name=" NewOrder"
        component={NewOrder}
        options={{
          tabBarLabel: "NewOrder",
          tabBarIcon: ({ color, size }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 15,
              }}
            ></View>
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              style={{
                left: 220,

                position: "absolute",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  height: 60,
                  width: SCREEN_WIDTH * 0.3,

                  backgroundColor: "#E68D41",
                  borderRadius: 17,
                  ...styles.shadow,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Entypo name="plus" size={25} color="#FFFF" />
                <Text
                  style={{
                    color: "#FFFF",
                    fontFamily: "Montserrat-Bold",
                    fontSize: 12,
                  }}
                >
                  New Order
                </Text>
              </View>
            </TouchableOpacity>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const Stack = createNativeStackNavigator();

const AuthScreens = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#F2F5FF",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserSignUp"
        component={UserSignUp}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ShipperSignUp"
        component={ShipperSignUp}
        options={{ headerShown: false }}
      />
      {/* 
      <Stack.Screen
        name="DocumentUpload"
        component={DocumentUpload}
        options={{ headerShown: false }}
      /> */}
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ResetPassWord"
        component={ResetPassWord}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MainNavigator"
        component={MainScreens}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const MainScreens = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#1A315C",
          borderColor: "#1A315C",
        },
        headerTintColor: "#EBBE67",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={BottomTab}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NewOrder"
        component={NewOrder}
        options={{
          headerShown: true,
          title: "New Order",
          headerStyle: {
            backgroundColor: "#F2F5FF",
          },
          headerTintColor: "#127AC5",
          headerBackTitleStyle: styles.back,
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 22,
            color: "#7B84AC",
          },
        }}
      />
      <Stack.Screen
        name="OrderPackageDetail"
        component={OrderPackageDetail}
        options={{
          headerShown: true,
          title: "Package Details",
          headerStyle: {
            backgroundColor: "#F2F5FF",
          },
          headerTintColor: "#127AC5",
          headerBackTitleStyle: styles.back,
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 22,
            color: "#7B84AC",
          },
        }}
      />
      <Stack.Screen
        name="AddDestination"
        component={AddDestination}
        options={{
          headerShown: true,
          title: "PickUp/DropOff",
          headerStyle: {
            backgroundColor: "#F2F5FF",
          },
          headerTintColor: "#127AC5",
          headerBackTitleStyle: styles.back,
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 22,
            color: "#7B84AC",
          },
        }}
      />
      <Stack.Screen
        name="HomeMapRoute"
        component={HomeMapRoute}
        options={{
          headerShown: true,
          title: "Route",
          headerStyle: {
            backgroundColor: "#F2F5FF",
          },
          headerTintColor: "#127AC5",
          headerBackTitleStyle: styles.back,
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 22,
            color: "#7B84AC",
          },
        }}
      />
      <Stack.Screen
        name="OrderDetailsPage"
        component={OrderDetailsPage}
        options={{
          headerShown: true,
          title: "Order Details",
          headerStyle: {
            backgroundColor: "#F2F5FF",
          },
          headerTintColor: "#127AC5",
          headerBackTitleStyle: styles.back,
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 22,
            color: "#7B84AC",
          },
        }}
      />

      <Stack.Screen
        name="OrderDetails"
        component={OrderDetails}
        options={{
          headerShown: true,
          title: "New Order",
          headerStyle: {
            backgroundColor: "#F2F5FF",
          },
          headerTintColor: "#127AC5",
          headerBackTitleStyle: styles.back,
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 22,
            color: "#7B84AC",
          },
        }}
      />
      <Stack.Screen
        name="CourierSelect"
        component={CourierSelect}
        options={{
          headerShown: true,
          title: "New Order",
          headerStyle: {
            backgroundColor: "#F2F5FF",
          },
          headerTintColor: "#127AC5",
          headerBackTitleStyle: styles.back,
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 22,
            color: "#7B84AC",
          },
        }}
      />
      <Stack.Screen
        name="OrderConfirmation"
        component={OrderConfirmation}
        options={{
          headerShown: true,
          title: "Order Confirmation",
          headerStyle: {
            backgroundColor: "#F2F5FF",
          },
          headerTintColor: "#127AC5",
          headerBackTitleStyle: styles.back,
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 22,
            color: "#7B84AC",
          },
        }}
      />
      <Stack.Screen
        name="Payments"
        component={Payments}
        options={{
          headerShown: true,
          title: "New Order",
          headerStyle: {
            backgroundColor: "#F2F5FF",
          },
          headerTintColor: "#127AC5",
          headerBackTitleStyle: styles.back,
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 22,
            color: "#7B84AC",
          },
        }}
      />
      <Stack.Screen
        name="OrderSuccessful"
        component={OrderSuccessful}
        options={{
          headerShown: false,
          title: "New Order",
          headerStyle: {
            backgroundColor: "#F2F5FF",
          },
          headerTintColor: "#127AC5",
          headerBackTitleStyle: styles.back,
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 22,
            color: "#7B84AC",
          },
        }}
      />
      <Stack.Screen
        name="AdminHome"
        component={AdminHome}
        options={{
          headerShown: true,
          title: "Admin",
          headerStyle: {
            backgroundColor: "#F2F5FF",
          },
          headerTintColor: "#127AC5",
          headerBackTitleStyle: styles.back,
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 22,
            color: "#7B84AC",
          },
        }}
      />
      <Stack.Screen
        name="AdminUsers"
        component={AdminUsers}
        options={{
          headerShown: true,
          title: "UserList",
          headerStyle: {
            backgroundColor: "#F2F5FF",
          },
          headerTintColor: "#127AC5",
          headerBackTitleStyle: styles.back,
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 22,
            color: "#7B84AC",
          },
        }}
      />
      <Stack.Screen
        name="AdminOrders"
        component={AdminOrders}
        options={{
          headerShown: true,
          title: "AdminOrders",
          headerStyle: {
            backgroundColor: "#F2F5FF",
          },
          headerTintColor: "#127AC5",
          headerBackTitleStyle: styles.back,
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 22,
            color: "#7B84AC",
          },
        }}
      />
      <Stack.Screen
        name="UserOrders"
        component={UserOrders}
        options={{
          headerShown: true,
          title: "UserOrders",
          headerStyle: {
            backgroundColor: "#F2F5FF",
          },
          headerTintColor: "#127AC5",
          headerBackTitleStyle: styles.back,
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 22,
            color: "#7B84AC",
          },
        }}
      />
      <Stack.Screen
        name="UserDetails"
        component={UserDetails}
        options={{
          headerShown: true,
          title: "UserDetails",
          headerStyle: {
            backgroundColor: "#F2F5FF",
          },
          headerTintColor: "#127AC5",
          headerBackTitleStyle: styles.back,
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 22,
            color: "#7B84AC",
          },
        }}
      />
      <Stack.Screen
        name="RequestDetails"
        component={RequestDetails}
        options={{
          headerShown: true,
          title: "RequestDetails",
          headerStyle: {
            backgroundColor: "#F2F5FF",
          },
          headerTintColor: "#127AC5",
          headerBackTitleStyle: styles.back,
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 22,
            color: "#7B84AC",
          },
        }}
      />
      <Stack.Screen
        name="MyRequestDetails"
        component={MyRequestDetails}
        options={{
          headerShown: true,
          title: "MyRequestDetails",
          headerStyle: {
            backgroundColor: "#F2F5FF",
          },
          headerTintColor: "#127AC5",
          headerBackTitleStyle: styles.back,
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 22,
            color: "#7B84AC",
          },
        }}
      />
      <Stack.Screen
        name="AirRequest"
        component={AirRequest}
        options={{
          headerShown: true,
          title: "Air Requests",
          headerStyle: {
            backgroundColor: "#F2F5FF",
          },
          headerTintColor: "#127AC5",
          headerBackTitleStyle: styles.back,
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 22,
            color: "#7B84AC",
          },
        }}
      />
      <Stack.Screen
        name="BikeRequest"
        component={BikeRequest}
        options={{
          headerShown: true,
          title: "Bike Requests",
          headerStyle: {
            backgroundColor: "#F2F5FF",
          },
          headerTintColor: "#127AC5",
          headerBackTitleStyle: styles.back,
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 22,
            color: "#7B84AC",
          },
        }}
      />
      <Stack.Screen
        name="FerryRequest"
        component={FerryRequest}
        options={{
          headerShown: true,
          title: "Ferry Requests",
          headerStyle: {
            backgroundColor: "#F2F5FF",
          },
          headerTintColor: "#127AC5",
          headerBackTitleStyle: styles.back,
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 22,
            color: "#7B84AC",
          },
        }}
      />
      <Stack.Screen
        name="TruckRequest"
        component={TruckRequest}
        options={{
          headerShown: true,
          title: "Truck Request",
          headerStyle: {
            backgroundColor: "#F2F5FF",
          },
          headerTintColor: "#127AC5",
          headerBackTitleStyle: styles.back,
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 22,
            color: "#7B84AC",
          },
        }}
      />
      <Stack.Screen
        name="OrderResponse"
        component={OrderResponse}
        options={{
          headerShown: true,
          title: "Order Response",
          headerStyle: {
            backgroundColor: "#F2F5FF",
          },
          headerTintColor: "#127AC5",
          headerBackTitleStyle: styles.back,
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 22,
            color: "#7B84AC",
          },
        }}
      />
      <Stack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Support"
        component={Support}
        options={{
          headerShown: true,
          title: "Support ",
          headerStyle: {
            backgroundColor: "#F2F5FF",
          },
          headerTintColor: "#127AC5",
          headerBackTitleStyle: styles.back,
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 22,
            color: "#7B84AC",
          },
        }}
      />
      <Stack.Screen
        name="AuthNavigator"
        component={AuthScreens}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const Navigation = () => {
  const { state, AuthenticatedUser } = useContext(AuthContext);
  const [userID, setUserID] = useState(null);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
      console.log(timeout, " wait is over...");
    });
  };
  const getSignInData = async () => {
    console.log("calling getSignInData...");
    try {
      let r = await SecureGet("signInData");
      let r2 = JSON.parse(r);
      global.userID = r2.userID;
      if (r !== undefined && global.userID !== undefined) {
        setUserID(r2.userID);
        state.signedIn = true;
        setLoggedIn(true);
        setLoading(false);
        console.log("userid in nav is...", global.userID);
      }
    } catch (err) {
      console.log("had issues fetching data in navigation ", err);
    }
  };
  const isUserAuthenticated = async () => {
    console.log('isUserAuthenticated is launching... ');
    try {
      await AuthenticatedUser();
      if (state.signedIn) {
        console.log('state.signedIn is ', state.signedIn);
        getSignInData();
      } else {
        console.log('else state.signedIn is ', state.signedIn);
        setLoggedIn(false);
        setTimeout(function () {
          setLoading(false);
        }, 500);
      }
    } catch (err) {
      console.log('isUserAuthenticated error is ', err);
      setLoggedIn(false);
      setTimeout(function () {
        setLoading(false);
      }, 500);
      Alert.alert(err.toString());
    }
  }
  useEffect(() => {
    isUserAuthenticated();
  }, [state.signedIn, loading]);
  useEffect(() => {
    isUserAuthenticated();
  }, []);
  /* useEffect(() => { 
    if (state.signedIn) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
    getSignInData();
  }, [userID, state.signedIn]); */
  return (
    <NavigationContainer>
      {/* <BottonTab /> */}
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#1A315C",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "700",
          },
        }}
      >
        {state.signedIn ? (
          <Stack.Screen
            name="MainNavigator"
            component={MainScreens}
            options={{ headerShown: false }}
          />)
        : 
          (<Stack.Screen
            name="AuthNavigator"
            component={AuthScreens}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;

let styles = StyleSheet.create({
  back: {
    backgroundColor: "blue",
    display: "none",
  },
  userImage: {
    height: 100,
    width: 150,
    resizeMode: "contain",
  },
  shadow: {
    shadowColor: "#191818",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});
