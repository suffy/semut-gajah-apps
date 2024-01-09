import React, {Component} from 'react';
import {
  View,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Text,
  RefreshControl,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import CONFIG from '../constants/config';
import NumberFormat from 'react-number-format';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import DummyImage from '../assets/icons/IconLogo.svg';
import IconNext from '../assets/icons/Next.svg';
import IconCart from '../assets/newIcons/cartActive.svg';
import Bintang from '../assets/newIcons/iconBintangActive.svg';
export class CardProdukPromo extends Component {
  render() {
    const {onClick, data, postShoppingCart, qtyTotal, onClickAll} =
      this.props;
    return (
      <ScrollView
        contentContainerStyle={{
          paddingLeft: wp('5%'),
          paddingRight: wp('5%'),
          backgroundColor: '#F4F4F4',
         
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}>
        {data?.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              onClick(item?.product);
            }}
            style={styles.buttonViewProdukTerbaru}>
            <View style={styles.imagesContainer}>
              {item?.product?.image ? (
                <Image
                  resizeMode="contain"
                  source={{uri: CONFIG.BASE_URL + item?.product?.image}}
                  style={styles.list}
                />
              ) : (
                <DummyImage style={styles.list} />
              )}
            </View>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                marginHorizontal: wp('3%'),
              }}>
              <View style={{height: wp('9%')}}>
                <Text numberOfLines={2} style={styles.listTitle}>
                  {item?.product?.name}
                </Text>
              </View>
              <NumberFormat
                value={Math.round(item?.product?.price?.harga_ritel_gt)}
                displayType={'text'}
                thousandSeparator={true}
                prefix={'Rp '}
                renderText={value => (
                  <Text style={styles.listPrice}>{value || 0}</Text>
                )}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View style={styles.borderLogo}>
                  <Bintang height={wp('3%')} width={wp('3%')} />
                  <Text
                    style={{
                      fontSize: hp('1.6%'),
                      color: '#575251',
                      fontFamily: 'Lato-Medium',
                      marginLeft: wp('1%'),
                    }}>
                    {' '}
                    {item?.product?.review
                      ? item?.product?.review[0]
                        ? item?.product?.review[0].avg_rating
                        : '0'
                      : '0'}
                  </Text>
                </View>
                {item?.product?.cart && (
                  <View style={styles.borderLogo}>
                    <IconCart width={wp('4%')} height={wp('4%')} />
                    <Text
                      style={{
                        fontSize: hp('1.6%'),
                        color: '#529F45',
                        fontFamily: 'Lato-Medium',
                        marginLeft: wp('1%'),
                      }}>
                      {item?.product?.cart.qty}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <View
              style={{
                width: wp('27.5%'),
                borderColor: '#EEEEEE',
                marginBottom: wp('1%'),
                marginLeft: wp('0%'),
                marginRight: wp('0%'),
              }}
            />
            {item?.product?.promo_sku?.length > 0 && (
              <View
                style={{
                  flexDirection: 'row',
                  position: 'absolute',
                  left: 7,
                  top: 5,
                }}>
                <View
                  style={{
                    backgroundColor: '#F2BB4C',
                    padding: 4,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingLeft: 10,
                    paddingRight: 10,
                    borderRadius: hp('0.5%'),
                  }}>
                  <Text
                    style={{
                      fontSize: hp('1.5%'),
                      fontFamily: 'Lato-Medium',
                      color: '#FFF',
                    }}>
                    {'Promo'}
                  </Text>
                </View>
              </View>
            )}
            <Pressable
              style={styles.buttonKeranjang}
              onPress={() => {
                postShoppingCart(item.product);
              }}>
              {item?.product?.cart ? (
                <Text style={styles.textKeranjang}>{'Tambah'}</Text>
              ) : (
                <Text style={styles.textKeranjang}>{'Beli'}</Text>
              )}
            </Pressable>
          </TouchableOpacity>
        ))}
        {qtyTotal >= 10 ? (
          <TouchableOpacity
            onPress={() => onClickAll()}
            style={styles.buttonNext}>
            <IconNext fill="#529F45" width={wp('8%')} height={hp('5%')} />
            <Text style={styles.textButtonNext}>{'Lihat Semua'}</Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  buttonViewProdukTerbaru: {
    marginTop: hp('2%'),
    width: wp('30%'),
    height: hp('45%'),
    marginHorizontal: wp('2%'),
    marginBottom: hp('10%'),
    borderRadius: hp('2%'),
    backgroundColor: '#F4F4F4',
  },
  list: {
    width: wp('27%'),
    height: wp('27%'),
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
    borderRadius: wp('1%'),
  },
  listTitle: {
    fontSize: hp('1.6%'),
    fontFamily: 'Lato-Medium',
    color: '#575251',
    marginTop: wp('1%'),
  },
  listPrice: {
    fontSize: hp('2%'),
    fontFamily: 'Lato-Bold',
    color: '#575251',
    marginBottom: wp('1%'),
    marginTop: wp('1%'),
  },
  borderLogo: {
    borderColor: '#777',
    borderRadius: hp('1.5%'),
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonKeranjang: {
    backgroundColor: '#FFFFFF',
    borderColor: '#5CC443',
    borderWidth: 1,
    borderRadius: hp('1%'),
    width: wp('27%'),
    height: hp('3.5%'),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  textKeranjang: {
    textAlign: 'center',
    color: '#5CC443',
    fontSize: hp('1.8%'),
    fontFamily: 'Lato-Medium',
  },
  buttonNext: {
    margin: 18,
    marginRight: wp('5%'),
    marginLeft: wp('0.5%'),
    width: wp('33%'),
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp('2%'),
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000000',
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  textButtonNext: {
    fontSize: hp('1.6'),
    fontFamily: 'Robotic-Medium',
    color: '#529F45',
  },
  imagesContainer: {
    backgroundColor: '#FFF',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('3%'),
    paddingVertical: wp('5%'),
    borderRadius: wp('5%'),
  },
  scroll: {
    flex: 1,
    // backgroundColor: '#F8F8F8',
    backgroundColor: '#F4F4F4',
    width: wp('100%'),
  },
});

export default CardProdukPromo;
