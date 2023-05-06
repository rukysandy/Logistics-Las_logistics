import * as SecureStore from "expo-secure-store";
import firebase from "firebase";
import "firebase/firestore";
import { Alert } from "react-native"; 
import React, { useState, useEffect,useContext } from "react"; 

async function SecureSave(key, value) {
  await SecureStore.setItemAsync(key, value);
}

async function SecureGet(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    console.log("🔐 Here's your value 🔐 \n" + result);
    return result;
  } else {
    console.warn("No values stored under that key.");
  }
}

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
    console.log(timeout, " wait is over...");
  });
}; 
export { SecureSave, SecureGet, wait };
