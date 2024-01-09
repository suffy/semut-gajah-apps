import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { VoucherAction } from '../redux/Action';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import CONFIG from '../constants/config';
import { Card } from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';

const { width } = Dimensions.get("window");
const height = width * 0.44;

export class DetailVoucher extends Component {

  UNSAFE_componentWillMount() {
    // lor(this);
  }

  componentWillUnmount() {
    // rol()
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        {this.props.voucher.description == null && (
          <View style={[styles.container]}>
            <Text style={styles.text}>Kupon</Text>
          </View>
        )}
        {this.props.voucher.description != null && (
          <View style={[styles.container]}>
            <Text style={styles.text}>{this.props.voucher.description}</Text>
          </View>
        )}
        <ScrollView showsVerticalScrollIndicator={false}>
          <Image
            source={
              this.props.voucher.file
                ? {uri: CONFIG.BASE_URL + this.props.voucher.file}
                : null
            }
            style={styles.banner}></Image>
          <Card containerStyle={styles.cardBackground}>
            <View style={styles.position}>
              <View style={styles.positionDetail}>
                <Text style={styles.text2}>Kode Kupon</Text>
                <Text style={styles.result} numberOfLines={2} multiline>
                  : {this.props.voucher.code}
                </Text>
              </View>
              <View style={styles.positionDetail}>
                <Text style={styles.text2}>Potongan</Text>
                {this.props.voucher.type == 'percent' ? (
                  <Text style={styles.result} numberOfLines={2} multiline>
                    : {this.props.voucher.percent}%
                  </Text>
                ) : null}
                {this.props.voucher.type == 'nominal' ? (
                  <NumberFormat
                    value={Math.round(this.props.voucher.nominal)}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'Rp '}
                    renderText={value => (
                      <Text style={styles.result} numberOfLines={2} multiline>
                        : {value}
                      </Text>
                    )}
                  />
                ) : null}
              </View>
              <View style={styles.positionDetail}>
                <Text style={styles.text2}>Kategori</Text>
                <Text style={styles.result} numberOfLines={2} multiline>
                  : {this.props.voucher.category}
                </Text>
              </View>
              <View style={styles.positionDetail}>
                <Text style={styles.text2}>Berlaku Sampai</Text>
                <Text style={styles.result} numberOfLines={2} multiline>
                  : {moment(this.props.voucher.end_at).format('LL')}
                </Text>
              </View>
              <View style={styles.positionDetail}>
                <Text style={styles.text2}>Minimum Transaksi</Text>
                <NumberFormat
                  value={Math.round(this.props.voucher.min_transaction)}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={'Rp '}
                  renderText={value => (
                    <Text style={styles.result} numberOfLines={2} multiline>
                      : {value}
                    </Text>
                  )}
                />
              </View>
              <View style={styles.positionDetail}>
                <Text style={styles.text2}>Maksimum Transaksi</Text>
                <NumberFormat
                  value={Math.round(this.props.voucher.max_transaction)}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={'Rp '}
                  renderText={value => (
                    <Text style={styles.result} numberOfLines={2} multiline>
                      : {value}
                    </Text>
                  )}
                />
              </View>
              {this.props.voucher.termandcondition && (
                <View>
                  <View style={styles.positionDetail}>
                    <Text style={styles.text2}>Syarat dan Ketentuan</Text>
                  </View>
                  <View style={styles.positionDetail}>
                    <Text
                      style={styles.textTermand}
                      numberOfLines={2}
                      multiline>
                      {' '}
                      {this.props.voucher.termandcondition}
                    </Text>
                  </View>
                </View>
              )}
            </View>
            <View
              style={{
                alignSelf: 'center',
                marginBottom: wp('5%'),
                marginTop: wp('5%'),
              }}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.props.navigation.navigate('Produk')}>
                <Text style={styles.textButton}>Gunakan Kupon</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: hp('8%'),
    backgroundColor: 'white',
    borderBottomWidth: 4,
    borderColor: '#ddd',
  },
  text: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('2.4%'),
    paddingLeft: wp('5%'),
  },
  position: {
    marginTop: wp('5%'),
    marginLeft: wp('5%'),
  },
  positionDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: wp('5%'),
  },
  text2: {
    fontSize: hp('1.8%'),
    fontFamily: 'Lato-Medium',
  },
  result: {
    width: wp('30%'),
    textAlign: 'left',
    height: hp('5.5%'),
    fontSize: hp('1.8%'),
    fontFamily: 'Lato-Medium',
  },
  textTermand: {
    marginTop: wp('2%'),
    fontSize: hp('1.8%'),
    fontFamily: 'Lato-Medium',
    color: '#777',
    marginLeft: wp('-1%'),
  },
  button: {
    backgroundColor: '#529F45',
    borderRadius: 10,
    width: wp('50%'),
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
    width,
    height,
    borderRadius: wp('1%'),
  },
  cardBackground: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E8E8E8',
    marginLeft: wp('6%'),
    marginRight: wp('0%'),
    width: wp('88%'),
    borderRadius: 10,
  },
});

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
  voucher: state.VoucherReducer.voucher,
});

const mapDispatchToProps = dispatch => {
  return {
    voucherAct: (value, tipe) => {
      dispatch(VoucherAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailVoucher);
