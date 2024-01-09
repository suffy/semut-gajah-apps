import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  Text,
  FlatList,
  TouchableOpacity,
  Pressable,
  Modal,
} from 'react-native';
import {connect} from 'react-redux';
import Font from '../components/Fontresponsive';
import axios from 'axios';
import CONFIG from '../constants/config';
import NumberFormat from 'react-number-format';
import {SubsAction} from '../redux/Action';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import IconNext from '../assets/icons/Next.svg';
import IconNext2 from '../assets/icons/RightArrow.svg';
import Storage from '@react-native-async-storage/async-storage';
import {ActivityIndicator} from 'react-native-paper';
import {Card, Rating} from 'react-native-elements';
import DummyImage from '../assets/icons/IconLogo.svg';
import Snackbar from 'react-native-snackbar';
import IconCart from '../assets/newIcons/cartActive.svg';
import Bintang from '../assets/newIcons/iconBintangActive.svg';
const width = Dimensions.get('window').width;
const height = width * 0.5;
const widthItem = width / 3;
const products = [
  {
    id: '',
    name: '',
    image: '',
    price: {
      id: '',
      product_id: '',
      harga_ritel_gt: '',
      harga_grosir_mt: '',
      harga_semi_grosir: '',
      harga_promosi_coret_ritel_gt: '',
      harga_promosi_coret_grosir_mt: '',
      harga_promosi_coret_semi_grosir: '',
    },
  },
];

function LoadingApi() {
  return (
    <View style={styles.loadingApi}>
      <ActivityIndicator animating size="small" color="#529F45" />
    </View>
  );
}

