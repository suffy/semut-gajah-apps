import React, {Component} from 'react';
import {
  View,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Text,
  RefreshControl,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import {connect} from 'react-redux';
import Logo from '../assets/icons/Logo.svg';
import IconSearch from '../assets/newIcons/iconPencarian.svg';
import IconNotif from '../assets/newIcons/iconNotif.svg';
import IconShopping from '../assets/newIcons/iconKeranjangAktif.svg';
import IconMenu from '../assets/newIcons/iconMenu.svg';
import IconClose from '../assets/newIcons/iconClose.svg';
import axios from 'axios';
import CONFIG from '../constants/config';
import NumberFormat from 'react-number-format';
import {SubsAction, ShoppingCartAction} from '../redux/Action';
import Search from './Search';
import IconOffline from '../assets/icons/NetInfo.svg';
import {ActivityIndicator} from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import {SafeAreaView} from 'react-native-safe-area-context';
import Storage from '@react-native-async-storage/async-storage';
import {Card, Rating} from 'react-native-elements';
import DummyImage from '../assets/icons/IconLogo.svg';
import IconNext from '../assets/icons/Next.svg';
import IconNext2 from '../assets/icons/RightArrow.svg';
import Snackbar from 'react-native-snackbar';
import IconCart from '../assets/icons/KeranjangActive.svg';
import BottomNavigation from '../components/BottomNavigation';
import ModalBlackList from '../components/ModalBlackList';
import {copilot, walkthroughable, CopilotStep} from 'react-native-copilot';
import HeaderHome from '../components/HeaderHome';
import CardProduk from '../components/CardProduk';
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

const width = Dimensions.get('window').width;
const height = width * 0.5;

function LoadingApi() {
  return (
    <View style={styles.loadingApi}>
      <ActivityIndicator animating size="small" color="#529F45" />
    </View>
  );
}
function LoadingApiLoad() {
  return (
    <View style={styles.loadingApiLoad}>
      <ActivityIndicator animating size="small" color="#529F45" />
    </View>
  );
}
export class Produk extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.onEndReachedCalledDuringMomentum = false;
    this.animation = new Animated.Value(0);
    console.log('route navigation===', this.props.route.params);
    this.state = {
      herbalPopular: [],
      herbalNewest: [],
      herbalRecent: [],
      herbalAll: [],
      supmulPopular: [],
      supmulNewest: [],
      supmulRecent: [],
      supmulAll: [],
      foodbevPopular: [],
      foodbevNewest: [],
      foodbevRecent: [],
      foodbevAll: [],
      minyakbalsemPopular: [],
      minyakbalsemNewest: [],
      minyakbalsemRecent: [],
      minyakbalsemAll: [],
      listSearch: {
        id: '',
        name: '',
        image: '',
        price: {
          product_id: '',
          harga_ritel_gt: '',
          harga_grosir_mt: '',
          harga_semi_grosir: '',
          harga_promosi_coret_ritel_gt: '',
          harga_promosi_coret_grosir_mt: '',
          harga_promosi_coret_semi_grosir: '',
        },
      },
      search: this.props.route.params?.kataKunciProduk || '',
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
      loadingApi: true,
      loadingApi2: true,
      loadingApi3: true,
      loadingApi4: true,
      loadingApi5: true,
      loadingApi6: true,
      loadingApi7: true,
      loadingApi8: true,
      loadingApi9: true,
      loadingApi10: true,
      loadingApi11: true,
      loadingApi12: true,
      loadingApiLoad: true,
      modalVisible: false,
      rating: '1',
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
      loadingScroll: false,
      qtyTotalHerbalNew: 0,
      qtyTotalHerbalPopular: 0,
      qtyTotalHerbalRecentBuy: 0,
      qtyTotalHerbalAll: 0,
      qtyTotalMinyakNew: 0,
      qtyTotalMinyakPopular: 0,
      qtyTotalMinyakRecentBuy: 0,
      qtyTotalMinyakAll: 0,
      qtyTotalSupMulNew: 0,
      qtyTotalSupMulPopular: 0,
      qtyTotalSupMulRecentBuy: 0,
      qtyTotalSupMulAll: 0,
      qtyTotalFoodBevNew: 0,
      qtyTotalFoodBevPopular: 0,
      qtyTotalFoodBevRecentBuy: 0,
      qtyTotalFoodBevAll: 0,
      visible: false,
      visible2: false,
      visibleModalBlack: false,
    };
  }

  getMenu = () => {
    this.props.navigation.navigate('Profile');
  };

  //searching data
  getDataSearching = async (value = this.state.search, isNew = false) => {
    this._isMounted = true;
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
      console.log('SEARCHING');
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
      }
    }
  };

  handlerSearch = value => {
    this._isMounted = true;
    this._isMounted && this.setState({search: value});
    this.getDataSearching(value, true);
  };

  handleItemPress = item => {
    this.postRecent(item);
    this.props.subsAct(item, 'item');
    this.setState({search: ''});
    this.props.navigation.navigate('ProdukDeskripsi', {
      initial: false,
      keyWordProd: this.state.search,
    });
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
      async () => {
        this._isMounted && (await this.getDataSearching());
        this._isMounted && (await this.getDataLoadAll());
        this.setState({refreshing: false});
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
    this._isMounted = true;
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

  getDataLoadAll = async () => {
    this._isMounted = true;
    try {
      let response = await axios.get(`${CONFIG.BASE_URL}/api/product-all`, {
        headers: {Authorization: `Bearer ${this.props.token}`},
      });
      const data = response.data.data;
      if (
        this.props.route.params &&
        this.props.route.params.screen === 'DetailHerbal'
      ) {
        this._isMounted &&
          this.setState({
            herbalPopular: data.herbal_popular[0].data,
            herbalNewest: data.herbal_newest[0].data,
            herbalRecent: data.herbal_recent[0].data,
            herbalAll: data.herbal[0].data,
            qtyTotalHerbalNew: data.herbal_newest[0].total,
            qtyTotalHerbalPopular: data.herbal_popular[0].total,
            qtyTotalHerbalRecentBuy: data.herbal_recent[0].total,
            qtyTotalHerbalAll: data.herbal[0].total,
            loadingApi: false,
          });
      } else if (
        this.props.route.params &&
        this.props.route.params.screen === 'DetailSupMul'
      ) {
        this._isMounted &&
          this.setState({
            supmulPopular: data.supmul_popular[0].data,
            supmulNewest: data.supmul_newest[0].data,
            supmulRecent: data.supmul_recent[0].data,
            supmulAll: data.supmul[0].data,
            qtyTotalSupMulNew: data.supmul_newest[0].total,
            qtyTotalSupMulPopular: data.supmul_popular[0].total,
            qtyTotalSupMulRecentBuy: data.supmul_recent[0].total,
            qtyTotalSupMulAll: data.supmul[0].total,
            loadingApi: false,
          });
      } else if (
        this.props.route.params &&
        this.props.route.params.screen === 'DetailFoodBev'
      ) {
        this._isMounted &&
          this.setState({
            foodbevPopular: data.foodbeverage_popular[0].data,
            foodbevNewest: data.foodbeverage_newest[0].data,
            foodbevRecent: data.foodbeverage_recent[0].data,
            foodbevAll: data.foodbeverage[0].data,
            qtyTotalFoodBevNew: data.foodbeverage_newest[0].total,
            qtyTotalFoodBevPopular: data.foodbeverage_popular[0].total,
            qtyTotalFoodBevRecentBuy: data.foodbeverage_recent[0].total,
            qtyTotalFoodBevAll: data.foodbeverage[0].total,
            loadingApi: false,
          });
      } else if (
        this.props.route.params &&
        this.props.route.params.screen === 'DetailMinyak'
      ) {
        this._isMounted &&
          this.setState({
            minyakbalsemPopular: data.minyakbalsem_popular[0].data,
            minyakbalsemNewest: data.minyakbalsem_newest[0].data,
            minyakbalsemRecent: data.minyakbalsem_recent[0].data,
            minyakbalsemAll: data.minyakbalsem[0].data,
            qtyTotalMinyakNew: data.minyakbalsem_newest[0].total,
            qtyTotalMinyakPopular: data.minyakbalsem_popular[0].total,
            qtyTotalMinyakRecentBuy: data.minyakbalsem_recent[0].total,
            qtyTotalMinyakAll: data.minyakbalsem[0].total,
            loadingApi: false,
          });
      } else {
        console.log('masuk biasa');
        this._isMounted &&
          this.setState({
            herbalPopular: data.herbal_popular[0].data,
            herbalNewest: data.herbal_newest[0].data,
            herbalRecent: data.herbal_recent[0].data,
            herbalAll: data.herbal[0].data,
            supmulPopular: data.supmul_popular[0].data,
            supmulNewest: data.supmul_newest[0].data,
            supmulRecent: data.supmul_recent[0].data,
            supmulAll: data.supmul[0].data,
            qtyTotalHerbalNew: data.herbal_newest[0].total,
            qtyTotalHerbalPopular: data.herbal_popular[0].total,
            qtyTotalHerbalRecentBuy: data.herbal_recent[0].total,
            qtyTotalHerbalAll: data.herbal[0].total,
            qtyTotalSupMulNew: data.supmul_newest[0].total,
            qtyTotalSupMulPopular: data.supmul_popular[0].total,
            qtyTotalSupMulRecentBuy: data.supmul_recent[0].total,
            qtyTotalSupMulAll: data.supmul[0].total,
            // product_partner: data.product_partner[0].data,
            // qtyTotalproduct_partner: data.product_partner[0].total,
            loadingApi: false,
          });
      }
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
        'Cek Error==============Data Load All==========',
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

  componentDidMount = async () => {
    this._isMounted = true;
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.getNotifAll();
      this.getDataLoadAll();
      if (this.props.route.params?.kataKunciProduk !== undefined) {
        this.handlerSearch(this.props.route.params?.kataKunciProduk);
      }
    });
    this.getNotifAll();
    this.getDataLoadAll();
  };

  componentWillUnmount() {
    // rol();
    this._isMounted = false;
  }

  addProduk = async () => {
    console.log('tambah produk');
    try {
      let response = await axios.get(`${CONFIG.BASE_URL}/api/product-all`, {
        headers: {Authorization: `Bearer ${this.props.token}`},
      });
      const data = response.data.data;
      this._isMounted &&
        this.setState({
          foodbevPopular: data.foodbeverage_popular[0].data,
          foodbevNewest: data.foodbeverage_newest[0].data,
          foodbevRecent: data.foodbeverage_recent[0].data,
          foodbevAll: data.foodbeverage[0].data,
          minyakbalsemPopular: data.minyakbalsem_popular[0].data,
          minyakbalsemNewest: data.minyakbalsem_newest[0].data,
          minyakbalsemRecent: data.minyakbalsem_recent[0].data,
          minyakbalsemAll: data.minyakbalsem[0].data,
          qtyTotalFoodBevNew: data.foodbeverage_newest[0].total,
          qtyTotalFoodBevPopular: data.foodbeverage_popular[0].total,
          qtyTotalFoodBevRecentBuy: data.foodbeverage_recent[0].total,
          qtyTotalFoodBevAll: data.foodbeverage[0].total,
          qtyTotalMinyakNew: data.minyakbalsem_newest[0].total,
          qtyTotalMinyakPopular: data.foodbeverage_popular[0].total,
          qtyTotalMinyakRecentBuy: data.foodbeverage_recent[0].total,
          qtyTotalMinyakAll: data.minyakbalsem[0].total,
          loadingApi: false,
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
      }
    }
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
        this.showModal();
        this.getAnimation();
        this.getNotifAll();
      } else {
        this.setState({visibleModalBlack: true});
        console.log('Gagal memasukkan keranjang===>', data);
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

  showModal = () => {
    this._isMounted &&
      this.setState({
        modalVisible: true,
      });
  };

  removeParams() {
    this.setState({
      search: '',
    });
    this.props.navigation.setParams({kataKunciProduk: undefined});
  }

  isCloseToBottom({layoutMeasurement, contentOffset, contentSize}) {
    return (
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 400
    );
  }

  getAnimation = () => {
    Animated.timing(this.animation, {
      toValue: 5,
      useNativeDriver: true,
      duration: 1000,
    }).start(() => {
      this.animation = new Animated.Value(0);
    });
  };

  getCloseAlertModal() {
    this.setState({visibleModalBlack: false});
  }

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
        text: 'retry',
        textColor: 'white',
        onPress: () => {
          this.setState({
            loadingApi: true,
            loadingApi2: true,
            loadingApi9: true,
            loadingApi10: true,
            loadingApi3: true,
            loadingApi4: true,
          });
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
        text: 'retry',
        textColor: 'white',
        onPress: () => {
          this.setState({
            loadingApi: true,
            loadingApi2: true,
            loadingApi9: true,
            loadingApi10: true,
            loadingApi3: true,
            loadingApi4: true,
          });
        },
      },
    });
  };
  clickCard(item) {
    console.log('beli');
    this.postRecent(item),
      this.props.navigation.navigate(
        'ProdukDeskripsi',
        {initial: false},
        this.props.subsAct(item, 'item'),
      );
  }
  onClickAll(screen) {
    this.props.navigation.navigate('ProdukKategori', {
      initial: false,
      screen: screen,
    });
  }
  render() {
    const {
      qty,
      search,
      loadingApi,
      loadingApi2,
      loadingApi3,
      loadingApi4,
      loadingApi5,
      loadingApi6,
      loadingApi7,
      loadingApi8,
      loadingApi9,
      loadingApi10,
      loadingApi11,
      loadingApi12,
      refreshing,
      rating,
      qtyTotalHerbalNew,
      qtyTotalHerbalPopular,
      qtyTotalHerbalRecentBuy,
      qtyTotalHerbalAll,
      qtyTotalMinyakNew,
      qtyTotalMinyakPopular,
      qtyTotalMinyakRecentBuy,
      qtyTotalMinyakAll,
      qtyTotalSupMulNew,
      qtyTotalSupMulPopular,
      qtyTotalSupMulRecentBuy,
      qtyTotalSupMulAll,
      qtyTotalFoodBevNew,
      qtyTotalFoodBevPopular,
      qtyTotalFoodBevRecentBuy,
      qtyTotalFoodBevAll,
    } = this.state;
    const rotation = this.animation.interpolate({
      inputRange: [0, 1, 2, 3, 4, 5],
      outputRange: ['0deg', '-15deg', '15deg', '-15deg', '15deg', '0deg'],
    });
    return (
      <SafeAreaView style={styles.containerUtama}>
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
        <ScrollView
          onScroll={({nativeEvent}) => {
            if (
              this.isCloseToBottom(nativeEvent) &&
              this.state.loadingScroll == false
            ) {
              this.addProduk();
              this.setState({loadingScroll: true});
            }
          }}
          // scrollEventThrottle={400}
          contentContainerStyle={{
            paddingLeft: wp('5%'),
            paddingRight: wp('5%'),
            // paddingTop: wp('5%'),
            paddingBottom: wp('5%'),
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.handleRefresh}
              colors={['#529F45', '#FFFFFF']}
            />
          }
          showsVerticalScrollIndicator={false}
          style={styles.scrollUtama}>
          {this.state.search.length == 0 && (
            <View>
              {/* produk herbal semua */}
              {loadingApi ? (
                <LoadingApi />
              ) : (
                <>
                  {this.state.herbalAll.length > 0 && (
                    <View style={[styles.container, {height: hp('44%')}]}>
                      <View style={styles.columnTitle}>
                        {qtyTotalHerbalAll > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Herbal Semua'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Herbal Semua'}
                          </Text>
                        )}
                        {qtyTotalHerbalAll > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'Herbal',
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
                        ) : null}
                      </View>
                      <CardProduk
                        onClick={item => this.clickCard(item)}
                        data={this.state.herbalAll}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalHerbalAll}
                        onClickAll={() => this.onClickAll('Herbal')}
                      />
                    </View>
                  )}
                  {this.state.herbalPopular.length > 0 && (
                    <View style={[styles.container, {height: hp('44%')}]}>
                      <View style={styles.columnTitle}>
                        {qtyTotalHerbalPopular > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Herbal Terlaris'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Herbal Terlaris'}
                          </Text>
                        )}
                        {qtyTotalHerbalPopular > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'HerbalPopular',
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
                        ) : null}
                      </View>
                      <CardProduk
                        onClick={item => this.clickCard(item)}
                        data={this.state.herbalPopular}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalHerbalPopular}
                        onClickAll={() => this.onClickAll('HerbalPopular')}
                      />
                    </View>
                  )}

                  {this.state.herbalNewest.length > 0 && (
                    <View style={[styles.container, {height: hp('44%')}]}>
                      <View style={styles.columnTitle}>
                        {qtyTotalHerbalNew > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Herbal Terbaru'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Herbal Terbaru'}
                          </Text>
                        )}
                        {qtyTotalHerbalNew > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'HerbalNew',
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
                        ) : null}
                      </View>
                      <CardProduk
                        onClick={item => this.clickCard(item)}
                        data={this.state.herbalNewest}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalHerbalNew}
                        onClickAll={() => this.onClickAll('HerbalNew')}
                      />
                    </View>
                  )}

                  {this.state.herbalRecent.length > 0 && (
                    <View style={[styles.container, {height: hp('44%')}]}>
                      <View style={styles.columnTitle}>
                        {qtyTotalHerbalRecentBuy > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Herbal Terakhir Dipesan'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Herbal Terakhir Dipesan'}
                          </Text>
                        )}
                        {qtyTotalHerbalRecentBuy > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'HerbalRecent',
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
                        ) : null}
                      </View>
                      <CardProduk
                        onClick={item => this.clickCard(item)}
                        data={this.state.herbalRecent}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalHerbalRecentBuy}
                        onClickAll={() => this.onClickAll('HerbalRecent')}
                      />
                    </View>
                  )}
                  {this.state.supmulAll.length > 0 && (
                    <View style={[styles.container, {height: hp('44%')}]}>
                      <View style={styles.columnTitle}>
                        {qtyTotalSupMulAll > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Supplemen dan Multivitamin Semua'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Supplemen dan Multivitamin Semua'}
                          </Text>
                        )}
                        {qtyTotalSupMulAll > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'SupMul',
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
                        ) : null}
                      </View>
                      <CardProduk
                        onClick={item => this.clickCard(item)}
                        data={this.state.supmulAll}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalSupMulAll}
                        onClickAll={() => this.onClickAll('SupMul')}
                      />
                    </View>
                  )}
                  {this.state.supmulPopular.length > 0 && (
                    <View style={[styles.container, {height: hp('44%')}]}>
                      <View style={styles.columnTitle}>
                        {qtyTotalSupMulPopular > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Supplemen dan Multivitamin Terlaris'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Supplemen dan Multivitamin Terlaris'}
                          </Text>
                        )}
                        {qtyTotalSupMulPopular > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'SupMulPopuler',
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
                        ) : null}
                      </View>
                      <CardProduk
                        onClick={item => this.clickCard(item)}
                        data={this.state.supmulPopular}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalSupMulPopular}
                        onClickAll={() => this.onClickAll('SupMulPopuler')}
                      />
                    </View>
                  )}

                  {this.state.supmulNewest.length > 0 && (
                    <View style={[styles.container, {height: hp('44%')}]}>
                      <View style={styles.columnTitle}>
                        {qtyTotalSupMulNew > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Supplemen dan Multivitamin Terbaru'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Supplemen dan Multivitamin Terbaru'}
                          </Text>
                        )}
                        {qtyTotalSupMulNew > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'SupMulNew',
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
                        ) : null}
                      </View>
                      <CardProduk
                        onClick={item => this.clickCard(item)}
                        data={this.state.supmulNewest}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalSupMulNew}
                        onClickAll={() => this.onClickAll('SupMulNew')}
                      />
                    </View>
                  )}

                  {this.state.supmulRecent.length > 0 && (
                    <View
                      style={[
                        styles.container,
                        this.state.foodbevAll.length > 0
                          ? {height: hp('44%')}
                          : {height: hp('50%'), marginBottom: hp('10%')},
                      ]}>
                      <View style={styles.columnTitle}>
                        {qtyTotalSupMulRecentBuy > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {
                              'Produk Supplemen dan Multivitamin Terakhir Dipesan'
                            }
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {
                              'Produk Supplemen dan Multivitamin Terakhir Dipesan'
                            }
                          </Text>
                        )}
                        {qtyTotalSupMulRecentBuy > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'SupMulRecent',
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
                        ) : null}
                      </View>
                      <View style={{height: hp('44%')}}>
                        <CardProduk
                          onClick={item => this.clickCard(item)}
                          data={this.state.supmulRecent}
                          postShoppingCart={item => this.postShoppingCart(item)}
                          qtyTotal={qtyTotalSupMulRecentBuy}
                          onClickAll={() => this.onClickAll('SupMulRecent')}
                        />
                      </View>
                      {this.state.foodbevAll.length < 1 ? (
                        <View
                          style={{
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            paddingBottom: hp('2%'),
                          }}>
                          <LoadingApiLoad />
                        </View>
                      ) : null}
                    </View>
                  )}

                  {this.state.foodbevAll.length > 0 && (
                    <View style={[styles.container, {height: hp('44%')}]}>
                      <View style={styles.columnTitle}>
                        {qtyTotalFoodBevAll > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Makanan dan Minuman Semua'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Makanan dan Minuman Semua'}
                          </Text>
                        )}
                        {qtyTotalFoodBevAll > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'FoodBev',
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
                        ) : null}
                      </View>
                      <CardProduk
                        onClick={item => this.clickCard(item)}
                        data={this.state.foodbevAll}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalFoodBevAll}
                        onClickAll={() => this.onClickAll('FoodBev')}
                      />
                    </View>
                  )}

                  {this.state.foodbevPopular.length > 0 && (
                    <View style={[styles.container, {height: hp('44%')}]}>
                      <View style={styles.columnTitle}>
                        {qtyTotalFoodBevPopular > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Makanan dan Minuman Terlaris'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Makanan dan Minuman Terlaris'}
                          </Text>
                        )}
                        {qtyTotalFoodBevPopular > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'FoodBevPopular',
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
                        ) : null}
                      </View>
                      <CardProduk
                        onClick={item => this.clickCard(item)}
                        data={this.state.foodbevPopular}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalFoodBevPopular}
                        onClickAll={() => this.onClickAll('FoodBevPopular')}
                      />
                    </View>
                  )}

                  {this.state.foodbevNewest.length > 0 && (
                    <View style={[styles.container, {height: hp('44%')}]}>
                      <View style={styles.columnTitle}>
                        {qtyTotalFoodBevNew > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Makanan dan Minuman Terbaru'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Makanan dan Minuman Terbaru'}
                          </Text>
                        )}
                        {qtyTotalFoodBevNew > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'FoodBevNew',
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
                        ) : null}
                      </View>
                      <CardProduk
                        onClick={item => this.clickCard(item)}
                        data={this.state.foodbevNewest}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalFoodBevNew}
                        onClickAll={() => this.onClickAll('FoodBevNew')}
                      />
                    </View>
                  )}

                  {this.state.foodbevRecent.length > 0 && (
                    <View style={[styles.container]}>
                      <View style={styles.columnTitle}>
                        {qtyTotalFoodBevRecentBuy > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Makanan dan Minuman Terakhir Dipesan'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Makanan dan Minuman Terakhir Dipesan'}
                          </Text>
                        )}
                        {qtyTotalFoodBevRecentBuy > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'FoodBevRecent',
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
                        ) : null}
                      </View>
                      <CardProduk
                        onClick={item => this.clickCard(item)}
                        data={this.state.foodbevRecent}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalFoodBevRecentBuy}
                        onClickAll={() => this.onClickAll('FoodBevRecent')}
                      />
                    </View>
                  )}

                  {this.state.minyakbalsemAll.length > 0 && (
                    <View style={[styles.container, {height: hp('44%')}]}>
                      <View style={styles.columnTitle}>
                        {qtyTotalMinyakAll > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Minyak Angin dan Balsem Semua'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Minyak Angin dan Balsem Semua'}
                          </Text>
                        )}
                        {qtyTotalMinyakAll > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'Minyak',
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
                        ) : null}
                      </View>
                      <CardProduk
                        onClick={item => this.clickCard(item)}
                        data={this.state.minyakbalsemAll}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalMinyakAll}
                        onClickAll={() => this.onClickAll('Minyak')}
                      />
                    </View>
                  )}

                  {this.state.minyakbalsemPopular.length > 0 && (
                    <View style={[styles.container, {height: hp('44%')}]}>
                      <View style={styles.columnTitle}>
                        {qtyTotalMinyakPopular > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Minyak Angin dan Balsem Terlaris'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Minyak Angin dan Balsem Terlaris'}
                          </Text>
                        )}
                        {qtyTotalMinyakPopular > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'MinyakPopular',
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
                        ) : null}
                      </View>
                      <CardProduk
                        onClick={item => this.clickCard(item)}
                        data={this.state.minyakbalsemPopular}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalMinyakPopular}
                        onClickAll={() => this.onClickAll('MinyakPopular')}
                      />
                    </View>
                  )}

                  {this.state.minyakbalsemNewest.length > 0 && (
                    <View
                      style={
                        this.state.minyakbalsemRecent.length > 0
                          ? [styles.container,{height: hp('44%')}]
                          : [styles.container, {marginBottom: 0, elevation: 0,height: hp('44%')}]
                      }>
                      <View style={styles.columnTitle}>
                        {qtyTotalMinyakNew > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Minyak Angin dan Balsem Terbaru'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Minyak Angin dan Balsem Terbaru'}
                          </Text>
                        )}
                        {qtyTotalMinyakNew > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'MinyakNew',
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
                        ) : null}
                      </View>
                      <CardProduk
                        onClick={item => this.clickCard(item)}
                        data={this.state.minyakbalsemNewest}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalMinyakNew}
                        onClickAll={() => this.onClickAll('MinyakNew')}
                      />
                    </View>
                  )}
                  {this.state.minyakbalsemRecent.length > 0 && (
                    <View
                      style={[
                        styles.container,
                        {
                          marginBottom: hp('9%'),
                          elevation: 0,
                          height: hp('44%'),
                        },
                      ]}>
                      <View style={styles.columnTitle}>
                        {qtyTotalMinyakRecentBuy > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Minyak Angin dan Balsem Terakhir Dipesan'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Minyak Angin dan Balsem Terakhir Dipesan'}
                          </Text>
                        )}
                        {qtyTotalMinyakRecentBuy > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'MinyakRecent',
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
                        ) : null}
                      </View>
                      <CardProduk
                        onClick={item => this.clickCard(item)}
                        data={this.state.minyakbalsemRecent}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalMinyakRecentBuy}
                        onClickAll={() => this.onClickAll('MinyakRecent')}
                      />
                    </View>
                  )}
                </>
              )}
            </View>
          )}

          <ModalBlackList
            modalVisible={this.state.visibleModalBlack}
            getCloseAlertModal={() => this.getCloseAlertModal()}
          />
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() =>
              this.setState(
                {modalVisible: !this.state.modalVisible, page: 1},
                () => {
                  this.getDataLoadAll();
                  this.getNotifAll();
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
                        {modalVisible: !this.state.modalVisible, page: 1},
                        () => {
                          this.getDataLoadAll();
                          this.getNotifAll();
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
                        {modalVisible: !this.state.modalVisible, page: 1},
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
        </ScrollView>
        <BottomNavigation
          navigation={this.props.navigation}
          nameRoute="Produk"
        />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
  qty: state.ShoppingCartReducer.qty,
  dataUser: state.LoginReducer.dataUser,
});

const mapDispatchToProps = dispatch => {
  return {
    subsAct: (value, tipe) => {
      dispatch(SubsAction(value, tipe));
    },
    shopAct: (value, tipe) => {
      dispatch(ShoppingCartAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Produk);

const styles = StyleSheet.create({
  container2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: hp('8%'),
    backgroundColor: 'white',
    borderBottomWidth: 4,
    borderColor: '#ddd',
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
  scrollUtama: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    // backgroundColor: '#F8F8F8',
  },
  containerUtama: {
    flex: 1,
    height: hp('100%'),
    width: wp('100%'),
    backgroundColor: '#F4F4F4',
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
  container: {
    // height: hp('45%'),
    // backgroundColor: '#f4f4f4',
    backgroundColor: '#F4F4F4',
    elevation: 5,
    marginHorizontal: wp('-5%'),
    marginBottom: wp('1%'),
  },
  scroll: {
    width,
    height,
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
    color: '#575251',
    paddingLeft: wp('5%'),
  },
  buttonNext: {
    margin: 20,
    height: wp('60.8%'),
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
    marginTop: hp('2%'),
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

  offlineContainer: {
    flex: 1,
    backgroundColor: '#000',
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
    // fontSize: hp(2),
  },
  loadingApi: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    width: wp('100%'),
    marginBottom: hp('25%'),
    marginTop: hp('30%'),
    // height: hp('100%'),
    // position: 'absolute',
    // top:hp('-50%')
  },
  loadingApiLoad: {
    flex: 1,
    justifyContent: 'flex-end',
    alignSelf: 'center',
    width: wp('100%'),
    // height: hp('100%'),
    // position: 'absolute',
    // top:hp('-50%')
  },
});
