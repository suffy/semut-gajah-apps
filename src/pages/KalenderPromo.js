import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Pressable,
  Modal,
  FlatList,
  RefreshControl,
} from 'react-native';
import {connect} from 'react-redux';
import {VoucherAction, SubsAction} from '../redux/Action';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import CONFIG from '../constants/config';
import axios from 'axios';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import IconBack from '../assets/icons/backArrow.svg';
import DummyImage from '../assets/icons/IconLogo.svg';
import {Card, Rating} from 'react-native-elements';
import IconCart from '../assets/icons/KeranjangActive.svg';
import IconNext from '../assets/icons/Next.svg';
import IconNext2 from '../assets/icons/RightArrow.svg';
import {ActivityIndicator} from 'react-native-paper';
import Snackbar from 'react-native-snackbar';
import Icon404 from '../assets/icons/404.svg';
import ModalBlackList from '../components/ModalBlackList';
import Header from '../components/Header';
import CardProduk from '../components/CardProdukPromo';

const {width} = Dimensions.get('window');
const height = width * 0.44;
const regEx = /(<([^>]+)>)/gi;
const regEx2 = /((&nbsp;))*/gim;

function LoadingApi() {
  return (
    <View style={styles.loadingApi}>
      <ActivityIndicator animating size="small" color="#529F45" />
    </View>
  );
}

