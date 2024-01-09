import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  RefreshControl,
} from 'react-native';
import {connect} from 'react-redux';
import ProductsImage from './ProductsImages';
import {Picker} from '@react-native-picker/picker';
import IconMinus from '../assets/icons/Minus.svg';
import IconPlus from '../assets/icons/Plus.svg';
import Logo from '../assets/icons/Logo.svg';
import IconSearch from '../assets/icons/Search.svg';
import IconClose from '../assets/icons/Closemodal.svg';
import IconNotif from '../assets/icons/NotifAll.svg';
import IconShopping from '../assets/icons/Shopping-Cart.svg';
import IconMenu from '../assets/icons/Menu.svg';
import Size from '../components/Fontresponsive';
import axios from 'axios';
import CONFIG from '../constants/config';
import {SubsAction, ShoppingCartAction} from '../redux/Action';
import Search from '../pages/Search';
import IconOffline from '../assets/icons/NetInfo.svg';
import {ActivityIndicator} from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Storage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import IconBack from '../assets/icons/backArrow.svg';
import ModalAlert from '../components/ModalAlert';
import Snackbar from 'react-native-snackbar';
import ModalBlackList from '../components/ModalBlackList';

function MiniOfflineSign() {
  return (
    <View style={styles.offlineContainer}>
      <View style={styles.offlineContainer2}>
        <Text style={styles.offlineText}>{'Internet'}</Text>
      </View>
      <IconOffline style={styles.offlineIcon} />
    </View>
  );
}

