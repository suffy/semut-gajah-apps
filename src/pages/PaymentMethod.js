import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Modal,
  TouchableHighlight,
  Alert,
  TouchableWithoutFeedback,
  Switch,
} from 'react-native';
import {Card} from 'react-native-elements/dist/card/Card';
import {connect} from 'react-redux';
import IconNotif from '../assets/icons/NotifAll.svg';
import IconMenu from '../assets/icons/Menu.svg';
import IconCOD from '../assets/newIcons/iconPoint.svg';
import IconBayar from '../assets/newIcons/iconBayar.svg';
import IconCreditcard from '../assets/icons/Credit-card.svg';
import Font from '../components/Fontresponsive';
import NumberFormat from 'react-number-format';
import Size from '../components/Fontresponsive';
import IconPromo from '../assets/icons/Promo.svg';
import IconClose from '../assets/icons/Closemodal.svg';
import axios from 'axios';
import CONFIG from '../constants/config';
import {ShoppingCartAction, OrderAction} from '../redux/Action';
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
import {Divider} from 'react-native-elements';
import BottomNavigation from '../components/BottomNavigation';
import ModalAlert from '../components/ModalAlert';
import Snackbar from 'react-native-snackbar';
import IconMidtrans from '../assets/icons/Midtrans.svg';
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
function LoadingApi() {
  return (
    <View style={styles.loadingApi}>
      <ActivityIndicator animating size="small" color="#529F45" />
    </View>
  );
}
const width = Dimensions.get('window').width;
const height = width * 0.17;

