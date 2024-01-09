import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TouchableHighlight,
  Modal,
  Pressable,
  Alert,
  Button,
  Dimensions,
  TextInput,
  RefreshControl,
  TouchableWithoutFeedback,
} from 'react-native';
import {connect} from 'react-redux';
import Size from '../components/Fontresponsive';
import axios from 'axios';
import NumberFormat from 'react-number-format';
import CONFIG from '../constants/config';
import {Card} from 'react-native-elements';
import IconSearch from '../assets/icons/Search.svg';
import IconClose from '../assets/icons/Closemodal.svg';
import IconNotif from '../assets/icons/NotifAll.svg';
import IconMenu from '../assets/icons/Menu.svg';
import IconArrow from '../assets/icons/arrow.svg';
import moment from 'moment';
import {OrderAction, RatingAction} from '../redux/Action';
import {statusTransaction, dateTransaction} from '../constants/status';
import {FlatList} from 'react-native';
import Icon404 from '../assets/icons/404.svg';
import IconOffline from '../assets/icons/NetInfo.svg';
import {ActivityIndicator} from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Storage from '@react-native-async-storage/async-storage';
import IconBack from '../assets/icons/backArrow.svg';
import DatePicker from 'react-native-neat-date-picker';
import ModalAlert from '../components/ModalAlert';
import BottomNavigation from '../components/BottomNavigation';
import DummyImage from '../assets/icons/IconLogo.svg';
import Snackbar from 'react-native-snackbar';
import Header from '../components/Header';
// Indonesian locale
let idLocale = require('moment/locale/id');
moment.updateLocale('id', idLocale);

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

function LoadingApi() {
  return (
    <View style={styles.loadingApi}>
      <ActivityIndicator animating size="small" color="#529F45" />
    </View>
  );
}

export const width = Dimensions.get('screen').width;
const listDataTransaction = [
  {
    id: '',
    status: '',
    created_at: '',
    invoice: '',
    delivery_service: '',
    delivery_time: '',
    delivery_track: '',
    delivery_fee: '',
    name: '',
    phone: '',
    address: '',
    kelurahan: '',
    kecamatan: '',
    kota: '',
    provinsi: '',
    kode_pos: '',
    payment_method: '',
    payment_total: '',
    payment_discount: '',
    data_item: [
      {
        id: '',
        qty: '',
        price: '',
        product: {
          id: '',
          name: '',
          image: '',
        },
      },
    ],
    data_review: [],
    data_complaint: [],
  },
];

