import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Dimensions} from 'react-native';
import IconPembayaran from '../assets/icons/Pembayaran.svg'
import IconPembayaranActive from '../assets/icons/PembayaranActive.svg';
import IconProduk from '../assets/icons/Produk.svg';
import IconProdukActive from '../assets/icons/ProdukActive.svg';
import IconHome from '../assets/icons/Home.svg';
import IconHomeActive from '../assets/icons/HomeActive.svg';
import IconKeranjang from '../assets/icons/Keranjang.svg';
import IconKeranjangActive from '../assets/icons/KeranjangActive.svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';

const TabItem = ({ isFocused, onPress, onLongPress, label }) => {
    const Icon = () => {
        if (label === "Home") return isFocused ? (
          <IconHomeActive
          />
        ) : (
          <IconHome />
        );
        
        if (label === "Produk")
          return isFocused ? (
            <IconProdukActive/>
          ) : (
            <IconProduk/>
          );
        
        if (label === "Pembayaran")
            return isFocused ? (
              <IconPembayaranActive/>
            ) : (
              <IconPembayaran/>
            );
        
        if (label === "Keranjang")
            return isFocused ? (
              <IconKeranjangActive/>
            ) : (
              <IconKeranjang/>
            );
        return <IconHome />
    }

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
          style={styles.container}>
      <View style={styles.Icon(isFocused)}>
        <Icon />
        <Text style={styles.text(isFocused)}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default TabItem;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  text: isFocused => ({
    fontSize: hp('1.3%'),
    fontFamily: 'Lato-Medium',
    color: isFocused ? '#529F45' : '#AFAFAF',
    marginTop: hp('0%'),
    marginBottom: hp('2%'),
  }),
  Icon: isFocused => ({
    // backgroundColor: isFocused ? '#E07126' : '#7EDC6E',
    alignItems: 'center',
    height: hp('9%'),
    width: hp('9%'),
    borderTopWidth: isFocused ? 4 : null,
    borderTopColor: isFocused ? '#529F45' : null,
    // borderRadius: hp('1.5%'),
    justifyContent: 'center',
    marginTop: hp('-4%'),
    paddingTop: hp('2.5%'),
    paddingBottom: hp('2%'),
  }),
});
