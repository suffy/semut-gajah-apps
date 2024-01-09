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
import {VoucherAction, LoginAction} from '../redux/Action';
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

const {width} = Dimensions.get('window');
const height = width * 0.44;

export class CreditHistory extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      credit: [],
      creditHistory: [],
      loading: true,
      loadingMore: false,
      page: 1,
      refreshing: false,
      qty: 0,
      maxPage: 1,
    };
    this.onEndReachedCalledDuringMomentum = false;
  }
  UNSAFE_componentWillMount() {
    // lor(this);
    this.getCredit();
  }

  componentWillUnmount() {
    // rol();
  }

  getCredit = async () => {
    await axios({
      method: 'get',
      url: `${CONFIG.BASE_URL}/api/credits`,
      headers: {Authorization: `Bearer ${this.props.token}`},
    })
      .then(response => {
        const data = response.data;
        console.log('response nh=====', data);
        if (data.data !== '' && data.data !== null && data['success'] == true) {
          this.setState({
            loadingApi: false,
            credit: data.data,
          });
          this.getPage();
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
        } else if (error400) {
          Storage.removeItem('token');
          this.props.navigation.navigate('Home');
        }
      });
  };

  getPage = async () => {
    const {page} = this.state;
    await axios({
      method: 'get',
      url: `${CONFIG.BASE_URL}/api/credits/history/${this.state.credit.id}`,
      headers: {Authorization: `Bearer ${this.props.token}`},
    })
      .then(response => {
        const data = response.data.data;
        console.log('data==========', data.data);
        const newData =
          page === 1 ? data.data : [...this.state.creditHistory, ...data.data];
        this.setState((prevState, nextProps) => ({
          loadingApi: false,
          creditHistory: newData,
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
        } else if (errorNetwork) {
          this.showSnackbarInet();
        } else if (error400) {
          Storage.removeItem('token');
        }
      });
  };

  getDetails = item => {
    this.props.navigation.navigate('DetailCredit');
    this.props.loginAct(item, 'credit');
  };

  renderHistory = (item, index) => {
    return (
      <View style={styles.containerButton}>
        <TouchableOpacity
          // onPress={() => this.getDetails(item)}
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
                {'Transaksi  #' + item.order.invoice}
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
                style={[
                  {
                    marginBottom: 5,
                    fontFamily: 'Lato-Medium',
                    fontSize: hp('1.4%'),
                  },
                ]}>
                {item.status}
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
                {'kredit dari semutgajah berhasil'}
              </Text>
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
                {'+ '}
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
        this.getCredit();
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
          this.getCredit();
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
    console.log('PAGE===>', this.state.page);
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
  
  render() {
    console.log("data",this.state.credit.id)
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
          <Text style={styles.text}>{'Kredit'}</Text>
        </View>
        <Card containerStyle={[styles.cardTab]}>
          <View style={styles.columnTab}>
            <Text style={styles.textTab}>{'Kredit'}</Text>
            <Text style={styles.resultTab} numberOfLines={2} multiline>
              {this.state.credit?.credit ?? '0'}
            </Text>
          </View>
        </Card>
        <View style={styles.judulCredit}>
          <Text style={styles.textJudulCredit}>{'Transaksi Terakhir'}</Text>
        </View>
        {console.log('TEST===', JSON.stringify(this.state.creditHistory))}
        <View style={styles.containerViewFlatlist}>
          <FlatList
            data={this.state.creditHistory}
            renderItem={({item, index}) => {
              return this.renderHistory(item, index);
            }}
            keyExtractor={(item, index) => `${index}`}
            ListFooterComponent={() => this.renderFooter()}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.handleRefresh}
                colors={['#529F45', '#FFFFFF']}
              />
            }
            onEndReached={() => this.handleLoadMore()}
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
  credit: state.LoginReducer.credit,
  dataUser: state.LoginReducer.dataUser,
});

const mapDispatchToProps = dispatch => {
  return {
    voucherAct: (value, tipe) => {
      dispatch(VoucherAction);
    },
    loginAct: (value, tipe) => {
      dispatch(LoginAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreditHistory);