export class Subscribe extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.onEndReachedCalledDuringMomentum = false;
    this.state = {
      subscribeItems: {
        user_id: '',
        product_id: '',
        qty: 1,
        time: 'Pilih Waktu',
        notes: '',
        status: '',
        half: 'Satu',
        date: new Date(),
      },
      listSearch: {
        id: '',
        name: '',
        image: '',
        price_sell: '',
      },
      search: '',
      qty: 0,
      notifMessage: 0,
      notifSubscribe: 0,
      notifAllOrder: 0,
      notifAllComplaint: 0,
      notifBroadcast: 0,
      page: 1,
      loadingMore: false,
      refreshing: false,
      maxPage: 1,
      showPickerDate: false,
      date: new Date(Date.now()),
      // dateAfter: new Date().setDate(new Date().getDate() - 1),
      dateSubscibe: '',
      alertData: '',
      modalAlert: false,
      visibleModalBlack: false,
    };
  }

  postSubscribe = async () => {
    if (this.state.subscribeItems.qty == 0) {
      this.setState({
        alertData: 'Jumlah tidak boleh 0',
        modalAlert: !this.state.modalAlert,
      });
    } else if (this.state.subscribeItems.time == 'Pilih Waktu') {
      this.setState({
        alertData:
          'Harap memilih rentang waktu berlangganan, di pilih rentang waktu',
        modalAlert: !this.state.modalAlert,
      });
    } else if (this.state.dateSubscibe == '') {
      this.setState({
        alertData: 'Harap memilih di pilih waktu langganan',
        modalAlert: !this.state.modalAlert,
      });
      // this.setState({dateSubscibe: ''});
    } else {
      try {
        let response;
        if (this.state.subscribeItems.half == 'Setengah') {
          response = await axios.post(
            `${CONFIG.BASE_URL}/api/subscribe`,
            {
              product_id: this.props.item.id,
              qty: this.state.subscribeItems.qty,
              time: this.state.subscribeItems.time,
              notes: this.state.subscribeItems.notes,
              status: 1,
              start_at: moment(this.state.subscribeItems.date).format(
                'YYYY-MM-DD',
              ),
              half: 1,
            },
            {
              headers: {Authorization: `Bearer ${this.props.token}`},
            },
          );
        } else {
          response = await axios.post(
            `${CONFIG.BASE_URL}/api/subscribe`,
            {
              product_id: this.props.item.id,
              qty: this.state.subscribeItems.qty,
              time: this.state.subscribeItems.time,
              notes: this.state.subscribeItems.notes,
              status: 1,
              start_at: moment(this.state.subscribeItems.date).format(
                'YYYY-MM-DD',
              ),
            },
            {
              headers: {Authorization: `Bearer ${this.props.token}`},
            },
          );
        }
        const data = response.data;
        console.log('masuk data', response.data);
        if (data !== '' && data['success'] == true) {
          this.props.navigation.navigate('ListTimeSubscribe');
        } else {
          console.log('gagal=====', response.data);
          this.setState({visibleModalBlack : true})
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

  quantityHandler = action => {
    let currentQty = this.state.subscribeItems.qty;

    if (action == 'more') {
      currentQty += 1;
    } else if (action == 'less' && currentQty > 0) {
      currentQty -= 1;
    } else {
      currentQty = 0;
    }

    this.setState(prevState => ({
      subscribeItems: {
        ...prevState.subscribeItems,
        qty: currentQty,
      },
    }));
  };

  //searching data
  getDataSearching = async (value = this.state.search, isNew = false) => {
    const {page} = this.state;
    if (isNew) {
      this.setState({page: 1});
    }
    try {
      let response = await axios.get(
        `${CONFIG.BASE_URL}/api/products?search=${value}&page=${
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

  handleItemPress = item => {
    this.postRecent(item);
    this.props.subsAct(item, 'item');
    this.setState({search: ''});
    this.props.navigation.navigate('ProdukDeskripsi', {initial: false});
  };

  //load more data
  getMoreSearch = () => {
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

  getNotifAll = async () => {
    try {
      let response = await axios.get(
        `${CONFIG.BASE_URL}/api/notification-all`,
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      const data = response.data.data;
      // console.log('DATA TEST', data);
      this._isMounted &&
        this.setState({
          notifAllOrder: data.total_order,
          notifMessage: data.total_chat,
          notifAllComplaint: data.total_complaint,
          notifSubscribe: data.total_subscribe,
          notifBroadcast: data.total_broadcast,
          qty: data.total_cart,
        });
      // this.props.notifAct(data.data, 'notifAllComplaint');
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
        // this.props.navigation.navigate('Home');
      }
    }
  };

  renderCountNotificationBadge = () => {
    const {
      notifMessage,
      notifSubscribe,
      notifAllOrder,
      notifAllComplaint,
      notifBroadcast,
    } = this.state;
    // fungsi menghitung order berdasarkan status
    try {
      let count = 0;
      let hasil = notifMessage;
      let hasil2 = notifSubscribe;
      let hasil3 = notifAllOrder;
      let hasil4 = notifAllComplaint;
      let hasil5 = notifBroadcast;
      count =
        count +
        parseInt(hasil) +
        parseInt(hasil2) +
        parseInt(hasil3) +
        parseInt(hasil4) +
        parseInt(hasil5);
      // console.log(count);
      if (count > 0) {
        return (
          <View style={styles.counter}>
            <Text style={styles.counterText}>{count}</Text>
          </View>
        );
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // UNSAFE_componentWillMount = () => {
  //   // lor(this);
  //   this._isMounted = true;
  //   this.getDataSearching();
  //   this.getNotifAll();
  // };

  componentDidMount() {
    this._isMounted = true;
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.getNotifAll();
    });
    this.getDataSearching();
  }

  componentWillUnmount() {
    // rol();
    this._isMounted = false;
    // this.focusListener();
  }

  getMenu = () => {
    this.props.navigation.navigate('Profile');
  };

  postRecent = async item => {
    console.log(JSON.stringify(item));
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
      // let data = response.data.data.data;
      // const dataTotal = response.data.data.total;
      console.log(response);
    } catch (error) {
      console.log('5');
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

  onChange = (event, value) => {
    console.log('event', event);
    if (event.type === 'dismissed') {
      this.setState({dateSubscibe: ''});
    } else {
      this.setState({
        dateSubscibe: value,
        subscribeItems: {
          ...this.state.subscribeItems,
          date: value,
        },
      });
    }
    if (Platform.OS === 'android') {
      this.setState({showPickerDate: false});
    }
  };

  getCloseAlertModal() {
    this.setState({modalAlert: !this.state.modalAlert});
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
  closeModalBlacklist() {
    this.setState({visibleModalBlack : false})
  }
  render() {
    const {qty, search} = this.state;
    console.log('cek subscribe', JSON.stringify(this.state.subscribeItems));
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <ModalAlert
          modalAlert={this.state.modalAlert}
          alert={this.state.alertData}
          getCloseAlertModal={() => this.getCloseAlertModal()}
        />
         <ModalBlackList 
          modalVisible={this.state.visibleModalBlack}
          getCloseAlertModal={() => this.closeModalBlacklist()}
          />
        <View style={styles.container}>
          <View style={[styles.posisionTextTitle]}>
            <IconBack
              width={wp('4%')}
              height={hp('4%')}
              stroke="black"
              strokeWidth="2.5"
              fill="black"
              onPress={() => this.props.navigation.goBack()}
            />
            <Text style={styles.textHeader}>{'Langganan'}</Text>
          </View>
          <View style={styles.buttonHeader}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Notification')}>
              <IconNotif width={wp('5%')} height={hp('5%')} />
              {this.renderCountNotificationBadge()}
            </TouchableOpacity>
            <TouchableOpacity
              style={{Position: 'relative'}}
              onPress={() => this.props.navigation.navigate('Keranjang')}>
              <IconShopping width={wp('5%')} height={hp('5%')} />
              {qty > 0 ? (
                <View style={styles.counter}>
                  <Text style={styles.counterText}>{qty}</Text>
                </View>
              ) : null}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menu}
              onPress={() => this.getMenu()}>
              <IconMenu width={wp('5%')} height={hp('5%')} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.subscribe}>
            {this.state.search.length > 0 && (
              <ScrollView>
                <Search
                  onItemPress={this.handleItemPress}
                  data={this.state.listSearch}
                  // refreshControl={
                  //   <RefreshControl
                  //     refreshing={this.state.refreshing}
                  //     onRefresh={this.handleRefresh}
                  //     colors={['#529F45', '#FFFFFF']}
                  //   />
                  // }
                  onEndReached={this.getMoreSearch}
                  onMomentumScrollBegin={() => {
                    this.onEndReachedCalledDuringMomentum = false;
                  }}
                  ListFooterComponent={this.renderLoadMore}
                  navigation={this.props.navigation}
                />
              </ScrollView>
            )}
            {this.state.search.length == 0 && (
              <View>
                <ProductsImage
                  key={this.props.item.id}
                  image={this.props.item.image}
                  navigation={this.props.navigation}
                />
                <View style={styles.positionSubscribe}>
                  <Text style={styles.title}>Langganan</Text>
                  {/* <View style={styles.positionDetail}> */}
                  <Text
                    style={[
                      styles.priceProduct,
                      {fontSize: hp('1.5%'), marginBottom: wp('2%')},
                    ]}>
                    Produk yang dipesan
                  </Text>
                  <Text style={[styles.priceProduct, {marginBottom: wp('2%')}]}>
                    {this.props.item.name}
                  </Text>
                  {/* <TextInput
                      autoCapitalize="none"
                      style={styles.input}
                      value={this.props.item.name}
                      editable={false}
                      // numberOfLines={2}
                      multiline={true}
                      placeholderTextColor="#000000"
                    /> */}
                  {/* </View> */}
                  <View style={styles.positionDetail}>
                    <Text style={styles.priceProduct}>Jumlah</Text>
                    <View style={{flexDirection: 'row'}}>
                      <TouchableOpacity
                        onPress={() => this.quantityHandler('less')}
                        style={styles.iconminus}>
                        <IconMinus />
                      </TouchableOpacity>
                      <TextInput
                        onChangeText={value =>
                          this.setState({
                            subscribeItems: {
                              ...this.state.subscribeItems,
                              qty: parseInt(value),
                            },
                          })
                        }
                        required="number"
                        keyboardType="number-pad"
                        style={{
                          borderWidth: 1,
                          borderColor: '#cccccc',
                          paddingHorizontal: 12,
                          paddingTop: 3,
                          color: 'black',
                          fontSize: hp('1.8%'),
                          fontFamily: 'Lato-Medium',
                          width: wp('28%'),
                          textAlign: 'center',
                        }}>
                        {this.state.subscribeItems.qty}
                      </TextInput>
                      <TouchableOpacity
                        onPress={() => this.quantityHandler('more')}
                        style={styles.iconplus}>
                        <IconPlus />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.positionDetail}>
                    <Text style={styles.priceProduct}>
                      {'Pilih Rentang Waktu'}
                    </Text>
                    <View style={styles.picker}>
                      <Picker
                        selectedValue={this.state.subscribeItems.time}
                        itemStyle={{color: '#000000'}}
                        onValueChange={value =>
                          this.setState(prevState => ({
                            subscribeItems: {
                              ...prevState.subscribeItems,
                              time: value,
                            },
                          }))
                        }>
                        <Picker.Item
                          style={{
                            fontSize: hp('1.8%'),
                            fontFamily: 'Lato-Regular',
                          }}
                          label="Pilih Waktu"
                          value={'Pilih Waktu'}
                          key={0}
                        />
                        <Picker.Item
                          style={{
                            fontSize: hp('1.8%'),
                            fontFamily: 'Lato-Regular',
                          }}
                          label="Per 2 minggu"
                          value="2_week"
                        />
                        <Picker.Item
                          style={{
                            fontSize: hp('1.8%'),
                            fontFamily: 'Lato-Regular',
                          }}
                          label="Per bulan"
                          value="month"
                        />
                      </Picker>
                    </View>
                  </View>
                  <View style={styles.positionDetail}>
                    <Text style={styles.priceProduct}>
                      {'Pilih Waktu Langganan'}
                    </Text>
                    {this.state.dateSubscibe ? (
                      <TouchableOpacity
                        style={[
                          styles.buttonPilihTanggal,
                          {
                            backgroundColor: '#FFFFFF',
                            borderColor: '#DCDCDC',
                            borderWidth: 1,
                          },
                        ]}
                        onPress={() => this.setState({showPickerDate: true})}>
                        <Text>
                          {moment(this.state.dateSubscibe).format(
                            'DD MMM YYYY',
                          )}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.buttonPilihTanggal}
                        onPress={() => this.setState({showPickerDate: true})}>
                        <Text>{'Pilih Tanggal'}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  {this.props.item.status_renceng ? (
                    <View style={styles.positionDetail}>
                      <Text style={styles.priceProduct}>
                        {'Satuan Renceng'}
                      </Text>
                      <View style={styles.picker}>
                        <Picker
                          selectedValue={this.state.subscribeItems.half}
                          itemStyle={{color: '#000000'}}
                          onValueChange={value =>
                            this.setState(prevState => ({
                              subscribeItems: {
                                ...prevState.subscribeItems,
                                half: value,
                              },
                            }))
                          }>
                          <Picker.Item
                            style={{
                              fontSize: hp('1.8%'),
                              fontFamily: 'Lato-Regular',
                            }}
                            label={
                              'Full (' +
                              this.props.item.konversi_sedang_ke_kecil +
                              ' ' +
                              this.props.item.kecil.charAt(0) +
                              this.props.item.kecil
                                .slice(1)
                                .toLowerCase() +
                              ' )'
                            }
                            value={'Satu'}
                            key={0}
                          />
                          <Picker.Item
                            style={{
                              fontSize: hp('1.8%'),
                              fontFamily: 'Lato-Regular',
                            }}
                            label={
                              'Setengah (' +
                              this.props.item.konversi_sedang_ke_kecil / 2 +
                              ' ' +
                              this.props.item.kecil.charAt(0) +
                              this.props.item.kecil
                                .slice(1)
                                .toLowerCase() +
                              ' )'
                            }
                            value={'Setengah'}
                          />
                        </Picker>
                      </View>
                    </View>
                  ) : null}
                  <Text style={[styles.priceProduct, {marginTop: wp('3%')}]}>
                    Catatan
                  </Text>
                  <View style={styles.textAreaContainer}>
                    <TextInput
                      autoCapitalize="none"
                      style={styles.textArea}
                      underlineColorAndroid="transparent"
                      numberOfLines={10}
                      multiline={true}
                      placeholder="Tambahkan catatan"
                      placeholderTextColor="#A4A4A4"
                      onChangeText={value =>
                        this.setState(prevState => ({
                          subscribeItems: {
                            ...prevState.subscribeItems,
                            notes: value,
                          },
                        }))
                      }
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
        <View
          style={{
            alignItems: 'center',
            marginHorizontal: wp('5%'),
            marginVertical: wp('2%'),
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={styles.buttonCari}
            onPress={() => this.props.navigation.navigate('Produk')}>
            <Text style={styles.textButtonCari}>Cari barang lainnya</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonSelesai}
            onPress={() => this.postSubscribe()}>
            <Text style={styles.textButtonSelesai}>Selesai</Text>
          </TouchableOpacity>
        </View>
        {/* The date picker */}
        {this.state.showPickerDate && (
          <DateTimePicker
            minimumDate={new Date()}
            value={this.state.date}
            mode={'date'}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            is24Hour={true}
            onChange={this.onChange}
            style={styles.datePicker}
            onTouchCancel={() => this.setState({dateSubscibe: ''})}
            onCancel={() => this.setState({dateSubscibe: ''})}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: hp('8%'),
    backgroundColor: 'white',
    borderBottomWidth: 4,
    borderColor: '#ddd',
  },
  posisionTextTitle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: wp('5%'),
  },
  textHeader: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('2.4%'),
    paddingLeft: wp('5%'),
    paddingVertical: 1,
  },
  buttonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp('25%'),
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
    width: wp('50%'),
    height: hp('6%'),
    marginLeft: wp('1%'),
    paddingLeft: wp('5%'),
    paddingRight: wp('10%'),
    borderRadius: hp('1.5%'),
    borderColor: '#DCDCDC',
  },
  search: {
    position: 'absolute',
    top: hp('0%'),
    right: wp('5%'),
  },
  scroll: {
    backgroundColor: '#fff',
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
  subscribe: {
    flex: 1,
    marginTop: 0,
  },
  positionSubscribe: {
    marginTop: wp('2%'),
    // marginLeft: 30,
    marginHorizontal: wp('5%'),
  },
  positionDetail: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: 'red'
  },
  title: {
    fontSize: hp('2.4%'),
    color: '#000000',
    fontFamily: 'Lato-Medium',
    marginBottom: 20,
  },
  priceProduct: {
    fontSize: hp('2%'),
    color: '#000000',
    fontFamily: 'Lato-Regular',
  },
  input: {
    width: wp('40%'),
    height: hp('8%'),
    textAlign: 'center',
    borderColor: '#C4C4C4',
    borderWidth: 1,
    borderRadius: Size(4),
    paddingHorizontal: wp('1%'),
    color: '#000000',
    fontFamily: 'Lato-Regular',
    fontSize: hp('1.4%'),
  },
  buttonEdit: {
    backgroundColor: '#E0C226',
    borderRadius: 10,
    width: wp('19%'),
    height: hp('5%'),
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSelesai: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#529F45',
    borderRadius: wp('1%'),
    width: wp('43%'),
    height: hp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonCari: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E07126',
    borderRadius: wp('1%'),
    width: wp('43%'),
    height: hp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButtonSelesai: {
    fontSize: hp('1.8%'),
    color: '#529F45',
    fontFamily: 'Lato-Medium',
    alignSelf: 'center',
  },
  textButtonCari: {
    fontSize: hp('1.8%'),
    color: '#E07126',
    fontFamily: 'Lato-Medium',
    alignSelf: 'center',
  },
  textEdit: {
    fontSize: hp('1.8%'),
    color: '#000000',
    fontFamily: 'Lato-Medium',
    alignSelf: 'center',
  },
  textAreaContainer: {
    borderColor: '#fff',
    borderWidth: Size(1),
    borderRadius: Size(4),
    borderColor: '#C4C4C4',
    fontSize: hp('1.8%'),
    color: '#000000',
    fontFamily: 'Lato-Regular',
    height: hp('10%'),
    width: wp('90%'),
    marginVertical: wp('2%'),
  },
  textArea: {
    textAlignVertical: 'top',
    paddingLeft: wp('1%'),
  },
  picker: {
    // marginTop: hp('-2%'),
    justifyContent: 'center',
    width: wp('40%'),
    height: wp('8%'),
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: wp('1%'),
  },
  iconplus: {
    borderWidth: Size(1),
    borderColor: '#cccccc',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: Size(4),
    borderBottomRightRadius: Size(4),
    width: wp('6%'),
  },
  iconminus: {
    borderWidth: 1,
    borderColor: '#cccccc',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: Size(4),
    borderBottomLeftRadius: Size(4),
    width: wp('6%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: wp('100%'),
    height: hp('60%'),
    // flexDirection: 'row',
    marginTop: hp('10%'),
  },
  offlineContainer2: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  offlineIcon: {
    width: wp('70%'),
    height: hp('70%'),
  },
  offlineText: {
    color: '#4A8F3C',
    fontFamily: 'Lato-Medium',
    fontSize: hp('3%'),
    marginBottom: hp('-30%'),
    textAlign: 'center',
    // fontSize: hp('2),%'
  },
  buttonPilihTanggal: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DCDCDC',
    borderWidth: 1,
    width: wp('40%'),
    height: hp('4%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp('1%'),
  },
});

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
  dataUser: state.LoginReducer.dataUser,
  item: state.SubscribeReducer.item,
  qty: state.ShoppingCartReducer.qty,
});

const mapDispatchToProps = dispatch => {
  return {
    orderplusAct: () => {
      dispatch({type: 'PLUS_ORDER'});
    },
    orderminAct: () => {
      dispatch({type: 'MINUS_ORDER'});
    },
    subsAct: (value, tipe) => {
      dispatch(SubsAction(value, tipe));
    },
    shopAct: (value, tipe) => {
      dispatch(ShoppingCartAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Subscribe);
