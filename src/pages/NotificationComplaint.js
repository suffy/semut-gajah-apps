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
import {ComplaintAction, SubsAction} from '../redux/Action';
import CONFIG from '../constants/config';
import axios from 'axios';
import IconShopBag from '../assets/icons/ShoppingBag.svg';
import moment from 'moment';
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
import IconComplain from '../assets/icons/Komplain.svg';
import IconBroadcast from '../assets/icons/Broadcast.svg';
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

export class NotificationComplaint extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    // console.log('cek propsssssssssssssssssssssssss', props.route.params);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      notifMessage: 0,
      notifSubscribe: 0,
      notifAllOrder: 0,
      notifAllComplaint: 0,
      notifBroadcast: 0,
      allComplaints: [],
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
  //   this.getDetailTransaction();
  //   this.getNotifAll();
  //   this.getDataSearching();
  // }

  componentDidMount() {
    this._isMounted = true;
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.getDetailTransaction();
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
        'Cek Error========================132',
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

  getDetailTransaction = async () => {
    const {page} = this.state;
    try {
      let response;
      if (this.props.route.params.parameter == 'broadcast') {
        // console.log("Broadcast")
        response = await axios.get(
          `${CONFIG.BASE_URL}/api/broadcast/notification?page=${page}&order=desc`,
          {
            headers: {Authorization: `Bearer ${this.props.token}`},
          },
        );
      } else {
        // console.log("Bukan broadcast")
        response = await axios.get(
          `${CONFIG.BASE_URL}/api/complaint/notifications?page=${page}&order=desc`,
          {
            headers: {Authorization: `Bearer ${this.props.token}`},
          },
        );
      }

      const data = response.data.data;
      // console.log('DATA=======>', data);
      if (data.data != 0) {
        let allComplaints = [];
        data.data.map((item, index) => {
          // console.log(JSON.parse(item.data_content));
          let parseData = JSON.parse(item.data_content);
          allComplaints = [...allComplaints, {...item, parseData: parseData}];
          // allComplaints = [...item, ...parseData];
          // console.log('STRING', JSON.stringify(allComplaints));
          if (index === data.data.length - 1) {
            // console.log('masuk');
            this._isMounted &&
              this.setState(
                page === 1
                  ? {
                      allComplaints,
                      loadingMore: data.last_page > this.state.page,
                      maxPage: data.last_page,
                      loading: false,
                      refreshing: false,
                    }
                  : {
                      allComplaints: [
                        ...this.state.allComplaints,
                        ...allComplaints,
                      ],
                      loadingMore: data.last_page > this.state.page,
                      maxPage: data.last_page,
                      loading: false,
                      refreshing: false,
                    },
              );
            // console.log('STRING', JSON.stringify(this.state.allComplaints));
          }
        });
      } else {
        this.setState({loading: false});
      }
    } catch (error) {
      this.setState({loading: false});
      let error429 =
        JSON.parse(JSON.stringify(error)).message ===
        'Request failed with status code 429';
      let errorNetwork =
        JSON.parse(JSON.stringify(error)).message === 'Network Error';
      let error400 =
        JSON.parse(JSON.stringify(error)).message ===
        'Request failed with status code 400';
      console.log(
        'Cek Error========================257',
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

  getDetails = async item => {
    console.log('item.parseData===========', item.parseData.id);
    // console.log(this.props.token);
    try {
      let response = await axios({
        method: 'get',
        url: `${CONFIG.BASE_URL}/api/complaint/detail/${item.parseData.id}`,
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
          'OrderComplaintDetail',
          this.props.complaintAct(data.data, 'detailComplaint'),
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
        'Cek Error========================305',
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
      if (this.props.route.params.parameter == 'broadcast') {
        const response = await axios({
          method: 'put',
          url: `${CONFIG.BASE_URL}/api/broadcast/notifications/${item.id}`,
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
        console.log('console', data);
        if (data.success == true) {
          this.setState({page: 1});
          this.getDetailTransaction();
            const produk = JSON.parse(data.data.data_content)
            console.log("data content "+ JSON.stringify(data.data.data_content));
            if(produk.type === "notif-product"){
              if(produk.data !== null){
                this.props.navigation.navigate(
                  'ProdukDeskripsi',
                  this.props.subsAct(produk.data, 'item'),
                );
              }else{
               console.log("Produk grup") 
              }
            }
            else if(produk.title === "Update Status Pesanan") {
              let obj = {}
              obj ={"order_id":produk.id}
              this.props.navigation.navigate(
                'OutOfStockDetails',
                {id : obj}
                )
            
            }
        }
      } else {
        await axios({
          method: 'put',
          url: `${CONFIG.BASE_URL}/api/complaint/notifications/${item.id}`,
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
        'Cek Error========================368',
        JSON.parse(JSON.stringify(error)).message,
      );
      if (error429) {
        this.showSnackbarBusy();
      } else if (errorNetwork) {
        this.showSnackbarInet();
      } else if (error400) {
        Storage.removeItem('token');
        // this.props.navigation.navigate('Home');
      } else if (JSON.parse(JSON.stringify(error)).message == undefined) {
        this.props.navigation.goBack();
      }
    }
  };

  renderTransaction = (item, index) => {
    try {
      // let btnDisable = false;
      // if (
      //   item.data_content[0].status == '2' ||
      //   item.data_content[0].status == '3'
      // ) {
      //   btnDisable = false;
      // } else {
      //   btnDisable = true;
      // }
      // if (item.activity == 'order process' && index >= 0) {
      //     let check = this.state.notifNewOrder.filter((e) => {
      //         return e.id_relation === item.id_relation
      //     })

      //     check.map((item) => {
      //         if (item.activity === 'order completed') {
      //             btnDisable = true
      //         } else if (item.detail[0].time_partner_delivery !== null) {
      //             btnDisable = true
      //         }

      //         if (item.detail[0].time_send_partner !== null && item.detail[0].status == 3) {
      //             btnDisable = false
      //         }
      //     })
      // }
      let title = '';
      let desc = '';
      // let button = null;
      let icon = '';
      if (
        this.props.route &&
        this.props.route.params &&
        this.props.route.params.parameter == 'broadcast'
      ) {
        icon = (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <IconBroadcast width={wp('5%')} height={hp('3%')} />
            <View>
              <Text
                style={[
                  {
                    marginBottom: 0,
                    marginHorizontal: wp('2%'),
                    fontFamily: 'Lato-Medium',
                    fontSize: hp('1.2%'),
                  },
                ]}>
                {'Info dari Semut Gajah'}
              </Text>
              {/* <Text
                style={[
                  {
                    marginBottom: 0,
                    marginHorizontal: wp('2%'),
                    fontFamily: 'Lato-Medium',
                    fontSize: hp('1.2%'),
                  },
                ]}>
                {'#' + item?.parseData?.order?.invoice}
              </Text> */}
            </View>
          </View>
        );

        title = item.parseData.title;
        desc = item.parseData.message;
      } else {
        icon = (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <IconComplain width={wp('5%')} height={hp('3%')} />
            <View>
              <Text
                style={[
                  {
                    marginBottom: 0,
                    marginHorizontal: wp('2%'),
                    fontFamily: 'Lato-Medium',
                    fontSize: hp('1.2%'),
                  },
                ]}>
                {'Komplain'}
              </Text>
              <Text
                style={[
                  {
                    marginBottom: 0,
                    marginHorizontal: wp('2%'),
                    fontFamily: 'Lato-Medium',
                    fontSize: hp('1.2%'),
                  },
                ]}>
                {'#' + item?.parseData?.order?.invoice}
              </Text>
            </View>
          </View>
        );

        if (item.activity === 'repply complaint') {
          title = 'Balasan komplain';
          desc =
            'Komplain pada pesanan anda dengan nomor invoice ' +
            item.parseData.order.invoice +
            ' sudah dibalas';
        } else if (item.activity === 'confirmed complaint') {
          title = 'Komplain terkonfirmasi';
          desc =
            'Komplain pada pesanan anda dengan nomor invoice ' +
            item.parseData.order.invoice +
            ' sudah dikonfirmasi';
        } else if (item.activity === 'rejected complaint') {
          title = 'Komplain dibatalkan';
          desc =
            'Komplain pada pesanan anda dengan nomor invoice ' +
            item.parseData.order.invoice +
            ' dibatalkan';
        } else if (item.activity === 'seen') {
          title = 'Komplain dilihat dan diperiksa';
          desc =
            'Komplain pada pesanan anda dengan nomor invoice ' +
            item.parseData.order.invoice +
            ' dilihat dan diperiksa';
        } else if (item.activity === 'sended stuff') {
          title = 'Proses tukar barang';
          desc =
            'Komplain pada pesanan anda dengan nomor invoice ' +
            item.parseData.order.invoice +
            ' sudah diproses dan barang pengganti sudah dikirim';
        } else if (item.activity === 'sended credit') {
          title = 'Proses pengembalian dana';
          desc =
            'Komplain pada pesanan anda dengan nomor invoice ' +
            item.parseData.order.invoice +
            ' sudah diproses dan dana credit sudah bertambah pada akun anda';
        } else if (item.activity === 'notif broadcast message apps') {
          title = 'Harga barang akan segera naik';
          desc = 'Harga barang akan segera naik';
        } else {
          return;
        }
      }

      // let detail = item.detail[0] || {order_time: ''};

      return (
        // console.log("Data",JSON.parse(item.data_content)),
        <View>
          {item.user_seen == null ? (
            <View style={styles.containerButton}>
              <TouchableOpacity
                // key={index.toString()}
                // onPress={() => console.log('clicked')}>
                key={`${index}`}
                onPress={() => this.getPutSeen(item)}>
                {/* onPress=
            {() =>
              this.props.navigation.navigate(
                'TransactionDetail',
                this.props.orderAct(item.parseData, 'order'),
              )
            }> */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: hp('1%'),
                  }}>
                  {icon}

                  <Text
                    style={[
                      {
                        marginBottom: 0,
                        color: '#999',
                        fontFamily: 'Lato-Medium',
                        fontSize: hp('1.2%'),
                      },
                    ]}>
                    {moment(item.log_time, 'YYYY-MM-DD HH:mm:ss').format('LLL')}
                  </Text>
                </View>
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
                // key={index.toString()}
                // onPress={() => console.log('clicked')}>
                key={`${index}`}
                onPress={() => this.getPutSeen(item)}>
                {/* onPress=
            {() =>
              this.props.navigation.navigate(
                'TransactionDetail',
                this.props.orderAct(item.parseData, 'order'),
              )
            }> */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: hp('1%'),
                  }}>
                  {icon}

                  <Text
                    style={[
                      {
                        marginBottom: 0,
                        color: '#999',
                        fontFamily: 'Lato-Medium',
                        fontSize: hp('1.2%'),
                      },
                    ]}>
                    {/* {item.log_time} */}
                    {moment(item.log_time, 'YYYY-MM-DD HH:mm:ss').format('LLL')}
                  </Text>
                </View>
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
        this.getDetailTransaction();
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
          this.getDetailTransaction();
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

  transactionRoute = () => {
    try {
      const {refreshing, allComplaints} = this.state;
      return (
        <View style={styles.containerViewFlatlist}>
          {/* {this.headerTransaction()} */}

          <FlatList
            data={allComplaints}
            renderItem={({item, index}) => {
              return this.renderTransaction(item, index);
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
        'Cek Error========================807',
        JSON.parse(JSON.stringify(error)).message,
      );
      if (error429) {
        this.showSnackbarBusy();
      } else if (errorNetwork) {
        this.showSnackbarInet();
      } else if (error400) {
        Storage.removeItem('token');
        this.props.navigation.popToTop();
        // this.props.navigation.navigate('Home');
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
        'Cek Error========================901',
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
    // console.log("Data komplaint",)
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
            {/* {this.transactionRoute()} */}
            {!loading ? (
              this.transactionRoute()
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
  notifAllOrder: state.NotifReducer.notifAllOrder,
  listDataTransaction: state.NotifReducer.listDataTransaction,
});

const mapDispatchToProps = dispatch => {
  return {
    orderAct: (value, tipe) => {
      dispatch(OrderAction(value, tipe));
    },
    complaintAct: (value, tipe) => {
      dispatch(ComplaintAction(value, tipe));
    },
    subsAct: (value, tipe) => {
      dispatch(SubsAction(value, tipe));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationComplaint);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: 'white',
    paddingBottom: hp('10%'),
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
  textStyle2: {
    backgroundColor: 'white',
    fontSize: hp('2%'),
    fontFamily: 'Lato-Medium',
    height: hp('4%'),
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Header
  container2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp('100%'),
    height: hp('8%'),
    backgroundColor: 'white',
    borderBottomWidth: 4,
    borderColor: '#E8E8E8',
  },
  searchSection: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: wp('8%'),
  },
  inputStyle: {
    // flex: 1,
    borderWidth: 2,
    fontFamily: 'Lato-Medium',
    fontSize: hp('1.8%'),
    color: '#000000',
    width: wp('50%'),
    height: hp('5.5%'),
    marginLeft: wp('1%'),
    paddingLeft: wp('5%'),
    paddingRight: wp('10%'),
    borderRadius: hp('1.5%'),
    borderColor: '#DCDCDC',
  },
  search: {
    position: 'absolute',
    top: wp('-1.5%'),
    right: wp('4%'),
  },
  iconKanan: {
    flexDirection: 'row',
  },
  counter: {
    position: 'absolute',
    right: wp('-2.7%'),
    bottom: hp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#529F45',
    width: hp('2.5%'),
    height: hp('2.5%'),
    borderRadius: hp('2.5%'),
  },
  counterText: {
    textAlign: 'center',
    color: 'white',
    fontSize: hp('1.3%'),
    fontFamily: 'Lato-Bold',
  },
  menu: {
    marginRight: wp('2%'),
    // marginLeft: wp('4%'),
  },
});
