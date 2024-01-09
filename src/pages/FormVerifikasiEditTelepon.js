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
import Logo from '../assets/icons/Logo.svg';
// import Background from '../assets/images/Background.png';
import IconEye from '../assets/icons/Eye.svg';
import CONFIG from '../constants/config';
import messaging from '@react-native-firebase/messaging';
import Size from '../components/Fontresponsive';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Storage from '@react-native-async-storage/async-storage';
import IconBack from '../assets/icons/backArrow.svg';
import ModalAlert from '../components/ModalAlert';
import Snackbar from 'react-native-snackbar';

export class FormVerifikasiEditTelepon extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      codeOTP: '',
      timer: 60,
      alertData: '',
      modalAlert: false,
    };
  }

  UNSAFE_componentWillMount() {
    // lor(this);
    this._isMounted = true;
    this.setTime();
  }

  componentWillUnmount() {
    // rol()
    this._isMounted = false;
    clearInterval(this.interval);
  }

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

  sendOTP = async () => {
    const formData = {
      phone: this.props.phone,
      customer_code: this.props.dataUser.customer_code,
    };
    try {
      let response = await axios.post(
        `${CONFIG.BASE_URL}/api/otp/phone-number/sms`,
        formData,
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      // console.log(response)
      const data = response.data;
      if (data !== '' && data['success'] == true) {
        console.log('MASUK', data.data);
      } else {
        console.log('', typeof data);
        this.setState({
          alertData: 'Gagal mengirim otp' + data.message,
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
      }
    }
  };

  cekOTP = async () => {
    const formData = {
      otp_code: this.state.codeOTP,
      phone: this.props.phone,
    };
    console.log('data====>', formData);
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
      console.log(data);
      if (data !== '' && data['success'] == true) {
        //   this.props.loginAct(data.data.user, 'dataUser');
        //   this.props.loginAct(data.data.token, 'token');
        this.setState({
          alertData: 'Verifikasi sukses',
          modalAlert: !this.state.modalAlert,
        });
      } else {
        this.setState({
          alertData: 'Verifikasi gagal, pastikan kode otp sesuai',
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

  getCloseAlertModal = async () => {
    this.setState({modalAlert: !this.state.modalAlert});
    if (this.state.alertData == 'Verifikasi sukses') {
      try {
        let response = await axios.post(
          `${CONFIG.BASE_URL}/api/profile/${this.props.dataUser.id}`,
          {
            phone: this.props.phone,
            name: this.props.dataUser.name,
            email: this.props.dataUser.email,
          },
          {
            headers: {
              Authorization: `Bearer ${this.props.token}`,
            },
          },
        );
        const data = response.data;
        console.log('DATA', data.data);
        if (data.data != null) {
          this.props.loginAct(data.data, 'dataUser');
          this.props.loginAct('', 'phone');
          this.props.navigation.replace('DataUser');
        } else {
          this.setState({
            alertData: 'Nomor telepon gagal diubah  ' + data.message,
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
        } else if (error400) {
          Storage.removeItem('token');
          this.props.navigation.navigate('Home');
        }
      }
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
    const {timer} = this.state;
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container2}>
        <ModalAlert
          modalAlert={this.state.modalAlert}
          alert={this.state.alertData}
          getCloseAlertModal={() => this.getCloseAlertModal()}
        />
        <View showsVerticalScrollIndicator={false} style={styles.scroll}>
          <View style={styles.container}>
            <IconBack
              width={wp('4%')}
              height={hp('4%')}
              stroke="black"
              strokeWidth="2.5"
              fill="black"
              onPress={() => this.props.navigation.goBack()}
            />
            <Text style={styles.textlogo}>{'Verifikasi'}</Text>
          </View>
          <View style={styles.posision}>
            <Text style={[styles.textStyle]}>{'Kode OTP'}</Text>
            <TextInput
              autoCapitalize="none"
              placeholder=""
              style={styles.inputStyle}
              underlineColorAndroid="transparent"
              onChangeText={value =>
                this._isMounted && this.setState({codeOTP: value})
              }
            />
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
            )}
          </View>
          <TouchableOpacity style={styles.button} onPress={() => this.cekOTP()}>
            <Text style={styles.textButton}>{'OK'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
  dataUser: state.LoginReducer.dataUser,
  phone: state.LoginReducer.phone,
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
)(FormVerifikasiEditTelepon);

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    paddingHorizontal: wp('5%'),
  },
  background: {
    flexGrow: 1,
    height: hp('100%'),
    alignItems: 'center',
    paddingVertical: hp('18%'),
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: hp('8%'),
    backgroundColor: 'white',
    paddingHorizontal: wp('5%'),
    marginHorizontal: wp('-5%'),
    borderBottomWidth: 4,
    borderColor: '#ddd',
  },
  container2: {
    flex: 1,
  },
  textlogo: {
    color: '#000',
    fontFamily: 'Lato-Medium',
    fontSize: hp('2.4%'),
    paddingLeft: wp('5%'),
  },
  posision: {
    flexDirection: 'column',
    paddingVertical: hp('2%'),
  },
  inputStyle: {
    color: 'black',
    fontFamily: 'Lato-Bold',
    fontSize: hp('1.6%'),
    width: wp('90%'),
    textAlign: 'left',
    borderColor: '#E8E8E8',
    borderBottomWidth: 2,
    height: hp('4%'),
    paddingVertical: 0,
  },
  textStyle: {
    fontFamily: 'Lato-Bold',
    fontSize: hp('1.6%'),
    paddingTop: hp('3%'),
    // paddingLeft:Font(34)
  },
  button: {
    backgroundColor: '#529F45',
    height: hp('4.5%'),
    width: wp('90%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Size(10),
  },
  textButton: {
    textAlign: 'center',
    color: 'white',
    fontFamily: 'Lato-Medium',
    fontSize: hp('1.8%'),
  },
  textLupaPassword: {
    fontFamily: 'Lato-Regular',
    fontSize: hp('1.1%'),
    paddingTop: hp('1%'),
    // paddingLeft:Font(34)
  },
});
