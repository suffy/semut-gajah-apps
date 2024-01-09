import React, {Component} from 'react';
import {View, Dimensions, StyleSheet, Text, TextInput} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {connect} from 'react-redux';
import SplashScreen from '../pages/SplashScreen';
import Login from '../pages/Login';
import Register from '../pages/Register';
import FormInputCodeOTP from '../pages/FormInputCodeOTP';
import FormInputCodeOTPOld from '../pages/FormInputCodeOTPOld';
import FormInputVerifikasiOTPSMS from '../pages/FormInputVerifikasiOTPSMS';
import FormInputVerifikasiOTPSMSOld from '../pages/FormInputVerifikasiOTPSMSOld';
import FormInputVerifikasiOTPWA from '../pages/FormInputVerifikasiOTPWA';
import FormInputVerifikasiOTPWAOld from '../pages/FormInputVerifikasiOTPWAOld';
import FormInputOTPForgotPass from '../pages/FormInputOTPForgotPass';
import FormInputVerifikasiOTPWAForgot from '../pages/FormInputVerifikasiOTPWAForgot';
import FormInputVerifikasiOTPSMSForgot from '../pages/FormInputVerifikasiOTPSMSForgot';
import RegisterUserLama from '../pages/RegisterUserLama';
import FormLupaPassword from '../pages/FormLupaPassword';
import FormIdentificationUser from '../pages/FormIdentificationUser';
import FormInputCodeUser from '../pages/FormInputCodeUser';
import Profile from '../pages/Profile';
import ListSetting from '../pages/ListSetting';
import DataUser from '../pages/DataUser';
import DataAlamat from '../pages/DataAlamat';
import FormEditNama from '../pages/FormEditNama';
import FormEditEmail from '../pages/FormEditEmail';
import FormEditNomorTelepon from '../pages/FormEditNomorTelepon';
import FormInputCodeOTPEditTelp from '../pages/FormInputCodeOTPEditTelp';
import FormVerifikasiEditTelepon from '../pages/FormVerifikasiEditTelepon';
import FormVerifikasiEditTeleponWA from '../pages/FormVerifikasiEditTeleponWA';
import Notification from '../pages/Notification';
import NotificationShopping from '../pages/NotificationShopping';
import NotificationComplaint from '../pages/NotificationComplaint';
import NotificationSubscribe from '../pages/NotificationSubscribe';
import Home from '../pages/Home';
import Produk from '../pages/Produk';
import ProdukKategori from '../pages/Categories/ProdukKategori';
import Keranjang from '../pages/Keranjang';
import IconChat from '../assets/icons/Chat.svg';
import Chat from '../pages/Chat';
import Barcode from '../pages/Barcode';
import BottomNavigator from '../components/BottomNavigator';
import Delivery from '../pages/Delivery';
import ProdukDeskripsi from '../pages/ProdukDeskripsi';
import Subscribe from '../pages/Subscribe';
import PaymentMethod from '../pages/PaymentMethod';
import ListDataSubscribe from '../pages/ListDataSubscribe';
import ListDataMonthSubscribe from '../pages/ListDataMonthSubscribe';
import DetailSubscribe from '../pages/DetailSubscribe';
import EditSubscribe from '../pages/EditSubscribe';
import FormAlamat from '../pages/FormAlamat';
import FormAlamatEdit from '../pages/FormAlamatEdit';
import FormTambahAlamat from '../pages/FormTambahAlamat';
import FormEditAlamat from '../pages/FormEditAlamat';
import DetailVoucher from '../pages/DetailVoucher';
import DetailPromo from '../pages/DetailPromo';
import DetailCredit from '../pages/DetailCredit';
import CreditHistory from '../pages/CreditHistory';
import PointHistory from '../pages/PointHistory';
import ListTimeSubscribe from '../pages/ListTimeSubscribe';
// import Transaction from '../pages/Transaction';
import TransactionDetail from '../pages/TransactionDetail';
import ListDataPayment from '../pages/ListDataPayment';
import DetailRating from '../pages/DetailRating';
import WaitingRating from '../pages/WaitingRating';
import HistoryRating from '../pages/HistoryRating';
import InputRating from '../pages/InputRating';
import Wishlist from '../pages/Wishlist';
import InputRatingProduct from '../pages/InputRatingProduct';
import ProductRating from '../pages/ProductRating';
import OrderComplaint from '../pages/OrderComplaint';
import HelpCare from '../pages/HelpCare';
import HelpCareDetail from '../pages/HelpCareDetail';
import OrderComplaintTransaction from '../pages/OrderComplaintTransaction';
import OrderComplaintInput from '../pages/OrderComplaintInput';
import OrderComplaintDetail from '../pages/OrderComplaintDetail';
import UploadPayment from '../pages/UploadPayment';
import ConfirmationOrder from '../pages/ConfirmationOrder';
import HelpCareCategoryDetail from '../pages/HelpCareCategoryDetail';
import ReplyComplaint from '../pages/ReplyComplaint';
import KalenderPromo from '../pages/KalenderPromo';
import KalenderReward from '../pages/KalenderReward';
import DetailReward from '../pages/DetailReward';
import DetailStatusPesanan from '../pages/DetailStatusPesanan'
import Storage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import IconBack from '../assets/icons/backArrow.svg';
import {CommonActions} from '@react-navigation/native';
import TopSpender from '../pages/TopSpender';
import Mission from '../pages/Mission';
import ListMission from '../pages/ListMission';
import SplashMission from '../pages/SplashMission';
import OutOfStockDetails from '../pages/OutOfStockDetails'

