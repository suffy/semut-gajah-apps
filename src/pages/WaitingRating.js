import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  Dimensions,
  Button,
  FlatList,
  RefreshControl,
} from 'react-native';
import {connect} from 'react-redux';
import Size from '../components/Fontresponsive';
import axios from 'axios';
import NumberFormat from 'react-number-format';
import CONFIG from '../constants/config';
import {Card, Rating} from 'react-native-elements';
import {RatingAction} from '../redux/Action';
import Icon404 from '../assets/icons/404.svg';
import IconOffline from '../assets/icons/NetInfo.svg';
import {ActivityIndicator} from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Storage from '@react-native-async-storage/async-storage';
import DummyImage from '../assets/icons/IconLogo.svg';
import Snackbar from 'react-native-snackbar';

function MiniOfflineSign() {
  return (
    <View style={styles.offlineContainer}>
      <View style={styles.offlineContainer2}>
        <Text style={styles.offlineText}>{'Internet'}</Text>
      </View>
      <IconOffline style={styles.offlineIcon} />
    </View>
  );
}

function LoadingApi() {
  return (
    <View style={styles.loadingApi}>
      <ActivityIndicator animating size="small" color="#529F45" />
    </View>
  );
}

const width = Dimensions.get('window').width;
const listWaitingRating = [
  {
    id: '',
    payment_final: '',
    data_unreview: [
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

export class WaitingRating extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.onEndReachedCalledDuringMomentum = false;
    this.state = {
      rating: '0',
      listWaitingRating: listWaitingRating,
      page: 1,
      loadingMore: false,
      refreshing: false,
      maxPage: 1,
      loadingApi: true,
    };
  }

  // get waiting rating
  UNSAFE_componentWillMount = () => {
    // lor(this);
    this._isMounted = true;
    this._isMounted && this.getWaitingRating();
  };

  componentWillUnmount() {
    // rol();
    this._isMounted = false;
  }

  getWaitingRating = async () => {
    const {page} = this.state;
    try {
      let response = await axios.get(
        `${CONFIG.BASE_URL}/api/reviews?review=false&page=${page}`,
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      const data = response.data.data;
      console.log('Data Waiting Rating', JSON.stringify(data));
      this.setState(prevState => ({
        loadingApi: false,
        listWaitingRating:
          page === 1
            ? data.data
            : [...this.state.listWaitingRating, ...data.data],
        refreshing: false,
        loadingMore: data.last_page > this.state.page,
        maxPage: data.last_page,
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
  getMoreRate = () => {
    if (
      !this.onEndReachedCalledDuringMomentum &&
      this.state.page < this.state.maxPage
    ) {
      this.setState(
        {
          page: this.state.page + 1,
          loadingMore: this.state.page < this.state.maxPage,
        },
        () => {
          this.getWaitingRating();
        },
      );
      this.onEndReachedCalledDuringMomentum =
        this.state.page >= this.state.maxPage;
    }
  };

  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        refreshing: true,
      },
      () => {
        this.getWaitingRating();
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
    const {rating, loadingApi} = this.state;
    // console.log('cek=====', JSON.stringify(this.state.listWaitingRating))
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        {this.state.listWaitingRating.length > 0 && (
          <>
            {loadingApi ? (
              <LoadingApi />
            ) : (
              <FlatList
                // contentContainerStyle={{flex: 1, paddingBottom: 68}}
                keyExtractor={(item, index) => `${index}`}
                data={this.state.listWaitingRating}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.handleRefresh}
                    colors={['#529F45', '#FFFFFF']}
                  />
                }
                onEndReached={() => this.getMoreRate()}
                onMomentumScrollBegin={() => {
                  this.onEndReachedCalledDuringMomentum = false;
                }}
                onEndReachedThreshold={0.5}
                initialNumToRender={10}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={() => this.renderLoadMore()}
                renderItem={({item, index}) => {
                  return (
                    <View key={index}>
                      {item.data_unreview[0]?.product ? (
                        <TouchableOpacity
                          onPress={() => {
                            this.props.navigation.replace(
                              'InputRating',
                              this.props.rateAct(item, 'rating'),
                            );
                          }}>
                          <Card containerStyle={styles.cardBackground}>
                            <View
                              style={[
                                styles.position2,
                                {
                                  alignItems: 'center',
                                  // backgroundColor: 'red',
                                },
                              ]}>
                              {item.data_unreview[0].product.image ? (
                                <Image
                                  source={{
                                    uri:
                                      CONFIG.BASE_URL +
                                      item.data_unreview[0].product.image,
                                  }}
                                  style={styles.imageStyle}
                                />
                              ) : (
                                <DummyImage style={styles.imageStyle} />
                              )}
                              <View style={[styles.textposition]}>
                                <View style={{width: wp('60%')}}>
                                  <Text
                                    numberOfLines={2}
                                    multiline
                                    style={styles.title}>
                                    {item.data_unreview[0].product.name ?? ''}
                                  </Text>
                                </View>
                                <Text
                                  style={{
                                    color: '#777',
                                    fontSize: hp('1.7%'),
                                    fontFamily: 'Lato-Medium',
                                    marginTop: wp('1%'),
                                  }}>
                                  {item.data_unreview[0].qty} barang x{' '}
                                  {item.data_unreview[0].half ? (
                                    <NumberFormat
                                      value={
                                        Math.round(
                                          item.data_unreview[0].price_apps / 2,
                                        ) ?? '0'
                                      }
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
                                          {value}
                                        </Text>
                                      )}
                                    />
                                  ) : (
                                    <NumberFormat
                                      value={
                                        Math.round(
                                          item.data_unreview[0].price_apps,
                                        ) ?? '0'
                                      }
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
                                          {value}
                                        </Text>
                                      )}
                                    />
                                  )}
                                  {item.data_unreview[0].half ? (
                                    <Text
                                      numberOfLines={1}
                                      style={{
                                        fontSize: hp('1.7%'),
                                        fontFamily: 'Lato-Medium',
                                        marginTop: wp('1%'),
                                        color: '#17a2b8',
                                      }}>
                                      {' ( '}
                                      {item?.data_unreview[0].qty_konversi}{' '}
                                      {item?.data_unreview[0].small_unit.charAt(
                                        0,
                                      ) +
                                        item?.data_unreview[0].small_unit
                                          .slice(1)
                                          .toLowerCase()}
                                      {' )'}
                                    </Text>
                                  ) : null}
                                </Text>
                                <View style={{flexDirection: 'row'}}>
                                  <Text
                                    style={{
                                      fontSize: hp('1.7%'),
                                      fontFamily: 'Lato-Medium',
                                      color: '#777',
                                    }}>
                                    {'Total Belanja : '}
                                  </Text>
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
                                          color: '#777',
                                        }}>
                                        {value}
                                      </Text>
                                    )}
                                  />
                                </View>
                              </View>
                            </View>
                            {item.data_unreview.length > '1' ? (
                              <Text
                                style={{
                                  fontSize: hp('1.6%'),
                                  fontFamily: 'Lato-Regular',
                                  marginTop: wp('1%'),
                                  color: '#777',
                                }}>
                                +{item.data_unreview.length - 1} produk lainnya
                              </Text>
                            ) : null}
                            <View
                              style={[
                                styles.position2,
                                {justifyContent: 'flex-end'},
                              ]}>
                              <Rating
                                imageSize={25}
                                readonly
                                startingValue={rating}
                                style={styles.rating}
                              />
                            </View>
                          </Card>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  );
                }}
              />
            )}
          </>
        )}
        {this.state.listWaitingRating.length === 0 && (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              marginTop: hp('-20%'),
            }}>
            <Icon404 width={wp('80%')} height={hp('60%')} />
            <Text
              style={{
                fontSize: hp('2%'),
                fontFamily: 'Lato-Medium',
                textAlign: 'center',
                marginTop: hp('-12%'),
              }}>
              Wah, daftar ulasan mu kosong
            </Text>
            <Text
              style={{
                fontSize: hp('1.8%'),
                fontFamily: 'Lato-Medium',
                width: wp('65%'),
                textAlign: 'center',
                marginTop: wp('2%'),
              }}>
              Yuk, saatnya belanja dan kasih ulasan untuk barang-barang mu
            </Text>
            <TouchableOpacity
              style={[
                styles.belanjaButton,
                {
                  marginTop: wp('2.5%'),
                  width: wp('45%'),
                },
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
    rateAct: (value, tipe) => {
      dispatch(RatingAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WaitingRating);

const styles = StyleSheet.create({
  cardBackground: {
    width,
    marginLeft: wp('0%'),
    marginBottom: wp('0%'),
    marginTop: wp('0%'),
    justifyContent: 'center',
  },
  title: {
    fontSize: hp('2%'),
    fontFamily: 'Lato-Medium',
    textAlign: 'auto',
  },
  position2: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageStyle: {
    height: wp('25%'),
    width: wp('25%'),
    backgroundColor: '#F9F9F9',
    borderRadius: wp('1%'),
  },
  textposition: {
    paddingHorizontal: 10,
  },
  belanjaButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#529F45',
    height: hp('5%'),
    borderRadius: Size(10),
  },
  offlineContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: wp('100%'),
    height: hp('60%'),
    // flexDirection: 'row',
    marginTop: hp('10%'),
  },
  offlineContainer2: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  offlineIcon: {
    width: wp('70%'),
    height: hp('70%'),
  },
  offlineText: {
    color: '#4A8F3C',
    fontFamily: 'Lato-Medium',
    fontSize: hp('3%'),
    marginBottom: hp('-30%'),
    textAlign: 'center',
    // fontSize: hp('2),%'
  },

  loadingApi: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    width: wp('100%'),
    marginTop: hp('0%'),
    // height: hp('100%'),
    // position: 'absolute',
    // top:hp('-50%')
  },
});
