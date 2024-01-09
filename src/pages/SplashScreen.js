import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import AppIntroSlider from 'react-native-app-intro-slider';
import Storage from '@react-native-async-storage/async-storage';
import {ActivityIndicator} from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import axios from 'axios';
import CONFIG from '../constants/config';
import ModalAlert from '../components/ModalAlert';
import Snackbar from 'react-native-snackbar';

const slides = [
  {
    key: 1,
    title: 'Pencarian',
    text: 'Semua view dan produk kami ada disini',
    image: require('../assets/images/Splash.png'),
    backgroundColor: '#59b2ab',
    // text: 'Description.\nSay something cool',
  },
  {
    key: 2,
    title: 'Pembelian',
    text: 'Pembelian aman dan data lebih transparan',
    image: require('../assets/images/Splash2.png'),
    backgroundColor: '#febe29',
  },
  {
    key: 3,
    title: 'Pembayaran',
    text: 'Pembayaran lebih mudah dengan system\ncod dan tempo',
    image: require('../assets/images/Splash3.png'),
    backgroundColor: '#22bcb5',
  },
  {
    key: 4,
    title: 'Pengantaran',
    text: 'Belanja makin hemat dengan fitur\nBebas Ongkir',
    image: require('../assets/images/Splash4.png'),
    backgroundColor: '#22bcb5',
  },
];

function Loading() {
  return (
    <View style={styles.offlineContainer}>
      <ActivityIndicator animating size="large" color="#529F45" />
    </View>
  );
}

