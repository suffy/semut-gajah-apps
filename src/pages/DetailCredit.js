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
import {VoucherAction} from '../redux/Action';
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
import IconShopBag from '../assets/icons/ShoppingBag.svg';

const {width} = Dimensions.get('window');
const height = width * 0.44;

export class DetailCredit extends Component {
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {};
  }
  UNSAFE_componentWillMount() {
    // lor(this);
  }

  componentWillUnmount() {
    // rol();
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          width: wp('100%'),
          justifyContent: 'center',
          backgroundColor: '#fff',
        }}>
        {/* {this.props.banner.description == null && ( */}
        <View style={[styles.container]}>
          <IconBack
            width={wp('4%')}
            height={hp('4%')}
            stroke="black"
            strokeWidth="2.5"
            fill="black"
            onPress={() => this.props.navigation.goBack()}
          />
          <Text style={styles.text}>{'Rincian Pembayaran'}</Text>
        </View>
        {/* )} */}
        {/* {this.props.banner.description != null && (
          <View style={[styles.container]}>
            <Text style={styles.text}>{this.props.banner.description}</Text>
          </View>
        )} */}
        <ScrollView
          contentContainerStyle={{
            // backgroundColor: 'red',
            paddingLeft: wp('5%'),
            paddingRight: wp('5%'),
            alignItems: 'center',
          }}
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}>
          <Card containerStyle={[styles.cardTab]}>
            <View style={[styles.columnTab, {alignItems: 'center'}]}>
              {console.log(this.props.credit)}
              <NumberFormat
                value={Math.round(this.props.credit.deposit)}
                displayType={'text'}
                thousandSeparator={true}
                prefix={'+ Rp '}
                renderText={value => (
                  <Text style={[styles.resultTab, {fontSize: hp('2.6%')}]}>{value || 0}</Text>
                )}
              />
              <Text style={styles.resultTab}>{'Berhasil'}</Text>
              <Text style={styles.resultTab}>{moment(this.props.credit.created_at).format('LLL')}</Text>
            </View>
          </Card>
          <View
            style={[
              styles.columnTab,
              {alignSelf: 'flex-start', width: wp('90%')},
            ]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: hp('2%'),
              }}>
              <Text style={[styles.resultTab]} multiline>
                {'Keterangan'}
              </Text>
              <Text style={styles.resultTab}>{this.props.credit.status}</Text>
            </View>
            <View
              style={{
                borderTopWidth: 2,
                width: wp('90%'),
                borderColor: '#EEEEEE',
                marginBottom: hp('1.5%'),
                marginTop: hp('1%'),
                height: 1,
                marginLeft: wp('0%'),
                marginRight: wp('0%'),
              }}
            />
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={[styles.resultTab]} multiline>
                {'Metode Pembayaran'}
              </Text>
              <Text style={styles.resultTab}>{'Kredit'}</Text>
            </View>
            <View
              style={{
                borderTopWidth: 2,
                width: wp('90%'),
                borderColor: '#EEEEEE',
                marginBottom: hp('1.5%'),
                marginTop: hp('1%'),
                height: 1,
                marginLeft: wp('0%'),
                marginRight: wp('0%'),
              }}
            />
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={[styles.resultTab]} multiline>
                {'Saldo'}
              </Text>
              <NumberFormat
                value={Math.round(this.props.credit.deposit)}
                displayType={'text'}
                thousandSeparator={true}
                prefix={'+ Rp '}
                renderText={value => (
                  <Text style={[styles.resultTab]}>{value || 0}</Text>
                )}
              />
            </View>
            <Text
              style={[
                styles.resultTab,
                {
                  backgroundColor: '#DCDCDC',
                  marginTop: hp('1%'),
                  marginBottom: hp('0.5%'),
                },
              ]}>
              {'Rincian Referensi'}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: hp('1%'),
              }}>
              <Text style={[styles.resultTab]} multiline>
                {'No. Transaksi'}
              </Text>
              <Text style={styles.resultTab}>{this.props.credit.order.invoice}</Text>
            </View>
            {/* <View
              style={{
                borderTopWidth: 2,
                width: wp('90%'),
                borderColor: '#EEEEEE',
                marginBottom: hp('1.5%'),
                marginTop: hp('1%'),
                height: 1,
                marginLeft: wp('0%'),
                marginRight: wp('0%'),
              }}
            />
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={[styles.resultTab]} multiline>
                {'No. Referensi'}
              </Text>
              <Text style={styles.resultTab}>{'79126396934621934'}</Text>
            </View> */}
            <Text
              style={[
                styles.resultTab,
                {
                  backgroundColor: '#DCDCDC',
                  marginTop: hp('1%'),
                  marginBottom: hp('0.5%'),
                },
              ]}>
              {'Rincian Pesanan'}
            </Text>
          </View>
          <View style={styles.containerButton}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: hp('1%'),
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <IconShopBag width={wp('5%')} height={hp('3%')} />
                  <Text
                    style={[
                      {
                        marginBottom: 0,
                        marginHorizontal: wp('2%'),
                        fontFamily: 'Lato-Medium',
                        fontSize: hp('1.2%'),
                      },
                    ]}>
                    {'Transaksi '}{this.props.credit.order.invoice}
                  </Text>
                </View>

                <Text
                  style={[
                    {
                      marginBottom: 0,
                      color: '#999',
                      fontFamily: 'Lato-Medium',
                      fontSize: hp('1.2%'),
                    },
                  ]}>
                  {moment(this.props.credit.created_at).format('LLL')}
                </Text>
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View>
                  <Text
                    style={[
                      {
                        marginBottom: 5,
                        fontFamily: 'Lato-Medium',
                        fontSize: hp('1.4%'),
                      },
                    ]}>
                    {this.props.credit.status}
                  </Text>
                  <Text
                    style={[
                      {
                        marginBottom: 0,
                        fontFamily: 'Lato-Medium',
                        fontSize: hp('1.2%'),
                        textAlign: 'justify',
                      },
                    ]}>
                    {'pengembalian dana dari semutgajah berhasil'}
                  </Text>
                </View>
                <Text
                  style={[
                    {
                      marginBottom: 0,
                      fontFamily: 'Lato-Medium',
                      fontSize: hp('2%'),
                      textAlign: 'justify',
                    },
                  ]}>
                  {'+ '}{this.props.credit.deposit}
                </Text>
              </View>
              {/* <View style={{flexDirection: 'row-reverse', marginTop: 10}}>
              {button}
            </View> */}
          </View>
          {/* <Image
            source={
              this.props.banner.images
                ? {uri: CONFIG.BASE_URL + this.props.banner.images}
                : null
            }
            style={styles.banner}
          /> */}
        </ScrollView>
        {/* <View
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
        </View> */}
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
    borderRadius: hp('1.5%'),
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

  judulCredit: {
    marginTop: hp('2%'),
    marginBottom: hp('2%'),
    alignSelf: 'flex-start',
  },
  textJudulCredit: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('2%'),
  },
  containerButton: {
    borderWidth: 1,
    // borderColor: '#d5d5d5',
    borderColor: '#E8E8E8',
    backgroundColor: '#F2F2F2',
    paddingHorizontal: wp('2%'),
    paddingVertical: wp('2%'),
    borderRadius: hp('1.5%'),
    marginTop: hp('1%'),
    width: wp('90%'),
  },
  containerButton2: {
    borderWidth: 1,
    borderColor: '#E8E8E8',
    // borderColor: '#F2F2F2',
    paddingHorizontal: wp('2%'),
    paddingVertical: wp('2%'),
    borderRadius: hp('1.5%'),
    marginBottom: 10,
  },
  textStyle2: {
    backgroundColor: 'white',
    fontSize: hp('2%'),
    fontFamily: 'Lato-Medium',
    height: hp('4%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
  credit: state.LoginReducer.credit,
});

const mapDispatchToProps = dispatch => {
  return {
    voucherAct: (value, tipe) => {
      dispatch(VoucherAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailCredit);
