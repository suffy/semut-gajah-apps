import React, {Component, useEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TextInput,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {connect} from 'react-redux';
import axios from 'axios';
import {LoginAction} from '../redux/Action';
import Logo from '../assets/icons/IconLogo.svg';
// import Background from '../assets/images/Background.png';
import IconEye from '../assets/icons/Eye.svg';
import CONFIG from '../constants/config';
import messaging from '@react-native-firebase/messaging';
import Size from '../components/Fontresponsive';
import IconOTP from '../assets/icons/OTP.svg';
import IconPhone from '../assets/icons/Phone.svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Storage from '@react-native-async-storage/async-storage';
import {ActivityIndicator} from 'react-native-paper';
import ModalAlert from '../components/ModalAlert';
import Snackbar from 'react-native-snackbar';

function MiniOfflineSign() {
  return (
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>{'Tidak ada koneksi internet'}</Text>
    </View>
  );
}

function LoadingApi() {
  return (
    <View style={styles.loadingApi}>
      <ActivityIndicator animating size="large" color="#529F45" />
    </View>
  );
}

export class FormInputCodeOTP extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      codeOTP: '',
      timer: 60,
      showInput: true,
      loadingApi: false,
      alertData: '',
      modalAlert: false,
    };
  }

  UNSAFE_componentWillMount() {
    // lor(this);
    this._isMounted = true;
    // console.log("data user 70"+ JSON.stringify())
  }

  componentWillUnmount() {
    // rol();
    this._isMounted = false;
  }

  sendOTPWA = async () => {
    const formData = {
      phone: this.props.dataUser.phone,
    };
    this.setState({loadingApi: true});
    try {
      let response = await axios.post(
        `${CONFIG.BASE_URL}/api/otp/wa`,
        formData,
        // {
        //   headers: {Authorization: `Bearer ${this.props.token}`},
        // },
      );
      // console.log(response)
      const data = response.data;
      if (data !== '' && data['success'] == true) {
        console.log('HASIL SEND OTP', data.data);
        this.props.navigation.navigate('FormInputVerifikasiOTPWA',{dataUser:this.props.route.params?.dataUser});
        this.setState({loadingApi: false});
      } else {
        console.log('', typeof data);
        this.setState({
          alertData: 'gagal memproses data' + data.message,
          modalAlert: !this.state.modalAlert,
        });
        return false;
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
      } else {
        this.setState({
          alertData: 'Gagal mengirim otp',
          modalAlert: !this.state.modalAlert,
          loadingApi: false,
        });
      }
    }
  };

  sendOTPSMS = async () => {
    const formData = {
      phone: this.props.dataUser.phone,
    };
    this.setState({loadingApi: true});
    try {
      let response = await axios.post(
        `${CONFIG.BASE_URL}/api/otp`,
        formData,
        // {
        // headers: {Authorization: `Bearer ${this.props.token}`},
        // }
      );
      // console.log(response)
      const data = response.data;
      if (data !== '' && data['success'] == true) {
        console.log('HASIL SEND OTP', data.data);
        this.props.navigation.navigate('FormInputVerifikasiOTPSMS',{dataUser:this.props.route.params?.dataUser});
        this.setState({loadingApi: false});
      } else {
        console.log('', typeof data);
        this.setState({
          alertData: 'gagal memproses data' + data.message,
          modalAlert: !this.state.modalAlert,
        });
        return false;
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
      } else {
        this.setState({
          alertData: 'Gagal mengirim otp',
          modalAlert: !this.state.modalAlert,
          loadingApi: false,
        });
      }
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

  render() {
    const {timer, showInput, loadingApi} = this.state;
    return (
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <ModalAlert
          modalAlert={this.state.modalAlert}
          alert={this.state.alertData}
          getCloseAlertModal={() => this.getCloseAlertModal()}
        />
        <View style={styles.container}>
          <Logo width={wp('35%')} height={hp('16%')} style={styles.image} />
          <Text style={styles.textlogo}>{'Pilih metode verifikasi'}</Text>
          <View style={styles.posision}>
            <Text style={[styles.textStyle]}>
              {
                'Pilih salah satu metode dibawah ini untuk mendapatkan kode verifikasi'
              }
            </Text>
            {/* {showInput ? (
              <>
                <View style={styles.containerInput}>
                   <TextInput
            autoCapitalize = 'none'
                    placeholder="Nomor telepon"
                    placeholderTextColor="#A4A4A4"
                    keyboardType="numeric"
                    style={styles.inputStyle}
                    underlineColorAndroid="transparent"
                    onChangeText={value =>
                      this._isMounted && this.setState({codeOTP: value})
                    }
                  />
                </View>
                <IconPhone
                  style={styles.icon}
                  width={wp('6%')}
                  height={hp('6%')}
                />
              </>
            ) : (
              <>
                <View style={styles.containerInput}>
                   <TextInput
            autoCapitalize = 'none'
                    placeholder="Nomor telepon"
                    placeholderTextColor="#A4A4A4"
                    keyboardType="numeric"
                    style={styles.inputStyle}
                    underlineColorAndroid="transparent"
                    onChangeText={value =>
                      this._isMounted && this.setState({codeOTP: value})
                    }
                  />
                </View>
                <IconPhone
                  style={styles.icon}
                  width={wp('6%')}
                  height={hp('6%')}
                />
              </>
            )} */}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                marginTop: hp('2%'),
              }}>
              {showInput ? (
                <>
                  <TouchableOpacity
                    style={styles.buttonWASms}
                    onPress={() => this.sendOTPSMS()}>
                    <Text style={styles.textOTP}>{'SMS'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttonWASms}
                    onPress={() => this.sendOTPWA()}>
                    <Text style={styles.textOTP}>{'Whatsapp'}</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.buttonSimpanTelepon}
                  onPress={() => this.sendPhone()}>
                  <Text style={styles.textOTP}>{'Simpan Telepon'}</Text>
                </TouchableOpacity>
              )}
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                // backgroundColor: 'red',
                width: wp('67%'),
              }}>
              {/* {timer === 60 ? (
                <TouchableOpacity
                  onPress={() => {
                    this.sendOTP();
                    this.setTime();
                  }}>
                  <Text style={[styles.textLupaPassword]}>
                    {'Kirim Ulang OTP'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                  // onPress={() => {
                  //   this.sendOTP();
                  //   }}
                  >
                    <Text style={[styles.textLupaPassword]}>
                      {'Kirim Ulang OTP'}
                    </Text>
                  </TouchableOpacity>
                  <Text
                    style={[
                      styles.textLupaPassword,
                      {marginLeft: wp('1%'), marginRight: wp('-5%')},
                    ]}>
                    {'('}
                    {timer}
                    {')'}
                  </Text>
                </View>
              )} */}
              {/* {showInput ? (
                <TouchableOpacity
                  onPress={() => {
                    this.setState({showInput: !showInput});
                  }}>
                  <Text style={[styles.textLupaPassword]}>
                    {'Nomor Telepon Salah ?'}
                  </Text>
                </TouchableOpacity>
              ) : null} */}
            </View>
          </View>
        </View>
        {loadingApi ? <LoadingApi /> : null}
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
  phone: state.LoginReducer.phone,
  dataUser: state.LoginReducer.dataUser,
});