export class PaymentMethod extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      modalVisiblePembayaran: false,
      // pilihPembayaran: 'Pilih Pembayaran',
      pilihPembayaran:
        this.props?.dataUser?.type_payment === 'T'
          ? 'Bayar langsung di tempat (COD)'
          : 'Tempo',
      keteranganPembayaran: '',
      valuePembayaran:
        this.props?.dataUser?.type_payment === 'T' ? 'cod' : 'tempo',
      image:
        this.props?.dataUser?.type_payment === 'T' ? (
          <IconCOD
            width={wp('9%')}
            height={wp('9%')}
            // marginTop={wp('-2%')}
          />
        ) : (
          <IconCreditcard
            width={wp('9%')}
            height={wp('9%')}
            // marginTop={wp('-2%')}
          />
        ),
      notifMessage: 0,
      notifSubscribe: 0,
      notifAllOrder: 0,
      notifAllComplaint: 0,
      notifBroadcast: 0,
      kelas: '',
      disableButton: false,
      diskonPromo: 0,
      diskonNominal: 0,
      produkPromo: [],
      alertData: '',
      modalAlert: false,
      isSwitch: false,
      loadingApi: true,
    };
  }

  getMenu = () => {
    this.props.navigation.navigate('Profile');
  };

  setModalVisiblePembayaran = visible => {
    this.setState({modalVisiblePembayaran: visible});
  };

  postOrder = async () => {
    if (this.state.isSwitch === true) {
      const final =
        Math.round(this.props.hargaPromo[1].total_price_after_promo) +
        (Math.round(this.props.hargaPromo[2].total_non_promo) || 0);
      if (final > Math.round(this.props.dataUser?.point)) {
        try {
          console.log('log 129');
          // console.log('item', JSON.stringify(this.props.hasilPromo));
          let response = await axios.post(
            `${CONFIG.BASE_URL}/api/orders`,
            {
              products: this.props.shop,
              order_promo: this.props.hasilPromo ?? '',

              data: {
                voucher_id: this.props.promoOrder ?? '',
                payment_method: this.state.valuePembayaran,
                delivery_service: this.props.pengirimanOrder,
                payment_total: this.props.shop_total ?? '0',
                payment_discount: this.props.totalDiscount ?? '0',
                payment_point: Math.round(this.props.dataUser?.point),
                payment_final:
                  Math.round(
                    this.props.hargaPromo[1]?.total_price_after_promo,
                  ) +
                  (Math.round(this.props.hargaPromo[2]?.total_non_promo) || 0),
              },
            },
            {
              headers: {
                Authorization: `Bearer ${this.props.token}`,
              },
            },
          );

          let data = response.data;
          let dataOrder = response.data.data;

          if (
            this.state.valuePembayaran == 'tempo' &&
            this.props?.dataUser?.credit_limit == 0
          ) {
            this.setState({
              alertData: 'Kredit limit Anda tidak cukup',
              modalAlert: !this.state.modalAlert,
              disableButton: false,
            });
          } else if (data !== '' && data['success'] == true) {
            // console.log('DATA ORDER ==== ', JSON.stringify(dataOrder, null, 2));
            this.props.orderAct(dataOrder, 'paymentOrder');
            this.props.navigation.replace('ConfirmationOrder');
          } else {
            this.setState({
              alertData: 'Pembayaran gagal',
              modalAlert: !this.state.modalAlert,
              disableButton: false,
            });
            // console.log(response.data);
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
            this.setState({visible: true});
          } else if (errorNetwork) {
            this.setState({visible2: true});
          } else if (error400) {
            Storage.removeItem('token');
            this.props.navigation.navigate('Home');
          }
          this.setState({disableButton: false});
        }
      } else {
        console.log('log 208');
        try {
          // console.log('item', JSON.stringify(this.props.hasilPromo));
          let response = await axios.post(
            `${CONFIG.BASE_URL}/api/orders`,
            {
              products: this.props.shop,
              order_promo: this.props.hasilPromo ?? '',
              data: {
                voucher_id: this.props.promoOrder ?? '',
                payment_method: this.state.valuePembayaran,
                delivery_service: this.props.pengirimanOrder,
                payment_total: this.props.shop_total ?? '0',
                payment_discount: this.props.totalDiscount ?? '0',
                payment_final:
                  Math.round(
                    this.props.hargaPromo[1]?.total_price_after_promo,
                  ) +
                  (Math.round(this.props.hargaPromo[2]?.total_non_promo) || 0),
                payment_point:
                  Math.round(
                    this.props.hargaPromo[1]?.total_price_after_promo,
                  ) +
                  (Math.round(this.props.hargaPromo[2]?.total_non_promo) || 0),
              },
            },
            {
              headers: {
                Authorization: `Bearer ${this.props.token}`,
              },
            },
          );

          // console.log('data hasil===>', response);
          let data = response.data;
          let dataOrder = response.data.data;
          // console.log(
          //   'asdfghjk',
          //   dataOrder,
          //   '---------------------------- data masuk orderan',
          // );
          if (
            this.state.valuePembayaran == 'tempo' &&
            this.props?.dataUser?.credit_limit == 0
          ) {
            this.setState({
              alertData: 'Kredit limit Anda tidak cukup',
              modalAlert: !this.state.modalAlert,
              disableButton: false,
            });
          } else if (data !== '' && data['success'] == true) {
            // console.log('DATA ORDER ==== ', JSON.stringify(dataOrder, null, 2));
            this.props.orderAct(dataOrder, 'paymentOrder');
            this.props.navigation.replace('ConfirmationOrder');
          } else {
            this.setState({
              alertData: 'Pembayaran gagal',
              modalAlert: !this.state.modalAlert,
              disableButton: false,
            });
            // console.log(response.data);
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
            this.setState({visible: true});
          } else if (errorNetwork) {
            this.setState({visible2: true});
          } else if (error400) {
            Storage.removeItem('token');
            this.props.navigation.navigate('Home');
          }
          this.setState({disableButton: false});
        }
      }
    } else {
      // console.log('log 290');
      try {
        // console.log('item', JSON.stringify(this.props.hasilPromo));
        let response = await axios.post(
          `${CONFIG.BASE_URL}/api/orders`,
          {
            products: this.props.shop,
            order_promo: this.props.hasilPromo ?? '',
            data: {
              voucher_id: this.props.promoOrder ?? '',
              payment_method: this.state.valuePembayaran,
              delivery_service: this.props.pengirimanOrder,
              payment_total: this.props.shop_total ?? '0',
              payment_discount: this.props.totalDiscount ?? '0',
              payment_final:
                Math.round(this.props.hargaPromo[1]?.total_price_after_promo) +
                (Math.round(this.props.hargaPromo[2]?.total_non_promo) || 0),
            },
          },
          {
            headers: {
              Authorization: `Bearer ${this.props.token}`,
            },
          },
        );

        // console.log('data hasil===>', response);
        let data = response.data;
        let dataOrder = response.data.data;
        if (
          this.state.valuePembayaran == 'tempo' &&
          this.props?.dataUser?.credit_limit == null
        ) {
          this.setState({
            alertData: 'Kredit limit Anda tidak cukup',
            modalAlert: !this.state.modalAlert,
            disableButton: false,
          });
        } else if (data !== '' && data['success'] == true) {
          // console.log('DATA ORDER ==== ', JSON.stringify(dataOrder, null, 2));
          this.props.orderAct(dataOrder, 'paymentOrder');
          this.props.navigation.replace('ConfirmationOrder');
        } else {
          this.setState({
            alertData: 'Pembayaran gagal',
            modalAlert: !this.state.modalAlert,
            disableButton: false,
          });
          // console.log(response.data);
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
          this.setState({visible: true});
        } else if (errorNetwork) {
          this.setState({visible2: true});
        } else if (error400) {
          Storage.removeItem('token');
          this.props.navigation.navigate('Home');
        }
        this.setState({disableButton: false});
      }
    }
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
  //   // this.cekKelas();
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

  cekKelas = async () => {
    if (this.props?.dataUser?.salur_code == 'SW') {
      this.setState({kelas: 'Semi Grosir'});
    } else if (this.props?.dataUser?.salur_code == 'RT') {
      this.setState({kelas: 'Retail'});
    } else {
      this.setState({kelas: 'Grosir'});
    }
  };

  hitungQuantity = () => {
    // console.log('cekkk', JSON.stringify(this.props.shop));
    const sumTotal = (arr = []) =>
      arr.reduce((sum, {qty}) => sum + parseInt(qty), 0);
    const total = sumTotal(this.props.shop ?? 0);
    if (total === 0) return null;
    return (
      <Text style={styles.lihatText}>
        {total + ' barang'}
        {' ( '}
        {this.props.shop.length}
        {' produk'}
        {' )'}
      </Text>
    );
  };

  hitungHargaBarang = () => {
    const sumTotal = (arr = []) =>
      arr.reduce(
        (sum, {price_apps, qty}) =>
          sum + Math.round(price_apps) * Math.round(qty),
        0,
      );
    const total = sumTotal(this.props.shop ?? 0);
    if (total === 0) return null;
    return (
      <NumberFormat
        value={Math.round(total)}
        displayType={'text'}
        thousandSeparator={true}
        prefix={'Rp '}
        // decimalScale={2}
        fixedDecimalScale={true}
        renderText={value => <Text style={styles.totalText}>{value}</Text>}
      />
    );
  };

  hitungHargaPromoDiskon = () => {
    const sumTotal = (arr = []) =>
      arr.reduce(
        (sum, item) =>
          sum +
          (item.promo_status == 1 ? Math.round(item.promo_reward.disc) : 0),
        0,
      );
    const total = sumTotal(this.props.hasilPromo ?? 0);
    if (total === 0) return null;
    return (
      <NumberFormat
        value={Math.round(total)}
        displayType={'text'}
        thousandSeparator={true}
        // prefix={'Rp '}
        // decimalScale={2}
        fixedDecimalScale={true}
        renderText={value => (
          <Text style={styles.totalText}>
            {value}
            {' %'}
          </Text>
        )}
      />
    );
  };

  hitungHargaPromoNominal = () => {
    const sumTotal = (arr = []) =>
      arr.reduce(
        (sum, item) =>
          sum +
          (item.promo_status == 1 ? Math.round(item.promo_reward.nominal) : 0),
        0,
      );
    const total = sumTotal(this.props.hasilPromo ?? 0);
    if (total === 0) return null;
    return (
      <NumberFormat
        value={Math.round(total)}
        displayType={'text'}
        thousandSeparator={true}
        prefix={'Rp '}
        // decimalScale={2}
        fixedDecimalScale={true}
        renderText={value => <Text style={styles.totalText}>{value}</Text>}
      />
    );
  };

  hitungHargaPromoPoint = () => {
    const sumTotal = (arr = []) =>
      arr.reduce(
        (sum, item) =>
          sum +
          (item.promo_status == 1 ? Math.round(item.promo_reward.point) : 0),
        0,
      );
    const total = sumTotal(this.props.hasilPromo ?? 0);
    if (total === 0) return null;
    return (
      <NumberFormat
        value={Math.round(total)}
        displayType={'text'}
        thousandSeparator={true}
        // prefix={'Rp '}
        // decimalScale={2}
        fixedDecimalScale={true}
        renderText={value => <Text style={styles.totalText}>{value}</Text>}
      />
    );
  };

  hitungBelanja = () => {
    const sumTotal = (arr = []) =>
      arr.reduce(
        (sum, {item_discount}) => Math.round(sum) + Math.round(item_discount),
        0,
      );
    const total = sumTotal(this.props.shop ?? 0);
    return Math.round(this.props.shop_total) - (total || 0);
  };
  hitungHargaBayar = () => {
    const sumTotal = (arr = []) =>
      arr.reduce(
        (sum, {item_discount}) => Math.round(sum) + Math.round(item_discount),
        0,
      );
    const total = sumTotal(this.props.shop ?? 0);
    if (total === 0) return null;
    return (
      <NumberFormat
        value={Math.round(this.props.shop_total) - Math.round(total)}
        displayType={'text'}
        thousandSeparator={true}
        prefix={'Rp '}
        // decimalScale={2}
        fixedDecimalScale={true}
        renderText={value => (
          <Text style={[styles.priceProduct, {marginLeft: wp('2.7%')}]}>
            {value}
          </Text>
        )}
      />
    );
  };

  hitungDiskon = () => {
    const sumTotal = (arr = []) =>
      arr.reduce(
        (sum, {item_discount}) => Number(sum) + Number(item_discount),
        0,
      );
    const total = sumTotal(this.props.shop ?? 0);
    if (total === 0) return null;
    return total;
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

  toggleSwitch = async () => {
    this.setState({isSwitch: !this.state.isSwitch});
  };

  hitungTotalBayar = () => {
    const {hargaPromo} = this.props;
    const harga =
      Math.round(hargaPromo[1].total_price_after_promo) +
      (Math.round(hargaPromo[2].total_non_promo) || 0);

    let value = 0;
    if (this.state.isSwitch) {
      value = harga - Math.round(this.props.dataUser?.point);
    } else {
      value = harga;
    }
    return value;
  };

  render() {
    // console.log(
    //   'cekk angka nihh',
    //   this.hitungTotalBayar(),
    //   this.props.dataUser?.credit_limit,
    //   typeof this.props.dataUser?.credit_limit,
    // );
    const {hasilPromoNotif, shop, hargaPromo, hasilPromo} = this.props;
    const {modalVisiblePembayaran, kelas, disableButton, isSwitch, qty} =
      this.state;
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
          menu={true}
          notif={true}
          notifCount={this.renderCountNotificationBadge()}
          cart={true}
          cartCount={qty}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* <Card containerStyle={styles.cardBackground}>
                <Text style={styles.promoText}>
                  Promo yang sedang digunakan
                </Text>
                <Text style={styles.diskonText}>
                  Diskon sedang digunakan sebesar{' '}
                  <NumberFormat
                    value={Math.round(this.props.totalDiscount) ?? '0'}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'Rp '}
                    renderText={value => (
                      <Text style={styles.diskonText}>{value}</Text>
                    )}
                  />
                </Text>
              </Card> */}
          <View style={styles.positionPembayaran}>
            <Text style={styles.metodeText}>Metode Pembayaran</Text>
          </View>
          <Pressable
            onPress={() => this.setModalVisiblePembayaran(true)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              height: hp('7%'),
              width: wp('90%'),
              borderRadius: hp('3.5%'),
              marginLeft: wp('5%'),
              marginTop: wp('2%'),
              marginBottom: wp('2%'),
              backgroundColor: '#F1F1F1',
            }}>
            {this.state.image}
            <Text style={styles.metodeText}>{this.state.pilihPembayaran}</Text>
            <Text style={[styles.metodeText, {color: '#575251'}]}>
              {this.state.keteranganPembayaran}
            </Text>
          </Pressable>
          <Text
            style={[
              styles.titleRingkasan,
              {
                marginLeft: wp('6%'),
                marginTop: hp('1.5%'),
                // marginBottom: hp('1%'),
              },
            ]}>
            Ringkasan Pembayaran
          </Text>
          {/* <Divider
            width={1}
            style={{width: wp('90%'), marginLeft: wp('5%'), height: 1}}
          /> */}
          <View style={[styles.positionPembayaran, {marginTop: hp('1%')}]}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.lihatText}>Total Harga</Text>
              {this.hitungQuantity()}
            </View>
            {this.hitungHargaBarang()}
          </View>
          {this.hitungDiskon() !== null ? (
            <View style={styles.positionPembayaran}>
              <View style={{flexDirection: 'row'}}>
                <Text style={[styles.lihatText, {width: wp('40%')}]}>
                  {'Total Diskon '}
                  {'( '}
                  {'kelas '}
                  {this.props?.dataUser?.salur_code}
                  {/* {' / '}
                  {kelas} */}
                  {' )'}
                </Text>
              </View>
              <NumberFormat
                value={Math.round(this.hitungDiskon())}
                displayType={'text'}
                thousandSeparator={true}
                prefix={'Rp '}
                // decimalScale={2}
                fixedDecimalScale={true}
                renderText={value => (
                  <Text style={styles.totalText}>{value}</Text>
                )}
              />
            </View>
          ) : null}
          <View style={styles.positionPembayaran}>
            <Text style={styles.lihatText}>Total Ongkos Kirim</Text>
            <Text style={styles.totalText}>
              {this.props.pengirimanOrder == 'bebasOngkir'
                ? 'Bebas Ongkir'
                : null}
            </Text>
          </View>
          <View style={styles.positionPembayaran}>
            <Text style={styles.lihatText}>Total Belanja</Text>
            <NumberFormat
              value={Math.round(
                hargaPromo[1].total_price_after_promo +
                  (Math.round(hargaPromo[2].total_non_promo) || 0),
              )}
              displayType={'text'}
              thousandSeparator={true}
              prefix={'Rp '}
              fixedDecimalScale={true}
              renderText={value => (
                <Text style={styles.totalText}>{value}</Text>
              )}
            />
          </View>
          {hasilPromo != null ? (
            <>
              {this.hitungHargaPromoNominal() != null ? (
                <View
                  style={[
                    styles.positionPembayaran,
                    {marginVertical: hp('1%')},
                  ]}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.lihatText}>
                      Total Promo Potongan Harga
                    </Text>
                  </View>
                  {this.hitungHargaPromoNominal()}
                </View>
              ) : null}
              {this.hitungHargaPromoPoint() != null ? (
                <View
                  style={[
                    styles.positionPembayaran,
                    {marginVertical: hp('1%')},
                  ]}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.lihatText}>Total Promo Poin</Text>
                  </View>
                  {this.hitungHargaPromoPoint()}
                </View>
              ) : null}
              {hasilPromo.map((item, index) => (
                <View key={`${index}`}>
                  {item?.promo_reward?.nominal && item?.promo_reward?.disc && (
                    <View
                      style={{
                        borderTopWidth: 1,
                        // borderBottomWidth: 1,
                        borderColor: '#ddd',
                        marginHorizontal: wp('5%'),
                        paddingVertical: wp('2%'),
                      }}>
                      {shop.map((value, i) => {
                        if (value.promo_id == item.promo_id) {
                          return (
                            <View
                              key={i}
                              style={{
                                flexDirection: 'row',
                                marginTop: wp('1%'),
                                justifyContent: 'space-between',
                              }}>
                              <View style={{flexDirection: 'column'}}>
                                <Text style={styles.lihatText}>
                                  {'Nama Produk '}
                                </Text>
                              </View>
                              <View
                                style={{
                                  alignItems: 'flex-end',
                                  width: wp('55%'),
                                }}>
                                <Text style={styles.totalText}>
                                  {value?.name}
                                </Text>
                              </View>
                            </View>
                          );
                        }
                      })}
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: wp('1%'),
                          justifyContent: 'space-between',
                        }}>
                        <View style={{flexDirection: 'column'}}>
                          <Text style={styles.lihatText}>{'Nama Promo'}</Text>
                        </View>
                        <View
                          style={{
                            alignItems: 'flex-end',
                            width: wp('55%'),
                          }}>
                          <Text style={styles.totalText}>
                            {item?.promo_title}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: wp('1%'),
                          justifyContent: 'space-between',
                        }}>
                        <View style={{flexDirection: 'column'}}>
                          <Text style={styles.lihatText}>
                            {'Diskon Promo '}
                            {'( '}
                            {item?.promo_reward?.disc}
                            {'%'}
                            {' )'}
                          </Text>
                        </View>
                        <View style={{justifyContent: 'center'}}>
                          <Text style={styles.totalText}>
                            {' Rp '}
                            {item?.promo_reward?.nominal}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                  {item?.promo_reward?.nominal && !item?.promo_reward?.disc && (
                    <View
                      style={{
                        borderTopWidth: 1,
                        // borderBottomWidth: 1,
                        borderColor: '#ddd',
                        marginHorizontal: wp('5%'),
                        paddingVertical: wp('2%'),
                      }}>
                      {shop.map((value, i) => {
                        if (value.promo_id == item.promo_id) {
                          return (
                            <View
                              key={i}
                              style={{
                                flexDirection: 'row',
                                marginTop: wp('1%'),
                                justifyContent: 'space-between',
                              }}>
                              <View style={{flexDirection: 'column'}}>
                                <Text style={styles.lihatText}>
                                  {'Nama Produk '}
                                </Text>
                              </View>
                              <View
                                style={{
                                  alignItems: 'flex-end',
                                  width: wp('55%'),
                                }}>
                                <Text style={styles.totalText}>
                                  {value?.name}
                                </Text>
                              </View>
                            </View>
                          );
                        }
                      })}
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: wp('1%'),
                          justifyContent: 'space-between',
                        }}>
                        <View style={{flexDirection: 'column'}}>
                          <Text style={styles.lihatText}>{'Nama Promo'}</Text>
                        </View>
                        <View
                          style={{
                            alignItems: 'flex-end',
                            width: wp('55%'),
                          }}>
                          <Text style={styles.totalText}>
                            {item?.promo_title}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: wp('1%'),
                          justifyContent: 'space-between',
                        }}>
                        <View style={{flexDirection: 'column'}}>
                          <Text style={styles.lihatText}>
                            {'Nominal Promo '}
                          </Text>
                        </View>
                        <View style={{justifyContent: 'center'}}>
                          <Text style={styles.totalText}>
                            {'- Rp '}
                            {item?.promo_reward?.nominal}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                  {item?.promo_reward?.point && (
                    <View
                      style={{
                        borderTopWidth: 1,
                        borderColor: '#ddd',
                        marginHorizontal: wp('5%'),
                        paddingVertical: wp('2%'),
                      }}>
                      {shop.map((value, i) => {
                        if (value.promo_id == item.promo_id) {
                          return (
                            <View
                              key={i}
                              style={{
                                flexDirection: 'row',
                                marginTop: wp('1%'),
                                justifyContent: 'space-between',
                              }}>
                              <View style={{flexDirection: 'column'}}>
                                <Text style={styles.lihatText}>
                                  {'Nama Produk '}
                                </Text>
                              </View>
                              <View
                                style={{
                                  alignItems: 'flex-end',
                                  width: wp('55%'),
                                }}>
                                <Text style={styles.totalText}>
                                  {value?.name}
                                </Text>
                              </View>
                            </View>
                          );
                        }
                      })}
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: wp('1%'),
                          justifyContent: 'space-between',
                        }}>
                        <View style={{flexDirection: 'column'}}>
                          <Text style={styles.lihatText}>{'Nama Promo'}</Text>
                        </View>
                        <View
                          style={{
                            alignItems: 'flex-end',
                            width: wp('55%'),
                          }}>
                          <Text style={styles.totalText}>
                            {item?.promo_title}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: wp('1%'),
                          justifyContent: 'space-between',
                        }}>
                        <View style={{flexDirection: 'column'}}>
                          <Text style={styles.lihatText}>{'Poin Promo '}</Text>
                        </View>
                        <View style={{justifyContent: 'center'}}>
                          <Text style={styles.totalText}>
                            {'+ '}
                            {item?.promo_reward?.point}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                  {item?.promo_reward?.product?.map((val, index) => {
                    if (val.product_name != null && val.qty != null) {
                      return (
                        <View
                          style={{
                            backgroundColor: '#f4f4f4',
                            paddingVertical: hp('1%'),
                          }}
                          key={index}>
                          {shop.map((value, i) => {
                            if (value.promo_id == item.promo_id) {
                              return (
                                <View key={i}>
                                  <View style={[styles.positionPembayaran]}>
                                    <View style={{flexDirection: 'column'}}>
                                      <Text style={styles.lihatText}>
                                        {'Nama Produk '}
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        alignItems: 'flex-end',
                                        width: wp('55%'),
                                      }}>
                                      <Text style={styles.totalText}>
                                        {value?.name}
                                      </Text>
                                    </View>
                                  </View>
                                  <View
                                    style={[
                                      styles.positionPembayaran,
                                      {marginTop: hp('1%')},
                                    ]}>
                                    <Text style={styles.lihatText}>
                                      {'Hadiah Produk'}
                                    </Text>
                                    <View style={{width: wp('55%')}}>
                                      <Text style={styles.totalText}>
                                        {val.product_name}
                                      </Text>
                                    </View>
                                  </View>
                                  <View
                                    style={[
                                      styles.positionPembayaran,
                                      {marginVertical: hp('1%')},
                                    ]}>
                                    <Text style={styles.lihatText}>
                                      {'Jumlah'}
                                    </Text>
                                    <View style={{width: wp('55%')}}>
                                      <Text style={styles.totalText}>
                                        {val.qty}
                                        {' pcs'}
                                      </Text>
                                    </View>
                                  </View>
                                </View>
                              );
                            }
                          })}
                          {item.promo_all == 1 && (
                            <>
                              <View
                                style={[
                                  styles.positionPembayaran,
                                  {marginTop: hp('1%')},
                                ]}>
                                <Text style={styles.lihatText}>
                                  {'Hadiah Produk Umum'}
                                </Text>
                                <View style={{width: wp('55%')}}>
                                  <Text style={styles.totalText}>
                                    {val.product_name}
                                  </Text>
                                </View>
                              </View>
                              <View
                                style={[
                                  styles.positionPembayaran,
                                  {marginVertical: hp('1%')},
                                ]}>
                                <Text style={styles.lihatText}>{'Jumlah'}</Text>
                                <View style={{width: wp('55%')}}>
                                  <Text style={styles.totalText}>
                                    {val.qty}
                                    {' pcs'}
                                  </Text>
                                </View>
                              </View>
                            </>
                          )}
                        </View>
                      );
                    }
                  })}
                </View>
              ))}
            </>
          ) : null}
          {/* point */}

          <View style={[styles.positionPembayaran, {marginTop: 90}]}>
            {Math.round(this.props.dataUser?.point) >= 5000 ? (
              <>
                <View>
                  <Text
                    style={[
                      styles.priceProduct,
                      {
                        fontSize: hp('2.4%'),
                        marginLeft: wp('2.7%'),
                      },
                    ]}>
                    Pakai Point
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <NumberFormat
                    value={Math.round(this.props.dataUser?.point)}
                    displayType={'text'}
                    thousandSeparator={true}
                    // prefix={"Rp "}
                    fixedDecimalScale={true}
                    renderText={value => (
                      <Text
                        style={[
                          styles.priceProduct,
                          {
                            marginLeft: wp('2.7%'),
                            fontFamily: 'Lato-Bold',
                            fontSize: hp('2%'),
                            color: isSwitch === true ? '#51AF3E' : '#C2C2C2',
                          },
                        ]}>
                        {value || 0}
                      </Text>
                    )}
                  />
                  <Switch
                    trackColor={{false: '#C2C2C2', true: '#428733'}}
                    onValueChange={this.toggleSwitch}
                    value={isSwitch}
                    thumbColor={isSwitch === true ? '#51AF3E' : '#C2C2C2'}
                    // disabled={true}
                  />
                </View>
              </>
            ) : null}
          </View>

          <View style={[styles.positionPembayaran, {marginTop: hp('1%')}]}>
            <View>
              <Text
                style={[
                  styles.priceProduct,
                  {
                    marginLeft: wp('2.7%'),
                    color: '#575152',
                    fontSize: hp('2.4%'),
                  },
                ]}>
                Total Bayar
              </Text>
              {/* {console.log('hargaPromo', JSON.stringify(hargaPromo))} */}
              <NumberFormat
                value={
                  this.hitungTotalBayar() >= 0 ? this.hitungTotalBayar() : 0
                }
                displayType={'text'}
                thousandSeparator={true}
                prefix={'Rp '}
                // decimalScale={2}
                fixedDecimalScale={true}
                renderText={value => (
                  <Text
                    style={[
                      styles.priceProduct,
                      {
                        marginLeft: wp('2.7%'),
                        fontFamily: 'Lato-Bold',
                        fontSize: hp('2.4%'),
                      },
                    ]}>
                    {value}
                  </Text>
                )}
              />
              {/* {this.hitungHargaBayar()} */}
            </View>
            {this.state.pilihPembayaran !== 'Pilih Pembayaran' ? (
              <>
                {/* {console.log('disableButton', disableButton)} */}
                {disableButton ? (
                  <TouchableOpacity
                    style={[styles.buttonBayar, {backgroundColor: '#E07126'}]}
                    // onPress={() => {
                    //   this.postOrder();
                    //   this.setState({disableButton: false});
                    // }}
                  >
                    <IconBayar width={wp('7%')} height={wp('9%')} />
                    <Text style={styles.textBayar}>{'Pesan'}</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.buttonBayar}
                    onPress={() => {
                      this.setState({disableButton: true});
                      this.postOrder();
                    }}>
                    <IconBayar width={wp('7%')} height={wp('9%')} />
                    <Text style={styles.textBayar}>{'Pesan'}</Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <TouchableOpacity
                style={styles.buttonBayar}
                onPress={() =>
                  this.setState({
                    alertData: 'Harap Memilih Pilihan Pembayaran',
                    modalAlert: !this.state.modalAlert,
                  })
                }>
                <IconBayar width={wp('7%')} height={wp('9%')} />
                <Text style={styles.textBayar}>{'Pesan'}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* modal pembayaran */}
          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisiblePembayaran}
              onRequestClose={() => {
                this.setModalVisiblePembayaran(!modalVisiblePembayaran);
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <TouchableHighlight
                    onPress={() =>
                      this.setModalVisiblePembayaran(!modalVisiblePembayaran)
                    }
                    underlayColor="#DDDDDD"
                    activeOpacity={0.6}>
                    <View style={styles.button}>
                      <IconClose
                        fill={'white'}
                        width={wp('4%')}
                        height={hp('4%')}
                      />
                      <Text style={styles.textStyle}>{'Pilih Pembayaran'}</Text>
                    </View>
                  </TouchableHighlight>
                  <ScrollView>
                    {(this.props?.dataUser?.type_payment === 'T' ||
                      this.props?.dataUser?.type_payment === 'K') && (
                      <View>
                        <TouchableHighlight
                          onPress={() => {
                            this.setState({
                              pilihPembayaran: 'Bayar langsung di tempat (COD)',
                              image: (
                                <IconCOD
                                  width={wp('10%')}
                                  height={wp('10%')}
                                  // marginTop={wp('-2%')}
                                />
                              ),
                              keteranganPembayaran: '',
                              modalVisiblePembayaran: false,
                              valuePembayaran: 'cod',
                            });
                          }}
                          underlayColor="#DDDDDD"
                          activeOpacity={0.6}>
                          <View
                            style={[
                              styles.positionPembayaran,
                              {marginBottom: wp('2.5%')},
                            ]}>
                            <IconCOD width={wp('10%')} height={wp('10%')} />
                            <View style={styles.positionMetode}>
                              <Text
                                style={[
                                  styles.metodeText,
                                  {
                                    marginLeft: wp('0%'),
                                    height: hp('7%'),
                                    marginTop: wp('2.5%'),
                                  },
                                ]}>
                                Bayar langsung di tempat (COD)
                              </Text>
                            </View>
                          </View>
                        </TouchableHighlight>
                      </View>
                    )}
                    {this.props?.dataUser?.type_payment === 'K' && (
                      <View>
                        <TouchableHighlight
                          onPress={() => {
                            this.setState({
                              pilihPembayaran: 'Tempo',
                              image: (
                                <IconCreditcard
                                  width={wp('10%')}
                                  height={wp('10%')}
                                  marginTop={wp('-2%')}
                                />
                              ),
                              keteranganPembayaran: '',
                              modalVisiblePembayaran: false,
                              valuePembayaran: 'tempo',
                            });
                          }}
                          underlayColor="#DDDDDD"
                          activeOpacity={0.6}>
                          <View
                            style={[
                              styles.positionPembayaran,
                              {marginBottom: wp('2.5%')},
                            ]}>
                            <IconCreditcard
                              width={wp('10%')}
                              height={wp('10%')}
                            />
                            <View style={styles.positionMetode}>
                              <Text
                                style={[
                                  styles.metodeText,
                                  {
                                    marginLeft: wp('0%'),
                                    height: hp('7%'),
                                    marginTop: wp('2.5%'),
                                  },
                                ]}>
                                Tempo
                              </Text>
                            </View>
                          </View>
                        </TouchableHighlight>
                      </View>
                    )}
                    {/* belum ada fitur */}
                    {/* <View>
                      <TouchableHighlight
                        onPress={() => {
                          this.setState({
                            pilihPembayaran: 'Transfer Bank',
                            image: (
                              <IconMidtrans
                                width={wp('10%')}
                                height={wp('10%')}
                                // marginTop={wp('-2%')}
                              />
                            ),
                            modalVisiblePembayaran: false,
                            keteranganPembayaran: '',
                            valuePembayaran: 'transfer',
                          });
                        }}
                        underlayColor="#DDDDDD"
                        activeOpacity={0.6}>
                        <View
                          style={[
                            styles.positionPembayaran,
                            {marginBottom: wp('2.5%')},
                          ]}>
                          <IconMidtrans width={wp('10%')} height={wp('10%')} />
                          <View style={styles.positionMetode}>
                            <Text
                              style={[
                                styles.metodeText,
                                {
                                  marginLeft: wp('0%'),
                                  height: hp('5%'),
                                  // backgroundColor: 'blue',
                                  paddingTop: wp('2%'),
                                },
                              ]}>
                              Transfer Bank
                            </Text>
                          </View>
                        </View>
                      </TouchableHighlight>
                    </View> */}
                  </ScrollView>
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

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

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
  cardBackground: {
    backgroundColor: '#529F45',
    width,
    height: hp('13%'),
    marginLeft: wp('0%'),
    borderColor: '#F9F9F9',
    borderWidth: wp('0%'),
    justifyContent: 'center',
  },
  cardBackground2: {
    backgroundColor: '#FFF',
    width,
    height: hp('13%'),
    marginLeft: wp('0%'),
    borderColor: '#F9F9F9',
    borderWidth: wp('0%'),
    justifyContent: 'center',
  },
  promoText: {
    fontSize: hp('1.8%'),
    color: '#fff',
    fontFamily: 'Lato-Medium',
    marginLeft: wp('1.1%'),
  },
  diskonText: {
    fontSize: hp('1.6%'),
    color: '#fff',
    fontFamily: 'Lato-Medium',
    marginLeft: wp('1.1%'),
  },
  positionPembayaran: {
    flexDirection: 'row',
    marginTop: wp('1%'),
    marginLeft: wp('5%'),
    justifyContent: 'space-between',
    marginRight: wp('5%'),
    // backgroundColor: 'red',
    alignItems: 'center',
  },
  metodeText: {
    fontSize: hp('2%'),
    color: '#575251',
    fontFamily: 'Lato-Bold',
    marginLeft: wp('1.2%'),
  },
  lihatText: {
    fontSize: hp('1.8%'),
    color: '#575251',
    fontFamily: 'Lato-Medium',
    marginLeft: wp('1.1%'),
    marginTop: hp('1%'),
  },
  positionMetode: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  COD: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    width: wp('80%'),
    height: hp('10%'),
    borderRadius: Font(10),
    borderWidth: 1,
    paddingLeft: wp('2%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  totalText: {
    fontSize: hp('1.8%'),
    color: '#575251',
    fontFamily: 'Lato-Bold',
    textAlign: 'right',
  },
  titleRingkasan: {
    fontSize: hp('2%'),
    color: '#575251',
    fontFamily: 'Lato-Bold',
  },
  priceProduct: {
    fontSize: hp('2%'),
    color: '#575152',
    fontFamily: 'Lato-Bold',
  },
  buttonBayar: {
    backgroundColor: '#5CC443',
    borderRadius: wp('1%'),
    width: wp('37%'),
    height: hp('6%'),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: hp('3%'),
    // position: 'relative',
  },
  textBayar: {
    textAlign: 'center',
    color: '#fff',
    fontSize: hp('2%'),
    fontFamily: 'Lato-Bold',
    marginLeft: wp('2%'),
  },
  centeredView: {
    justifyContent: 'center',
    backgroundColor: '#rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: wp('100%'),
    marginTop: hp('60%'),
    backgroundColor: '#FFFFFF',
    borderRadius: Size(10),
    height: hp('40%'),
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
  buttonspecial: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('10%'),
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
    fontSize: hp('1.8%'),
    textAlign: 'center',
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
  loadingApi: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    width: wp('100%'),
    marginTop: hp('10%'),
  },
});

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
  dataUser: state.LoginReducer.dataUser,
  shop: state.ShoppingCartReducer.shop,
  shop_total: state.ShoppingCartReducer.shop_total,
  totalResult: state.ShoppingCartReducer.totalResult,
  totalDiscount: state.ShoppingCartReducer.totalDiscount,
  pengirimanOrder: state.ShoppingCartReducer.pengirimanOrder,
  // promoOrder: state.ShoppingCartReducer.promoOrder,
  // promoResult: state.ShoppingCartReducer.promo,
  hasilPromo: state.ShoppingCartReducer.hasilPromo,
  hargaPromo: state.ShoppingCartReducer.hargaPromo,
  hasilPromoNotif: state.ShoppingCartReducer.hasilPromoNotif,
});

const mapDispatchToProps = dispatch => {
  return {
    shopAct: (value, tipe) => {
      dispatch(ShoppingCartAction(value, tipe));
    },
    orderAct: (value, tipe) => {
      dispatch(OrderAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentMethod);
