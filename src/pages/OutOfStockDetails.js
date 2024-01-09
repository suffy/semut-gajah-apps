import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Text,
  Alert,
  Modal,
  TextInput,
  Pressable,
} from 'react-native';
import Size from '../components/Fontresponsive';
import NumberFormat from 'react-number-format';
import {OrderAction} from '../redux/Action';
import CONFIG from '../constants/config';
import moment from 'moment';
import axios from 'axios';
import IconOffline from '../assets/icons/NetInfo.svg';
import {ActivityIndicator} from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import {Card} from 'react-native-elements';
import Storage from '@react-native-async-storage/async-storage';
import IconBack from '../assets/icons/backArrow.svg';
import ModalAlert from '../components/ModalAlert';
import DummyImage from '../assets/icons/IconLogo.svg';
import Snackbar from 'react-native-snackbar';
import ModalTracking from '../components/ModalTracking';
import Header from '../components/Header';
function LoadingApi() {
  return (
    <View style={styles.loadingApi}>
      <ActivityIndicator animating size="small" color="#529F45" />
    </View>
  );
}
let example = [
  {id: 1, name: 'Produk A', qty: 4, harga: '2000', total: '8000'},
  {id: 2, name: 'Produk B', qty: 3, harga: '2000', total: '6000'},
  {id: 3, name: 'Produk C', qty: 5, harga: '2000', total: '10000'},
  {id: 4, name: 'Produk D', qty: 2, harga: '2000', total: '4000'},
];
let example2 = [
  {id: 1, name: 'Produk A', qty: 2, harga: '2000', total: '4000'},
  {id: 3, name: 'Produk C', qty: 3, harga: '2000', total: '6000'},
];

