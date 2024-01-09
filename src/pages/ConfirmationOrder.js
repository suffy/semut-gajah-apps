import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Pressable,
} from 'react-native';
import {connect} from 'react-redux';
import axios from 'axios';
import NumberFormat from 'react-number-format';
import CONFIG from '../constants/config';
import IconMenu from '../assets/icons/Menu.svg';
import IconNotif from '../assets/icons/NotifAll.svg';
import {Card} from 'react-native-elements';
import {OrderAction} from '../redux/Action';
import moment from 'moment';
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
import BottomNavigation from '../components/BottomNavigation';
import DummyImage from '../assets/icons/IconLogo.svg';
import Snackbar from 'react-native-snackbar';
import Header from '../components/Header';

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

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export class ConfirmationOrder extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      notifMessage: 0,
      notifSubscribe: 0,
      notifAllOrder: 0,
      notifAllComplaint: 0,
      notifBroadcast: 0,
      modalVisibleOrder: true,
      modalVisible: false,
      notes: '',
    };
  }

  getMenu = () => {
    this.props.navigation.navigate('Profile');
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
        return count;
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
  //   this.getNotifAll();
  // };

  componentDidMount() {
    this._isMounted = true;
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.getNotifAll();
    });
  }

  componentWillUnmount() {
    // rol();
    this._isMounted = false;
    // this.focusListener();
  }

  hitungHargaBarang = () => {
    const sumTotal = (arr = []) =>
      arr.reduce((sum, {total_price}) => sum + total_price, 0);
    const total = sumTotal(this.props.paymentOrder.data_item ?? 0);
    return (
      <NumberFormat
        value={Math.round(total) ?? '0'}
        displayType={'text'}
        thousandSeparator={true}
        prefix={'Rp '}
        renderText={value => (
          <Text style={[styles.diskonText, {color: '#529F45'}]}>{value}</Text>
        )}
      />
    );
  };

  postFeedBack = async () => {
    try {
      console.log('masuk ksni', this.state.notes);
      let response = await axios({
        method: 'post',
        headers: {Authorization: `Bearer ${this.props.token}`},
        data: {message: this.state.notes},
        url: `${CONFIG.BASE_URL}/api/store/feedback`,
      });
      console.log('response==feedback', response.data);
      const data = response.data;
      if (data !== '' && data['success'] == true) {
        this.setState({modalVisible: !this.state.modalVisible});
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

  render() {
    // console.log(
    //   'this.props.paymentOrder',
    //   JSON.stringify(this.props.paymentOrder),
    // );
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <Header 
        title={"Menunggu Konfirmasi"}
        navigation={this.props.navigation}
        menu={true}
        notif={true}
        notifCount={this.renderCountNotificationBadge()}
        cart={true}
        cartCount={this.state.qty}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{marginBottom: wp('3%')}}>
          <View>
            <View>
              <Card containerStyle={styles.cardBackground2}>
                <Text
                  style={[
                    styles.title,
                    {
                      marginLeft: wp('3%'),
                      marginTop: wp('-2%'),
                    },
                  ]}>
                  Detail Produk
                </Text>
                {this.props.paymentOrder.data_item.map((itemData, index) => {
                  return (
                    <View key={index}>
                      {itemData.product != null ? (
                        <Card
                          key={index}
                          containerStyle={{
                            marginLeft: wp('3%'),
                            borderRadius: wp('1%'),
                            padding: 5,
                            // backgroundColor: 'red'
                          }}>
                          <View
                            style={[
                              styles.position2,
                              {
                                justifyContent: 'center',
                              },
                            ]}>
                            <View>
                              <Image
                                source={{
                                  uri: CONFIG.BASE_URL + itemData.product.image,
                                }}
                                style={styles.imageStyle}
                              />
                            </View>
                            <View
                              style={[
                                styles.textposition,
                                {marginLeft: wp('4%')},
                              ]}>
                              <Text
                                numberOfLines={3}
                                multiline
                                style={styles.title}>
                                {itemData.product?.name}
                              </Text>
                              <Text
                                style={{
                                  color: '#777',
                                  fontSize: hp('1.8%'),
                                  marginTop: wp('1%'),
                                  fontFamily: 'Lato-Regular',
                                }}>
                                {this.props.paymentOrder.status_faktur ==
                                'Redeem' ? (
                                  <NumberFormat
                                    value={
                                      Math.round(itemData.price_apps) ?? '0'
                                    }
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    // prefix={'Rp '}
                                    suffix={' poin'}
                                    renderText={value => (
                                      <Text
                                        numberOfLines={1}
                                        style={{
                                          fontSize: hp('1.8%'),
                                          fontFamily: 'Lato-Regular',
                                          color: '#777',
                                          marginTop: wp('1%'),
                                        }}>
                                        {' '}
                                        {value}
                                      </Text>
                                    )}
                                  />
                                ) : (
                                  <>
                                    {itemData.qty} x
                                    {itemData.half ? (
                                      <NumberFormat
                                        value={
                                          Math.round(itemData.price_apps / 2) ??
                                          '0'
                                        }
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        prefix={'Rp '}
                                        renderText={value => (
                                          <Text
                                            numberOfLines={1}
                                            style={{
                                              fontSize: hp('1.8%'),
                                              fontFamily: 'Lato-Regular',
                                              color: '#777',
                                              marginTop: wp('1%'),
                                            }}>
                                            {' '}
                                            {value}
                                          </Text>
                                        )}
                                      />
                                    ) : (
                                      <NumberFormat
                                        value={
                                          Math.round(itemData.price_apps) ?? '0'
                                        }
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        prefix={'Rp '}
                                        renderText={value => (
                                          <Text
                                            numberOfLines={1}
                                            style={{
                                              fontSize: hp('1.8%'),
                                              fontFamily: 'Lato-Regular',
                                              color: '#777',
                                              marginTop: wp('1%'),
                                            }}>
                                            {' '}
                                            {value}
                                          </Text>
                                        )}
                                      />
                                    )}
                                  </>
                                )}
                                {itemData.half ? (
                                  <Text
                                    numberOfLines={1}
                                    style={[
                                      styles.text2,
                                      {
                                        fontSize: hp('1.8%'),
                                        fontFamily: 'Lato-Medium',
                                        color: '#17a2b8',
                                        marginTop: wp('1%'),
                                      },
                                    ]}>
                                    {' ( '}
                                    {itemData.qty_konversi}{' '}
                                    {itemData.small_unit.charAt(0) +
                                      itemData.small_unit
                                        .slice(1)
                                        .toLowerCase()}
                                    {' )'}
                                  </Text>
                                ) : null}
                              </Text>
                            </View>
                          </View>
                          <Card.Divider style={{marginBottom: wp('1%')}} />
                          {itemData.notes ? (
                            <View
                              style={[
                                styles.position2,
                                {marginBottom: wp('1%')},
                              ]}>
                              <View style={{flexDirection: 'row'}}>
                                <Text
                                  style={{
                                    fontSize: hp('1.8%'),
                                    fontFamily: 'Lato-Regular',
                                    marginLeft: wp('1%'),
                                    width: wp('20%'),
                                  }}>
                                  {'Catatan'}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: hp('1.8%'),
                                    fontFamily: 'Lato-Regular',
                                  }}>
                                  {':'}
                                </Text>
                              </View>
                              <Text
                                style={{
                                  fontSize: hp('1.8%'),
                                  fontFamily: 'Lato-Regular',
                                  marginTop: wp('0%'),
                                  marginLeft: wp('1%'),
                                  width: wp('80%'),
                                }}
                                numberOfLines={2}
                                multiline>
                                {itemData.notes}
                              </Text>
                            </View>
                          ) : null}
                          {this.props.paymentOrder.status_faktur == 'Redeem' ? (
                            <View style={{flexDirection: 'row'}}>
                              <Text
                                style={{
                                  fontSize: hp('1.8%'),
                                  fontFamily: 'Lato-Regular',
                                  marginLeft: wp('1%'),
                                  width: wp('20%'),
                                }}>
                                {'Total Poin'}
                              </Text>
                              <Text
                                style={{
                                  fontSize: hp('1.8%'),
                                  fontFamily: 'Lato-Regular',
                                }}>
                                {':'}
                              </Text>
                              <NumberFormat
                                value={Math.round(itemData.total_price) ?? '0'}
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
                                        marginLeft: wp('1%'),
                                        // marginTop: wp('1%'),
                                      },
                                    ]}>
                                    {value}
                                  </Text>
                                )}
                              />
                            </View>
                          ) : (
                            <View style={{flexDirection: 'row'}}>
                              <Text
                                style={{
                                  fontSize: hp('1.8%'),
                                  fontFamily: 'Lato-Regular',
                                  marginLeft: wp('1%'),
                                  width: wp('20%'),
                                }}>
                                {'Total Harga'}
                              </Text>
                              <Text
                                style={{
                                  fontSize: hp('1.8%'),
                                  fontFamily: 'Lato-Regular',
                                }}>
                                {':'}
                              </Text>
                              <NumberFormat
                                value={Math.round(itemData.total_price) ?? '0'}
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
                                        marginLeft: wp('1%'),
                                        // marginTop: wp('1%'),
                                      },
                                    ]}>
                                    {value}
                                  </Text>
                                )}
                              />
                            </View>
                          )}
                        </Card>
                      ) : null}
                    </View>
                  );
                })}
              </Card>
            </View>
            <View style={styles.container3}>
              <Card containerStyle={styles.cardBackground}>
                {/* <View style={styles.position2}>
                    <View style={styles.textposition}>
                      <Text
                        style={{
                          fontSize: hp('1.6%'),
                          fontFamily: 'Lato-Medium',
                          marginBottom: wp('1%'),
                        }}>
                        Nominal Diskon:
                      </Text>
                    </View>
                    <Text style={[styles.title, {alignSelf: 'flex-end'}]}>
                      <NumberFormat
                        value={
                          Math.round(
                            this.props.paymentOrder.payment_discount,
                          ) ?? '0'
                        }
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={'Rp '}
                        renderText={value => (
                          <Text style={styles.diskonText}>{value}</Text>
                        )}
                      />
                    </Text>
                  </View> */}
                {this.props.paymentOrder.status_faktur == 'Redeem' ? (
                  <View style={styles.position2}>
                    <View style={styles.textposition}>
                      <Text
                        style={{
                          fontSize: hp('1.6%'),
                          fontFamily: 'Lato-Medium',
                          marginBottom: wp('1%'),
                        }}>
                        Total Pembelian
                      </Text>
                    </View>
                    <Text style={[styles.title, {alignSelf: 'flex-end'}]}>
                      {/* {this.hitungHargaBarang()} */}
                      <NumberFormat
                        value={
                          
                          Math.round(this.props.paymentOrder.payment_final) ??
                          '0'
                        }
                        displayType={'text'}
                        thousandSeparator={true}
                        // prefix={'Rp '}
                        suffix={' poin'}
                        renderText={value => (
                          <Text style={[styles.diskonText, {color: '#529F45'}]}>
                            {value || 0}
                          </Text>
                        )}
                      />
                    </Text>
                  </View>
                ) : (
                  <View style={styles.position2}>
                    <View style={styles.textposition}>
                      <Text
                        style={{
                          fontSize: hp('1.6%'),
                          fontFamily: 'Lato-Medium',
                          marginBottom: wp('1%'),
                        }}>
                        Total Pembayaran
                      </Text>
                    </View>
                    <Text style={[styles.title, {alignSelf: 'flex-end'}]}>
                      {/* {this.hitungHargaBarang()} */}
                      <NumberFormat
                        value={
                          Math.round(this.props.paymentOrder.payment_final) < 0 ? '0' : Math.round(this.props.paymentOrder.payment_final) ?? 0
                          // Math.round(this.props.paymentOrder.payment_final) ??
                          // '0'
                        }
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={'Rp '}
                        renderText={value => (
                          <Text style={[styles.diskonText, {color: '#529F45'}]}>
                            {value || 0}
                          </Text>
                        )}
                      />
                    </Text>
                  </View>
                )}
              </Card>
            </View>
            <View style={{marginTop: wp('3%')}}>
              <Text
                style={{
                  fontSize: hp('1.6%'),
                  fontFamily: 'Lato-Medium',
                  marginBottom: wp('1%'),
                  color: '#777',
                  textAlign: 'center',
                }}>
                Pesananmu akan dikonfirmasi oleh penjual
              </Text>
              <View style={{flexDirection: 'row'}}>
                {this.props.paymentOrder.status_faktur == 'Redeem' ? (
                  <TouchableOpacity
                    style={[
                      styles.belanjaButton,
                      {
                        marginTop: wp('2.5%'),
                        width: wp('45%'),
                        marginRight: wp('1%'),
                        marginLeft: wp('4%'),
                      },
                    ]}
                    onPress={() =>
                      this.props.navigation.replace('KalenderReward')
                    }>
                    <Text
                      style={{
                        color: '#FFFFFF',
                        fontSize: hp('1.8%'),
                        fontFamily: 'Lato-Medium',
                      }}>
                      {'Redeem Poin Lagi'}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.belanjaButton,
                      {
                        marginTop: wp('2.5%'),
                        width: wp('45%'),
                        marginRight: wp('1%'),
                        marginLeft: wp('4%'),
                      },
                    ]}
                    onPress={() => this.props.navigation.navigate('Produk')}>
                    <Text
                      style={{
                        color: '#FFFFFF',
                        fontSize: hp('1.8%'),
                        fontFamily: 'Lato-Medium',
                      }}>
                      {'Belanja Lagi'}
                    </Text>
                  </TouchableOpacity>
                )}
                {this.props.paymentOrder.status_faktur == 'Redeem' ? (
                  <TouchableOpacity
                    style={[
                      styles.belanjaButton,
                      {
                        marginTop: wp('2.5%'),
                        width: wp('45%'),
                        marginLeft: wp('1%'),
                      },
                    ]}
                    onPress={() =>
                      this.props.navigation.replace('PointHistory')
                    }>
                    <Text
                      style={{
                        color: '#FFFFFF',
                        fontSize: hp('1.8%'),
                        fontFamily: 'Lato-Medium',
                      }}>
                      {'Lihat history Poin'}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.belanjaButton,
                      {
                        marginTop: wp('2.5%'),
                        width: wp('45%'),
                        marginLeft: wp('1%'),
                      },
                    ]}
                    onPress={() =>
                      this.props.navigation.replace('ListDataPayment')
                    }>
                    <Text
                      style={{
                        color: '#FFFFFF',
                        fontSize: hp('1.8%'),
                        fontFamily: 'Lato-Medium',
                      }}>
                      {'Lihat Daftar Transaksi'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisibleOrder}
          onRequestClose={() => {
            this.setState({modalVisibleOrder: !this.state.modalVisibleOrder});
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{'Pesanan sedang diproses'}</Text>
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
                      modalVisibleOrder: !this.state.modalVisibleOrder,
                      modalVisible: !this.state.modalVisible,
                    })
                  }>
                  <Text style={[styles.textStyle, {color: '#000'}]}>
                    {'Feedback'}
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
                    this.setState({
                      modalVisibleOrder: !this.state.modalVisibleOrder,
                      // modalVisible: !this.state.modalVisible,
                    })
                  }>
                  <Text style={styles.textStyle}>{'OK'}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
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
                {'Apakah ada saran dan masukkan untuk aplikasi ini?'}
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
                placeholder="Tuliskan feedback disni"
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
                    this.setState({modalVisible: !this.state.modalVisible})
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
                  onPress={() => this.postFeedBack()}>
                  <Text style={styles.textStyle}>{'Kirim Feedback'}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
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
  paymentOrder: state.OrderReducer.paymentOrder,
  shop: state.ShoppingCartReducer.shop,
});

