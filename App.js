/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, {Component, Fragment, useEffect} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {Router} from './src/router/Router';
import {Provider} from 'react-redux';
import Store from './src/redux/Store';

const App = () => {
  return (
    <Provider store={Store}>
      <NavigationContainer>
          <Router />
      </NavigationContainer>
    </Provider>
  );
};

export default App;

// import React, {Component, Fragment, useEffect} from 'react';
// import {
//   Text,
//   View,
//   SafeAreaView,
//   StyleSheet,
//   ScrollView,
//   StatusBar,
//   Alert,
// } from 'react-native';
// import 'react-native-gesture-handler';
// import {NavigationContainer} from '@react-navigation/native';
// import {Router} from './src/router/Router';
// import {Provider} from 'react-redux';
// import Store from './src/redux/Store';

// import {createStackNavigator} from '@react-navigation/stack';
// import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import {connect} from 'react-redux';
// import SplashScreen from './src/pages/SplashScreen';
// import Login from './src/pages/Login';
// import Register from './src/pages/Register';
// import FormInputCodeOTP from './src/pages/FormInputCodeOTP';
// import RegisterUserLama from './src/pages/RegisterUserLama';
// import FormLupaPassword from './src/pages/FormLupaPassword';
// import FormIdentificationUser from './src/pages/FormIdentificationUser';
// import FormInputCodeUser from './src/pages/FormInputCodeUser';
// import Profile from './src/pages/Profile';
// import ListSetting from './src/pages/ListSetting';
// import DataUser from './src/pages/DataUser';
// import DataAlamat from './src/pages/DataAlamat';
// import FormEditNama from './src/pages/FormEditNama';
// import FormEditEmail from './src/pages/FormEditEmail';
// import FormEditNomorTelepon from './src/pages/FormEditNomorTelepon';
// import FormVerifikasiEditTelepon from './src/pages/FormVerifikasiEditTelepon';
// import FormVerifikasiEditTelepon2 from './src/pages/FormVerifikasiEditTelepon2';
// import Notification from './src/pages/Notification';
// import NotificationShopping from './src/pages/NotificationShopping';
// import NotificationSubscribe from './src/pages/NotificationSubscribe';
// import Home from './src/pages/Home';
// import AllProducts from './src/pages/AllProducts';
// import Keranjang from './src/pages/Keranjang';
// import IconChat from './src/assets/icons/Chat.svg';
// import Chat from './src/pages/Chat';
// import Barcode from './src/pages/Barcode';
// import BottomNavigator from './src/components/BottomNavigator';
// import Delivery from './src/pages/Delivery';
// import ProductsDesc from './src/pages/ProductsDesc';
// import Subscribe from './src/pages/Subscribe';
// import PaymentMethod from './src/pages/PaymentMethod';
// import DetailHerbal from './src/pages/DetailHerbal';
// import DetailSupMul from './src/pages/DetailSupMul';
// import DetailFoodBev from './src/pages/DetailFoodBev';
// import DetailMinyak from './src/pages/DetailMinyak';
// import ListDataSubscribe from './src/pages/ListDataSubscribe';
// import DetailSubscribe from './src/pages/DetailSubscribe';
// import EditSubscribe from './src/pages/EditSubscribe';
// import FormAlamat from './src/pages/FormAlamat';
// import FormTambahAlamat from './src/pages/FormTambahAlamat';
// import FormOtherAlamat from './src/pages/FormOtherAlamat';
// import FormEditAlamat from './src/pages/FormEditAlamat';
// import DetailVoucher from './src/pages/DetailVoucher';
// import ListTimeSubscribe from './src/pages/ListTimeSubscribe';
// import Transaction from './src/pages/Transaction';
// import TransactionDetail from './src/pages/TransactionDetail';
// import ListDataPayment from './src/pages/ListDataPayment';
// import DetailRating from './src/pages/DetailRating';
// import WaitingRating from './src/pages/WaitingRating';
// import HistoryRating from './src/pages/HistoryRating';
// import InputRating from './src/pages/InputRating';
// import Wishlist from './src/pages/Wishlist';
// import InputRatingProduct from './src/pages/InputRatingProduct';
// import ProductRating from './src/pages/ProductRating';
// import OrderComplaint from './src/pages/OrderComplaint';
// import HelpCare from './src/pages/HelpCare';
// import HelpCareDetail from './src/pages/HelpCareDetail';
// import OrderComplaintTransaction from './src/pages/OrderComplaintTransaction';
// import OrderComplaintInput from './src/pages/OrderComplaintInput';
// import OrderComplaintDetail from './src/pages/OrderComplaintDetail';
// import UploadPayment from './src/pages/UploadPayment';
// import ConfirmationOrder from './src/pages/ConfirmationOrder';
// import HelpCareCategoryAccount from './src/pages/HelpCareCategoryAccount';
// import HelpCareCategoryComplaint from './src/pages/HelpCareCategoryComplaint';
// import HelpCareCategoryVoucher from './src/pages/HelpCareCategoryVoucher';
// import HelpCareCategoryOther from './src/pages/HelpCareCategoryOther';
// import ReplyComplaint from './src/pages/ReplyComplaint';
// import Storage from '@react-native-async-storage/async-storage';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';