export class KalenderPromo extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.onEndReachedCalledDuringMomentum = false;
    this.state = {
      promo: [],
      modalVisible: false,
      modalVisibleTutorial: false,
      rating: '1',
      shoppingCartItems: {
        product_id: '',
        brand_id: '',
        satuan_online: '',
        konversi_sedang_ke_kecil: '',
        qty_konversi: '',
        qty: 1,
        notes: '',
        price_apps: '',
      },
      loadingApi: true,
      page: 1,
      loadingMore: false,
      refreshing: false,
      maxPage: 1,
      visibleModalBlack: false,
      product_promo: [],
    };
  }
  UNSAFE_componentWillMount = async () => {
    // lor(this);
    this._isMounted = true;
    await this.getPromo();
  };

  componentWillUnmount() {
    // rol();
    this._isMounted = false;
  }

  getPromo = async () => {
    const {page} = this.state;
    try {
      let response = await axios({
        method: 'GET',
        url: `${CONFIG.BASE_URL}/api/promo?&page=${page}`,
        headers: {Authorization: `Bearer ${this.props.token}`},
      });
      const data = response.data.data;
      this.setState({
        promo: page === 1 ? data.data : [...this.state.promo, ...data.data],
        loadingMore: data.last_page > this.state.page,
        maxPage: data.last_page,
        loadingApi: false,
      });
    } catch (error) {
      this.setState({loadingApi: false});
      let error429 =
        JSON.parse(JSON.stringify(error)).message ===
        'Request failed with status code 429';
      let errorNetwork =
        JSON.parse(JSON.stringify(error)).message === 'Network Error';
      let error400 =
        JSON.parse(JSON.stringify(error)).message ===
        'Request failed with status code 400';
      console.log(
        'Cek Error========================',
        JSON.parse(JSON.stringify(error)).message,
      );
      if (error429) {
        this.showSnackbarBusy();
      } else if (errorNetwork) {
        this.showSnackbarInet();
      } else if (error400) {
        Storage.removeItem('token');
        this.props.navigation.navigate('Home');
      }
    }
  };

  cetakDataHightlight() {
    let cetak = this.props.banner.highlight.replace(regEx, '');
    let cetak2 = cetak.replace(regEx2, '');
    return cetak2;
  }

  postShoppingCart = async item => {
    console.log("Data "+JSON.stringify(item));
    const brand_id_1 = ['001'];
    const brand_id_2 = [
      '002',
      '003',
      '004',
      '007',
      '008',
      '009',
      '010',
      '011',
      '012',
      '013',
      '014',
    ];
    const brand_id_3 = ['005'];

    // console.log('price=====>',item)
    let price = item.price.harga_ritel_gt ?? '0';
    if (brand_id_1.includes(item.brand_id)) {
      if (item.status_promosi_coret == 1) {
        // console.log('if 1');
        switch (this.props.dataUser.salur_code) {
          case 'RT':
            price = item.price.harga_promosi_coret_ritel_gt;
            break;
          case 'WS':
            price = item.price.harga_promosi_coret_grosir_mt;
            break;
          case 'SO':
            price = item.price.harga_promosi_coret_grosir_mt;
            break;
          case 'SW':
            price = item.price.harga_promosi_coret_grosir_mt;
            break;
          default:
            break;
        }
      } else if (
        (item.status_promosi_coret !== '0' ||
          item.status_promosi_coret !== null) &&
        item.status_herbana !== '1'
      ) {
        // console.log('if 2');
        switch (this.props.dataUser.salur_code) {
          case 'RT':
            price = item.price.harga_ritel_gt;
            break;
          case 'WS':
            price = item.price.harga_ritel_gt;
            break;
          case 'SO':
            price = item.price.harga_ritel_gt;
            break;
          case 'SW':
            price = item.price.harga_ritel_gt;
            break;
          default:
            break;
        }
      } else if (item.status_herbana === '1') {
        // console.log('if 3');
        switch (this.props.dataUser.salur_code) {
          case 'RT':
            price = item.price.harga_ritel_gt;
            break;
          case 'WS':
            price = item.price.harga_grosir_mt;
            break;
          case 'SO':
            price = item.price.harga_grosir_mt;
            break;
          case 'SW':
            price = item.price.harga_grosir_mt;
            break;
          default:
            break;
        }
      } else {
        // console.log('if 4');
        switch (this.props.dataUser.salur_code) {
          case 'RT':
            price = item.price.harga_ritel_gt;
            break;
          case 'WS':
            price = item.price.harga_ritel_gt;
            break;
          case 'SO':
            price = item.price.harga_ritel_gt;
            break;
          case 'SW':
            price = item.price.harga_ritel_gt;
            break;
          default:
            break;
        }
      }
    } else if (brand_id_2.includes(item.brand_id)) {
      if (item.status_promosi_coret == 1) {
        // console.log('if 5');
        switch (this.props.dataUser.salur_code) {
          case 'RT':
            price = item.price.harga_promosi_coret_ritel_gt;
            break;
          case 'WS':
            price = item.price.harga_promosi_coret_grosir_mt;
            break;
          case 'SO':
            price = item.price.harga_promosi_coret_grosir_mt;
            break;
          case 'SW':
            price = item.price.harga_promosi_coret_grosir_mt;
            break;
          default:
            break;
        }
      } else if (
        item.status_promosi_coret !== '0' ||
        item.status_promosi_coret !== null
      ) {
        // console.log('if 6');
        switch (this.props.dataUser.salur_code) {
          case 'RT':
            price = item.price.harga_ritel_gt;
            break;
          case 'WS':
            price = item.price.harga_grosir_mt;
            break;
          case 'SO':
            price = item.price.harga_grosir_mt;
            break;
          case 'SW':
            price = item.price.harga_grosir_mt;
            break;
          default:
            break;
        }
      } else {
        // console.log('if 7');
        switch (this.props.dataUser.salur_code) {
          case 'RT':
            price = item.price.harga_ritel_gt;
            break;
          case 'WS':
            price = item.price.harga_grosir_mt;
            break;
          case 'SO':
            price = item.price.harga_grosir_mt;
            break;
          case 'SW':
            price = item.price.harga_grosir_mt;
            break;
          default:
            break;
        }
      }
    } else if (brand_id_3.includes(item.brand_id)) {
      if (item.status_promosi_coret == 1) {
        // console.log('if 8');
        switch (this.props.dataUser.salur_code) {
          case 'RT':
            price = item.price.harga_promosi_coret_ritel_gt;
            break;
          case 'WS':
            price = item.price.harga_promosi_coret_ritel_gt;
            break;
          case 'SO':
            price = item.price.harga_promosi_coret_ritel_gt;
            break;
          case 'SW':
            price = item.price.harga_promosi_coret_ritel_gt;
            break;
          default:
            break;
        }
      } else if (
        item.status_promosi_coret !== '0' ||
        item.status_promosi_coret !== null
      ) {
        // console.log('if 9');
        switch (this.props.dataUser.salur_code) {
          case 'RT':
            price = item.price.harga_ritel_gt;
            break;
          case 'WS':
            price = item.price.harga_ritel_gt;
            break;
          case 'SO':
            price = item.price.harga_ritel_gt;
            break;
          case 'SW':
            price = item.price.harga_ritel_gt;
            break;
          default:
            break;
        }
      } else {
        // console.log('if 10');
        switch (this.props.dataUser.salur_code) {
          case 'RT':
            price = item.price.harga_ritel_gt;
            break;
          case 'WS':
            price = item.price.harga_ritel_gt;
            break;
          case 'SO':
            price = item.price.harga_ritel_gt;
            break;
          case 'SW':
            price = item.price.harga_ritel_gt;
            break;
          default:
            break;
        }
      }
    }

    console.log('price_apps', price);

    try {
      let response = await axios.post(
        `${CONFIG.BASE_URL}/api/shopping-cart`,
        {
          product_id: item.id,
          brand_id: item.brand_id,
          satuan_online: item.satuan_online,
          konversi_sedang_ke_kecil: item.konversi_sedang_ke_kecil,
          qty_konversi:
            this.state.shoppingCartItems.qty * item.konversi_sedang_ke_kecil,
          qty: this.state.shoppingCartItems.qty,
          notes: this.state.shoppingCartItems.notes,
          price_apps: price ?? '0',
        },
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      let data = response.data;
      console.log('response', response);
      if (data !== '' && data['success'] == true) {
        this.showModal();
        // this.props.navigation.navigate('Keranjang');
      } else {
        console.log('Gagal memasukkan keranjang===>', data);
        this.setState({visibleModalBlack: true});
      }
    } catch (error) {
      let error429 =
        JSON.parse(JSON.stringify(error)).message ===
        'Request failed with status code 429';
      let errorNetwork =
        JSON.parse(JSON.stringify(error)).message === 'Network Error';
      let error400 =
        JSON.parse(JSON.stringify(error)).message ===
        'Request failed with status code 400';
      console.log(
        'Cek Error==========POST CART==============',
        JSON.parse(JSON.stringify(error)).message,
      );
      if (error429) {
        this.showSnackbarBusy();
      } else if (errorNetwork) {
        this.showSnackbarInet();
      } else if (error400) {
        Storage.removeItem('token');
        // this.props.navigation.navigate('Home');
      }
    }
  };
  closeModalBlacklist() {
    this.setState({visibleModalBlack: false});
  }
  postRecent = async item => {
    // console.log("cek id"+JSON.stringify(item));
    try {
      let response = await axios.post(
        `${CONFIG.BASE_URL}/api/recent/products`,
        {
          product_id: item.id,
        },
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      if (response.data['success' === true]) {
        console.log('postRecent', response.data);
      }
    } catch (error) {
      let error429 =
        JSON.parse(JSON.stringify(error)).message ===
        'Request failed with status code 429';
      let errorNetwork =
        JSON.parse(JSON.stringify(error)).message === 'Network Error';
      let error400 =
        JSON.parse(JSON.stringify(error)).message ===
        'Request failed with status code 400';
      console.log(
        'Cek Error==========POST RECENT============== 438',
        JSON.parse(JSON.stringify(error)).message,
      );
      if (error429) {
        this.showSnackbarBusy();
      } else if (errorNetwork) {
        this.showSnackbarInet();
      } else if (error400) {
        Storage.removeItem('token');
        // this.props.navigation.navigate('Home');
      }
    }
  };

  showModal = () => {
    this._isMounted &&
      this.setState({
        modalVisible: true,
      });
    // const setWaktu = setTimeout(() => {
    //   this._isMounted &&
    //     this.setState({
    //       modalVisible: false,
    //     });
    // }, 5000);
    // return () => {
    //   clearTimeout(setWaktu);
    // };
  };

  showSnackbarBusy = () => {
    Snackbar.show({
      text: 'Server Sibuk, Silahkan ulangi lagi',
      //You can also give duration- Snackbar.LENGTH_SHORT, Snackbar.LENGTH_LONG
      duration: Snackbar.LENGTH_INDEFINITE,
      //color of snakbar
      backgroundColor: '#17a2b8',
      //color of text
      textColor: 'white',
      //action
      action: {
        text: 'coba lagi',
        textColor: 'white',
        onPress: () => {
          this.forceUpdate();
        },
      },
    });
  };

  showSnackbarInet = () => {
    Snackbar.show({
      text: 'Internet Bermasalah, Silahkan ulangi lagi',
      //You can also give duration- Snackbar.LENGTH_SHORT, Snackbar.LENGTH_LONG
      duration: Snackbar.LENGTH_INDEFINITE,
      //color of snakbar
      backgroundColor: '#17a2b8',
      //color of text
      textColor: 'white',
      //action
      action: {
        text: 'coba lagi',
        textColor: 'white',
        onPress: () => {
          this.forceUpdate();
        },
      },
    });
  };

  //load more data
  getMoreData = () => {
    if (
      !this.onEndReachedCalledDuringMomentum &&
      this.state.page < this.state.maxPage
    ) {
      this.setState(
        {
          page: this.state.page + 1,
          loadingMore: this.state.page < this.state.maxPage,
        },
        async () => {
          await this.getPromo();
        },
      );
      this.onEndReachedCalledDuringMomentum =
        this.state.page >= this.state.maxPage;
    }
  };

  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        refreshing: true,
      },
      () => {
        this.getPromo();
      },
    );
  };

  renderLoadMore = () => {
    if (!this.state.loadingMore) return null;
    return (
      <View>
        <ActivityIndicator animating size="small" color="#777" />
      </View>
    );
  };

  clickCard(item) {
    this.postRecent(item),
      this.props.navigation.navigate(
        'ProdukDeskripsi',
        {initial: false},
        this.props.subsAct(item, 'item'),
      );
  }

  onClickAll(id) {
    this.props.navigation.navigate('ProdukKategori', {
      screen: 'KalenderPromo',
      idPromo: id,
    });
  }

  render() {
    const {promo, rating, product_promo, loadingApi} = this.state;
    return (
      <View
        style={{
          flex: 1,
          width: wp('100%'),
          justifyContent: 'center',
          backgroundColor: '#fff',
        }}>
        <Header
          title="Kalender Promo"
          navigation={this.props.navigation}
          notif={false}
          notifCount={0}
          cart={false}
          cartCount={0}
        />
        <ModalBlackList
          modalVisible={this.state.visibleModalBlack}
          getCloseAlertModal={() => this.closeModalBlacklist()}
        />
        {loadingApi ? (
          <LoadingApi />
        ) : (
          <FlatList
            contentContainerStyle={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              paddingLeft: wp('5%'),
              paddingRight: wp('5%'),
            }}
            keyExtractor={(item, index) => `${index}`}
            data={promo}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.handleRefresh}
                colors={['#529F45', '#FFFFFF']}
              />
            }
            onEndReached={() => this.getMoreData()}
            onEndReachedThreshold={0.5}
            initialNumToRender={10}
            showsVerticalScrollIndicator={false}
            onMomentumScrollBegin={() => {
              this.onEndReachedCalledDuringMomentum = false;
            }}
            ListFooterComponent={() => this.renderLoadMore()}
            ListEmptyComponent={() => {
              return (
                <View style={{flex: 1, alignItems: 'center'}}>
                  <Icon404
                    width={wp('80%')}
                    height={hp('80%')}
                    // source={require('../assets/images/no_data.jpg')}
                  />
                  {/* <Text
                          style={[
                            {
                              fontSize: hp('2.6%'),
                              fontFamily: 'Robotic-Medium',
                              marginTop: hp('-20%'),
                            },
                          ]}>
                          {'Tidak ada data.'}
                        </Text> */}
                </View>
              );
            }}
            renderItem={({item, index}) => {
              return (
                <View key={index}>
                  {item.banner ? (
                    <Image
                      source={{uri: CONFIG.BASE_URL + item.banner}}
                      style={styles.banner}
                    />
                  ) : (
                    <DummyImage style={styles.banner} />
                  )}
                  {/* {product gallery} */}
                  {item.sku.length > 0 ? (
                    <View style={[styles.containerProduk]}>
                      <View style={styles.columnTitle}>
                        <View style={{width: '80%'}}>
                          <Text style={styles.title}>{item.title}</Text>
                        </View>
                        <TouchableOpacity
                          onPress={() =>
                            this.props.navigation.navigate('ProdukKategori', {
                              screen: 'KalenderPromo',
                              idPromo: item.id,
                            })
                          }
                          style={styles.buttonNext2}>
                          <View
                            style={{
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexDirection: 'row',
                            }}>
                            <Text style={styles.textButtonNext2}>
                              {'Lihat Semua'}
                            </Text>
                            <IconNext2
                              fill="#529F45"
                              width={wp('3%')}
                              height={wp('3%')}
                            />
                          </View>
                        </TouchableOpacity>
                      </View>
                      {item.sku != undefined ? (
                        <CardProduk
                          onClick={item => this.clickCard(item)}
                          data={item.sku}
                          postShoppingCart={item => this.postShoppingCart(item)}
                          qtyTotal={item.sku.length}
                          onClickAll={() => {
                            this.onClickAll(item.id);
                          }}
                        />
                      ) : null}

                      {/* <ScrollView
                        contentContainerStyle={{
                          paddingLeft: wp('5%'),
                          paddingRight: wp('5%'),
                        }}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.scroll}>
                        {item.sku.map((val, i) => (
                          <TouchableOpacity
                            key={i}
                            onPress={() => {
                              this.postRecent(val),
                                this.props.navigation.navigate(
                                  'ProdukDeskripsi',
                                  {initial: false},
                                  this.props.subsAct(val, 'item'),
                                );
                            }}
                            style={styles.buttonViewProdukTerbaru}>
                            {val.product?.image ? (
                              <Image
                                resizeMode="contain"
                                source={{
                                  uri: CONFIG.BASE_URL + val.product?.image,
                                }}
                                style={styles.list}
                              />
                            ) : (
                              <DummyImage style={styles.list} />
                            )}
                            <View
                              style={{
                                flexDirection: 'column',
                                justifyContent: 'center',
                                marginHorizontal: wp('3%'),
                              }}>
                              <View style={{height: wp('9%')}}>
                                <Text
                                  numberOfLines={2}
                                  style={styles.listTitle}>
                                  {val.product?.name}
                                </Text>
                              </View>
                              <NumberFormat
                                value={Math.round(
                                  val?.product?.price?.harga_ritel_gt,
                                )}
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={'Rp '}
                                renderText={value => (
                                  <Text style={styles.listPrice}>
                                    {value || 0}
                                  </Text>
                                )}
                              />
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                }}>
                                <View style={styles.borderLogo}>
                                  <Rating
                                    imageSize={wp('3%')}
                                    readonly
                                    startingValue={rating}
                                    ratingCount={1}
                                  />
                                  <Text
                                    style={{
                                      fontSize: hp('1.6%'),
                                      color: '#000000',
                                      fontFamily: 'Lato-Medium',
                                      marginLeft: wp('1%'),
                                    }}>
                                    {' '}
                                    {val.product.review
                                      ? val.product.review[0]
                                        ? val.product.review[0].avg_rating
                                        : '0'
                                      : '0'}
                                  </Text>
                                </View>
                                {val.product.cart && (
                                  <View style={styles.borderLogo}>
                                    <IconCart
                                      width={wp('4%')}
                                      height={wp('4%')}
                                    />
                                    <Text
                                      style={{
                                        fontSize: hp('1.6%'),
                                        color: '#529F45',
                                        fontFamily: 'Lato-Medium',
                                        marginLeft: wp('1%'),
                                      }}>
                                      {val.product.cart.qty}
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
                            <View
                              style={{
                                flexDirection: 'row',
                                position: 'absolute',
                                left: 7,
                                top: 7,
                              }}>
                              <View
                                style={{
                                  backgroundColor: '#b4e5ed',
                                  padding: 4,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  paddingLeft: 10,
                                  paddingRight: 10,
                                }}>
                                <Text
                                  style={{
                                    fontSize: hp('1.5%'),
                                    fontFamily: 'Lato-Medium',
                                    color: '#17a2b8',
                                  }}>
                                  {'Promo'}
                                </Text>
                              </View>
                            </View>
                            {val.product.cart ? (
                              <Pressable
                                style={styles.buttonKeranjang}
                                onPress={async () => {
                                  this.postShoppingCart(val);
                                }}>
                                <Text style={styles.textKeranjang}>
                                  {'Tambah'}
                                </Text>
                              </Pressable>
                            ) : (
                              <Pressable
                                style={styles.buttonKeranjang}
                                onPress={async () => {
                                  this.postShoppingCart(val.product);
                                }}>
                                <Text style={styles.textKeranjang}>
                                  {'Beli'}
                                </Text>
                              </Pressable>
                            )}
                          </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                          onPress={() =>
                            this.props.navigation.navigate('ProdukKategori', {
                              screen: 'KalenderPromo',
                              idPromo: item.id,
                            })
                          }
                          style={styles.buttonNext}>
                          <IconNext
                            fill="#529F45"
                            width={wp('8%')}
                            height={hp('5%')}
                          />
                          <Text style={styles.textButtonNext}>
                            {'Lihat Semua'}
                          </Text>
                        </TouchableOpacity>
                      </ScrollView> */}
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.containerProduk,
                        {height: hp('10%'), marginHorizontal: wp('-6%')},
                      ]}>
                      <View style={{width: '80%'}}>
                        {item.title == 'Pembelian Pertama' ? (
                          <Text style={styles.title}>
                            {
                              'Promo Pembelian Pertama Berlaku untuk Pengguna Baru Semut Gajah Apps'
                            }
                          </Text>
                        ) : (
                          <Text style={styles.title}>
                            {'Promo Berlaku Semua Produk'}
                          </Text>
                        )}
                      </View>
                    </View>
                  )}
                </View>
              );
            }}
          />
        )}
        {/* <View
          style={{
            alignSelf: 'center',
            marginBottom: wp('5%'),
            marginTop: wp('5%'),
          }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.navigate('Produk')}>
            <Text style={styles.textButton}>{'Belanja Sekarang'}</Text>
          </TouchableOpacity>
        </View> */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState(
              {modalVisible: !this.state.modalVisible, page: 1},
              () => this.getPromo(),
            );
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                {'Pesanan sudah ditambahkan kedalam keranjang'}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Pressable
                  style={[
                    styles.buttonToKeranjang,
                    {
                      width: wp('30%'),
                      backgroundColor: '#fff',
                      borderColor: '#6c757d',
                    },
                  ]}
                  onPress={() =>
                    this.setState(
                      {modalVisible: !this.state.modalVisible, page: 1},
                      () => this.getPromo(),
                    )
                  }>
                  <Text style={[styles.textStyle, {color: '#000'}]}>
                    {'Kembali'}
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.buttonToKeranjang,
                    {
                      marginLeft: wp('1%'),
                    },
                  ]}
                  onPress={() =>
                    this.setState(
                      {modalVisible: !this.state.modalVisible, page: 1},
                      () => {
                        this.props.navigation.navigate('Keranjang');
                      },
                    )
                  }>
                  <Text style={styles.textStyle}>{'Lihat Keranjang'}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: hp('8%'),
    backgroundColor: 'white',
    paddingHorizontal: wp('5%'),
    borderBottomWidth: 4,
    borderColor: '#ddd',
  },
  text: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('2.4%'),
    paddingLeft: wp('5%'),
  },
  position: {
    // marginTop: wp('5%'),
    // marginLeft: wp('5%'),
  },
  positionDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: wp('5%'),
  },
  positionSKU: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  text2: {
    fontSize: hp('1.8%'),
    fontFamily: 'Lato-Medium',
    marginBottom: hp('0.5%'),
  },
  result: {
    width: wp('30%'),
    textAlign: 'left',
    // height: hp('5.5%'),
    fontSize: hp('1.8%'),
    fontFamily: 'Lato-Medium',
  },
  textTermand: {
    // marginTop: wp('2%'),
    fontSize: hp('1.8%'),
    fontFamily: 'Lato-Medium',
    color: '#777',
    textAlign: 'justify',
  },
  button: {
    backgroundColor: '#529F45',
    borderRadius: 10,
    width: wp('90%'),
    height: hp('6%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButton: {
    fontSize: hp('1.8%'),
    color: '#fff',
    fontFamily: 'Lato-Medium',
    alignSelf: 'center',
  },
  banner: {
    resizeMode: 'contain',
    width: wp('88%'),
    height,
    borderRadius: hp('1%'),
    alignSelf: 'center',
  },
  cardBackground: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E8E8E8',
    // marginLeft: wp('6%'),
    // marginRight: wp('0%'),
    width: wp('90%'),
    borderRadius: 10,
  },

  cardTab: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E8E8E8',
    width: wp('44%'),
    borderRadius: 10,
  },
  positionTab: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  columnTab: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  textTab: {
    fontSize: hp('1.8%'),
    fontFamily: 'Lato-Medium',
    marginBottom: hp('0.5%'),
  },
  resultTab: {
    // width: wp('30%'),
    textAlign: 'left',
    // height: hp('5.5%'),
    fontSize: hp('1.8%'),
    fontFamily: 'Lato-Medium',
  },

  // Produk
  containerProduk: {
    height: hp('45%'),
    backgroundColor: '#f4f4f4',
    marginHorizontal: wp('-5%'),
    marginBottom: wp('1%'),
    elevation: 5,
  },
  scroll: {
    // backgroundColor: 'blue',
    width,
    height,
  },
  list: {
    width: wp('27%'),
    height: wp('27%'),
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
    borderRadius: wp('2%'),
  },
  listTitle: {
    fontSize: hp('1.6%'),
    fontFamily: 'Lato-Regular',
    color: '#000000',
    marginTop: wp('1%'),
  },
  listPrice: {
    fontSize: hp('2%'),
    fontFamily: 'Lato-Regular',
    color: '#529F45',
    marginBottom: wp('1%'),
    // marginTop: wp('1%'),
  },
  title: {
    fontSize: hp('1.7%'),
    fontFamily: 'Lato-Bold',
    color: '#1F1F1F',
    paddingLeft: wp('5%'),
    marginTop: hp('2%'),
  },
  buttonNext: {
    margin: 20,
    height: hp('32%'),
    marginRight: wp('5%'),
    marginLeft: wp('0.5%'),
    width: wp('30%'),
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp('2%'),
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000000',
    backgroundColor: '#FFFFFF',
    elevation: 5,
  },
  buttonNext2: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingRight: wp('2%'),
    marginTop: hp('2%'),
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
  buttonViewProdukTerbaru: {
    margin: 20,
    width: wp('30%'),
    marginRight: wp('1%'),
    marginLeft: wp('0.5%'),
    borderWidth: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderRadius: hp('2%'),
    borderColor: '#ddd',
    shadowColor: '#000000',
    backgroundColor: 'white',
    elevation: 5,
  },
  buttonKeranjang: {
    backgroundColor: '#FFFFFF',
    borderColor: '#529F45',
    borderWidth: 1,
    borderRadius: wp('2%'),
    width: wp('24%'),
    height: hp('3.5%'),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  textKeranjang: {
    textAlign: 'center',
    color: '#529F45',
    fontSize: hp('1.8%'),
    fontFamily: 'Lato-Medium',
  },
  columnTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // RATING
  borderLogo: {
    borderColor: '#777',
    borderRadius: hp('1.5%'),
    alignItems: 'center',
    flexDirection: 'row',
  },

  // View Modal
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.9)',
  },
  centeredViewTutorial: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.1)',
    // backgroundColor: 'red'
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  buttonToKeranjang: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('4%'),
    backgroundColor: '#529F45',
    borderColor: '#529F45',
    borderWidth: 1,
    width: wp('40%'),
    justifyContent: 'center',
    borderRadius: hp('1.5%'),
    // paddingLeft: wp('5%'),
  },
  buttonClose: {
    position: 'absolute',
    right: wp('-40%'),
    top: hp('-5%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // height: hp('8%'),
    backgroundColor: '#529F45',
    // width: wp('50%'),
    justifyContent: 'flex-start',
    borderRadius: hp('0.5%'),
    paddingHorizontal: wp('5%'),
  },
  textStyle: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Lato-Regular',
    fontSize: hp('1.8%'),
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'Lato-Regular',
    fontSize: hp('1.8%'),
    color: '#000000',
  },

  loadingApi: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    width: wp('100%'),
    // marginTop: hp('10%'),
    // height: hp('100%'),
    // position: 'absolute',
    // top:hp('-50%')
  },
});

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
  dataUser: state.LoginReducer.dataUser,
  banner: state.BannerReducer.banner,
});

const mapDispatchToProps = dispatch => {
  return {
    voucherAct: (value, tipe) => {
      dispatch(VoucherAction(value, tipe));
    },
    subsAct: (value, tipe) => {
      dispatch(SubsAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(KalenderPromo);
