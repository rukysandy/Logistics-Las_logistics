import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useContext } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  Alert,
  View,
  Dimensions,
  Image,
  Animated,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { setUpUser } from '../Utilities/firebase-functions';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Context as AuthContext } from '../../context/AuthContext';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import AuthContainer from './AuthComponents/AuthContainer';
import AuthSubContainer from './AuthComponents/AuthSubContainer';
import AuthCard from './AuthComponents/Authcard';
import PageIndicator from './AuthComponents/PageIndicator';
import firebase from 'firebase';
import 'firebase/firestore';
import { SecureSave, SecureGet } from '../Utilities/helpers';
import AxiosCall from '../Utilities/Axios';
import SignUp from './SignUp';
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ShipperSignUp({ navigation }) {
  const { state, AuthenticatedUser } = useContext(AuthContext);
  const [indicator, setIndicator] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(new Animated.Value(100));
  const [endHeight, setEndHeight] = useState(0);
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const CourierSignUp = async (payload) => {
    let user = null;
    //payload["type"] = "user";
    payload['phoneNumber'] = '+234' + payload['phoneNumber'];
    //console.log("phoneNumber is now ", payload.phoneNumber)
    // return
    try {
      setIndicator(true);
      firebase
        .auth()
        .createUserWithEmailAndPassword(payload.email, payload.password)
        .then(async (res) => {
          console.log(' signup data is  ', res);
          console.log('Payload', payload);
          user = await firebase.auth().currentUser;
          await user.sendEmailVerification();
          user.getIdToken().then(function (idToken) {
            console.log('token in firebse auth is: ', idToken);
            // It shows the Firebase token now
            global.userID = user?.uid;
            const signInData = {
              email: user?.email,
              userID: user?.uid,
              idToken,
              type: 'courier',
            };
            SecureSave('signInData', JSON.stringify(signInData));
          });
          await new Promise((resolve) => {
            setTimeout(resolve, 1000);
          });
          AuthenticatedUser();
          Alert.alert('YOU HAVE SIGNED UP SUCCESSFULLY');
        }) 
        .then(() => {
          delete payload.confirmpassword
          delete payload.password
          let data = {
            ...payload,
            courierID: user?.uid,     
            timeCreated: firebase.firestore.Timestamp.fromDate(new Date()),
          };
          setUpUser(data,"Courier");
          setIndicator(false);
        }) 
        .catch((error) => {
          // Handle Errors here.
          setIndicator(false);
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode == 'auth/weak-password') {
            Alert.alert('The password is too weak.');
          } else {
            Alert.alert(errorMessage);
          }
          console.log(error);
        });
    } catch (err) {
      console.log('err is ', err);
    }
  };

  const keyboardWillShow = (event) => {
    setEndHeight(60);
    Animated.parallel([
      Animated.timing(keyboardHeight, {
        duration: event.duration,
        toValue: event.endCoordinates.height,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const keyboardWillHide = (event) => {
    setEndHeight(0);
    Animated.parallel([
      Animated.timing(keyboardHeight, {
        duration: event.duration,
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  };
  useEffect(() => {
    const user = firebase.auth().currentUser;
    // console.log("firebase user is ", user);
    // setUser(user);
    const keyboardWillShowSub = Keyboard.addListener(
      'keyboardWillShow',
      keyboardWillShow
    );
    const keyboardWillHideSub = Keyboard.addListener(
      'keyboardWillHide',
      keyboardWillHide
    );

    return () => {
      console.log('Do some cleanup');
      keyboardWillShowSub.remove();
      keyboardWillHideSub.remove();
    };
  }, []);

  return (
    <AuthContainer>
      <PageIndicator />
      <AuthSubContainer>
        <ScrollView>
          <Animated.View
            style={{
              ...Platform.select({
                ios: {
                  paddingTop: 10,
                  marginTop: 0,
                },
                android: {
                  paddingTop: 10,
                  marginTop: 0,
                },
              }),
            }}
          >
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text
                style={{
                  textDecorationLine: 'underline',
                  alignSelf: 'center',
                  marginBottom: 20,
                }}
              >
                Go Back
              </Text>
            </TouchableOpacity>
            <Text style={[styles.title, { color: '#E32F8B' }]}>
              Courier Signup
            </Text>
            <Formik
              initialValues={{
                companyName: '',
                registrationNumber: '',
                address: '',
                state: '',
                email: '',
                contactPerson: '',
                phoneNumber: '',
                password: '',
              }}
              onSubmit={(values) => {
                console.log('these are values', values);
                // Alert.alert(JSON.stringify(values));
                CourierSignUp(values);
              }}
              validationSchema={yup.object().shape({
                companyName: yup
                  .string()
                  .required('Please, provide your courier company name!'),
                contactPerson: yup
                  .string()
                  .required("Please, provide a contact person's full name!"),
                registrationNumber: yup.string(),
                //.required("Please, provide your company registration number!"),
                address: yup
                  .string()
                  .required('Please, provide the company address!'),
                state: yup
                  .string()
                  .required('Please, provide the state where located!'),
                email: yup.string().email().required(),
                phoneNumber: yup
                  .string()
                  .required('Required')
                  .matches(phoneRegExp, 'Phone number is not valid')
                  .min(10, 'too short, remove any leading 0')
                  .max(10, "too long. don't use a country code"),
                password: yup
                  .string()
                  .min(4)
                  .max(20, 'Password should not excced 20 chars.')
                  .required(),
              })}
            >
              {({
                values,
                handleChange,
                errors,
                setFieldTouched,
                touched,
                isValid,
                handleSubmit,
              }) => (
                <View style={styles.formContainer}>
                  <Text style={styles.boxLabel}>
                    Company Name <Text style={styles.important}>*</Text>
                  </Text>
                  {touched.companyName && errors.companyName && (
                    <Text style={{ fontSize: 12, color: '#FF0D10' }}>
                      {errors.companyname}
                    </Text>
                  )}
                  <TextInput
                    value={values.companyName}
                    style={styles.inputStyle}
                    onChangeText={handleChange('companyName')}
                    onBlur={() => setFieldTouched('companyName')}
                    placeholder=" Company Name "
                  />

                  <Text style={styles.boxLabel}>Registration Number</Text>
                  {touched.registrationNumber && errors.registrationNumber && (
                    <Text style={{ fontSize: 12, color: '#FF0D10' }}>
                      {errors.registrationNumber}
                    </Text>
                  )}
                  <TextInput
                    value={values.registrationNumber}
                    style={styles.inputStyle}
                    onChangeText={handleChange('registrationNumber')}
                    onBlur={() => setFieldTouched('registrationNumber')}
                    placeholder="Registration Number"
                  />

                  <Text style={styles.boxLabel}>
                    Address <Text style={styles.important}>*</Text>
                  </Text>
                  {touched.address && errors.address && (
                    <Text style={{ fontSize: 12, color: '#FF0D10' }}>
                      {errors.address}
                    </Text>
                  )}
                  <TextInput
                    value={values.address}
                    style={styles.inputStyle}
                    onChangeText={handleChange('address')}
                    onBlur={() => setFieldTouched('address')}
                    placeholder="Address"
                  />
                  <Text style={styles.boxLabel}>
                    State <Text style={styles.important}>*</Text>
                  </Text>
                  {touched.state && errors.state && (
                    <Text style={{ fontSize: 12, color: '#FF0D10' }}>
                      {errors.state}
                    </Text>
                  )}
                  <TextInput
                    value={values.state}
                    style={styles.inputStyle}
                    onChangeText={handleChange('state')}
                    onBlur={() => setFieldTouched('state')}
                    placeholder="State e.g Lagos, Enugu"
                  />
                  <Text style={styles.boxLabel}>
                    Email <Text style={styles.important}>*</Text>
                  </Text>
                  {touched.email && errors.email && (
                    <Text style={{ fontSize: 12, color: '#FF0D10' }}>
                      {errors.email}
                    </Text>
                  )}

                  <TextInput
                    value={values.email}
                    style={styles.inputStyle}
                    onChangeText={handleChange('email')}
                    onBlur={() => setFieldTouched('email')}
                    placeholder="E-mail"
                  />

                  <Text style={styles.boxLabel}>
                    Contact Person (Full Name){' '}
                    <Text style={styles.important}>*</Text>
                  </Text>
                  {touched.contactPerson && errors.contactPerson && (
                    <Text style={{ fontSize: 12, color: '#FF0D10' }}>
                      {errors.contactPerson}
                    </Text>
                  )}
                  <TextInput
                    value={values.contactPerson}
                    style={styles.inputStyle}
                    onChangeText={handleChange('contactPerson')}
                    onBlur={() => setFieldTouched('contactPerson')}
                    placeholder="Contact Person"
                  />
                  <Text style={styles.boxLabel}>
                    Phone Number <Text style={styles.important}>*</Text>
                  </Text>
                  {touched.phoneNumber && errors.phoneNumber && (
                    <Text style={{ fontSize: 12, color: '#FF0D10' }}>
                      {errors.phoneNumber}
                    </Text>
                  )}
                  <TextInput
                    value={values.phoneNumber}
                    style={styles.inputStyle}
                    onChangeText={handleChange('phoneNumber')}
                    placeholder="Phone Number"
                    onBlur={() => setFieldTouched('phoneNumber')}
                  />

                  <Text style={styles.boxLabel}>
                    Password <Text style={styles.important}>*</Text>
                  </Text>
                  {touched.password && errors.password && (
                    <Text style={{ fontSize: 12, color: '#FF0D10' }}>
                      {errors.password}
                    </Text>
                  )}
                  <TextInput
                    value={values.password}
                    style={styles.inputStyle}
                    onChangeText={handleChange('password')}
                    placeholder="Password"
                    onBlur={() => setFieldTouched('password')}
                    secureTextEntry={true}
                  />

                  <Text style={styles.boxLabel}>
                    Confirm Password <Text style={styles.important}>*</Text>
                  </Text>

                  {touched.confirmpassword && errors.confirmpassword && (
                    <Text style={{ fontSize: 12, color: '#FF0D10' }}>
                      {errors.confirmpassword}
                    </Text>
                  )}
                  <TextInput
                    value={values.confirmpassword}
                    style={styles.inputStyle}
                    onChangeText={handleChange('confirmpassword')}
                    placeholder="confirmpassword"
                    onBlur={() => setFieldTouched('confirmpassword')}
                    secureTextEntry={true}
                  />
                  <KeyboardSpacer />
                  <TouchableOpacity
                    style={styles.submitButton}
                    disabled={!isValid}
                    onPress={handleSubmit}
                  >
                    {indicator === true ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Create Account</Text>
                    )}
                  </TouchableOpacity>
                  {/* <Button
                color="#3740FE"
                title="Submit"
                disabled={!isValid}
                onPress={handleSubmit}
              /> */}
                </View>
              )}
            </Formik>
            {/* <View style={{ height: 100 + endHeight }}></View> */}
          </Animated.View>
        </ScrollView>
      </AuthSubContainer>
    </AuthContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
    color: '#E32F8B',
    marginBottom: 20,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    width: SCREEN_WIDTH * 0.9,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageCard: {
    backgroundColor: '#FFFFFF',
    height: SCREEN_HEIGHT * 0.14,
    width: SCREEN_WIDTH * 0.32,
    borderRadius: 12,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  ProfileImage: {
    height: SCREEN_HEIGHT * 0.09,
    width: SCREEN_WIDTH * 0.12,
  },
  profileCardText: {
    color: '#BCC2DE',
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
  },
  inputStyle: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#127AC533',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    padding: 12,
    marginBottom: 10,
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.065,
    alignSelf: 'center',
  },
  boxLabel: {
    padding: 5,
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#7B84AC',
    marginLeft: 6,
  },
  important: {
    color: '#F44646',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
  },
  submitButton: {
    height: SCREEN_HEIGHT * 0.065,
    width: SCREEN_WIDTH * 0.95,
    backgroundColor: '#E68D41',
    borderRadius: 15,
    marginTop: 15,
    marginBottom: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
  },
});
