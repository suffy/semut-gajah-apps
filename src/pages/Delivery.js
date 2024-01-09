import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Button,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import {connect} from 'react-redux';
import IconNotif from '../assets/icons/NotifAll.svg';
import IconMenu from '../assets/icons/Menu.svg';
import IconPengiriman from '../assets/newIcons/iconPengiriman.svg';
import IconReward from '../assets/newIcons/iconReward.svg';
import IconPromo from '../assets/icons/Promo.svg';
import IconClose from '../assets/icons/Closemodal.svg';
import {ShoppingCartAction, VoucherAction} from '../redux/Action';
import axios from 'axios';
import CONFIG from '../constants/config';
import NumberFormat from 'react-number-format';
import IconOffline from '../assets/icons/NetInfo.svg';
import {ActivityIndicator} from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Storage from '@react-native-async-storage/async-storage';
import {Card} from 'react-native-elements';
import IconBack from '../assets/icons/backArrow.svg';
import {TouchableHighlight} from 'react-native-gesture-handler';
import IconTrash from '../assets/newIcons/iconHapus.svg';
import IconAlamat from '../assets/newIcons/iconToko.svg';
import IconUser from '../assets/newIcons/iconPerson.svg';
import BottomNavigation from '../components/BottomNavigation';
import ModalAlert from '../components/ModalAlert';
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

