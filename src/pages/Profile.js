import React, {Component} from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import {connect} from 'react-redux';
import IconSetting from '../assets/newIcons/iconSetting.svg';
import IconCoin from '../assets/newIcons/iconPoint.svg';
import IconCreditcard from '../assets/newIcons/iconKredit.svg';
import IconRedeem from '../assets/icons/Redeem.svg';
import IconTransaction from '../assets/newIcons/iconTransaksi.svg';
import IconUlasan from '../assets/newIcons/iconUlasan.svg';
import IconWhishlist from '../assets/newIcons/iconWishList.svg';
import IconSubscribe from '../assets/newIcons/iconShopingBag.svg';
import IconHerbal from '../assets/newIcons/iconHerbal2.svg';
import IconSupMul from '../assets/newIcons/iconSuplemen2.svg';
import IconFoodBev from '../assets/newIcons/iconMakananMinuman.svg';
import IconMinyak from '../assets/newIcons/iconMinyakAngin.svg';
import IconComplain from '../assets/newIcons/iconKomplain.svg';
import IconHelp from '../assets/newIcons/iconBantuan.svg';
import IconQR from '../assets/newIcons/iconQRcode.svg';
import Logout from '../assets/newIcons/iconLogout.svg';
import Size from '../components/Fontresponsive';
import axios from 'axios';
import CONFIG from '../constants/config';
import {Avatar} from 'react-native-elements';
import NumberFormat from 'react-number-format';
import Storage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import {ActivityIndicator} from 'react-native-paper';
import IconBack from '../assets/icons/backArrow.svg';
import {LoginAction} from '../redux/Action';
import IconArrowRight from '../assets/icons/RightArrow.svg';
import ModalDelete from '../components/ModalDelete';
import Snackbar from 'react-native-snackbar';
import {CommonActions} from '@react-navigation/native';
import IconMisi from '../assets/icons/DaftarMisi.svg';
import Header from '../components/Header';
function LoadingApi() {
  return (
    <View style={styles.loadingApi}>
      <ActivityIndicator animating size="large" color="#529F45" />
    </View>
  );
}

