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
import CONFIG from '../constants/config';
import IconSearch from '../assets/icons/Search.svg';
import IconClose from '../assets/icons/Closemodal.svg';
import {Card, Rating} from 'react-native-elements';
import moment from 'moment';
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

const listHistoryRating = [
  {
    id: '',
    payment_final: '',
    data_review: [
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
          review: [
            {
              id: '',
              star_review: '',
              detail_review: '',
            },
          ],
        },
      },
    ],
  },
];

export class HistoryRating extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.onEndReachedCalledDuringMomentum = false;
    this.state = {
      rating: '',
      listHistoryRating: [],
      search: '',
      page: 1,
      loadingMore: false,
      refreshing: false,
      maxPage: 1,
      loadingApi: true,
    };
  }

  // get history rating
  UNSAFE_componentWillMount = async () => {
    // lor(this);
    this._isMounted = true;
    this._isMounted && (await this.getHistoryRating());
  };

  componentWillUnmount() {
    // rol();
    this._isMounted = false;
  }

  getHistoryRating = async value => {
    const {page} = this.state;
    try {
      let response;
      if (this.state.search) {
        if (this.props.dataUser.account_type == 5) {
          response = await axios.get(
            `${CONFIG.BASE_URL}/api/distributor-partner/reviews?review=true&search=${value}&page=${page}`,
            {
              headers: {Authorization: `Bearer ${this.props.token}`},
            },
          );
        } else {
          response = await axios.get(
            `${CONFIG.BASE_URL}/api/reviews?review=true&search=${value}&page=${page}`,
            {
              headers: {Authorization: `Bearer ${this.props.token}`},
            },
          );
        }
      } else {
        if (this.props.dataUser.account_type == 5) {
          response = await axios.get(
            `${CONFIG.BASE_URL}/api/distributor-partner/reviews?review=true&page=${page}`,
            {
              headers: {Authorization: `Bearer ${this.props.token}`},
            },
          );
        } else {
          response = await axios.get(
            `${CONFIG.BASE_URL}/api/reviews?review=true&page=${page}`,
            {
              headers: {Authorization: `Bearer ${this.props.token}`},
            },
          );
        }
      }
      const data = response.data.data;
      // console.log('DATA REVIEW', JSON.stringify(data));
      this.setState(prevState => ({
        loadingApi: false,
        listHistoryRating:
          page === 1
            ? data.data
            : [...this.state.listHistoryRating, ...data.data],
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
        // this.props.navigation.navigate('Home');
      }
    }
  };

  //load more data
  getMoreHistory = () => {
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
          this.getHistoryRating(this.state.search);
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
        this.getHistoryRating();
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

  handlerSearch = async value => {
    await this.setState({search: value, page: 1});
    this.getHistoryRating(value);
  };

  handleItemPress = item => {
    this.props.rateAct(item, 'rating');
    this.setState({search: ''});
    this.props.navigation.navigate('DetailRating');
  };

  //load more data
  getMoreSearch = () => {
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
          this.getHistoryRating(this.state.search);
        },
      );
      this.onEndReachedCalledDuringMomentum =
        this.state.page >= this.state.maxPage;
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
    const {rating, search, loadingApi} = this.state;
    // console.log('this.state.listHistoryRating===',JSON.stringify(this.state.listHistoryRating))
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        {this.state.listHistoryRating.length > 0 && (
          <View>
            <View style={styles.searchSection}>
              <TextInput
                autoCapitalize="none"
                onChangeText={value => this.handlerSearch(value)}
                style={styles.inputStyle}
                placeholder="Ketik kata kunci yang ingin anda cari"
                value={search}
                selectTextOnFocus={true}
              />
              {search === '' ? (
                <IconSearch
                  width={wp('3.5%')}
                  height={hp('6%')}
                  style={styles.search}
                />
              ) : (
                <IconClose
                  fill={'black'}
                  width={wp('3%')}
                  height={hp('2%')}
                  style={[styles.search, {marginTop: hp('2%')}]}
                  onPress={() => {
                    this.setState(
                      {
                        search: '',
                      },
                      () => this.getHistoryRating(),
                    );
                  }}
                />
              )}
            </View>

            {loadingApi ? (
              <LoadingApi />
            ) : (
              <FlatList
                contentContainerStyle={{flex: 1, paddingBottom: 68}}
                keyExtractor={(item, index) => `${index}`}
                data={this.state.listHistoryRating}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.handleRefresh}
                    colors={['#529F45', '#FFFFFF']}
                  />
                }
                onEndReached={() => this.getMoreHistory()}
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
                      {item.data_review[0].review ? (
                        <TouchableOpacity
                          onPress={() => {
                            this.props.navigation.navigate(
                              'DetailRating',
                              this.props.rateAct(item, 'rating'),
                            );
                          }}>
                          <Card containerStyle={styles.cardBackground}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                // backgroundColor: 'red',
                              }}>
                              {item.data_review[0]?.review?.image ? (
                                <Image
                                  source={{
                                    uri:
                                      CONFIG.BASE_URL +
                                      item.data_review[0]?.review?.image,
                                  }}
                                  style={styles.imageStyle}
                                />
                              ) : (
                                <DummyImage style={styles.imageStyle} />
                              )}
                              <View style={{marginLeft: wp('2%')}}>
                                <Text style={styles.title}>
                                  {item.data_review[0]?.review?.name ?? ''}
                                </Text>
                                <Text style={{marginTop: wp('2%')}}>
                                  <Rating
                                    imageSize={23}
                                    readonly
                                    startingValue={
                                      item.data_review[0]?.review?.star_review
                                    }
                                  />
                                </Text>
                                {/* <Text
                              style={{
                                fontSize: hp('1.65%'),
                                fontFamily: 'Lato-Medium',
                                marginTop: wp('2%'),
                              }}>
                              {moment(
                                item.data_review[0].review.review[0]
                                  .created_at,
                              ).format('LLL')}
                            </Text> */}
                                <Text
                                  style={{
                                    fontSize: hp('1.5%'),
                                    color: '#777',
                                    fontFamily: 'Lato-Medium',
                                    marginTop: wp('2%'),
                                  }}>
                                  {moment(
                                    item.data_review[0]?.review?.created_at,
                                  ).format('LLL')}
                                </Text>
                                <View style={{width: wp('60%')}}>
                                  <Text
                                    style={{
                                      fontSize: hp('1.5%'),
                                      color: '#777',
                                      fontFamily: 'Lato-Medium',
                                    }}>
                                    {item.data_review[0]?.review?.detail_review}
                                  </Text>
                                </View>
                              </View>
                            </View>
                            {item.data_review.length > '1' ? (
                              <Text
                                style={{
                                  fontSize: hp('1.6%'),
                                  fontFamily: 'Lato-Regular',
                                  marginTop: wp('1%'),
                                  color: '#777',
                                }}>
                                + {item.data_review.length - 1} produk lainnya
                              </Text>
                            ) : null}
                          </Card>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  );
                }}
              />
            )}
          </View>
        )}
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          {this.state.listHistoryRating.length == 0 && (
            <ScrollView>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  marginTop: hp('0%'),
                }}>
                <Icon404 width={wp('80%')} height={hp('60%')} />
                <Text
                  style={{
                    fontSize: hp('2%'),
                    fontFamily: 'Lato-Medium',
                    textAlign: 'center',
                    marginTop: hp('-12%'),
                  }}>
                  Wah, riwayat ulasan mu kosong
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
            </ScrollView>
          )}
        </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(HistoryRating);

