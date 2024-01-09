import React, {Component, useEffect} from 'react';
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
  Pressable,
  Modal,
  Animated,
} from 'react-native';
import {connect} from 'react-redux';
import CONFIG from '../constants/config';
import axios from 'axios';
import IconChat from '../assets/newIcons/chatActive.svg';
import IconSubs from '../assets/newIcons/iconShopingBag.svg';
import {NotifAction, ShoppingCartAction, SubsAction} from '../redux/Action';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Storage from '@react-native-async-storage/async-storage';
import IconShopping from '../assets/newIcons/iconKeranjangAktif.svg';
import Search from '../pages/Search';
import {ActivityIndicator} from 'react-native-paper';
import {Rating} from 'react-native-elements';
import DummyImage from '../assets/icons/IconLogo.svg';
import NumberFormat from 'react-number-format';
import IconComplain from '../assets/newIcons/iconKomplain.svg';
import IconBroadcast from '../assets/icons/Broadcast.svg';
import IconCart from '../assets/icons/KeranjangActive.svg';
import BottomNavigation from '../components/BottomNavigation';
import Snackbar from 'react-native-snackbar';
import ModalBlackList from '../components/ModalBlackList';
import HeaderHome from '../components/HeaderHome';
import CardProduk from '../components/CardProduk';

const list = [
  {
    id: '',
    name: '',
    image: '',
    price_sell: '',
    notifMessage: {},
    notifAllOrder: {},
    notifAllComplaint: {},
    notifSubscribe: {},
  },
];

