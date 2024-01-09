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
  PermissionsAndroid,
} from 'react-native';
import axios from 'axios';
import Logo from '../assets/icons/IconLogo.svg';
// import Background from '../assets/images/Background.png';
import CONFIG from '../constants/config';
import Size from '../components/Fontresponsive';
import {LoginAction} from '../redux/Action';
import {connect} from 'react-redux';
import IconIdentity from '../assets/icons/IdentifyUser.svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Geolocation from 'react-native-geolocation-service';
import {ActivityIndicator} from 'react-native-paper';
function LoadingApi() {
  return (
    <View style={styles.loadingApi}>
      <ActivityIndicator animating size="large" color="#529F45" />
    </View>
  );
}
export class FormIdentificationUser extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      code: '',
      lokasi: '',
      loadingApi: false,
    };
  }

  UNSAFE_componentWillMount() {
    // lor(this);
  }

  componentWillUnmount() {
    // rol()
  }

  getCodeUser = () => {
    this.props.navigation.navigate('FormInputCodeUser');
  };
  async getPermissions() {
    this.setState({loadingApi: true});
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      console.log('pos ' + granted + ' ' + PermissionsAndroid.RESULTS.GRANTED);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(position => {
          console.log('log 89');
          this.setState({loadingApi: false});
          this.props.navigation.navigate('Register', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        });
        return 0;
      } else {
        console.warn('Ijinkan akses lokasi untuk lanjut');
        return 0;
      }
    } catch (err) {
      console.warn(err.message);
      return 0;
    }
  }

  render() {
    const {loadingApi} = this.state;
    return (
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* <ImageBackground
          // source={Background}
          style={styles.background}> */}
        <View style={styles.container}>
          <Logo width={wp('35%')} height={hp('16%')} style={styles.imageLogo} />
          <Text style={styles.textlogo}>{'Identifikasi User'}</Text>

          <View style={styles.buttonPosisi}>
            <IconIdentity width={wp('70%')} height={hp('30%')} />
            <TouchableOpacity
              style={[styles.buttonPelangganBaru, styles.buttonRadius]}
              onPress={() => {
                this.getPermissions();
              }}>
              <Text style={styles.textPelangganBaru}>{'User Baru'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttonPelangganLama, styles.buttonRadius]}
              onPress={() => {
                this.getCodeUser();
              }}>
              <Text style={styles.textPelangganBaru}>{'User Lama'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        {loadingApi ? <LoadingApi /> : null}
        {/* </ImageBackground> */}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FormIdentificationUser);

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  background: {
    flex: 1,
    height: hp('100%'),
    alignItems: 'center',
    paddingVertical: hp('15%'),
    backgroundColor: '#E07126',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: wp('100%'),
    height: hp('100%'),
    alignItems: 'center',
    borderRadius: Size(10),
    padding: wp('6%'),
  },
  textlogo: {
    color: '#575251',
    fontWeight: 'bold',
    fontFamily: 'Lato-Medium',
    fontSize: hp('3%'),
    marginTop: hp('3%'),
    marginBottom: hp('2%'),
  },
  imageLogo: {
    marginTop: hp('6%'),
  },
  posision: {
    flexDirection: 'column',
    paddingVertical: hp('5%'),
  },
  inputStyle: {
    color: 'black',
    fontFamily: 'Lato-Bold',
    fontSize: hp('1.6%'),
    width: wp('70%'),
    textAlign: 'left',
    borderColor: '#E8E8E8',
    borderBottomWidth: 1,
    height: hp('4%'),
    paddingVertical: 0,
  },
  textStyle: {
    fontFamily: 'Lato-Bold',
    fontSize: hp('1.6%'),
    marginTop: hp('3%'),
    // paddingLeft:Font(34)
  },
  buttonPosisi: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRadius: {
    height: hp('4.5%'),
    width: wp('55%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp('5%'),
  },
  buttonPelangganLama: {
    backgroundColor: '#F4964A',
  },
  buttonPelangganBaru: {
    backgroundColor: '#51AF3E',
    marginBottom: wp('4%'),
  },
  textPelangganBaru: {
    textAlign: 'center',
    fontFamily: 'Lato-Medium',
    fontSize: hp('1.6%'),
    color: '#FFFFFF',
  },
  comboPassword: {
    flexDirection: 'row',
  },
  eye: {
    paddingTop: hp('4%'),
    marginLeft: wp('-5%'),
  },
  textLupaPassword: {
    fontFamily: 'Lato-Regular',
    fontSize: hp('1.2%'),
    paddingTop: hp('1%'),
    // paddingLeft:Font(34)
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