export class Delivery extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      modalVisiblePengiriman: false,
      modalVisiblePromo: false,
      modalVisibleReward: false,
      totalResult: null,
      totalDiscount: null,
      // pilihPengiriman: 'Pilih Pengiriman',
      pilihPengiriman: 'Bebas Ongkir',
      actionPilihReward: [],
      hasilpilihReward: '',
      pilihanReward: [],
      _pilihanReward: [],
      pilihPromo: {
        code: 'Gunakan Promo',
      },
      voucher: {
        id: '',
        code: '',
        type: '',
        percent: '',
        nominal: '',
        category: '',
      },
      notifMessage: 0,
      notifSubscribe: 0,
      notifAllOrder: 0,
      notifAllComplaint: 0,
      notifBroadcast: 0,
      isSelected: true,
      isSelected2: true,
      tombolReward: false,
      alertData: '',
      modalAlert: false,
    };
  }

  getMenu = () => {
    this.props.navigation.navigate('Profile');
  };

  setModalVisiblePengiriman = visible => {
    this.setState({modalVisiblePengiriman: visible});
  };

  setModalVisiblePromo = visible => {
    this.setState({modalVisiblePromo: visible});
  };

  setModalVisibleReward = visible => {
    this.setState({modalVisibleReward: visible});
  };

  //Voucher
  getVoucher = async () => {
    try {
      let response = await axios.get(`${CONFIG.BASE_URL}/api/vouchers`, {
        headers: {Authorization: `Bearer ${this.props.token}`},
      });
      let data = response.data.data;
      this.setState({voucher: data});
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

  totalCalculation = item => {
    let total = Math.round(this.props.shop_total);
    let voucher = item;
    let discount = 0;
    if (voucher.type === 'percent') {
      discount = (total * Math.round(voucher.percent)) / 100;
    } else {
      discount = Math.round(voucher.nominal);
    }
    discount =
      discount > Math.round(voucher.max_nominal) &&
      Math.round(voucher.max_nominal) != 0
        ? Math.round(voucher.max_nominal)
        : discount;
    total -= discount;

    this.setState({totalResult: total});
    this.setState({totalDiscount: discount});
  };

  filterVoucher() {
    let result = this.state.voucher.filter(
      item =>
        Math.round(item?.min_transaction) <= Math.round(this.props?.shop_total),
    );
    return result;
  }

  postOrder = () => {
    console.log('masuk');
    let order = false;
    let promo_choose = false;
    order = this.state._pilihanReward.indexOf('Pilih Reward');
    promo_choose = this.props.hasilPromo.every(
      item => item.promo_choose == null,
    );
    console.log('this.state._pilihanReward', this.state._pilihanReward);
    console.log('this.state.order', order);
    console.log('this.state.promo_choose', promo_choose);
    if (order != -1 && !promo_choose) {
      // this.changeObject2();
      // this.props.shopAct(this.state.totalResult, 'totalResult');
      // this.props.shopAct('bebasOngkir', 'pengirimanOrder');
      // this.props.navigation.replace('PaymentMethod');
      // this.setState({isSelected: true});
      this.setState({
        alertData: 'Harap pilih tombol pilih reward',
        modalAlert: !this.state.modalAlert,
      });
    } else if (order == -1 && promo_choose) {
      // this.props.shopAct(this.state.totalDiscount, 'totalDiscount');
      // this.changeObject2();
      this.props.shopAct(this.state.totalResult, 'totalResult');
      this.props.shopAct('bebasOngkir', 'pengirimanOrder');
      this.props.navigation.replace('PaymentMethod');
      this.setState({isSelected: true});
    } else {
      // this.props.shopAct(this.state.totalDiscount, 'totalDiscount');
      this.props.shopAct(this.state.totalResult, 'totalResult');
      this.props.shopAct('bebasOngkir', 'pengirimanOrder');
      this.props.navigation.replace('PaymentMethod');
      this.setState({isSelected: true});
    }
  };

  pengiriman = (name, val) => {
    this.props.shopAct(val, 'pengirimanOrder');
    this.setState({
      pilihPengiriman: name,
      modalVisiblePengiriman: false,
    });
    // console.log(this.props.pengirimanOrder);
  };

  reward = val => {
    this.props.shopAct(val, 'promoReward');

    let _pilihanReward = [...this.state._pilihanReward];
    _pilihanReward[this.state.modalIndex] =
      val.product_name + ' (' + val.qty + 'pcs )';

    this.setState({
      hasilpilihReward: val.product_name,
      pilihReward: val.product_name,
      modalVisibleReward: false,
      _pilihanReward,
      modalIndex: null,
    });
    this.changeObject(val);
  };

  changeObject2 = () => {
    const newObjArr = this.props.hasilPromo?.map((item, index) => {
      item.promo_choose?.map((x, y) => {
        if (Object.keys(item.promo_choose).length > 1) {
          item.promo_reward.product = [item.promo_choose[0]];
        }
      });

      return item;
    });
    console.log('final==', JSON.stringify(newObjArr));
    this.props.shopAct(newObjArr, 'hasilPromo');
  };

  changeObject = val => {
    const newObjArr = this.props.hasilPromo?.map((item, index) => {
      item.promo_choose?.map((x, y) => {
        if (x === val) {
          item.promo_reward.product = [val];
          // console.log('hasil==', JSON.stringify(x))
          // console.log('hasil==', JSON.stringify(val))
          // console.log('hasil==', JSON.stringify(item))
        }
      });
      return item;
    });
    console.log('final==', JSON.stringify(newObjArr));
    this.props.shopAct(newObjArr, 'hasilPromo');
  };

  promo = (item, val) => {
    this.props.shopAct(val, 'promoOrder');
    this.setState({
      pilihPromo: item,
      modalVisiblePromo: false,
    });
    this.totalCalculation(item);
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

  //   let _pilihanReward = [];
  //   this.props.hasilPromo.map(item => {
  //     if (item.promo_choose == null) {
  //       return (_pilihanReward = [..._pilihanReward, '']);
  //     } else if (item.promo_choose.length <= 1) {
  //       return (_pilihanReward = [..._pilihanReward, '']);
  //     }
  //     _pilihanReward = [..._pilihanReward, 'Pilih Reward'];
  //   });
  //   this.setState({_pilihanReward});
  //   // this.getVoucher();
  //   this.getNotifAll();
  // };

  componentDidMount() {
    this._isMounted = true;
    let _pilihanReward = [];
    this.props.hasilPromo.map(item => {
      if (item.promo_choose == null) {
        return (_pilihanReward = [..._pilihanReward, '']);
      } else if (item.promo_choose.length <= 1) {
        return (_pilihanReward = [..._pilihanReward, '']);
      }
      _pilihanReward = [..._pilihanReward, 'Pilih Reward'];
    });
    this.setState({_pilihanReward});
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.getNotifAll();
    });
  }

  componentWillUnmount() {
    // rol();
    this._isMounted = false;
    // this.focusListener();
  }

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

  render() {
    const {
      modalVisiblePengiriman,
      modalVisiblePromo,
      modalVisibleReward,
      pilihanReward,
      _pilihanReward,
      qty,
    } = this.state;
    const {shop, hargaPromo, hasilPromoNotif, hasilPromo, kredit} = this.props;
    // console.log('Hargapromo===', JSON.stringify(hargaPromo));
    // console.log('Hasilpromo===', JSON.stringify(hasilPromo));
    // console.log('Hasilpromonotif===', JSON.stringify(hasilPromoNotif));
    // console.log('shop===', JSON.stringify(shop));
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <ModalAlert
          modalAlert={this.state.modalAlert}
          alert={this.state.alertData}
          getCloseAlertModal={() => this.getCloseAlertModal()}
        />
        <Header
          title={'Pengiriman'}
          navigation={this.props.navigation}
          notif={true}
          notifCount={this.renderCountNotificationBadge()}
          menu={true}
          cart={true}
          cartCount={qty}
        />

        <ScrollView
          contentContainerStyle={{
            paddingLeft: wp('5%'),
            paddingRight: wp('5%'),
            backgroundColor: '#F4F4F4',
          }}
          style={{flex: 1}}>
          {hasilPromoNotif && (
            <>
              {this.state.isSelected ? (
                <>
                  {hasilPromoNotif.map((item, index) => {
                    if (item.promo_status == null && item.promo_id != null) {
                      return (
                        <View
                          key={`${index}`}
                          style={[
                            styles.container3,
                            {
                              paddingBottom: wp('4%'),
                              backgroundColor: '#F4F4F4',
                            },
                          ]}>
                          <Card containerStyle={styles.cardBackground}>
                            <Text style={styles.promoText}>
                              {item.promo_description}
                            </Text>
                            <IconClose
                              fill={'white'}
                              width={wp('3%')}
                              height={hp('2%')}
                              style={[styles.closePromo]}
                              onPress={() => {
                                // this.props.shopAct(hasilPromo, 'promo');
                                // this.changeSelected(index)
                                this._isMounted &&
                                  this.setState({isSelected: false});
                              }}
                            />
                          </Card>
                        </View>
                      );
                    } else {
                      return false;
                    }
                  })}
                </>
              ) : null}
            </>
          )}
          {kredit && (
            <>
              {this.state.isSelected2 ? (
                <>
                  {kredit?.map((item, index) => (
                    <View
                      key={`${index}`}
                      style={[
                        styles.container3,
                        {paddingBottom: wp('4%'), backgroundColor: '#F4F4F4'},
                      ]}>
                      <Card
                        containerStyle={[
                          styles.cardBackground,
                          {backgroundColor: '#E07126'},
                        ]}>
                        <Text style={styles.promoText}>{item.message}</Text>
                        <IconClose
                          fill={'white'}
                          width={wp('3%')}
                          height={hp('2%')}
                          style={[styles.closeCredit]}
                          onPress={() => {
                            // this.props.shopAct(hasilPromo, 'promo');
                            // this.changeSelected(index)
                            this._isMounted &&
                              this.setState({isSelected2: false});
                          }}
                        />
                      </Card>
                    </View>
                  ))}
                </>
              ) : null}
            </>
          )}
          <View
            style={[
              styles.container3,
              {paddingVertical: wp('2%'), marginBottom: wp('2%')},
            ]}>
            <View
              title="Group User"
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <IconUser width={wp('9%')} height={wp('7%')} />
              <View
                style={{
                  marginLeft: wp('2%'),
                }}>
                <Text style={[styles.text4]}>{'Nama Pelanggan :'}</Text>
                <Text style={[styles.text5]}>{this.props.dataUser.name}</Text>
              </View>
            </View>
            {/* <Card.Divider /> */}
            <View
              title="Group Alamat"
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <IconAlamat width={wp('9%')} height={wp('7%')} />
              <View
                style={{
                  marginLeft: wp('2%'),
                }}>
                <Text style={styles.text4}>{'Alamat Pengiriman :'}</Text>
                {this.props.dataUser?.user_address?.map((item, index) => (
                  <View key={index}>
                    {item.kelurahan ? (
                      <Text
                        numberOfLines={2}
                        style={[
                          styles.text5,
                          {
                            flex: 1,
                            marginBottom: hp('1%'),
                            textAlign: 'left',
                            width: wp('80%'),
                          },
                        ]}>
                        {item.address}
                        {', '}
                        {item.kelurahan}
                        {', '}
                        {item.kecamatan}
                        {', '}
                        {item.kota}
                        {', '}
                        {item.provinsi}
                        {', '}
                        {item.kode_pos}
                      </Text>
                    ) : (
                      <Text
                        style={[
                          styles.text5,
                          {
                            flex: 1,
                            marginBottom: hp('1%'),
                            textAlign: 'left',
                          },
                        ]}>
                        {item.address}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View
            style={{justifyContent: 'flex-start', backgroundColor: '#F4F4F4'}}>
            {shop.map((item, index) => {
              return (
                <View
                  style={{
                    backgroundColor: '#F4F4F4',
                    marginBottom: wp('2%'),
                    paddingVertical: wp('1.5%'),
                    borderRadius: wp('2%'),
                  }}
                  key={index}>
                  {/* <View
                style={{
                  flexDirection: 'row',
                  // alignItems: 'center',
                  backgroundColor: 'red',
                  height: hp('12%'),
                  width: wp('100%'),
                  // justifyContent: 'space-between',
                  // marginBottom: wp('5%'),
                }}> */}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: wp('2%'),
                      flex: 1,
                      width: '100%',
                      backgroundColor: '#F4F4F4',
                    }}>
                    <View
                      style={{
                        paddingHorizontal: wp('3%'),
                        paddingVertical: wp('5%'),
                        borderRadius: 15,
                        backgroundColor: '#FFF',
                      }}>
                      {item.image ? (
                        <Image
                          source={{
                            uri: CONFIG.BASE_URL + item.image,
                          }}
                          style={styles.image}
                        />
                      ) : (
                        <DummyImage style={styles.image} />
                      )}
                    </View>
                    <View
                      style={{
                        marginLeft: wp('3%'),
                        paddingRight: wp('3%'),
                        flex: 1,
                      }}>
                      <View
                        style={{
                          alignItems: 'flex-start',
                          justifyContent: 'flex-start',
                          paddingTop: hp('1%'),
                        }}>
                        <Text numberOfLines={2} style={[styles.text6]}>
                          {item.name}
                        </Text>
                        <Text numberOfLines={1} style={[styles.text6]}>
                          {item.qty} barang x{' '}
                          {item.half ? (
                            <NumberFormat
                              value={Math.round(item.price_apps) / 2}
                              displayType={'text'}
                              thousandSeparator={true}
                              prefix={'Rp '}
                              // decimalScale={2}
                              fixedDecimalScale={true}
                              renderText={value => (
                                <Text
                                  style={[
                                    styles.text2,
                                    {
                                      fontSize: hp('1.4%'),
                                      fontFamily: 'Lato-Regular',
                                    },
                                  ]}>
                                  {value}
                                </Text>
                              )}
                            />
                          ) : (
                            <NumberFormat
                              value={Math.round(item.price_apps)}
                              displayType={'text'}
                              thousandSeparator={true}
                              prefix={'Rp '}
                              // decimalScale={2}
                              fixedDecimalScale={true}
                              renderText={value => (
                                <Text
                                  style={[
                                    styles.text2,
                                    {
                                      fontSize: hp('1.4%'),
                                      fontFamily: 'Lato-Regular',
                                    },
                                  ]}>
                                  {value}
                                </Text>
                              )}
                            />
                          )}
                          {item.half ? (
                            <Text
                              numberOfLines={1}
                              style={[
                                styles.text2,
                                {
                                  fontSize: hp('1.6%'),
                                  fontFamily: 'Lato-Medium',
                                  // color: '#17a2b8',
                                },
                              ]}>
                              {' ( '}
                              {item.qty_konversi}{' '}
                              {item.kecil.charAt(0) +
                                item.kecil.slice(1).toLowerCase()}
                              {' )'}
                            </Text>
                          ) : null}
                        </Text>
                        {item.notes != null && (
                          <Text numberOfLines={3} style={styles.text2}>
                            {item.notes}
                          </Text>
                        )}
                        <NumberFormat
                          value={Math.round(item.total_price)}
                          displayType={'text'}
                          thousandSeparator={true}
                          prefix={'Rp '}
                          // decimalScale={2}
                          fixedDecimalScale={true}
                          renderText={value => (
                            <Text style={styles.text3}>{value}</Text>
                          )}
                        />
                      </View>
                      {this.props.hasilPromo?.map((val, i) => {
                        if (
                          item.promo_id === val?.promo_id &&
                          val?.promo_all == null &&
                          val?.promo_choose?.length > 1
                        ) {
                          return (
                            <Pressable
                              style={{
                                flex: 1,
                                flexDirection: 'row',
                                height: hp('6%'),
                                width: wp('35%'),
                                borderRadius: wp('1%'),
                                // alignSelf: 'center',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: 'white',
                                alignSelf: 'flex-end',
                                backgroundColor: '#479933',
                              }}
                              onPress={async () => {
                                await this.setState({
                                  tombolReward: true,
                                  pilihanReward: val,
                                  modalIndex: i,
                                });
                                this.setModalVisibleReward(true);
                              }}>
                              <IconReward
                                marginLeft={wp('2%')}
                                marginRight={wp('2%')}
                                width={wp('8%')}
                                height={wp('8%')}
                              />
                              <View
                                style={[
                                  styles.textview,
                                  {
                                    flex: 1,
                                  },
                                ]}>
                                <Text
                                  numberOfLines={1}
                                  style={[styles.textStyle2, {color: '#FFF'}]}>
                                  {this.state._pilihanReward[i]}
                                </Text>
                              </View>
                            </Pressable>
                          );
                        }
                      })}
                    </View>
                  </View>

                  {/* </View> */}
                </View>
              );
            })}

            {this.props.hasilPromo?.map((val, i) => (
              <View
                key={i}
                style={{
                  backgroundColor: 'white',
                  marginHorizontal: wp('-5%'),
                  paddingHorizontal: wp('5%'),
                  // elevation: 10,
                  // borderWidth: 1,
                  // borderColor: '#ddd',
                  // marginBottom: wp('2%'),
                }}>
                {val?.promo_choose?.length > 1 && val?.promo_all === 1 ? (
                  <>
                    <Text
                      style={{
                        fontSize: hp('1.8%'),
                        fontFamily: 'Lato-Regular',
                        marginVertical: 10,
                      }}>
                      {'Hadiah Umum'}
                    </Text>
                    <Pressable
                      style={[
                        styles.buttonPengiriman,
                        {marginBottom: hp('2%')},
                      ]}
                      onPress={async () => {
                        await this.setState({
                          tombolReward: true,
                          pilihanReward: val,
                          modalIndex: i,
                        });
                        this.setModalVisibleReward(true);
                      }}>
                      <IconReward
                        marginLeft={wp('4%')}
                        width={wp('8%')}
                        height={wp('8%')}
                      />
                      <View
                        style={[
                          styles.textview,
                          {paddingLeft: wp('4%'), flex: 1},
                        ]}>
                        <Text numberOfLines={1} style={[styles.textStyle2]}>
                          {this.state._pilihanReward[i]}
                        </Text>
                      </View>
                    </Pressable>
                  </>
                ) : null}
              </View>
            ))}
            <View
              style={{
                backgroundColor: 'white',
                marginHorizontal: wp('-5%'),
                paddingHorizontal: wp('5%'),
                paddingVertical: wp('4%'),
                marginTop: wp('2%'),
              }}>
              <Pressable
                style={{
                  flexDirection: 'row',
                  height: hp('6%'),
                  width: wp('90%'),
                  // borderRadius: wp('1%'),
                  // borderWidth: 1,
                  // borderColor: '#DCDCDC',
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                // onPress={() => this.setModalVisiblePengiriman(true)}
              >
                <IconPengiriman
                  marginLeft={wp('4%')}
                  width={wp('8%')}
                  height={wp('8%')}
                />
                <View
                  style={[styles.textview, {paddingLeft: wp('4%'), flex: 1}]}>
                  <Text style={styles.text3}>{this.state.pilihPengiriman}</Text>
                </View>
              </Pressable>
            </View>
            <View
              style={[
                styles.totalTagihan,
                {
                  backgroundColor: 'white',
                  marginHorizontal: wp('-5%'),
                  paddingHorizontal: wp('5%'),
                },
              ]}>
              <View
                style={{
                  flexDirection: 'column',
                  // marginLeft: wp('5%'),
                  marginBottom: hp('9%'),
                }}>
                <Text style={[styles.text1]}>{'Total Tagihan'}</Text>
                <NumberFormat
                  value={
                    Math.round(hargaPromo[1].total_price_after_promo) +
                    Math.round(hargaPromo[2].total_non_promo)
                  }
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={'Rp '}
                  // decimalScale={2}
                  fixedDecimalScale={true}
                  renderText={value => (
                    <Text style={[styles.text1]}>{value}</Text>
                  )}
                />
              </View>
              {this.state.pilihPengiriman !== 'Pilih Pengiriman' ? (
                <TouchableOpacity
                  style={styles.ButtonPilihPembayaran}
                  onPress={() => this.postOrder()}>
                  <Text style={[styles.textButton, {color: '#ffffff'}]}>
                    {'Pilih Pembayaran'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.ButtonPilihPembayaran}
                  onPress={() =>
                    this.setState({
                      alertData: 'Harap Memilih Pilihan Pengiriman',
                      modalAlert: !this.state.modalAlert,
                    })
                  }>
                  <Text style={[styles.textButton, {color: '#ffffff'}]}>
                    {'Pilih Pembayaran'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* modal reward */}
          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisibleReward}
              onRequestClose={() => {
                this.setModalVisibleReward(!modalVisibleReward);
              }}>
              <View style={styles.centeredView}>
                <View style={[styles.modalView, {height: hp('70%')}]}>
                  <TouchableWithoutFeedback
                    onPress={() =>
                      this.setModalVisibleReward(!modalVisibleReward)
                    }
                    underlayColor="#DDDDDD"
                    activeOpacity={0.6}>
                    <View style={styles.button}>
                      <IconClose
                        fill={'white'}
                        onPress={() =>
                          this.setModalVisibleReward(!modalVisibleReward)
                        }
                        width={wp('4%')}
                        height={hp('4%')}
                      />
                      <Text style={styles.textStyle}>
                        {'Pilih Hadiah Produk'}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                  {pilihanReward?.promo_choose?.map((val, i) => (
                    <>
                      {val.product_name ==
                      _pilihanReward.every((item, index) => item) ? (
                        <View
                          style={[
                            styles.button2,
                            {
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              paddingRight: wp('5%'),
                            },
                          ]}
                          key={index}>
                          <TouchableOpacity
                            onPress={() => {
                              this.reward(val);
                            }}>
                            {/* {console.log('val', val)} */}
                            {/* <View style={styles.button2}> */}
                            <View
                              style={[
                                styles.textview,
                                {
                                  flexDirection: 'column',
                                  alignItems: 'flex-start',
                                },
                              ]}>
                              <Text
                                style={[styles.textStyle2, {color: '#529F45'}]}>
                                {val.product_name}
                              </Text>
                              <Text
                                style={[styles.textStyle2, {color: '#529F45'}]}>
                                {' Jumlah :'} {val.qty}
                              </Text>
                            </View>
                            {/* </View> */}
                          </TouchableOpacity>
                          {val.product_name ==
                          _pilihanReward.every((item, index) => item) ? (
                            <IconTrash
                              onPress={() => {
                                let _pilihanReward = [
                                  ...this.state._pilihanReward,
                                ];
                                _pilihanReward[this.state.modalIndex] =
                                  'Pilih Reward';
                                this.setState({
                                  _pilihanReward,
                                  modalVisibleReward: false,
                                });
                              }}
                              width={wp('7%')}
                              height={wp('7%')}
                            />
                          ) : null}
                        </View>
                      ) : (
                        <View
                          style={[
                            styles.button2,
                            {
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              paddingRight: wp('5%'),
                            },
                          ]}
                          key={i}>
                          <TouchableOpacity
                            onPress={() => {
                              this.reward(val);
                            }}>
                            {/* <View style={styles.button2}> */}
                            <View
                              style={[
                                styles.textview,
                                {
                                  flexDirection: 'column',
                                  alignItems: 'flex-start',
                                },
                              ]}>
                              <Text style={styles.textStyle2}>
                                {val.product_name}
                              </Text>
                              <Text style={styles.textStyle2}>
                                {' Jumlah :'} {val.qty}
                              </Text>
                            </View>
                            {/* </View> */}
                          </TouchableOpacity>
                          {/* {console.log('val===========', val.product_name)}
                          {console.log('iiiiii', i)}
                          {console.log(
                            'jksakbda====',
                            this.state.hasilpilihReward,
                            this.state.pilihReward,
                          )}
                          {console.log(
                            '_pilihanReward======================',
                            _pilihanReward,
                          )} */}
                        </View>
                      )}
                    </>
                  ))}
                </View>
              </View>
            </Modal>
          </View>

          {/* modal pengiriman */}
          <View style={styles.centeredView}>
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisiblePengiriman}
              onRequestClose={() => {
                this.setModalVisiblePengiriman(!modalVisiblePengiriman);
              }}>
              <View style={styles.centeredView}>
                <View style={[styles.modalView, {height: hp('70%')}]}>
                  <TouchableHighlight
                    onPress={() =>
                      this.setModalVisiblePengiriman(!modalVisiblePengiriman)
                    }
                    underlayColor="#DDDDDD"
                    activeOpacity={0.6}>
                    <View style={styles.button}>
                      <IconClose
                        fill={'white'}
                        onPress={() =>
                          this.setModalVisiblePengiriman(
                            !modalVisiblePengiriman,
                          )
                        }
                        width={wp('4%')}
                        height={hp('4%')}
                      />
                      <Text style={styles.textStyle}>{'Pilih Pengiriman'}</Text>
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight
                    onPress={() =>
                      this.pengiriman('Bebas Ongkir', 'bebasOngkir')
                    }>
                    <View style={styles.button2}>
                      <View style={styles.textview}>
                        <Text style={styles.textStyle2}>
                          {'Bebas Ongkir'} ({' '}
                          <NumberFormat
                            value={'0'}
                            displayType={'text'}
                            thousandSeparator={true}
                            prefix={'Rp '}
                            renderText={value => (
                              <Text style={styles.textStyle4}>{value}</Text>
                            )}
                          />{' '}
                          -{' '}
                          <NumberFormat
                            value={'0'}
                            displayType={'text'}
                            thousandSeparator={true}
                            prefix={'Rp '}
                            renderText={value => (
                              <Text style={styles.textStyle4}>{value}</Text>
                            )}
                          />{' '}
                          )
                        </Text>
                      </View>
                      {/* <Text style={styles.textStyle3}>
                        {'Estimasi tiba 0 - 0 April'}
                      </Text> */}
                    </View>
                  </TouchableHighlight>
                </View>
              </View>
            </Modal>
          </View>

          {/* modal promo */}
          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisiblePromo}
              onRequestClose={() => {
                this.setModalVisiblePromo(!modalVisiblePromo);
              }}>
              <View style={styles.centeredView}>
                <View style={[styles.modalView, {height: hp('70%')}]}>
                  <TouchableHighlight
                    onPress={() =>
                      this.setModalVisiblePromo(!modalVisiblePromo)
                    }
                    underlayColor="#DDDDDD"
                    activeOpacity={0.6}>
                    <View style={styles.button}>
                      <IconClose width={wp('4%')} height={hp('4%')} />
                      <Text style={styles.textStyle}>{'Gunakan Promo'}</Text>
                    </View>
                  </TouchableHighlight>
                  {this.state.voucher.length > 0 && (
                    <ScrollView>
                      {this.filterVoucher().map(item => (
                        <View key={item.id}>
                          <TouchableHighlight
                            onPress={() => {
                              this.promo(item, item.id);
                            }}>
                            <View style={styles.buttonspecial}>
                              <Text style={styles.textStyle2}>{item.code}</Text>
                              {item.type == 'percent' ? (
                                <Text style={styles.textStyle3}>
                                  Potongan: {item.percent}%
                                </Text>
                              ) : null}
                              {item.type == 'nominal' ? (
                                <NumberFormat
                                  value={Math.round(item.nominal) ?? '0'}
                                  displayType={'text'}
                                  thousandSeparator={true}
                                  prefix={'Rp '}
                                  renderText={value => (
                                    <Text style={styles.textStyle3}>
                                      Potongan: {value}
                                    </Text>
                                  )}
                                />
                              ) : null}
                              <NumberFormat
                                value={Math.round(item.min_transaction)}
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={'Rp '}
                                renderText={value => (
                                  <Text style={styles.textStyle3}>
                                    Min Transaksi: {value}
                                  </Text>
                                )}
                              />
                            </View>
                          </TouchableHighlight>
                        </View>
                      ))}
                    </ScrollView>
                  )}
                  {this.state.voucher.length == 0 && (
                    <View
                      style={{
                        alignSelf: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        flex: 1,
                      }}>
                      <Text
                        style={{
                          fontSize: hp('2%'),
                          fontFamily: 'Lato-Medium',
                        }}>
                        Tidak ada promo saat ini
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </Modal>
          </View>
        </ScrollView>
        <BottomNavigation
          navigation={this.props.navigation}
          nameRoute="Keranjang"
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
  dataUser: state.LoginReducer.dataUser,
  shop: state.ShoppingCartReducer.shop,
  kredit: state.ShoppingCartReducer.kredit,
  shop_total: state.ShoppingCartReducer.shop_total,
  hasilPromo: state.ShoppingCartReducer.hasilPromo,
  hargaPromo: state.ShoppingCartReducer.hargaPromo,
  hasilPromoNotif: state.ShoppingCartReducer.hasilPromoNotif,
});

const mapDispatchToProps = dispatch => {
  return {
    shopAct: (value, tipe) => {
      dispatch(ShoppingCartAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Delivery);

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
  container3: {
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    marginHorizontal: wp('-5%'),
    paddingHorizontal: wp('5%'),
  },
  text1: {
    fontSize: hp('2.4%'),
    fontFamily: 'Lato-Bold',
    color: '#575251',
  },
  text2: {
    fontFamily: 'Lato-Regular',
    fontSize: hp('1.65%'),
    color: '#575251',
  },
  text3: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('1.8%'),
    color: '#575251',
    fontWeight: 'bold',
  },
  text4: {
    color: '#575251',
    fontWeight: 'bold',
    fontSize: hp('1.8%'),
    fontFamily: 'Lato-Medium',
  },
  text5: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('1.65%'),
    textTransform: 'capitalize',
    marginBottom: hp('1%'),
    color: '#575251',
  },
  text6: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('1.6%'),
    color: '#575251',
  },
  textButton: {
    fontFamily: 'Lato-Bold',
    fontSize: hp('1.8%'),
  },
  image: {
    height: wp('15%'),
    width: wp('17%'),
    backgroundColor: '#F9F9F9',
    borderRadius: wp('1%'),
  },
  totalTagihan: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: hp('3%'),
  },
  ButtonPilihPembayaran: {
    backgroundColor: '#F4964A',
    width: wp('40%'),
    height: hp('6%'),
    borderRadius: hp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: wp('5%'),
  },
  buttonPengiriman: {
    flexDirection: 'row',
    height: hp('6%'),
    width: wp('90%'),
    borderRadius: wp('1%'),
    borderWidth: 1,
    borderColor: '#DCDCDC',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerInput: {
    overflow: 'hidden',
    paddingBottom: hp('2%'),
    paddingHorizontal: wp('2%'),
    alignSelf: 'center',
  },
  textposisi: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('2%'),
    width: wp('90%'),
    height: hp('8%'),
    // paddingVertical: hp('3%'),
    paddingHorizontal: wp('3%'),
    borderWidth: 1,
    borderRadius: wp('1%'),
    borderColor: '#DCDCDC',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 3,
  },
  textposisi1: {
    paddingLeft: wp('5%'),
  },
  iconpromo: {
    flexDirection: 'row',
    height: hp('8%'),
    width: wp('90%'),
    borderRadius: hp('1.5%'),
    borderWidth: 1,
    borderColor: '#7D7D7D',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  centeredView: {
    justifyContent: 'center',
    backgroundColor: '#rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: wp('100%'),
    marginTop: hp('35%'),
    backgroundColor: '#FFFFFF',
    borderRadius: hp('1.5%'),
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('8%'),
    backgroundColor: '#529F45',
    width: wp('100%'),
    justifyContent: 'flex-start',
    borderRadius: hp('1.5%'),
    paddingLeft: wp('5%'),
  },
  buttonspecial: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('9%'),
    backgroundColor: '#FFFFFF',
    width: wp('100%'),
    alignItems: 'flex-start',
    paddingLeft: wp('5%'),
  },
  button2: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('9%'),
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
    color: '#000',
    fontFamily: 'Lato-Medium',
    fontSize: hp('1.8%'),
    textAlign: 'center',
  },
  textStyle3: {
    color: 'black',
    fontFamily: 'Lato-Regular',
    fontSize: hp('1.6%'),
    textAlign: 'center',
  },
  textStyle4: {
    color: '#096A3A',
    fontFamily: 'Lato-Regular',
    fontSize: hp('1.8%'),
    textAlign: 'center',
  },
  textview: {
    flexDirection: 'row',
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
    // fontSize: hp('2),%'
  },

  cardBackground: {
    backgroundColor: '#529F45',
    width: wp('90%'),
    // height: hp('9.5%'),
    marginLeft: wp('0%'),
    borderColor: '#F9F9F9',
    justifyContent: 'center',
    borderRadius: wp('1%'),
  },
  closePromo: {
    position: 'absolute',
    right: wp('0%'),
    top: wp('0%'),
  },
  closeCredit: {
    position: 'absolute',
    right: wp('0%'),
    top: wp('0%'),
  },
  promoText: {
    fontSize: hp('1.5%'),
    color: '#fff',
    fontFamily: 'Lato-Medium',
    // marginLeft: wp('1%'),
    width: wp('78%'),
  },
});
