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
  TouchableWithoutFeedback,
  Alert,
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

export class FormInputVerifikasiOTPWA extends Component {
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
      tambahan: '',
      modalAlert: false,
    };
  }

  UNSAFE_componentWillMount() {
    // lor(this);
    this._isMounted = true;
    this.setTime();
  }

  componentWillUnmount() {
    // rol();
    this._isMounted = false;
    clearInterval(this.interval);
  }

  sendOTP = async () => {
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
        this.setState({loadingApi: false});
        console.log('HASIL SEND OTP', data.data);
      } else {
        console.log('', typeof data);
        this.setState({
          alertData: 'Gagal mengirim otp ' + data.message,
          modalAlert: true,
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
        'Cek Error===========DataSearching=============',
        JSON.parse(JSON.stringify(error)).message,
      );
      if (error429) {
        this.showSnackbarBusy();
      } else if (errorNetwork) {
        this.showSnackbarInet();
      }
    }
  };

  cekOTP = async () => {
    const formData = {
      otp_code: this.state.codeOTP,
      phone: this.props.dataUser.phone,
    };
    this.setState({loadingApi: true});
    try {
      let response = await axios.post(
        `${CONFIG.BASE_URL}/api/otp/verify`,
        formData,
        // {
        //   headers: {Authorization: `Bearer ${this.props.token}`},
        // },
        // {timeout: 1000},
      );
      const data = response.data;
      if (data !== '' && data['success'] == true) {
        this.setState({
          // loadingApi: false,
          tambahan: 'VERIFIKASI SUKSES',
          alertData:
            'Akun anda sudah terdaftar di sistem kami, harap menunggu konfirmasi dari admin kami untuk bisa masuk',
          modalAlert: true,
        });
        if (this.props.dataUser && this.props.dataUser.name_company) {
          console.log('MASUK DISTRIBUTOR', this.props.dataUser);
          const formData = JSON.stringify(this.props.dataUser);
          await axios
            .post(
              `${CONFIG.BASE_URL}/api/distributor-partner/auth/register`,
              this.props.route.params?.dataUser,
              {
                headers: {
                  'content-type': 'application/json',
                },
              },
            )
            .then(response => {
              const data = response.data;
              // const formData = {
              //   phone: this.state.phone,
              // };
              if (data !== '' && data['success'] == true) {
                console.log('MASUK', JSON.stringify(data.data));
                // this.props.loginAct(data.data.token, 'token');
                // this.props.loginAct(data.data.user, 'dataUser');
                this.setState({loadingApi: false});
                this.setState({
                  tambahan: 'VERIFIKASI SUKSES',
                  alertData:
                    'Harap menunggu dari sales kami untuk menghubungi nomor anda yang teregistrasi untuk keperluan persyaratan dokumen dan akses login',
                  modalAlert: true,
                  loadingApi: false,
                });
              } else {
                let message = data.message;
                if (message == 'The phone has already been taken.') {
                  this.setState({
                    tambahan: 'VERIFIKASI GAGAL',
                    alertData: 'Nomor telepon yang didaftarkan telah dipakai',
                    modalAlert: true,
                    loadingApi: false,
                  });
                } else if (message == 'Account has been registered') {
                  this.setState({
                    tambahan: 'VERIFIKASI GAGAL',
                    alertData: 'Akun anda sudah terdaftar',
                    modalAlert: true,
                    loadingApi: false,
                  });
                } else {
                  this.setState({
                    tambahan: 'VERIFIKASI GAGAL',
                    alertData: message,
                    modalAlert: true,
                    loadingApi: false,
                  });
                }
              }
            })
            .catch(error => {
              let error429 =
                JSON.parse(JSON.stringify(error)).message ===
                'Request failed with status code 429';
              let errorNetwork =
                JSON.parse(JSON.stringify(error)).message === 'Network Error';
              let error400 =
                JSON.parse(JSON.stringify(error)).message ===
                'Request failed with status code 400';
              console.log(
                'Cek Error===========DataSearching=============',
                JSON.parse(JSON.stringify(error)).message,
              );
              if (error429) {
                this.showSnackbarBusy();
              } else if (errorNetwork) {
                this.showSnackbarInet();
              }
            });
        } else {
          console.log('MASUK UMUM', this.props.route.params?.dataUser);
          const formData = this.props.dataUser;
          await axios
            .post(
              `${CONFIG.BASE_URL}/api/auth/register?status=2`,
              this.props.route.params?.dataUser,
              {
                headers: {
                  'content-type': 'application/json',
                },
              },
            )
            .then(response => {
              // console.log(response)
              const data = response.data;
              // const formData = {
              //   phone: this.state.phone,
              // };
              if (data !== '' && data['success'] == true) {
                console.log('success');
                console.log('MASUK', JSON.stringify(data));
                // this.props.loginAct(data.data.token, 'token');
                // this.props.loginAct(data.data.user, 'dataUser');
                this.setState({
                  tambahan: 'VERIFIKASI SUKSES',
                  alertData:
                    'Akun anda sudah terdaftar di sistem kami, harap menunggu konfirmasi dari admin kami untuk bisa masuk',
                  modalAlert: true,
                  loadingApi: false,
                });
              } else {
                let message = data.message;
                if (message == 'The phone has already been taken.') {
                  this.setState({
                    tambahan: 'VERIFIKASI GAGAL',
                    alertData: 'Nomor telepon yang didaftarkan telah dipakai',
                    modalAlert: true,
                    loadingApi: false,
                  });
                } else if (message == 'Account has been registered') {
                  this.setState({
                    tambahan: 'VERIFIKASI GAGAL',
                    alertData: 'Akun anda sudah terdaftar',
                    modalAlert: true,
                    loadingApi: false,
                  });
                } else {
                  this.setState({
                    tambahan: 'VERIFIKASI GAGAL',
                    alertData: message,
                    modalAlert: true,
                    loadingApi: false,
                  });
                }
              }
            })
            .catch(error => {
              let error429 =
                JSON.parse(JSON.stringify(error)).message ===
                'Request failed with status code 429';
              let errorNetwork =
                JSON.parse(JSON.stringify(error)).message === 'Network Error';
              let error400 =
                JSON.parse(JSON.stringify(error)).message ===
                'Request failed with status code 400';
              console.log(
                'Cek Error===========DataSearching=============',
                JSON.parse(JSON.stringify(error)).message,
              );
              if (error429) {
                this.showSnackbarBusy();
              } else if (errorNetwork) {
                this.showSnackbarInet();
              }
            });
        }
      } else {
        this.setState({
          tambahan: 'VERIFIKASI GAGAL',
          alertData: data.message,
          modalAlert: true,
          loadingApi: false,
        });
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
        'Cek Error===========DataSearching=============',
        JSON.parse(JSON.stringify(error)).message,
      );
      if (error429) {
        this.showSnackbarBusy();
      } else if (errorNetwork) {
        this.showSnackbarInet();
      } else {
        this.setState({
          alertData: 'Verifikasi gagal, pastikan kode otp sesuai',
          modalAlert: true,
          loadingApi: false,
        });
      }
    }
  };

  setTime = () => {
    this.interval = setInterval(
      () => this.setState(prevState => ({timer: prevState.timer - 1})),
      1000,
    );
  };

  componentDidUpdate() {
    if (this.state.timer === 0) {
      clearInterval(this.interval);
      this.setState({timer: 60});
    }
  }

  getCloseAlertModal() {
    this.setState({modalAlert: false});
    if (
      this.state.alertData ==
      'Harap menunggu dari sales kami untuk menghubungi nomor anda yang teregistrasi untuk keperluan persyaratan dokumen dan akses login'
    ) {
      this.props.navigation.replace('Login');
    } else if (this.state.alertData == 'Silahkan register ulang kembali') {
      this.props.navigation.replace('Login');
    } else if (
      this.state.alertData ==
      'Akun anda sudah terdaftar di sistem kami, harap menunggu konfirmasi dari admin kami untuk bisa masuk'
    ) {
      this.props.navigation.replace('Login');
    }
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
          this.setState({loadingApi: false});
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
          this.setState({loadingApi: false});
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
          tambahan={this.state.tambahan}
          alert={this.state.alertData}
          getCloseAlertModal={() => this.getCloseAlertModal()}
        />
        <View style={styles.container}>
          <Logo width={wp('35%')} height={hp('16%')} style={styles.image} />
          <Text style={styles.textlogo}>{'Kode OTP'}</Text>
          <View style={styles.posision}>
            {/* <Text style={[styles.textStyle]}>{'Kode OTP'}</Text> */}
            {showInput ? (
              <>
                <View style={styles.containerInput}>
                  <TextInput
                    autoCapitalize="none"
                    placeholder="Kode OTP"
                    placeholderTextColor="#A4A4A4"
                    keyboardType="numeric"
                    style={styles.inputStyle}
                    underlineColorAndroid="transparent"
                    onChangeText={value =>
                      this._isMounted && this.setState({codeOTP: value})
                    }
                  />
                </View>
                <IconOTP
                  style={styles.icon}
                  width={wp('6%')}
                  height={hp('6%')}
                />
              </>
            ) : (
              <>
                <View style={styles.containerInput}>
                  <TextInput
                    autoCapitalize="none"
                    placeholder="Nomor Telepon"
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
            )}

            {showInput ? (
              <TouchableOpacity
                style={styles.buttonOTP}
                onPress={() => this.cekOTP()}>
                <Text style={styles.textOTP}>{'OK'}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.buttonOTP}
                onPress={() => this.sendPhone()}>
                <Text style={styles.textOTP}>{'Simpan Telepon'}</Text>
              </TouchableOpacity>
            )}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                // backgroundColor: 'red',
                width: wp('67%'),
              }}>
              {timer === 60 ? (
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
                  <TouchableWithoutFeedback
                  // onPress={() => {
                  //   this.sendOTP();
                  //   }}
                  >
                    <Text style={[styles.textLupaPassword]}>
                      {'Kirim Ulang OTP'}
                    </Text>
                  </TouchableWithoutFeedback>
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
              )}
              {showInput ? (
                <TouchableOpacity
                  onPress={() => {
                    // this.setState({showInput: !showInput});
                    this.setState({
                      alertData: 'Silahkan register ulang kembali',
                      modalAlert: true,
                    });
                  }}>
                  <Text style={[styles.textNomorTeleponSalah]}>
                    {'Nomor Telepon Salah ?'}
                  </Text>
                </TouchableOpacity>
              ) : null}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FormInputVerifikasiOTPWA);

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
    top: hp('1.8%'),
    right: wp('62%'),
  },
  eye: {
    position: 'absolute',
    top: hp('3.5%'),
    right: wp('6%'),
  },
  textStyle: {
    fontFamily: 'Lato-Bold',
    fontSize: hp('1.6%'),
    paddingTop: hp('3%'),
    // paddingLeft:Font(34)
  },
  button: {
    flexDirection: 'row',
  },
  buttonOTP: {
    backgroundColor: '#529F45',
    height: hp('5.5%'),
    width: wp('70%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp('2%'),
    alignSelf: 'center',
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
    fontSize: hp('1.2%'),
    marginTop: hp('1%'),
    // marginBottom: hp('2.5%'),
    marginLeft: wp('10%'),
  },
  textNomorTeleponSalah: {
    fontFamily: 'Lato-Regular',
    color: 'grey',
    fontSize: hp('1.2%'),
    marginTop: hp('1%'),
    // marginBottom: hp('2.5%'),
    marginRight: wp('3%'),
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
