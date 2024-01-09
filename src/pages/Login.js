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
  Modal,
  Linking,
  TouchableWithoutFeedback,
} from 'react-native';
import {connect} from 'react-redux';
import axios from 'axios';
import {LoginAction} from '../redux/Action';
import Logo from '../assets/icons/IconLogo.svg';
import IconEye from '../assets/icons/Eye.svg';
import CONFIG from '../constants/config';
import messaging from '@react-native-firebase/messaging';
import Storage from '@react-native-async-storage/async-storage';
// import IconUser from '../assets/icons/User.svg';
// import IconSandi from '../assets/icons/Sandi.svg';
import IconSandi from '../assets/newIcons/iconPadLock.svg';
import IconUser from '../assets/newIcons/iconPerson.svg';
import {ActivityIndicator} from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import {fcmService} from '../components/FCMService';
import {localNotificationService} from '../components/LocalNotificationService';
import ModalAlert from '../components/ModalAlert';
import Snackbar from 'react-native-snackbar';
import Whatsapp from '../assets/icons/whatsapp-symbol.svg';
import {Picker} from '@react-native-picker/picker';
import SearchableDropdown from 'react-native-searchable-dropdown';

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

const SCREEN_HEIGHT = Dimensions.get('window').height;

export class Login extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      phone: '',
      password: '',
      hidePass: true,
      tokenFCM: '',
      loadingApi: true,
      alertData: '',
      modalAlert: false,
      modalWhatsapp: false,
      numberWAPusat: '',
      numberWASub: '',
      hasilPilihWA: '',
      numberSubArray: false,
    };
  }

  componentWillUnmount() {
    // rol();
    this._isMounted = false;
  }

  componentDidMount = () => {
    this._isMounted = true;
    this.getWhatsappNumber();
    this.getFcmToken();
  };

  getToken = async () => {
    try {
      this.firebaseNotify = fcmService;
      this.localNotify = localNotificationService;

      await this.firebaseNotify.registerAppWithFCM();
      this.firebaseNotify.register(this.onRegister);

      this.localNotify.createDefaultChannels();
      this.localNotify.configure();
    } catch (error) {
      console.log(error);
    }
  };

  onRegister = async token => {
    // fungsi register token utk firebase notifikasi
    console.log('[App] onRegister: ', token);
    // await AsyncStorage.setItem('fcmToken', token);
  };

  getFcmToken = async () => {
    let token = await Storage.getItem('token');
    try {
      console.log('sini');
      await axios({
        method: 'get',
        url: `${CONFIG.BASE_URL}/api/profile`,
        headers: {Authorization: `Bearer ${token}`},
      }).catch(error => {
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
        }
      });
      let fcmToken = await messaging()
        .getToken()
        .catch(error => {
          console.log('error getting push token ' + error);
          this.showSnackbarInet();
        });
      // let fcm = await Storage.getItem('fcm');
      console.log('====================================');
      console.log('fcmToken', fcmToken);
      console.log('token', token);
      console.log('====================================');

      if (token === null) {
        console.log('Your Firebase Token is:', fcmToken);
        await this.setState({loadingApi: false, tokenFCM: fcmToken});
      } else {
        this.props.loginAct(token, 'token');
        this.props.navigation.replace('Home', {initial: false});
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
      }
    }
  };

  loginHandler = async () => {
    const {phone, password, tokenFCM} = this.state;
    const formData = {
      email_phone: phone,
      password: password,
      fcm_token: tokenFCM,
      app_version: '1.1.10',
    };
    this.setState({loadingApi: true});
    try {
      let response = await axios.post(
        `${CONFIG.BASE_URL}/api/auth/login`,
        formData,
      );
      const data = response.data;
      // console.log('data', data);
      console.log(data !== '' && data['success'] == true);
      if (data !== '' && data['success'] == true) {
        this.props.loginAct(data?.data?.user, 'dataUser');
        this.props.loginAct(data?.data?.token, 'token');
        await Storage.setItem('token', data?.data?.token);
        this.setState({loadingApi: false});
        this.props.navigation.replace('Home', {initial: false});
      } else {
        this.setState({loadingApi: false});
        let message = data.message;

        let user = 'User not found';
        let kosong = 'Fill the blank';
        let userReg = 'User not have site code';
        let password = 'Password not match';
        let approved = 'User not approved';
        if (message === user) {
          this.setState({
            alertData: 'Nomor telepon/email tidak ditemukan',
            modalAlert: !this.state.modalAlert,
          });
        } else if (message === password) {
          this.setState({
            alertData: 'Password yang dimasukkan salah',
            modalAlert: !this.state.modalAlert,
          });
        } else if (message === kosong) {
          this.setState({
            alertData: 'Pastikan kolom tidak boleh ada yang kosong',
            modalAlert: !this.state.modalAlert,
          });
        } else if (message === userReg) {
          this.setState({
            alertData: 'Mohon menunggu untuk verifikasi data di sistem kami',
            modalAlert: !this.state.modalAlert,
          });
        } else if (message === approved) {
          this.setState({
            alertData: 'Mohon menunggu untuk verifikasi data di sistem kami',
            modalAlert: !this.state.modalAlert,
          });
        }
      }
    } catch (error) {
      this.setState({loadingApi: false});
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
      }
    }
  };

  getRegister = () => {
    this.props.navigation.navigate('FormIdentificationUser');
    // this.props.navigation.navigate('FormInputCodeUser');
    // this.props.navigation.navigate('FormInputVerifikasiOTPWAOld');
  };

  getFormLupa = () => {
    this.props.navigation.navigate('FormInputOTPForgotPass');
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
          this.getFcmToken();
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
          this.getFcmToken();
        },
      },
    });
  };

  getWhatsappNumber = async () => {
    try {
      let response = await axios.get(`${CONFIG.BASE_URL}/api/wa/login/number`);
      // console.log('response===>', JSON.stringify(response, null, 2));
      const data = response.data;
      console.log('data', data.data);
      if (data.data !== '' && data['success'] == true) {
        if (data.data.length > 2) {
          console.log('masuk 1', data.data.length);
          this.setState({numberWAPusat: data.data[0]});
          let arr = '';
          arr = data.data.shift();
          console.log(arr);
          const dataa = await arr.map(item => {
            return {
              name: item.provinsi.toUpperCase(),
              telp_wa: item.telp_wa,
              id: item.id,
            };
          });
          this.setState({numberWASub: dataa});
          this.setState({numberSubArray: true});
        } else {
          console.log('masuk 2', data.data.length);
          this.setState({numberWAPusat: data.data[0]});
          // this.setState({numberWASub: data.data[1]});
          const dataa = await data.data.map(item => {
            return {
              name: item.provinsi.toUpperCase(),
              telp_wa: item.telp_wa,
              id: item.id,
            };
          });
          this.setState({numberWASub: dataa});
          this.setState({numberSubArray: true});
        }
      } else {
        this.setState({
          alertData: 'Gagal ambil data whatsapp',
          modalAlert: !this.state.modalAlert,
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
        'Cek Error========================',
        JSON.parse(JSON.stringify(error)).message,
      );
      if (error429) {
        this.showSnackbarBusy();
      } else if (errorNetwork) {
        this.showSnackbarInet();
      }
    }
  };

  handleChatWhatsapp = chat => {
    console.log('cekk chat', chat);
    if (chat == 'pusat') {
      console.log('masuk wa pusat');
      let url = 'whatsapp://send?phone=62' + this.state.numberWAPusat.telp_wa;
      Linking.openURL(url)
        .then(data => {
          console.log('WhatsApp Opened');
          this.setState({modalWhatsapp: false});
        })
        .catch(() => {
          this.setState({
            alertData: 'Pastikan aplikasi whatsapp terinstall di hape kamu',
            modalAlert: !this.state.modalAlert,
            modalWhatsapp: false,
          });
        });
    } else if (chat == 'sub') {
      // console.log('masuk wa sub',chat.telp_wa);
      let url = 'whatsapp://send?phone=62' + chat.telp_wa;
      Linking.openURL(url)
        .then(data => {
          console.log('WhatsApp Opened');
          this.setState({modalWhatsapp: false});
        })
        .catch(() => {
          this.setState({
            alertData: 'Pastikan aplikasi whatsapp terinstall di hape kamu',
            modalAlert: !this.state.modalAlert,
            modalWhatsapp: false,
          });
        });
    } else {
      // console.log('masuk wa random',chat.telp_wa);
      let url = 'whatsapp://send?phone=62' + chat.telp_wa;
      Linking.openURL(url)
        .then(data => {
          console.log('WhatsApp Opened');
          this.setState({modalWhatsapp: false});
        })
        .catch(() => {
          this.setState({
            alertData: 'Pastikan aplikasi whatsapp terinstall di hape kamu',
            modalAlert: !this.state.modalAlert,
            modalWhatsapp: false,
          });
        });
    }
  };

  render() {
    const {loadingApi, phone, password} = this.state;
    if (loadingApi) {
      return <LoadingApi />;
    }
    return (
      <View style={styles.scroll}>
        <ModalAlert
          modalAlert={this.state.modalAlert}
          alert={this.state.alertData}
          getCloseAlertModal={() => this.getCloseAlertModal()}
        />
        <View style={styles.container}>
          <Logo width={wp('35%')} height={hp('16%')} style={styles.image} />
          <Text style={styles.textlogo}>Masuk</Text>

          <View style={styles.posision}>
            <View style={styles.comboPassword}>
            <View style={styles.containerInput}>
                <TextInput
                  autoCapitalize="none"
                  placeholder="Nomor telepon / email"
                  placeholderTextColor="#C1B5B2"
                  keyboardType="email-address"
                  style={styles.inputStyle}
                  underlineColorAndroid="transparent"
                  value={phone}
                  onChangeText={value =>
                    this._isMounted && this.setState({phone: value})
                  }
                />
              </View>
            
            <IconUser style={styles.icon} width={wp('6%')} height={hp('6%')} />
            </View>
            <View style={styles.comboPassword}>
              <View style={styles.containerInput}>
                <TextInput
                  autoCapitalize="none"
                  placeholder="Kata sandi"
                  placeholderTextColor="#C1B5B2"
                  value={password}
                  secureTextEntry={this.state.hidePass ? true : false}
                  onChangeText={value =>
                    this._isMounted && this.setState({password: value})
                  }
                  style={styles.inputStyle}
                />
              </View>
              <IconSandi
                style={styles.icon}
                width={wp('6%')}
                height={hp('6%')}
              />
              <IconEye
                style={styles.eye}
                width={wp('5%')}
                height={hp('3%')}
                onPress={() => {
                  if (this.state.hidePass == true) {
                    this._isMounted && this.setState({hidePass: false});
                  } else {
                    this._isMounted && this.setState({hidePass: true});
                  }
                }}
              />
            </View>
          </View>
          <View style={styles.btnLupaPassword}>
            <Text
              style={styles.textLupaPassword}
              onPress={() => {
                this.getFormLupa();
              }}>
              Lupa Password?
            </Text>
          </View>
          <View style={styles.viewBottom}>
            <TouchableOpacity
              style={styles.btnDaftar}
              onPress={() => {
                this.getRegister();
              }}>
              <Text style={styles.textBtnDaftar}>Daftar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnOk}
              onPress={() => this.loginHandler()}>
              <Text style={styles.textBtnDaftar}>OK</Text>
            </TouchableOpacity>
          </View>
          {/* <View style={styles.button}>
            <TouchableOpacity
              style={styles.buttonOK}
              onPress={() => this.loginHandler()}>
              <Text style={styles.textOK}>{'OK'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonBottom}>
            <TouchableOpacity
              // style={styles.buttonDaftar}
              onPress={() => {
                this.getRegister();
              }}>
              <Text style={styles.textLupaPassword}>{'Daftar'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.getFormLupa();
              }}>
              <Text style={[styles.textLupaPassword]}>{'Lupa Password ?'}</Text>
            </TouchableOpacity>
          </View> */}
        </View>
        <Whatsapp
          onPress={() =>
            this.setState({modalWhatsapp: !this.state.modalWhatsapp})
          }
          style={{position: 'absolute', right: 10, bottom: 20}}
          width={wp('15%')}
          height={wp('15%')}
        />
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalWhatsapp}
          onRequestClose={() => {
            this.setState({modalWhatsapp: !this.state.modalWhatsapp});
          }}>
          <TouchableWithoutFeedback
            onPress={() =>
              this.setState({modalWhatsapp: !this.state.modalWhatsapp})
            }>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(52, 52, 52, 0.9)',
              }}>
              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#000',
                  elevation: 5,
                  width: wp('70%'),
                }}>
                <View
                  style={{
                    width: '100%',
                    height: hp('8%'),
                    backgroundColor: '#529F45',
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      marginBottom: 15,
                      textAlign: 'center',
                      fontFamily: 'Lato-Medium',
                      fontSize: hp('2.5%'),
                      color: '#FFFFFF',
                    }}>
                    {'Punya pertanyaan? Silahkan Whatsapp kami'}
                  </Text>
                </View>
                <TouchableWithoutFeedback
                  onPress={() => this.handleChatWhatsapp('pusat')}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: hp('8%'),
                      backgroundColor: '#529F45',
                      width: wp('45%'),
                      justifyContent: 'center',
                      borderRadius: hp('1.5%'),
                      // paddingLeft: wp('5%'),
                      marginBottom: hp('2%'),
                      marginTop: hp('2%'),
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        textAlign: 'center',
                        fontFamily: 'Lato-Medium',
                        fontSize: hp('1.8%'),
                        textTransform: 'capitalize',
                      }}>
                      {this.state.numberWAPusat.provinsi}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
                {this.state.numberSubArray ? (
                  <SearchableDropdown
                    onTextChange={text => console.log(text)}
                    onItemSelect={item => this.handleChatWhatsapp(item)}
                    containerStyle={{
                      padding: 0,
                      backgroundColor: '#529F45',
                      width: wp('45%'),
                      borderRadius: hp('1.5%'),
                      marginBottom: hp('2%'),
                      justifyContent: 'center',
                    }}
                    textInputStyle={{
                      padding: 12,
                      backgroundColor: '#529F45',
                      color: '#FFFFFF',
                      width: '100%',
                      borderRadius: hp('1.5%'),
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    itemStyle={{
                      padding: 10,
                      marginTop: 2,
                      backgroundColor: '#529F45',
                      borderColor: '#bbb',
                      borderWidth: 1,
                      width: '100%',
                    }}
                    itemTextStyle={{
                      color: '#FFFFFF',
                    }}
                    itemsContainerStyle={{
                      maxHeight: '70%',
                    }}
                    items={this.state.numberWASub}
                    defaultIndex={0}
                    placeholder="Pilih Kota Anda"
                    placeholderTextColor="#FFF"
                    placeholderStyle={{
                      fontFamily: 'Lato-Medium',
                      fontSize: hp('2%'),
                    }}
                    resetValue={false}
                    underlineColorAndroid="transparent"
                  />
                ) : (
                  <TouchableWithoutFeedback
                    onPress={() => this.handleChatWhatsapp('sub')}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: hp('8%'),
                        backgroundColor: '#529F45',
                        width: wp('45%'),
                        justifyContent: 'center',
                        borderRadius: hp('1.5%'),
                        // paddingLeft: wp('5%'),
                        marginBottom: hp('2%'),
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          textAlign: 'center',
                          fontFamily: 'Lato-Medium',
                          fontSize: hp('1.8%'),
                          textTransform: 'capitalize',
                        }}>
                        {this.state.numberWASub.provinsi}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
});

