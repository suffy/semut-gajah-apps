import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  Dimensions,
  Button,
  FlatList,
  RefreshControl,
} from 'react-native';
import {connect} from 'react-redux';
import Size from '../components/Fontresponsive';
import axios from 'axios';
import NumberFormat from 'react-number-format';
import CONFIG from '../constants/config';
import {Card} from 'react-native-elements';
import IconTrash from '../assets/icons/Trash.svg';
import IconSearch from '../assets/icons/Search.svg';
import IconClose from '../assets/icons/Closemodal.svg';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon404 from '../assets/icons/404.svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Storage from '@react-native-async-storage/async-storage';
import IconBack from '../assets/icons/backArrow.svg';
import {ActivityIndicator} from 'react-native-paper';
import DummyImage from '../assets/icons/IconLogo.svg';
import Snackbar from 'react-native-snackbar';
import ModalDelete from '../components/ModalDelete';
import ModalBlackList from '../components/ModalBlackList';

function LoadingApi() {
  return (
    <View style={styles.loadingApi}>
      <ActivityIndicator animating size="small" color="#529F45" />
    </View>
  );
}

const width = Dimensions.get('window').width;

const wishlistsItems = [
  {
    id: '',
    product_id: '',
    price_apps: '',
    product: {
      name: '',
      image: '',
    },
  },
];