export class SplashScreen extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      loading: true,
      version: 0,
      optional_update: 'false',
      require_update: 'false',
      alertData: '',
      tambahan: '',
      buttonAlert: '',
      buttonAlertCancel: '',
      modalAlert: false,
      passLogin: false,
    };
  }

  // componentDidMount() {
  //     setTimeout(() => {
  //         this.props.navigation.replace('Login')
  //     }, 3000)
  // }

  getVersion = async () => {
    try {
      console.log('cek versi');
      let response = await axios({
        method: 'post',
        url: `${CONFIG.BASE_URL}/api/version`,
        data: {version: '1.1.10'},
      });
      const data = response.data;
      console.log('response', data);
      this._isMounted &&
        this.setState({
          version: data.data.version,
          require_update: data.data.require_update,
          optional_update: data.data.optional_update,
        });
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
        'Cek Error===========getVersion=============',
        JSON.parse(JSON.stringify(error)).message,
      );
      if (error429) {
        this.showSnackbarBusy();
      } else if (errorNetwork) {
        this.showSnackbarInet();
      }
    }
    let intro = await Storage.getItem('intro');
    console.log('====================================');
    console.log('intro', intro);
    console.log('====================================');
    // Storage.removeItem('token');
    console.log('this.state.optional_update', this.state.optional_update);
    console.log('this.state.require_update', this.state.require_update);
    if (
      intro === 'true' &&
      this.state.optional_update === 'false' &&
      this.state.require_update === 'false'
    ) {
      console.log('masuk ke 1');
      this.props.navigation.replace('Login');
    } else if (
      intro === 'true' &&
      this.state.optional_update === 'true' &&
      this.state.require_update === 'false'
    ) {
      console.log('masuk ke 2');
      await this.setState({
        tambahan: 'Versi app anda sudah lama',
        alertData: 'Mohon perbarui app anda',
        buttonAlert: 'Perbarui',
        buttonAlertCancel: 'Lewati',
        modalAlert: !this.state.modalAlert,
        passLogin: true,
      });
    } else if (
      intro === 'true' &&
      this.state.optional_update === 'false' &&
      this.state.require_update === 'true'
    ) {
      console.log('masuk ke 3');
      await this.setState({
        tambahan: 'Versi app anda sudah lama',
        alertData: 'Mohon perbarui app anda untuk melanjutkan',
        buttonAlert: 'Perbarui',
        modalAlert: !this.state.modalAlert,
      });
    } else if (
      intro === 'true' &&
      this.state.optional_update === 'true' &&
      this.state.require_update === 'true'
    ) {
      console.log('masuk ke 4');
      await this.setState({
        tambahan: 'Versi app anda sudah lama',
        alertData: 'Mohon perbarui app anda untuk melanjutkan',
        buttonAlert: 'Perbarui',
        modalAlert: !this.state.modalAlert,
      });
    } else if (
      (intro === null || intro === '') &&
      this.state.optional_update === 'true' &&
      this.state.require_update === 'false'
    ) {
      console.log('masuk ke 5');
      await this.setState({
        tambahan: 'Versi app anda sudah lama',
        alertData: 'Mohon perbarui app anda',
        buttonAlert: 'Perbarui',
        buttonAlertCancel: 'Lewati',
        modalAlert: !this.state.modalAlert,
      });
    } else if (
      (intro === null || intro === '') &&
      this.state.optional_update === 'false' &&
      this.state.require_update === 'true'
    ) {
      console.log('masuk ke 6');
      await this.setState({
        tambahan: 'Versi app anda sudah lama',
        alertData: 'Mohon perbarui app anda untuk melanjutkan',
        buttonAlert: 'Perbarui',
        modalAlert: !this.state.modalAlert,
      });
    } else if (
      (intro === null || intro === '') &&
      this.state.optional_update === 'true' &&
      this.state.require_update === 'true'
    ) {
      console.log('masuk ke 7');
      await this.setState({
        tambahan: 'Versi app anda sudah lama',
        alertData: 'Mohon perbarui app anda untuk melanjutkan',
        buttonAlert: 'Perbarui',
        modalAlert: !this.state.modalAlert,
      });
    } else if (
      intro === 'true' &&
      this.state.optional_update === undefined &&
      this.state.require_update === undefined
    ) {
      console.log('masuk ke 8');
      this.props.navigation.replace('Login');
    } else if (
      (intro === null || intro === '') &&
      this.state.optional_update === undefined &&
      this.state.require_update === undefined
    ) {
      console.log('masuk ke 9');
      this.setState({loading: false});
    } else {
      console.log('masuk ke 10');
      this.setState({loading: false});
      return;
    }
  };

  UNSAFE_componentWillMount = async () => {
    this._isMounted = true;
    // lor(this);
    await this.getVersion();
  };

  componentWillUnmount() {
    this._isMounted = false;
    // rol();
  }
 
  getLogin = async () => {
    await Storage.setItem('intro', 'true');

    this.props.navigation.replace('Login');
  };

  _renderItem = ({item}) => {
    return (
      <View style={styles.slide}>
        <Image source={item.image} style={styles.image} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
        {item.key === 1 && (
          <TouchableOpacity
            onPress={() => this.getLogin()}
            style={styles.buttonSkip}>
            <Text style={styles.textMulai}>{'Lewati'}</Text>
          </TouchableOpacity>
        )}
        {item.key === 4 && (
          <TouchableOpacity
            onPress={() => this.getLogin()}
            style={styles.buttonMulai}>
            <Text style={styles.textMulai}>{'MULAI'}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  getCloseAlertModal = async e => {
    console.log('cancel', e);
    if (
      !e &&
      this.state.alertData == 'Mohon perbarui app anda untuk melanjutkan'
    ) {
      Linking.openURL(
        'http://play.google.com/store/apps/details?id=com.semutgajah',
      );
    } else if (this.state.passLogin) {
      this.setState({passLogin: false});
      this.props.navigation.replace('Login');
    } else {
      await this.setState({
        modalAlert: !this.state.modalAlert,
        buttonAlert: '',
        loading: false,
      });
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
          this.setState({loading: false});
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
          this.setState({loading: false});
        },
      },
    });
  };

  render() {
    if (this.state.loading && !this.state.modalAlert) {
      return <Loading />;
    } else if (this.state.loading && this.state.modalAlert) {
      return (
        <ModalAlert
          modalAlert={this.state.modalAlert}
          tambahan={this.state.tambahan}
          alert={this.state.alertData}
          buttonAlert={this.state.buttonAlert}
          buttonAlertCancel={this.state.buttonAlertCancel}
          getCloseAlertModal={e => this.getCloseAlertModal(e)}
        />
      );
    }
    return (
      <AppIntroSlider
        activeDotStyle={styles.activeDotStyle}
        dotStyle={styles.dotStyle}
        renderItem={this._renderItem}
        data={slides}
      />
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    backgroundColor: 'white',
    height: hp('100%'),
    width: wp('100%'),
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  image: {
    height: hp('70%'),
    width: wp('80%'),
  },
  title: {
    fontFamily: 'Lato-Bold',
    fontSize: hp('3%'),
    color: '#468936',
  },
  text: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('1.8%'),
    textAlign: 'center',
    color: '#000000',
  },
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDotStyle: {
    width: wp('10%'),
    backgroundColor: '#529F45',
    marginLeft: wp('-1%'),
    marginRight: wp('-1%'),
  },
  dotStyle: {
    width: wp('10%'),
    backgroundColor: '#7EDC6E',
    marginLeft: wp('-1%'),
    marginRight: wp('-1%'),
  },
  buttonSkip: {
    width: wp('40%'),
    backgroundColor: '#E07126',
    height: hp('5%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp('10%'),
    marginTop: hp('2%'),
  },
  buttonMulai: {
    width: wp('40%'),
    backgroundColor: '#529F45',
    height: hp('5%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp('10%'),
    marginTop: hp('2%'),
  },
  textMulai: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('1.6%'),
    color: 'white',
  },
  offlineContainer: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: wp('100%'),
    height: hp('100%'),
  },
});