const mapDispatchToProps = dispatch => {
  return {
    orderAct: (value, tipe) => {
      dispatch(OrderAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmationOrder);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: wp('5%'),
  },
  container2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: hp('8%'),
    backgroundColor: 'white',
    borderBottomWidth: 4,
    borderColor: '#ddd',
  },
  text: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('2.4%'),
    paddingLeft: windowWidth * 0.06,
  },
  buttonHeader: {
    flexDirection: 'row',
    paddingRight: windowWidth * 0.04,
  },
  container3: {
    flexDirection: 'row',
    marginLeft: wp('0%'),
    backgroundColor: 'white',
    alignItems: 'center',
    marginBottom: wp('0%'),
    marginTop: wp('0%'),
  },
  position2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: wp('0%'),
  },
  cardBackground: {
    width: windowWidth,
    marginLeft: wp('0%'),
    borderColor: '#777',
    borderWidth: wp('0%'),
    justifyContent: 'center',
    paddingLeft: wp('5%'),
    marginTop: wp('0%'),
    marginBottom: wp('0%'),
  },
  title: {
    fontSize: hp('1.8%'),
    fontFamily: 'Lato-Regular',
    textAlign: 'auto',
  },
  textposition: {
    flex: 1,
    paddingHorizontal: wp('0%'),
  },
  belanjaButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#529F45',
    height: hp('5%'),
    borderRadius: hp('2%'),
  },
  imageStyle: {
    height: wp('15%'),
    width: wp('15%'),
    backgroundColor: '#F9F9F9',
    borderRadius: hp('2%'),
    marginLeft: wp('1%'),
  },
  cardBackground2: {
    width,
    marginLeft: wp('0%'),
    marginTop: wp('0%'),
    justifyContent: 'center',
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
    marginLeft: wp('4%'),
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
    // fontSize: hp('2%'),
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
});
