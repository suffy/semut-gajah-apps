import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import Size from '../components/Fontresponsive';
import axios from 'axios';
import NumberFormat from 'react-number-format';
import CONFIG from '../constants/config';
import {Card} from 'react-native-elements';
import moment from 'moment';
import {ComplaintAction} from '../redux/Action';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Storage from '@react-native-async-storage/async-storage';
import IconBack from '../assets/icons/backArrow.svg';
import DummyImage from '../assets/icons/IconLogo.svg';
import Snackbar from 'react-native-snackbar';

const width = Dimensions.get('window').width;

export class OrderComplaintDetail extends Component {
  UNSAFE_componentWillMount() {
    // lor(this);
  }

  componentWillUnmount() {
    // rol();
  }

  postCloseComplaint = async () => {
    try {
      let response = await axios.post(
        `${CONFIG.BASE_URL}/api/complaint/close/${this.props.detailComplaint.id}`,
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      let data = response.data;
      if (data !== '' && data['success'] == true) {
        console.log(data);
        if (
          this.props.route.params &&
          this.props.route.params.screen == 'Distributor'
        ) {
          this.props.navigation.replace('OrderComplaint', {
            screen: 'Distributor',
          });
        } else {
          this.props.navigation.replace('OrderComplaint');
        }
      } else {
        console.log('Gagal akses data===>', data);
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

  getConfirmComplaint = async () => {
    console.log('this.props.detailComplaint.id', this.props.detailComplaint.id);
    try {
      let response = await axios({
        method: 'POST',
        url: `${CONFIG.BASE_URL}/api/distributor-partner/complaint/confirm/${this.props.detailComplaint.id}`,
        headers: {
          // 'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${this.props.token}`,
        },
        // data: createFormData(this.state.photo, {
        //   title: this.state.title,
        //   content: this.state.detail,
        // }),
      });
      let data = response.data;
      console.log(data);
      if (data !== '' && data['success'] == true) {
        if (
          this.props.route.params &&
          this.props.route.params.screen == 'Distributor'
        ) {
          this.props.navigation.replace('OrderComplaint', {
            screen: 'Distributor',
          });
        } else {
          this.props.navigation.replace('OrderComplaint');
        }
      } else {
        console.log('Gagal akses data===>', data);
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

  getRejectComplaint = async () => {
    try {
      let response = await axios({
        method: 'POST',
        url: `${CONFIG.BASE_URL}/api/distributor-partner/complaint/reject/${this.props.detailComplaint.id}`,
        headers: {
          // 'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${this.props.token}`,
        },
        // data: createFormData(this.state.photo, {
        //   title: this.state.title,
        //   content: this.state.detail,
        // }),
      });
      let data = response.data;
      console.log(data);
      if (data !== '' && data['success'] == true) {
        if (
          this.props.route.params &&
          this.props.route.params.screen == 'Distributor'
        ) {
          this.props.navigation.replace('OrderComplaint', {
            screen: 'Distributor',
          });
        } else {
          this.props.navigation.replace('OrderComplaint');
        }
      } else {
        console.log('Gagal akses data===>', data);
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

  getReplyComplaint = () => {
    if (
      this.props.route.params &&
      this.props.route.params.screen == 'Distributor'
    ) {
      this.props.navigation.navigate('ReplyComplaint', {screen: 'Distributor'});
    } else {
      this.props.navigation.navigate('ReplyComplaint');
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
    // console.log('cek====', JSON.stringify(this.props.detailComplaint));
    // let tes = this.props.detailComplaint.complaint_detail.length - 1;
    // console.log('this.props.detailComplaint.complaint_detail.pop()', tes);
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={[styles.container]}>
          <IconBack
            width={wp('4%')}
            height={hp('4%')}
            stroke="black"
            strokeWidth="2.5"
            fill="black"
            onPress={() => this.props.navigation.goBack()}
          />
          <Text style={styles.text}>{'Detail Komplain Pesanan'}</Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            height: '100%',
            marginBottom: wp('5%'),
            paddingLeft: wp('2%'),
          }}>
          <>
            <Card
              containerStyle={{
                borderRadius: wp('3%'),
                marginBottom: wp('1%'),
                marginLeft: wp('2%'),
              }}>
              <Text
                style={{
                  color: '#777',
                  fontSize: hp('1.7%'),
                  marginTop: wp('0%'),
                  marginBottom: wp('3%'),
                  marginLeft: wp('1%'),
                }}>
                {moment(
                  this.props.detailComplaint.order.order_details[0].created_at,
                ).format('LLL')}
              </Text>
              <View style={[styles.position2, {justifyContent: 'center'}]}>
                <View>
                  {this.props.detailComplaint?.order?.order_details[0]?.product
                    ?.image ? (
                    <Image
                      resizeMode="contain"
                      source={{
                        uri:
                          CONFIG.BASE_URL +
                          this.props.detailComplaint?.order?.order_details[0]
                            ?.product?.image,
                      }}
                      style={styles.imageStyle}
                    />
                  ) : (
                    <DummyImage style={styles.imageStyle} />
                  )}
                </View>
                <View style={[styles.textposition, {marginTop: wp('-2.5%')}]}>
                  <Text numberOfLines={3} multiline style={styles.title}>
                    {
                      this.props.detailComplaint.order.order_details[0].product
                        .name
                    }
                  </Text>
                  {this.props.detailComplaint.order.order_details[0].half ? (
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: hp('1.7%'),
                        fontFamily: 'Lato-Medium',
                        marginTop: wp('1%'),
                        color: '#17a2b8',
                      }}>
                      {'( '}
                      {
                        this.props.detailComplaint?.order.order_details[0]
                          ?.qty_konversi
                      }{' '}
                      {this.props.detailComplaint?.order.order_details[0]?.small_unit.charAt(
                        0,
                      ) +
                        this.props.detailComplaint?.order.order_details[0]?.small_unit
                          .slice(1)
                          .toLowerCase()}
                      {' )'}
                    </Text>
                  ) : null}
                  <NumberFormat
                    value={
                      Math.round(
                        this.props.detailComplaint.order.payment_final,
                      ) ?? '0'
                    }
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'Rp '}
                    renderText={value => (
                      <Text
                        numberOfLines={1}
                        style={{fontSize: hp('1.7%'), marginTop: wp('1%')}}>
                        Total: {value}
                      </Text>
                    )}
                  />
                </View>
              </View>
              {this.props.detailComplaint.order.order_details.length > '1' ? (
                <View style={styles.textposition}>
                  <Text
                    style={{
                      fontSize: hp('1.8%'),
                      marginTop: wp('2%'),
                      color: '#777',
                    }}>
                    +{this.props.detailComplaint.order.order_details.length - 1}
                    produk lainnya
                  </Text>
                </View>
              ) : null}
            </Card>
            {this.props.detailComplaint.complaint_detail.map(
              (itemComplaint, indexComplaint) => (
                <View key={indexComplaint}>
                  <Card
                    containerStyle={{
                      borderRadius: wp('3%'),
                      marginBottom: wp('1%'),
                      marginLeft: wp('2%'),
                    }}>
                    <View style={styles.position3}>
                      <View style={styles.position2}>
                        {/* {this.getStatusComplain()} */}
                        {this.props.route.params &&
                        this.props.route.params.screen == 'Distributor' ? (
                          <>
                            {this.props.detailComplaint.status ===
                            'rejected' ? (
                              <>
                                <Text style={styles.textKiri}>
                                  {'Status Komplain'}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: Size(12),
                                    fontFamily: 'Lato-Medium',
                                    marginBottom: wp('2%'),
                                  }}>
                                  {': '}
                                  {'Dibatalkan'}
                                </Text>
                              </>
                            ) : this.props.detailComplaint.status ===
                              'confirmed' ? (
                              <>
                                <Text style={styles.textKiri}>
                                  {'Status Komplain'}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: Size(12),
                                    fontFamily: 'Lato-Medium',
                                    marginBottom: wp('2%'),
                                  }}>
                                  {': '}
                                  {'Selesai'}
                                </Text>
                              </>
                            ) : (this.props.detailComplaint.status === null ||
                                this.props.detailComplaint.status === '') &&
                              this.props.detailComplaint.responded === 'true' &&
                              itemComplaint.user_id ===
                                this.props.dataUser.id &&
                              this.props.detailComplaint.complaint_detail
                                .length -
                                1 !==
                                indexComplaint ? (
                              <>
                                <Text style={styles.textKiri}>
                                  {'Status Komplain'}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: Size(12),
                                    fontFamily: 'Lato-Medium',
                                    marginBottom: wp('2%'),
                                  }}>
                                  {': '}
                                  {'Komplain sudah direspon'}
                                </Text>
                              </>
                            ) : (this.props.detailComplaint.status === null ||
                                this.props.detailComplaint.status === '') &&
                              this.props.detailComplaint.responded === 'true' &&
                              itemComplaint.user_id !==
                                this.props.dataUser.id &&
                              this.props.detailComplaint.complaint_detail
                                .length -
                                1 !==
                                indexComplaint ? (
                              <>
                                {console.log(
                                  'this.props.dataUser.id',
                                  itemComplaint.user_id,
                                  this.props.dataUser.id,
                                )}
                                <Text style={styles.textKiri}>
                                  {'Status Komplain'}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: Size(12),
                                    fontFamily: 'Lato-Medium',
                                    marginBottom: wp('2%'),
                                  }}>
                                  {': '}
                                  {'Balesan dari customer '}
                                </Text>
                              </>
                            ) : (this.props.detailComplaint.status === null ||
                                this.props.detailComplaint.status === '') &&
                              this.props.detailComplaint.responded === 'true' &&
                              itemComplaint.user_id !==
                                this.props.dataUser.id &&
                              this.props.detailComplaint.complaint_detail
                                .length -
                                1 ===
                                indexComplaint ? (
                              <>
                                <Text style={styles.textKiri}>
                                  {'Status Komplain'}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: Size(12),
                                    fontFamily: 'Lato-Medium',
                                    marginBottom: wp('2%'),
                                  }}>
                                  {': '}
                                  {'Balesan dari customer '}
                                </Text>
                              </>
                            ) : (this.props.detailComplaint.status === null ||
                                this.props.detailComplaint.status === '') &&
                              this.props.detailComplaint.responded === 'true' &&
                              itemComplaint.user_id ===
                                this.props.dataUser.id &&
                              this.props.detailComplaint.complaint_detail
                                .length -
                                1 ===
                                indexComplaint ? (
                              <>
                                <Text style={styles.textKiri}>
                                  {'Status Komplain'}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: Size(12),
                                    fontFamily: 'Lato-Medium',
                                    marginBottom: wp('2%'),
                                  }}>
                                  {': '}
                                  {'Komplain sudah direspon'}
                                </Text>
                              </>
                            ) : (this.props.detailComplaint.status === null ||
                                this.props.detailComplaint.status === '') &&
                              this.props.detailComplaint.responded ===
                                'false' &&
                              itemComplaint.user_id ===
                                this.props.dataUser.id &&
                              this.props.detailComplaint.complaint_detail
                                .length -
                                1 !==
                                indexComplaint ? (
                              <>
                                <Text style={styles.textKiri}>
                                  {'Status Komplain'}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: Size(12),
                                    fontFamily: 'Lato-Medium',
                                    marginBottom: wp('2%'),
                                  }}>
                                  {': '}
                                  {'Komplain sudah direspon'}
                                </Text>
                              </>
                            ) : (this.props.detailComplaint.status === null ||
                                this.props.detailComplaint.status === '') &&
                              this.props.detailComplaint.responded ===
                                'false' &&
                              itemComplaint.user_id !==
                                this.props.dataUser.id &&
                              this.props.detailComplaint.complaint_detail
                                .length -
                                1 !==
                                indexComplaint ? (
                              <>
                                <Text style={styles.textKiri}>
                                  {'Status Komplain'}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: Size(12),
                                    fontFamily: 'Lato-Medium',
                                    marginBottom: wp('2%'),
                                  }}>
                                  {': '}
                                  {'Balesan dari customer '}
                                </Text>
                              </>
                            ) : (this.props.detailComplaint.status === null ||
                                this.props.detailComplaint.status === '') &&
                              this.props.detailComplaint.responded ===
                                'false' &&
                              itemComplaint.user_id !==
                                this.props.dataUser.id &&
                              this.props.detailComplaint.complaint_detail
                                .length -
                                1 ===
                                indexComplaint ? (
                              <>
                                <Text style={styles.textKiri}>
                                  {'Status Komplain'}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: Size(12),
                                    fontFamily: 'Lato-Medium',
                                    marginBottom: wp('2%'),
                                  }}>
                                  {': '}
                                  {'Balesan dari customer '}
                                </Text>
                              </>
                            ) : (this.props.detailComplaint.status === null ||
                                this.props.detailComplaint.status === '') &&
                              this.props.detailComplaint.responded ===
                                'false' &&
                              itemComplaint.user_id ===
                                this.props.dataUser.id &&
                              this.props.detailComplaint.complaint_detail
                                .length -
                                1 ===
                                indexComplaint ? (
                              <>
                                <Text style={styles.textKiri}>
                                  {'Status Komplain'}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: Size(12),
                                    fontFamily: 'Lato-Medium',
                                    marginBottom: wp('2%'),
                                  }}>
                                  {': '}
                                  {'Komplain belum direspon customer '}
                                </Text>
                              </>
                            ) : null}
                          </>
                        ) : (
                          <>
                            {this.props.detailComplaint.status ===
                            'rejected' ? (
                              <>
                                <Text style={styles.textKiri}>
                                  {'Status Komplain'}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: Size(12),
                                    fontFamily: 'Lato-Medium',
                                    marginBottom: wp('2%'),
                                  }}>
                                  {': '}
                                  {'Dibatalkan'}
                                </Text>
                              </>
                            ) : this.props.detailComplaint.status ===
                              'confirmed' ? (
                              <>
                                <Text style={styles.textKiri}>
                                  {'Status Komplain'}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: Size(12),
                                    fontFamily: 'Lato-Medium',
                                    marginBottom: wp('2%'),
                                  }}>
                                  {': '}
                                  {'Selesai'}
                                </Text>
                              </>
                            ) : (this.props.detailComplaint.status === null ||
                                this.props.detailComplaint.status === '') &&
                              this.props.detailComplaint.responded === 'true' &&
                              itemComplaint.user_id ===
                                this.props.dataUser.id &&
                              this.props.detailComplaint.complaint_detail
                                .length -
                                1 !==
                                indexComplaint ? (
                              <>
                                <Text style={styles.textKiri}>
                                  {'Status Komplain'}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: Size(12),
                                    fontFamily: 'Lato-Medium',
                                    marginBottom: wp('2%'),
                                  }}>
                                  {': '}
                                  {'Komplain sudah direspon admin'}
                                </Text>
                              </>
                            ) : (this.props.detailComplaint.status === null ||
                                this.props.detailComplaint.status === '') &&
                              this.props.detailComplaint.responded === 'true' &&
                              itemComplaint.user_id !==
                                this.props.dataUser.id &&
                              this.props.detailComplaint.complaint_detail
                                .length -
                                1 !==
                                indexComplaint ? (
                              <>
                                {console.log(
                                  'this.props.dataUser.id',
                                  itemComplaint.user_id,
                                  this.props.dataUser.id,
                                )}
                                <Text style={styles.textKiri}>
                                  {'Status Komplain'}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: Size(12),
                                    fontFamily: 'Lato-Medium',
                                    marginBottom: wp('2%'),
                                  }}>
                                  {': '}
                                  {'Balesan dari admin'}
                                </Text>
                              </>
                            ) : (this.props.detailComplaint.status === null ||
                                this.props.detailComplaint.status === '') &&
                              this.props.detailComplaint.responded === 'true' &&
                              itemComplaint.user_id !==
                                this.props.dataUser.id &&
                              this.props.detailComplaint.complaint_detail
                                .length -
                                1 ===
                                indexComplaint ? (
                              <>
                                <Text style={styles.textKiri}>
                                  {'Status Komplain'}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: Size(12),
                                    fontFamily: 'Lato-Medium',
                                    marginBottom: wp('2%'),
                                  }}>
                                  {': '}
                                  {'Balesan dari admin'}
                                </Text>
                              </>
                            ) : (this.props.detailComplaint.status === null ||
                                this.props.detailComplaint.status === '') &&
                              this.props.detailComplaint.responded === 'true' &&
                              itemComplaint.user_id ===
                                this.props.dataUser.id &&
                              this.props.detailComplaint.complaint_detail
                                .length -
                                1 ===
                                indexComplaint ? (
                              <>
                                <Text style={styles.textKiri}>
                                  {'Status Komplain'}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: Size(12),
                                    fontFamily: 'Lato-Medium',
                                    marginBottom: wp('2%'),
                                  }}>
                                  {': '}
                                  {'Komplain sudah direspon admin'}
                                </Text>
                              </>
                            ) : (this.props.detailComplaint.status === null ||
                                this.props.detailComplaint.status === '') &&
                              this.props.detailComplaint.responded ===
                                'false' &&
                              itemComplaint.user_id ===
                                this.props.dataUser.id &&
                              this.props.detailComplaint.complaint_detail
                                .length -
                                1 !==
                                indexComplaint ? (
                              <>
                                <Text style={styles.textKiri}>
                                  {'Status Komplain'}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: Size(12),
                                    fontFamily: 'Lato-Medium',
                                    marginBottom: wp('2%'),
                                  }}>
                                  {': '}
                                  {'Komplain sudah direspon admin'}
                                </Text>
                              </>
                            ) : (this.props.detailComplaint.status === null ||
                                this.props.detailComplaint.status === '') &&
                              this.props.detailComplaint.responded ===
                                'false' &&
                              itemComplaint.user_id !==
                                this.props.dataUser.id &&
                              this.props.detailComplaint.complaint_detail
                                .length -
                                1 !==
                                indexComplaint ? (
                              <>
                                <Text style={styles.textKiri}>
                                  {'Status Komplain'}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: Size(12),
                                    fontFamily: 'Lato-Medium',
                                    marginBottom: wp('2%'),
                                  }}>
                                  {': '}
                                  {'Balesan dari admin'}
                                </Text>
                              </>
                            ) : (this.props.detailComplaint.status === null ||
                                this.props.detailComplaint.status === '') &&
                              this.props.detailComplaint.responded ===
                                'false' &&
                              itemComplaint.user_id !==
                                this.props.dataUser.id &&
                              this.props.detailComplaint.complaint_detail
                                .length -
                                1 ===
                                indexComplaint ? (
                              <>
                                <Text style={styles.textKiri}>
                                  {'Status Komplain'}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: Size(12),
                                    fontFamily: 'Lato-Medium',
                                    marginBottom: wp('2%'),
                                  }}>
                                  {': '}
                                  {'Balesan dari admin'}
                                </Text>
                              </>
                            ) : (this.props.detailComplaint.status === null ||
                                this.props.detailComplaint.status === '') &&
                              this.props.detailComplaint.responded ===
                                'false' &&
                              itemComplaint.user_id ===
                                this.props.dataUser.id &&
                              this.props.detailComplaint.complaint_detail
                                .length -
                                1 ===
                                indexComplaint ? (
                              <>
                                <Text style={styles.textKiri}>
                                  {'Status Komplain'}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: Size(12),
                                    fontFamily: 'Lato-Medium',
                                    marginBottom: wp('2%'),
                                  }}>
                                  {': '}
                                  {'Komplain belum direspon admin'}
                                </Text>
                              </>
                            ) : null}
                          </>
                        )}
                      </View>
                      <View
                        style={[styles.position2, {alignItems: 'flex-start'}]}>
                        <Text style={styles.textKiriIsi}>{'Judul'}</Text>
                        <Text
                          style={{
                            fontSize: Size(12),
                            fontFamily: 'Roboto',
                            marginTop: wp('0%'),
                            marginBottom: wp('2%'),
                            marginLeft: wp('-1%'),
                          }}>
                          {': '}
                        </Text>
                        <View
                          style={{
                            marginTop: wp('0%'),
                            marginBottom: wp('2%'),
                            width: wp('50%'),
                          }}>
                          <Text
                            style={{
                              fontSize: Size(12),
                              fontFamily: 'Roboto',
                            }}>
                            {itemComplaint.title}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={[styles.position2, {alignItems: 'flex-start'}]}>
                        <Text style={styles.textKiriIsi}>{'Penjelasan'}</Text>
                        <Text
                          style={{
                            fontSize: Size(12),
                            fontFamily: 'Roboto',
                            marginTop: wp('0%'),
                            marginBottom: wp('2%'),
                            marginLeft: wp('-1%'),
                          }}>
                          {': '}
                        </Text>
                        <View
                          style={{
                            marginTop: wp('0%'),
                            marginBottom: wp('2%'),
                            width: wp('50%'),
                          }}>
                          <Text
                            style={{
                              fontSize: Size(12),
                              fontFamily: 'Roboto',
                            }}>
                            {itemComplaint.content}
                          </Text>
                        </View>
                      </View>
                      {this.props.detailComplaint.qty != null ? (
                        <View style={styles.position2}>
                          <Text style={styles.textKiriIsi}>{'Jumlah'}</Text>
                          <Text
                            style={{
                              fontSize: Size(12),
                              fontFamily: 'Roboto',
                              marginTop: wp('0%'),
                              marginBottom: wp('2%'),
                              marginLeft: wp('-1%'),
                            }}>
                            {': '}
                            {this.props.detailComplaint.qty}
                          </Text>
                        </View>
                      ) : null}
                      {this.props.detailComplaint.option != null ? (
                        <View style={styles.position2}>
                          <Text style={styles.textKiriIsi}>
                            {'Pilihan pengembalian'}
                          </Text>
                          <Text
                            style={{
                              fontSize: Size(12),
                              fontFamily: 'Roboto',
                              marginTop: wp('0%'),
                              marginBottom: wp('2%'),
                              marginLeft: wp('-1%'),
                            }}>
                            {': '}
                            {this.props.detailComplaint.option}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                    {itemComplaint.file_1 ||
                    itemComplaint.file_2 ||
                    itemComplaint.file_3 ||
                    itemComplaint.file_4 ? (
                      <>
                        <View
                          style={[styles.textKiriIsi, {flexDirection: 'row'}]}>
                          <Text
                            style={{
                              fontSize: Size(12),
                              fontFamily: 'Lato-Medium',
                            }}>
                            {'Lampiran'}
                          </Text>
                          <Text
                            style={{
                              fontSize: Size(12),
                              fontFamily: 'Roboto',
                            }}>
                            {' (Opsional)'}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.position2,
                            {
                              marginTop: wp('2%'),
                              flexDirection: 'column',
                            },
                          ]}>
                          {itemComplaint.file_1 ? (
                            <Image
                              resizeMode={'cover'}
                              source={{
                                uri: CONFIG.BASE_URL + itemComplaint.file_1,
                              }}
                              style={styles.imageStyle2}
                            />
                          ) : null}
                          {itemComplaint.file_2 ? (
                            <Image
                              resizeMode={'cover'}
                              source={{
                                uri: CONFIG.BASE_URL + itemComplaint.file_2,
                              }}
                              style={styles.imageStyle2}
                            />
                          ) : null}
                          {itemComplaint.file_3 ? (
                            <Image
                              resizeMode={'cover'}
                              source={{
                                uri: CONFIG.BASE_URL + itemComplaint.file_3,
                              }}
                              style={styles.imageStyle2}
                            />
                          ) : null}
                        </View>
                      </>
                    ) : null}
                  </Card>
                  {/* {this.props.detailComplaint.complaint_detail[this.props.detailComplaint.complaint_detail.length - 1].user_id == this.props.dataUser.id && (
                  <Card containerStyle={{ borderRadius: wp('3%'), marginBottom: wp('1%'), marginLeft: wp('2%') }}>
                    <View style={styles.position3}>
                      <Text style={{ fontSize: Size(12), fontFamily: 'Lato-Medium' }}>Jawaban Komplain</Text>
                      <Text style={{ fontSize: Size(12), fontFamily: 'Roboto', marginTop: wp('3%'), marginBottom: wp('1%'), marginLeft: wp('-1%'), color: "#777" }}> Belum ada jawaban</Text>
                    </View>
                  </Card>
                )} */}
                </View>
              ),
            )}
            {this.props.detailComplaint.status != 'confirmed' &&
              this.props.detailComplaint.status != 'rejected' && (
                <View style={[styles.position2, {justifyContent: 'center'}]}>
                  <TouchableOpacity
                    style={[
                      styles.buttonTidak,
                      {
                        marginTop: wp('2%'),
                        marginBottom: wp('2%'),
                        // marginLeft: wp('2%'),
                        width: wp('90%'),
                      },
                    ]}
                    onPress={() => this.getReplyComplaint()}>
                    <Text style={styles.textButton}>{'Balas Komplain'}</Text>
                  </TouchableOpacity>
                </View>
              )}
            {this.props.route.params &&
              this.props.route.params.screen == 'Distributor' &&
              this.props.detailComplaint.complaint_detail.length > 1 &&
              this.props.detailComplaint.status != 'confirmed' &&
              this.props.detailComplaint.status != 'rejected' && (
                <View style={[styles.position2, {justifyContent: 'center'}]}>
                  <TouchableOpacity
                    style={{
                      marginTop: wp('2%'),
                      marginBottom: wp('2%'),
                      // marginLeft: wp('2%'),
                      width: wp('90%'),
                      backgroundColor: '#FFF',
                      borderColor: 'red',
                      borderWidth: 1,
                      borderRadius: wp('5%'),
                      height: hp('6%'),
                      justifyContent: 'center',
                      alignSelf: 'center',
                      marginTop: wp('3%'),
                    }}
                    onPress={() => this.getRejectComplaint()}>
                    <Text style={[styles.textButton, {color: 'red'}]}>
                      {'Tolak Komplain'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            {this.props.route.params &&
              this.props.route.params.screen == 'Distributor' &&
              this.props.detailComplaint.status != 'confirmed' &&
              this.props.detailComplaint.status != 'rejected' && (
                <View style={[styles.position2, {justifyContent: 'center'}]}>
                  <TouchableOpacity
                    style={{
                      marginTop: wp('2%'),
                      marginBottom: wp('2%'),
                      // marginLeft: wp('2%'),
                      width: wp('90%'),
                      backgroundColor: '#FFF',
                      borderColor: '#529F45',
                      borderWidth: 1,
                      borderRadius: wp('5%'),
                      height: hp('6%'),
                      justifyContent: 'center',
                      alignSelf: 'center',
                      marginTop: wp('3%'),
                    }}
                    onPress={() => this.getConfirmComplaint()}>
                    <Text style={[styles.textButton, {color: '#529F45'}]}>
                      {'Terima Komplain'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
          </>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
  dataUser: state.LoginReducer.dataUser,
  detailComplaint: state.ComplaintReducer.detailComplaint,
});

const mapDispatchToProps = dispatch => {
  return {
    complaintAct: (value, tipe) => {
      dispatch(ComplaintAction(value, tipe));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OrderComplaintDetail);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: hp('8%'),
    backgroundColor: 'white',
    paddingLeft: wp('5%'),
    paddingHorizontal: wp('5%'),
    borderBottomWidth: 4,
    borderColor: '#ddd',
  },
  text: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('2.4%'),
    paddingLeft: wp('5%'),
  },
  container2: {
    flexDirection: 'row',
    marginLeft: wp('4%'),
    height: hp('5%'),
    backgroundColor: 'white',
    alignItems: 'center',
    marginBottom: wp('4%'),
    marginTop: wp('1%'),
  },
  position2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: wp('0%'),
  },
  position3: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: wp('0%'),
  },
  title: {
    fontSize: hp('1.8%'),
    fontFamily: 'Lato-Medium',
    textAlign: 'auto',
    width: wp('60%'),
    marginTop: wp('2%'),
  },
  imageStyle: {
    height: hp('12%'),
    width: wp('20%'),
    backgroundColor: '#F9F9F9',
    borderRadius: Size(10),
    marginLeft: wp('1%'),
  },
  imageStyle2: {
    flex: 1,
    height: wp('40%'),
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: Size(10),
    marginBottom: wp('2%'),
  },
  textposition: {
    flex: 1,
    paddingHorizontal: 10,
  },
  buttonTerima: {
    backgroundColor: '#529F45',
    borderRadius: wp('5%'),
    width: wp('40%'),
    height: hp('6%'),
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: wp('3%'),
  },
  buttonTidak: {
    backgroundColor: '#E07126',
    borderRadius: wp('5%'),
    width: wp('45%'),
    height: hp('6%'),
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: wp('3%'),
  },
  textButton: {
    fontSize: hp('1.8%'),
    color: '#fff',
    fontFamily: 'Lato-Medium',
    alignSelf: 'center',
  },
  buttonSelesai: {
    backgroundColor: '#529F45',
    borderRadius: wp('5%'),
    width: wp('92.5%'),
    height: hp('6%'),
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: wp('3%'),
  },

  textKiri: {
    fontSize: Size(12),
    fontFamily: 'Roboto',
    marginTop: wp('0%'),
    marginBottom: wp('2%'),
    marginLeft: wp('-1%'),
    width: wp('34%'),
  },
  textKiriIsi: {
    fontSize: Size(12),
    fontFamily: 'Roboto',
    marginTop: wp('0%'),
    marginBottom: wp('2%'),
    marginLeft: wp('-1%'),
    width: wp('35%'),
  },
});