// const {signOut} = React.useContext(AuthContext);
export class Profile extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      loadingApi: false,
      alertDelete: '',
      tambahanDelete: '',
      buttonDeleteCancel: '',
      buttonDelete: '',
      modalDelete: false,
    };
  }

  // UNSAFE_componentWillMount() {
  //   // lor(this);
  //   this.getDataUser();
  // }

  componentWillUnmount() {
    // rol();
    this._isMounted = false;
    this.focusListener();
  }

  componentDidMount = async () => {
    this.focusListener = await this.props.navigation.addListener('focus', () =>
      this.getDataUser(),
    );
  };

  getDataUser = async () => {
    try {
      let response = await axios.get(`${CONFIG.BASE_URL}/api/profile`, {
        headers: {Authorization: `Bearer ${this.props.token}`},
      });
      console.log('getDataUser');
      const data = response.data.data;
      // console.log('data nih', data);
      this.props.loginAct(data, 'dataUser');
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

  getName = () => {
    let name = this.props?.dataUser?.name
      ?.match(/(\b\S)?/g)
      .join('')
      .toUpperCase();
    if (name == null || name == '' || name == undefined) {
      return (name = 'NA');
    }
    return name;
  };

  getCloseModalDelete = async e => {
    this.setState({modalDelete: !this.state.modalDelete});
    if (!e && this.state.alertDelete == 'Apakah yakin ingin keluar?') {
      await axios
        .post(
          `${CONFIG.BASE_URL}/api/auth/logout`,
          {},
          {
            headers: {Authorization: `Bearer ${this.props.token}`},
          },
        )
        .then(response => {
          let data = response.data.success;
          if (data == true) {
            Storage.removeItem('token');
            this.setState({loadingApi: false});
            this.props.navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
            );
            // this.props.navigation.replace('Login');
          } else {
          }
        })
        .catch(error => {
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
        });
    } else if (!e && this.state.alertDelete == 'Menuju playstore?') {
      console.log('masukkk');
      Linking.openURL(
        'http://play.google.com/store/apps/details?id=com.semutgajah',
      );
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
    const {navigation, loadingApi, dataUser} = this.props;
    return (
      <View style={styles.scroll}>
        <ModalDelete
          modalDelete={this.state.modalDelete}
          tambahanDelete={this.state.tambahanDelete}
          alertDelete={this.state.alertDelete}
          getCloseModalDelete={e => this.getCloseModalDelete(e)}
        />
        <Header title={'Menu utama'} navigation={this.props.navigation} />
        <ScrollView style={[styles.scroll, {paddingTop: hp('3%')}]}>
          <View style={{flexDirection: 'row', paddingBottom: hp('2.5%')}}>
            {dataUser?.photo ? (
              <View style={styles.avatar}>
                <Image
                  source={{uri: CONFIG.BASE_URL + dataUser?.photo}}
                  style={styles.image}></Image>
              </View>
            ) : (
              <View style={styles.avatar}>
                <Avatar
                  size={hp('12%')}
                  width={hp('12%')}
                  height={hp('12%')}
                  containerStyle={{
                    backgroundColor: '#BDBDBD',
                  }}
                  // placeholderStyle={{backgroundColor: '#BDBDBD'}}
                  rounded
                  title={this.getName()}
                  activeOpacity={0.7}
                />
              </View>
            )}
            <View
              style={{
                marginLeft: wp('4%'),
              }}>
              {/* {'SEMUT GAJAH'} */}
              {dataUser?.user_address?.map((item, index) => (
                <Text key={index} style={styles.textjudul}>
                  {/* {'SEMUT GAJAH'} */}
                  {item.shop_name ? item.shop_name : item.name}
                </Text>
              ))}
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('CreditHistory')}>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <IconCreditcard width={wp('7%')} height={hp('4.5%')} />
                  <NumberFormat
                    value={
                      dataUser &&
                      dataUser?.credits &&
                      dataUser?.credits[0] &&
                      dataUser?.credits[0]?.credit
                    }
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'Rp '}
                    renderText={value => (
                      <Text style={styles.textangka}>{value || 0}</Text>
                    )}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('PointHistory')}>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <IconCoin width={wp('7%')} height={hp('4.5%')} />
                  <NumberFormat
                    value={Math.round(dataUser?.point)}
                    displayType={'text'}
                    thousandSeparator={true}
                    renderText={value => (
                      <Text style={styles.textangka}>{value || 0}</Text>
                    )}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <View style={[styles.viewBg, {backgroundColor: '#F4F4F4'}]}>
              <TouchableOpacity
                style={[styles.posisi]}
                onPress={() => navigation.navigate('ListDataPayment')}>
                <IconTransaction width={wp('7%')} height={hp('6%')} />
                <Text style={styles.textlist}>{' Semua Transaksi '}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.posisi}
                onPress={() => navigation.navigate('TopNav')}>
                <IconUlasan width={wp('7%')} height={hp('6%')} />
                <Text style={styles.textlist}>{' Ulasan '}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.posisi}
                onPress={() => navigation.navigate('Wishlist')}>
                <IconWhishlist width={wp('7%')} height={hp('6%')} />
                <Text style={styles.textlist}>{' Daftar Keinginan '}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.posisi}
                onPress={() => navigation.navigate('ListTimeSubscribe')}>
                <IconSubscribe width={wp('7%')} height={hp('6%')} />
                <Text style={styles.textlist}>{' Daftar Langganan '}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.posisi}
                onPress={() => navigation.navigate('SplashMission')}>
                <IconMisi width={wp('7%')} height={hp('6%')} />
                <Text style={styles.textlist}>{' Misi '}</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.viewBg, {backgroundColor: '#FFFFFF'}]}>
              <Text style={styles.textjudul2}>{'Semua Kategori'}</Text>
              <TouchableOpacity
                style={styles.posisi}
                onPress={() => {
                  navigation.navigate('Produk', {
                    screen: 'DetailHerbal',
                    initial: false,
                  });
                }}>
                <IconHerbal width={wp('7%')} height={hp('6%')} />
                <Text style={styles.textlist}>{' Herbal '}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.posisi}
                onPress={() => {
                  navigation.navigate('Produk', {
                    screen: 'DetailSupMul',
                    initial: false,
                  });
                }}>
                <IconSupMul width={wp('7%')} height={hp('6%')} />
                <Text style={styles.textlist}>
                  {' Suplemen dan Multivitamin '}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.posisi}
                onPress={() => {
                  navigation.navigate('Produk', {
                    screen: 'DetailFoodBev',
                    initial: false,
                  });
                }}>
                <IconFoodBev width={wp('7%')} height={hp('6%')} />
                <Text style={styles.textlist}>{' Makanan dan minuman '}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.posisi}
                onPress={() => {
                  navigation.navigate('Produk', {
                    screen: 'DetailMinyak',
                    initial: false,
                  });
                }}>
                <IconMinyak width={wp('7%')} height={hp('6%')} />
                <Text style={styles.textlist}>
                  {' Minyak Angin dan Balsem '}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.viewBg, {backgroundColor: '#F4F4F4'}]}>
              <Text style={styles.textjudul2}>{'Pusat Bantuan'}</Text>
              <TouchableOpacity
                style={styles.posisi}
                onPress={() => navigation.navigate('OrderComplaint')}>
                <IconComplain width={wp('7%')} height={hp('6%')} />
                <Text style={styles.textlist}>{'Komplain Pesanan'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.posisi}
                onPress={() => navigation.navigate('HelpCare')}>
                <IconHelp width={wp('7%')} height={hp('6%')} />
                <Text style={styles.textlist}>{'Bantuan'}</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.viewBg, {backgroundColor: '#FFFFFF'}]}>
            <TouchableOpacity 
              style={[styles.posisi]}
              onPress={() => navigation.navigate('DataUser')}>
                <IconSetting
                  width={wp('7%')} height={hp('6%')} />
                  <Text style={styles.textlist}>{'Pengaturan'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.posisi}
                onPress={() => {
                  navigation.navigate('Barcode');
                }}>
                <IconQR width={wp('7%')} height={hp('6%')} />
                <Text style={styles.textlist}>{'Kode QR'}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.posisi]}
                onPress={() =>
                  this.setState({
                    alertDelete: 'Apakah yakin ingin keluar?',
                    modalDelete: !this.state.modalDelete,
                    loadingApi: true,
                  })
                }>
                <Logout width={wp('7%')} height={hp('6%')} />
                <Text style={styles.textlist}>{'Keluar'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.line} />
            <TouchableOpacity
              style={[
                styles.posisi,
                {marginBottom: wp('5%'), alignSelf: 'center'},
              ]}
              onPress={() =>
                this.setState({
                  alertDelete: 'Menuju playstore?',
                  modalDelete: !this.state.modalDelete,
                  loadingApi: true,
                })
              }>
              <Text style={{fontFamily: 'Lato-Medium', fontSize: hp('2%')}}>
                {'Versi '}
                {dataUser.app_version}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {loadingApi ? <LoadingApi /> : null}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  dataUser: state.LoginReducer.dataUser,
  token: state.LoginReducer.token,
});