export class List extends Component {
  render() {
    const {
      postShoppingCart,
      qtyTotalNew,
      qtyTotalPopular,
      qtyTotalPromo,
      rating,
      postRecent,
      showModal,
      products_newest,
      products_popular,
      products_recent,
      products_promo,
      getAnimation,
      getNotifAll,
    } = this.props;
    // console.log('LIST ', qtyTotalPopular);
    return (
      <View style={{flex: 1}}>
        {products_promo[0]?.data?.length > 0 && (
          <View style={styles.container}>
            <View style={styles.columnTitle}>
              <Text style={styles.title}>{'Produk Promo'}</Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('KalenderPromo')}
                style={styles.buttonNext2}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}>
                  <Text style={styles.textButtonNext2}>{'Lihat Semua'}</Text>
                  <IconNext2
                    fill="#529F45"
                    width={wp('3%')}
                    height={wp('3%')}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <ScrollView
              contentContainerStyle={{
                paddingLeft: wp('5%'),
                paddingRight: wp('5%'),
              }}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.scroll}>
              {products_promo[0]?.data?.map((item, index) => (
                // <View key={index}>
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    postRecent(item),
                      this.props.navigation.navigate(
                        'ProdukDeskripsi',
                        {initial: false},
                        this.props.subsAct(item, 'item'),
                      );
                  }}
                  style={styles.buttonViewProdukTerbaru}>
                  <View style={styles.imagesContainer}>
                    {item.image ? (
                      <Image
                        resizeMode="contain"
                        source={{uri: CONFIG.BASE_URL + item.image}}
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
                        {item.name}
                      </Text>
                    </View>
                    <NumberFormat
                      value={Math.round(item?.price?.harga_ritel_gt)}
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
                            color: '#000000',
                            fontFamily: 'Lato-Medium',
                            marginLeft: wp('1%'),
                          }}>
                          {' '}
                          {item.review
                            ? item.review[0]
                              ? item.review[0].avg_rating
                              : '0'
                            : '0'}
                        </Text>
                      </View>
                      {item.cart && (
                        <View style={styles.borderLogo}>
                          <IconCart width={wp('4%')} height={wp('4%')} />
                          <Text
                            style={{
                              fontSize: hp('1.6%'),
                              color: '#529F45',
                              fontFamily: 'Lato-Medium',
                              marginLeft: wp('1%'),
                            }}>
                            {item.cart.qty}
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
                  {item.promo_sku?.length > 0 && (
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
                  {item.cart ? (
                    <Pressable
                      style={styles.buttonKeranjang}
                      onPress={async () => {
                        postShoppingCart(item);
                      }}>
                      <Text style={styles.textKeranjang}>{'Tambah'}</Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      style={styles.buttonKeranjang}
                      onPress={async () => {
                        postShoppingCart(item);
                      }}>
                      <Text style={styles.textKeranjang}>{'Beli'}</Text>
                    </Pressable>
                  )}
                </TouchableOpacity>
                // </View>
              ))}
              {qtyTotalPromo > 10 ? (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('KalenderPromo')
                  }
                  style={styles.buttonNext}>
                  <IconNext fill="#529F45" width={wp('8%')} height={hp('5%')} />
                  <Text style={styles.textButtonNext}>{'Lihat Semua'}</Text>
                </TouchableOpacity>
              ) : null}
            </ScrollView>
          </View>
        )}
        {/* </>
        )} */}
        {/* produk terakhir dipesan */}
        {/* {loadingApi3 ? (
          <LoadingApi />
          ) : (
          <> */}
        {products_recent[0]?.data?.length > 0 && (
          <View style={styles.container}>
            <View style={styles.columnTitle}>
              <Text style={styles.title}>{'Produk Terakhir Dilihat'}</Text>
            </View>
            <ScrollView
              contentContainerStyle={{
                paddingLeft: wp('5%'),
                paddingRight: wp('5%'),
              }}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.scroll}>
              {products_recent[0]?.data?.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      postRecent(item),
                        this.props.navigation.navigate(
                          'ProdukDeskripsi',
                          {initial: false},
                          this.props.subsAct(item, 'item'),
                        );
                    }}
                    style={styles.buttonViewProdukTerbaru}>
                      <View style={styles.imagesContainer}>
                    {item.image ? (
                      <Image
                        resizeMode="contain"
                        source={{uri: CONFIG.BASE_URL + item.image}}
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
                          {item.name}
                        </Text>
                      </View>
                      <NumberFormat
                        value={Math.round(item?.price?.harga_ritel_gt)}
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
                              color: '#000000',
                              fontFamily: 'Lato-Medium',
                              marginLeft: wp('1%'),
                            }}>
                            {' '}
                            {item.review
                              ? item.review[0]
                                ? item.review[0].avg_rating
                                : '0'
                              : '0'}
                          </Text>
                        </View>
                        {item.cart && (
                          <View style={styles.borderLogo}>
                            <IconCart width={wp('4%')} height={wp('4%')} />
                            <Text
                              style={{
                                fontSize: hp('1.6%'),
                                color: '#529F45',
                                fontFamily: 'Lato-Medium',
                                marginLeft: wp('1%'),
                              }}>
                              {item.cart.qty}
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
                    {item.promo_sku?.length > 0 && (
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
                    {item.cart ? (
                      <Pressable
                        style={styles.buttonKeranjang}
                        onPress={async () => {
                          postShoppingCart(item);
                        }}>
                        <Text style={styles.textKeranjang}>{'Tambah'}</Text>
                      </Pressable>
                    ) : (
                      <Pressable
                        style={styles.buttonKeranjang}
                        onPress={async () => {
                          postShoppingCart(item);
                        }}>
                        <Text style={styles.textKeranjang}>{'Beli'}</Text>
                      </Pressable>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
        {/* </>
        )} */}
        {/* produk terbaru */}
        {/* {loadingApi ? (
          <LoadingApi />
        ) : (
          <> */}
        {products_newest[0]?.data?.length > 0 && (
          <View style={styles.container}>
            <View style={styles.columnTitle}>
              <Text style={styles.title}>{'Produk Terbaru'}</Text>
              {qtyTotalNew > 10 ? (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('ProdukKategori', {
                      screen: 'GeneralNew',
                    })
                  }
                  style={styles.buttonNext2}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                    }}>
                    <Text style={styles.textButtonNext2}>{'Lihat Semua'}</Text>
                    <IconNext2
                      fill="#529F45"
                      width={wp('3%')}
                      height={wp('3%')}
                    />
                  </View>
                </TouchableOpacity>
              ) : null}
            </View>
            <ScrollView
              contentContainerStyle={{
                paddingLeft: wp('5%'),
                paddingRight: wp('5%'),
              }}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.scroll}>
              {products_newest[0]?.data?.map((item, index) => (
                // <View key={index}>
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    postRecent(item),
                      this.props.navigation.navigate(
                        'ProdukDeskripsi',
                        {initial: false},
                        this.props.subsAct(item, 'item'),
                      );
                  }}
                  style={styles.buttonViewProdukTerbaru}>
                  <View style={styles.imagesContainer}>
                    {item.image ? (
                      <Image
                        resizeMode="contain"
                        source={{uri: CONFIG.BASE_URL + item.image}}
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
                        {item.name}
                      </Text>
                    </View>
                    <NumberFormat
                      value={Math.round(item?.price?.harga_ritel_gt)}
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
                            color: '#000000',
                            fontFamily: 'Lato-Medium',
                            marginLeft: wp('1%'),
                          }}>
                          {' '}
                          {item.review
                            ? item.review[0]
                              ? item.review[0].avg_rating
                              : '0'
                            : '0'}
                        </Text>
                      </View>
                      {item.cart && (
                        <View style={styles.borderLogo}>
                          <IconCart width={wp('4%')} height={wp('4%')} />
                          <Text
                            style={{
                              fontSize: hp('1.6%'),
                              color: '#529F45',
                              fontFamily: 'Lato-Medium',
                              marginLeft: wp('1%'),
                            }}>
                            {item.cart.qty}
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
                  {item.promo_sku?.length > 0 && (
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
                  {item.cart ? (
                    <Pressable
                      style={styles.buttonKeranjang}
                      onPress={async () => {
                        postShoppingCart(item);
                      }}>
                      <Text style={styles.textKeranjang}>{'Tambah'}</Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      style={styles.buttonKeranjang}
                      onPress={async () => {
                        postShoppingCart(item);
                      }}>
                      <Text style={styles.textKeranjang}>{'Beli'}</Text>
                    </Pressable>
                  )}
                </TouchableOpacity>
                // </View>
              ))}
              {qtyTotalNew > 10 ? (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('ProdukKategori', {
                      screen: 'GeneralNew',
                    })
                  }
                  style={styles.buttonNext}>
                  <IconNext fill="#529F45" width={wp('8%')} height={hp('5%')} />
                  <Text style={styles.textButtonNext}>{'Lihat Semua'}</Text>
                </TouchableOpacity>
              ) : null}
            </ScrollView>
          </View>
        )}
        {/* </>
        )} */}
        {/* produk populer */}
        {/* {loadingApi2 ? (
          <LoadingApi />
        ) : (
          <> */}
        {products_popular[0]?.data?.length > 0 && (
          <View style={[styles.container]}>
            <View style={styles.columnTitle}>
              <Text style={styles.title}>{'Produk Populer'}</Text>
              {qtyTotalPopular > 10 ? (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('ProdukKategori', {
                      screen: 'GeneralPopular',
                    })
                  }
                  style={styles.buttonNext2}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                    }}>
                    <Text style={styles.textButtonNext2}>{'Lihat Semua'}</Text>
                    <IconNext2
                      fill="#529F45"
                      width={wp('3%')}
                      height={wp('3%')}
                    />
                  </View>
                </TouchableOpacity>
              ) : null}
            </View>
            <ScrollView
              contentContainerStyle={{
                paddingLeft: wp('5%'),
                paddingRight: wp('5%'),
              }}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.scroll}>
              {products_popular[0]?.data?.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    postRecent(item),
                      this.props.navigation.navigate(
                        'ProdukDeskripsi',
                        {initial: false},
                        this.props.subsAct(item, 'item'),
                      );
                  }}
                  style={styles.buttonViewProdukTerbaru}>
                  <View style={styles.imagesContainer}>
                  {item.image ? (
                    <Image
                      resizeMode="contain"
                      source={{uri: CONFIG.BASE_URL + item.image}}
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
                        {item.name}
                      </Text>
                    </View>
                    <NumberFormat
                      value={Math.round(item?.price?.harga_ritel_gt)}
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
                            color: '#000000',
                            fontFamily: 'Lato-Medium',
                            marginLeft: wp('1%'),
                          }}>
                          {' '}
                          {item.review
                            ? item.review[0]
                              ? item.review[0].avg_rating
                              : '0'
                            : '0'}
                        </Text>
                      </View>
                      {item.cart && (
                        <View style={styles.borderLogo}>
                          <IconCart width={wp('4%')} height={wp('4%')} />
                          <Text
                            style={{
                              fontSize: hp('1.6%'),
                              color: '#529F45',
                              fontFamily: 'Lato-Medium',
                              marginLeft: wp('1%'),
                            }}>
                            {item.cart.qty}
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
                  {item.promo_sku?.length > 0 && (
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
                  {item.cart ? (
                    <Pressable
                      style={styles.buttonKeranjang}
                      onPress={async () => {
                        postShoppingCart(item);
                      }}>
                      <Text style={styles.textKeranjang}>{'Tambah'}</Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      style={styles.buttonKeranjang}
                      onPress={async () => {
                        postShoppingCart(item);
                      }}>
                      <Text style={styles.textKeranjang}>{'Beli'}</Text>
                    </Pressable>
                  )}
                </TouchableOpacity>
              ))}
              {qtyTotalPopular > 10 ? (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('ProdukKategori', {
                      screen: 'GeneralPopular',
                    })
                  }
                  style={styles.buttonNext}>
                  <IconNext fill="#529F45" width={wp('8%')} height={hp('5%')} />
                  <Text style={styles.textButtonNext}>{'Lihat Semua'}</Text>
                </TouchableOpacity>
              ) : null}
            </ScrollView>
          </View>
        )}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
  dataUser: state.LoginReducer.dataUser,
  item: state.SubscribeReducer.item,
  qty: state.ShoppingCartReducer.qty,
});

