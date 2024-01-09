import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Pressable,
  Modal,
  PermissionsAndroid,
} from 'react-native';
import {LoginAction} from '../redux/Action';
import {connect} from 'react-redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import IconPembayaran from '../assets/newIcons/payment.svg';
import IconPembayaranActive from '../assets/newIcons/paymentActive.svg';
import IconProduk from '../assets/newIcons/produk.svg';
import IconProdukActive from '../assets/newIcons/produkActive.svg';
import IconHome from '../assets/newIcons/home.svg';
import IconHomeActive from '../assets/newIcons/homeActive.svg';
import IconKeranjang from '../assets/newIcons/cart.svg';
import IconKeranjangActive from '../assets/newIcons/cartActive.svg';
import IconChat from '../assets/newIcons/chat.svg';
import IconChatActive from '../assets/newIcons/chatActive.svg';
import {copilot, walkthroughable, CopilotStep} from 'react-native-copilot';

const CopilotTouchableOpacity = walkthroughable(TouchableOpacity);

class BottomNavigation extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {navigation, nameRoute, copilotEvents} = this.props;
    // console.log('copilot===', copilotEvents);
    return (
      <View style={styles.containerHeader}>
        {copilotEvents ? (
          <>
            <CopilotStep
              text="Ini adalah halaman home atau awal"
              order={6}
              name="Home">
              <CopilotTouchableOpacity
                style={[styles.item, {borderTopLeftRadius: 20}]}
                onPress={() => navigation.navigate('Home')}>
                <View style={[styles.bgItem, {backgroundColor: '#F4F4F4'}]}>
                  <IconHomeActive width={wp('8%')} height={wp('8%')} />
                </View>
                {/* <Text style={styles.textHeader}>{'Home'}</Text> */}
              </CopilotTouchableOpacity>
            </CopilotStep>
            <CopilotStep
              text="Ini adalah halaman produk"
              order={7}
              name="Produk">
              <CopilotTouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate('Produk', {initial: false})}>
                <IconProduk width={wp('8%')} height={wp('8%')} />
                {/* <Text style={styles.textHeader}>{'Produk'}</Text> */}
              </CopilotTouchableOpacity>
            </CopilotStep>
            <CopilotStep
              text="Ini adalah halaman keranjang yang memuat produk yang akan dibeli"
              order={8}
              name="Keranjang">
              <CopilotTouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate('Keranjang')}>
                <IconKeranjang width={wp('8%')} height={wp('8%')} />
                {/* <Text style={styles.textHeader}>{'Keranjang'}</Text> */}
              </CopilotTouchableOpacity>
            </CopilotStep>
            <CopilotStep
              text="Ini adalah halaman transaksi"
              order={9}
              name="Pembayaran">
              <CopilotTouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate('ListDataPayment')}>
                <IconPembayaran width={wp('8%')} height={wp('8%')} />
                {/* <Text style={styles.textHeader}>{'Pembayaran'}</Text> */}
              </CopilotTouchableOpacity>
            </CopilotStep>
            <CopilotStep
              text="Dan ini adalah halaman chat ke admin"
              order={10}
              name="Chat">
              <CopilotTouchableOpacity
                style={[styles.item, {borderTopRightRadius: 20}]}
                onPress={() => {
                  navigation.navigate('Chat');
                }}>
                <IconChat width={wp('8%')} height={wp('8%')} />
                {/* <Text style={styles.textHeader}>{'Chat'}</Text> */}
              </CopilotTouchableOpacity>
            </CopilotStep>
          </>
        ) : (
          <>
            {nameRoute == 'Home' ? (
              <TouchableOpacity
                style={[styles.item, {borderTopLeftRadius: 20}]}
                onPress={() => navigation.navigate('Home')}>
                <View style={[styles.bgItem, {backgroundColor: '#F4F4F4'}]}>
                  <IconHomeActive width={wp('8%')} height={wp('8%')} />
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.item, {borderTopLeftRadius: 20}]}
                onPress={() => navigation.navigate('Home')}>
                <View style={[styles.bgItem, {backgroundColor: '#FFF'}]}>
                  <IconHome width={wp('8%')} height={wp('8%')} />
                </View>
              </TouchableOpacity>
            )}
            {nameRoute == 'Produk' ? (
              <TouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate('Produk', {initial: false})}>
                <View style={[styles.bgItem, {backgroundColor: '#F4F4F4'}]}>
                  <IconProdukActive width={wp('8%')} height={wp('8%')} />
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate('Produk', {initial: false})}>
                <View style={[styles.bgItem, {backgroundColor: '#FFF'}]}>
                  <IconProduk width={wp('8%')} height={wp('8%')} />
                </View>
              </TouchableOpacity>
            )}
            {nameRoute == 'Keranjang' ? (
              <TouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate('Keranjang')}>
                <View style={[styles.bgItem, {backgroundColor: '#F4F4F4'}]}>
                  <IconKeranjangActive width={wp('8%')} height={wp('8%')} />
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate('Keranjang')}>
                <View style={[styles.bgItem, {backgroundColor: '#FFF'}]}>
                  <IconKeranjang width={wp('8%')} height={wp('8%')} />
                </View>
              </TouchableOpacity>
            )}
            {nameRoute == 'Pembayaran' ? (
              <TouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate('ListDataPayment')}>
                <View style={[styles.bgItem, {backgroundColor: '#F4F4F4'}]}>
                  <IconPembayaranActive width={wp('8%')} height={wp('8%')} />
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate('ListDataPayment')}>
                <View style={[styles.bgItem, {backgroundColor: '#FFF'}]}>
                  <IconPembayaran width={wp('8%')} height={wp('8%')} />
                </View>
              </TouchableOpacity>
            )}
            {nameRoute == 'Chat' ? (
              <TouchableOpacity
                style={[styles.item, {borderTopRightRadius: 20}]}
                onPress={() => {
                  navigation.navigate('Chat');
                }}>
                <View style={[styles.bgItem, {backgroundColor: '#F4F4F4'}]}>
                  <IconChatActive width={wp('8%')} height={wp('8%')} />
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.item, {borderTopRightRadius: 20}]}
                onPress={() => {
                  navigation.navigate('Chat');
                }}>
                <View style={[styles.bgItem, {backgroundColor: '#FFF'}]}>
                  <IconChat width={wp('8%')} height={wp('8%')} />
                </View>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  dataUser: state.LoginReducer.dataUser,
  // nameRoute: state.LoginReducer.nameRoute,
});

const mapDispatchToProps = dispatch => {
  return {
    loginAct: (value, tipe) => {
      dispatch(LoginAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BottomNavigation);

const styles = StyleSheet.create({
  containerHeader: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: hp('8.5%'),
    width: '100%',
    backgroundColor:'#FFF',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    // borderTopWidth: 3,
    // borderColor: '#ddd',
    // paddingBottom: hp('1.5%'),
  },
  textHeader: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('1.6%'),
  },
  item: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    width: '20%',
    marginTop: wp('0%'),
    height: '100%',
    justifyContent: 'center',
  },
  bgItem: {
    height: wp('12%'),
    width: wp('12%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp('6%'),
  },
});
