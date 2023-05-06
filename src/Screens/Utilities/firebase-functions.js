import firebase from 'firebase';
import 'firebase/firestore';/* 
import shorthash from 'shorthash';
import { Alert, ToastAndroid } from 'react-native';*/
import { SecureSave, SecureGet } from './helpers'; 

export const setUpUser = (data, collection) => {
  const { displayName, photoURL, email } = firebase.auth().currentUser;
  firebase
    .firestore()
    .collection(collection)
    .doc(data?.userID)
    .set({
      ...data,
    });
};


export const SignOut = (navigation) => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signOut()
        .then(async () =>{
          // Sign-out successful. 
          await SecureSave('signInData', '');
          global.userID = null;
         // await navigation.navigate('Auth', { screen: 'UserSignUp' });
        })
        .then(()=>{
          resolve({})
        })
        .catch(function (error) {
          console.log("An error happened", error) 
        });
    });
  };
  