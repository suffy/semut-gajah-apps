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
import {VoucherAction, OrderAction} from '../redux/Action';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import CONFIG from '../constants/config';
import axios from 'axios';
import {Card} from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import IconBack from '../assets/icons/backArrow.svg';
import Snackbar from 'react-native-snackbar';
import {ActivityIndicator} from 'react-native-paper';

const {width} = Dimensions.get('window');
const height = width * 0.44;
const regEx = /(<([^>]+)>)/gi;
const regEx2 = /((&nbsp;))*/gim;

function LoadingApi() {
  return (
    <View style={styles.loadingApi}>
      <ActivityIndicator animating size="small" color="#529F45" />
    </View>
  );
}

export class DetailReward extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailReward: this.props.detailReward,
      loadingApi: true,
    };
  }
  UNSAFE_componentWillMount() {
    // lor(this);
  }

  componentWillUnmount() {
    // rol();
  }

  cetakDataHightlight() {
    let cetak = detailReward.highlight.replace(regEx, '');
    let cetak2 = cetak.replace(regEx2, '');
    return cetak2;
  }

  postClaim = async () => {
    console.log(
      'masuk',
      JSON.stringify({
        products: [this.props.detailReward],
        data: {
          voucher_id: '',
          payment_method: 'redeem',
          delivery_service: '',
          payment_total: `${this.props.detailReward.redeem_point ?? '0'}`,
          payment_discount: '',
          payment_final: `${this.props.detailReward.redeem_point ?? '0'}`,
        },
      }),
    );
    try {
      let response = await axios({
        method: 'POST',
        url: `${CONFIG.BASE_URL}/api/orders/redeem`,
        headers: {Authorization: `Bearer ${this.props.token}`},
        data: {
          products: [this.props.detailReward],
          data: {
            voucher_id: '',
            payment_method: 'redeem',
            delivery_service: '',
            payment_total: `${this.props.detailReward.redeem_point ?? '0'}`,
            payment_discount: '',
            payment_final: `${this.props.detailReward.redeem_point ?? '0'}`,
          },
        },
      });
      const data = response.data;
      console.log(JSON.stringify(data));
      if (data.data !== '' && data['success'] == true) {
        this.props.orderAct(data.data, 'paymentOrder');
        this.props.navigation.replace('ConfirmationOrder');
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
    const {detailReward} = this.state;
    return (
      <View
        style={{
          flex: 1,
          width: wp('100%'),
          justifyContent: 'center',
          backgroundColor: '#fff',
        }}>
        <View style={[styles.container]}>
          <IconBack
            width={wp('4%')}
            height={hp('4%')}
            stroke="black"
            strokeWidth="2.5"
            fill="black"
            onPress={() => this.props.navigation.goBack()}
          />
          <Text style={styles.text}>{'Klaim Reward'}</Text>
        </View>
        {/* {detailReward.description != null && (
          <View style={[styles.container]}>
            <Text style={styles.text}>{detailReward.description}</Text>
          </View>
        )} */}
        {console.log('detailReward', JSON.stringify(detailReward))}
        <ScrollView
          contentContainerStyle={{
            // backgroundColor: 'red',
            paddingLeft: wp('5%'),
            paddingRight: wp('5%'),
            alignItems: 'center',
          }}
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}>
          <Image
            source={
              detailReward.image
                ? {uri: CONFIG.BASE_URL + detailReward.image}
                : null
            }
            style={styles.banner}
          />
          <View style={styles.positionTab}>
            {detailReward.redeem_point && (
              <Card containerStyle={styles.cardTab}>
                <View style={styles.columnTab}>
                  <Text style={styles.textTab}>{'Poin'}</Text>
                  <Text style={styles.resultTab} numberOfLines={2} multiline>
                    {detailReward.redeem_point ? detailReward.redeem_point : 0}
                  </Text>
                </View>
              </Card>
            )}
          </View>
          <Card containerStyle={styles.cardBackground}>
            <View style={styles.position}>
              {detailReward.name ? (
                <View style={styles.positionDetail}>
                  <Text style={styles.text2}>{'Nama Produk'}</Text>
                  <Text style={styles.result} numberOfLines={2} multiline>
                    : {detailReward.name}
                  </Text>
                </View>
              ) : null}
              {detailReward.redeem_point ? (
                <View style={styles.positionDetail}>
                  <Text style={styles.text2}>{'Minimal Poin'}</Text>
                  <Text style={styles.result} numberOfLines={2} multiline>
                    : {detailReward.redeem_point}
                  </Text>
                </View>
              ) : null}
              {detailReward.description ? (
                <View style={styles.positionDetail}>
                  <Text style={styles.text2}>{'Deskripsi'}</Text>
                  <Text style={styles.result} numberOfLines={2} multiline>
                    : {detailReward.description}
                  </Text>
                </View>
              ) : null}
              {/* <View style={styles.positionDetail}>
                <Text style={styles.text2}>Maksimum Transaksi</Text>
                <NumberFormat
                  value={Math.round(detailReward.max_transaction)}
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
          {/* <Card containerStyle={styles.cardBackground}>
            <View style={styles.position}>
              <View style={styles.positionDetail}>
                <Text style={styles.text2}>{'Highlight'}</Text>
              </View>
              <View style={styles.positionSKU}>
                {detailReward.highlight ? (
                  <Text
                    style={styles.textTermand}
                    // numberOfLines={4}
                    multiline>
                    {this.cetakDataHightlight()}
                  </Text>
                ) : null}
              </View>
            </View>
          </Card> */}
          <Card containerStyle={styles.cardBackground}>
            <View style={styles.position}>
              <View style={styles.positionDetail}>
                <Text style={styles.text2}>{'Syarat Dan Ketentuan'}</Text>
              </View>
              <Text
                style={styles.textTermand}
                //   numberOfLines={2}
                multiline>
                {detailReward.redeem_snk}
              </Text>
            </View>
          </Card>
          <Card containerStyle={styles.cardBackground}>
            <View style={styles.position}>
              <View style={styles.positionDetail}>
                <Text style={styles.text2}>{'Cara Pakai'}</Text>
              </View>
              <Text
                style={styles.textTermand}
                //   numberOfLines={2}
                multiline>
                {detailReward.redeem_desc}
              </Text>
            </View>
          </Card>
        </ScrollView>
        <View
          style={{
            alignSelf: 'center',
            marginBottom: wp('5%'),
            marginTop: wp('5%'),
          }}>
          <TouchableOpacity style={styles.button} onPress={this.postClaim}>
            <Text style={styles.textButton}>{'Klaim'}</Text>
          </TouchableOpacity>
        </View>
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
    // marginRight: wp('5%'),
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
    width: wp('50%'),
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
    width: wp('100%'),
    height: hp('20%'),
    // borderRadius: hp('1%'),
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
    width: wp('90%'),
    borderRadius: 10,
  },
  positionTab: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  columnTab: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  detailReward: state.VoucherReducer.rewardDetail,
});

const mapDispatchToProps = dispatch => {
  return {
    voucherAct: (value, tipe) => {
      dispatch(VoucherAction(value, tipe));
    },
    orderAct: (value, tipe) => {
      dispatch(OrderAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailReward);
