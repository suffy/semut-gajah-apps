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
  TouchableWithoutFeedback,
} from 'react-native';
import {connect} from 'react-redux';
import Size from '../components/Fontresponsive';
import axios from 'axios';
import NumberFormat from 'react-number-format';
import CONFIG from '../constants/config';
import IconSearch from '../assets/icons/Search.svg';
import IconClose from '../assets/icons/Closemodal.svg';
import {Card} from 'react-native-elements';
import moment from 'moment';
import IconPlus from '../assets/icons/Plus.svg';
import {ComplaintAction} from '../redux/Action';
import SearchComplaint from '../pages/SearchComplaint';
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
import DummyImage from '../assets/icons/IconLogo.svg';
import Snackbar from 'react-native-snackbar';
import Header from '../components/Header';
function LoadingApi() {
  return (
    <View style={styles.loadingApi}>
      <ActivityIndicator animating size="small" color="#529F45" />
    </View>
  );
}

const width = Dimensions.get('window').width;

const listDataComplaint = [
  {
    id: '',
    order_id: '',
    product_id: '',
    user_id: '',
    status: '',
    created_at: '',
    updated_at: '',
    complaint_detail: [
      {
        id: '',
        title: '',
        content: '',
        file_1: '',
        file_2: '',
        file_3: '',
        file_4: '',
      },
    ],
    order: {
      id: '',
      invoice: '',
      order_details: [
        {
          id: '',
          total_price: '',
          created_at: '',
          product: {
            id: '',
            name: '',
            price_sell: '',
            image: '',
          },
        },
      ],
    },
  },
];