const styles = StyleSheet.create({
  cardBackground: {
    width,
    marginLeft: wp('0%'),
    marginTop: wp('0%'),
    justifyContent: 'center',
  },
  title: {
    fontSize: hp('2%'),
    fontFamily: 'Lato-Medium',
    textAlign: 'auto',
    width: wp('60%'),
  },
  position2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: wp('0%'),
  },
  imageStyle: {
    height: wp('25%'),
    width: wp('25%'),
    backgroundColor: '#F9F9F9',
    borderRadius: wp('1%'),
  },
  searchSection: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 10,
    marginBottom: 10,
  },
  inputStyle: {
    // flex: 1,
    borderWidth: 2,
    fontFamily: 'Lato-Medium',
    fontSize: hp('1.8%'),
    color: '#000000',
    width: wp('95%'),
    height: hp('6%'),
    marginLeft: wp('1%'),
    paddingLeft: wp('5%'),
    paddingRight: wp('15%'),
    borderRadius: hp('1.5%'),
    borderColor: '#DCDCDC',
  },
  search: {
    position: 'absolute',
    top: hp('0%'),
    right: wp('5%'),
  },
  container2: {
    flexDirection: 'row',
    marginLeft: wp('4%'),
    height: hp('5%'),
    backgroundColor: 'white',
    alignItems: 'center',
    marginBottom: wp('4%'),
    marginTop: wp('4%'),
  },
  belanjaButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#529F45',
    height: hp('5%'),
    borderRadius: Size(10),
  },
  containerViewFlatlist: {
    // paddingVertical: hp('6%'),
    flex: 1,
    width: wp('96%'),
    height: hp('100%'),
    alignSelf: 'center',
  },
  textStyle2: {
    backgroundColor: 'white',
    fontSize: hp('2%'),
    fontFamily: 'Lato-Medium',
    height: hp('4%'),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
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
    // fontSize: hp('2%'),
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
