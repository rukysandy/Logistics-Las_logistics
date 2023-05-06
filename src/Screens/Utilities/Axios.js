import Axios from "axios";
import {  Alert } from "react-native";
import * as Network from "expo-network";
//import AsyncStorage from '@react-native-async-storage/async-storage' 
//use expo install @react-native-async-storage/async-storage 
//import AsyncStorage from '@react-native-community/async-storage' doesnt work when using expo
//export const baseURL = "https://us-central1-lastesting-9a26e.cloudfunctions.net/";
export const baseURL = "https://us-central1-las-logistics-pro.cloudfunctions.net/";

const AxiosCall = async (callObj) => {
  try {
    const networkState = await Network.getNetworkStateAsync();
    if (!networkState.isInternetReachable) {
      Alert.alert("Poor Internet Connection", "Unable to connect to internet");
      return;
    }
  } catch (e) {
    Alert.alert("Poor Internet Connection", "Unable to connect to internet");
  }

  const { path, method, data, contentType } = callObj;

  //const token = await AsyncStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${global.idToken || ""}`,
    "Content-Type": contentType || "application/json",
  };

  const url = `${baseURL}${path}`;
  try {
    const response = await Axios({ method, url, data, headers, json: true });

    const result = response && response.data;
    return result;
  } catch (error) {
    throw error;
  }
};

export default AxiosCall;
