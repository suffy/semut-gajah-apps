import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import Size from '../components/Fontresponsive';
import axios from 'axios';
import NumberFormat from 'react-number-format';
import CONFIG from '../constants/config';
import {Card} from 'react-native-elements';
import moment from 'moment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Storage from '@react-native-async-storage/async-storage';
import IconBack from '../assets/icons/backArrow.svg';
import ModalAlert from '../components/ModalAlert';
import DummyImage from '../assets/icons/IconLogo.svg';
import Snackbar from 'react-native-snackbar';

const createFormData = (photo, body) => {
  const data = new FormData();
  photo?.assets?.forEach((item, index) => {
    data.append(`file_${index + 1}`, {
      name: item.fileName,
      type: item.type,
      uri:
        Platform.OS === 'android' ? item.uri : item.uri.replace('file://', ''),
    });
  });

  Object.keys(body).forEach(key => {
    data.append(key, body[key]);
  });

  return data;
};

export class ReplyComplaint extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      title: '',
      detail: '',
      photo: null,
      alertData: '',
      modalAlert: false,
    };
  }

  UNSAFE_componentWillMount() {
    // lor(this);
  }

  componentWillUnmount() {
    // rol();
  }

  postReplyComplaint = async () => {
    console.log('aaaaa', this.state.title);
    console.log('bbbbb', this.state.detail);
    console.log('ccccc', this.props.detailComplaint.id);
    if (this.state.title == '') {
      this.setState({
        alertData: 'Harap mengisi judul masalah yang akan dikomplain',
        modalAlert: !this.state.modalAlert,
      });
    } else if (this.state.detail == '') {
      this.setState({
        alertData: 'Harap mengisi detail masalah yang akan dikomplain',
        modalAlert: !this.state.modalAlert,
      });
    } else {
      try {
        let response;
        if (
          this.props.route.params &&
          this.props.route.params.screen == 'Distributor'
        ) {
          response = await axios({
            method: 'POST',
            url: `${CONFIG.BASE_URL}/api/distributor-partner/complaint/reply/${this.props.detailComplaint.id}`,
            headers: {
              // 'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${this.props.token}`,
            },
            data: {
              title: this.state.title,
              content: this.state.detail,
            },
            // data: createFormData(this.state.photo, {
            //   title: this.state.title,
            //   content: this.state.detail,
            // }),
          });
        } else {
          response = await axios({
            method: 'POST',
            url: `${CONFIG.BASE_URL}/api/complaint/reply/${this.props.detailComplaint.id}`,
            headers: {
              // 'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${this.props.token}`,
            },
            data: {
              title: this.state.title,
              content: this.state.detail,
            },
            // data: createFormData(this.state.photo, {
            //   title: this.state.title,
            //   content: this.state.detail,
            // }),
          });
        }
        let data = response.data;
        if (data !== '' && data['success'] == true) {
          this.setState({photo: null});
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
          console.log('Gagal input komplain===>', data);
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

  // postReplyComplaint = () => {
  //     axios
  //         .post(
  //             `${CONFIG.BASE_URL}/api/complaint/reply/${this.props.detailComplaint.id}`,
  //             {
  //                 title: this.state.title,
  //                 content: this.state.detail,
  //                 file_1: null,
  //                 file_2: null,
  //                 file_3: null,
  //                 file_4: null,
  //             },
  //             {
  //                 headers: { Authorization: `Bearer ${this.props.token}` },
  //             },
  //         )
  //         .then(response => {
  //             let data = response.data;
  //             if (data !== '' && data['success'] == true) {
  //                 this.props.navigation.navigate('OrderComplaint');
  //             } else {
  //                 console.log(response.data);
  //             }
  //         })
  //         .catch(error => {
  //   let error429 =
  //   JSON.parse(JSON.stringify(error)).message ===
  //   'Request failed with status code 429';
  // let errorNetwork =
  //   JSON.parse(JSON.stringify(error)).message === 'Network Error';
  // let error400 =
  //   JSON.parse(JSON.stringify(error)).message ===
  //   'Request failed with status code 400';
  // console.log(
  //   'Cek Error========================',
  //   JSON.parse(JSON.stringify(error)).message,
  // );
  // if (error400) {
  //   Storage.removeItem('token');
  //   this.props.navigation.navigate('Home');
  // }
  // //         });
  // };

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
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <ModalAlert
          modalAlert={this.state.modalAlert}
          alert={this.state.alertData}
          getCloseAlertModal={() => this.getCloseAlertModal()}
        />
        <View style={[styles.container]}>
          <IconBack
            width={wp('4%')}
            height={hp('4%')}
            stroke="black"
            strokeWidth="2.5"
            fill="black"
            onPress={() => this.props.navigation.goBack()}
          />
          <Text style={styles.text}>{'Komplain Pesanan'}</Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{marginBottom: wp('3%')}}>
          <View>
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
                <Text
                  style={{
                    fontSize: hp('1.6%'),
                    color: '#777',
                  }}>
                  +{this.props.detailComplaint.order.order_details.length - 1}{' '}
                  produk lainnya
                </Text>
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
                    {itemComplaint.file_1 ||
                    itemComplaint.file_2 ||
                    itemComplaint.file_3 ||
                    itemComplaint.file_4 ? (
                      <>
                        <View
                          style={[styles.position2, {marginLeft: wp('-1%')}]}>
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
                          {itemComplaint.file_1 && (
                            <Image
                              resizeMode={'cover'}
                              source={
                                itemComplaint.file_1
                                  ? {
                                      uri:
                                        CONFIG.BASE_URL + itemComplaint.file_1,
                                    }
                                  : null
                              }
                              style={styles.imageStyle2}
                            />
                          )}
                          {itemComplaint.file_2 && (
                            <Image
                              resizeMode={'cover'}
                              source={
                                itemComplaint.file_2
                                  ? {
                                      uri:
                                        CONFIG.BASE_URL + itemComplaint.file_2,
                                    }
                                  : null
                              }
                              style={styles.imageStyle2}
                            />
                          )}
                          {itemComplaint.file_3 && (
                            <Image
                              resizeMode={'cover'}
                              source={
                                itemComplaint.file_3
                                  ? {
                                      uri:
                                        CONFIG.BASE_URL + itemComplaint.file_3,
                                    }
                                  : null
                              }
                              style={styles.imageStyle2}
                            />
                          )}
                        </View>
                      </>
                    ) : null}
                  </Card>
                  {itemComplaint[1]?.title.length === 0 && (
                    <Card
                      containerStyle={{
                        borderRadius: wp('3%'),
                        marginBottom: wp('1%'),
                        marginLeft: wp('2%'),
                      }}>
                      <View style={styles.position3}>
                        <Text
                          style={{
                            fontSize: Size(12),
                            fontFamily: 'Lato-Medium',
                          }}>
                          Jawaban Komplain
                        </Text>
                        <Text
                          style={{
                            fontSize: Size(12),
                            fontFamily: 'Roboto',
                            marginTop: wp('3%'),
                            marginBottom: wp('1%'),
                            marginLeft: wp('-1%'),
                            color: '#777',
                          }}>
                          {' '}
                          Belum ada jawaban
                        </Text>
                      </View>
                    </Card>
                  )}
                </View>
              ),
            )}
            <Card
              containerStyle={{
                borderRadius: wp('3%'),
                marginBottom: wp('1%'),
                marginLeft: wp('2%'),
              }}>
              <View style={styles.textAreaContainer}>
                <TextInput
                  autoCapitalize="none"
                  style={styles.inputStyle}
                  placeholder="Judul Masalah"
                  placeholderTextColor="#A4A4A4"
                  onChangeText={value => {
                    this.setState({title: value});
                  }}
                />
              </View>
              <View style={styles.textAreaContainer}>
                <TextInput
                  autoCapitalize="none"
                  style={styles.textArea}
                  underlineColorAndroid="transparent"
                  numberOfLines={10}
                  multiline={true}
                  placeholder="Detail Masalah"
                  placeholderTextColor="#A4A4A4"
                  onChangeText={value => {
                    this.setState({detail: value});
                  }}
                />
              </View>
            </Card>
            <TouchableOpacity
              style={[
                styles.buttonSelesai,
                {
                  marginTop: wp('4%'),
                  marginBottom: wp('4%'),
                },
              ]}
              onPress={() => {
                this.postReplyComplaint();
              }}>
              <Text style={styles.textButton}>Kirim</Text>
            </TouchableOpacity>
          </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(ReplyComplaint);

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
  position2: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginLeft: wp('0%'),
  },
  position3: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: wp('0%'),
  },
  imageStyle: {
    height: hp('12%'),
    width: wp('20%'),
    backgroundColor: '#F9F9F9',
    borderRadius: Size(10),
    marginLeft: wp('1%'),
  },
  title: {
    fontSize: hp('1.8%'),
    fontFamily: 'Lato-Medium',
    textAlign: 'auto',
    width: wp('60%'),
    marginTop: wp('2%'),
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
    marginBottom: wp('3%'),
  },
  textArea: {
    height: hp('18%'),
    textAlignVertical: 'top',
    marginLeft: wp('1%'),
  },
  inputStyle: {
    marginLeft: wp('1%'),
  },
  buttonSelesai: {
    backgroundColor: '#529F45',
    borderRadius: 10,
    width: wp('92.5%'),
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
  imageStyle2: {
    flex: 1,
    height: wp('40%'),
    width: '100%',
    backgroundColor: '#F9F9F9',
    borderRadius: Size(10),
    marginBottom: wp('2%'),
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