const Stack = createStackNavigator();
const TopTab = createMaterialTopTabNavigator();

{
  /*
const Tab = createBottomTabNavigator();

const HomeStack = createStackNavigator();
const ProductStack = createStackNavigator();
const PembayaranStack = createStackNavigator();

const TAB_TO_RESET = 'Produk';
const TAB_TO_RESET2 = 'Home';

const resetProductsStackScreenOnTabPress = ({navigation, route}) => ({
  tabPress: e => {
    const state = navigation.dangerouslyGetState();

    if (state) {
      // Grab all the tabs that are NOT the one we just pressed
      const nonTargetTabs = state.routes.filter(r => r.key !== e.target);

      nonTargetTabs.forEach(tab => {
        // Find the tab we want to reset and grab the key of the nested stack
        const tabName = tab?.name;
        const stackKey = tab?.state?.key;

        if (stackKey && tabName === TAB_TO_RESET) {
          // Pass the stack key that we want to reset and use popToTop to reset it
          navigation.dispatch({
            ...StackActions.popToTop(),
            target: stackKey,
          });
        } else if (stackKey && tabName === TAB_TO_RESET2) {
          // Pass the stack key that we want to reset and use popToTop to reset it
          navigation.dispatch({
            ...StackActions.popToTop(),
            target: stackKey,
          });
        }
      });
    }
  },
});

function HomeStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Notification"
        component={Notification}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="NotificationShopping"
        component={NotificationShopping}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="NotificationComplaint"
        component={NotificationComplaint}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="NotificationSubscribe"
        component={NotificationSubscribe}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

function ProductsStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Produk"
        component={Produk}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DetailHerbal"
        component={DetailHerbal}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DetailSupMul"
        component={DetailSupMul}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DetailFoodBev"
        component={DetailFoodBev}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DetailMinyak"
        component={DetailMinyak}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="GeneralNew"
        component={GeneralNew}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="GeneralPopular"
        component={GeneralPopular}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="GeneralPromo"
        component={GeneralPromo}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="GeneralRecent"
        component={GeneralRecent}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="HerbalPromo"
        component={HerbalPromo}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="HerbalNew"
        component={HerbalNew}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="HerbalAll"
        component={HerbalAll}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="HerbalPopular"
        component={HerbalPopular}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="HerbalRecent"
        component={HerbalRecent}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SupMulPromo"
        component={SupMulPromo}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SupMulNew"
        component={SupMulNew}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SupMulAll"
        component={SupMulAll}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SupMulPopuler"
        component={SupMulPopuler}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SupMulRecent"
        component={SupMulRecent}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FoodBevPromo"
        component={FoodBevPromo}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FoodBevNew"
        component={FoodBevNew}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FoodBevAll"
        component={FoodBevAll}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FoodBevPopular"
        component={FoodBevPopular}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FoodBevRecent"
        component={FoodBevRecent}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MinyakPromo"
        component={MinyakPromo}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MinyakNew"
        component={MinyakNew}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MinyakAll"
        component={MinyakAll}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MinyakPopular"
        component={MinyakPopular}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MinyakRecent"
        component={MinyakRecent}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

function PembayaranStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Pembayaran"
        component={ListDataPayment}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Delivery"
        component={Delivery}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PaymentMethod"
        component={PaymentMethod}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ListPaymentDetail"
        component={TransactionDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ConfirmationOrder"
        component={ConfirmationOrder}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

function KeranjangStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Keranjang"
        component={Keranjang}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

const BottomNav = ({navigation}) => {
  return (
    <>
      <Tab.Navigator
        backBehaviour="initialRoute"
        tabBar={props => <BottomNavigator {...props} />}>
        <Tab.Screen
          name="Home"
          component={HomeStackScreen}
          options={{unmountOnBlur: true}}
          // listeners={resetProductsStackScreenOnTabPress}
        />
        <Tab.Screen
          name="Produk"
          component={ProductsStackScreen}
          options={{unmountOnBlur: true}}
          // listeners={resetProductsStackScreenOnTabPress}
        />
        <Tab.Screen
          name="Keranjang"
          // component={Keranjang}
          // options={{unmountOnBlur: true, headerShown: false}}
          component={KeranjangStackScreen}
          options={{unmountOnBlur: true}}
        />
        <Tab.Screen
          name="Pembayaran"
          component={PembayaranStackScreen}
          options={{unmountOnBlur: true}}
        />
      </Tab.Navigator>
      <View
        style={{
          height: hp('4.6%'),
          width: hp('4.6%'),
          // borderRadius: hp('8%'),
          backgroundColor: '#FFFFFF',
          position: 'absolute',
          bottom: wp('3.5%'),
          right: wp('3%'),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <IconChat onPress={() => navigation.navigate('Chat')} />
        <Text
          style={{
            fontSize: hp('1.3%'),
            fontFamily: 'Lato-Medium',
            color: '#AFAFAF',
          }}>
          {'Chat'}
        </Text>
      </View>
    </>
  );
};

*/
}

