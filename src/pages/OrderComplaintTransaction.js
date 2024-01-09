import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
  RefreshControl,
} from 'react-native';
import {connect} from 'react-redux';
import Size from '../components/Fontresponsive';
import axios from 'axios';
import NumberFormat from 'react-number-format';
import CONFIG from '../constants/config';
import {Card} from 'react-native-elements';
import moment from 'moment';
import {OrderAction} from '../redux/Action';
import Icon404 from '../assets/icons/404.svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Storage from '@react-native-async-storage/async-storage';
import IconBack from '../assets/icons/backArrow.svg';
import {ActivityIndicator} from 'react-native-paper';
import Snackbar from 'react-native-snackbar';

function LoadingApi() {
  return (
    <View style={styles.loadingApi}>
      <ActivityIndicator animating size="small" color="#529F45" />
    </View>
  );
}

const width = Dimensions.get('window').width;

const listDataTransaction = [
  {
    id: '',
    payment_final: '',
    data_item: [
      {
        id: '',
        product_id: '',
        order_id: '',
        qty: '',
        total_price: '',
        product: {
          id: '',
          name: '',
          image: '',
          price_sell: '',
        },
      },
    ],
  },
];

export class OrderComplaintTransaction extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.onEndReachedCalledDuringMomentum = true;
    this.state = {
      listDataTransaction: listDataTransaction,
      page: 1,
      loadingMore: false,
      refreshing: false,
      loadingApi: true,
    };
  }

  UNSAFE_componentWillMount() {
    // lor(this);
    this._isMounted = true;
    this._isMounted && this.getDataComplaint();
  }

  componentWillUnmount() {
    // rol();
    this._isMounted = false;
  }

  // get complaint
  getDataComplaint = async () => {
    const {page} = this.state;
    try {
      let response = await axios.get(
        `${CONFIG.BASE_URL}/api/complaint?status=havent complained&page=${page}`,
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      const data = response.data.data.data;
      console.log('data complain', JSON.stringify(data));
      this.setState(prevState => ({
        loadingApi: false,
        listDataTransaction:
          page === 1 ? data : [...this.state.listDataTransaction, ...data],
        refreshing: false,
        loadingMore: false,
      }));
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

  //load more data
  getMoreComplaint = () => {
    if (!this.onEndReachedCalledDuringMomentum) {
      this.setState(
        prevState => ({
          page: prevState.page + 1,
          loadingMore: true,
        }),
        () => {
          this.getDataComplaint();
        },
      );
      this.onEndReachedCalledDuringMomentum = true;
    }
  };

  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        refreshing: true,
      },
      () => {
        this.getDataComplaint();
      },
    );
  };

  renderLoadMore = () => {
    if (!this.state.loadingMore) return null;
    return (
      <View>
        <ActivityIndicator animating size="small" color="#777" />
      </View>
    );
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
    const {loadingApi} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={[styles.container]}>
          <IconBack
            width={wp('4%')}
            height={hp('4%')}
            stroke="black"
            strokeWidth="2.5"
            fill="black"
            onPress={() => this.props.navigation.goBack()}
          />
          <Text style={styles.text}>{'Komplain Pesanan'}</Text>
        </View>
        {this.state.listDataTransaction.length > 0 && (
          <View>
            {loadingApi ? (
              <LoadingApi />
            ) : (
              <>
                <View style={styles.container3}>
                  <Card containerStyle={styles.cardBackground}>
                    <View style={styles.position2}>
                      <Text
                        style={{
                          fontSize: hp('1.8%'),
                          fontFamily: 'Lato-Medium',
                        }}>
                        Pilih transaksi
                      </Text>
                    </View>
                  </Card>
                </View>
                <FlatList
                  keyExtractor={(item, index) => `${index}`}
                  contentContainerStyle={{
                    flex: 1,
                    flexGrow: 1,
                    paddingBottom: hp('20%'),
                  }}
                  data={this.state.listDataTransaction}
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={this.handleRefresh}
                      colors={['#529F45', '#FFFFFF']}
                    />
                  }
                  onEndReached={() => this.getMoreComplaint()}
                  onMomentumScrollBegin={() => {
                    this.onEndReachedCalledDuringMomentum = false;
                  }}
                  onEndReachedThreshold={0.5}
                  initialNumToRender={10}
                  showsVerticalScrollIndicator={false}
                  ListFooterComponent={() => this.renderLoadMore()}
                  renderItem={({item, index}) => {
                    return (
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate(
                            'OrderComplaintInput',
                            this.props.orderAct(item, 'orderComplaint'),
                          )
                        }>
                        <Card
                          containerStyle={{
                            borderRadius: wp('3%'),
                            marginBottom: wp('1%'),
                            marginLeft: wp('2%'),
                          }}>
                          <Text
                            style={{
                              color: '#777',
                              fontSize: hp('1.7%'),
                              fontFamily: 'Lato-Medium',
                              marginTop: wp('0%'),
                              marginBottom: wp('3%'),
                              marginLeft: wp('1%'),
                            }}>
                            {moment(item.created_at).format('LLL')}
                          </Text>
                          <View
                            style={[
                              styles.position2,
                              {justifyContent: 'center'},
                            ]}>
                            <View>
                              {item.data_item[0]?.product?.image ? (
                                <Image
                                  resizeMode="contain"
                                  source={{
                                    uri:
                                      CONFIG.BASE_URL +
                                      item.data_item[0]?.product?.image,
                                  }}
                                  style={styles.imageStyle}
                                />
                              ) : (
                                <DummyImage style={styles.imageStyle} />
                              )}
                            </View>
                            <View
                              style={[
                                styles.textposition,
                                {marginTop: wp('-2.5%')},
                              ]}>
                              <Text
                                numberOfLines={3}
                                multiline
                                style={styles.title}>
                                {item.data_item[0].product.name ?? ''}
                              </Text>
                              {item.data_item[0].half ? (
                                <Text
                                  numberOfLines={1}
                                  style={{
                                    fontSize: hp('1.7%'),
                                    fontFamily: 'Lato-Medium',
                                    marginTop: wp('1%'),
                                    color: '#17a2b8',
                                  }}>
                                  {'( '}
                                  {item?.data_item[0]?.qty_konversi}{' '}
                                  {item?.data_item[0]?.small_unit.charAt(0) +
                                    item?.data_item[0]?.small_unit
                                      .slice(1)
                                      .toLowerCase()}
                                  {' )'}
                                </Text>
                              ) : null}
                              <NumberFormat
                                value={Math.round(item.payment_final)}
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={'Rp '}
                                renderText={value => (
                                  <Text
                                    numberOfLines={1}
                                    style={{
                                      fontSize: hp('1.7%'),
                                      fontFamily: 'Lato-Medium',
                                      marginTop: wp('1%'),
                                    }}>
                                    Total: {value}
                                  </Text>
                                )}
                              />
                            </View>
                          </View>
                          {item.data_item.length > '1' ? (
                            <View style={styles.textposition}>
                              <Text
                                style={{
                                  fontSize: hp('1.8%'),
                                  fontFamily: 'Lato-Medium',
                                  marginTop: wp('2%'),
                                  color: '#777',
                                }}>
                                +{item.data_item.length - 1} produk lainnya
                              </Text>
                            </View>
                          ) : null}
                        </Card>
                      </TouchableOpacity>
                    );
                  }}
                />
              </>
            )}
          </View>
        )}
        {this.state.listDataTransaction.length === 0 && (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              marginTop: hp('-30%'),
            }}>
            <Icon404 width={wp('80%')} height={hp('80%')} />
            <Text
              style={{
                fontSize: hp('2%'),
                fontFamily: 'Lato-Medium',
                textAlign: 'center',
                marginTop: hp('-20%'),
              }}>
              Wah, daftar transaksi mu kosong
            </Text>
            <Text
              style={{
                fontSize: hp('1.8%'),
                fontFamily: 'Lato-Medium',
                width: wp('65%'),
                textAlign: 'center',
                marginTop: wp('2%'),
              }}>
              Yuk, isi dengan barang-barang yang ingin kamu beli
            </Text>
            <TouchableOpacity
              style={[
                styles.belanjaButton,
                {marginTop: wp('2.5%'), width: wp('45%')},
              ]}
              onPress={() => this.props.navigation.navigate('Produk')}>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: hp('1.8%'),
                  fontFamily: 'Lato-Medium',
                }}>
                {'Mulai Belanja'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
  dataUser: state.LoginReducer.dataUser,
});

