import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
} from 'react-native';
import Logo from '../assets/icons/Logo.svg';
import IconSearch from '../assets/newIcons/iconPencarian.svg';
import IconNotif from '../assets/newIcons/iconNotif.svg';
import IconShopping from '../assets/newIcons/iconKeranjangAktif.svg';
import IconMenu from '../assets/newIcons/iconMenu.svg';
import IconClose from '../assets/newIcons/iconClose.svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';

const HeaderHome = ({
  handlerSearch,
  search,
  navigation,
  notifCount,
  cartCount,
  removeParams,
}) => {
  return (
    <View style={styles.container2}>
      <Logo
        onPress={() => navigation.navigate('Home')}
        width={wp('12%')}
        height={hp('7%')}
        marginLeft={wp('4%')}
      />
      <View style={styles.searchSection}>
        <TextInput
          autoCapitalize="none"
          onChangeText={value => handlerSearch(value)}
          style={styles.inputStyle}
          placeholder="Pencarian..."
          value={search}
          selectTextOnFocus={true}
        />
        {search === '' ? (
          <IconSearch
            width={wp('4.5%')}
            height={hp('6.5%')}
            style={styles.search}
          />
        ) : (
          <IconClose
            fill={'black'}
            width={wp('4%')}
            height={hp('6.5%')}
            style={[styles.search]}
            onPress={() => {
              removeParams();
            }}
          />
        )}
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('Notification')}>
        <IconNotif width={wp('5.5%')} height={hp('5.5%')} />
        {notifCount > 0 ? (
          <View style={styles.counter}>
            <Text style={styles.counterText}>
              {notifCount > 100 ? '99+' : notifCount}
            </Text>
          </View>
        ) : null}
      </TouchableOpacity>
      <TouchableOpacity
        style={{Position: 'relative'}}
        onPress={() => navigation.navigate('Keranjang')}>
        <IconShopping width={wp('5.5%')} height={hp('5.5%')} />
        {cartCount > 0 ? (
          <View style={styles.counter}>
            <Text style={styles.counterText}>
              {cartCount > 100 ? '99+' : cartCount}
            </Text>
          </View>
        ) : null}
      </TouchableOpacity>
      <TouchableOpacity style={styles.menu} onPress={() => navigation.navigate('Profile')}>
        <IconMenu
          width={wp('5.5%')}
          height={hp('5.5%')}
          marginRight={wp('2%')}
        />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: hp('8%'),
    width:wp('100%'),
    backgroundColor: 'white',
    borderBottomWidth: 4,
    borderColor: '#ddd',
  },
  searchSection: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: hp('5%'),
  },
  inputStyle: {
    // flex: 1,
    borderWidth: 2,
    fontFamily: 'Lato-Medium',
    fontSize: hp('1.8%'),
    color: '#000000',
    width: wp('50%'),
    height: hp('5%'),
    marginLeft: wp('1%'),
    paddingLeft: wp('5%'),
    paddingRight: wp('10%'),
    borderRadius: hp('2.5%'),
    borderColor: '#F1F1F1',
    backgroundColor: '#F1F1F1',
  },
  search: {
    position: 'absolute',
    top: wp('-1.5%'),
    right: wp('4%'),
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
  menu: {
    marginRight: wp('2%'),
  },
});

export default HeaderHome;