const mapDispatchToProps = dispatch => {
  return {
    subsAct: (value, tipe) => {
      dispatch(SubsAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(List);

const styles = StyleSheet.create({
  container: {
    height: hp('43%'),
    backgroundColor: '#F4F4F4',
    // marginHorizontal: wp('-5%'),
    marginBottom: wp('1%'),
    elevation: 5,
  },
  scroll: {
    // backgroundColor: 'blue',
    width,
    height,
  },
  list: {
    width: wp('25%'),
    height: wp('25%'),
    backgroundColor: '#FFF',
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
  title: {
    fontSize: hp('1.7%'),
    fontFamily: 'Lato-Bold',
    color: '#575251',
    paddingLeft: wp('5%'),
  },
  buttonNext: {
    margin: 20,
    height: wp('62.8%'),
    marginRight: wp('5%'),
    marginLeft: wp('0.5%'),
    width: wp('35%'),
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp('2%'),
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000000',
    backgroundColor: '#FFFFFF',
    elevation: 1,
  },
  buttonNext2: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingRight: wp('2%'),
  },
  textButtonNext: {
    fontSize: hp('1.6'),
    fontFamily: 'Robotic-Medium',
    color: '#529F45',
  },
  textButtonNext2: {
    fontSize: hp('1.2%'),
    fontFamily: 'Lato-Medium',
    color: '#529F45',
    paddingRight: wp('0.5%'),
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
  buttonViewProdukTerbaru: {
    margin: 20,
    width: wp('33%'),
    marginRight: wp('3%'),
    marginLeft: wp('0.5%'),
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderRadius: hp('2%'),
    shadowColor: '#000000',
    backgroundColor: '#F4F4F4',
  },
  buttonKeranjang: {
    backgroundColor: '#FFF',
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
  columnTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  // RATING
  borderLogo: {
    borderColor: '#777',
    borderRadius: hp('1.5%'),
    alignItems: 'center',
    flexDirection: 'row',
  },
  loadingApi: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    width: wp('100%'),
    marginTop: hp('10%'),
    // height: hp('100%'),
    // position: 'absolute',
    // top:hp('-50%')
  },
});
