import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Button,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import Size from '../components/Fontresponsive';
import axios from 'axios';
import NumberFormat from 'react-number-format';
import CONFIG from '../constants/config';
import {Card} from 'react-native-elements';
import IconImage from '../assets/icons/Image.svg';
import ImagePicker from 'react-native-image-crop-picker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Storage from '@react-native-async-storage/async-storage';

const width = Dimensions.get('window').width;

const createFormData = (photo, body) => {
  const data = new FormData();
  data.append('file', {
    name: photo.fileName,
    type: photo.type,
    uri:
      Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', ''),
  });
  // Object.keys(body).forEach(key => {
  //     data.append(key, body[key]);
  // });

  return data;
};

export class UploadPayment extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      photo: null,
    };
  }

  UNSAFE_componentWillMount() {
    // lor(this);
  }

  componentWillUnmount() {
    // rol()
  }

  handleChoosePhoto = () => {
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
        this.setState({photo: image});
        let source = image;
        console.log('DATA SESUDAH2 ===>', JSON.stringify(source));
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleUploadPhoto = async () => {
    try {
      let response = await axios.post(
        `${CONFIG.BASE_URL}/api/orders/payments/upload/${this.props.order.id}`,
        createFormData(this.state.photo, {}),
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      let data = response.data;
      if (data !== '' && data['success'] == true) {
        this.setState({photo: null});
        this.props.navigation.navigate('ListDataPayment');
      } else {
        console.log(response.data);
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

  render() {
    const {photo} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={[styles.container]}>
          <Text style={styles.text}>{'Unggah Bukti Pembayaran'}</Text>
        </View>
        <View style={styles.container3}>
          <Card containerStyle={styles.cardBackground}>
            <View style={styles.position2}>
              <Text
                style={{
                  fontSize: hp('1.6%'),
                  fontFamily: 'Lato-Medium',
                }}>
                Pastikan bukti pembayaran menampilkan:
              </Text>
            </View>
          </Card>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{marginBottom: wp('3%')}}>
          <Card containerStyle={styles.cardBackground}>
            <View style={{marginBottom: wp('2%')}}>
              <View style={styles.position2}>
                <Text
                  style={{
                    fontSize: hp('1.6%'),
                    fontFamily: 'Lato-Medium',
                    color: '#529F45',
                  }}>
                  ⬤{' '}
                </Text>
                <Text
                  style={{
                    fontSize: hp('1.6%'),
                    fontFamily: 'Lato-Medium',
                  }}>
                  {' '}
                  Tanggal / waktu transfer
                </Text>
              </View>
              <Text
                style={{
                  fontSize: hp('1.6%'),
                  fontFamily: 'Lato-Medium',
                  marginBottom: wp('3%'),
                  marginTop: wp('2%'),
                  marginLeft: wp('4.5%'),
                }}>
                Contoh : tgl 01/01/2021 jam 07:00:00
              </Text>
              <View style={styles.position2}>
                <Text
                  style={{
                    fontSize: hp('1.6%'),
                    fontFamily: 'Lato-Medium',
                    color: '#529F45',
                  }}>
                  ⬤{' '}
                </Text>
                <Text
                  style={{
                    fontSize: hp('1.6%'),
                    fontFamily: 'Lato-Medium',
                  }}>
                  {' '}
                  Status berhasil
                </Text>
              </View>
              <Text
                style={{
                  fontSize: hp('1.6%'),
                  fontFamily: 'Lato-Medium',
                  marginBottom: wp('3%'),
                  marginTop: wp('2%'),
                  marginLeft: wp('4.5%'),
                }}>
                Contoh : Transaksi berhasil
              </Text>
              <View style={styles.position2}>
                <Text
                  style={{
                    fontSize: hp('1.6%'),
                    fontFamily: 'Lato-Medium',
                    color: '#529F45',
                  }}>
                  ⬤{' '}
                </Text>
                <Text
                  style={{
                    fontSize: hp('1.6%'),
                    fontFamily: 'Lato-Medium',
                  }}>
                  Detail Penerima
                </Text>
              </View>
              <Text
                style={{
                  fontSize: hp('1.6%'),
                  fontFamily: 'Lato-Medium',
                  marginBottom: wp('3%'),
                  marginTop: wp('2%'),
                  marginLeft: wp('4.5%'),
                }}>
                Contoh : Transfer ke rekening MPM
              </Text>
              <View style={styles.position2}>
                <Text
                  style={{
                    fontSize: hp('1.6%'),
                    fontFamily: 'Lato-Medium',
                    color: '#529F45',
                  }}>
                  ⬤{' '}
                </Text>
                <Text
                  style={{
                    fontSize: hp('1.6%'),
                    fontFamily: 'Lato-Medium',
                  }}>
                  Jumlah transfer sesuai
                </Text>
              </View>
              <Text
                style={{
                  fontSize: hp('1.6%'),
                  fontFamily: 'Lato-Medium',
                  marginBottom: wp('3%'),
                  marginTop: wp('2%'),
                  marginLeft: wp('4.5%'),
                }}>
                Contoh :{' '}
                <NumberFormat
                  value={'120000'}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={'Rp '}
                  renderText={value => (
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: hp('1.8%'),
                        fontFamily: 'Lato-Medium',
                        marginTop: wp('1%'),
                      }}>
                      {value}
                    </Text>
                  )}
                />
              </Text>
            </View>
            {photo && (
              <React.Fragment>
                <Image
                  source={{uri: photo.uri}}
                  style={{width: 300, height: 300}}
                />
                <TouchableOpacity
                  style={[
                    styles.buttonSelesai,
                    {
                      marginTop: wp('4%'),
                      marginBottom: wp('4%'),
                    },
                  ]}
                  onPress={() => {
                    this.handleUploadPhoto();
                  }}>
                  <Text style={styles.textButton}>Unggah bukti</Text>
                </TouchableOpacity>
              </React.Fragment>
            )}
            {photo == null && (
              <TouchableOpacity onPress={this.handleChoosePhoto}>
                <Card containerStyle={styles.cardBackground2}>
                  <IconImage
                    width={wp('8%')}
                    height={hp('7.5%')}
                    alignSelf={'center'}
                  />
                  <Text
                    style={{
                      fontSize: hp('1.6%'),
                      fontFamily: 'Lato-Medium',
                      marginBottom: wp('2%'),
                      marginTop: wp('2%'),
                    }}>
                    Format gambar : JPG, JPEG, PNG
                  </Text>
                </Card>
              </TouchableOpacity>
            )}
          </Card>
        </ScrollView>
      </View>
    );
  }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(UploadPayment);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: hp('10.5%'),
    backgroundColor: 'white',
  },
  text: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('2.4%'),
    paddingLeft: wp('5%'),
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
    width,
    marginLeft: wp('0%'),
    borderColor: '#777',
    borderWidth: wp('0%'),
    justifyContent: 'center',
    paddingLeft: wp('5%'),
    marginTop: wp('0%'),
  },
  cardBackground2: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E8E8E8',
    width: wp('90%'),
    borderRadius: wp('5%'),
    alignSelf: 'center',
    alignItems: 'center',
    marginLeft: wp('0%'),
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
  textButton: {
    fontSize: hp('1.8%'),
    color: '#fff',
    fontFamily: 'Lato-Medium',
    alignSelf: 'center',
  },
});