const mapDispatchToProps = dispatch => {
  return {
    loginAct: (value, tipe) => {
      dispatch(LoginAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormInputCodeOTP);

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    width: wp('100%'),
    height: hp('100%'),
    alignItems: 'center',
    justifyContent: 'center',
    // padding: wp('6%'),
  },
  textlogo: {
    color: '#529F45',
    fontFamily: 'Lato-Medium',
    fontSize: hp('3%'),
    marginTop: hp('3%'),
    marginBottom: hp('3%'),
  },
  posision: {
    flexDirection: 'column',
    position: 'relative',
  },
  containerInput: {
    overflow: 'hidden',
    paddingBottom: hp('2%'),
    paddingHorizontal: wp('2%'),
  },
  inputStyle: {
    color: 'black',
    fontFamily: 'Lato-Medium',
    fontSize: hp('1.8%'),
    width: wp('70%'),
    height: hp('5.5%'),
    textAlign: 'left',
    borderColor: '#E8E8E8',
    borderWidth: 1,
    borderRadius: wp('4%'),
    marginTop: hp('2%'),
    paddingHorizontal: wp('13%'),
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 10,
  },
  icon: {
    position: 'absolute',
    top: hp('5.5%'),
    right: wp('62%'),
  },
  eye: {
    position: 'absolute',
    top: hp('3.5%'),
    right: wp('6%'),
  },
  textStyle: {
    fontFamily: 'Lato-Regular',
    fontSize: hp('1.6%'),
    // paddingTop: hp('3%'),
    width: wp('65%'),
    alignSelf: 'center',
    textAlign: 'center',
    // paddingLeft:Font(34)
  },
  button: {
    flexDirection: 'row',
  },
  buttonWASms: {
    backgroundColor: '#529F45',
    height: hp('5.5%'),
    width: wp('30%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp('2%'),
    marginLeft: wp('5%'),
  },
  buttonSimpanTelepon: {
    backgroundColor: '#529F45',
    height: hp('5.5%'),
    width: wp('55%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp('2%'),
    alignSelf: 'center',
    marginLeft: wp('10%'),
  },
  textOTP: {
    textAlign: 'center',
    color: 'white',
    fontFamily: 'Lato-Regular',
    fontSize: hp('1.8%'),
  },
  textLupaPassword: {
    fontFamily: 'Lato-Regular',
    color: 'grey',
    fontSize: hp('1.4%'),
    marginTop: hp('1%'),
    marginBottom: hp('2.5%'),
    marginLeft: wp('8%'),
  },
  offlineContainer: {
    // flex: 1,
    // backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    // flexDirection: 'column',
    width: wp('100%'),
    // height: hp('4%'),
    flexDirection: 'row',
    marginTop: hp('2%'),
  },
  offlineText: {
    color: '#4A8F3C',
    fontFamily: 'Lato-Medium',
    // fontSize: hp('3%'),
    // marginBottom: hp(-30),
    textAlign: 'center',
    fontSize: hp('2%'),
  },
  loadingApi: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.2)',
    justifyContent: 'center',
    alignSelf: 'center',
    width: wp('100%'),
    height: hp('100%'),
    position: 'absolute',
    // top:hp('-50%')
  },
});