const mapDispatchToProps = dispatch => {
  return {
    loginAct: (value, tipe) => {
      dispatch(LoginAction(value, tipe));
    },
  };
};

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: hp('8%'),
    backgroundColor: 'white',
    paddingHorizontal: wp('5%'),
    borderBottomWidth: 4,
    borderColor: '#ddd',
    marginBottom: wp('4%'),
  },
  text: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('2.4%'),
    paddingLeft: wp('5%'),
  },
  image: {
    height: hp('12%'),
    width: hp('12%'),
    borderRadius: hp('12%'),
  },
  avatar: {
    height: hp('12%'),
    width: hp('12%'),
    borderRadius: hp('12%'),
    backgroundColor: '#FED9CD',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp('5%'),
  },
  textjudul: {
    fontFamily: 'Lato-Bold',
    fontSize: hp('2.5%'),
    color: '#575251',
  },
  textangka: {
    fontFamily: 'Lato-Bold',
    fontSize: hp('1.8%'),
    color: '#575251',
    marginTop: hp('1%'),
    paddingLeft: wp('2%'),
  },
  textjudul2: {
    fontFamily: 'Lato-Bold',
    fontSize: hp('2%'),
    color: '#575251',
    paddingBottom: hp('1.5%'),
  },
  textlist: {
    fontFamily: 'Lato-Bold',
    fontSize: hp('1.8%'),
    paddingLeft: wp('1%'),
    color: '#575251',
  },
  line: {
    height: Size(1),
    backgroundColor: '#E8E8E8',
    width: hp('50%'),
    marginVertical: hp('3%'),
  },
  posisi: {
    flexDirection: 'row',
    // marginTop: hp('0%'.8),
    alignItems: 'center',
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
  viewBg: {
    paddingLeft: wp('5%'),
    paddingTop: hp('2%'),
    paddingBottom: hp('2%'),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