export class Wishlist extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.onEndReachedCalledDuringMomentum = true;
    this.state = {
      wishlistsItems: wishlistsItems,
      shoppingCartItems: {
        product_id: '',
        brand_id: '',
        large_unit: '',
        medium_unit: '',
        small_unit: '',
        qty: '1',
        notes: '',
        price_apps: '',
      },
      search: '',
      listSearch: wishlistsItems,
      page: 1,
      loadingMore: false,
      refreshing: false,
      maxPage: 1,
      loadingApi: true,
      alertDelete: '',
      tambahanDelete: '',
      buttonDeleteCancel: '',
      buttonDelete: '',
      modalDelete: false,
      dataDelete: [],
      visibleModalBlack: false,
    };
  }

  UNSAFE_componentWillMount() {
    // lor(this);
  }

  componentWillUnmount() {
    // rol();
  }

  // get wishlist
  componentDidMount() {
    this.getWishlist();
    this.getDataSearching();
  }

  getWishlist = async () => {
    const {page} = this.state;
    try {
      let response = await axios.get(
        `${CONFIG.BASE_URL}/api/wishlists?page=${page}`,
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      const data = response.data.data;
      console.log('produk', JSON.stringify(data.data));
      this.setState(prevState => ({
        loadingApi: false,
        wishlistsItems:
          page === 1 ? data.data : [...this.state.wishlistsItems, ...data.data],
        refreshing: false,
        loadingMore: data.last_page > this.state.page,
        maxPage: data.last_page,
      }));
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
        // this.props.navigation.navigate('Home');
      }
    }
  };

  getMoreWishlist = () => {
    if (
      !this.onEndReachedCalledDuringMomentum &&
      this.state.page < this.state.maxPage
    ) {
      this.setState(
        {
          page: this.state.page + 1,
          loadingMore: this.state.page < this.state.maxPage,
        },
        () => {
          this.getWishlist();
          this.getDataSearching(this.state.search);
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
        this.getWishlist();
        this.getDataSearching();
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

  postShoppingCart = async index => {
    try {
      let response;
      console.log(
        'cek whistlist===============',
        JSON.stringify({
          product_id: this.state.wishlistsItems[index].product_id,
          brand_id: this.state.wishlistsItems[index].product.brand_id,
          qty: this.state.shoppingCartItems.qty,
          notes: this.state.shoppingCartItems.notes,
          price_apps: this.state.wishlistsItems[index].price_apps ?? '0',
          satuan_online: this.state.wishlistsItems[index].product.satuan_online,
          konversi_sedang_ke_kecil:
            this.state.wishlistsItems[index].product.konversi_sedang_ke_kecil,
          qty_konversi:
            this.state.shoppingCartItems.qty *
            this.state.wishlistsItems[index].product.konversi_sedang_ke_kecil,
          half: this.state.wishlistsItems[index].half,
        }),
      );
      if (this.state.wishlistsItems[index].half) {
        console.log('masuk half');
        response = await axios.post(
          `${CONFIG.BASE_URL}/api/shopping-cart`,
          {
            product_id: this.state.wishlistsItems[index].product_id,
            brand_id: this.state.wishlistsItems[index].product.brand_id,
            qty: this.state.shoppingCartItems.qty,
            notes: this.state.shoppingCartItems.notes,
            price_apps: this.state.wishlistsItems[index].price_apps ?? '0',
            satuan_online:
              this.state.wishlistsItems[index].product.satuan_online,
            konversi_sedang_ke_kecil:
              this.state.wishlistsItems[index].product.konversi_sedang_ke_kecil,
            qty_konversi:
              this.state.shoppingCartItems.qty *
              this.state.wishlistsItems[index].product.konversi_sedang_ke_kecil,
            half: this.state.wishlistsItems[index].half,
          },
          {
            headers: {Authorization: `Bearer ${this.props.token}`},
          },
        );
      } else {
        response = await axios.post(
          `${CONFIG.BASE_URL}/api/shopping-cart`,
          {
            product_id: this.state.wishlistsItems[index].product_id,
            brand_id: this.state.wishlistsItems[index].product.brand_id,
            qty: this.state.shoppingCartItems.qty,
            notes: this.state.shoppingCartItems.notes,
            price_apps: this.state.wishlistsItems[index].price_apps ?? '0',
            satuan_online:
              this.state.wishlistsItems[index].product.satuan_online,
            konversi_sedang_ke_kecil:
              this.state.wishlistsItems[index].product.konversi_sedang_ke_kecil,
            qty_konversi:
              this.state.shoppingCartItems.qty *
              this.state.wishlistsItems[index].product.konversi_sedang_ke_kecil,
          },
          {
            headers: {Authorization: `Bearer ${this.props.token}`},
          },
        );
      }
      let data = response.data;
      console.log('data', data);
      if (data !== '' && data['success'] == true) {
        this.props.navigation.navigate('Keranjang');
      } else {
        console.log('Gagal memasukkan keranjang===>', data);
        if (data['message'] === 'Anda Masuk Dalam Daftar Blacklist') {
          this.setState({visibleModalBlack: true});
        }
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
  closeModalBlacklist() {
    this.setState({visibleModalBlack: false});
  }
  // searching
  getDataSearching = async (value = this.state.search, isNew = false) => {
    const {page} = this.state;
    if (isNew) {
      this.setState({page: 1});
    }
    try {
      let response = await axios.get(
        `${CONFIG.BASE_URL}/api/wishlists?search=${value}&page=${
          isNew ? 1 : page
        }`,
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      const data = response.data.data;
      this.setState(prevState => ({
        listSearch:
          page === 1 ? data.data : [...this.state.listSearch, ...data.data],
        refreshing: false,
        loadingMore: false,
        maxPage: data.last_page,
      }));
    } catch (error) {
      this.setState({loadingMore: false});
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

  handlerSearch = value => {
    this.setState({search: value});
    this.getDataSearching(value, true);
  };

  renderSearch() {
    return (
      <View style={{flex: 1}}>
        <FlatList
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
          }}
          keyExtractor={(item, index) => `${index}`}
          data={this.state.listSearch}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}
              colors={['#529F45', '#FFFFFF']}
            />
          }
          onEndReached={() => this.getMoreWishlist()}
          onMomentumScrollBegin={() => {
            this.onEndReachedCalledDuringMomentum = false;
          }}
          onEndReachedThreshold={0.5}
          initialNumToRender={10}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => this.renderLoadMore()}
          renderItem={({item, index}) => {
            return (
              <Card
                containerStyle={{
                  borderRadius: wp('3%'),
                  marginBottom: wp('1%'),
                }}>
                <View
                  style={[
                    styles.position2,
                    {justifyContent: 'center', alignSelf: 'center'},
                  ]}>
                  <View>
                    {item.product.image ? (
                      <Image
                        source={{
                          uri: CONFIG.BASE_URL + item.product.image,
                        }}
                        style={styles.imageStyle}
                      />
                    ) : (
                      <DummyImage style={styles.imageStyle} />
                    )}
                  </View>
                  <View style={[styles.textposition, {marginTop: wp('-2.5%')}]}>
                    <Text numberOfLines={3} multiline style={styles.title}>
                      {item.product.name}
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                      {item.half ? (
                        <NumberFormat
                          value={Math.round(item.price_apps / 2) ?? '0'}
                          displayType={'text'}
                          thousandSeparator={true}
                          prefix={'Rp '}
                          renderText={value => (
                            <Text
                              numberOfLines={1}
                              style={{
                                fontSize: hp('1.7%'),
                                fontFamily: 'Lato-Medium',
                                marginTop: wp('1%'),
                              }}>
                              {value}
                            </Text>
                          )}
                        />
                      ) : (
                        <NumberFormat
                          value={Math.round(item.price_apps) ?? '0'}
                          displayType={'text'}
                          thousandSeparator={true}
                          prefix={'Rp '}
                          renderText={value => (
                            <Text
                              numberOfLines={1}
                              style={{
                                fontSize: hp('1.7%'),
                                fontFamily: 'Lato-Medium',
                                marginTop: wp('1%'),
                              }}>
                              {value}
                            </Text>
                          )}
                        />
                      )}
                      {item.half ? (
                        <Text
                          numberOfLines={1}
                          style={[
                            styles.title,
                            {
                              fontSize: hp('1.7%'),
                              fontFamily: 'Lato-Medium',
                              marginTop: wp('1%'),
                              color: '#17a2b8',
                            },
                          ]}>
                          {' ( '}
                          {item.product.konversi_sedang_ke_kecil / 2 +
                            ' ' +
                            item.product.kecil.charAt(0) +
                            item.product.kecil.slice(1).toLowerCase()}
                          {' )'}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </View>
                <View style={[styles.position2, {marginTop: wp('5%')}]}>
                  <TouchableOpacity
                    style={[styles.buttonTrash, {marginRight: wp('2%')}]}
                    onPress={() =>
                      this.setState({
                        loading: true,
                        alertDelete: 'Apakah yakin ingin menghapus item ini?',
                        buttonDelete: 'Hapus',
                        modalDelete: !this.state.modalDelete,
                        dataDelete: item,
                      })
                    }>
                    <IconTrash width={wp('6%')} height={hp('4%')} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttonKeranjang}
                    onPress={() => this.postShoppingCart(index)}>
                    <Text style={styles.textButton}>Tambah ke Keranjang</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            );
          }}
        />
      </View>
    );
  }

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

  getCloseModalDelete = async e => {
    const {dataDelete} = this.state;
    this.setState({modalDelete: !this.state.modalDelete, buttonDelete: ''});
    if (
      !e &&
      dataDelete &&
      this.state.alertDelete == 'Apakah yakin ingin menghapus item ini?'
    ) {
      try {
        let response = await axios.delete(
          `${CONFIG.BASE_URL}/api/wishlist/${dataDelete.id}`,
          {
            headers: {Authorization: `Bearer ${this.props.token}`},
          },
        );
        console.log(response.data);
        let data = response.data.success;
        if (data == true) {
          this.setState({loading: false, page: 1});
          this.getWishlist();
        } else {
          console.log('Gagal menghapus data===>', data);
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
    }
  };

  render() {
    const {search, loadingApi} = this.state;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <ModalDelete
          modalDelete={this.state.modalDelete}
          tambahanDelete={this.state.tambahanDelete}
          alertDelete={this.state.alertDelete}
          buttonDelete={this.state.buttonDelete}
          getCloseModalDelete={e => this.getCloseModalDelete(e)}
        />
        <ModalBlackList
          modalVisible={this.state.visibleModalBlack}
          getCloseAlertModal={() => this.closeModalBlacklist()}
        />
        <SafeAreaView style={[styles.container]}>
          <IconBack
            width={wp('4%')}
            height={hp('4%')}
            stroke="black"
            strokeWidth="2.5"
            fill="black"
            onPress={() => this.props.navigation.goBack()}
          />
          <Text style={styles.text}>{'Daftar Keinginan'}</Text>
        </SafeAreaView>
        {this.state.wishlistsItems.length > 0 && (
          <SafeAreaView style={{flex: 1}}>
            {/* searching */}
            <View style={styles.searchSection}>
              <TextInput
                autoCapitalize="none"
                onChangeText={value => this.handlerSearch(value)}
                style={styles.inputStyle}
                placeholder="Ketik kata kunci yang ingin anda cari"
                value={search}
                selectTextOnFocus={true}
              />
              {search === '' ? (
                <IconSearch
                  width={wp('3.5%')}
                  height={hp('6%')}
                  style={styles.search}
                />
              ) : (
                <IconClose
                  fill="black"
                  width={wp('3%')}
                  height={hp('2%')}
                  style={[styles.search, {marginTop: hp('2%')}]}
                  onPress={() => {
                    this.setState({
                      search: '',
                    });
                  }}
                />
              )}
            </View>
            {this.state.search.length > 0 && this.renderSearch()}
            {this.state.search.length == 0 && (
              <>
                {loadingApi ? (
                  <LoadingApi />
                ) : (
                  <FlatList
                    contentContainerStyle={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'white',
                    }}
                    keyExtractor={(item, index) => `${index}`}
                    data={this.state.wishlistsItems}
                    refreshControl={
                      <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.handleRefresh}
                        colors={['#529F45', '#FFFFFF']}
                      />
                    }
                    onEndReached={() => this.getMoreWishlist()}
                    onEndReachedThreshold={0.5}
                    initialNumToRender={10}
                    showsVerticalScrollIndicator={false}
                    onMomentumScrollBegin={() => {
                      this.onEndReachedCalledDuringMomentum = false;
                    }}
                    ListFooterComponent={() => this.renderLoadMore()}
                    renderItem={({item, index}) => {
                      return (
                        <Card
                          containerStyle={{
                            borderRadius: wp('3%'),
                            marginBottom: wp('1%'),
                          }}>
                          <View
                            style={[
                              styles.position2,
                              {justifyContent: 'center', alignSelf: 'center'},
                            ]}>
                            <View>
                              {item.product.image ? (
                                <Image
                                  source={{
                                    uri: CONFIG.BASE_URL + item.product.image,
                                  }}
                                  style={styles.imageStyle}
                                />
                              ) : (
                                <DummyImage style={styles.imageStyle} />
                              )}
                            </View>
                            <View
                              style={[
                                styles.textposition,
                                {marginTop: wp('-2.5%')},
                              ]}>
                              <Text
                                numberOfLines={3}
                                multiline
                                style={styles.title}>
                                {item.product.name}
                              </Text>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'flex-start',
                                  width: wp('60%'),
                                }}>
                                {item.half ? (
                                  <NumberFormat
                                    value={
                                      Math.round(item.price_apps / 2) ?? '0'
                                    }
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    prefix={'Rp '}
                                    renderText={value => (
                                      <Text
                                        numberOfLines={1}
                                        style={{
                                          fontSize: hp('1.7%'),
                                          fontFamily: 'Lato-Medium',
                                          marginTop: wp('1%'),
                                        }}>
                                        {value}
                                      </Text>
                                    )}
                                  />
                                ) : (
                                  <NumberFormat
                                    value={Math.round(item.price_apps) ?? '0'}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    prefix={'Rp '}
                                    renderText={value => (
                                      <Text
                                        numberOfLines={1}
                                        style={{
                                          fontSize: hp('1.7%'),
                                          fontFamily: 'Lato-Medium',
                                          marginTop: wp('1%'),
                                        }}>
                                        {value}
                                      </Text>
                                    )}
                                  />
                                )}
                                {item.half ? (
                                  <Text
                                    numberOfLines={1}
                                    style={{
                                      fontSize: hp('1.7%'),
                                      fontFamily: 'Lato-Medium',
                                      marginTop: wp('1%'),
                                      color: '#17a2b8',
                                    }}>
                                    {'  ( '}
                                    {item.product.konversi_sedang_ke_kecil / 2 +
                                      ' ' +
                                      item.product.kecil.charAt(0) +
                                      item.product.kecil.slice(1).toLowerCase()}
                                    {' )'}
                                  </Text>
                                ) : null}
                              </View>
                            </View>
                          </View>
                          <View
                            style={[styles.position2, {marginTop: wp('5%')}]}>
                            <TouchableOpacity
                              style={[
                                styles.buttonTrash,
                                {marginRight: wp('2%')},
                              ]}
                              onPress={() =>
                                this.setState({
                                  loading: true,
                                  alertDelete:
                                    'Apakah yakin ingin menghapus item ini?',
                                  buttonDelete: 'Hapus',
                                  modalDelete: !this.state.modalDelete,
                                  dataDelete: item,
                                })
                              }>
                              <IconTrash width={wp('6%')} height={hp('4%')} />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.buttonKeranjang}
                              onPress={() => this.postShoppingCart(index)}>
                              <Text style={styles.textButton}>
                                Tambah ke Keranjang
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </Card>
                      );
                    }}
                  />
                )}
              </>
            )}
          </SafeAreaView>
        )}
        {this.state.wishlistsItems.length == 0 && (
          <ScrollView>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                marginTop: hp('0%'),
              }}>
              <Icon404 width={wp('80%')} height={hp('60%')} />
              <Text
                style={{
                  fontSize: hp('2%'),
                  fontFamily: 'Lato-Medium',
                  textAlign: 'center',
                  marginTop: hp('-12%'),
                }}>
                Simpan dan favoritkan barang yang kamu inginkan
              </Text>
              <TouchableOpacity
                style={[
                  styles.belanjaButton,
                  {
                    marginTop: wp('2.5%'),
                    width: wp('45%'),
                    marginRight: wp('1%'),
                  },
                ]}
                onPress={() => this.props.navigation.navigate('Produk')}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: hp('1.8%'),
                    fontFamily: 'Lato-Medium',
                  }}>
                  {'Mulai Belanja'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
  dataUser: state.LoginReducer.dataUser,
});

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Wishlist);

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
    marginBottom: wp('4%'),
  },
  text: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('2.4%'),
    paddingLeft: wp('5%'),
  },
  searchSection: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  inputStyle: {
    // flex: 1,
    borderWidth: 2,
    fontFamily: 'Lato-Medium',
    fontSize: hp('1.8%'),
    color: '#000000',
    width: wp('95%'),
    height: hp('6%'),
    marginLeft: wp('1%'),
    paddingLeft: wp('5%'),
    paddingRight: wp('15%'),
    borderRadius: hp('1.5%'),
    borderColor: '#DCDCDC',
  },
  search: {
    position: 'absolute',
    top: hp('0%'),
    right: wp('5%'),
  },
  container2: {
    flexDirection: 'row',
    marginLeft: wp('4%'),
    height: hp('5%'),
    backgroundColor: 'white',
    alignItems: 'center',
    marginBottom: wp('4%'),
  },
  title: {
    fontSize: hp('2%'),
    fontFamily: 'Lato-Medium',
    textAlign: 'auto',
    width: wp('60%'),
    marginTop: wp('2%'),
  },
  position2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: wp('0%'),
  },
  imageStyle: {
    height: hp('12%'),
    width: wp('20%'),
    backgroundColor: '#F9F9F9',
    borderRadius: Size(10),
    marginLeft: wp('1%'),
  },
  textposition: {
    flex: 1,
    paddingHorizontal: 10,
  },
  textAreaContainer: {
    borderColor: '#fff',
    borderWidth: Size(1),
    borderRadius: Size(4),
    borderColor: '#C4C4C4',
    marginTop: wp('3%'),
    width: wp('92.5%'),
    alignSelf: 'center',
  },
  textArea: {
    height: hp('18%'),
    width: wp('91%'),
  },
  buttonKeranjang: {
    borderColor: '#E07126',
    borderRadius: 10,
    width: wp('77%'),
    height: hp('6%'),
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: wp('0.3%'),
  },
  buttonTrash: {
    borderColor: '#E07126',
    borderRadius: 10,
    width: wp('8%'),
    height: hp('6%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: wp('0.3%'),
  },
  textButton: {
    fontSize: hp('1.8%'),
    color: '#E07126',
    fontFamily: 'Lato-Medium',
    alignSelf: 'center',
  },
  belanjaButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#529F45',
    height: hp('5%'),
    borderRadius: Size(10),
  },

  loadingApi: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    width: wp('100%'),
    marginTop: hp('0%'),
    // height: hp('100%'),
    // position: 'absolute',
    // top:hp('-50%')
  },
});
