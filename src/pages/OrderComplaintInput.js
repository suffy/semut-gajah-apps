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
  TouchableWithoutFeedback,
} from 'react-native';
import {connect} from 'react-redux';
import Size from '../components/Fontresponsive';
import axios from 'axios';
import NumberFormat from 'react-number-format';
import CONFIG from '../constants/config';
import {Card} from 'react-native-elements';
import moment from 'moment';
import IconPlus2 from '../assets/icons/Plus2.svg';
import {OrderAction} from '../redux/Action';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Storage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import IconBack from '../assets/icons/backArrow.svg';
import IconPlus from '../assets/icons/Plus.svg';
import IconMinus from '../assets/icons/Minus.svg';
import {Picker} from '@react-native-picker/picker';
import ModalAlert from '../components/ModalAlert';
import DummyImage from '../assets/icons/IconLogo.svg';
import Snackbar from 'react-native-snackbar';

const width = Dimensions.get('window').width;

const createFormData = (photo, body) => {
  const data = new FormData();
  photo?.assets?.forEach((item, index) => {
    data.append(`file_${index + 1}`, {
      uri: image['path'],
      type: image['mime'],
      name:
        Platform.OS === 'ios'
          ? image['filename']
          : `my_profile_${Date.now()}.${
              image['mime'] === 'image/jpeg' ? 'jpg' : 'png'
            }`,
    });
  });

  Object.keys(body).forEach(key => {
    data.append(key, body[key]);
  });

  return data;
};

