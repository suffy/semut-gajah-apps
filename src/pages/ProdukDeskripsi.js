import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
  Alert,
  Modal,
  Pressable,
  TouchableHighlight,
  TouchableWithoutFeedback,
  RefreshControl,
  Animated,
  BackHandler,
} from 'react-native';
import {connect} from 'react-redux';
import ProductsImage from './ProductsImages';
import {Card} from 'react-native-elements';
import IconLove from '../assets/icons/Love.svg';
import Size from '../components/Fontresponsive';
import NumberFormat from 'react-number-format';
import axios from 'axios';
import CONFIG from '../constants/config';
import {ShoppingCartAction, SubsAction, BannerAction} from '../redux/Action';
import IconOffline from '../assets/icons/NetInfo.svg';
import {ActivityIndicator} from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Storage from '@react-native-async-storage/async-storage';
import IconBack from '../assets/icons/backArrow.svg';
import IconCart from '../assets/icons/Keranjang.svg';
import IconInfo from '../assets/newIcons/iconInfo.svg';
import Snackbar from 'react-native-snackbar';
import {Picker} from '@react-native-picker/picker';
import IconChat from '../assets/newIcons/chatActive.svg';
import ModalBlackList from '../components/ModalBlackList';
import ProductVarian from '../components/ProductVarian';
import IconCart2 from '../assets/newIcons/cartActive.svg';
import IconLike from '../assets/newIcons/iconHati.svg';
import Header from '../components/Header';
import bintang from '../assets/newIcons/iconBintang.svg';
import bintangAbu from '../assets/newIcons/iconBintangActive.svg';
import {Rating, AirbnbRating} from 'react-native-ratings';
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