export class OrderComplaint extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.onEndReachedCalledDuringMomentum = false;
    this.state = {
      listDataComplaint: listDataComplaint,
      search: '',
      pilihStatus: '',
      page: 1,
      loadingMore: false,
      refreshing: false,
      maxPage: 1,
      loadingApi: true,
      buttonSemua: true,
      buttonNoResponse: false,
      buttonResponse: false,
      buttonBatal: false,
      buttonSelesai: false,
    };
  }

  // UNSAFE_componentWillMount = async () => {
  //   // lor(this);
  //   this._isMounted = true;
  //   this._isMounted && (await this.getComplaint());
  // };

  componentDidMount() {
    this._isMounted = true;
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.getComplaint();
    });
  }

  componentWillUnmount() {
    // rol();
    this._isMounted = false;
    // this.focusListener();
  }

  handlerSearch = async value => {
    await this.setState({pilihStatus: '', search: value, page: 1}, () => {
      this.getComplaint(this.state.pilihStatus, value);
    });
  };

  // filterList(list) {
  //     let result =
  //         list.length !== 0 &&
  //         list.filter(listItem =>
  //             listItem.order.invoice.toLowerCase().includes(this.state.search.toLowerCase()),
  //             console.log(this.state.search, 'invoice')
  //         );
  //     return result;
  // }

  handleItemPress = item => {
    this.setState({search: ''});
    this.props.complaintAct(item, 'detailComplaint');
    this.props.navigation.navigate('OrderComplaintDetail');
  };

  // get complaint
  getComplaint = async (status = '', value = '', isNew = false) => {
    const {page} = this.state;
    try {
      let response;
      if (
        this.props.route.params &&
        this.props.route.params.screen == 'Distributor'
      ) {
        response = await axios.get(
          `${CONFIG.BASE_URL}/api/distributor-partner/complaint?invoice=${value}&status=${status}&page=${page}`,
          {
            headers: {Authorization: `Bearer ${this.props.token}`},
          },
        );
      } else {
        console.log('masuk ke 2');
        response = await axios.get(
          `${CONFIG.BASE_URL}/api/complaint?invoice=${value}&status=${status}&page=${page}`,
          {
            headers: {Authorization: `Bearer ${this.props.token}`},
          },
        );
      }
      const data = response.data.data;
      // let data = []
      // if(status != ''){
      //   data = response.data.data;
      // } else if(value != ''){
      //   data = response.data.data;
      // } else {
      //   data = response.data;
      // }
      // console.log('adsadsa', JSON.stringify(data));
      this._isMounted &&
        this.setState(prevState => ({
          loadingApi: false,
          listDataComplaint:
            page === 1
              ? data.data
              : [...this.state.listDataComplaint, ...data.data],
          refreshing: false,
          loadingMore: data.last_page > this.state.page,
          maxPage: data.last_page,
        }));
    } catch (error) {
      this._isMounted && this.setState({loadingApi: false});
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

  handleStatusChange(item) {
    // console.log('item  nihhhh', item)
    this._isMounted &&
      this.setState({
        pilihStatus: item,
        search: '',
      });
    this.getComplaint(item);
  }

  getMoreComplaint = () => {
    if (
      !this.onEndReachedCalledDuringMomentum &&
      this.state.page < this.state.maxPage
    ) {
      this._isMounted &&
        this.setState(
          {
            page: this.state.page + 1,
            loadingMore: this.state.page < this.state.maxPage,
          },
          () => {
            this.getComplaint(this.state.search);
          },
        );
      this.onEndReachedCalledDuringMomentum =
        this.state.page >= this.state.maxPage;
    }
  };

  handleRefresh = () => {
    this._isMounted &&
      this.setState(
        {
          page: 1,
          refreshing: true,
        },
        () => {
          this.getComplaint();
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

  getDetailComplaint = item => {
    if (
      this.props.route.params &&
      this.props.route.params.screen == 'Distributor'
    ) {
      this.props.navigation.navigate(
        'OrderComplaintDetail',
        {screen: 'Distributor'},
        this.props.complaintAct(item, 'detailComplaint'),
      );
    } else {
      this.props.navigation.navigate(
        'OrderComplaintDetail',
        this.props.complaintAct(item, 'detailComplaint'),
      );
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
    const {search, loadingApi} = this.state;
    // console.log('cek data====', JSON.stringify(this.state.listDataComplaint));
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <Header title={'Komplain Pesanan'} navigation={this.props.navigation} />
        {this.props.route.params &&
        this.props.route.params.screen == 'Distributor' ? null : (
          <View style={styles.container3}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('OrderComplaintTransaction')
              }>
              <Card containerStyle={styles.cardBackground}>
                <View style={styles.position2}>
                  <Text
                    style={{
                      fontSize: hp('1.6%'),
                      fontFamily: 'Lato-Medium',
                    }}>
                    {'Ajukan Komplain'}
                  </Text>
                  <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <IconPlus width={wp('5%')} height={hp('3%')} />
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.searchSection}>
          <TextInput
            autoCapitalize="none"
            onChangeText={value => this.handlerSearch(value)}
            style={styles.inputStyle}
            placeholder="Ketik nomor invoice yang ingin anda cari"
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
              fill="black"
              width={wp('3%')}
              height={hp('2%')}
              style={[styles.search, {marginTop: hp('2%')}]}
              onPress={() =>
                this.setState({
                  search: '',
                })
              }
            />
          )}
        </View>
        <View>
          <ScrollView
            contentContainerStyle={{paddingLeft: wp('5%')}}
            horizontal
            showsHorizontalScrollIndicator={false}>
            <View style={[styles.position2, {marginVertical: hp('0.5%')}]}>
              <View style={styles.containerInput}>
                {this.state.buttonSemua ? (
                  <TouchableOpacity style={styles.borderFilterComplaintActive}>
                    <Text
                      style={{
                        fontSize: hp('1.6%'),
                        fontFamily: 'Lato-Medium',
                        color: '#fff',
                      }}>
                      Semua
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.borderFilterComplaint}
                    onPress={() => {
                      this.handleStatusChange();
                      this.setState({
                        buttonSemua: true,
                        buttonNoResponse: false,
                        buttonResponse: false,
                        buttonBatal: false,
                        buttonSelesai: false,
                      });
                    }}>
                    <Text
                      style={{
                        fontSize: hp('1.6%'),
                        fontFamily: 'Lato-Medium',
                        color: '#000',
                      }}>
                      Semua
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.containerInput}>
                {this.state.buttonNoResponse ? (
                  <TouchableOpacity
                    style={[
                      styles.borderFilterComplaintActive,
                      {width: wp('30%')},
                    ]}>
                    <Text
                      style={{
                        fontSize: hp('1.6%'),
                        fontFamily: 'Lato-Medium',
                        color: '#fff',
                      }}>
                      Belum direspon
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.borderFilterComplaint, {width: wp('30%')}]}
                    onPress={() => {
                      this.handleStatusChange('no response yet');
                      this.setState({
                        buttonSemua: false,
                        buttonNoResponse: true,
                        buttonResponse: false,
                        buttonBatal: false,
                        buttonSelesai: false,
                      });
                    }}>
                    <Text
                      style={{
                        fontSize: hp('1.6%'),
                        fontFamily: 'Lato-Medium',
                        color: '#000',
                      }}>
                      Belum direspon
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.containerInput}>
                {this.state.buttonResponse ? (
                  <TouchableOpacity
                    style={[
                      styles.borderFilterComplaintActive,
                      {width: wp('30%')},
                    ]}>
                    <Text
                      style={{
                        fontSize: hp('1.6%'),
                        fontFamily: 'Lato-Medium',
                        color: '#fff',
                      }}>
                      Sudah direspon
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.borderFilterComplaint, {width: wp('30%')}]}
                    onPress={() => {
                      this.handleStatusChange('response');
                      this.setState({
                        buttonSemua: false,
                        buttonNoResponse: false,
                        buttonResponse: true,
                        buttonBatal: false,
                        buttonSelesai: false,
                      });
                    }}>
                    <Text
                      style={{
                        fontSize: hp('1.6%'),
                        fontFamily: 'Lato-Medium',
                        color: '#000',
                      }}>
                      Sudah direspon
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.containerInput}>
                {this.state.buttonBatal ? (
                  <TouchableOpacity
                    style={[
                      styles.borderFilterComplaintActive,
                      {width: wp('25%')},
                    ]}>
                    <Text
                      style={{
                        fontSize: hp('1.6%'),
                        fontFamily: 'Lato-Medium',
                        color: '#fff',
                      }}>
                      Di batalkan
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.borderFilterComplaint, {width: wp('25%')}]}
                    onPress={() => {
                      this.handleStatusChange('rejected');
                      this.setState({
                        buttonSemua: false,
                        buttonNoResponse: false,
                        buttonResponse: false,
                        buttonBatal: true,
                        buttonSelesai: false,
                      });
                    }}>
                    <Text
                      style={{
                        fontSize: hp('1.6%'),
                        fontFamily: 'Lato-Medium',
                        color: '#000',
                      }}>
                      Di batalkan
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={[styles.containerInput, {paddingRight: wp('4%')}]}>
                {this.state.buttonSelesai ? (
                  <TouchableOpacity
                    style={[
                      styles.borderFilterComplaintActive,
                      {width: wp('30%')},
                    ]}>
                    <Text
                      style={{
                        fontSize: hp('1.6%'),
                        fontFamily: 'Lato-Medium',
                        color: '#fff',
                      }}>
                      Sudah Selesai
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.borderFilterComplaint, {width: wp('30%')}]}
                    onPress={() => {
                      this.handleStatusChange('completed');
                      this.setState({
                        buttonSemua: false,
                        buttonNoResponse: false,
                        buttonResponse: false,
                        buttonBatal: false,
                        buttonSelesai: true,
                      });
                    }}>
                    <Text
                      style={{
                        fontSize: hp('1.6%'),
                        fontFamily: 'Lato-Medium',
                        color: '#000',
                      }}>
                      Sudah Selesai
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </ScrollView>
        </View>
        {this.state.listDataComplaint?.length > 0 && (
          <View style={{flex: 1}}>
            {loadingApi ? (
              <LoadingApi />
            ) : (
              <FlatList
                contentContainerStyle={{paddingBottom: 20}}
                keyExtractor={(item, index) => `${index}`}
                data={this.state.listDataComplaint}
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
                    <View>
                      {this.state.search.length > 0 && (
                        <SearchComplaint
                          onItemPress={this.handleItemPress}
                          data={this.state.listDataComplaint}
                          // refreshControl={
                          //   <RefreshControl
                          //     refreshing={this.state.refreshing}
                          //     onRefresh={this.handleRefresh}
                          //     colors={['#529F45', '#FFFFFF']}
                          //   />
                          // }
                          onEndReached={this.getMoreComplaint}
                          onMomentumScrollBegin={() => {
                            this.onEndReachedCalledDuringMomentum = false;
                          }}
                          ListFooterComponent={this.renderLoadMore}
                          navigation={this.props.navigation}
                        />
                      )}
                      {this.state.search.length == 0 && (
                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.props.navigation.navigate(
                              'OrderComplaintDetail',
                              this.props.complaintAct(item, 'detailComplaint'),
                            )
                          }>
                          <View>
                            <Card
                              containerStyle={{
                                borderRadius: wp('3%'),
                                marginBottom: wp('1%'),
                                marginLeft: wp('5%'),
                                padding: 10,
                              }}>
                              <View style={styles.position2}>
                                <View
                                  style={{
                                    width: wp('40%'),
                                  }}>
                                  <Text
                                    style={{
                                      color: '#777',
                                      fontSize: hp('1.6%'),
                                      fontFamily: 'Lato-Regular',
                                    }}>
                                    {moment(
                                      item.order?.order_details[0]?.created_at,
                                    ).format('DD MMM YYYY HH:mm:')}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    width: wp('45%'),
                                  }}>
                                  <Text
                                    style={{
                                      color: '#777',
                                      fontSize: hp('1.6%'),
                                      fontFamily: 'Lato-Regular',
                                    }}>
                                    Invoice: {item.order?.invoice}
                                  </Text>
                                </View>
                              </View>
                              <View
                                style={[
                                  styles.position2,
                                  {justifyContent: 'center'},
                                ]}>
                                <View>
                                  {item.order?.order_details[0]?.product
                                    ?.image ? (
                                    <Image
                                      resizeMode="contain"
                                      source={{
                                        uri:
                                          CONFIG.BASE_URL +
                                          item.order?.order_details[0]?.product
                                            ?.image,
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
                                    {
                                      marginTop: wp('-2.5%'),
                                    },
                                  ]}>
                                  <Text
                                    numberOfLines={3}
                                    multiline
                                    style={styles.title}>
                                    {item.order?.order_details[0]?.product?.name}
                                  </Text>
                                  {item.order.order_details[0].half ? (
                                    <Text
                                      numberOfLines={1}
                                      style={{
                                        fontSize: hp('1.7%'),
                                        fontFamily: 'Lato-Medium',
                                        marginTop: wp('1%'),
                                        color: '#17a2b8',
                                      }}>
                                      {'( '}
                                      {
                                        item?.order.order_details[0]
                                          ?.qty_konversi
                                      }{' '}
                                      {item?.order.order_details[0]?.small_unit.charAt(
                                        0,
                                      ) +
                                        item?.order.order_details[0]?.small_unit
                                          .slice(1)
                                          .toLowerCase()}
                                      {' )'}
                                    </Text>
                                  ) : null}
                                  <NumberFormat
                                    value={
                                      Math.round(
                                        item.order?.order_details[0]
                                          ?.total_price,
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
                                        Total: {value}
                                      </Text>
                                    )}
                                  />
                                </View>
                              </View>
                              {item.order?.order_details?.length > '1' ? (
                                <Text
                                  style={{
                                    fontSize: hp('1.6%'),
                                    fontFamily: 'Lato-Medium',
                                    color: '#777',
                                  }}>
                                  +{item.order?.order_details?.length - 1}{' '}
                                  produk lainnya
                                </Text>
                              ) : null}
                            </Card>
                          </View>
                        </TouchableWithoutFeedback>
                      )}
                    </View>
                  );
                }}
              />
            )}
          </View>
        )}
        {this.state.listDataComplaint.length == 0 && (
          <ScrollView style={{marginBottom: hp('3%')}}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                marginTop: hp('-10%'),
              }}>
              <Icon404 width={wp('80%')} height={hp('60%')} />
              <Text
                style={{
                  fontSize: hp('2%'),
                  fontFamily: 'Lato-Medium',
                  textAlign: 'center',
                  marginTop: hp('-12%'),
                }}>
                Pesanan mu bermasalah?
              </Text>
              <Text
                style={{
                  fontSize: hp('1.8%'),
                  fontFamily: 'Lato-Medium',
                  width: wp('65%'),
                  textAlign: 'center',
                  marginTop: wp('2%'),
                }}>
                Kini kamu bisa mengajukan komplain
              </Text>
              <TouchableOpacity
                style={[
                  styles.belanjaButton,
                  {
                    marginTop: wp('2.5%'),
                    width: wp('60%'),
                  },
                ]}
                onPress={() =>
                  this.props.navigation.navigate('OrderComplaintTransaction')
                }>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: hp('1.8%'),
                    fontFamily: 'Lato-Medium',
                  }}>
                  {'Ajukan Komplain'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
    complaintAct: (value, tipe) => {
      dispatch(ComplaintAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderComplaint);

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
  searchSection: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  inputStyle: {
    // flex: 1,
    borderWidth: 2,
    fontFamily: 'Lato-Medium',
    fontSize: hp('1.8%'),
    color: '#000000',
    width: wp('90%'),
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
    right: wp('7%'),
  },
  container2: {
    flexDirection: 'row',
    marginLeft: wp('4%'),
    height: hp('5%'),
    backgroundColor: 'white',
    alignItems: 'center',
    // marginBottom: wp('4%'),
    // marginTop: wp('1%'),
  },
  container3: {
    flexDirection: 'row',
    marginLeft: wp('0%'),
    backgroundColor: 'white',
    alignItems: 'center',
    marginBottom: wp('3%'),
  },
  containerInput: {
    // overflow: 'hidden',
    // paddingRight: hp('2%'),
    paddingRight: wp('2%'),
  },
  borderFilterComplaint: {
    borderRadius: wp('2%'),
    width: wp('20%'),
    borderWidth: wp('0.1%'),
    height: hp('6%'),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: '#ddd',
    borderWidth: 1,
    marginTop: wp('2%'),
    backgroundColor: '#fff',
    elevation: 2,
  },
  borderFilterComplaintActive: {
    // marginLeft: wp('2%'),
    borderRadius: wp('2%'),
    width: wp('20%'),
    borderWidth: wp('0.1%'),
    height: hp('6%'),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: '#529F45',
    borderWidth: 1,
    // alignSelf: 'center',
    // justifyContent: 'space-between',
    // paddingHorizontal: wp('2%'),
    marginTop: wp('2%'),
    backgroundColor: '#529F45',
    elevation: 5,
  },
  title: {
    fontSize: hp('1.8%'),
    fontFamily: 'Lato-Medium',
    textAlign: 'auto',
    width: wp('60%'),
    marginTop: wp('2%'),
  },
  imageStyle: {
    height: wp('20%'),
    width: wp('20%'),
    backgroundColor: '#F9F9F9',
    borderRadius: Size(10),
  },
  cardBackground: {
    width,
    marginLeft: wp('0%'),
    borderColor: '#fff',
    justifyContent: 'center',
    paddingLeft: wp('5%'),
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
  position2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
