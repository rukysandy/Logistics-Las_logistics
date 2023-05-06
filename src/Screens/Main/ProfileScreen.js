import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { SecureSave } from '../Utilities/helpers';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Modal,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Animated,
  Keyboard,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SignOut } from '../Utilities/firebase-functions';
import { Image } from 'react-native-elements';
import {
  SimpleLineIcons,
  Entypo,
  FontAwesome,
  AntDesign,
} from '@expo/vector-icons';
import DocumentUpload from './DocumentUpload';
import { wait } from '../Utilities/helpers';
import { Context as AuthContext } from '../../context/AuthContext';
import 'firebase/firestore';
import firebase from 'firebase';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const generateRandomChars = () => {
  var length = 7;
  let a = `${Math.round(Math.random() * 10000)}`;
  let b = new Date();
  let B = b.getTime();
  let randchar = a + B;
  var trimmedString = randchar.substring(0, length);
  console.log('reference geenrated is ', trimmedString);
  return trimmedString;
};
const getPermissionAsync = async () => {
  if (Constants.platform.ios) {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
    }
  }
};
const vehicleCategory = [
  {
    category: 'Bike',
    categoryPics: require('../../../assets/Images/BIKE/BIKE3.png'),
  },
  {
    category: 'Truck',
    categoryPics: require('../../../assets/Images/TRUCK/TRUCK3.png'),
  },
  {
    category: 'Ferry',
    categoryPics: require('../../../assets/Images/SHIP/SHIP3.png'),
  },
  {
    category: 'Air',
    categoryPics: require('../../../assets/Images/PLANE/PLANE3.png'),
  },
];
const CourierProfileCard = (props) => {
  const { state, checkNetworkConnection } = useContext(AuthContext);
  const [progress, setProgress] = useState(0);
  const [logo, setLogo] = useState('');
  useEffect(() => {
    if (props.userData?.logo) {
      setLogo(props.userData?.logo);
    }
  }, [props.userData]);
  const handleUpload = async (uri) => {
    await checkNetworkConnection();
    if (!state.connected) {
      s;
      return;
    }
    const storage = firebase.storage();
    //console.log('uri && global.userID ', uri, ' ', global.userID)
    //return

    if (uri && global.userID) {
      // add to image folder in firebase
      let randName = generateRandomChars();
      const imageExtension = uri.split('.')[uri.split('.').length - 1];
      const nameString = global.userID && global.userID.split(' ').join('');
      const newName = `${randName || '123'}.${imageExtension}`;
      console.log('\nimageExtension && newName ', imageExtension, ' ', newName);
      const response = await fetch(uri);
      const blob = await response.blob();
      const uploadTask = storage
        .ref(`CompanyLogos/${global.userID}/${newName}`)
        .put(blob);
      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          console.log(' progress value is ', progress);
          setProgress(progress);
        },
        (error) => {
          // error function ....
          console.log(error);
          setError(error);
        },
        () => {
          // complete function ....
          storage
            .ref(`CompanyLogos/${global.userID}`)
            .child(newName) // Upload the file and metadata
            .getDownloadURL() // get download url
            .then(async (url) => {
              console.log(url);
              const updateUserData = {
                type: 'profileImage',
                profileImageURL: url,
                userEmail: global.userEmail,
                userID: global.userID,
                idToken: global.idToken,
              };
              //global.profileImage = url;

              firebase
                .firestore()
                .collection('Courier')
                .doc(global.userID)
                .get()
                .then((doc) => {
                  console.log('doc is ', doc);
                  let LOGO = doc.data()?.logo;
                  if (LOGO) {
                    LOGO = url;
                    console.log(
                      'global.userID is ',
                      global.userID,
                      ' logo A is ',
                      LOGO
                    );
                    firebase
                      .firestore()
                      .collection('Courier')
                      .doc(global.userID)
                      .update({ logo: LOGO });
                  } else {
                    LOGO = ' ';
                    LOGO = url;
                    console.log(
                      'global.userID is ',
                      global.userID,
                      ' logo B is ',
                      LOGO
                    );
                    firebase
                      .firestore()
                      .collection('Courier')
                      .doc(global.userID)
                      .update({ logo: LOGO });
                  }
                });
              console.log('successfully uploded profile image ...');
              setLogo(url);
            });
        }
      );
    } else {
      Alert.alert('something went wrong. pls try again...');
      setError('Error please choose an image to upload');
    }
  };
  const _pickImage = async () => {
    /* await checkNetworkConnection();
    if (!state.connected) {
      return;
    } */
    await getPermissionAsync();
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });

      if (!result.cancelled) {
        await handleUpload(result.uri);
      }
    } catch (E) {
      console.log(E);
    }
  };
  return (
    <View style={{ ...styles.profilecard, marginTop: 80 }}>
      {props.refreshing ? (
        <ActivityIndicator
          size="large"
          color="#F2F5FF"
          style={{
            opacity: 1,
          }}
          animating={true}
        />
      ) : (
        <View style={{ ...styles.profilecard, marginTop: -10 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              width: '100%',
              paddingVertical: 10,
              paddingHorizontal: 30,
            }}
          >
            <TouchableOpacity
              onPress={_pickImage}
              style={{
                backgroundColor: '#F2F5FF',
                borderRadius: 15,
                width: 100,
                height: 100,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              {logo ? (
                <Image
                  source={{
                    uri: logo,
                  }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 15,
                  }}
                  PlaceholderContent={
                    <ActivityIndicator
                      size="large"
                      color="#F2F5FF"
                      style={{
                        opacity: 1,
                      }}
                      animating={true}
                    />
                  }
                />
              ) : (
                <SimpleLineIcons name="user" size={50} color="#7B84AC" />
              )}
            </TouchableOpacity>
            {progress !== 0 && progress !== 100 && <Text>{progress}</Text>}
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
                paddingRight: 0,
              }}
              onPress={() => {
                props?.navigation.navigate('EditProfileScreen', {
                  userData: props.userData,
                });
              }}
            >
              <Entypo name="edit" size={20} color="#127AC5" />
              <Text
                style={{
                  color: '#127AC5',
                  fontFamily: 'Montserrat-Bold',
                  fontSize: 15,
                  paddingHorizontal: 5,
                }}
              >
                Edit
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: '100%',
              justifyContent: 'flex-start',
              paddingHorizontal: 30,
              paddingVertical: 10,
              marginVertical: 10,
            }}
          >
            <Text style={styles.ProfileNamelText}>
              {props?.userData?.companyName || '...'}
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.emailText}>Contact : </Text>
              <Text style={styles.text}>
                {' '}
                {props?.userData?.contactPerson || '...'}
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.emailText}>Phone : </Text>
              <Text style={styles.text}>
                {props?.userData?.phoneNumber || '...'}
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.emailText}>Email: </Text>
              <Text style={styles.text}>{props?.userData?.email || '...'}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.emailText}>Address : </Text>
              <Text style={styles.text}>
                {props?.userData?.address || '...'}{' '}
              </Text>
              <Text style={styles.text}>
                {', '}
                {props?.userData?.state || '...'}
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.emailText}>Reg. No : </Text>
              <Text style={styles.text}>
                {props?.userData?.registrationNumber || '...'}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
                paddingRight: 0,
                width: SCREEN_WIDTH * 0.7,
                borderRadius: 10,
                backgroundColor: '#F2F5FF',
              }}
              onPress={() => {
                props.showCourierModal();
                // props?.navigation.navigate("EditProfileScreen");
              }}
            >
              <Text
                style={{
                  color: '#127AC5',
                  fontFamily: 'Montserrat-Bold',
                  fontSize: 15,
                  paddingHorizontal: 5,
                }}
              >
                Documents
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const CourierDocumentsCard = (props) => {
  const [progress, setProgress] = useState(0);
  const [IDdocument, setIdDocument] = useState('');
  useEffect(() => {
    if (props.userData?.IDdocument) {
      setIdDocument(props.userData?.IDdocument);
    }
  }, [props.userData]);
  const handleUpload = async (uri) => {
    /*  await checkNetworkConnection();
    if (!state.connected) {s
      return;
    } */
    const storage = firebase.storage();
    //console.log('uri && global.userID ', uri, ' ', global.userID)
    //return

    if (uri && global.userID) {
      // add to image folder in firebase
      const imageExtension = uri.split('.')[uri.split('.').length - 1];
      const nameString = global.userID && global.userID.split(' ').join('');
      const newName = `${nameString}.${imageExtension}`;
      console.log('\nimageExtension && newName ', imageExtension, ' ', newName);
      const response = await fetch(uri);
      const blob = await response.blob();
      const uploadTask = storage
        .ref(`IDdocument/${global.userID}/${newName}`)
        .put(blob);
      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          console.log(' progress value is ', progress);
          setProgress(progress);
        },
        (error) => {
          // error function ....
          console.log(error);
          setError(error);
        },
        () => {
          // complete function ....
          storage
            .ref(`IDdocument/${global.userID}`)
            .child(newName) // Upload the file and metadata
            .getDownloadURL() // get download url
            .then(async (url) => {
              console.log(url);
              const updateUserData = {
                type: 'profileImage',
                profileImageURL: url,
                userEmail: global.userEmail,
                userID: global.userID,
                idToken: global.idToken,
              };
              //global.profileImage = url;
              firebase
                .firestore()
                .collection('Courier')
                .doc(global.userID)
                .get()
                .then((doc) => {
                  console.log('doc is ', doc);
                  let DOCUMENT = doc.data()?.IDdocument;
                  if (DOCUMENT) {
                    DOCUMENT = url;
                    console.log(
                      'global.userID is ',
                      global.userID,
                      ' IDdocument A is ',
                      DOCUMENT
                    );
                    firebase
                      .firestore()
                      .collection('Courier')
                      .doc(global.userID)
                      .update({ IDdocument: DOCUMENT });
                  } else {
                    DOCUMENT = '';
                    DOCUMENT = url;
                    console.log(
                      'global.userID is ',
                      global.userID,
                      ' IDdocument B is ',
                      DOCUMENT
                    );
                    firebase
                      .firestore()
                      .collection('Courier')
                      .doc(global.userID)
                      .update({ IDdocument: DOCUMENT });
                  }
                });
              console.log('successfully uploded profile image ...');
              setIdDocument(url);
            });
        }
      );
    } else {
      Alert.alert('something went wrong. pls try again...');
      setError('Error please choose an image to upload');
    }
  };
  const _pickImage = async () => {
    /* await checkNetworkConnection();
    if (!state.connected) {
      return;
    } */
    await getPermissionAsync();
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });

      if (!result.cancelled) {
        await handleUpload(result.uri);
      }
    } catch (E) {
      console.log(E);
    }
  };

  return (
    <View style={{ ...styles.profilecard, marginTop: 20 }}>
      <View
        style={{
          justifyContent: 'flex-start',
          paddingHorizontal: 30,
          marginVertical: 10,
          paddingBottom: 0,
          marginBottom: 0,
          alignSelf: 'center',
        }}
      >
        <View style={{ flexDirection: 'column', width: SCREEN_WIDTH * 0.7 }}>
          <Text style={styles.emailText}> Identification : </Text>
          <Text style={styles.text}>
            {/* {props?.userData?.identification || "..."} */}
            {IDdocument && (
              <Image
                source={{
                  uri: IDdocument,
                }}
                style={{
                  width: SCREEN_WIDTH * 0.68,
                  height: 100,
                  borderRadius: 20,
                }}
                PlaceholderContent={
                  <ActivityIndicator
                    size="large"
                    color="#F2F5FF"
                    style={{
                      opacity: 1,
                    }}
                    animating={true}
                  />
                }
              />
            )}
          </Text>
        </View>
        {progress !== 0 && progress !== 100 && <Text>{progress}</Text>}
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
            paddingRight: 0,
            width: SCREEN_WIDTH * 0.7,
            borderRadius: 10,
            backgroundColor: '#F2F5FF',
          }}
          onPress={_pickImage}
        >
          <Text
            style={{
              color: '#127AC5',
              fontFamily: 'Montserrat-Bold',
              fontSize: 15,
              paddingHorizontal: 5,
            }}
          >
            Upload valid ID
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const UserProfileCard = (props) => {
  return (
    <View style={styles.profilecard}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          width: '100%',
          paddingVertical: 10,
          paddingHorizontal: 30,
          marginTop: 50,
        }}
      >
        <View
          style={{
            backgroundColor: '#F2F5FF',
            borderRadius: 15,
            width: 100,
            height: 100,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SimpleLineIcons name="user" size={50} color="#7B84AC" />
        </View>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
            paddingRight: 0,
          }}
          onPress={() => {
            props?.navigation.navigate('EditProfileScreen');
          }}
        >
          <Entypo name="edit" size={20} color="#127AC5" />
          <Text
            style={{
              color: '#127AC5',
              fontFamily: 'Montserrat-Bold',
              fontSize: 15,
              paddingHorizontal: 5,
            }}
          >
            Edit
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          width: '100%',
          justifyContent: 'flex-start',
          paddingHorizontal: 30,
          paddingVertical: 10,
          marginVertical: 10,
        }}
      >
        <Text style={styles.ProfileNamelText}>
          {props?.userData?.firstName || '...'}{' '}
          {props?.userData?.lastName || '...'}
        </Text>

        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.emailText}>Phone : </Text>
          <Text style={styles.text}>
            {props?.userData?.phoneNumber || '...'}
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.emailText}>Email: </Text>
          <Text style={styles.text}>{props?.userData?.email || '...'}</Text>
        </View>

        {/*  <View style={{ flexDirection: "row" }}>
          <Text style={styles.emailText}>joined: </Text>
          <Text style={styles.text}>
            {props?.userData?.timeCreated.toString() || "..."}
          </Text>
        </View> */}
      </View>
    </View>
  );
};