function LoadingApi() {
  return (
    <View style={styles.loadingApi}>
      <ActivityIndicator animating size="small" color="#529F45" />
    </View>
  );
}
export class Notification extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.animation = new Animated.Value(0);
    this.state = {
      notifMessage: 0,
      notifSubscribe: 0,
      notifAllOrder: 0,
      notifAllComplaint: 0,
      notifBroadcast: 0,
      refreshing: false,
      search: '',
      listSearch: list,
      qty: 0,
      page: 1,
      loadingMore: false,
      refreshing: false,
      maxPage: 1,
      loadingApi: true,
      recomenProduct: '',
      rating: '1',
      modalVisible: false,
      shoppingCartItems: {
        product_id: '',
        brand_id: '',
        satuan_online: '',
        konversi_sedang_ke_kecil: '',
        qty_konversi: '',
        qty: 1,
        notes: '',
        price_apps: '',
      },
      visibleModalBlack: false,
    };
  }

  // UNSAFE_componentWillMount = async () => {
  //   // lor(this);
  //   // _isMounted diberikan nilai true untuk handling perubahan state
  //   this._isMounted = true;
  //   this.getDataSearching();
  //   this.getNotifAll();
  //   this.getProdukRecomen();
  // };

  componentDidMount() {
    this._isMounted = true;
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.getNotifAll();
      this.getProdukRecomen();
    });
    this.getDataSearching();
    this.getNotifAll();
    this.getProdukRecomen();
  }

  componentWillUnmount = () => {
    // rol();
    // _isMounted diberikan nilai false untuk menghindari terjadinya perubahan state ketika meninggalkan halaman
    this._isMounted = false;
    // this.focusListener();
  };

  renderCountMessage = () => {
    const {notifMessage} = this.state;
    // fungsi menghitung order berdasarkan status
    try {
      let count = 0;
      let hasil = notifMessage && parseInt(notifMessage);
      count = count + hasil;
      if (count > 0) {
        return <Text style={[styles.tabIconCount]}>{count}</Text>;
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  renderCountSubscribe = () => {
    const {notifSubscribe} = this.state;
    try {
      let count = 0;
      let hasil = notifSubscribe && parseInt(notifSubscribe);
      count = count + hasil;
      if (count > 0) {
        return <Text style={[styles.tabIconCount]}>{count}</Text>;
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  renderCountOrderAll = () => {
    const {notifAllOrder} = this.state;
    // console.log('TEST===>', notifAllOrder);
    try {
      let count = 0;
      let hasil = notifAllOrder && parseInt(notifAllOrder);
      count = count + hasil;
      if (count > 0) {
        return <Text style={[styles.tabIconCount]}>{count}</Text>;
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  renderCountComplaintAll = () => {
    const {notifAllComplaint} = this.state;
    // console.log('TEST===>', notifAllComplaint);
    try {
      let count = 0;
      let hasil = notifAllComplaint && parseInt(notifAllComplaint);
      count = count + hasil;
      if (count > 0) {
        return <Text style={[styles.tabIconCount]}>{count}</Text>;
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };
  closeModalBlacklist() {
    this.setState({visibleModalBlack: false});
  }
  renderCountBroadcast = () => {
    const {notifBroadcast} = this.state;
    // console.log('TEST===>', notifAllComplaint);
    try {
      let count = 0;
      let hasil = notifBroadcast && parseInt(notifBroadcast);
      count = count + hasil;
      if (count > 0) {
        return <Text style={[styles.tabIconCount]}>{count}</Text>;
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  getChat = async () => {
    this.props.navigation.navigate('Chat');
  };

  getSubscribe = () => {
    this.props.navigation.navigate('NotificationSubscribe');
  };

  getShopping = () => {
    this.props.navigation.navigate('NotificationShopping');
  };

  getComplaint = () => {
    this.props.navigation.navigate('NotificationComplaint', {
      parameter: 'NotificationComplaint',
    });
  };

  getBroadcast = () => {
    this.props.navigation.navigate('NotificationComplaint', {
      parameter: 'broadcast',
    });
  };

  renderMessage = () => {
    try {
      const {notifMessage} = this.state;
      const {navigation} = this.props;

      let title = '';
      let desc = '';

      if (notifMessage.total > 0) {
        title = 'Pesan';
        desc = 'Kamu mempunyai pesan yang belum dibaca';
        // desc = 'Kamu mempunyai ' + notifMessage + ' pesan yang belum dibaca';
      } else {
        return;
      }

      // let detail = item.detail[0] || {order_time: ''};

      return (
        <TouchableOpacity
          onPress={() => {
            this.getChat();
          }}
          style={{
            borderWidth: 2,
            borderColor: '#d5d5d5',
            padding: 10,
            borderRadius: 8,
            marginBottom: 10,
          }}>
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
      );
    } catch (error) {
      console.log(error);
    }
  };

  messageRoute = () => {
    try {
      return (
        <View style={styles.containerViewMessage}>{this.renderMessage()}</View>
      );
    } catch (error) {
      console.log(error);
    }
  };

  getNotifAll = async () => {
    try {
      let response = await axios.get(
        `${CONFIG.BASE_URL}/api/notification-all`,
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      const data = response.data.data;
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
      if (count > 0) {
        return count;
      } else {
        return 0;
      }
    } catch (error) {
      console.log(error);
    }
  };

  //searching data
  getDataSearching = async (value = this.state.search, isNew = false) => {
    const {page} = this.state;
    if (isNew) {
      this._isMounted && this.setState({page: 1});
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
      this._isMounted &&
        this.setState(prevState => ({
          listSearch:
            page === 1 ? data.data : [...this.state.listSearch, ...data.data],
          refreshing: false,
          loadingMore: false,
          maxPage: data.last_page,
        }));
    } catch (error) {
      this._isMounted && this.setState({loadingMore: false});
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

  getProdukRecomen = async () => {
    try {
      let response = await axios.get(
        `${CONFIG.BASE_URL}/api/recomen/products`,
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      // let data = response.data.data.data;
      // const dataTotal = response.data.data.total;
      this._isMounted &&
        this.setState({
          loadingApi: false,
          recomenProduct: response.data.data.data,
          // qtyTotalRecomen: response.data.data.total,
        });
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
        // this.props.navigation.navigate('Home');
      }
    }
  };

  showModal = () => {
    this._isMounted &&
      this.setState({
        modalVisible: true,
      });
    // const setWaktu = setTimeout(() => {
    //   this._isMounted &&
    //     this.setState({
    //       modalVisible: false,
    //     });
    // }, 5000);
    // return () => {
    //   clearTimeout(setWaktu);
    // };
  };

  postShoppingCart = async item => {
    const brand_id_1 = ['001'];
    const brand_id_2 = [
      '002',
      '003',
      '004',
      '007',
      '008',
      '009',
      '010',
      '011',
      '012',
      '013',
      '014',
    ];
    const brand_id_3 = ['005'];
    let price = item.price.harga_ritel_gt ?? '0';
    if (brand_id_1.includes(item.brand_id)) {
      if (item.status_promosi_coret == 1) {
        switch (this.props.dataUser.salur_code) {
          case 'RT':
            price = item.price.harga_promosi_coret_ritel_gt;
            break;
          case 'WS':
            price = item.price.harga_promosi_coret_grosir_mt;
            break;
          case 'SO':
            price = item.price.harga_promosi_coret_grosir_mt;
            break;
          case 'SW':
            price = item.price.harga_promosi_coret_grosir_mt;
            break;
          default:
            break;
        }
      } else if (
        (item.status_promosi_coret !== '0' ||
          item.status_promosi_coret !== null) &&
        item.status_herbana !== '1'
      ) {
        switch (this.props.dataUser.salur_code) {
          case 'RT':
            price = item.price.harga_ritel_gt;
            break;
          case 'WS':
            price = item.price.harga_ritel_gt;
            break;
          case 'SO':
            price = item.price.harga_ritel_gt;
            break;
          case 'SW':
            price = item.price.harga_ritel_gt;
            break;
          default:
            break;
        }
      } else if (item.status_herbana === '1') {
        switch (this.props.dataUser.salur_code) {
          case 'RT':
            price = item.price.harga_ritel_gt;
            break;
          case 'WS':
            price = item.price.harga_grosir_mt;
            break;
          case 'SO':
            price = item.price.harga_grosir_mt;
            break;
          case 'SW':
            price = item.price.harga_grosir_mt;
            break;
          default:
            break;
        }
      } else {
        switch (this.props.dataUser.salur_code) {
          case 'RT':
            price = item.price.harga_ritel_gt;
            break;
          case 'WS':
            price = item.price.harga_ritel_gt;
            break;
          case 'SO':
            price = item.price.harga_ritel_gt;
            break;
          case 'SW':
            price = item.price.harga_ritel_gt;
            break;
          default:
            break;
        }
      }
    } else if (brand_id_2.includes(item.brand_id)) {
      if (item.status_promosi_coret == 1) {
        switch (this.props.dataUser.salur_code) {
          case 'RT':
            price = item.price.harga_promosi_coret_ritel_gt;
            break;
          case 'WS':
            price = item.price.harga_promosi_coret_grosir_mt;
            break;
          case 'SO':
            price = item.price.harga_promosi_coret_grosir_mt;
            break;
          case 'SW':
            price = item.price.harga_promosi_coret_grosir_mt;
            break;
          default:
            break;
        }
      } else if (
        item.status_promosi_coret !== '0' ||
        item.status_promosi_coret !== null
      ) {
        switch (this.props.dataUser.salur_code) {
          case 'RT':
            price = item.price.harga_ritel_gt;
            break;
          case 'WS':
            price = item.price.harga_grosir_mt;
            break;
          case 'SO':
            price = item.price.harga_grosir_mt;
            break;
          case 'SW':
            price = item.price.harga_grosir_mt;
            break;
          default:
            break;
        }
      } else {
        switch (this.props.dataUser.salur_code) {
          case 'RT':
            price = item.price.harga_ritel_gt;
            break;
          case 'WS':
            price = item.price.harga_grosir_mt;
            break;
          case 'SO':
            price = item.price.harga_grosir_mt;
            break;
          case 'SW':
            price = item.price.harga_grosir_mt;
            break;
          default:
            break;
        }
      }
    } else if (brand_id_3.includes(item.brand_id)) {
      if (item.status_promosi_coret == 1) {
        switch (this.props.dataUser.salur_code) {
          case 'RT':
            price = item.price.harga_promosi_coret_ritel_gt;
            break;
          case 'WS':
            price = item.price.harga_promosi_coret_ritel_gt;
            break;
          case 'SO':
            price = item.price.harga_promosi_coret_ritel_gt;
            break;
          case 'SW':
            price = item.price.harga_promosi_coret_ritel_gt;
            break;
          default:
            break;
        }
      } else if (
        item.status_promosi_coret !== '0' ||
        item.status_promosi_coret !== null
      ) {
        switch (this.props.dataUser.salur_code) {
          case 'RT':
            price = item.price.harga_ritel_gt;
            break;
          case 'WS':
            price = item.price.harga_ritel_gt;
            break;
          case 'SO':
            price = item.price.harga_ritel_gt;
            break;
          case 'SW':
            price = item.price.harga_ritel_gt;
            break;
          default:
            break;
        }
      } else {
        switch (this.props.dataUser.salur_code) {
          case 'RT':
            price = item.price.harga_ritel_gt;
            break;
          case 'WS':
            price = item.price.harga_ritel_gt;
            break;
          case 'SO':
            price = item.price.harga_ritel_gt;
            break;
          case 'SW':
            price = item.price.harga_ritel_gt;
            break;
          default:
            break;
        }
      }
    }
    try {
      let response = await axios.post(
        `${CONFIG.BASE_URL}/api/shopping-cart`,
        {
          product_id: item.id,
          brand_id: item.brand_id,
          satuan_online: item.satuan_online,
          konversi_sedang_ke_kecil: item.konversi_sedang_ke_kecil,
          qty_konversi:
            this.state.shoppingCartItems.qty * item.konversi_sedang_ke_kecil,
          qty: this.state.shoppingCartItems.qty,
          notes: this.state.shoppingCartItems.notes,
          price_apps: price ?? '0',
        },
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      let data = response.data;
      if (data !== '' && data['success'] == true) {
        // this.props.navigation.navigate('Keranjang');
        this.showModal();
        this.getAnimation();
        this.getNotifAll();
      } else {
        console.log('Gagal memasukkan keranjang===>', data);
        this.setState({visibleModalBlack: true});
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

  getAnimation = () => {
    Animated.timing(this.animation, {
      toValue: 5,
      useNativeDriver: true,
      duration: 1000,
    }).start(() => {
      this.animation = new Animated.Value(0);
    });
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
  clickCard(item) {
    this.postRecent(item),
      this.props.navigation.navigate(
        'ProdukDeskripsi',
        {initial: false},
        this.props.subsAct(item, 'item'),
      );
  }
  render() {
    const {qty, refreshing, search, notifMessage, loadingApi, rating} =
      this.state;
    const rotation = this.animation.interpolate({
      inputRange: [0, 1, 2, 3, 4, 5],
      outputRange: ['0deg', '-15deg', '15deg', '-15deg', '15deg', '0deg'],
    });
    return (
      <View style={styles.containerUtama}>
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
          <View
            style={{
              backgroundColor: '#FFF',
              alignItems: 'center',
              // width: '100%',
              borderColor: '#ddd',
              elevation: 5,
              paddingBottom: 5,
            }}>
            <TouchableOpacity
              onPress={() => {
                this.getChat();
              }}
              style={styles.buttonNotif}>
              <IconChat
                // fill="#529F45"
                stroke="#529F45"
                width={wp('10%')}
                height={hp('8%')}
                marginRight={wp('-1%')}
                marginLeft={wp('-2%')}
                marginBottom={hp('-1%')}
              />
              <Text style={styles.text}>{'Chat'}</Text>
              {this.renderCountMessage()}
            </TouchableOpacity>
            {notifMessage.total > 0 ? this.messageRoute() : null}
            <TouchableOpacity
              onPress={() => {
                this.getSubscribe();
              }}
              style={styles.buttonNotif}>
              <IconSubs width={wp('7%')} height={hp('7%')} />
              <Text style={styles.text}>{'Langganan'}</Text>
              {this.renderCountSubscribe()}
            </TouchableOpacity>
            <TouchableOpacity
              // onPress={() => {
              //   this.notifAllOrder != undefined ? this.getShopping() : null;
              // }}
              onPress={() => this.getShopping()}
              style={styles.buttonNotif}>
              <IconShopping width={wp('7%')} height={hp('7%')} />
              <Text style={styles.text}>{'Belanja'}</Text>
              {this.renderCountOrderAll()}
            </TouchableOpacity>
            <TouchableOpacity
              // onPress={() => {
              //   this.notifAllOrder != undefined ? this.getShopping() : null;
              // }}
              onPress={() => this.getComplaint()}
              style={styles.buttonNotif}>
              <IconComplain width={wp('7%')} height={hp('7%')} />
              <Text style={styles.text}>{'Komplain'}</Text>
              {this.renderCountComplaintAll()}
            </TouchableOpacity>
            <TouchableOpacity
              // onPress={() => {
              //   this.notifAllOrder != undefined ? this.getShopping() : null;
              // }}
              onPress={() => this.getBroadcast()}
              style={{
                flexDirection: 'row',
                height: hp('7%'),
                width: wp('90%'),
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
              <IconBroadcast width={wp('7%')} height={hp('7%')} />
              <Text style={styles.text}>{'Info Semut Gajah'}</Text>
              {this.renderCountBroadcast()}
            </TouchableOpacity>
          </View>
        )}

        {this.state.search.length == 0 && (
          <>
            {/* produk rekomendasi */}
            {loadingApi ? (
              <LoadingApi />
            ) : (
              <>
                {this.state.recomenProduct.length > 0 && (
                  <View style={styles.container}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={styles.title}>{'Produk Rekomendasi'}</Text>
                    </View>
                    <CardProduk
                      onClick={item => this.clickCard(item)}
                      data={this.state.recomenProduct}
                      postShoppingCart={item => this.postShoppingCart(item)}
                      // qtyTotal={qtyTotalRecomen}
                      // onClickAll={() => this.onClickAll('Herbal')}
                    />
                  </View>
                )}
              </>
            )}
          </>
        )}
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() =>
            this.setState(
              {modalVisible: !this.state.modalVisible, recomenProduct: []},
              () => {
                this.getNotifAll();
                this.getProdukRecomen();
              },
            )
          }>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                {'Pesanan sudah ditambahkan kedalam keranjang'}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Pressable
                  style={[
                    styles.buttonToKeranjang,
                    {
                      width: wp('30%'),
                      backgroundColor: '#fff',
                      borderColor: '#6c757d',
                    },
                  ]}
                  onPress={() =>
                    this.setState(
                      {
                        modalVisible: !this.state.modalVisible,
                        recomenProduct: [],
                      },
                      () => {
                        this.getNotifAll();
                        this.getProdukRecomen();
                      },
                    )
                  }>
                  <Text style={[styles.textStyle, {color: '#000'}]}>
                    {'Kembali'}
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.buttonToKeranjang,
                    {
                      marginLeft: wp('1%'),
                    },
                  ]}
                  onPress={() =>
                    this.setState(
                      {
                        modalVisible: !this.state.modalVisible,
                        recomenProduct: [],
                      },
                      () => {
                        this.props.navigation.navigate('Keranjang');
                      },
                    )
                  }>
                  <Text style={styles.textStyle}>{'Lihat Keranjang'}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
        <ModalBlackList
          modalVisible={this.state.visibleModalBlack}
          getCloseAlertModal={() => this.closeModalBlacklist()}
        />
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
  notifSubscribe: state.NotifReducer.notifSubscribe,
  dataUser: state.LoginReducer.dataUser,
});

const mapDispatchToProps = dispatch => {
  return {
    notifAct: (value, tipe) => {
      dispatch(NotifAction(value, tipe));
    },
    shopAct: (value, tipe) => {
      dispatch(ShoppingCartAction(value, tipe));
    },
    subsAct: (value, tipe) => {
      dispatch(SubsAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Notification);

const styles = StyleSheet.create({
  containerUtama: {
    flex: 1,
    backgroundColor: 'white',
    // height: hp('100%'),
    // width: wp('100%'),
    // justifyContent: 'flex-start',
    // paddingBottom: hp('25%'),
  },
  buttonNotif: {
    flexDirection: 'row',
    height: hp('7%'),
    width: wp('90%'),
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderColor: '#E8E8E8',
    // marginTop:hp('1%'),
  },
  text: {
    fontSize: hp('1.8%'),
    fontFamily: 'Lato-Medium',
    marginLeft: wp('2%'),
  },
  tabIconCount: {
    fontSize: hp('1.8%'),
    fontFamily: 'Lato-Medium',
    position: 'absolute',
    backgroundColor: '#529F45',
    top: hp('1.5%'),
    right: hp('1%'),
    color: 'white',
    borderRadius: hp('4%'),
    width: hp('4%'),
    height: hp('4%'),
    textAlign: 'center',
    paddingTop: 4,
  },
  containerViewFlatlist: {
    paddingVertical: hp('2%'),
    paddingTop: hp('2%'),
    flex: 1,
    width: wp('90%'),
    height: hp('30%'),
  },
  flatlist: {
    flex: 1,
    height: hp('10%'),
  },
  containerViewMessage: {
    paddingVertical: hp('2%'),
    paddingTop: hp('2%'),
    // flex: 1,
    width: wp('90%'),
    height: hp('13%'),
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
    height: hp('5%'),
  },
  inputStyle: {
    // flex: 1,
    borderWidth: 2,
    fontFamily: 'Lato-Medium',
    fontSize: hp('1.8%'),
    color: '#000000',
    width: wp('50%'),
    height: hp('5%'),
    marginLeft: wp('1%'),
    paddingLeft: wp('5%'),
    paddingRight: wp('10%'),
    borderRadius: hp('2.5%'),
    borderColor: '#F1F1F1',
    backgroundColor: '#F1F1F1',
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
  container: {
    // height: hp('42%'),
    flex: 1,
    backgroundColor: '#F4F4F4',
    // marginBottom: wp('1%'),
    // paddingBottom: wp('1%'),
  },
  list: {
    width: wp('27%'),
    height: wp('27%'),
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
    borderRadius: wp('1%'),
  },
  listTitle: {
    fontSize: hp('1.6%'),
    fontFamily: 'Lato-Regular',
    color: '#000000',
    marginTop: wp('1%'),
  },
  listPrice: {
    fontSize: hp('2%'),
    fontFamily: 'Lato-Regular',
    color: '#529F45',
    marginBottom: wp('1%'),
    marginTop: wp('1%'),
  },
  title: {
    fontSize: hp('1.7%'),
    fontFamily: 'Lato-Bold',
    color: '#1F1F1F',
    paddingLeft: wp('5%'),
    marginTop: hp('2%'),
  },
  buttonNext: {
    margin: 20,
    height: hp('32%'),
    marginRight: wp('5%'),
    marginLeft: wp('0.5%'),
    width: wp('30%'),
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp('2%'),
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000000',
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  buttonNext2: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingRight: wp('2%'),
  },
  textButtonNext: {
    fontSize: hp('1.6'),
    fontFamily: 'Robotic-Medium',
    color: '#529F45',
  },
  textButtonNext2: {
    fontSize: hp('1.2%'),
    fontFamily: 'Lato-Medium',
    color: '#529F45',
    paddingRight: wp('0.5%'),
  },
  buttonViewProdukTerbaru: {
    margin: 20,
    width: wp('30%'),
    marginRight: wp('1%'),
    marginLeft: wp('0.5%'),
    borderWidth: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderRadius: hp('2%'),
    borderColor: '#ddd',
    shadowColor: '#000000',
    backgroundColor: 'white',
    elevation: 2,
  },
  buttonKeranjang: {
    backgroundColor: '#FFFFFF',
    borderColor: '#529F45',
    borderWidth: 1,
    borderRadius: wp('2%'),
    width: wp('24%'),
    height: hp('3.5%'),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  textKeranjang: {
    textAlign: 'center',
    color: '#529F45',
    fontSize: hp('1.8%'),
    fontFamily: 'Lato-Medium',
  },
  columnTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // RATING
  borderLogo: {
    borderColor: '#777',
    borderRadius: hp('1.5%'),
    alignItems: 'center',
    flexDirection: 'row',
  },

  // View Modal
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.9)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  buttonToKeranjang: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('4%'),
    backgroundColor: '#529F45',
    borderColor: '#529F45',
    borderWidth: 1,
    width: wp('40%'),
    justifyContent: 'center',
    borderRadius: hp('1.5%'),
    // paddingLeft: wp('5%'),
  },
  buttonClose: {
    position: 'absolute',
    right: wp('-40%'),
    top: hp('-5%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // height: hp('8%'),
    backgroundColor: '#529F45',
    // width: wp('50%'),
    justifyContent: 'flex-start',
    borderRadius: hp('0.5%'),
    paddingHorizontal: wp('5%'),
  },
  textStyle: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Lato-Regular',
    fontSize: hp('1.8%'),
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'Lato-Regular',
    fontSize: hp('1.8%'),
    color: '#000000',
  },

  loadingApi: {
    // flex: 1,
    // marginLeft: wp('5%'),
    justifyContent: 'center',
    alignSelf: 'center',
    width: wp('90%'),
    marginTop: hp('10%'),
    // height: hp('100%'),
    // position: 'absolute',
    // top:hp('-50%')
  },
});