const mapDispatchToProps = dispatch => {
  return {
    orderAct: (value, tipe) => {
      dispatch(OrderAction(value, tipe));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OrderComplaintTransaction);

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
  container2: {
    flexDirection: 'row',
    marginLeft: wp('4%'),
    height: hp('5%'),
    backgroundColor: 'white',
    alignItems: 'center',
    marginBottom: wp('4%'),
    marginTop: wp('1%'),
  },
  container3: {
    flexDirection: 'row',
    marginLeft: wp('0%'),
    backgroundColor: 'white',
    alignItems: 'center',
    marginBottom: wp('0%'),
    marginTop: wp('0%'),
  },
  position2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: wp('0%'),
  },
  title: {
    fontSize: hp('1.8%'),
    fontFamily: 'Lato-Medium',
    textAlign: 'auto',
    width: wp('60%'),
    marginTop: wp('2%'),
  },
  imageStyle: {
    height: hp('12%'),
    width: wp('20%'),
    backgroundColor: '#F9F9F9',
    borderRadius: Size(10),
    marginLeft: wp('1%'),
  },
  cardBackground: {
    width,
    marginLeft: wp('0%'),
    borderColor: '#777',
    borderWidth: wp('0%'),
    justifyContent: 'center',
    paddingLeft: wp('5%'),
    marginTop: wp('0%'),
  },
  textposition: {
    flex: 1,
    paddingHorizontal: 10,
  },
  belanjaButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#529F45',
    height: hp('5%'),
    borderRadius: Size(10),
  },

  loadingApi: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    width: wp('100%'),
    marginTop: hp('20%'),
    // height: hp('100%'),
    // position: 'absolute',
    // top:hp('-50%')
  },
});