export class OutOfStockDetails extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      loadingApi: false,
      buttonDisabled: false,
      buttonDisabled2: false,
      modalVisible: false,
      notes: '',
      alertData: '',
      modalAlert: false,
      order: this.props?.order,
      modalTracking: false,
      dataTracking: {
        village: null,
        districts: null,
        city: null,
        province: null,
        nations: null,
      },
    };
  }
  postCancelOrder = async () => {
    if (!this.state.notes.trim()) {
      this.setState({
        alertData: 'Harap masukkan alesan kamu',
        modalAlert: !this.state.modalAlert,
      });
    } else if (this.state.notes.length < 8) {
      this.setState({
        alertData: 'Alasan pembatalan minimal 8 huruf',
        modalAlert: !this.state.modalAlert,
      });
    } else {
      try {
        let response = await axios({
          method: 'post',
          headers: {Authorization: `Bearer ${this.props.token}`},
          data: {notes: this.state.notes},
          url: `${CONFIG.BASE_URL}/api/orders/cancel/${this.state.order.id}`,
        });
        const data = response.data;
        console.log('data', data);
        if (data !== '' && data['success'] == true) {
          this.setState({
            buttonDisabled: false,
            modalVisible: !this.state.modalVisible,
          });
          this.props.navigation.goBack();
        } else {
          this.setState({
            alertData: 'Gagal membatalkan pesanan',
            modalAlert: !this.state.modalAlert,
          });
          this.setState({buttonDisabled: false});
          // console.log('Gagal membatalkan pesanan===>', data);
        }
      } catch (error) {
        this.setState({buttonDisabled: false});
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

  postCompleteOrder = async () => {
    try {
      let response = await axios.post(
        `${CONFIG.BASE_URL}/api/orders/complete/${this.state.order.id}`,
        {},
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      let data = response.data;
      if (data !== '' && data['success'] == true) {
        this.props.navigation.goBack();
        this.setState({buttonDisabled2: false});
      } else {
        this.setState({
          alertData: 'Gagal menyelesaikan order',
          modalAlert: !this.state.modalAlert,
        });
        this.setState({buttonDisabled2: false});
        // console.log('Gagal menyelesaikan order===>', data);
      }
    } catch (error) {
      this.setState({buttonDisabled2: false});
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

  UNSAFE_componentWillMount = () => {
    // lor(this);
  };

  componentWillUnmount() {
    // rol();
    clearInterval(this.interval);
  }

  componentDidUpdate() {
    this._isMounted = true;
    if (this.state.loadingApi) {
      this.interval = setInterval(
        () => this.setState({loadingApi: false}),
        10000,
      );
    }
  }
  componentDidMount = async () => {
    if (this.props.route?.params?.id?.order_id != undefined) {
      this._isMounted = true;
      this.getData();
    }
  };
  getData = async () => {
    try {
      let response = await axios.get(
        `${CONFIG.BASE_URL}/api/transactions/${this.props.route?.params?.id?.order_id}`,
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      const data = response.data;
      // console.log("Data response "+ JSON.stringify(data.data));
      if (data['success'] === true) {
        this._isMounted && this.setState({order: data.data});
      } else {
        console.log('data false');
      }
    } catch (err) {
      console.log('err 222 ' + err);
    }
  };
  getDetails = async () => {
    console.log('Invoice ' + this.state.order.invoice);
    try {
      let response = await axios({
        method: 'GET',
        url: `${CONFIG.BASE_URL}/api/orders/status?invoice=${this.state.order.invoice}`,
        headers: {Authorization: `Bearer ${this.props.token}`},
      });
      const data = response.data;
      if (data['success'] == true) {
        // this.props.orderAct(data.data, 'order');
        this.setState({loadingApi: false});
      } else {
        this.setState({loadingApi: false});
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
        'Cek Error======================== 231',
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

  getTracking = async () => {
    this._isMounted = true;
    try {
      let response = await axios({
        method: 'GET',
        url: `${CONFIG.BASE_URL}/api/delivery`,
        headers: {Authorization: `Bearer ${this.props.token}`},
      });
      const data = response.data;
      if (data['success'] === true) {
        this._isMounted &&
          this.setState(prevState => ({
            dataTracking: {
              ...prevState.dataTracking,
              village: data.data.village,
              districts: data.data.districts,
              city: data.data.city,
              province: data.data.province,
              nations: data.data.nations,
            },
          }));
        console.log('Data tracking ' + JSON.stringify(data.data));
      } else {
        console.log(
          'Data tracking tidak ada ' + JSON.stringify(this.state.dataTracking),
        );
      }
    } catch (error) {
      console.log('Error: ' + error);
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
  showModalTracking = () => {
    this.setState({modalTracking: true});
  };
  getCloseModalTracking = () => {
    this.setState({modalTracking: !this.state.modalTracking});
  };
  render() {
    const {order} = this.state;
    const {loadingApi, buttonDisabled, buttonDisabled2, dataTracking} =
      this.state;
    console.log('order ' + JSON.stringify(order));
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <ModalAlert
          modalAlert={this.state.modalAlert}
          alert={this.state.alertData}
          getCloseAlertModal={() => this.getCloseAlertModal()}
        />
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({modalVisible: !this.state.modalVisible});
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                {'Apakah anda yakin membatalkan pesanan?'}
              </Text>
              <TextInput
                autoCapitalize="none"
                style={{
                  borderColor: '#fff',
                  borderWidth: 1,
                  borderColor: '#C4C4C4',
                  borderRadius: wp('1%'),
                  marginBottom: wp('3%'),
                  paddingHorizontal: wp('3%'),
                  width: wp('80%'),
                }}
                underlineColorAndroid="transparent"
                // numberOfLines={10}
                multiline={true}
                placeholder="Tuliskan alasanmu disni"
                placeholderTextColor="#A4A4A4"
                onChangeText={value => {
                  this.setState({notes: value});
                }}>
                {this.props.item?.description}
              </TextInput>
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
                    this.setState({
                      modalVisible: !this.state.modalVisible,
                      buttonDisabled: false,
                    })
                  }>
                  <Text style={[styles.textStyle, {color: '#000'}]}>
                    {'Lewati'}
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.buttonToKeranjang,
                    {
                      marginLeft: wp('1%'),
                    },
                  ]}
                  onPress={() => this.postCancelOrder()}>
                  <Text style={styles.textStyle}>{'Simpan dan lanjutkan'}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
        <ModalTracking
          modalTracking={this.state.modalTracking}
          titleModal={
            dataTracking.village !== null
              ? 'Pesanan Anda Berada di Daerah'
              : 'Pesanan Tidak Dapat Dilacak'
          }
          btnClose={true}
          getCloseTrackingModal={() => this.getCloseModalTracking()}
          dataTracking={
            dataTracking.village !== null
              ? 'Desa ' +
                dataTracking.village +
                ', Kecamatan ' +
                dataTracking.districts +
                ', Kota ' +
                dataTracking.city +
                ', Provinsi ' +
                dataTracking.province
              : null
          }
        />
        <Header
        title={"Detail Pesanan"}
        navigation={this.props.navigation}
        />
        {loadingApi || order == undefined ? (
          <LoadingApi />
        ) : (
          <ScrollView
            contentContainerStyle={{
              paddingLeft: wp('5%'),
              paddingRight: wp('5%'),
              // paddingBottom: wp('5%'),
            }}
            style={{flex: 1, backgroundColor: 'white'}}
            showsVerticalScrollIndicator={false}>
            <View
              style={{
                elevation: 10,
                paddingHorizontal: wp('5%'),
                marginHorizontal: wp('-5%'),
                backgroundColor: 'white',
                borderBottomWidth: 1,
                borderColor: '#ddd',
                paddingVertical: wp('2%'),
              }}>
              <View
                style={[
                  styles.position2,
                  {
                    marginBottom: wp('2%'),
                  },
                ]}>
                <Text style={[styles.textEdit2, {color: '#777'}]}>
                  {'Status Pesanan '}
                </Text>
                {/*ganti textStatus  */}
                {order?.status == 1 && order?.status_faktur == 'F' ? (
                  <Text style={[styles.textEdit, {textAlign: 'right'}]}>
                    {'Transaksi baru'}
                  </Text>
                ) : null}
                {order?.status == 2 && order?.status_faktur == 'F' ? (
                  <Text style={[styles.textEdit, {textAlign: 'right'}]}>
                    {'Transaksi terkonfirmasi'}
                  </Text>
                ) : null}
                {order?.status == 3 && order?.status_faktur == 'F' ? (
                  <Text style={[styles.textEdit, {textAlign: 'right'}]}>
                    {'Barang Diproses'}
                  </Text>
                ) : null}
                {order?.status == 4 && order?.status_faktur == 'F' ? (
                  <Text style={[styles.textEdit, {textAlign: 'right'}]}>
                    {'Selesai'}
                  </Text>
                ) : null}
                {order?.status == 10 && order?.status_faktur == 'F' ? (
                  <Text style={[styles.textEdit, {textAlign: 'right'}]}>
                    {'Batal'}
                  </Text>
                ) : null}
                {order?.status == 10 && order?.status_faktur == 'R' ? (
                  <Text style={[styles.textEdit, {textAlign: 'right'}]}>
                    {'Retur Barang'}
                  </Text>
                ) : order?.status == 10 && order?.status_faktur == 'Redeem' ? (
                  <Text style={[styles.textEdit, {textAlign: 'right'}]}>
                    {'Redeem'}
                  </Text>
                ) : null}
              </View>
              <Card.Divider />
              {order?.invoice != '' ? (
                <View>
                  <View
                    style={[
                      styles.position2,
                      {
                        marginTop: wp('0%'),
                        marginBottom: wp('2%'),
                      },
                    ]}>
                    <Text style={[styles.textEdit2, {color: '#777'}]}>
                      Nomor Invoice
                    </Text>
                    <Text style={[styles.textEdit]}>
                      {order?.invoice || 'Nomor'}
                    </Text>
                  </View>
                  <Card.Divider />
                </View>
              ) : null}
              <View
                style={[
                  styles.position2,
                  {
                    marginTop: wp('0%'),
                    marginBottom: wp('2%'),
                  },
                ]}>
                <Text style={[styles.textEdit2, {color: '#777'}]}>
                  Tanggal Pembelian
                </Text>

                <Text style={[styles.textEdit]}>
                  {moment(order?.created_at).format('LLL') || '0'}
                </Text>
              </View>
            </View>
            {/* <Card.Divider /> */}
            <View
              style={{
                elevation: 10,
                paddingHorizontal: wp('5%'),
                marginHorizontal: wp('-5%'),
                backgroundColor: 'white',
                borderWidth: 1,
                borderColor: '#ddd',
                marginTop: wp('2%'),
                paddingVertical: wp('2%'),
              }}>
              <Text style={[styles.title]}>Detail Produk</Text>
              {order?.data_item.map((item, index) => {
                if (
                  order?.data_cancel?.find(arr => arr.id === item.id)?.id ===
                  item.id
                ) {
                  const data = order?.data_cancel?.find(
                    arr => arr.id === item.id,
                  );
                  const success = order?.data_success?.find(
                    arr => arr.id === item.id,
                  );
                  return (
                    <View key={index}>
                      <Card
                        containerStyle={{
                          marginLeft: wp('0%'),
                          borderRadius: wp('3%'),
                          marginBottom: wp('1%'),
                          width: wp('90%'),
                          borderRadius: wp('2%'),
                          borderColor: '#ddd',
                          borderWidth: 1,
                          paddingHorizontal: 5,
                          paddingVertical: 10,
                          elevation: 5,
                          // backgroundColor:'red',
                        }}>
                        <View
                          style={[
                            styles.position2,
                            {
                              justifyContent: 'flex-start',
                            },
                          ]}>
                          <View>
                            {item?.product?.image ? (
                              <Image
                                resizeMode="center"
                                source={{
                                  uri: CONFIG.BASE_URL + item?.product?.image,
                                }}
                                style={styles.imageStyle}
                              />
                            ) : (
                              <DummyImage style={styles.imageStyle} />
                            )}
                          </View>
                          <View style={{marginLeft: wp('2%')}}>
                            <Text
                              numberOfLines={3}
                              multiline
                              style={[styles.title, {width: wp('62%')}]}>
                              {item.product?.name}
                            </Text>
                            <Text
                              style={{
                                color: '#777',
                                fontSize: hp('1.6%'),
                                fontFamily: 'Lato-Regular',
                                marginTop: wp('1%'),
                              }}>
                              {item?.qty}
                              {' x '}
                              {order?.status_faktur == 'Redeem' ? (
                                <NumberFormat
                                  value={Math.round(item?.price_apps) ?? '0'}
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
                                        fontSize: hp('1.8%'),
                                        fontFamily: 'Lato-Regular',
                                        marginTop: wp('1%'),
                                      }}>
                                      {value + ' = ' || 0}
                                    </Text>
                                  )}
                                />
                              ) : (
                                <>
                                  {item?.half ? (
                                    <NumberFormat
                                      value={
                                        Math.round(item?.price_apps) ?? '0'
                                      }
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
                                          {value + ' = ' || 0}
                                        </Text>
                                      )}
                                    />
                                  ) : (
                                    <NumberFormat
                                      value={
                                        Math.round(item?.price_apps) ?? '0'
                                      }
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
                                          {value + ' = ' || 0}
                                        </Text>
                                      )}
                                    />
                                  )}
                                </>
                              )}
                              {order?.status_faktur == 'Redeem' ? (
                                <NumberFormat
                                  value={Math.round(item?.total_price) ?? '0'}
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
                                        fontSize: hp('1.8%'),
                                        fontFamily: 'Lato-Regular',
                                        marginTop: wp('1%'),
                                      }}>
                                      {value || 0}
                                    </Text>
                                  )}
                                />
                              ) : (
                                <>
                                  {item?.half ? (
                                    <NumberFormat
                                      value={
                                        Math.round(item?.total_price) ?? '0'
                                      }
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
                                          {value || 0}
                                        </Text>
                                      )}
                                    />
                                  ) : (
                                    <NumberFormat
                                      value={
                                        Math.round(item?.total_price) ?? '0'
                                      }
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
                                          {value || 0}
                                        </Text>
                                      )}
                                    />
                                  )}
                                </>
                              )}
                              {item.half ? (
                                <Text
                                  numberOfLines={1}
                                  style={{
                                    fontSize: hp('1.8%'),
                                    fontFamily: 'Lato-Regular',
                                    marginTop: wp('1%'),
                                    color: '#17a2b8',
                                  }}>
                                  {' ( '}
                                  {item?.qty_konversi}{' '}
                                  {item?.small_unit.charAt(0) +
                                    item?.small_unit.slice(1).toLowerCase()}
                                  {' )'}
                                </Text>
                              ) : null}
                            </Text>
                          </View>
                        </View>
                        <Card.Divider
                          style={{
                            marginTop: wp('1.5%'),
                            marginBottom: wp('1.5%'),
                            borderWidth: 1,
                            borderColor: '#ddd',
                          }}
                        />
                        <View
                          style={[
                            styles.position2,
                            {
                              justifyContent: 'flex-start',
                            },
                          ]}>
                          <View>
                            {item?.product?.image ? (
                              <Image
                                resizeMode="center"
                                source={{
                                  uri: CONFIG.BASE_URL + item?.product?.image,
                                }}
                                style={styles.imageStyle}
                              />
                            ) : (
                              <DummyImage style={styles.imageStyle} />
                            )}
                          </View>
                          <View style={{marginLeft: wp('2%')}}>
                            <Text
                              numberOfLines={3}
                              multiline
                              style={[styles.title, {width: wp('62%')}]}>
                              {data?.product.name}
                            </Text>
                            <Text
                              style={[
                                {
                                  color: '#000',
                                  fontSize: hp('1.6%'),
                                  fontFamily: 'Lato-Regular',
                                  marginTop: wp('1%'),
                                },
                              ]}>
                              Stock Kosong {Math.round(data.qty_cancel)}
                            </Text>
                            <Text
                              style={{
                                color: '#777',
                                fontSize: hp('1.6%'),
                                fontFamily: 'Lato-Regular',
                                marginTop: wp('1%'),
                              }}>
                              {data?.qty_cancel}
                              {' x '}
                              {order?.status_faktur == 'Redeem' ? (
                                <NumberFormat
                                  value={Math.round(data?.price_apps) ?? '0'}
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
                                        fontSize: hp('1.8%'),
                                        fontFamily: 'Lato-Regular',
                                        marginTop: wp('1%'),
                                      }}>
                                      {value + ' = ' || 0}
                                    </Text>
                                  )}
                                />
                              ) : (
                                <>
                                  {item?.half ? (
                                    <NumberFormat
                                      value={
                                        Math.round(data?.price_apps) ?? '0'
                                      }
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
                                          {value + ' = ' || 0}
                                        </Text>
                                      )}
                                    />
                                  ) : (
                                    <NumberFormat
                                      value={
                                        Math.round(data?.price_apps) ?? '0'
                                      }
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
                                          {value + ' = ' || 0}
                                        </Text>
                                      )}
                                    />
                                  )}
                                </>
                              )}
                              {order?.status_faktur == 'Redeem' ? (
                                <NumberFormat
                                  value={
                                    Math.round(data?.total_price_cancel) ?? '0'
                                  }
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
                                        fontSize: hp('1.8%'),
                                        fontFamily: 'Lato-Regular',
                                        marginTop: wp('1%'),
                                      }}>
                                      {' - ' + value || 0}
                                    </Text>
                                  )}
                                />
                              ) : (
                                <>
                                  {item?.half ? (
                                    <NumberFormat
                                      value={
                                        Math.round(data?.total_price_cancel) ??
                                        '0'
                                      }
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
                                          {' - ' + value || 0}
                                        </Text>
                                      )}
                                    />
                                  ) : (
                                    <NumberFormat
                                      value={
                                        Math.round(data?.total_price_cancel) ??
                                        '0'
                                      }
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
                                          {' - ' + value || 0}
                                        </Text>
                                      )}
                                    />
                                  )}
                                </>
                              )}
                              {item.half ? (
                                <Text
                                  numberOfLines={1}
                                  style={{
                                    fontSize: hp('1.8%'),
                                    fontFamily: 'Lato-Regular',
                                    marginTop: wp('1%'),
                                    color: '#17a2b8',
                                  }}>
                                  {' ( '}
                                  {item?.qty_konversi}{' '}
                                  {item?.small_unit.charAt(0) +
                                    item?.small_unit.slice(1).toLowerCase()}
                                  {' )'}
                                </Text>
                              ) : null}
                            </Text>
                          </View>
                        </View>
                        <Card.Divider
                          style={{
                            marginTop: wp('2%'),
                            borderWidth: 1,
                            borderColor: '#ddd',
                          }}
                        />
                        <View style={styles.hargaPerProduk}>
                          <View
                            style={{width: wp('40%'), marginLeft: wp('2%')}}>
                            <Text
                              style={{
                                fontSize: hp('1.8%'),
                                fontFamily: 'Lato-Regular',
                                color: '#777',
                              }}>
                              {order?.status_faktur == 'Redeem'
                                ? 'Total Poin'
                                : 'Total Harga Setelah Diskon'}
                            </Text>
                          </View>
                          <Text style={styles.textCatatanTitikDua}>{':'}</Text>
                          {order?.status_faktur == 'Redeem' ? (
                            <NumberFormat
                              value={Math.round(success?.total_price_update)}
                              displayType={'text'}
                              thousandSeparator={true}
                              // prefix={'Rp '}
                              suffix={' poin'}
                              // decimalScale={2}
                              fixedDecimalScale={true}
                              renderText={value => (
                                <Text
                                  numberOfLines={1}
                                  style={[
                                    styles.title,
                                    {
                                      marginLeft: wp('2%'),
                                      // marginBottom: wp('1%'),
                                    },
                                  ]}>
                                  {value}
                                </Text>
                              )}
                            />
                          ) : (
                            <NumberFormat
                              value={Math.round(success?.total_price_update)}
                              displayType={'text'}
                              thousandSeparator={true}
                              prefix={'Rp '}
                              // decimalScale={2}
                              fixedDecimalScale={true}
                              renderText={value => (
                                <Text
                                  numberOfLines={1}
                                  style={[
                                    styles.title,
                                    {
                                      marginLeft: wp('2%'),
                                      // marginBottom: wp('1%'),
                                    },
                                  ]}>
                                  {value}
                                </Text>
                              )}
                            />
                          )}
                        </View>
                        {item.notes != null && (
                          <View style={styles.posisiCatatan}>
                            <View style={{width: wp('18%')}}>
                              <Text style={styles.textCatatan}>
                                {'Catatan'}
                              </Text>
                            </View>
                            <Text style={styles.textCatatanTitikDua}>
                              {':'}
                            </Text>
                            <View style={{width: wp('58%')}}>
                              <Text style={styles.textIsiCatatan}>
                                {item.notes}
                              </Text>
                            </View>
                          </View>
                        )}
                      </Card>
                    </View>
                  );
                } else {
                  return (
                    <Card
                      key={index}
                      containerStyle={{
                        marginLeft: wp('0%'),
                        borderRadius: wp('3%'),
                        marginBottom: wp('1%'),
                        width: wp('90%'),
                        borderRadius: wp('2%'),
                        borderColor: '#ddd',
                        borderWidth: 1,
                        paddingHorizontal: 5,
                        paddingVertical: 10,
                        elevation: 5,
                      }}>
                      <View
                        style={[
                          styles.position2,
                          {
                            justifyContent: 'flex-start',
                          },
                        ]}>
                        <View>
                          {item?.product?.image ? (
                            <Image
                              resizeMode="center"
                              source={{
                                uri: CONFIG.BASE_URL + item?.product?.image,
                              }}
                              style={styles.imageStyle}
                            />
                          ) : (
                            <DummyImage style={styles.imageStyle} />
                          )}
                        </View>
                        <View style={{marginLeft: wp('2%')}}>
                          <Text
                            numberOfLines={3}
                            multiline
                            style={[styles.title, {width: wp('62%')}]}>
                            {item?.name}
                          </Text>
                          <Text
                            style={{
                              color: '#777',
                              fontSize: hp('1.6%'),
                              fontFamily: 'Lato-Regular',
                              marginTop: wp('1%'),
                            }}>
                            {item?.qty}
                            {' x '}
                            {order?.status_faktur == 'Redeem' ? (
                              <NumberFormat
                                value={Math.round(item?.harga) ?? '0'}
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
                                      fontSize: hp('1.8%'),
                                      fontFamily: 'Lato-Regular',
                                      marginTop: wp('1%'),
                                    }}>
                                    {value || 0}
                                  </Text>
                                )}
                              />
                            ) : (
                              <>
                                {item?.half ? (
                                  <NumberFormat
                                    value={Math.round(item?.harga) ?? '0'}
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
                                        {value || 0}
                                      </Text>
                                    )}
                                  />
                                ) : (
                                  <NumberFormat
                                    value={Math.round(item?.harga) ?? '0'}
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
                                        {value || 0}
                                      </Text>
                                    )}
                                  />
                                )}
                              </>
                            )}
                            {/* {item.half ? (
                              <Text
                                numberOfLines={1}
                                style={{
                                  fontSize: hp('1.8%'),
                                  fontFamily: 'Lato-Regular',
                                  marginTop: wp('1%'),
                                  color: '#17a2b8',
                                }}>
                                {' ( '}
                                {item?.qty_konversi}{' '}
                                {item?.small_unit.charAt(0) +
                                  item?.small_unit.slice(1).toLowerCase()}
                                {' )'}
                              </Text>
                            ) : null} */}
                          </Text>
                        </View>
                      </View>
                      <Card.Divider
                        style={{
                          marginTop: wp('2%'),
                          borderWidth: 1,
                          borderColor: '#ddd',
                        }}
                      />
                      <View style={styles.hargaPerProduk}>
                        <View style={{width: wp('40%'), marginLeft: wp('2%')}}>
                          <Text
                            style={{
                              fontSize: hp('1.8%'),
                              fontFamily: 'Lato-Regular',
                              color: '#777',
                            }}>
                            {order?.status_faktur == 'Redeem'
                              ? 'Total Poin'
                              : 'Total Harga Setelah Diskon'}
                          </Text>
                        </View>
                        <Text style={styles.textCatatanTitikDua}>{':'}</Text>
                        {order?.status_faktur == 'Redeem' ? (
                          <NumberFormat
                            value={Math.round(item?.total)}
                            displayType={'text'}
                            thousandSeparator={true}
                            // prefix={'Rp '}
                            suffix={' poin'}
                            // decimalScale={2}
                            fixedDecimalScale={true}
                            renderText={value => (
                              <Text
                                numberOfLines={1}
                                style={[
                                  styles.title,
                                  {
                                    marginLeft: wp('2%'),
                                    // marginBottom: wp('1%'),
                                  },
                                ]}>
                                {value}
                              </Text>
                            )}
                          />
                        ) : (
                          <NumberFormat
                            value={Math.round(item?.total)}
                            displayType={'text'}
                            thousandSeparator={true}
                            prefix={'Rp '}
                            // decimalScale={2}
                            fixedDecimalScale={true}
                            renderText={value => (
                              <Text
                                numberOfLines={1}
                                style={[
                                  styles.title,
                                  {
                                    marginLeft: wp('2%'),
                                    // marginBottom: wp('1%'),
                                  },
                                ]}>
                                {value}
                              </Text>
                            )}
                          />
                        )}
                      </View>
                      {/* <View style={styles.posisiCatatan}>
                        <Text style={styles.textCatatan}>{'Catatan'}</Text>
                        <Text
                          style={[
                            styles.textCatatanTitikDua,
                            {marginLeft: wp('13%')},
                          ]}>
                          {':'}
                        </Text>
                        <Text style={styles.textIsiCatatan}>{'TESTTTTTTTTTTTTTTT'}</Text>
                      </View> */}
                      {item.notes != null && (
                        <View style={styles.posisiCatatan}>
                          <View style={{width: wp('18%')}}>
                            <Text style={styles.textCatatan}>{'Catatan'}</Text>
                          </View>
                          <Text style={styles.textCatatanTitikDua}>{':'}</Text>
                          <View style={{width: wp('58%')}}>
                            <Text style={styles.textIsiCatatan}>
                              {item.notes}
                            </Text>
                          </View>
                        </View>
                      )}
                    </Card>
                  );
                }
              })}
            </View>
            <View
              style={{
                elevation: 10,
                paddingHorizontal: wp('5%'),
                marginHorizontal: wp('-5%'),
                backgroundColor: 'white',
                borderWidth: 1,
                borderColor: '#ddd',
                marginTop: wp('2%'),
                paddingVertical: wp('2%'),
              }}>
              <Text
                style={[
                  styles.title,
                  {
                    marginLeft: wp('0%'),
                    marginBottom: wp('2%'),
                  },
                ]}>
                Info Pengiriman
              </Text>
              <View
                style={[
                  styles.position2,
                  {
                    marginTop: wp('0%'),
                    marginBottom: wp('2%'),
                  },
                ]}>
                <Text style={[styles.textEdit2, {color: '#777'}]}>Kurir</Text>
                {order?.delivery_service == 'bebasOngkir' ? (
                  <Text style={styles.textEdit}>Bebas Ongkir</Text>
                ) : null}
                {/* <Text numberOfLines={3} multiline style={[styles.title, { marginLeft: wp('-%'5), width: wp('5%'5), height: wp('1%'0) }]}>(Estimasi tiba 20-30 Desember)</Text> */}
              </View>
              {order?.delivery_track != null ? (
                <>
                  <Card.Divider />
                  <View
                    style={[
                      styles.position2,
                      {
                        marginTop: wp('0%'),
                        marginBottom: wp('2%'),
                      },
                    ]}>
                    <Text style={[styles.textEdit2, {color: '#777'}]}>
                      No Resi
                    </Text>
                    <Text style={styles.textEdit}>{order?.delivery_track}</Text>
                  </View>
                </>
              ) : null}
              <Card.Divider />
              <View
                style={[
                  styles.position2,
                  {
                    marginTop: wp('0%'),
                    marginBottom: hp('2%'),
                  },
                ]}>
                <Text style={[styles.textEdit2, {color: '#777'}]}>Alamat</Text>
                {order?.kelurahan ? (
                  <Text
                    // numberOfLines={8}
                    // multiline
                    style={[
                      styles.textEdit,
                      {
                        flex: 1,
                      },
                    ]}>
                    {order?.address}
                    {', '}
                    {order?.kelurahan}
                    {', '}
                    {order?.kecamatan}
                    {', '}
                    {order?.kota}
                    {', '}
                    {order?.provinsi}
                    {', '}
                    {order?.kode_pos}
                  </Text>
                ) : (
                  <Text
                    // numberOfLines={8}
                    // multiline
                    style={[
                      styles.textEdit,
                      {
                        flex: 1,
                      },
                    ]}>
                    {order?.address}
                  </Text>
                )}
              </View>
              {order?.status === '3' ? (
                <View
                  style={[
                    styles.position2,
                    {
                      marginTop: wp('0%'),
                      marginBottom: hp('2%'),
                    },
                  ]}>
                  <TouchableOpacity
                    style={styles.buttonCekPengiriman}
                    onPress={() => {
                      this.getTracking();
                      this.showModalTracking();
                    }}>
                    <Text style={styles.textButton}>Tracking Pengiriman</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
            <View
              style={{
                // elevation: 2,
                paddingHorizontal: wp('5%'),
                marginHorizontal: wp('-5%'),
                backgroundColor: 'white',
                borderTopWidth: 1,
                borderColor: '#ddd',
                marginTop: wp('2%'),
                paddingTop: wp('2%'),
              }}>
              <Text
                style={[
                  styles.title,
                  {
                    marginLeft: wp('0%'),
                    marginTop: wp('0%'),
                  },
                ]}>
                Rincian Pembayaran
              </Text>
              <View
                style={[
                  styles.position2,
                  {
                    marginTop: wp('2%'),
                    marginBottom: wp('2%'),
                  },
                ]}>
                <Text style={[styles.textEdit2, {color: '#777'}]}>
                  Metode Pembayaran
                </Text>
                {order?.payment_method == 'cod' && (
                  <Text style={[styles.textEdit, {flex: 1}]}>
                    Bayar langsung di tempat (COD)
                  </Text>
                )}
                {order?.payment_method == 'tempo' && (
                  <Text style={[styles.textEdit, {flex: 1}]}>Tempo</Text>
                )}
                {order?.payment_method == 'redeem' && (
                  <Text style={[styles.textEdit, {flex: 1}]}>Redeem</Text>
                )}
                {/* {order.payment_method == 'transfer' ? (
                                        <View>
                                            <Text
                                                style={{
                                                    color: '#777',
                                                    alignSelf: 'flex-end',
                                                    marginTop: wp('0%'),
                                                    fontSize: hp('2),%'
                        fontFamily: 'Lato-Medium',
                                                    textAlign: 'right'
                                                }}>
                                                {'Transfer Manual'}
                                            </Text>
                                            <Text
                                                style={{
                                                    color: '#777',
                                                    alignSelf: 'flex-end',
                                                    marginTop: wp('0%'),
                                                    fontSize: hp('1.5%'),
                        fontFamily: 'Lato-Medium',
                                                    width: wp('6%'0),
                                                    textAlign: 'right'
                                                }} numberOfLines={3} multiline>
                                                {'0000000000 a.n Nama Pengguna Bank'}
                                            </Text>
                                        </View>
                                    ) : null} */}
              </View>
              <Card.Divider />
              {order?.payment_discount ? (
                <>
                  <View
                    style={[
                      styles.position2,
                      {
                        marginTop: wp('0%'),
                        marginBottom: wp('2%'),
                      },
                    ]}>
                    <Text style={[styles.textEdit2, {color: '#777'}]}>
                      {'Nominal Diskon'}
                    </Text>
                    {order?.payment_discount_type == 'nominal' ? (
                      <NumberFormat
                        value={Math.round(order?.payment_discount) ?? '0'}
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={'Rp '}
                        renderText={value => (
                          <Text numberOfLines={1} style={[styles.textEdit]}>
                            {value}
                          </Text>
                        )}
                      />
                    ) : (
                      <NumberFormat
                        value={Math.round(order?.payment_discount) ?? '0'}
                        displayType={'text'}
                        thousandSeparator={true}
                        suffix={' %'}
                        renderText={value => (
                          <Text numberOfLines={1} style={[styles.textEdit]}>
                            {value}
                          </Text>
                        )}
                      />
                    )}
                  </View>
                  <Card.Divider />
                </>
              ) : null}

              <View
                style={[
                  styles.position2,
                  {
                    marginTop: wp('0%'),
                    marginBottom: wp('2%'),
                  },
                ]}>
                <Text style={[styles.textEdit2, {color: '#777'}]}>
                  {order?.status_faktur == 'Redeem'
                    ? 'Total Poin'
                    : 'Total Harga'}
                </Text>
                {order?.status_faktur == 'Redeem' ? (
                  <NumberFormat
                    value={Math.round(order?.payment_total) ?? '0'}
                    displayType={'text'}
                    thousandSeparator={true}
                    // prefix={'Rp '}
                    suffix={' poin'}
                    // decimalScale={2}
                    fixedDecimalScale={true}
                    renderText={value => (
                      <Text numberOfLines={1} style={[styles.textEdit]}>
                        {value}
                      </Text>
                    )}
                  />
                ) : (
                  <NumberFormat
                    value={Math.round(order?.payment_total) ?? '0'}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'Rp '}
                    // decimalScale={2}
                    fixedDecimalScale={true}
                    renderText={value => (
                      <Text numberOfLines={1} style={[styles.textEdit]}>
                        {value}
                      </Text>
                    )}
                  />
                )}
              </View>
              <Card.Divider />

              {order?.data_promo?.map((item, index) => (
                <View key={index}>
                  {/* {item.promo_id ? (
                  <> */}
                  {item.bonus_name && (
                    <>
                      <View
                        style={[
                          styles.position2,
                          {
                            marginTop: wp('2%'),
                            marginBottom: wp('2%'),
                          },
                        ]}>
                        <Text style={[styles.textEdit2, {color: '#777'}]}>
                          {'Promo Bonus Produk'}
                        </Text>
                        <Text style={[styles.textEdit, {flex: 1}]}>
                          {item.bonus_name}
                        </Text>
                      </View>
                      <Card.Divider />
                    </>
                  )}
                  {item.disc_xtra > 0 && (
                    <>
                      <View
                        style={[
                          styles.position2,
                          {
                            marginTop: wp('2%'),
                            marginBottom: wp('2%'),
                          },
                        ]}>
                        <Text style={[styles.textEdit2, {color: '#777'}]}>
                          {'Promo Diskon'}
                        </Text>
                        <Text style={[styles.textEdit, {flex: 1}]}>
                          {item.disc_xtra}
                          {' %'}
                        </Text>
                      </View>
                      <Card.Divider />
                    </>
                  )}
                  {item.rp_xtra > 0 && (
                    <>
                      <View
                        style={[
                          styles.position2,
                          {
                            marginTop: wp('2%'),
                            marginBottom: wp('2%'),
                          },
                        ]}>
                        <Text style={[styles.textEdit2, {color: '#777'}]}>
                          {'Promo Potongan Harga'}
                        </Text>
                        <Text style={[styles.textEdit, {flex: 1}]}>
                          {item.rp_xtra}
                        </Text>
                      </View>
                      <Card.Divider />
                    </>
                  )}
                  {/* </>
                ) : null} */}
                </View>
              ))}

              {order?.point ? (
                <>
                  <View
                    style={[
                      styles.position2,
                      {
                        marginTop: wp('2%'),
                        marginBottom: wp('2%'),
                      },
                    ]}>
                    <Text style={[styles.textEdit2, {color: '#777'}]}>
                      {'Promo Bonus Poin'}
                    </Text>
                    <NumberFormat
                      value={Math.round(order?.point) ?? '0'}
                      displayType={'text'}
                      thousandSeparator={true}
                      // prefix={'Rp '}
                      suffix={' poin'}
                      // decimalScale={2}
                      fixedDecimalScale={true}
                      renderText={value => (
                        <Text numberOfLines={1} style={[styles.textEdit]}>
                          {value}
                        </Text>
                      )}
                    />
                  </View>
                  <Card.Divider />
                </>
              ) : null}

              <View
                style={[
                  styles.position2,
                  {
                    marginTop: wp('0%'),
                    marginBottom: wp('2%'),
                  },
                ]}>
                <Text style={[styles.textEdit2, {color: '#777'}]}>
                  Total Ongkos Kirim
                </Text>
                <NumberFormat
                  value={Math.round(order?.delivery_fee) ?? '0'}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={'Rp '}
                  renderText={value => (
                    <Text numberOfLines={1} style={[styles.textEdit]}>
                      {value}
                    </Text>
                  )}
                />
              </View>
              <Card.Divider />
              <View
                style={[
                  styles.position2,
                  {
                    marginTop: wp('0%'),
                    marginBottom: wp('2%'),
                  },
                ]}>
                <Text style={[styles.textEdit2, {color: '#777'}]}>
                  Total Poin Digunakan
                </Text>
                <NumberFormat
                  value={Math.round(order?.payment_point) || '0'}
                  displayType={'text'}
                  thousandSeparator={true}
                  // prefix={'Rp '}
                  renderText={value => (
                    <Text numberOfLines={1} style={[styles.textEdit]}>
                      {value} {'Poin'}
                    </Text>
                  )}
                />
              </View>
              <Card.Divider />
              <View
                style={[
                  styles.position2,
                  {
                    marginTop: wp('0%'),
                    marginBottom: wp('2%'),
                  },
                ]}>
                {order?.status_faktur == 'Redeem' ? (
                  <Text
                    style={[
                      styles.textEdit2,
                      {
                        fontSize: hp('2.3%'),
                        fontFamily: 'Lato-Regular',
                      },
                    ]}>
                    Total Pembelian
                  </Text>
                ) : (
                  <Text
                    style={[
                      styles.textEdit2,
                      {
                        fontSize: hp('2.3%'),
                        fontFamily: 'Lato-Regular',
                      },
                    ]}>
                    Total Bayar
                  </Text>
                )}

                {order?.status_faktur == 'Redeem' ? (
                  <NumberFormat
                    value={Math.round(order?.payment_final) ?? '0'}
                    displayType={'text'}
                    thousandSeparator={true}
                    // prefix={'Rp '}
                    suffix={' poin'}
                    // decimalScale={2}
                    fixedDecimalScale={true}
                    renderText={value => (
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.textEdit,
                          {color: '#529F45', fontSize: hp('2.2%')},
                        ]}>
                        {value}
                      </Text>
                    )}
                  />
                ) : (
                  <NumberFormat
                    value={Math.round(order?.payment_final) ?? '0'}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'Rp '}
                    // decimalScale={2}
                    fixedDecimalScale={true}
                    renderText={value => (
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.textEdit,
                          {color: '#529F45', fontSize: hp('2.2%')},
                        ]}>
                        {value}
                      </Text>
                    )}
                  />
                )}
              </View>
            </View>
            {order?.status == '3' && order?.status_faktur == 'F' && (
              <View style={{marginTop: wp('3%')}}>
                {buttonDisabled2 ? (
                  <TouchableOpacity
                    style={[
                      styles.buttonBatal,
                      {
                        marginBottom: wp('1%'),
                        backgroundColor: '#E07126',
                      },
                    ]}
                    onPress={() =>
                      // this.postCompleteOrder()
                      this.setState({buttonDisabled2: false})
                    }>
                    <Text style={styles.textButton}>{'Selesai'}</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.buttonBatal,
                      {
                        marginBottom: wp('1%'),
                        backgroundColor: '#529F45',
                      },
                    ]}
                    onPress={() => {
                      this.postCompleteOrder();
                      this.setState({buttonDisabled2: true});
                    }}>
                    <Text style={styles.textButton}>{'Selesai'}</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            {/* Fitur batal */}
            {/* {order?.status == '1' && order?.status_faktur == 'F' && (
              <View style={{marginTop: wp('3%')}}>
                {buttonDisabled ? (
                  <TouchableOpacity
                    style={[
                      styles.buttonBatal,
                      {
                        marginBottom: wp('1%'),
                        backgroundColor: '#E07126',
                      },
                    ]}
                    // onPress={() =>
                    //   // this.postCancelOrder();
                    //   this.setState({buttonDisabled: false})
                    // }
                  >
                    <Text style={styles.textButton}>{'Batal Transaksi'}</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.buttonBatal]}
                    onPress={() => {
                      //   this.setState({
                      //     buttonDisabled: true,
                      //     modalVisible: !this.state.modalVisible,
                      //   });
                    }}>
                    <Text style={styles.textButton}>{'Batal Transaksi'}</Text>
                  </TouchableOpacity>
                )}
              </View>
            )} */}
          </ScrollView>
        )}
        {order?.status_faktur == 'Redeem' ? null : (
          <View style={styles.buttonPosisi}>
            <TouchableOpacity
              style={styles.buttonKeranjang}
              onPress={() => {
                this.setState({loadingApi: true}, () => this.getDetails());
              }}>
              <Text style={styles.textKeranjang}>{'Check Status Pesanan'}</Text>
            </TouchableOpacity>
          </View>
        )}
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
    borderColor: '#E8E8E8',
    paddingLeft: wp('5%'),
    borderBottomWidth: 4,
    borderColor: '#ddd',
  },
  text: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('2.4%'),
    paddingLeft: wp('5%'),
  },
  position2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: hp('2%'),
    fontFamily: 'Lato-Regular',
    textAlign: 'auto',
    width: wp('60%'),
  },
  stock: {
    marginTop: hp('1%'),
    marginBottom: hp('1%'),
    fontSize: hp('2%'),
    fontFamily: 'Lato-Regular',
    // textAlign: 'auto',
    marginLeft: wp('1%'),
  },
  textEdit: {
    textAlign: 'right',
    width: wp('50%'),
    fontSize: hp('1.9%'),
    fontFamily: 'Lato-Regular',
  },
  textEdit2: {
    textAlign: 'left',
    width: wp('40%'),
    fontSize: hp('1.6%'),
    fontFamily: 'Lato-Regular',
  },
  button1: {
    width: wp('40%'),
    height: hp('5%'),
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  imageStyle: {
    height: wp('20%'),
    width: wp('20%'),
    // backgroundColor: '#F9F9F9',
    borderRadius: wp('1%'),
    // marginLeft: wp('0%'),
  },
  button2: {
    width: wp('25%'),
    height: hp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title2: {
    fontSize: hp('2%'),
    fontFamily: 'Lato-Regular',
    textAlign: 'auto',
    width: wp('60%'),
  },
  hargaPerProduk: {
    flexDirection: 'row',
  },
  posisiCatatan: {
    flexDirection: 'row',
    marginLeft: wp('2%'),
  },
  textCatatan: {
    fontSize: hp('1.6%'),
    fontFamily: 'Lato-Regular',
  },
  textCatatanTitikDua: {
    fontSize: hp('1.6%'),
    fontFamily: 'Lato-Regular',
    marginLeft: wp('8%'),
  },
  textIsiCatatan: {
    fontSize: hp('1.6%'),
    fontFamily: 'Lato-Regular',
    marginLeft: wp('2.5%'),
  },
  buttonBatal: {
    backgroundColor: '#E02626',
    borderRadius: wp('1%'),
    width: wp('92.5%'),
    height: wp('9%'),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  textButton: {
    fontSize: hp('1.8%'),
    color: '#fff',
    fontFamily: 'Lato-Regular',
    alignSelf: 'center',
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

  //Button cek SDS
  buttonPosisi: {
    marginTop: hp('2%'),
    marginBottom: hp('2%'),
    marginHorizontal: wp('3.5%'),
    alignItems: 'center',
    justifyContent: 'center',
    // width: wp('45%'),
    height: hp('5%'),
    flexDirection: 'row',
    // backgroundColor: 'red',
  },
  buttonKeranjang: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#529F45',
    borderRadius: wp('1%'),
    width: wp('93%'),
    height: hp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  textKeranjang: {
    textAlign: 'center',
    color: '#529F45',
    fontSize: hp('1.6%'),
    fontFamily: 'Lato-Medium',
  },

  // View Modal
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.9)',
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
  textStatus: {
    textAlign: 'left',
    width: wp('40%'),
    fontSize: hp('1.9%'),
    fontFamily: 'Lato-Regular',
  },

  //btnTracking
  buttonCekPengiriman: {
    backgroundColor: '#529F45',
    alignItems: 'center',
    width: '100%',
    paddingVertical: '2.5%',
    borderRadius: 5,
  },
});

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
  dataUser: state.LoginReducer.dataUser,
  order: state.OrderReducer.order,
});

const mapDispatchToProps = dispatch => {
  return {
    orderAct: (value, tipe) => {
      dispatch(OrderAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OutOfStockDetails);
