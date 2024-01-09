import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  RefreshControl,
} from 'react-native';
import {connect} from 'react-redux';
import {VoucherAction, OrderAction} from '../redux/Action';
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
import axios from 'axios';
import Storage from '@react-native-async-storage/async-storage';
import Icon404 from '../assets/icons/404.svg';
import {ActivityIndicator} from 'react-native-paper';
import Snackbar from 'react-native-snackbar';
import AlertPoint from '../components/AlertPoint';

const {width} = Dimensions.get('window');
const height = width * 0.44;

export class PointHistory extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      point: [],
      pointHistory: [],
      loading: true,
      loadingMore: false,
      page: 1,
      refreshing: false,
      qty: 0,
      maxPage: 1,
      visibleInfo: true,
    };
    this.onEndReachedCalledDuringMomentum = false;
  }
  UNSAFE_componentWillMount() {
    // lor(this);
    this.getPage();
  }

  componentWillUnmount() {
    // rol();
  }

  getPoint = async () => {
    await axios({
      method: 'get',
      url: `${CONFIG.BASE_URL}/api/credits`,
      headers: {Authorization: `Bearer ${this.props.token}`},
    })
      .then(response => {
        const data = response.data.data;
        this.setState({
          loadingApi: false,
          point: data,
        });
        this.getPage();
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
          this.setState({visible: true});
        } else if (errorNetwork) {
          this.showSnackbarInet();
          this.setState({visible2: true});
        } else if (error400) {
          Storage.removeItem('token');
          // this.props.navigation.navigate('Home');
        }
      });
  };

  getPage = async () => {
    const {page} = this.state;
    await axios({
      method: 'get',
      url: `${CONFIG.BASE_URL}/api/point/history`,
      headers: {Authorization: `Bearer ${this.props.token}`},
    })
      .then(response => {
        const data = response.data.data;
        const newData =
          page === 1 ? data.data : [...this.state.pointHistory, ...data.data];
        this.setState((prevState, nextProps) => ({
          loadingApi: false,
          pointHistory: newData,
          // hasilPromo: response.data.promo_result,
          // hargaPromo: response.data.detail,
          // hasilPromoNotif: notif,
          refreshing: false,
          loadingMore: data.last_page > this.state.page,
          maxPage: data.last_page,
          loading: false,
        }));
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
          this.setState({visible: true});
        } else if (errorNetwork) {
          this.showSnackbarInet();
          this.setState({visible2: true});
        } else if (error400) {
          Storage.removeItem('token');
          // this.props.navigation.navigate('Home');
        }
      });
  };

  getDetails = item => {
    this.props.navigation.navigate(
      'ListPaymentDetail',
      this.props.orderAct(item, 'order'),
    );
  };

  renderHistory = (item, index) => {
    return (
      <View style={styles.containerButton}>
        
        <TouchableOpacity
          onPress={() => {!item.order?.invoice ? null :this.getDetails(item.order) }}
          key={`${index}`}>
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
                {item.order_id === null ? 'Top Spender ' + (item.top_spender?.title || " ") : 'Transaksi  #' + item.order?.invoice}
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
              {moment(item.created_at).format('LLL')}
            </Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View>
              <Text
                numberOfLines={2}
                style={[
                  {
                    marginBottom: 5,
                    fontFamily: 'Lato-Medium',
                    fontSize: hp('1.4%'),
                    width: wp('70%'),
                  },
                ]}>
                {item.status}
              </Text>
              {item.kredit ? (
                <Text
                  style={[
                    {
                      marginBottom: 0,
                      fontFamily: 'Lato-Medium',
                      fontSize: hp('1.2%'),
                      textAlign: 'justify',
                    },
                  ]}>
                  {'pembelian dari poin anda berhasil'}
                </Text>
              ) : (
                <Text
                  style={[
                    {
                      marginBottom: 0,
                      fontFamily: 'Lato-Medium',
                      fontSize: hp('1.2%'),
                      textAlign: 'justify',
                    },
                  ]}>
                  {'poin dari semutgajah berhasil'}
                </Text>
              )}
            </View>
            {item.deposit != null ? (
              <Text
                style={[
                  {
                    marginBottom: 0,
                    fontFamily: 'Lato-Medium',
                    fontSize: hp('2%'),
                    textAlign: 'justify',
                  },
                ]}>
                {'+ '}
                {item.deposit}
              </Text>
            ) : null}
            {item.kredit != null ? (
              <Text
                style={[
                  {
                    marginBottom: 0,
                    fontFamily: 'Lato-Medium',
                    fontSize: hp('2%'),
                    textAlign: 'justify',
                  },
                ]}>
                {'- '}
                {item.kredit}
              </Text>
            ) : null}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        refreshing: true,
      },
      () => {
        this.getPage();
      },
    );
    this.setState({refreshing: false});
  };

  handleLoadMore = async () => {
    if (
      !this.onEndReachedCalledDuringMomentum &&
      this.state.page < this.state.maxPage
    ) {
      this.setState(
        (prevState, nextProps) => ({
          page: prevState.page + 1,
          loadingMore: this.state.page < this.state.maxPage,
        }),
        () => {
          this.getPage();
        },
      );
      this.onEndReachedCalledDuringMomentum =
        this.state.page >= this.state.maxPage;
    }
    // await this.setState(
    //   (prevState, nextProps) => ({
    //     page: prevState.page + 1,
    //     loadingMore: true,
    //   }),
    //   () => {
    //     this.getDetailTransaction();
    //   },
    // );
    this.setState({loadingMore: false});
  };

  renderFooter = () => {
    if (!this.state.loadingMore) return null;
    return (
      // false
      <View>
        <ActivityIndicator animating size="small" color="#529F45" />
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
  onCloseInfo = () => {
    this.setState({visibleInfo : false})
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
          <Text style={styles.text}>{'Poin'}</Text>
        </View>
        <AlertPoint 
        visible={this.state.visibleInfo}
        onClose={this.onCloseInfo}
        />
        <Card containerStyle={[styles.cardTab]}>
          <View style={styles.columnTab}>
            <Text style={styles.textTab}>{'Poin'}</Text>
            <Text style={styles.resultTab} numberOfLines={2} multiline>
              {this.props.dataUser.point}
            </Text>
          </View>
        </Card>
        <View style={styles.judulCredit}>
          <Text style={styles.textJudulCredit}>{'Transaksi Terakhir'}</Text>
        </View>
        <View style={styles.containerViewFlatlist}>
          <FlatList
            data={this.state.pointHistory}
            renderItem={({item, index}) => {
              return this.renderHistory(item, index);
            }}
            keyExtractor={(item, index) => `${index}`}
            ListFooterComponent={this.renderFooter}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.handleRefresh}
                colors={['#529F45', '#FFFFFF']}
              />
            }
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={0.5}
            initialNumToRender={10}
            showsVerticalScrollIndicator={false}
            onMomentumScrollBegin={() => {
              this.onEndReachedCalledDuringMomentum = false;
            }}
            ListEmptyComponent={() => {
              return (
                <View style={{flex: 1, alignItems: 'center'}}>
                  <Icon404
                    width={wp('80%')}
                    height={hp('80%')}
                    // source={require('../assets/images/no_data.jpg')}
                  />
                  {/* <Text
                    style={[
                      {
                        fontSize: hp('2.6%'),
                        fontFamily: 'Robotic-Medium',
                        marginTop: hp('-20%'),
                      },
                    ]}>
                    {'Tidak ada data.'}
                  </Text> */}
                </View>
              );
            }}
          />
        </View>
        {/* <TouchableOpacity
              onPress={() => this.getDetails()}
              // key={`${index}`}
              >
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
                    {'Transaksi  #JK11000001632960761'}
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
                  {moment().format('LLL')}
                </Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View>
              <Text
                style={[
                  {
                    marginBottom: 5,
                    fontFamily: 'Lato-Medium',
                    fontSize: hp('1.4%'),
                  },
                ]}>
                {'Pembayaran belanja'}
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
                {'pembayaran ke semutgajah berhasil'}
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
                {'- Rp30.567'}
              </Text>
              </View>
            </TouchableOpacity> */}
        {/* <Image
            source={
              this.props.banner.images
                ? {uri: CONFIG.BASE_URL + this.props.banner.images}
                : null
            }
            style={styles.banner}
          /> */}
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
    marginLeft: wp('5%'),
  },
  containerViewFlatlist: {
    marginHorizontal: wp('5%'),
    paddingTop: hp('2%'),
    flex: 1,
    alignItems: 'center',
    width: wp('90%'),
    // height: hp('80%'),
  },
  containerButton: {
    borderWidth: 1,
    // flex: 1,
    // borderColor: '#d5d5d5',
    borderColor: '#E8E8E8',
    backgroundColor: '#F2F2F2',
    paddingHorizontal: wp('2%'),
    paddingVertical: wp('2%'),
    borderRadius: hp('1.5%'),
    marginBottom: 10,
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
  dataUser: state.LoginReducer.dataUser,
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

export default connect(mapStateToProps, mapDispatchToProps)(PointHistory);
