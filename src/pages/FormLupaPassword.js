import React, {Component} from 'react';
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
import axios from 'axios';
import Logo from '../assets/icons/IconLogo.svg';
// import Background from '../assets/images/Background.png';
import CONFIG from '../constants/config';
import Size from '../components/Fontresponsive';
import IconPhone from '../assets/icons/Phone.svg';
import IconUser from '../assets/icons/User.svg';
import IconSandi from '../assets/icons/Sandi.svg';
import IconReSandi from '../assets/icons/ReSandi.svg';
import IconEye from '../assets/icons/Eye.svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import ModalAlert from '../components/ModalAlert';
import Snackbar from 'react-native-snackbar';

function MiniOfflineSign() {
  return (
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>{'Tidak ada koneksi internet'}</Text>
    </View>
  );
}

export class FormLupaPassword extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      phone: '',
      password: '',
      password_confirmation: '',
      hidePass: true,
      hidePass2: true,
      alertData: '',
      modalAlert: false,
    };
  }

  UNSAFE_componentWillMount() {
    // lor(this);
    this._isMounted = true;
  }

  componentWillUnmount() {
    // rol();
    this._isMounted = false;
  }

  loginHandler = async () => {
    if (!this.state.password.trim()) {
      this.setState({
        alertData: 'Pastikan password tidak ada yang kosong',
        modalAlert: !this.state.modalAlert,
      });
      return;
    } else if (!this.state.password_confirmation.trim()) {
      this.setState({
        alertData: 'Pastikan password confirm tidak ada yang kosong',
        modalAlert: !this.state.modalAlert,
      });
      return;
    } else if (this.state.alert == true) {
      this.setState({
        alertData: 'Pastikan password diisi dengan benar',
        modalAlert: !this.state.modalAlert,
      });
      return;
    } else if (this.state.alert2 == true) {
      this.setState({
        alertData: 'Pastikan password diisi dengan benar',
        modalAlert: !this.state.modalAlert,
      });
      return;
    } else {
      try {
        let response = await axios.post(
          `${CONFIG.BASE_URL}/api/auth/forgot-password`,
          {
            email_phone: this.state.phone,
            password: this.state.password,
            confirmation_password: this.state.password_confirmation,
          },
        );
        let data = response.data;
        if (data !== '' && data['success'] == true) {
          this.props.navigation.navigate('Login');
          console.log('DATA', data.data);
        } else {
          let message = data.message;
          // console.log('message === yuhu', message);
          // this.props.loginAct('isLogin', false);
          let user = 'Send forgot password failed';
          let userNot = 'User not found';
          if (message === user) {
            this.setState({
              alertData: 'Edit password gagal',
              modalAlert: !this.state.modalAlert,
            });
          } else if (message == userNot) {
            this.setState({
              alertData: 'Nomor telepon tidak ditemukan',
              modalAlert: !this.state.modalAlert,
            });
          }
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
    return (
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <ModalAlert
          modalAlert={this.state.modalAlert}
          alert={this.state.alertData}
          getCloseAlertModal={() => this.getCloseAlertModal()}
        />
        <View style={styles.container}>
          <Logo width={wp('35%')} height={hp('16%')} style={styles.image} />
          <Text style={styles.textlogo}>{'Lupa Password'}</Text>

          <View style={styles.posision}>
            {/* <Text style={[styles.textStyle]}>{'Nomor Telepon'}</Text> */}
            <View style={styles.containerInput}>
              <TextInput
                autoCapitalize="none"
                placeholder="Nomor telepon / email"
                placeholderTextColor="#A4A4A4"
                keyboardType="email-address"
                style={styles.inputStyle}
                underlineColorAndroid="transparent"
                onChangeText={value =>
                  this._isMounted && this.setState({phone: value})
                }
              />
            </View>
            <IconUser style={styles.icon} width={wp('6%')} height={hp('6%')} />
          </View>
          <View style={styles.posision}>
            <View style={styles.comboPassword}>
              <View style={styles.containerInput}>
                <TextInput
                  autoCapitalize="none"
                  placeholder="Kata Sandi Baru"
                  placeholderTextColor="#A4A4A4"
                  style={styles.inputStyle}
                  secureTextEntry={this.state.hidePass ? true : false}
                  onChangeText={value => {
                    this._isMounted &&
                      this.setState({password: value}, () => {
                        if (this.state.password.length < 7) {
                          this.setState({alert: true});
                        } else {
                          this.setState({alert: false});
                        }
                      });
                  }}
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
            {this.state.alert && (
              <Text style={styles.textWarning}>Password Harus 8 Character</Text>
            )}
          </View>
          {/* <Text style={[styles.textStyle]}>{'Konfirmasi Kata Sandi'}</Text> */}
          <View style={styles.posision}>
            <View style={styles.comboPassword}>
              <View style={styles.containerInput}>
                <TextInput
                  autoCapitalize="none"
                  placeholder="Konfirmasi Kata Sandi Baru"
                  placeholderTextColor="#A4A4A4"
                  style={styles.inputStyle}
                  secureTextEntry={this.state.hidePass2 ? true : false}
                  onChangeText={value => {
                    this._isMounted &&
                      this.setState({password_confirmation: value}, () => {
                        if (
                          this.state.password !==
                          this.state.password_confirmation
                        ) {
                          this.setState({alert2: true});
                        } else {
                          this.setState({alert2: false});
                        }
                      });
                  }}
                />
              </View>
              <IconReSandi
                style={styles.icon}
                width={wp('6%')}
                height={hp('6%')}
              />
              <IconEye
                style={styles.eye}
                width={wp('5%')}
                height={hp('3%')}
                onPress={() => {
                  if (this.state.hidePass2 === true) {
                    this._isMounted && this.setState({hidePass2: false});
                  } else {
                    this._isMounted && this.setState({hidePass2: true});
                  }
                }}
              />
            </View>
            {this.state.alert2 && (
              <Text style={styles.textWarning}>Password Tidak Sama</Text>
            )}
          </View>

          <View style={styles.buttonPosisi}>
            <View></View>
            <View>
              <TouchableOpacity
                style={styles.buttonKirim}
                onPress={() => this.loginHandler()}>
                <Text style={styles.textKirim}>{'Kirim'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  phone: state.LoginReducer.phone,
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(FormLupaPassword);

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
    fontSize: hp('1.6%'),
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
  textWarning: {
    color: 'red',
    fontSize: hp('1.2%'),
    fontFamily: 'Lato-Medium',
    marginTop: hp('-2%'),
    // marginBottom: hp(0),
    marginLeft: wp('5%'),
  },
  textStyle: {
    fontFamily: 'Lato-Bold',
    fontSize: hp('1.6%'),
    paddingTop: hp('3%'),
    // paddingLeft:Font(34)
  },
  buttonPosisi: {
    flexDirection: 'row',
  },
  buttonKirim: {
    backgroundColor: '#529F45',
    height: hp('5.5%'),
    width: wp('70%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp('2%'),
    marginTop: hp('2%'),
  },
  textKirim: {
    textAlign: 'center',
    color: 'white',
    fontFamily: 'Lato-Regular',
    fontSize: hp('1.4%'),
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
});
