import { Alert } from 'react-native';
import createDataContext from './createDataContext';
import { SecureGet, SecureSave, wait } from '../Screens/Utilities/helpers';
import 'firebase/firestore';
import firebase from 'firebase';
import * as Network from 'expo-network';
import 'firebase/firestore';
const authReducer = (state, action) => {
  switch (action.type) {
    // CHECK INTERNET CONNECTION
    case 'isConnected_failed':
      return { ...state, connected: action.payload };
    case 'isConnected':
      return { ...state, connected: action.payload };
    case 'known_user':
      return { ...state, userType: action.payload };
    case 'unknown_user':
      return { ...state, userType: action.payload };
    case 'loggedin_user':
      return { ...state, signedIn: action.payload };
    case 'loggedout_user':
      return { ...state, signedIn: action.payload };
    case 'order':
      return { ...state, order: action.payload };
    default:
      return state;
  }
};

//Auth PAGE FUNCTIONS STARTS HERE ==>

// CHECK INTERNET CONNECTION

const checkNetworkConnection = (dispatch) => {
  return async () => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      // console.log(
      //   "networkState   isInternetReachable",
      //   networkState.isInternetReachable
      // );
      if (!networkState.isInternetReachable) {
        dispatch({
          type: 'isConnected_failed',
          payload: false,
        });
      } else {
        dispatch({
          type: 'isConnected',
          payload: true,
        });
      }
    } catch (e) {
      console.log('error', e);
      Alert.alert('Poor Internet Connection', 'Unable to connect to internet');
    }
  };
};

const CheckUserCollection = async () => {
  let res = await firebase
    .firestore()
    .collection('Users')
    .doc(global.userID)
    .get();

  if (res.exists) {
    return 'user';
  }
};

const CheckCourierCollection = async () => {
  let res = await firebase
    .firestore()
    .collection('Courier')
    .doc(global.userID)
    .get();

  if (res.exists) {
    return 'courier';
  }
};
const setUserType = (dispatch) => {
  return async () => {
    let res;
    let r = await SecureGet('signInData');
    console.log('setUserType called... signInData is ', r);
    let signInData = await JSON.parse(r);
    wait(1000);
    if (signInData['type'] == 'user' || signInData['type'] == 'courier') {
      console.log(
        'user type is already known in AuthContext. User is a... ',
        signInData['type']
      );
      dispatch({
        type: 'known_user',
        payload: signInData['type'],
      });
    } else {
      res = await CheckUserCollection();
      console.log('res 1 in setUserType is ', res);
      if (res === 'user') {
        signInData['type'] = 'user';
        //  state.userType = "user";
        await SecureSave('signInData', JSON.stringify(signInData));
        dispatch({
          type: 'known_user',
          payload: 'user',
        });
        return;
      } else {
        res = await CheckCourierCollection();
        console.log('res 2 in setUserType is ', res);

        if (res === 'courier') {
          signInData['type'] = 'courier';
          //  state.userType = "user";
          await SecureSave('signInData', JSON.stringify(signInData));
          dispatch({
            type: 'known_user',
            payload: 'courier',
          });
        }
      }
    }
  };
};

const getUserType = (dispatch) => {
  return async () => {
    console.log('launching getUserType in AuthContext');
    let r = await SecureGet('signInData');
    let signInData = JSON.parse(r);
    wait(1000);
    // console.log('r in nav is ', r)
    if (signInData['type'] && signInData['type'] !== 'unknown') {
      dispatch({
        type: 'known_user',
        payload: signInData['type'],
      });
    } else {
      dispatch({
        type: 'unknown_user',
        payload: 'unknown',
      });
    }
  };
};
//SIGN OUT
/* const AuthenticatedUser = (dispatch) => {
  return async () => {
    console.log('launching AuthenticatedUser in AuthContext');
    let r = await SecureGet('signInData'); 
    if (signInData) {
      dispatch({
        type: 'loggedin_user',
        payload: true,
      });
    } else {
      dispatch({
        type: 'loggedout_user',
        payload: false,
      });
    }
  };
}; */
const AuthenticatedUser = (dispatch) => {
  return async () => {
    console.log("launching AuthenticatedUser in AuthContext"); 
    try{
      await firebase.auth().onAuthStateChanged(user => {
        if (user) {
          console.log("The user in AuthenticatedUser is logged in", user.uid);
          global.userID = user.uid
          dispatch({
            type: "loggedin_user",
            payload: true,
          });
        } else {
          console.log("The user is not logged in");
          dispatch({
            type: "loggedout_user",
            payload: false,
          });
        }
      });;
    }catch(err){
      Alert.alert(err) 
    } 
  };
};
//Auth PAGE FUNCTIONS ENDS HERE ==>
 
export const { Context, Provider } = createDataContext(
  authReducer,
  {
    checkNetworkConnection,
    AuthenticatedUser,
    getUserType,
    setUserType, 
  },
  {
    // network State
    connected: false,
    signedIn: false,
    userType: 'unknown', 
  }
);