export class ProdukDeskripsi extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.onEndReachedCalledDuringMomentum = false;
    this.animation = new Animated.Value(0);
    this.state = {
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
      listSearch: {
        id: '',
        name: '',
        image: '',
        price: {
          product_id: '',
          medium_retail: '',
          medium_grosir: '',
          small_retail: '',
          small_grosir: '',
          small_unit: '',
          price_apps: '',
        },
      },
      avgRating: {
        avg_star: '',
      },
      search: '',
      rating: '1',
      qty: 0,
      notifMessage: 0,
      notifSubscribe: 0,
      notifAllOrder: 0,
      notifAllComplaint: 0,
      notifBroadcast: 0,
      page: 1,
      loadingMore: false,
      refreshing: false,
      maxPage: 1,
      modalVisible: false,
      qty_cart: this.props.item?.cart?.qty || 0,
      half: false,
      recomenProduct: [],
      loadingApi: true,
      visibleModalBlack: false,
      varianProduct: [],
    };
  }
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

    // console.log('price=====>',item)
    let price = item.price.harga_ritel_gt ?? '0';
    if (brand_id_1.includes(item.brand_id)) {
      if (item.status_promosi_coret == 1) {
        // console.log('if 1');
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
        // console.log('if 2');
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
        // console.log('if 3');
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
        // console.log('if 4');
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
        // console.log('if 5');
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
        // console.log('if 6');
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
        // console.log('if 7');
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
        // console.log('if 8');
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
        // console.log('if 9');
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
        // console.log('if 10');
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

    // console.log('price_apps', price);

    try {
      let response;
      if (this.state.half) {
        // console.log('masuk Half');
        response = await axios.post(
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
            half: 1,
          },
          {
            headers: {Authorization: `Bearer ${this.props.token}`},
          },
        );
      } else {
        console.log('masuk byasa');
        response = await axios.post(
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
      }
      let data = response.data;
      if (data !== '' && data['success'] == true) {
        this.showModal();
        this.getAnimation();
        this.getNotifAll();
        this.setState({qty_cart: (parseInt(qty_cart) + 1).toString()});
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
        'Cek Error========================417',
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
  closeModalBlacklist() {
    this.setState({visibleModalBlack: false});
  }
  postWishlist = async item => {
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

    // console.log('price=====>',item)
    let price = item.price.harga_ritel_gt ?? '0';
    if (brand_id_1.includes(item.brand_id)) {
      if (item.status_promosi_coret == 1) {
        // console.log('if 1');
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
        // console.log('if 2');
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
        // console.log('if 3');
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
        // console.log('if 4');
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
        // console.log('if 5');
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
        // console.log('if 6');
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
        // console.log('if 7');
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
        // console.log('if 8');
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
        // console.log('if 9');
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
        // console.log('if 10');
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

    console.log('price_apps', price);

    try {
      let response;
      if (this.state.half) {
        response = await axios.post(
          `${CONFIG.BASE_URL}/api/wishlist`,
          {
            product_id: this.props.item.id,
            price_apps: price ?? '0',
            half: 1,
          },
          {
            headers: {Authorization: `Bearer ${this.props.token}`},
          },
        );
      } else {
        response = await axios.post(
          `${CONFIG.BASE_URL}/api/wishlist`,
          {
            product_id: this.props.item.id,
            price_apps: price ?? '0',
          },
          {
            headers: {Authorization: `Bearer ${this.props.token}`},
          },
        );
      }
      let data = response.data;
      if (data !== '' && data['success'] == true) {
        this.props.navigation.navigate('Wishlist');
      } else {
        console.log('Gagal memasukan wishlist===>', data);
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
        this.props.navigation.navigate('Home');
      }
    }
  };

  //rata-rata rating
  getProductRating = async () => {
    try {
      let response = await axios.get(
        `${CONFIG.BASE_URL}/api/products/ratings/${this.props.item.id}`,
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      let data = response.data.data;
      this.setState({avgRating: data});
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
        this.props.navigation.navigate('Home');
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
    this.props.navigation.navigate('ProdukDeskripsi', {initial: false});
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

  handleRefresh = () => {
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

  componentDidMount() {
    this._isMounted = true;
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.getProductRating();
      this.getNotifAll();
    });
    this.getDataSearching();
    this.getProdukRecomen();
    this.getVarian();

    BackHandler.addEventListener('hardwareBackPress', this.handlBackButton);
  }

  componentWillUnmount() {
    // rol();
    BackHandler.removeEventListener('hardwareBackPress', this.handlBackButton);
    this._isMounted = false;
    // this.focusListener();
  }
  handlBackButton = () => {
    if (this.props.route.params?.keyWord !== undefined) {
      console.log('Pindah');
      this.props.navigation.navigate('Home', {
        initial: false,
        kataKunci: this.props.route.params?.keyWord,
      });
      // this.props.navigation.navigate('Home')
      // ,{initial: false,keyword: this.props.route.params?.keyWord}
      return true;
    } else if (this.props.route.params?.keyWordProd !== undefined) {
      this.props.navigation.navigate('Produk', {
        initial: false,
        kataKunciProduk: this.props.route.params?.keyWordProd,
      });
      return true;
    }
  };
  showModal = () => {
    this._isMounted &&
      this.setState({
        modalVisible: true,
      });
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
      // console.log(response);
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

  getPromo = async item => {
    try {
      let response = await axios({
        method: 'get',
        headers: {Authorization: `Bearer ${this.props.token}`},
        url: `${CONFIG.BASE_URL}/api/promo?id=${item}`,
      });
      console.log('promo ' + JSON.stringify(response.data));
      const data = response.data;
      if (data.data != null && data['success'] == true) {
        this.props.navigation.navigate(
          'DetailPromo',
          this.props.bannerAct(data.data, 'banner'),
        );
      } else {
        return;
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
        'Cek Error=============getPromo===========',
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
      this.setState({
        // loadingApi: false,
        recomenProduct: response.data.data.data,
        // qtyTotalRecomen: response.data.data.total,
      });
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

  backToScreen = () => {
    const {keyWordProd, keyWord} = this.props.route.params;
    if (keyWordProd === undefined && keyWord === undefined) {
      this.props.navigation.goBack();
    } else {
      keyWordProd !== undefined
        ? this.props.navigation.navigate('Produk', {
            initial: false,
            kataKunciProduk: keyWordProd,
          })
        : this.props.navigation.navigate('Home', {
            initial: false,
            kataKunci: keyWord,
          });
    }
  };
  getVarian = async () => {
    this._isMounted = true;
    // this.setState({loadingApi: true});
    try {
      let response = await axios.get(
        `${CONFIG.BASE_URL}/api/products/varian/${this.props.item.id}`,
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      const data = response.data.data;
      if (response?.data['success'] == true) {
        this._isMounted &&
          this.setState({
            varianProduct: data,
            loadingApi: false,
          });
      } else {
        console.log('data undefined');
      }
      console.log('Data Varian ');
    } catch (e) {
      this.setState({loadingApi: false});
      console.log('error 1179 ', e);
    }
  };
  render() {
    const {rating, qty, search, qty_cart, loadingApi} = this.state;
    const rotation = this.animation.interpolate({
      inputRange: [0, 1, 2, 3, 4, 5],
      outputRange: ['0deg', '-15deg', '15deg', '-15deg', '15deg', '0deg'],
    });
    console.log('data props item ' + JSON.stringify(this.props.item));
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <Header
          title="Produk Detail"
          navigation={this.props.navigation}
          notif={true}
          notifCount={this.renderCountNotificationBadge()}
          cart={true}
          cartCount={qty}
          menu={true}
        />
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.detailproduct}>
            {/* produk rekomendasi */}
            {loadingApi ? (
              <LoadingApi />
            ) : (
              <>
                <ProductsImage
                  key={this.props.item.id}
                  image={this.props.item.image}
                  navigation={this.props.navigation}
                  subsAct={this.props.subsAct}
                />
                <View
                  style={{
                    width: '100%',
                    backgroundColor: '#FFF',
                    paddingVertical: hp('1.5%'),
                    paddingHorizontal: wp('3%'),
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                    flexDirection: 'row',
                  }}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Chat')}
                    style={styles.btnAction}>
                    <IconChat width={hp('4%')} height={hp('4%')} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.postWishlist(this.props.item)}
                    style={styles.btnAction}>
                    <IconLike width={hp('4%')} height={hp('4%')} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.postShoppingCart(this.props.item);
                    }}
                    style={styles.btnAction}>
                    {this.props.item.cart != null ? (
                      <View
                        style={{
                          backgroundColor: '#51AF3E',
                          height: hp('2.5%'),
                          width: hp('2.5%'),
                          borderRadius: hp('1.25%'),
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'absolute',
                          zIndex: 1,
                          top: 5,
                          right: 5,
                        }}>
                        <Text style={{color: '#FFF', fontSize: hp('1.2%')}}>
                          {this.props?.item?.cart?.qty}
                        </Text>
                      </View>
                    ) : null}
                    <IconCart2 width={hp('4%')} height={hp('4%')} />
                  </TouchableOpacity>
                </View>
                <ProductVarian
                  dataVarian={this.state?.varianProduct}
                  navigation={this.props.navigation}
                  // getVarian = {this.getVarian()}
                />
                <View style={[styles.positionPrice]}>
                  <View
                    style={{
                      backgroundColor: '#f4f4f4',
                      width: wp('100%'),
                      flexDirection: 'row',
                      paddingTop: hp('3%'),
                      borderRadius: 10,
                    }}>
                    <View
                      style={{
                        flex: 1,
                        paddingLeft: wp('5%'),
                        paddingBottom: hp('1.5%'),
                      }}>
                      <Text style={[styles.nameProduct]} numberOfLines={2}>
                        {this.props.item.name}
                      </Text>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                          paddingTop: hp('1%'),
                          height: hp('5%'),
                        }}>
                        <Rating
                          type="custom"
                          readonly={true}
                          startingValue={
                            this.props?.item?.review?.length
                              ? parseFloat(
                                  this.props?.item?.review[0]?.avg_rating,
                                )
                              : 0
                          }
                          ratingCount={5}
                          imageSize={20}
                          ratingColor={'#F2BB4C'}
                          ratingBackgroundColor={'#D3C3BE'}
                          tintColor={'#f4f4f4'}
                          jumpValue={0.5}
                          onFinishRating={this.ratingCompleted}
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        alignItems: 'flex-end',
                        marginRight: wp('5%'),
                      }}>
                      {this.props.item?.status_promosi_coret == 1 ? (
                        <View
                          style={{
                            alignItems: 'flex-end',
                          }}>
                          <NumberFormat
                            value={
                              Math.round(
                                this.props.item?.price
                                  ?.harga_promosi_coret_ritel_gt ||
                                  this.props.item?.price
                                    ?.harga_promosi_coret_grosir_mt ||
                                  this.props.item?.price
                                    ?.harga_promosi_coret_semi_grosir,
                              ) ?? '0'
                            }
                            displayType={'text'}
                            thousandSeparator={true}
                            prefix={'Rp '}
                            renderText={value => (
                              <Text
                                style={[
                                  styles.priceProduct,
                                  {marginLeft: wp('5%')},
                                ]}>
                                {value || 0}
                              </Text>
                            )}
                          />
                          <TouchableOpacity
                            style={[
                              styles.buttonSubscribe,
                              {marginLeft: wp('5%')},
                            ]}
                            onPress={() =>
                              this.props.navigation.navigate('Subscribe')
                            }>
                            <Text style={styles.textSubscribe}>Langganan</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View
                          style={{
                            alignItems: 'flex-end',
                          }}>
                          <NumberFormat
                            value={
                              Math.round(
                                this.props.item?.price?.harga_ritel_gt,
                              ) ?? '0'
                            }
                            displayType={'text'}
                            thousandSeparator={true}
                            prefix={'Rp '}
                            renderText={value => (
                              <Text
                                style={[
                                  styles.priceProduct,
                                  {marginLeft: wp('5%')},
                                ]}>
                                {value || 0}
                              </Text>
                            )}
                          />
                          <TouchableOpacity
                            style={[
                              styles.buttonSubscribe,
                              {marginLeft: wp('5%')},
                            ]}
                            onPress={() =>
                              this.props.navigation.navigate('Subscribe')
                            }>
                            <Text style={styles.textSubscribe}>Langganan</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                      {/* {this.props.item?.promo_sku?.length > 0 && (
                        <View
                          style={{
                            flexDirection: 'row',
                            marginLeft: wp('2%'),
                          }}>
                          <View
                            style={{
                              backgroundColor: '#b4e5ed',
                              justifyContent: 'center',
                              alignItems: 'center',
                              paddingLeft: 10,
                              paddingRight: 10,
                              marginVertical: 4,
                            }}>
                            <Text
                              style={{
                                fontSize: hp('1.5%'),
                                fontFamily: 'Lato-Medium',
                                color: '#17a2b8',
                              }}>
                              {'Promo'}
                            </Text>
                          </View>
                          <IconInfo
                            onPress={() =>
                              this.getPromo(
                                this.props.item?.promo_sku[0]?.promo_id,
                              )
                            }
                            width={wp('7%')}
                            height={wp('7%')}
                          />
                        </View>
                      )} */}
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    backgroundColor: '#f4f4f4',
                    paddingHorizontal: wp('5%'),
                    paddingVertical: hp('1%'),
                  }}>
                  <Text style={styles.textDeskripsi}>
                    {this.props.item.description}
                  </Text>
                </View>
                {this.state.recomenProduct.length > 0 && (
                  <View style={styles.container}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={styles.title}>{'Produk Rekomendasi'}</Text>
                      {/* {qtyTotalRecomen > 10 ? (
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('Produk', {
                          screen: 'GeneralRecent',
                          initial: false,
                        })
                      }
                      style={styles.buttonNext2}>
                      <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                      }}>
                      <Text style={styles.textButtonNext2}>
                        {'Lihat Semua'}
                      </Text>
                      <IconNext2
                        fill="#529F45"
                        width={wp('3%')}
                        height={wp('3%')}
                      />
                    </View>
                    </TouchableOpacity>
                  ) : null} */}
                    </View>
                    <ScrollView
                      contentContainerStyle={{
                        paddingLeft: wp('5%'),
                        paddingRight: wp('5%'),
                      }}
                      horizontal
                      onScroll={this.change}
                      showsHorizontalScrollIndicator={false}
                      style={{backgroundColor: '#FFF'}}>
                      {this.state.recomenProduct.map((item, index) => {
                        return (
                          <TouchableOpacity
                            key={index}
                            onPress={() => {
                              this.postRecent(item),
                                this.props.navigation.navigate(
                                  'ProdukDeskripsi',
                                  {initial: false},
                                  this.props.subsAct(item, 'item'),
                                );
                            }}
                            style={styles.buttonViewProdukTerbaru}>
                            {item.image ? (
                              <Image
                                resizeMode="contain"
                                source={{uri: CONFIG.BASE_URL + item.image}}
                                style={styles.list}
                              />
                            ) : (
                              <DummyImage style={styles.list} />
                            )}
                            <View
                              style={{
                                flexDirection: 'column',
                                justifyContent: 'center',
                                marginHorizontal: wp('3%'),
                              }}>
                              <View style={{height: wp('9%')}}>
                                <Text
                                  numberOfLines={2}
                                  style={styles.listTitle}>
                                  {item.name}
                                </Text>
                              </View>
                              <NumberFormat
                                value={Math.round(item?.price?.harga_ritel_gt)}
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={'Rp '}
                                renderText={value => (
                                  <Text style={styles.listPrice}>
                                    {value || 0}
                                  </Text>
                                )}
                              />
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                }}>
                                <View style={styles.borderLogo}>
                                  <Rating
                                    imageSize={wp('3%')}
                                    readonly
                                    startingValue={rating}
                                    ratingCount={1}
                                  />
                                  <Text
                                    style={{
                                      fontSize: hp('1.6%'),
                                      color: '#000000',
                                      fontFamily: 'Lato-Medium',
                                      marginLeft: wp('1%'),
                                    }}>
                                    {' '}
                                    {item.review
                                      ? item.review[0]
                                        ? item.review[0].avg_rating
                                        : '0'
                                      : '0'}
                                  </Text>
                                </View>
                                {item.cart && (
                                  <View style={styles.borderLogo}>
                                    <IconCart
                                      width={wp('4%')}
                                      height={wp('4%')}
                                    />
                                    <Text
                                      style={{
                                        fontSize: hp('1.6%'),
                                        color: '#529F45',
                                        fontFamily: 'Lato-Medium',
                                        marginLeft: wp('1%'),
                                      }}>
                                      {item.cart.qty}
                                    </Text>
                                  </View>
                                )}
                              </View>
                            </View>
                            <View
                              style={{
                                width: wp('27.5%'),
                                borderColor: '#EEEEEE',
                                marginBottom: wp('1%'),
                                marginLeft: wp('0%'),
                                marginRight: wp('0%'),
                              }}
                            />
                            {item.cart ? (
                              <Pressable
                                style={styles.buttonKeranjang}
                                onPress={() => {
                                  this.postShoppingCart(item);
                                }}>
                                <Text style={styles.textKeranjang}>
                                  {'Tambah'}
                                </Text>
                              </Pressable>
                            ) : (
                              <Pressable
                                style={styles.buttonKeranjang}
                                onPress={() => {
                                  this.postShoppingCart(item);
                                }}>
                                <Text style={styles.textKeranjang}>
                                  {'Beli'}
                                </Text>
                              </Pressable>
                            )}
                          </TouchableOpacity>
                        );
                      })}
                      {/* {qtyTotalRecomen > 10 ? (
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('Produk', {
                          screen: 'GeneralRecent',
                          initial: false,
                        })
                      }
                      style={styles.buttonNext}>
                      <IconNext
                        fill="#529F45"
                        width={wp('8%')}
                        height={hp('5%')}
                      />
                      <Text style={styles.textButtonNext}>{'Lihat Semua'}</Text>
                    </TouchableOpacity>
                  ) : null} */}
                    </ScrollView>
                  </View>
                )}
              </>
            )}
          </View>
        </ScrollView>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({modalVisible: !this.state.modalVisible}, () => {
              this.getNotifAll();
              this.getProdukRecomen();
            });
          }}>
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
                      {modalVisible: !this.state.modalVisible},
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
                      {modalVisible: !this.state.modalVisible},
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: hp('8%'),
    backgroundColor: 'white',
    // borderBottomWidth: 4,
    borderColor: '#ddd',
  },
  posisionTextTitle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: wp('5%'),
  },
  textHeader: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('2.4%'),
    paddingLeft: wp('5%'),
  },
  buttonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp('25%'),
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
    top: hp('0%'),
    right: wp('5%'),
  },
  scroll: {
    backgroundColor: '#FFF',
    flex: 1,
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
  },
  detailproduct: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    marginTop: 0,
  },
  positionPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: hp('2%'),
    backgroundColor: 'white',
  },
  nameProduct: {
    width: '90%',
    fontSize: hp('2.5%'),
    color: '#575251',
    fontFamily: 'Lato-Bold',
    // height: hp('8%'),
    textAlign: 'left',
  },
  priceProduct: {
    fontSize: hp('3.5%'),
    color: '#479933',
    fontFamily: 'Lato-Bold',
    // marginTop: hp('5%'),
    marginBottom: hp('1%'),
  },
  buttonPosisi: {
    marginTop: hp('2%'),
    marginBottom: hp('2%'),
    marginHorizontal: wp('3.5%'),
    alignItems: 'center',
    justifyContent: 'space-between',
    // width: wp('45%'),
    height: hp('5%'),
    flexDirection: 'row',
    // backgroundColor: 'red',
  },
  buttonBeli: {
    backgroundColor: '#529F45',
    // borderRadius: hp('1%'),
    width: wp('38%'),
    height: hp('6%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBeli: {
    textAlign: 'left',
    color: '#fff',
    fontSize: hp('1.6%'),
    fontFamily: 'Lato-Medium',
  },
  buttonSubscribe: {
    backgroundColor: '#F4964A',
    justifyContent: 'center',
    alignItems: 'center',
    height: hp('5%'),
    paddingHorizontal: hp('2%'),
    borderRadius: hp('2.5%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textSubscribe: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: hp('1.8'),
    fontFamily: 'Lato-Bold',
  },
  cardBackground: {
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    paddingTop: 10,
    paddingBottom: 30,
    borderColor: '#DCDCDC',
    // borderTopWidth: 1,
    paddingHorizontal: wp('5%'),
  },
  titleProduct: {
    color: '#000000',
    fontSize: hp('1.8%'),
    fontFamily: 'Lato-Medium',
  },
  positionPesanan: {
    flexDirection: 'row',
  },
  positionJumlah: {
    flex: 1,
    marginLeft: 70,
  },
  descriptionProduct: {
    flex: 1,
    color: '#000000',
    fontSize: hp('1.8%'),
    fontFamily: 'Lato-Regular',
    marginTop: wp('1%'),
  },
  satuanText: {
    flex: 1,
    marginTop: wp('1%'),
    color: '#777',
    fontSize: hp('1.6%'),
    fontFamily: 'Lato-Medium',
  },
  positionLogo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // marginTop: hp('2%'),
    marginBottom: hp('1.5%'),
  },
  borderDetail: {
    marginLeft: wp('2%'),
    borderColor: '#777',
    borderRadius: Size(8),
    width: wp('14%'),
    borderWidth: 1,
    borderColor: '#DCDCDCDC',
    height: wp('8%'),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  // View Offline
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

  //picker
  viewPicker: {
    borderWidth: 1,
    borderRadius: wp('1%'),
    borderColor: '#bcbcbc',
    marginTop: wp('1%'),
    width: wp('30%'),
    // paddingBottom: hp('3%'),
    backgroundColor: '#fff',
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 6},
    // shadowOpacity: 0.41,
    // shadowRadius: 9.11,
    // elevation: 10,
    justifyContent: 'center',
  },
  picker: {
    height: hp('3%'),
    width: wp('37%'),
    marginLeft: hp('-2%'),
    // marginTop: hp('-1.5%'),
    // transform: [{scaleX: 0.7}, {scaleY: 0.65}],
    // justifyContent: 'center'
  },
  pickerItem: {
    backgroundColor: '#FFFFFF',
  },

  loadingApi: {
    // flex: 1,
    marginLeft: wp('5%'),
    justifyContent: 'center',
    alignSelf: 'center',
    width: wp('90%'),
    marginTop: hp('10%'),
    // height: hp('100%'),
    // position: 'absolute',
    // top:hp('-50%')
  },

  container: {
    height: hp('42%'),
    backgroundColor: '#FFFFFF',
    // backgroundColor: 'red',
    elevation: 5,
    // paddingHorizontal: wp('5%'),
    marginBottom: wp('1%'),
  },
  // scroll: {
  //   backgroundColor: '#FFFFFF',
  //   width,
  //   height,
  // },
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
    elevation: 1,
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
    elevation: 1,
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
  textDeskripsi: {
    color: '#575251',
  },
  btnAction:{
    paddingHorizontal: hp('1%'),
    paddingVertical: hp('1%'),
    backgroundColor: '#F4F4F4',
    height: hp('6.5%'),
    width: hp('6.5%'),
    borderRadius: hp('3.5%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp('3%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  // RATING
  borderLogo: {
    borderColor: '#777',
    borderRadius: hp('1.5%'),
    alignItems: 'center',
    flexDirection: 'row',
  },
  rating: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
  dataUser: state.LoginReducer.dataUser,
  item: state.SubscribeReducer.item,
  qty: state.ShoppingCartReducer.qty,
});

const mapDispatchToProps = dispatch => {
  return {
    orderplusAct: () => {
      dispatch({type: 'PLUS_ORDER'});
    },
    orderAct: (value, tipe) => {
      dispatch(OrderAction(value, tipe));
    },
    shopAct: (value, tipe) => {
      dispatch(ShoppingCartAction(value, tipe));
    },
    subsAct: (value, tipe) => {
      dispatch(SubsAction(value, tipe));
    },
    bannerAct: (value, tipe) => {
      dispatch(BannerAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProdukDeskripsi);
