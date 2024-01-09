import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import {BannerAction} from '../redux/Action';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import CONFIG from '../constants/config';
import {Card} from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import IconBack from '../assets/icons/backArrow.svg';
import Snackbar from 'react-native-snackbar';
import axios from 'axios';
import {ActivityIndicator} from 'react-native-paper';
import Storage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';

function LoadingApi() {
  return (
    <View style={styles.loadingApi}>
      <ActivityIndicator animating size="small" color="#529F45" />
    </View>
  );
}

const {width} = Dimensions.get('window');
const height = width * 0.44;
const regEx = /(<([^>]+)>)/gi;
const regEx2 = /((&nbsp;))*/gim;

export class DetailPromo extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      page: 1,
      loadingApi: true,
    };
  }

  UNSAFE_componentWillMount() {
    // lor(this);
  }

  componentWillUnmount() {
    // rol();
  }

  componentDidMount() {
    {
      this.props.route?.params?.id ? this.getDataBanner() : null ;
    }
  }

  cetakDataHightlight() {
    let cetak = this.props.banner?.highlight.replace(regEx, '');
    let cetak2 = cetak.replace(regEx2, '');
    return cetak2;
  }

  getDataBanner = async () => {
    // this._isMounted = true;
    try {
      let response = await axios.get(
        `${CONFIG.BASE_URL}/api/promo/${this.props.route.params.id}`,
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      const data = response.data.data;
      console.log('log 79 ' + JSON.stringify(data));
      this.props.bannerAct(data, 'banner');
      this.setState({
        loadingApi: false,
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
        'Cek Error========================93',
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
          this.getDataMission();
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
          this.getDataMission();
        },
      },
    });
  };

  render() {
    const {loadingApi} = this.state;
    console.log('data', this.props.banner);
    return (
      <View
        style={{
          flex: 1,
          width: wp('100%'),
          justifyContent: 'center',
          backgroundColor: '#fff',
        }}>
        <Header
          title="Promo"
          navigation={this.props.navigation}
        />
        {loadingApi === true && this.props.banner === undefined ? (
          <LoadingApi />
        ) : (
          <>
            <ScrollView
              contentContainerStyle={{
                // backgroundColor: 'red',
                paddingLeft: wp('5%'),
                paddingRight: wp('5%'),
                alignItems: 'center',
              }}
              style={{flex: 1}}
              showsVerticalScrollIndicator={false}>
              {/* <TopSpender /> */}
              <View style={styles.positionTab}>
                {this.props.banner?.point && (
                  <Card
                    containerStyle={[styles.cardTab, {marginRight: wp('-1%')}]}>
                    <View style={styles.columnTab}>
                      <Text style={styles.textTab}>{'Poin'}</Text>
                      <Text
                        style={styles.resultTab}
                        numberOfLines={2}
                        multiline>
                        {this.props.banner?.point
                          ? this.props.banner?.point
                          : 0}
                      </Text>
                    </View>
                  </Card>
                )}
                {this.props.banner?.point ? (
                  <Card containerStyle={styles.cardTab}>
                    <View style={styles.columnTab}>
                      <Text style={styles.textTab}>{'Masa Berlaku'}</Text>
                      <Text style={styles.resultTab} multiline>
                        {moment(this.props.banner?.start).format('LL')}
                        {' to '}
                        {moment(this.props.banner?.end).format('LL')}
                      </Text>
                    </View>
                  </Card>
                ) : (
                  <Card containerStyle={[styles.cardTab, {width: wp('90%')}]}>
                    <View style={styles.columnTab}>
                      <Text style={styles.textTab}>{'Masa Berlaku'}</Text>
                      {this.props.banner?.start == null &&
                      this.props.banner?.end == null ? (
                        <Text style={styles.resultTab} multiline>
                          {'Belaku setiap pembelian pertama'}
                        </Text>
                      ) : (
                        <Text style={styles.resultTab} multiline>
                          {moment(this.props.banner?.start).format('LL')}
                          {' to '}
                          {moment(this.props.banner?.end).format('LL')}
                        </Text>
                      )}
                    </View>
                  </Card>
                )}
              </View>
              <Card containerStyle={styles.cardBackground}>
                <View style={styles.position}>
                  {this.props.banner?.reward[0].reward_disc ? (
                    <View style={styles.positionDetail}>
                      <Text style={styles.text2}>{'Diskon'}</Text>
                      <Text style={styles.result} numberOfLines={2} multiline>
                        : {this.props.banner?.reward[0].reward_disc}
                        {' %'}
                      </Text>
                    </View>
                  ) : null}
                  {this.props.banner?.reward[0].reward_qty ? (
                    <View style={styles.positionDetail}>
                      <Text style={styles.text2}>{'Bonus'}</Text>
                      <Text style={styles.result} numberOfLines={2} multiline>
                        : {this.props.banner?.reward[0].reward_qty}
                        {' Produk'}
                      </Text>
                    </View>
                  ) : null}
                  {this.props.banner?.reward[0].reward_nominal ? (
                    <View style={styles.positionDetail}>
                      <Text style={styles.text2}>{'Potongan Harga'}</Text>
                      <Text style={styles.result} numberOfLines={2} multiline>
                        : {'Rp'}
                        {this.props.banner?.reward[0].reward_nominal}
                      </Text>
                    </View>
                  ) : null}
                  {this.props.banner?.reward[0].reward_point ? (
                    <View style={styles.positionDetail}>
                      <Text style={styles.text2}>{'Bonus Poin'}</Text>
                      <Text style={styles.result} numberOfLines={2} multiline>
                        : {'Rp'}
                        {this.props.banner?.reward[0].reward_point}
                      </Text>
                    </View>
                  ) : null}
                  {this.props.banner?.min_qty ? (
                    <View style={styles.positionDetail}>
                      <Text style={styles.text2}>{'Syarat Pembelian'}</Text>
                      <Text style={styles.result} numberOfLines={2} multiline>
                        : {'Minimal '}
                        {this.props.banner?.min_qty}
                        {' item'}
                      </Text>
                    </View>
                  ) : null}
                  {this.props.banner?.min_transaction ? (
                    <View style={styles.positionDetail}>
                      <Text style={styles.text2}>{'Syarat Pembelian'}</Text>
                      <Text style={styles.result} numberOfLines={2} multiline>
                        : {'Minimal transaksi '}
                        {'\n'}
                        {'  Rp'}
                        {this.props.banner?.min_transaction}
                      </Text>
                    </View>
                  ) : null}
                  {this.props.banner?.multiple == 1 ? (
                    <View style={styles.positionDetail}>
                      <Text style={styles.text2}>{'Ketentuan'}</Text>
                      <Text style={styles.result} numberOfLines={2} multiline>
                        : {'Berlaku kelipatan'}
                      </Text>
                    </View>
                  ) : null}
                  {/* <View style={styles.positionDetail}>
                <Text style={styles.text2}>Minimum Transaksi</Text>
                <NumberFormat
                  value={Math.round(this.props.banner?.min_transaction)}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={'Rp '}
                  renderText={value => (
                    <Text style={styles.result} numberOfLines={2} multiline>
                      : {value}
                    </Text>
                  )}
                />
              </View> */}
                  {/* <View style={styles.positionDetail}>
                <Text style={styles.text2}>Maksimum Transaksi</Text>
                <NumberFormat
                  value={Math.round(this.props.banner?.max_transaction)}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={'Rp '}
                  renderText={value => (
                    <Text style={styles.result} numberOfLines={2} multiline>
                      : {value}
                    </Text>
                  )}
                />
              </View> */}
                </View>
              </Card>
              <Card containerStyle={styles.cardBackground}>
                <View style={styles.position}>
                  {/* {this.props.banner?.termandcondition && ( */}
                  <View style={styles.positionDetail}>
                    <Text style={styles.text2}>{'Highlight'}</Text>
                  </View>
                  <View style={styles.positionSKU}>
                    {/* <Text
                  style={styles.textTermand}
                  //   numberOfLines={2}
                  multiline>
                  {'Bagaimana cara menggunakan'}
                </Text> */}
                    {/* <Text
                  style={styles.textTermand}
                  //   numberOfLines={2}
                  multiline>
                  {'Langkah 1 : Klik belanja sekarang dan kamu akan diarahkan ke produk'}
                </Text>
                <Text
                  style={styles.textTermand}
                  //   numberOfLines={2}
                  multiline>
                  {'Langkah 2 : Pilih produk sesuai deskripsi promo'}
                </Text>
                <Text
                  style={styles.textTermand}
                  //   numberOfLines={2}
                  multiline>
                  {'Langkah 3 : Didalam keranjang belanja kamu akan mendapatkan promo'}
                </Text> */}
                    {this.props.banner?.highlight ? (
                      <Text
                        style={styles.textTermand}
                        // numberOfLines={4}
                        multiline>
                        {this.cetakDataHightlight()}
                      </Text>
                    ) : null}
                  </View>
                  {/* )} */}
                </View>
              </Card>
              <Card containerStyle={styles.cardBackground}>
                <View style={styles.position}>
                  {/* {this.props.banner?.termandcondition && ( */}
                  <View style={styles.positionDetail}>
                    <Text style={styles.text2}>{'Syarat Dan Ketentuan'}</Text>
                  </View>
                  <Text
                    style={styles.textTermand}
                    //   numberOfLines={2}
                    multiline>
                    {/* {
                    'Setiap pembelanjaan antangin group 4 item minimal Rp1.000.000 mendapatkan discount sebesar 1% dari total pembelian'
                  } */}
                    {this.props.banner?.description}
                  </Text>
                  {/* )} */}
                </View>
              </Card>
              <Image
                source={
                  this.props.banner?.banner
                    ? {uri: CONFIG.BASE_URL + this.props.banner?.banner}
                    : null
                }
                style={styles.banner}
              />
            </ScrollView>
            <View
              style={{
                alignSelf: 'center',
                marginBottom: wp('5%'),
                marginTop: wp('5%'),
              }}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.props.navigation.navigate('Produk')}>
                <Text style={styles.textButton}>{'Belanja Sekarang'}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: hp('8%'),
    backgroundColor: 'white',
    paddingHorizontal: wp('5%'),
    borderBottomWidth: 4,
    borderColor: '#ddd',
  },
  loadingApi: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    width: wp('100%'),
    marginTop: hp('10%'),
  },
  text: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('2.4%'),
    paddingLeft: wp('5%'),
  },
  position: {
    // marginTop: wp('5%'),
    // marginLeft: wp('5%'),
  },
  positionDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: wp('5%'),
  },
  positionSKU: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  text2: {
    fontSize: hp('1.8%'),
    fontFamily: 'Lato-Medium',
    marginBottom: hp('0.5%'),
  },
  result: {
    width: wp('30%'),
    textAlign: 'left',
    // height: hp('5.5%'),
    fontSize: hp('1.8%'),
    fontFamily: 'Lato-Medium',
  },
  textTermand: {
    // marginTop: wp('2%'),
    fontSize: hp('1.8%'),
    fontFamily: 'Lato-Medium',
    color: '#777',
    textAlign: 'justify',
  },
  button: {
    backgroundColor: '#529F45',
    borderRadius: 10,
    width: wp('90%'),
    height: hp('6%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButton: {
    fontSize: hp('1.8%'),
    color: '#fff',
    fontFamily: 'Lato-Medium',
    alignSelf: 'center',
  },
  banner: {
    resizeMode: 'contain',
    width: wp('88%'),
    height,
    borderRadius: hp('1%'),
    alignSelf: 'center',
  },
  cardBackground: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E8E8E8',
    // marginLeft: wp('6%'),
    // marginRight: wp('0%'),
    width: wp('90%'),
    borderRadius: 10,
  },

  cardTab: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E8E8E8',
    width: wp('44%'),
    borderRadius: 10,
  },
  positionTab: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  columnTab: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  textTab: {
    fontSize: hp('1.8%'),
    fontFamily: 'Lato-Medium',
    marginBottom: hp('0.5%'),
  },
  resultTab: {
    // width: wp('30%'),
    textAlign: 'left',
    // height: hp('5.5%'),
    fontSize: hp('1.8%'),
    fontFamily: 'Lato-Medium',
  },
});

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
  banner: state.BannerReducer.banner,
});

const mapDispatchToProps = dispatch => {
  return {
    bannerAct: (value, tipe) => {
      dispatch(BannerAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailPromo);
