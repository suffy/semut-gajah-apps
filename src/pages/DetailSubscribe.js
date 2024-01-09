import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import ProductsImage from './ProductsImages';
import {Picker} from '@react-native-picker/picker';
import IconMinus from '../assets/icons/Minus.svg';
import IconPlus from '../assets/icons/Plus.svg';
import axios from 'axios';
import CONFIG from '../constants/config';
import {orderminAct, orderplusAct, SubsAction} from '../redux/Action';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import IconBack from '../assets/icons/backArrow.svg';
import moment from 'moment';

export class DetailSubscribe extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      subscribeItems: {
        name: '',
        images: '',
        user_id: '',
        product_id: '',
        qty: '',
        time: '',
        notes: '',
        status: '',
      },
    };
  }

  UNSAFE_componentWillMount() {
    // lor(this);
  }

  componentWillUnmount() {
    // rol()
  }

  render() {
    {
      console.log('isi============', JSON.stringify(this.props.details));
    }
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={[styles.container]}>
          <IconBack
            width={wp('4%')}
            height={hp('4%')}
            stroke="black"
            strokeWidth="2.5"
            fill="black"
            onPress={() => this.props.navigation.goBack()}
          />
          <Text style={styles.text}>{'Detail Langganan'}</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.subscribe}>
            <ProductsImage
              key={this.props.details.id}
              image={this.props.details.product.image}
              navigation={this.props.navigation}
            />
            <View style={styles.positionSubscribe}>
              <Text style={styles.title}>Langganan</Text>
              <View style={styles.positionDetail}>
                <Text style={styles.priceProduct}>Produk yang dipesan</Text>
                <Text>{':'}</Text>
                <Text
                  style={[styles.input, {marginLeft: wp('1%')}]}
                  numberOfLines={2}
                  multiline>
                  {this.props.details.product.name}
                </Text>
              </View>
              <View style={styles.positionDetail}>
                <Text style={styles.priceProduct}>Jumlah</Text>
                <Text style={styles.input}>: {this.props.details.qty}</Text>
              </View>
              <View style={styles.positionDetail}>
                <Text style={styles.priceProduct}>Waktu</Text>
                {this.props.details.time == '2_week' ? (
                  <Text style={styles.input}>{': Per 2 minggu'}</Text>
                ) : null}
                {this.props.details.time == 'month' ? (
                  <Text style={styles.input}>{': Per bulan'}</Text>
                ) : null}
              </View>
              <View style={styles.positionDetail}>
                <Text style={styles.priceProduct}>Waktu Langganan</Text>
                <Text style={styles.input}>
                  : {moment(this.props.details.start_at).format('DD-MM-YYYY')}
                </Text>
              </View>
              {this.props.details.product.status_renceng ? (
                <View style={styles.positionDetail}>
                  <Text style={styles.priceProduct}>Satuan Renceng</Text>
                  {this.props.details.half == 1 ? (
                    <Text style={styles.input}>
                      :{' '}
                      {'Setengah (' +
                        this.props.details.product.konversi_sedang_ke_kecil /
                          2 +
                        ' ' +
                        this.props.details.product.kecil.charAt(0) +
                        this.props.details.product.kecil
                          .slice(1)
                          .toLowerCase() +
                        ' )'}
                    </Text>
                  ) : (
                    <Text style={styles.input}>
                      :{' '}
                      {'Full (' +
                        this.props.details.product.konversi_sedang_ke_kecil +
                        ' ' +
                        this.props.details.product.kecil.charAt(0) +
                        this.props.details.product.kecil
                          .slice(1)
                          .toLowerCase() +
                        ' )'}
                    </Text>
                  )}
                </View>
              ) : null}
              <View style={styles.positionDetail}>
                <Text style={styles.priceProduct}>Status</Text>
                {this.props.details.status == '1' ? (
                  <Text style={styles.input}>: Aktif</Text>
                ) : null}
                {this.props.details.status == '0' ? (
                  <Text style={styles.input}>: Tidak Aktif</Text>
                ) : null}
              </View>
              <View style={styles.positionDetail}>
                <Text style={styles.priceProduct}>Catatan</Text>
                <Text style={styles.input} numberOfLines={10}>
                  : {this.props.details.notes}
                </Text>
              </View>
              <View
                style={[
                  styles.positionDetail,
                  {alignSelf: 'center', marginBottom: 30},
                ]}>
                <TouchableOpacity
                  style={styles.buttonEdit}
                  onPress={() =>
                    this.props.navigation.navigate(
                      'EditSubscribe',
                      this.props.subsAct(this.props.details, 'item'),
                    )
                  }>
                  <Text style={styles.textEdit}>Ubah</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonCari}
                  onPress={() => this.props.navigation.navigate('Produk')}>
                  <Text style={styles.textButton}>Cari barang lainnya</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
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
  menu: {
    marginRight: wp('2%'),
  },
  subscribe: {
    flex: 1,
    marginTop: 0,
  },
  positionSubscribe: {
    marginTop: 20,
    marginLeft: 30,
  },
  positionDetail: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
    marginRight: wp('5%'),
  },
  title: {
    fontSize: hp('2.4%'),
    color: '#000000',
    fontFamily: 'Lato-Medium',
    marginBottom: 20,
  },
  priceProduct: {
    fontSize: hp('1.8%'),
    fontFamily: 'Lato-Medium',
    width: wp('48%'),
  },
  input: {
    width: wp('40%'),
    textAlign: 'left',
    fontFamily: 'Lato-Medium',
    fontSize: hp('1.8%'),
  },
  buttonEdit: {
    backgroundColor: '#7EDC6E',
    borderRadius: 10,
    width: wp('19%'),
    height: hp('5%'),
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonCari: {
    backgroundColor: '#E07126',
    borderRadius: 10,
    width: wp('40%'),
    height: hp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  textEdit: {
    fontSize: hp('1.8%'),
    color: '#FFF',
    fontFamily: 'Lato-Medium',
    alignSelf: 'center',
  },
  textButton: {
    fontSize: hp('1.8%'),
    color: '#fff',
    fontFamily: 'Lato-Medium',
    alignSelf: 'center',
  },
  picker: {
    marginTop: hp('-2%'),
    width: wp('47%'),
    marginRight: wp('-4.5%'),
  },
  iconplus: {
    borderWidth: 1,
    borderColor: '#cccccc',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFEEA',
    borderTopRightRadius: hp('4.5%'),
    borderBottomRightRadius: hp('4.5%'),
    width: wp('6%'),
  },
  iconminus: {
    borderWidth: 1,
    borderColor: '#cccccc',
    backgroundColor: '#FFFEEA',
    borderTopLeftRadius: hp('4.5%'),
    borderBottomLeftRadius: hp('4.5%'),
    width: wp('6%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
  dataUser: state.LoginReducer.dataUser,
  order: state.SubscribeReducer.totalOrder,
  details: state.SubscribeReducer.details,
  item: state.SubscribeReducer.item,
});

const mapDispatchToProps = dispatch => {
  return {
    orderplusAct: () => {
      dispatch({type: 'PLUS_ORDER'});
    },
    orderminAct: () => {
      dispatch({type: 'MINUS_ORDER'});
    },
    orderAct: (value, tipe) => {
      dispatch(OrderAction(value, tipe));
    },
    subsAct: (value, tipe) => {
      dispatch(SubsAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailSubscribe);
