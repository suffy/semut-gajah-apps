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
  Alert,
} from 'react-native';
import axios from 'axios';
import Logo from '../assets/icons/IconLogo.svg';
// import Background from '../assets/images/Background.png';
import CONFIG from '../constants/config';
import Size from '../components/Fontresponsive';
import {LoginAction} from '../redux/Action';
import {connect} from 'react-redux';
import IconToko from '../assets/newIcons/iconToko.svg';
import IconUser from '../assets/newIcons/iconPerson.svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import ModalAlert from '../components/ModalAlert';
import Snackbar from 'react-native-snackbar'; 

function MiniOfflineSign() {
  return (
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>{'Tidak ada koneksi internet'}</Text>
    </View>
  );
}

export class FormInputCodeUser extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      code: '',
      approval: '',
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

  getRegisterUserLama = async () => {
    console.log('cekkkk', this.state.code, this.state.approval);
    try {
      let response = await axios.get(`${CONFIG.BASE_URL}/api/auth/erp/check?`, {
        params: {
          customer_code: this.state.code,
          code_approval: this.state.approval,
        },
      });
      const data = response.data;
      console.log('DATA', JSON.stringify(data.data));
      console.log('DATA', data.data.otp_verified_at);
      if (data.data.otp_verified_at == null) {
        this.props.loginAct(data.data, 'dataUser');
        this.props.navigation.navigate('RegisterUserLama');
      } else {
        this.setState({
          alertData: 'Akun kode customer ini sudah terdaftar',
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
      } else {
        this.setState({
          alertData: 'Kode User Salah',
          modalAlert: !this.state.modalAlert,
        });
      }
    }
  };
  getCloseAlertModal() {
    this.setState({modalAlert: !this.state.modalAlert});
    if (this.state.alertData == 'Akun kode customer ini sudah terdaftar') {
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
          <Text style={styles.textlogo}>{'Pelanggan Lama'}</Text>

          <View style={styles.posision}>
            {/* <Text style={[styles.textStyle]}>{'Kode User'}</Text> */}
            <View style={styles.containerInput}>
              <TextInput
                autoCapitalize="none"
                placeholder="Kode Customer"
                placeholderTextColor="#C1B5B2"
                style={styles.inputStyle}
                underlineColorAndroid="transparent"
                onChangeText={value =>
                  this._isMounted && this.setState({code: value})
                }
              />
            </View>
            <IconUser style={styles.icon} width={wp('6%')} height={hp('6%')} />
          </View>
          <View style={styles.posision}>
            {/* <Text style={[styles.textStyle]}>{'Kode User'}</Text> */}
            <View style={styles.containerInput}>
              <TextInput
                autoCapitalize="none"
                placeholder="Kode Unik Toko"
                placeholderTextColor="#C1B5B2"
                style={styles.inputStyle}
                underlineColorAndroid="transparent"
                onChangeText={value =>
                  this._isMounted && this.setState({approval: value})
                }
              />
            </View>
            <IconToko style={styles.icon} width={wp('6%')} height={hp('6%')} />
          </View>

          <View style={styles.button}>
            <TouchableOpacity
              style={styles.buttonKembali}
              onPress={() => this.props.navigation.goBack()}>
              <Text style={styles.textOk}>{'Kembali'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonOk}
              onPress={() => this.getRegisterUserLama()}>
              <Text style={styles.textOk}>{'OK'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => {
  return {
    loginAct: (value, tipe) => {
      dispatch(LoginAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormInputCodeUser);

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
    backgroundColor: '#F1F1F1',
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
  buttonOk: {
    backgroundColor: '#529F45',
    height: hp('5.5%'),
    width: wp('40%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp('2%'),
    marginTop: hp('2%'),
  },
  textOk: {
    textAlign: 'center',
    color: 'white',
    fontFamily: 'Lato-Regular',
    fontSize: hp('1.4%'),
  },
  buttonKembali: {
    backgroundColor: '#E07126',
    height: hp('5.5%'),
    width: wp('20%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp('2%'),
    marginTop: hp('2%'),
    marginRight: wp('2%'),
  },
  textLupaPassword: {
    fontFamily: 'Lato-Regular',
    fontSize: hp('1.2%'),
    marginTop: hp('1.5%'),
    marginBottom: hp('3%'),
    marginLeft: wp('5%'),
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