// const AuthContext = React.createContext();

// const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();
// const TopTab = createMaterialTopTabNavigator();

// const HomeStack = createStackNavigator();
// const ProductStack = createStackNavigator();
// const PembayaranStack = createStackNavigator();

// function HomeStackScreen() {
//   return (
//     <HomeStack.Navigator>
//       <HomeStack.Screen
//         name="Home"
//         component={Home}
//         options={{headerShown: false}}
//       />
//       <HomeStack.Screen
//         name="ProductsDesc"
//         component={ProductsDesc}
//         options={{headerShown: false}}
//       />
//       <HomeStack.Screen
//         name="Subscribe"
//         component={Subscribe}
//         options={{headerShown: false}}
//       />
//     </HomeStack.Navigator>
//   );
// }

// function ProductsStackScreen() {
//   return (
//     <ProductStack.Navigator>
//       <ProductStack.Screen
//         name="Produk"
//         component={AllProducts}
//         options={{headerShown: false}}
//       />
//       <ProductStack.Screen
//         name="ProductsDesc"
//         component={ProductsDesc}
//         options={{headerShown: false}}
//       />
//       <ProductStack.Screen
//         name="Subscribe"
//         component={Subscribe}
//         options={{headerShown: false}}
//       />
//       <ProductStack.Screen
//         name="DetailHerbal"
//         component={DetailHerbal}
//         options={{headerShown: false}}
//       />
//       <ProductStack.Screen
//         name="DetailSupMul"
//         component={DetailSupMul}
//         options={{headerShown: false}}
//       />
//       <ProductStack.Screen
//         name="DetailFoodBev"
//         component={DetailFoodBev}
//         options={{headerShown: false}}
//       />
//       <ProductStack.Screen
//         name="DetailMinyak"
//         component={DetailMinyak}
//         options={{headerShown: false}}
//       />
//     </ProductStack.Navigator>
//   );
// }

// function PembayaranStackScreen() {
//   return (
//     <PembayaranStack.Navigator>
//       <PembayaranStack.Screen
//         name="Pembayaran"
//         component={ListDataPayment}
//         options={{headerShown: false}}
//       />
//       <PembayaranStack.Screen
//         name="Delivery"
//         component={Delivery}
//         options={{headerShown: false}}
//       />
//       <PembayaranStack.Screen
//         name="PaymentMethod"
//         component={PaymentMethod}
//         options={{headerShown: false}}
//       />
//       <PembayaranStack.Screen
//         name="ListPaymentDetail"
//         component={TransactionDetail}
//         options={{headerShown: false}}
//       />
//       <PembayaranStack.Screen
//         name="ConfirmationOrder"
//         component={ConfirmationOrder}
//         options={{headerShown: false}}
//       />
//     </PembayaranStack.Navigator>
//   );
// }

// const App = ({navigation}) => {
//   // const AuthContext = React.createContext();

//   const [state, dispatch] = React.useReducer(
//     (prevState, action) => {
//       switch (action.type) {
//         case 'RESTORE_TOKEN':
//           return {
//             ...prevState,
//             userToken: action.token,
//             isLoading: false,
//           };
//         case 'SIGN_IN':
//           return {
//             ...prevState,
//             isSignout: false,
//             userToken: action.token,
//           };
//         case 'SIGN_OUT':
//           return {
//             ...prevState,
//             isSignout: true,
//             userToken: null,
//           };
//       }
//     },
//     {
//       isLoading: true,
//       isSignout: false,
//       userToken: null,
//     },
//   );

