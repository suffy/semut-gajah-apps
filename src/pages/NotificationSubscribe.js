import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  FlatList,
  RefreshControl,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';
import {connect} from 'react-redux';
import {SubsAction} from '../redux/Action';
import CONFIG from '../constants/config';
import axios from 'axios';
import Icon404 from '../assets/icons/404.svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Storage from '@react-native-async-storage/async-storage';
import Logo from '../assets/icons/Logo.svg';
import IconNotif from '../assets/icons/NotifAll.svg';
import IconShopping from '../assets/icons/Shopping-Cart.svg';
import IconMenu from '../assets/icons/Menu.svg';
import IconSearch from '../assets/icons/Search.svg';
import IconClose from '../assets/icons/Closemodal.svg';
import Search from '../pages/Search';
import {ActivityIndicator} from 'react-native-paper';
import BottomNavigation from '../components/BottomNavigation';
import Snackbar from 'react-native-snackbar';
import HeaderHome from '../components/HeaderHome';

const list = [
  {
    id: '',
    name: '',
    image: '',
    price_sell: '',
    notifMessage: {},
    notifAllOrder: {},
    notifSubscribe: {},
  },
];

const ListSubscribe = [];
export class NotificationSubscribe extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      notifMessage: 0,
      notifSubscribe: 0,
      notifAllOrder: 0,
      notifAllComplaint: 0,
      notifBroadcast: 0,
      allSubscribe: [],
      loading: true,
      loadingMore: false,
      page: 1,
      refreshing: false,
      search: '',
      listSearch: list,
      qty: 0,
      maxPage: 1,
    };
    this.onEndReachedCalledDuringMomentum = false;
  }

  // UNSAFE_componentWillMount() {
  //   // lor(this);
  //   this._isMounted = true;
  //   this.getDetailSubscribe();
  //   this.getNotifAll();
  //   this.getDataSearching();
  // }

  componentDidMount() {
    this._isMounted = true;
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.getDetailSubscribe();
      this.getNotifAll();
    });
    this.getDataSearching();
  }

  componentWillUnmount() {
    // rol();
    this._isMounted = false;
    // this.focusListener();
  }

  getNotifAll = async () => {
    try {
      let response = await axios.get(
        `${CONFIG.BASE_URL}/api/notification-all`,
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      const data = response.data.data;
      // console.log('DATA TEST', data);
      this._isMounted &&
        this.setState({
          notifAllOrder: data.total_order,
          notifMessage: data.total_chat,
          notifAllComplaint: data.total_complaint,
          notifSubscribe: data.total_subscribe,
          notifBroadcast: data.total_broadcast,
          qty: data.total_cart,
        });
      // this.props.notifAct(data.data, 'notifAllComplaint');
    } catch (error) {
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

  renderCountNotificationBadge = () => {
    const {
      notifMessage,
      notifSubscribe,
      notifAllOrder,
      notifAllComplaint,
      notifBroadcast,
    } = this.state;
    // fungsi menghitung order berdasarkan status
    try {
      let count = 0;
      let hasil = notifMessage;
      let hasil2 = notifSubscribe;
      let hasil3 = notifAllOrder;
      let hasil4 = notifAllComplaint;
      let hasil5 = notifBroadcast;
      count =
        count +
        parseInt(hasil) +
        parseInt(hasil2) +
        parseInt(hasil3) +
        parseInt(hasil4) +
        parseInt(hasil5);
      // console.log(count);
      if (count > 0) {
        return count;
      } else {
        return 0;
      }
    } catch (error) {
      console.log(error);
    }
  };

  getDetailSubscribe = async () => {
    const {page} = this.state;
    try {
      let response = await axios.get(
        `${CONFIG.BASE_URL}/api/subscribes/notifications?page=${page}`,
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
        // {timeout: 1000},
      );
      const data = response.data.data;
      if (data.data != 0) {
        let allSubscribe = [];
        data.data.map((item, index) => {
          console.log(JSON.parse(item.data_content));
          let parseData = JSON.parse(item.data_content);
          // let name = parseData.product.name;
          // let image = parseData.product.image;
          // let id = parseData.id;
          // let product_id = parseData.product_id
          // let qty = parseData.qty;
          // let time = parseData.time;
          // let status = parseData.status;
          // let notes = parseData.notes;
          // let product = {
          //   id : id,
          //   product_id: product_id,
          //   qty: qty,
          //   time: time,
          //   status: status,
          //   notes: notes,
          //   product: {
          //     name: name,
          //     image: image,
          //   },
          // };
          allSubscribe = [...allSubscribe, {...item, parseData}];
          // allSubscribe = [...item, ...parseData];
          // console.log('STRING', JSON.stringify(allSubscribe));
          if (index === data.data.length - 1) {
            // console.log('masuk');
            this._isMounted &&
              this.setState(
                page === 1
                  ? {
                      allSubscribe,
                      loadingMore: data.last_page > this.state.page,
                      maxPage: data.last_page,
                      loading: false,
                      refreshing: false,
                    }
                  : {
                      allSubscribe: [
                        ...this.state.allSubscribe,
                        ...allSubscribe,
                      ],
                      loadingMore: data.last_page > this.state.page,
                      maxPage: data.last_page,
                      loading: false,
                      refreshing: false,
                    },
              );
            // console.log('STRING', JSON.stringify(this.state.allSubscribe));
            // this._isMounted && this.setState({notifOrders});
          }
        });
      } else {
        this.setState({loading: false});
      }
    } catch (error) {
      this.setState({loading: false, loadingMore: false});
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
    }
  };

  getDetails = async item => {
    console.log('item.parseData===========', item.parseData.id);
    // console.log(this.props.token);
    try {
      let response = await axios({
        method: 'get',
        url: `${CONFIG.BASE_URL}/api/subscribes/detail/${item.parseData.id}`,
        headers: {
          // 'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${this.props.token}`,
        },
        // data: createFormData(this.state.photo, {
        //   title: this.state.title,
        //   content: this.state.detail,
        // }),
      });
      const data = response.data;
      console.log('DATA NIHHH', JSON.stringify(data));
      if (data != 0 && data['success'] == true) {
        this.props.navigation.navigate(
          'DetailSubscribe',
          this.props.subsAct(data.data, 'details'),
        );
      }
    } catch (error) {
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

  getPutSeen = async item => {
    console.log('item======================================', item.id);
    try {
      await axios({
        method: 'put',
        url: `${CONFIG.BASE_URL}/api/subscribes/notifications/${item.id}`,
        headers: {
          // 'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${this.props.token}`,
        },
        // data: createFormData(this.state.photo, {
        //   title: this.state.title,
        //   content: this.state.detail,
        // }),
      });
      this.getDetails(item);
    } catch (error) {
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

  renderSubscribe = (item, index) => {
    try {
      let title = '';
      let desc = '';

      if (
        item.activity === 'subscribe h-2' &&
        item.parseData.time == '2_week'
      ) {
        title = 'Langganan';
        desc =
          'Langganan mingguan anda tinggal 2 hari lagi, mohon cek kembali bila ingin merubah status berlangganan';
      } else if (
        item.activity === 'subscribe h-1' &&
        item.parseData.time == '2_week'
      ) {
        title = 'Langganan';
        desc =
          'Langganan mingguan anda tinggal 1 hari lagi, mohon cek kembali bila ingin merubah status berlangganan';
      } else if (
        item.activity === 'subscribe h-2' &&
        item.parseData.time == 'month'
      ) {
        title = 'Langganan';
        desc =
          'Langganan bulanan anda tinggal 2 hari lagi, mohon cek kembali bila ingin merubah status berlangganan';
      } else if (
        item.activity === 'subscribe h-1' &&
        item.parseData.time == 'month'
      ) {
        title = 'Langganan';
        desc =
          'Langganan bulanan anda tinggal 1 hari lagi, mohon cek kembali bila ingin merubah status berlangganan';
      } else {
        return;
      }

      // let detail = item.detail[0] || {order_time: ''};

      return (
        <View>
          {item.user_seen == null ? (
            <View style={styles.containerButton}>
              <TouchableOpacity
                key={`${item.id}`}
                onPress={() => this.getPutSeen(item)}>
                {/* onPress={() =>
              this.props.navigation.navigate(
                'DetailSubscribe',
                this.props.subsAct(item.product, 'details'),
              )
            }> */}
                {/* onPress={() => console.log('clicked', index)}> */}
                <Text
                  style={[
                    {
                      marginBottom: 5,
                      fontFamily: 'Lato-Medium',
                      fontSize: hp('1.4%'),
                    },
                  ]}>
                  {title}
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
                  {desc}
                </Text>
                {/* <View style={{flexDirection: 'row-reverse', marginTop: 10}}>
              {button}
            </View> */}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.containerButton2}>
              <TouchableOpacity
                key={`${item.id}`}
                onPress={() => this.getPutSeen(item)}>
                {/* onPress={() =>
              this.props.navigation.navigate(
                'DetailSubscribe',
                this.props.subsAct(item.product, 'details'),
              )
            }> */}
                {/* onPress={() => console.log('clicked', index)}> */}
                <Text
                  style={[
                    {
                      marginBottom: 5,
                      fontFamily: 'Lato-Medium',
                      fontSize: hp('1.4%'),
                    },
                  ]}>
                  {title}
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
                  {desc}
                </Text>
                {/* <View style={{flexDirection: 'row-reverse', marginTop: 10}}>
              {button}
            </View> */}
              </TouchableOpacity>
            </View>
          )}
        </View>
      );
    } catch (error) {
      console.log(error);
    }
  };

  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        refreshing: true,
      },
      () => {
        this.getDetailSubscribe();
      },
    );
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
          this.getDetailSubscribe();
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
    if (!this.state.loadingMore) {
      return null;
    } else if (this.state.loadingMore) {
      return (
        <View>
          <ActivityIndicator animating size="small" color="#529F45" />
        </View>
      );
    }
  };

  subscribeRoute = () => {
    try {
      const {refreshing, allSubscribe} = this.state;

      return (
        <View style={styles.containerViewFlatlist}>
          <FlatList
            data={allSubscribe}
            renderItem={({item, index}) => {
              return this.renderSubscribe(item, index);
            }}
            keyExtractor={(item, index) => `${index}`}
            ListFooterComponent={() => this.renderFooter()}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
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
      );
    } catch (error) {
      console.log(error);
    }
  };

  getSubscribe = () => {
    this.props.navigation.navigate('ListTimeSubscribe');
  };

  getMenu = () => {
    this.props.navigation.navigate('Profile');
  };

  //searching data
  getDataSearching = async (value = this.state.search, isNew = false) => {
    const {page} = this.state;
    if (isNew) {
      this.setState({page: 1});
    }
    try {
      let response = await axios.get(
        `${CONFIG.BASE_URL}/api/products?search=${value}&page=${
          isNew ? 1 : page
        }`,
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      const data = response.data.data;
      this.setState(prevState => ({
        listSearch:
          page === 1 ? data.data : [...this.state.listSearch, ...data.data],
        refreshing: false,
        loadingMore: false,
        maxPage: data.last_page,
      }));
    } catch (error) {
      this.setState({loadingMore: false});
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
        this.props.navigation.popToTop();
      }
    }
  };

  handlerSearch = value => {
    this.setState({search: value});
    this.getDataSearching(value, true);
  };

  handleItemPress = item => {
    this.postRecent(item);
    this.props.subsAct(item, 'item');
    this.setState({search: ''});
    this.props.navigation.navigate('ProdukDeskripsi');
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
          this.getDataSearching(this.state.search);
        },
      );
      this.onEndReachedCalledDuringMomentum =
        this.state.page >= this.state.maxPage;
    }
  };

  handleRefreshSearching = () => {
    this.setState(
      {
        page: 1,
        refreshing: true,
      },
      () => {
        this.getDataSearching();
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

  postRecent = async item => {
    console.log(JSON.stringify(item));
    try {
      let response = await axios.post(
        `${CONFIG.BASE_URL}/api/recent/products`,
        {
          product_id: item.id,
        },
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      // let data = response.data.data.data;
      // const dataTotal = response.data.data.total;
      console.log(response);
    } catch (error) {
      console.log('5');
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
  removeParams() {
    this.setState({
      search: '',
    });
  }
  render() {
    const {qty, refreshing, search, loading} = this.state;
    return (
      <View style={styles.container}>
          <HeaderHome
            handlerSearch={value => this.handlerSearch(value)}
            search={search}
            removeParams={() => this.removeParams()}
            notifCount={this.renderCountNotificationBadge()}
            cartCount={qty}
            navigation={this.props.navigation}
          />
        {this.state.search.length > 0 && (
          <ScrollView>
            <Search
              onItemPress={this.handleItemPress}
              data={this.state.listSearch}
              // refreshControl={
              //   <RefreshControl
              //     refreshing={this.state.refreshing}
              //     onRefresh={this.handleRefresh}
              //     colors={['#529F45', '#FFFFFF']}
              //   />
              // }
              onEndReached={this.getMoreSearch}
              onMomentumScrollBegin={() => {
                this.onEndReachedCalledDuringMomentum = false;
              }}
              ListFooterComponent={this.renderLoadMore}
              navigation={this.props.navigation}
            />
          </ScrollView>
        )}
        {this.state.search.length == 0 && (
          <View>
            {/* {this.subscribeRoute()} */}
            {!loading ? (
              this.subscribeRoute()
            ) : (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                }}>
                <ActivityIndicator />
                <Text style={styles.textStyle2}>{'Menunggu Data'}</Text>
              </View>
            )}
          </View>
        )}
        <View style={{position: 'absolute', bottom: 0, width: wp('100%')}}>
          <BottomNavigation
            navigation={this.props.navigation}
            nameRoute="Produk"
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
  notifSubscribe: state.NotifReducer.notifSubscribe,
  details: state.SubscribeReducer.details,
});

const mapDispatchToProps = dispatch => {
  return {
    subsAct: (value, tipe) => {
      dispatch(SubsAction(value, tipe));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationSubscribe);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingBottom: hp('10%'),
    width: wp('100%'),
  },
  containerViewFlatlist: {
    // paddingVertical: hp('6%'),
    paddingTop: hp('2%'),
    paddingBottom: hp('6%'),
    flexGrow: 1,
    width: wp('90%'),
    height: hp('30%'),
  },
  containerButton: {
    borderWidth: 1,
    // borderColor: '#d5d5d5',
    borderColor: '#E8E8E8',
    backgroundColor: '#F2F2F2',
    paddingHorizontal: wp('2%'),
    paddingVertical: wp('2%'),
    borderRadius: hp('1.5%'),
    marginBottom: 10,
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
});