export default function ProfileScreen({ navigation }) {
  const { state, checkNetworkConnection, AuthenticatedUser, getUserType } =
    useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [courierModalVisible, setCourierModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [logo, setLogo] = useState(
    'https://cdn-icons-png.flaticon.com/512/685/685655.png'
  );
  const [activity, setActivity] = useState(false);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    //const user = await firebase.auth().currentUser;
    getProfile();
    console.log('userData fetched in onRefresh is... ', userData);
    //setUser(user);
    wait(2000).then(() => setRefreshing(false));
  }, []);
  const logOut = async () => {
    await checkNetworkConnection();
    if (!state.connected) {
      return;
    }
    SignOut(navigation)
      .then(async(doc) => {
        await SecureSave('signInData', '');
        global.userID = null;
        state.signedIn = false;
        state.userType = 'unknown';
      })
      .then(() => {
        AuthenticatedUser();
      })
      .catch((err) => {
        Alert.alert('error signing out...', err);
      });
  };
  const getProfile = async () => {
    setActivity((prevState) => !prevState);
    let data = {};
    try {
      if (state.userType == 'user') {
        firebase
          .firestore()
          .collection('Users')
          .doc(global.userID)
          .get()
          .then((doc) => {
            if (doc.exists) {
              console.log('userdata fetched for user is... ', doc.data());
              data = doc.data();
              setUserData(data);
            }
          });
      } else {
        firebase
          .firestore()
          .collection('Courier')
          .doc(global.userID)
          .get()
          .then((doc) => {
            if (doc.exists) {
              data = doc.data();
              console.log('userdata fetched for courier us... ', doc.data());
              setUserData(doc.data());
            }
          });
      }

      setActivity((prevState) => !prevState);
      setRefreshing((prevState) => !prevState);
    } catch (err) {
      console.log('somethign went wrpng fetching data ... ', err);
      setActivity((prevState) => !prevState);
      setRefreshing((prevState) => !prevState);
    }
  };

  useEffect(() => {
    if (userData) {
      return;
    }
    //getProfile();
    onRefresh();
    setActivity(false);
  }, [userData == undefined]);
  useEffect(()=>{
    getUserType()
  },[])
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          ...styles.contentContainerStyle,
          paddingBottom: 100,
        }}
        refreshControl={
          <RefreshControl
            //refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: SCREEN_WIDTH, alignItems: 'center' }}>
          {state.userType == 'courier' && userData?.companyName && (
            <CourierProfileCard
              refreshing={refreshing}
              userData={userData}
              navigation={navigation}
              showCourierModal={() => {
                setCourierModalVisible(!courierModalVisible);
              }}
            />
          )}
          {state.userType == 'courier' && !userData?.identification && (
            <CourierDocumentsCard
              refreshing={refreshing}
              userData={userData}
              navigation={navigation}
              userData={userData}
              showCourierModal={() => {
                setCourierModalVisible(!courierModalVisible);
              }}
            />
          )}
          {state.userType == 'courier' && userData?.identification && (
            <View style={{ ...styles.profilecard, marginTop: 20 }}>
              <View style={{ ...styles.profilecard }}>
                <View
                  style={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    paddingHorizontal: 30,
                    paddingVertical: 10,
                    marginVertical: 10,
                  }}
                >
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.emailText}> Identification : </Text>
                    <Text style={styles.text}>
                      {userData?.identification || '...'}
                    </Text>
                    <Text style={styles.text}>
                      {userData?.document || '...'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
          {state.userType == 'user' && !userData?.companyName && (
            <UserProfileCard
              refreshing={refreshing}
              userData={userData}
              navigation={navigation}
            />
          )}
          <TouchableOpacity style={styles.orderCard}>
            <Text>My Orders</Text>
            <View style={{ padding: 10 }}>
              <FontAwesome name="chevron-right" size={24} color="black" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.SupportCard}
            onPress={() => navigation.navigate('Support')}
          >
            <AntDesign name="customerservice" size={24} color="#F2F5FF" />
            <Text style={styles.supportText}>Customer Support</Text>
            <View style={{ padding: 10 }}>
              <FontAwesome name="chevron-right" size={24} color="#F2F5FF" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              ...styles.SupportCard2,
              backgroundColor: 'red',
              position: 'relative',
            }}
            onPress={() => navigation.navigate('AdminHome')}
          >
            <Text style={styles.supportText}>Admin</Text>
            <View style={{ position: 'absolute', right: 30 }}>
              <FontAwesome name="chevron-right" size={24} color="#F2F5FF" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton} onPress={logOut}>
            <Text style={styles.submitText}>Log Out</Text>
          </TouchableOpacity>
        </View>
        <Modal animationType="slide" visible={courierModalVisible}>
          <View style={styles.modal}>
            <DocumentUpload
              userData={userData}
              showCourierModal={() => {
                setCourierModalVisible(!courierModalVisible);
              }}
              updateDocuments={(val) => {
                setUserData((prevState) => {
                  return {
                    ...prevState,
                    Documents: val,
                  };
                });
                console.log('userdata updated...');
              }}
            />
          </View>
        </Modal>
        <View style={{ height: 400 }}></View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //paddingTop:Constants.statusBarHeight,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F2F5FF',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  contentContainerStyle: {
    backgroundColor: '#F2F5FF',
  },
  profilecard: {
    // minHeight: SCREEN_HEIGHT * 0.2,
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  ProfileNamelText: {
    color: '#33395C',
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
    marginBottom: 15,
  },
  emailText: {
    color: '#33395C',
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    marginBottom: 10,
  },
  text: {
    color: '#888888',
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    marginBottom: 10,
  },
  orderCard: {
    minHeight: SCREEN_HEIGHT * 0.07,
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  SupportCard: {
    minHeight: SCREEN_HEIGHT * 0.07,
    justifyContent: 'space-between',
    width: '90%',
    backgroundColor: '#127AC5',
    borderRadius: 15,
    marginTop: 20,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  SupportCard2: {
    minHeight: SCREEN_HEIGHT * 0.07,
    justifyContent: 'center',
    width: '90%',
    backgroundColor: '#127AC5',
    borderRadius: 15,
    marginTop: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  submitButton: {
    //backgroundColor: "#E68D41",
    //borderRadius: 15,
    padding: 20,
    marginTop: 100,
    width: 386,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: '#E68D41',
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
  },
  supportText: {
    color: '#F2F5FF',
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: SCREEN_WIDTH * 0.98,
    paddingTop: 70,
  },
  ActivityIndicatorStyle: {
    flex: 1,
    justifyContent: 'center',
  },
});