//   React.useEffect(() => {
//     // Fetch the token from storage then navigate to our appropriate place
//     const bootstrapAsync = async () => {
//       let userToken;

//       try {
//         userToken = await Storage.getItem('token');
//       } catch (error) {
//         console.log(JSON.parse(JSON.stringify(error)).message);
//         // Restoring token failed
//       }

//       // After restoring token, we may need to validate it in production apps

//       // This will switch to the App screen or Auth screen and this loading
//       // screen will be unmounted and thrown away.
//       dispatch({type: 'RESTORE_TOKEN', token: userToken});
//     };

//     bootstrapAsync();
//   }, []);

//   const authContext = React.useMemo(
//     () => ({
//       signIn: async data => {
//         // In a production app, we need to send some data (usually username, password) to server and get a token
//         // We will also need to handle errors if sign in failed
//         // After getting token, we need to persist the token using `SecureStore`
//         // In the example, we'll use a dummy token
//         let userToken;

//         try {
//           userToken = await Storage.getItem('token');
//         } catch (error) {
//           console.log(JSON.parse(JSON.stringify(error)).message);
//           // Restoring token failed
//         }

//         dispatch({type: 'SIGN_IN', token: userToken});
//       },
//       signOut: () => dispatch({type: 'SIGN_OUT'}),
//       signUp: async data => {
//         // In a production app, we need to send user data to server and get a token
//         // We will also need to handle errors if sign up failed
//         // After getting token, we need to persist the token using `SecureStore`
//         // In the example, we'll use a dummy token

//         dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
//       },
//     }),
//     [],
//   );

//   const BottomNav = ({navigation}) => {
//     return (
//       <>
//         <Tab.Navigator tabBar={props => <BottomNavigator {...props} />}>
//           <Tab.Screen
//             name="Home"
//             component={HomeStackScreen}
//             options={{headerShown: false, unmountOnBlur: true}}
//           />
//           <Tab.Screen
//             name="Produk"
//             component={ProductsStackScreen}
//             options={{headerShown: false, unmountOnBlur: true}}
//           />
//           <Tab.Screen
//             name="Keranjang"
//             component={Keranjang}
//             options={{headerShown: false, unmountOnBlur: true}}
//           />
//           <Tab.Screen
//             name="Pembayaran"
//             component={PembayaranStackScreen}
//             options={{headerShown: false, unmountOnBlur: true}}
//           />
//         </Tab.Navigator>
//         <View
//           style={{
//             height: hp('8%'),
//             width: hp('10%'),
//             borderRadius: hp('8%'),
//             backgroundColor: '#529F45',
//             position: 'absolute',
//             bottom: hp('1%'),
//             right: wp('3%'),
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}>
//           <IconChat onPress={() => navigation.navigate('Chat')} />
//         </View>
//       </>
//     );
//   };

//   const TopNav = ({navigation}) => {
//     return (
//       <>
//         <View style={{backgroundColor: 'white'}}>
//           <View style={[styles.container]}>
//             <Text style={styles.text}>{'Daftar Ulasan'}</Text>
//           </View>
//         </View>
//         <TopTab.Navigator>
//           <TopTab.Screen
//             name="WaitingRating"
//             component={WaitingRating}
//             options={{tabBarLabel: 'Menunggu Ulasan'}}
//           />
//           <TopTab.Screen
//             name="HistoryRating"
//             component={HistoryRating}
//             options={{tabBarLabel: 'Riwayat'}}
//           />
//         </TopTab.Navigator>
//       </>
//     );
//   };