const TopNav = ({navigation}) => {
  return (
    <>
      <View style={{backgroundColor: 'white'}}>
        <View style={[styles.container]}>
          <IconBack
            width={wp('4%')}
            height={hp('4%')}
            stroke="black"
            strokeWidth="2.5"
            fill="black"
            onPress={() => navigation.navigate('Profile')}
          />
          <Text style={styles.text}>{'Daftar Ulasan'}</Text>
        </View>
      </View>
      <TopTab.Navigator>
        <TopTab.Screen
          name="WaitingRating"
          component={WaitingRating}
          options={{tabBarLabel: 'Menunggu Ulasan'}}
        />
        <TopTab.Screen
          name="HistoryRating"
          component={HistoryRating}
          options={{tabBarLabel: 'Riwayat'}}
        />
      </TopTab.Navigator>
    </>
  );
};

export class Router extends Component {
  render() {
    return (
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          // unmountOnBlur={true}
          component={Home}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Produk"
          // unmountOnBlur={true}
          component={Produk}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Notification"
          component={Notification}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="NotificationShopping"
          component={NotificationShopping}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="NotificationComplaint"
          component={NotificationComplaint}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="NotificationSubscribe"
          component={NotificationSubscribe}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ProdukKategori"
          component={ProdukKategori}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ListDataPayment"
          component={ListDataPayment}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Delivery"
          component={Delivery}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PaymentMethod"
          component={PaymentMethod}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ListPaymentDetail"
          component={TransactionDetail}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ConfirmationOrder"
          component={ConfirmationOrder}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Keranjang"
          component={Keranjang}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FormLupaPassword"
          component={FormLupaPassword}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FormIdentificationUser"
          component={FormIdentificationUser}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FormInputCodeUser"
          component={FormInputCodeUser}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FormInputCodeOTP"
          component={FormInputCodeOTP}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FormInputCodeOTPOld"
          component={FormInputCodeOTPOld}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FormInputVerifikasiOTPSMS"
          component={FormInputVerifikasiOTPSMS}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FormInputVerifikasiOTPSMSOld"
          component={FormInputVerifikasiOTPSMSOld}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FormInputVerifikasiOTPWA"
          component={FormInputVerifikasiOTPWA}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FormInputVerifikasiOTPWAOld"
          component={FormInputVerifikasiOTPWAOld}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FormInputOTPForgotPass"
          component={FormInputOTPForgotPass}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FormInputVerifikasiOTPWAForgot"
          component={FormInputVerifikasiOTPWAForgot}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FormInputVerifikasiOTPSMSForgot"
          component={FormInputVerifikasiOTPSMSForgot}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="RegisterUserLama"
          component={RegisterUserLama}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FormAlamat"
          component={FormAlamat}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FormAlamatEdit"
          component={FormAlamatEdit}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ProdukDeskripsi"
          component={ProdukDeskripsi}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Subscribe"
          component={Subscribe}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{headerShown: false, unmountOnBlur: true}}
        />
        <Stack.Screen
          name="DataUser"
          component={DataUser}
          options={{headerShown: false, unmountOnBlur: true}}
        />
        <Stack.Screen
          name="FormInputCodeOTPEditTelp"
          component={FormInputCodeOTPEditTelp}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FormVerifikasiEditTelepon"
          component={FormVerifikasiEditTelepon}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FormVerifikasiEditTeleponWA"
          component={FormVerifikasiEditTeleponWA}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FormEditNama"
          component={FormEditNama}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FormEditEmail"
          component={FormEditEmail}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FormEditNomorTelepon"
          component={FormEditNomorTelepon}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DataAlamat"
          component={DataAlamat}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FormEditAlamat"
          component={FormEditAlamat}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FormTambahAlamat"
          component={FormTambahAlamat}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ListSetting"
          component={ListSetting}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Barcode"
          component={Barcode}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ListDataSubscribe"
          component={ListDataSubscribe}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ListDataMonthSubscribe"
          component={ListDataMonthSubscribe}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DetailSubscribe"
          component={DetailSubscribe}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditSubscribe"
          component={EditSubscribe}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DetailVoucher"
          component={DetailVoucher}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DetailPromo"
          component={DetailPromo}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CreditHistory"
          component={CreditHistory}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PointHistory"
          component={PointHistory}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DetailCredit"
          component={DetailCredit}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ListTimeSubscribe"
          component={ListTimeSubscribe}
          options={{headerShown: false, unmountOnBlur: true}}
        />
        <Stack.Screen
          name="TransactionDetail"
          component={TransactionDetail}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DetailRating"
          component={DetailRating}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="TopNav"
          component={TopNav}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="InputRating"
          component={InputRating}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Wishlist"
          component={Wishlist}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="InputRatingProduct"
          component={InputRatingProduct}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ProductRating"
          component={ProductRating}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="OrderComplaint"
          component={OrderComplaint}
          options={{headerShown: false, unmountOnBlur: true}}
        />
        <Stack.Screen
          name="HelpCare"
          component={HelpCare}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="HelpCareDetail"
          component={HelpCareDetail}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="OrderComplaintTransaction"
          component={OrderComplaintTransaction}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="OrderComplaintInput"
          component={OrderComplaintInput}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="OrderComplaintDetail"
          component={OrderComplaintDetail}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="UploadPayment"
          component={UploadPayment}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="HelpCareCategoryDetail"
          component={HelpCareCategoryDetail}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ReplyComplaint"
          component={ReplyComplaint}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="KalenderPromo"
          component={KalenderPromo}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="KalenderReward"
          component={KalenderReward}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DetailReward"
          component={DetailReward}
          options={{headerShown: false}}
        />
        <Stack.Screen 
          name="DetailStatusPesanan"
          component={DetailStatusPesanan}
          options={{headerShown: false}}
        />
        <Stack.Screen 
          name="TopSpender"
          component={TopSpender}
          options={{headerShown: false}}
        />
        <Stack.Screen 
          name="Mission"
          component={Mission}
          options={{headerShown: false}}
        />
        <Stack.Screen 
          name="ListMission"
          component={ListMission}
          options={{headerShown: false}}
        />
        <Stack.Screen 
          name="SplashMission"
          component={SplashMission}
          options={{headerShown: false}}
        />
        <Stack.Screen 
          name="OutOfStockDetails"
          component={OutOfStockDetails}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    );
  }
}

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
});

const mapDispatchToProps = dispatch => {};

export default connect(mapStateToProps, mapDispatchToProps)(Router);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: hp('10.5%'),
    backgroundColor: 'white',
    paddingLeft: wp('5%'),
  },
  text: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('2.4%'),
    paddingLeft: wp('5%'),
  },
});