const mapDispatchToProps = dispatch => {
  return {
    loginAct: (value, tipe) => {
      dispatch(LoginAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

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
    // padding: wp(6),
  },
  textlogo: {
    color: '#575251',
    fontFamily: 'Lato-Medium',
    fontWeight: 'bold',
    fontSize: hp('3%'),
    marginTop: hp('2%'),
    marginBottom: hp('2%'),
  },
  posision: {
    flexDirection: 'column',
    position: 'relative',
  },
  containerInput: {
    overflow: 'hidden',
    paddingBottom: hp('1.5%'),
    paddingHorizontal: wp('2%'),
  },
  inputStyle: {
    color: 'black',
    fontFamily: 'Lato-Medium',
    fontSize: hp('1.6%'),
    width: wp('70%'),
    height: hp('5.5%'),
    textAlign: 'left',
    borderColor: '#E8E8E8',
    borderWidth: 1,
    borderRadius: wp('4%'),
    marginTop: hp('2%'),
    paddingHorizontal: wp('13%'),
    backgroundColor: '#F1F1F1',
    shadowColor: '#575251',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 7,
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
  comboPassword: {
    flexDirection: 'row',
  },
  btnLupaPassword: {
    width: wp('70%'),
    paddingHorizontal: wp('5%'),
  },
  textLupaPassword: {
    fontStyle: 'italic',
    color: '#C1B5B2',
    fontSize: hp('1.6%'),
    marginTop: hp('0.2%'),
    width: '40%',
  },
  viewBottom: {
    width: wp('70%'),
    flexDirection: 'row',
    marginTop: hp('1.7%'),
  },
  btnDaftar: {
    backgroundColor: '#F4964A',
    flex: 3,
    marginRight: wp('3%'),
    paddingVertical: hp('1.2%'),
    borderRadius: 30,
    shadowColor: '#575251',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 7,
  },
  btnOk: {
    backgroundColor: '#51AF3E',
    flex: 1,
    paddingVertical: hp('1.2%'),
    borderRadius: 30,
    shadowColor: '#575251',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 7,
  },
  textBtnDaftar: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: hp('1.6%'),
    fontWeight: '700',
  },
  loadingApi: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.2)',
    justifyContent: 'center',
    alignSelf: 'center',
    width: wp('100%'),
    height: hp('100%'),
    position: 'absolute',
  },
  offlineContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('100%'),
    flexDirection: 'row',
    marginTop: hp('2%'),
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
    textAlign: 'center',
    fontSize: hp('2%'),
  },
});