//   return (
//     <Provider store={Store}>
//       <AuthContext.Provider value={authContext}>
//         <NavigationContainer>
//           <Stack.Navigator
//           // initialRouteName="SplashScreen"
//           >
//             {state.userToken == null ? (
//               <>
//                 <Stack.Screen
//                   name="SplashScreen"
//                   component={SplashScreen}
//                   options={{headerShown: false, unmountOnBlur: true}}
//                 />
//                 <Stack.Screen
//                   name="Login"
//                   component={Login}
//                   options={{headerShown: false, unmountOnBlur: true}}
//                 />
//                 <Stack.Screen
//                   name="FormLupaPassword"
//                   component={FormLupaPassword}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="FormIdentificationUser"
//                   component={FormIdentificationUser}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="FormInputCodeUser"
//                   component={FormInputCodeUser}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="Register"
//                   component={Register}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="FormInputCodeOTP"
//                   component={FormInputCodeOTP}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="RegisterUserLama"
//                   component={RegisterUserLama}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="FormAlamat"
//                   component={FormAlamat}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="FormOtherAlamat"
//                   component={FormOtherAlamat}
//                   options={{headerShown: false}}
//                 />
//               </>
//             ) : (
//               <>
//                 <Stack.Screen
//                   name="BottomNav"
//                   component={BottomNav}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="Notification"
//                   component={Notification}
//                   options={{headerShown: false, unmountOnBlur: true}}
//                 />
//                 <Stack.Screen
//                   name="NotificationShopping"
//                   component={NotificationShopping}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="NotificationSubscribe"
//                   component={NotificationSubscribe}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="Profile"
//                   component={Profile}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="DataUser"
//                   component={DataUser}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="FormVerifikasiEditTelepon"
//                   component={FormVerifikasiEditTelepon}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="FormVerifikasiEditTelepon2"
//                   component={FormVerifikasiEditTelepon2}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="FormEditNama"
//                   component={FormEditNama}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="FormEditEmail"
//                   component={FormEditEmail}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="FormEditNomorTelepon"
//                   component={FormEditNomorTelepon}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="DataAlamat"
//                   component={DataAlamat}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="FormEditAlamat"
//                   component={FormEditAlamat}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="FormTambahAlamat"
//                   component={FormTambahAlamat}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="ListSetting"
//                   component={ListSetting}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="Barcode"
//                   component={Barcode}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="Chat"
//                   component={Chat}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="ListDataSubscribe"
//                   component={ListDataSubscribe}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="DetailSubscribe"
//                   component={DetailSubscribe}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="EditSubscribe"
//                   component={EditSubscribe}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="DetailVoucher"
//                   component={DetailVoucher}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="ListTimeSubscribe"
//                   component={ListTimeSubscribe}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="Transaction"
//                   component={Transaction}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="TransactionDetail"
//                   component={TransactionDetail}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="DetailRating"
//                   component={DetailRating}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="TopNav"
//                   component={TopNav}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="InputRating"
//                   component={InputRating}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="Wishlist"
//                   component={Wishlist}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="InputRatingProduct"
//                   component={InputRatingProduct}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="ProductRating"
//                   component={ProductRating}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="OrderComplaint"
//                   component={OrderComplaint}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="HelpCare"
//                   component={HelpCare}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="HelpCareDetail"
//                   component={HelpCareDetail}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="OrderComplaintTransaction"
//                   component={OrderComplaintTransaction}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="OrderComplaintInput"
//                   component={OrderComplaintInput}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="OrderComplaintDetail"
//                   component={OrderComplaintDetail}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="UploadPayment"
//                   component={UploadPayment}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="HelpCareCategoryAccount"
//                   component={HelpCareCategoryAccount}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="HelpCareCategoryComplaint"
//                   component={HelpCareCategoryComplaint}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="HelpCareCategoryVoucher"
//                   component={HelpCareCategoryVoucher}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="HelpCareCategoryOther"
//                   component={HelpCareCategoryOther}
//                   options={{headerShown: false}}
//                 />
//                 <Stack.Screen
//                   name="ReplyComplaint"
//                   component={ReplyComplaint}
//                   options={{headerShown: false}}
//                 />
//               </>
//             )}
//           </Stack.Navigator>
//         </NavigationContainer>
//       </AuthContext.Provider>
//     </Provider>
//   );

//   // return (
//   //   <Provider store={Store}>
//   //     <NavigationContainer>
//   //       <Router />
//   //     </NavigationContainer>
//   //   </Provider>
//   // );
// };

// export default App;

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     height: hp('10.5%'),
//     backgroundColor: 'white',
//   },
//   text: {
//     fontFamily: 'Lato-Medium',
//     fontSize: hp('2.4%'),
//     paddingLeft: wp('5%'),
//   },
// });