export class ListDataPayment extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.onEndReachedCalledDuringMomentum = false;
    this.state = {
      listDataTransaction: listDataTransaction,
      modalVisibleStatus: false,
      modalVisibleTanggal: false,
      pilihStatus: {
        title: 'Semua Status',
        value: '',
      },
      pilihTanggal: {
        title: 'Semua Tanggal',
        value: '',
      },
      params: {},
      search: '',
      loading: true,
      page: 1,
      loadingMore: false,
      refreshing: false,
      maxPage: 1,
      startDate: null,
      endDate: null,
      displayedDate: moment(),
      dateRange: null,
      notifMessage: 0,
      notifSubscribe: 0,
      notifAllOrder: 0,
      notifAllComplaint: 0,
      notifBroadcast: 0,
      loadingApi: true,
      showDatePicker: false,
      alertData: '',
      modalAlert: false,
    };
  }

  // modal
  setModalVisibleStatus = visible => {
    this.setState({modalVisibleStatus: visible});
  };

  setModalVisibleTanggal = visible => {
    this.setState({modalVisibleTanggal: visible});
  };

  // get order
  getDataOrder = async (name, value, isNew = false) => {
    // console.log('masuk getDataOrder single');
    const {page, params} = this.state;
    let parameter = {
      ...params,
      [name]: value,
    };

    let _params = '?';
    // console.log(parameter);
    Object.keys(parameter).forEach((key, i) => {
      if (i > 0) {
        _params += '&';
      }
      _params += `${key}=${parameter[key]}`;
    });
    // console.log('params', _params);
    // console.log('paramsState', this.state.params);
    try {
      await axios
        .get(
          `${CONFIG.BASE_URL}/api/transactions${_params}&page=${
            isNew ? 1 : page
          }`,
          {
            headers: {Authorization: `Bearer ${this.props.token}`},
          },
        )
        .then(response => {
          const data = response.data.data;
          this._isMounted &&
            this.setState(prevState => ({
              loadingApi: false,
              loading: false,
              listDataTransaction:
                page === 1
                  ? data.data
                  : [...this.state.listDataTransaction, ...data.data],
              refreshing: false,
              loadingMore: data.last_page > this.state.page,
              maxPage: data.last_page,
              params: parameter,
            }));
          // console.log('DATA ORDER BERHASIL');
        })
        .catch(error => {});
    } catch (error) {
      this.setState({loadingApi: false});
      this.setState({loading: false});
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

  // get order
  getDataOrderWithBetweenDate = async (name, value, isNew = false) => {
    const {page, params} = this.state;
    const start_date = moment(this.state.startDate).format('YYYY-MM-DD');
    const end_date = moment(this.state.endDate).format('YYYY-MM-DD');
    let parameter = {
      ...params,
      [name]: value,
      start_date: start_date,
      end_date: end_date,
    };

    let _params = '?';
    // console.log(parameter);
    Object.keys(parameter).forEach((key, i) => {
      if (i > 0) {
        _params += '&';
      }
      _params += `${key}=${parameter[key]}`;
    });
    // console.log('params', _params);
    // console.log('paramsState', this.state.params);
    try {
      let response = await axios.get(
        `${CONFIG.BASE_URL}/api/transactions${_params}&page=${
          isNew ? 1 : page
        }`,
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      let data = response.data.data;
      this._isMounted &&
        this.setState(prevState => ({
          loadingApi: false,
          listDataTransaction:
            page === 1
              ? data.data
              : [...this.state.listDataTransaction, ...data.data],
          refreshing: false,
          loadingMore: data.last_page > this.state.page,
          maxPage: data.last_page,
          params: parameter,
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
        this.props.navigation.navigate('Home');
      }
    }
  };

  //filter show data
  handleStatusChange(item) {
    if (this.state.pilihTanggal.title === 'Pilih periode tanggal') {
      this.setState(
        {
          pilihStatus: {
            title: item.title,
            value: item.value,
          },
          modalVisibleStatus: false,
          loadingApi: true,
        },
        () => {
          this.getDataOrderWithBetweenDate('status', item.value);
        },
      );
    } else {
      this.setState(
        {
          pilihStatus: {
            title: item.title,
            value: item.value,
          },
          modalVisibleStatus: false,
          loadingApi: true,
        },
        () => {
          this.getDataOrder('status', item.value);
        },
      );
    }
  }

  handleDateChange(item) {
    // console.log('item nih', item);
    if (item.title === 'Pilih periode tanggal') {
      // console.log('masuk ke between');
      this.setState(
        {
          pilihTanggal: {
            title: item.title,
            value: item.value,
          },
          modalVisibleTanggal: false,
          loadingApi: true,
        },
        () => {
          this.getDataOrderWithBetweenDate('date', item.value);
        },
      );
    } else {
      // console.log('masuk ke single date');
      // console.log('cek status', this.state.pilihStatus);
      this.setState(
        {
          params: {
            status: this.state.pilihStatus.value,
          },
          pilihTanggal: {
            title: item.title,
            value: item.value,
          },
          modalVisibleTanggal: false,
          loadingApi: true,
        },
        () => {
          this.getDataOrder('date', item.value);
        },
      );
    }
  }

  //load more data
  getMoreTransaction = () => {
    if (this.state.pilihTanggal.title === 'Pilih semua tanggal') {
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
            this.getDataOrderWithBetweenDate('search', this.state.search);
          },
        );
        this.onEndReachedCalledDuringMomentum =
          this.state.page >= this.state.maxPage;
      }
    } else {
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
            this.getDataOrder('search', this.state.search);
          },
        );
        this.onEndReachedCalledDuringMomentum =
          this.state.page >= this.state.maxPage;
      }
    }
  };

  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        refreshing: true,
        loadingApi: true,
      },
      () => {
        this.getDataOrder();
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

  handlerSearch = search => {
    // let input = e.nativeEvent.text;
    // this.setState({loadingApi: true}, () =>
    //   this.getDataOrder('search', input, true),
    // );
    // this.setState({search : input})
    this.setState({search, loadingApi: true}, () =>
      this.getDataOrder('search', search, true),
    );
  };

  handleItemPress = item => {
    this.props.orderAct(item, 'order');
    this.setState({search: ''});
    this.props.navigation.navigate('ListPaymentDetail');
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
      if (count > 0) {
        return count
      } else {
        return 0;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // UNSAFE_componentWillMount = () => {
  //   // lor(this);
  //   this._isMounted = true;
  //   this.getDataOrder('status', '');
  //   this.getNotifAll();
  // };

  componentDidMount() {
    this._isMounted = true;
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.getDataOrder('status', '');
      this.getNotifAll();
    });
  }

  componentWillUnmount() {
    // rol();
    this._isMounted = false;
    // this.focusListener();
  }

  //date range
  onConfirm = (start, end) => {
    // console.log('masuk onConfirm');
    if (start === end) {
      this.setState({
        alertData: 'Harap memilih rentang tanggal lebih dari sehari',
        modalAlert: !this.state.modalAlert,
      });
    } else {
      this.setState(
        {
          startDate: start,
          endDate: end,
          showDatePicker: false,
        },
        () => {
          // this.getRangeDate();
          this.handleDateChange({
            value: '',
            title: 'Pilih periode tanggal',
            // start: start,
            // end: end,
          });
        },
      );
    }
    // console.log(start.getDate());
    // console.log(end.getDate());
  };

  hitungQuantity = item => {
    const sumTotal = (arr = []) =>
      arr.reduce((sum, {qty}) => sum + parseInt(qty), 0);
    const total = sumTotal(item.data_item ?? 0);
    if (total === 0) return null;
    return <Text>{total}</Text>;
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

  getStock = (item) =>  {
    this._isMounted = true;
    if(item.stock_status != 1){
      this.props.navigation.navigate(
        'ListPaymentDetail',
        this.props.orderAct(item, 'order'),
      );
    }else{
      this.props.navigation.navigate(
      'OutOfStockDetails',
      this.props.orderAct(item, 'order'),
      )
    }

    this._isMounted && this.setState({
     pilihStatus: {
       title: 'Semua Status',
       value: '',
     },
   });
  }

  render() {
    // countdown payment
    // if (this.state.listDataTransaction.length > 0) {
    //   let currentDate = moment();
    //   let endPayment = moment(this.state.listDataTransaction[0].updated_at).add(
    //     1,
    //     'days',
    //   );
    //   let totalDurationPayment = endPayment.diff(currentDate) / 1000;
    // }
    const {
      modalVisibleStatus,
      modalVisibleTanggal,
      startDate,
      endDate,
      displayedDate,
      search,
      loadingApi,
      qty
    } = this.state;
    // console.log(
    //   "Data transaksi "+JSON.stringify(this.state.listDataTransaction)
    // );
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <ModalAlert
          modalAlert={this.state.modalAlert}
          alert={this.state.alertData}
          getCloseAlertModal={() => this.getCloseAlertModal()}
        />
        <Header 
        title="Pembayaran"
        navigation={this.props.navigation}
        notif={true}
        notifCount={this.renderCountNotificationBadge()}
        cart={true}
        cartCount={qty}
        menu={true}
        />
        {/* searching */}
        <View style={styles.searchSection}>
          <TextInput
            // onEndEditing={e => this.handlerSearch(e)}
            onChangeText={search => this.handlerSearch(search)}
            // onChangeText={text => this.setState({search: text})}
            autoCapitalize="none"
            style={styles.inputStyle}
            placeholder="Ketik kata kunci yang ingin anda cari"
            value={search}
          />
          {search === '' ? (
            <IconSearch
              width={wp('3.5%')}
              height={hp('6%')}
              style={styles.search}
            />
          ) : (
            <IconClose
              fill={'black'}
              width={wp('3%')}
              height={hp('2%')}
              style={[styles.search, {marginTop: hp('2%')}]}
              onPress={() =>
                this.setState({search: ''}, () =>
                  this.getDataOrder('search', '', true),
                )
              }
            />
          )}
        </View>

        {/* modal */}
        <View style={{flexDirection: 'row', marginBottom: wp('-3%')}}>
          <View style={styles.containerInput}>
            <Pressable
              style={[styles.buttonStatus, {marginLeft: wp('5%')}]}
              onPress={() => this.setModalVisibleStatus(true)}>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1, justifyContent: 'center'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[
                      styles.textStyle2,
                      {
                        alignSelf: 'flex-start',
                        textAlign: 'left',
                        width: '100%',
                      },
                    ]}>
                    {this.state.pilihStatus.title}
                  </Text>
                </View>
                <IconArrow
                  width={wp('4%')}
                  height={hp('4%')}
                  marginLeft={wp('2%')}
                  justifyContent={'center'}
                  alignItems={'center'}
                  alignSelf={'center'}
                />
              </View>
            </Pressable>
          </View>
          <View style={styles.containerInput}>
            <Pressable
              style={[styles.buttonStatus, {marginLeft: wp('5%')}]}
              onPress={() => this.setModalVisibleTanggal(true)}>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1, justifyContent: 'center'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[
                      styles.textStyle2,
                      {
                        alignSelf: 'flex-start',
                        textAlign: 'left',
                        width: '100%',
                      },
                    ]}>
                    {this.state.pilihTanggal.title}
                  </Text>
                </View>
                <IconArrow
                  width={wp('4%')}
                  height={hp('4%')}
                  marginLeft={wp('2%')}
                  justifyContent={'center'}
                  alignItems={'center'}
                  alignSelf={'center'}
                />
              </View>
            </Pressable>
          </View>
        </View>

        {/* data transaction */}
        {loadingApi ? (
          <LoadingApi />
        ) : (
          <FlatList
            contentContainerStyle={{
              justifyContent: 'center',
              // backgroundColor: 'red',
              paddingTop: wp('3%'),
            }}
            keyExtractor={(item, index) => `${index}`}
            data={this.state.listDataTransaction}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.handleRefresh}
                colors={['#529F45', '#FFFFFF']}
              />
            }
            onEndReached={() => this.getMoreTransaction()}
            onEndReachedThreshold={0.5}
            initialNumToRender={10}
            showsVerticalScrollIndicator={false}
            onMomentumScrollBegin={() => {
              this.onEndReachedCalledDuringMomentum = false;
            }}
            ListFooterComponent={() => this.renderLoadMore()}
            renderItem={({item, index}) => {
              return (
                <TouchableWithoutFeedback
                  onPress={() => {
                    this.getStock(item)
                    // console.log("item "+item);
                  }}>
                  <View>
                    <Card
                      containerStyle={{
                        borderRadius: wp('3%'),
                        // marginBottom: wp('1%'),
                        // backgroundColor: 'blue',
                        width: wp('90%'),
                        marginLeft: wp('5%'),
                        padding: 10,
                      }}>
                      <View
                        style={[
                          styles.position2,
                          {
                            // marginBottom: wp('3%'),
                            // marginTop: wp('1%'),
                            flex: 1,
                            // backgroundColor: 'red',
                            justifyContent: 'space-between',
                          },
                        ]}>
                        {/* <View style={styles.textposition}> */}
                        <Text
                          style={[
                            styles.title,
                            {
                              color: '#777',
                              // marginLeft: wp('-1%'),
                              fontSize: hp('1.7%'),
                              fontFamily: 'Lato-Regular',
                            },
                          ]}>
                          {moment(item.created_at).format('LLL')}
                        </Text>
                        {/* </View> */}
                        {item.status == '1' && item.status_faktur == 'F' ? (
                          <View
                            style={[
                              styles.textStatus,
                              {backgroundColor: '#b4e5ed'},
                            ]}>
                            <Text
                              style={[
                                styles.textEdit,
                                {
                                  color: '#17a2b8',
                                  fontFamily: 'Lato-Medium',
                                },
                              ]}>
                              {'Transaksi baru'}
                            </Text>
                          </View>
                        ) : null}
                        {item.status == '1' &&
                        item.status_faktur == 'Redeem' ? (
                          <View
                            style={[
                              styles.textStatus,
                              {backgroundColor: '#b4e5ed'},
                            ]}>
                            <Text
                              style={[
                                styles.textEdit,
                                {
                                  color: '#17a2b8',
                                  fontFamily: 'Lato-Medium',
                                },
                              ]}>
                              {'Redeem'}
                            </Text>
                          </View>
                        ) : null}
                        {item.status == '2' ? (
                          <View
                            style={[
                              styles.textStatus,
                              {backgroundColor: '#d8ffd4'},
                            ]}>
                            <Text
                              style={[
                                styles.textEdit,
                                {
                                  color: '#16630d',
                                  fontFamily: 'Lato-Medium',
                                },
                              ]}>
                              {'Transaksi terkonfirmasi'}
                            </Text>
                          </View>
                        ) : null}
                        {item.status == '3' ? (
                          <View
                            style={[
                              styles.textStatus,
                              {backgroundColor: '#d8ffd4'},
                            ]}>
                            <Text
                              style={[
                                styles.textEdit,
                                {
                                  color: '#16630d',
                                  fontFamily: 'Lato-Medium',
                                },
                              ]}>
                              {'Barang diproses'}
                            </Text>
                          </View>
                        ) : null}
                        {item.status == '4' ? (
                          <View
                            style={[
                              styles.textStatus,
                              {backgroundColor: '#d8ffd4'},
                            ]}>
                            <Text
                              style={[
                                styles.textEdit,
                                {
                                  color: '#16630d',
                                  fontFamily: 'Lato-Medium',
                                },
                              ]}>
                              {'Selesai'}
                            </Text>
                          </View>
                        ) : null}
                        {item.status == '10' ? (
                          <View
                            style={[
                              styles.textStatus,
                              {backgroundColor: '#fccfcf'},
                            ]}>
                            <Text
                              style={[
                                styles.textEdit,
                                {
                                  color: '#9f1414',
                                  fontFamily: 'Lato-Medium',
                                },
                              ]}>
                              {'Batal'}
                            </Text>
                          </View>
                        ) : null}
                        {item.status == 'R' ? (
                          <View
                            style={[
                              styles.textStatus,
                              {backgroundColor: '#fafcb1'},
                            ]}>
                            <Text
                              style={[
                                styles.textEdit,
                                {
                                  color: '#9b9e23',
                                  fontFamily: 'Lato-Medium',
                                },
                              ]}>
                              {'Retur Barang'}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                      <Card.Divider />
                      <View
                        style={[styles.position2, {justifyContent: 'center'}]}>
                        <View>
                          {item?.data_item[0]?.product.image ? (
                            <Image
                              resizeMode="contain"
                              source={{
                                uri:
                                  CONFIG.BASE_URL +
                                  item?.data_item[0]?.product.image,
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
                            {item?.data_item[0]?.product.name}
                          </Text>
                          <Text
                            style={{
                              color: '#777',
                              fontSize: hp('1.7%'),
                              fontFamily: 'Lato-Regular',
                              marginTop: wp('2%'),
                              // marginLeft: wp('4%'),
                            }}>
                            {item.status_faktur == 'Redeem' ? (
                              <NumberFormat
                                value={Math.round(item.payment_final)}
                                displayType={'text'}
                                thousandSeparator={true}
                                // prefix={'Rp '}
                                suffix={' poin'}
                                // decimalScale={2}
                                fixedDecimalScale={true}
                                renderText={value => (
                                  <Text
                                    numberOfLines={1}
                                    style={{
                                      fontSize: hp('1.7%'),
                                      fontFamily: 'Lato-Regular',
                                    }}>
                                    {value}
                                  </Text>
                                )}
                              />
                            ) : (
                              <NumberFormat
                                value={Math.round(item?.payment_final)}
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={'Rp '}
                                // decimalScale={2}
                                fixedDecimalScale={true}
                                renderText={value => (
                                  <Text
                                    numberOfLines={1}
                                    style={{
                                      fontSize: hp('1.7%'),
                                      fontFamily: 'Lato-Regular',
                                    }}>
                                    {value}
                                  </Text>
                                )}
                              />
                            )}
                            {' ( '}
                            {this.hitungQuantity(item)}
                            {' barang'}
                            {' )'}
                            {item?.data_item[0]?.half ? (
                              <Text
                                numberOfLines={1}
                                style={{
                                  fontSize: hp('1.7%'),
                                  fontFamily: 'Lato-Regular',
                                  color: '#17a2b8',
                                }}>
                                {' ( '}
                                {item?.data_item[0]?.qty_konversi}{' '}
                                {item?.data_item[0]?.small_unit.charAt(0) +
                                  item?.data_item[0]?.small_unit
                                    .slice(1)
                                    .toLowerCase()}
                                {' )'}
                              </Text>
                            ) : null}
                          </Text>
                        </View>
                      </View>
                      <View style={[styles.position2]}>
                        {item.data_item.length > '1' ? (
                          <View>
                            <Text
                              style={{
                                fontSize: hp('1.8%'),
                                fontFamily: 'Lato-Regular',
                                color: '#777',
                              }}>
                              +{item.data_item.length - 1} produk lainnya
                            </Text>
                          </View>
                        ) : null}
                        {/* <View>
                        <Text
                          style={{
                            fontSize: hp('1.8%'),
                            fontFamily: 'Lato-Regular',
                          }}>
                          Total Belanja:
                        </Text>
                        <NumberFormat
                          value={Math.round(item.payment_final)}
                          displayType={'text'}
                          thousandSeparator={true}
                          prefix={'Rp '}
                          // decimalScale={2}
                          fixedDecimalScale={true}
                          renderText={value => (
                            <Text
                              numberOfLines={1}
                              style={{
                                fontSize: hp('1.8%'),
                                fontFamily: 'Lato-Regular',
                                marginTop: wp('1%'),
                              }}>
                              {value}
                            </Text>
                          )}
                        />
                      </View> */}
                        {/* upload pembayaran
                                                                  <View>
                                                                      {item.status === '2' && item.payment_link === null && item.payment_method === 'transfer' && totalDurationPayment != 0 ? <TouchableOpacity onPress={() => { this.props.navigation.navigate('UploadPayment', this.props.orderAct(item, 'order')) }} style={[styles.belanjaButton, { width: wp('3%'7) }]}>
                                                                          <Text style={styles.textEdit}>Upload Pembayaran</Text></TouchableOpacity> : null}
                                                                  </View> */}
                      </View>
                      {item.status === '4' &&
                      item.data_review.length === 0 &&
                      item.data_complaint.length === 0 &&
                      item.status_complaint == null &&
                      item.status_review == null ? (
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <TouchableOpacity
                            onPress={() => {
                              this.props.navigation.navigate(
                                'OrderComplaintInput',
                                this.props.orderAct(item, 'orderComplaint'),
                              );
                            }}
                            style={[
                              styles.belanjaButton,
                              {
                                width: wp('40%'),
                                backgroundColor: '#FFFFFF',
                                borderColor: 'red',
                                borderWidth: 1,
                                marginBottom: wp('2%'),
                                borderRadius: wp('1%'),
                              },
                            ]}>
                            <Text style={[styles.textEdit, {color: 'red'}]}>
                              {'Ajukan Komplain'}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              this.props.navigation.navigate(
                                'InputRatingProduct',
                                this.props.rateAct(item, 'ratingProduct'),
                              );
                            }}
                            style={[
                              styles.belanjaButton,
                              {
                                width: wp('40%'),
                                borderRadius: wp('1%'),
                                backgroundColor: '#FFFFFF',
                                borderColor: '#529F45',
                                borderWidth: 1,
                              },
                            ]}>
                            <Text style={[styles.textEdit, {color: '#529F45'}]}>
                              Kirim Ulasan
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ) : null}
                      {item.status === '4' &&
                      item.data_review.length === 0 &&
                      item.data_complaint.length !== 0 &&
                      item.status_review == null ? (
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <TouchableOpacity
                            onPress={() => {
                              this.props.navigation.navigate(
                                'InputRatingProduct',
                                this.props.rateAct(item, 'ratingProduct'),
                              );
                            }}
                            style={[
                              styles.belanjaButton,
                              {
                                width: wp('40%'),
                                borderRadius: wp('1%'),
                                backgroundColor: '#FFFFFF',
                                borderColor: '#529F45',
                                borderWidth: 1,
                              },
                            ]}>
                            <Text style={[styles.textEdit, {color: '#529F45'}]}>
                              Kirim Ulasan
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ) : null}
                      {item.status === '4' &&
                      item.data_review.length !== 0 &&
                      item.data_complaint.length === 0 &&
                      item.status_complaint == null ? (
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <TouchableOpacity
                            onPress={() => {
                              this.props.navigation.navigate(
                                'OrderComplaintInput',
                                this.props.orderAct(item, 'orderComplaint'),
                              );
                            }}
                            style={[
                              styles.belanjaButton,
                              {
                                width: wp('40%'),
                                backgroundColor: '#FFFFFF',
                                borderColor: 'red',
                                borderWidth: 1,
                                marginBottom: wp('2%'),
                                borderRadius: wp('1%'),
                              },
                            ]}>
                            <Text style={[styles.textEdit, {color: 'red'}]}>
                              {'Ajukan Komplain'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ) : null}
                    </Card>
                  </View>
                </TouchableWithoutFeedback>
              );
            }}
          />
        )}

        {!this.state.loading && this.state.listDataTransaction.length == 0 && (
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
                Wah, daftar pembayaran mu kosong
              </Text>
              <Text
                style={{
                  fontSize: hp('1.8%'),
                  fontFamily: 'Lato-Medium',
                  width: wp('65%'),
                  textAlign: 'center',
                  marginTop: wp('2%'),
                }}>
                Yuk, isi dengan barang-barang yang ingin kamu beli
              </Text>
              <TouchableOpacity
                style={[
                  styles.belanjaButton,
                  {
                    marginTop: wp('2.5%'),
                    width: wp('45%'),
                    // marginRight: wp('1%'),
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

        {/* modal  status*/}
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleStatus}
            onRequestClose={() => {
              this.setModalVisibleStatus(!modalVisibleStatus);
            }}>
            <ScrollView>
              <View style={styles.centeredView}>
                <View
                  style={{
                    width: wp('100%'),
                    marginTop: hp('44%'),
                    height: hp('56%'),
                    backgroundColor: '#FFFFFF',
                    borderRadius: Size(10),
                  }}>
                  <TouchableHighlight
                    onPress={() =>
                      this.setModalVisibleStatus(!modalVisibleStatus)
                    }
                    underlayColor="#DDDDDD"
                    activeOpacity={0.6}>
                    <View style={styles.button}>
                      <IconClose
                        fill={'white'}
                        width={wp('4%')}
                        height={hp('4%')}
                      />
                      <Text style={styles.textStyle}>{'Pilih Status'}</Text>
                    </View>
                  </TouchableHighlight>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <TouchableHighlight
                      onPress={() =>
                        this.handleStatusChange({
                          title: 'Semua Status',
                          value: '',
                        })
                      }>
                      <View style={styles.button2}>
                        <View style={styles.textview}>
                          <Text
                            style={[styles.textStyle2, {fontFamily: 'Roboto'}]}>
                            {'Semua Status'}
                          </Text>
                        </View>
                      </View>
                    </TouchableHighlight>
                    {statusTransaction.map(item => {
                      return (
                        <TouchableHighlight
                          key={item.id}
                          onPress={() =>
                            this.handleStatusChange({
                              title: item.title,
                              value: item.value,
                            })
                          }>
                          <View style={styles.button2}>
                            <View style={styles.textview}>
                              <Text style={styles.textStyle2}>
                                {item.title}
                              </Text>
                            </View>
                          </View>
                        </TouchableHighlight>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>
            </ScrollView>
          </Modal>
        </View>

        {/* modal tanggal */}
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleTanggal}
            onRequestClose={() => {
              this.setModalVisibleTanggal(!modalVisibleTanggal);
            }}>
            <View style={styles.centeredView}>
              <View style={[styles.modalView, {height: hp('70%')}]}>
                <TouchableHighlight
                  onPress={() =>
                    this.setModalVisibleTanggal(!modalVisibleTanggal)
                  }
                  underlayColor="#DDDDDD"
                  activeOpacity={0.6}>
                  <View style={styles.button}>
                    <IconClose
                      fill={'white'}
                      width={wp('4%')}
                      height={hp('4%')}
                    />
                    <Text style={styles.textStyle}>
                      {'Pilih periode tanggal'}
                    </Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight
                  onPress={() =>
                    this.handleDateChange({
                      title: 'Semua Tanggal',
                      value: '',
                    })
                  }>
                  <View style={styles.button2}>
                    <View style={styles.textview}>
                      <Text style={[styles.textStyle2, {fontFamily: 'Roboto'}]}>
                        {'Semua Tanggal'}
                      </Text>
                    </View>
                  </View>
                </TouchableHighlight>
                {dateTransaction.map(item => {
                  return (
                    <TouchableHighlight
                      key={item.id}
                      onPress={() =>
                        this.handleDateChange({
                          title: item.title,
                          value: item.value,
                        })
                      }>
                      <View style={styles.button2}>
                        <View style={styles.textview}>
                          <Text style={styles.textStyle2}>{item.title}</Text>
                        </View>
                      </View>
                    </TouchableHighlight>
                  );
                })}
                <TouchableHighlight
                  onPress={() => this.setState({showDatePicker: true})}>
                  <View style={styles.button2}>
                    <View style={styles.textview}>
                      <Text style={styles.textStyle2}>
                        {'Pilih periode tanggal'}
                      </Text>
                    </View>
                  </View>
                </TouchableHighlight>
                <DatePicker
                  isVisible={this.state.showDatePicker}
                  mode={'range'}
                  onCancel={() => this.setState({showDatePicker: false})}
                  onConfirm={this.onConfirm}
                  onBackButtonPress={() =>
                    this.setState({showDatePicker: false})
                  }
                />
              </View>
            </View>
          </Modal>
        </View>
        <BottomNavigation
          navigation={this.props.navigation}
          nameRoute="Pembayaran"
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
  dataUser: state.LoginReducer.dataUser,
  shop: state.ShoppingCartReducer.shop,
});

const mapDispatchToProps = dispatch => {
  return {
    orderAct: (value, tipe) => {
      dispatch(OrderAction(value, tipe));
    },
    rateAct: (value, tipe) => {
      dispatch(RatingAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListDataPayment);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: wp('5%'),
  },
  containerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: hp('8%'),
    backgroundColor: 'white',
    borderBottomWidth: 4,
    borderColor: '#ddd',
    marginBottom: wp('3%'),
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
    fontFamily: 'Lato-Medium',
    fontSize: hp('2.4%'),
    paddingLeft: wp('5%'),
  },
  buttonHeader: {
    flexDirection: 'row',
    paddingHorizontal: wp('5%'),
  },
  searchSection: {
    // flex: 1,
    paddingTop:hp('2%'),
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
    width: wp('90%'),
    height: hp('6%'),
    paddingLeft: wp('5%'),
    paddingRight: wp('15%'),
    borderRadius: hp('1.5%'),
    borderColor: '#DCDCDC',
  },
  search: {
    marginTop:hp('2%'),
    position: 'absolute',
    top: hp('0%'),
    right: wp('8%'),
  },
  container2: {
    flexDirection: 'row',
    marginLeft: wp('4%'),
    height: hp('5%'),
    backgroundColor: 'white',
    alignItems: 'center',
    marginBottom: wp('4%'),
  },
  position1: {
    flexDirection: 'column',
    marginBottom: hp('2%'),
    backgroundColor: '#F9F9F9',
  },
  position2: {
    flexDirection: 'row',
    marginBottom: hp('0.5%'),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: hp('1.75%'),
    fontFamily: 'Lato-Regular',
    textAlign: 'auto',
    // width: wp('60%'),
    // marginTop: wp('2%'),
  },
  imageStyle: {
    height: wp('18%'),
    width: wp('18%'),
    // backgroundColor: '#F9F9F9',
    borderRadius: Size(10),
    marginLeft: wp('1%'),
  },
  button1: {
    marginTop: hp('2.5%'),
    backgroundColor: '#529F45',
    borderRadius: Size(10),
    width: wp('30%'),
    height: hp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStatus: {
    // minHeight: hp('4%'),
    padding: 4,
    // width: wp('30%'),
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: hp('1%'),
    paddingLeft: 10,
    paddingRight: 10,
  },
  textEdit: {
    textAlign: 'center',
    color: '#fff',
    fontSize: hp('1.6%'),
    fontFamily: 'Lato-Regular',
  },
  textposition: {
    flex: 1,
    paddingHorizontal: 10,
  },
  containerInput: {
    // overflow: 'hidden',
    paddingTop: wp('1%'),
    // paddingHorizontal: wp('2%'),
  },
  buttonStatus: {
    flexDirection: 'row',
    height: hp('5.5%'),
    width: wp('42.5%'),
    borderRadius: wp('1%'),
    borderWidth: 1,
    borderColor: '#ddd',
    // alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
    marginTop: wp('2%'),
    backgroundColor: '#fff',
    elevation: 2,
  },
  centeredView: {
    justifyContent: 'center',
    backgroundColor: '#rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: wp('100%'),
    marginTop: hp('35%'),
    backgroundColor: '#FFFFFF',
    borderRadius: Size(10),
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('8%'),
    backgroundColor: '#529F45',
    width: wp('100%'),
    justifyContent: 'flex-start',
    borderRadius: Size(10),
    paddingLeft: wp('5%'),
  },
  button2: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('8%'),
    backgroundColor: '#FFFFFF',
    width: wp('100%'),
    alignItems: 'flex-start',
    paddingLeft: wp('5%'),
  },
  textStyle: {
    color: 'white',
    fontFamily: 'Lato-Medium',
    fontSize: hp('1.8%'),
    paddingLeft: wp('2%'),
  },
  textStyle2: {
    color: 'black',
    fontFamily: 'Lato-Regular',
    fontSize: hp('1.6%'),
    textAlign: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textview: {
    flexDirection: 'row',
  },
  textposition2: {
    marginTop: hp('2.5%'),
    width: wp('15%'),
    height: hp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp('0%'),
  },
  belanjaButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#529F45',
    height: hp('5%'),
    borderRadius: Size(10),
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

  loadingApi: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    width: wp('100%'),
    marginTop: hp('20%'),
    // height: hp('100%'),
    // position: 'absolute',
    // top:hp('-50%')
  },
});
