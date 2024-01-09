import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import IconNotif from '../assets/newIcons/iconNotif.svg';
import IconMenu from '../assets/newIcons/iconMenu.svg';
import IconShopping from '../assets/newIcons/iconKeranjangAktif.svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import IconBack from '../assets/newIcons/iconBack.svg';

const Header = ({
  navigation,
  title,
  notif,
  notifCount,
  cart,
  cartCount,
  menu,
}) => {
  return (
    <View style={[styles.containerHeader]}>
      <View style={[styles.container]}>
        <IconBack
          width={wp('6%')}
          height={hp('4%')}
          // stroke="black"
          // strokeWidth="2.5"
          // fill="black"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.text}>{title}</Text>
      </View>
      <View style={styles.buttonHeader}>
        {/* notif true maka icon notif muncul */}
        {notif == true ? (
          <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
            <IconNotif width={wp('5.5%')} height={hp('5.5%')} />
            {/* notif true maka notifCount harus diisi  */}
            {notifCount > 0 ? (
              <View style={styles.counter}>
                <Text style={styles.counterText}>
                  {notifCount > 100 ? '99+' : notifCount}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
        ) : null}
        {/* cart true maka icon keranjang muncul */}
        {cart == true ? (
          <TouchableOpacity
            style={styles.menu}
            onPress={() => navigation.navigate('Keranjang')}>
            <IconShopping width={wp('5.5%')} height={hp('5.5%')} />
            {/* cart true maka cartCount harus diisi */}
            {cartCount > 0 ? (
              <View style={styles.counter}>
                <Text style={styles.counterText}>
                  {cartCount > 100 ? '99+' : cartCount}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
        ) : null}
        {menu ? (
          <TouchableOpacity
            style={styles.menu}
            onPress={() => navigation.navigate('Profile')}>
            <IconMenu width={wp('5.5%')} height={hp('5.5%')} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: wp('3%'),
  },
  containerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: hp('8%'),
    backgroundColor: 'white',
    borderBottomWidth: 4,
    borderColor: '#ddd',
    // marginBottom: wp('3%'),
  },
  menu: {
    marginLeft: wp('4%'),
  },
  counter: {
    position: 'absolute',
    right: wp('-2.7%'),
    bottom: hp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#529F45',
    width: hp('2.5%'),
    height: hp('2.5%'),
    borderRadius: hp('2.5%'),
  },
  counterText: {
    textAlign: 'center',
    color: 'white',
    fontSize: hp('1.3%'),
    fontFamily: 'Lato-Bold',
  },
  text: {
    color: '#575251',
    fontFamily: 'Lato-Medium',
    fontSize: hp('2.3%'),
    paddingLeft: wp('1.5%'),
    fontWeight: 'bold',
  },
  buttonHeader: {
    flexDirection: 'row',
    paddingHorizontal: wp('5%'),
  },
});
export default Header;