export class OrderComplaintTransaction extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      title: '',
      detail: '',
      photo: null,
      photo2: null,
      photo3: null,
      video: null,
      qty: 0,
      pilih: '',
      video: null,
      complaint: [],
      produk: '',
      buttonDisabled: false,
      alertData: '',
      modalAlert: false,
    };
  }

  UNSAFE_componentWillMount() {
    // lor(this);
    console.log('cek item====', JSON.stringify(this.props.orderComplaint));
    const {orderComplaint} = this.props;
    let arr = orderComplaint.data_item.map((item, index) => {
      item.isSelected = false;
      return {...item};
    });
    this.setState({complaint: arr});
  }

  componentWillUnmount() {
    // rol();
  }

  handleChoosePhoto = async () => {
    ImagePicker.openPicker({
      cropping: true,
      width: 300,
      height: 300,
      freeStyleCropEnabled: true,
      mediaType: 'photo',
      // includeBase64: true,
      // includeExif: true,
      // multiple: false,
      // compressImageQuality: 0.8,
    })
      .then(image => {
        this.setState({
          photo: image,
        });
        let source = image;
        console.log('DATA SESUDAH2 ===>', JSON.stringify(source));
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleChoosePhoto2 = async () => {
    ImagePicker.openPicker({
      cropping: true,
      width: 300,
      height: 300,
      freeStyleCropEnabled: true,
      mediaType: 'photo',
      // includeBase64: true,
      // includeExif: true,
      // multiple: false,
      // compressImageQuality: 0.8,
    })
      .then(image => {
        this.setState({
          photo2: image,
        });
        let source = image;
        console.log('DATA SESUDAH2 ===>', JSON.stringify(source));
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleChoosePhoto3 = async () => {
    ImagePicker.openPicker({
      cropping: true,
      width: 300,
      height: 300,
      freeStyleCropEnabled: true,
      mediaType: 'photo',
      // includeBase64: true,
      // includeExif: true,
      // multiple: false,
      // compressImageQuality: 0.8,
    })
      .then(image => {
        this.setState({
          photo3: image,
        });
        let source = image;
        console.log('DATA SESUDAH2 ===>', JSON.stringify(source));
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleChooseVideo = async () => {
    ImagePicker.openPicker({
      mediaType: 'video',
      compressImageQuality: 0.5,
    })
      .then(video => {
        console.log('cek=====', video);
        if (video.size > 5000000) {
          this.setState({
            alertData: 'Ukuran video tidak boleh lebih dari 5 mb',
            modalAlert: !this.state.modalAlert,
          });
        } else {
          this.setState({video: video});
          console.log('DATA SESUDAH2 ===>', JSON.stringify(video));
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  postComplaint = async () => {
    this.setState({buttonDisabled: true});
    if (this.state.produk == '') {
      this.setState({
        alertData: 'Harap memilih produk yang akan dikomplain',
        modalAlert: !this.state.modalAlert,
        buttonDisabled: false,
      });
    } else if (this.state.title == '') {
      this.setState({
        alertData: 'Harap mengisi judul masalah yang akan dikomplain',
        modalAlert: !this.state.modalAlert,
        buttonDisabled: false,
      });
    } else if (this.state.detail == '') {
      this.setState({
        alertData: 'Harap mengisi detail masalah yang akan dikomplain',
        modalAlert: !this.state.modalAlert,
        buttonDisabled: false,
      });
    } else {
      const formData = new FormData();
      formData.append('order_id', this.props.orderComplaint.id);
      formData.append('brand_id', this.state.produk.product_id);
      formData.append('title', this.state.title);
      formData.append('content', this.state.detail);
      {
        this.state.qty == 0 ? null : formData.append('qty', this.state.qty);
      }
      {
        this.state.pilih == 'Pilihan'
          ? null
          : formData.append('option', this.state.pilih);
      }
      {
        this.state.produk.half
          ? formData.append('half', this.state.produk.half)
          : null;
      }
      {
        this.state.photo
          ? formData.append('file_1', {
              name: this.state.photo?.path.split('/').pop(),
              type: this.state.photo?.mime,
              uri:
                Platform.OS === 'android'
                  ? this.state.photo?.path
                  : this.state.photo?.path.replace('file://', ''),
            })
          : null;
      }
      {
        this.state.photo2
          ? formData.append('file_2', {
              name: this.state.photo2?.path.split('/').pop(),
              type: this.state.photo2?.mime,
              uri:
                Platform.OS === 'android'
                  ? this.state.photo2?.path
                  : this.state.photo2?.path.replace('file://', ''),
            })
          : null;
      }
      {
        this.state.photo3
          ? formData.append('file_3', {
              name: this.state.photo3?.path.split('/').pop(),
              type: this.state.photo3?.mime,
              uri:
                Platform.OS === 'android'
                  ? this.state.photo3?.path
                  : this.state.photo3?.path.replace('file://', ''),
            })
          : null;
      }
      // {
      //   this.state.video
      //     ? formData.append('file_4', {
      //         name: this.state.video?.path.split('/').pop(),
      //         type: this.state.video?.mime,
      //         uri:
      //           Platform.OS === 'android'
      //             ? this.state.video?.path
      //             : this.state.video?.path.replace('file://', ''),
      //       })
      //     : null;
      // }
      console.log('data', JSON.stringify(formData));
      try {
        let response = await axios({
          method: 'POST',
          url: `${CONFIG.BASE_URL}/api/complaint`,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${this.props.token}`,
          },
          data: formData,
        });
        let data = response.data;
        if (data !== '' && data['success'] == true) {
          console.log('DATA SUKSESSS', data);
          this.setState({buttonDisabled: false});
          this.setState({photo: null});
          this.props.navigation.replace('OrderComplaint');
        } else {
          this.setState({
            alertData: 'Gagal menginput komplain',
            modalAlert: !this.state.modalAlert,
          });
          console.log('Gagal input komplain===>', data);
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

  handleMinus = () => {
    if (this.state.qty == 0) {
      this.setState({qty: 0});
    } else if (this.state.qty > 0) {
      this.setState({qty: this.state.qty - 1});
    }
  };

  handlePlus = () => {
    const {produk} = this.state;
    if (this.state.qty == produk.qty) {
      this.setState({qty: produk.qty});
    } else if (this.state.qty < produk.qty) {
      this.setState({qty: this.state.qty + 1});
    } else {
      this.setState({
        alertData: 'Gagal input jumlah, harap pilih produk diatas',
        modalAlert: !this.state.modalAlert,
      });
    }
  };

  changeColour = index => {
    const {complaint} = this.state;
    let arr = complaint.map((val, i) => {
      if (index == i) {
        val.isSelected = !val.isSelected;
        if (val.isSelected) {
          this.setState({produk: val});
        } else {
          this.setState({produk: ''});
        }
      } else {
        val.isSelected = false;
      }
      return {...val};
    });
    this.setState({complaint: arr});
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

  render() {
    const {photo, photo2, photo3, video} = this.state;
    console.log('cek data----', JSON.stringify(this.state.produk), photo);
    console.log('cek data----', JSON.stringify(this.state.complaint));
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
        <View style={styles.container3}>
          <Card containerStyle={styles.cardBackground}>
            <View style={styles.position2}>
              <Text
                style={{
                  fontSize: hp('1.8%'),
                  fontFamily: 'Lato-Medium',
                }}>
                Ceritakan komplainmu disini
              </Text>
            </View>
          </Card>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            marginBottom: wp('3%'),
            marginLeft: wp('2%'),
          }}>
          <View style={[styles.position2, {marginLeft: hp('1.5%')}]}>
            <Text
              style={{
                fontSize: hp('1.6%'),
                fontFamily: 'Lato-Medium',
              }}>
              Pilih produk yang akan dikomplain
            </Text>
          </View>
          {this.state.complaint.map((item, index) => (
            <View key={`${item.id}`}>
              {item.product ? (
                <>
                  {item.isSelected ? (
                    <TouchableWithoutFeedback
                      onPress={() => this.changeColour(index)}>
                      <Card
                        containerStyle={{
                          borderRadius: wp('3%'),
                          marginBottom: wp('1%'),
                          marginLeft: wp('2%'),
                          backgroundColor: '#d8ffd4',
                          borderColor: '#d8ffd4',
                        }}>
                        {/* <Text
                style={{
                  color: '#777',
                  fontSize: hp('1.7%'),
                  fontFamily: 'Lato-Medium',
                  marginTop: wp('0%'),
                  marginBottom: wp('3%'),
                  marginLeft: wp('1%'),
                }}>
                {moment(this.props.orderComplaint.created_at).format('LLL')}
              </Text> */}
                        <View
                          style={[
                            styles.position2,
                            {justifyContent: 'center'},
                          ]}>
                          <View>
                            {item.product?.image ? (
                              <Image
                                resizeMode="contain"
                                source={{
                                  uri: CONFIG.BASE_URL + item.product?.image,
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
                              style={[styles.title, {color: '#000'}]}>
                              {item.product.name}
                            </Text>
                            {item.half ? (
                              <Text
                                numberOfLines={1}
                                style={{
                                  fontSize: hp('1.7%'),
                                  fontFamily: 'Lato-Medium',
                                  marginTop: wp('1%'),
                                  color: '#17a2b8',
                                }}>
                                {'( '}
                                {item?.qty_konversi}{' '}
                                {item?.small_unit.charAt(0) +
                                  item?.small_unit.slice(1).toLowerCase()}
                                {' )'}
                              </Text>
                            ) : null}
                          </View>
                        </View>
                        {/* {this.props.orderComplaint.data_item.length > '1' ? (
                <View style={styles.textposition}>
                  <Text
                    style={{
                      fontSize: hp('1.8%'),
                      fontFamily: 'Lato-Medium',
                      marginTop: wp('2%'),
                      color: '#777',
                    }}>
                    +{this.props.orderComplaint.data_item.length - 1} produk
                    lainnya
                  </Text>
                </View>
              ) : null} */}
                      </Card>
                    </TouchableWithoutFeedback>
                  ) : (
                    <TouchableWithoutFeedback
                      onPress={() => this.changeColour(index)}>
                      <Card
                        containerStyle={{
                          borderRadius: wp('3%'),
                          marginBottom: wp('1%'),
                          marginLeft: wp('2%'),
                        }}>
                        {/* <Text
                style={{
                  color: '#777',
                  fontSize: hp('1.7%'),
                  fontFamily: 'Lato-Medium',
                  marginTop: wp('0%'),
                  marginBottom: wp('3%'),
                  marginLeft: wp('1%'),
                }}>
                {moment(this.props.orderComplaint.created_at).format('LLL')}
              </Text> */}
                        <View
                          style={[
                            styles.position2,
                            {justifyContent: 'center'},
                          ]}>
                          <View>
                            {item.product?.image ? (
                              <Image
                                resizeMode="contain"
                                source={{
                                  uri: CONFIG.BASE_URL + item.product?.image,
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
                              style={[styles.title, {color: '#000'}]}>
                              {item.product.name}
                            </Text>
                            {item.half ? (
                              <Text
                                numberOfLines={1}
                                style={{
                                  fontSize: hp('1.7%'),
                                  fontFamily: 'Lato-Medium',
                                  marginTop: wp('1%'),
                                  color: '#17a2b8',
                                }}>
                                {'( '}
                                {item?.qty_konversi}{' '}
                                {item?.small_unit.charAt(0) +
                                  item?.small_unit.slice(1).toLowerCase()}
                                {' )'}
                              </Text>
                            ) : null}
                            {/* <NumberFormat
                    value={Math.round(this.props.orderComplaint.payment_final) ?? '0'}
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
                        Total: {value}
                      </Text>
                    )}
                  /> */}
                          </View>
                        </View>
                        {/* {this.props.orderComplaint.data_item.length > '1' ? (
                <View style={styles.textposition}>
                  <Text
                    style={{
                      fontSize: hp('1.8%'),
                      fontFamily: 'Lato-Medium',
                      marginTop: wp('2%'),
                      color: '#777',
                    }}>
                    +{this.props.orderComplaint.data_item.length - 1} produk
                    lainnya
                  </Text>
                </View>
              ) : null} */}
                      </Card>
                    </TouchableWithoutFeedback>
                  )}
                </>
              ) : null}
            </View>
          ))}
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
            <View style={[styles.position2, {marginBottom: hp('1%')}]}>
              <Text
                style={{
                  fontSize: hp('1.6%'),
                  fontFamily: 'Lato-Medium',
                }}>
                Jumlah
              </Text>
              <Text
                style={{
                  fontSize: hp('1.6%'),
                  fontFamily: 'Lato-Medium',
                }}>
                {' '}
                (Opsional)
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => this.handleMinus()}
                style={styles.iconminus}>
                <IconMinus />
              </TouchableOpacity>
              <Text
                style={{
                  borderWidth: 1,
                  borderColor: '#cccccc',
                  paddingHorizontal: hp('1%'),
                  color: 'black',
                  fontFamily: 'Lato-Medium',
                  fontSize: hp('1.6%'),
                  textAlign: 'center',
                  paddingTop: hp('0.8%'),
                  height: hp('4%'),
                  width: wp('9%'),
                  borderRadius: hp('0.5%'),
                }}>
                {this.state.qty}
              </Text>
              <TouchableOpacity
                onPress={() => this.handlePlus()}
                style={styles.iconplus}>
                <IconPlus />
              </TouchableOpacity>
            </View>
            <View style={[styles.position2, {marginTop: hp('2%')}]}>
              <Text
                style={{
                  fontSize: hp('1.6%'),
                  fontFamily: 'Lato-Medium',
                }}>
                Pilihan Pengembalian
              </Text>
              <Text
                style={{
                  fontSize: hp('1.6%'),
                  fontFamily: 'Lato-Medium',
                }}>
                {' '}
                (Opsional)
              </Text>
            </View>
            <View style={styles.viewPicker}>
              <Picker
                style={styles.picker}
                selectedValue={this.state.pilih}
                itemStyle={{color: '#000000'}}
                onValueChange={value => this.setState({pilih: value})}>
                <Picker.Item
                  style={{
                    fontSize: hp('1.8%'),
                    fontFamily: 'Lato-Medium',
                  }}
                  label="Pilihan"
                  value={'Pilihan'}
                  key={0}
                />
                <Picker.Item
                  style={{
                    fontSize: hp('1.8%'),
                    fontFamily: 'Lato-Medium',
                  }}
                  label="Pengembalian Dana"
                  value="pengembalian dana"
                />
                <Picker.Item
                  style={{
                    fontSize: hp('1.8%'),
                    fontFamily: 'Lato-Medium',
                  }}
                  label="Tukar Barang"
                  value="tukar barang"
                />
              </Picker>
            </View>
            <View style={styles.position2}>
              <Text
                style={{
                  fontSize: hp('1.6%'),
                  fontFamily: 'Lato-Medium',
                }}>
                Lampiran
              </Text>
              <Text
                style={{
                  fontSize: hp('1.6%'),
                  fontFamily: 'Lato-Medium',
                }}>
                {' '}
                (Opsional)
              </Text>
            </View>
            {photo ? (
              <React.Fragment>
                <Image
                  // source={{
                  //   uri: `data:${image.mime};base64,${image.data}`,
                  // }}
                  source={{
                    uri: photo?.path,
                  }}
                  // style={{width: image.width, height: image.height}}
                  style={{
                    flex: 1,
                    height: wp('40%'),
                    width: '100%',
                    borderRadius: hp('2%'),
                    marginBottom: wp('2%'),
                  }}
                />
              </React.Fragment>
            ) : null}
            {photo2 ? (
              <React.Fragment>
                <Image
                  // source={{
                  //   uri: `data:${image.mime};base64,${image.data}`,
                  // }}
                  source={{
                    uri: photo2?.path,
                  }}
                  // style={{width: image.width, height: image.height}}
                  style={{
                    flex: 1,
                    height: wp('40%'),
                    width: '100%',
                    borderRadius: hp('2%'),
                    marginBottom: wp('2%'),
                  }}
                />
              </React.Fragment>
            ) : null}
            {photo3 ? (
              <React.Fragment>
                <Image
                  // source={{
                  //   uri: `data:${image.mime};base64,${image.data}`,
                  // }}
                  source={{
                    uri: photo3?.path,
                  }}
                  // style={{width: image.width, height: image.height}}
                  style={{
                    flex: 1,
                    height: wp('40%'),
                    width: '100%',
                    borderRadius: hp('2%'),
                    marginBottom: wp('2%'),
                  }}
                />
              </React.Fragment>
            ) : null}
            <View style={{flexDirection: 'row'}}>
              {photo == null && (
                <TouchableOpacity onPress={this.handleChoosePhoto}>
                  <Card containerStyle={styles.cardBackground2}>
                    <IconPlus2 width={wp('7%')} height={hp('7.5%')} />
                  </Card>
                </TouchableOpacity>
              )}
              {photo2 == null && (
                <TouchableOpacity onPress={this.handleChoosePhoto2}>
                  <Card containerStyle={styles.cardBackground2}>
                    <IconPlus2 width={wp('7%')} height={hp('7.5%')} />
                  </Card>
                </TouchableOpacity>
              )}
              {photo3 == null && (
                <TouchableOpacity onPress={this.handleChoosePhoto3}>
                  <Card containerStyle={styles.cardBackground2}>
                    <IconPlus2 width={wp('7%')} height={hp('7.5%')} />
                  </Card>
                </TouchableOpacity>
              )}
              {/* {video == null && (
                <TouchableOpacity onPress={this.handleChooseVideo}>
                  <Card containerStyle={styles.cardBackground2}>
                    <Text
                      style={{
                        fontSize: hp('1.2%'),
                        fontFamily: 'Lato-Medium',
                      }}>
                      {'Video'}
                    </Text>
                    <IconPlus2
                      width={wp('7%')}
                      height={hp('7.5%')}
                      marginTop={hp('-1%')}
                      marginBottom={hp('-0.5%')}
                    />
                  </Card>
                </TouchableOpacity>
              )} */}
            </View>
          </Card>
          {this.state.buttonDisabled ? (
            <TouchableOpacity
              style={[
                styles.buttonSelesai,
                {
                  marginTop: wp('4%'),
                  marginBottom: wp('4%'),
                },
              ]}
              onPress={() => {
                // this.postComplaint();
              }}>
              <Text style={styles.textButton}>Kirim</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.buttonSelesai,
                {
                  marginTop: wp('4%'),
                  marginBottom: wp('4%'),
                },
              ]}
              onPress={() => {
                this.postComplaint();
              }}>
              <Text style={styles.textButton}>Kirim</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
  dataUser: state.LoginReducer.dataUser,
  orderComplaint: state.OrderReducer.orderComplaint,
});

const mapDispatchToProps = dispatch => {
  return {
    orderAct: (value, tipe) => {
      dispatch(OrderAction(value, tipe));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OrderComplaintTransaction);

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
  container2: {
    flexDirection: 'row',
    marginLeft: wp('4%'),
    height: hp('5%'),
    backgroundColor: 'white',
    alignItems: 'center',
    marginBottom: wp('4%'),
    marginTop: wp('1%'),
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
  cardBackground: {
    width,
    marginLeft: wp('0%'),
    borderColor: '#777',
    borderWidth: wp('0%'),
    justifyContent: 'center',
    paddingLeft: wp('5%'),
    marginTop: wp('0%'),
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
  cardBackground2: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E8E8E8',
    width: wp('18.5%'),
    borderRadius: wp('5%'),
    alignItems: 'center',
    marginLeft: wp('0%'),
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

  iconplus: {
    borderWidth: 1,
    borderColor: '#cccccc',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFEEA',
    borderTopRightRadius: hp('1%'),
    borderBottomRightRadius: hp('1%'),
    width: wp('6.5%'),
    marginLeft: wp('-0.5%'),
  },
  iconminus: {
    borderWidth: 1,
    borderColor: '#cccccc',
    backgroundColor: '#FFFEEA',
    borderTopLeftRadius: hp('1%'),
    borderBottomLeftRadius: hp('1%'),
    width: wp('6.5%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('-0.2%'),
  },
  picker: {
    marginTop: wp('-1%'),
    width: wp('52%'),
    marginRight: wp('0%'),
  },
  viewPicker: {
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: hp('2%'),
    width: wp('52%'),
    height: wp('10%'),
    marginBottom: hp('2%'),
    marginTop: hp('1%'),
  },
});
