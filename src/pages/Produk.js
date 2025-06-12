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
    //console.log('route navigation===', this.props.route.params);
    this.state = {
      masukAnginPopular: [],
      masukAnginNewest: [],
      masukAnginRecent: [],
      masukAnginAll: [],
      obatBatukPopular: [],
      obatBatukNewest: [],
      obatBatukRecent: [],
      obatBatukAll: [],
      sariawanPanasDalamPopular: [],
      sariawanPanasDalamNewest: [],
      sariawanPanasDalamRecent: [],
      sariawanPanasDalamAll: [],
      pegalLinuStaminaPopular: [],
      pegalLinuStaminaNewest: [],
      pegalLinuStaminaRecent: [],
      pegalLinuStaminaAll: [],
      produkWanitaPopular: [],
      produkWanitaNewest: [],
      produkWanitaRecent: [],
      produkWanitaAll: [],
      permenPopular: [],
      permenNewest: [],
      permenRecent: [],
      permenAll: [],
      herbaMojoPopular: [],
      herbaMojoNewest: [],
      herbaMojoRecent: [],
      herbaMojoAll: [],
      herbanaPopular: [],
      herbanaNewest: [],
      herbanaRecent: [],
      herbanaAll: [],
      maduPopular: [],
      maduNewest: [],
      maduRecent: [],
      maduAll: [],
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
      qtyTotalmasukAnginNewest: 0,
      qtyTotalmasukAnginPopular: 0,
      qtyTotalmasukAnginRecentBuy: 0,
      qtyTotalmasukAnginAll: 0,
      qtyTotalpegalLinuStaminaNewest: 0,
      qtyTotalpegalLinuStaminaPopular: 0,
      qtyTotalpegalLinuStaminaRecent: 0,
      qtyTotalpegalLinuStaminaAll: 0,
      qtyTotalobatBatukNewest: 0,
      qtyTotalobatBatukPopular: 0,
      qtyTotalobatBatukRecent: 0,
      qtyTotalobatBatukAll: 0,
      qtyTotalsariawanPanasDalamNewest: 0,
      qtyTotalsariawanPanasDalamPopular: 0,
      qtyTotalsariawanPanasDalamRecent: 0,
      qtyTotalsariawanPanasDalamAll: 0,
      qtyTotalprodukWanitaNewest: 0,
      qtyTotalprodukWanitaPopular: 0,
      qtyTotalprodukWanitaRecent: 0,
      qtyTotalprodukWanitaAll: 0,
      qtyTotalpermenNewest: 0,
      qtyTotalpermenPopular: 0,
      qtyTotalpermenRecent: 0,
      qtyTotalpermenAll: 0,
      qtyTotalherbaMojoNewest: 0,
      qtyTotalherbaMojoPopular: 0,
      qtyTotalherbaMojoRecent: 0,
      qtyTotalherbaMojoAll: 0,
      qtyTotalherbanaNewest: 0,
      qtyTotalherbanaPopular: 0,
      qtyTotalherbanaRecent: 0,
      qtyTotalherbanaAll: 0,
      qtyTotalmaduNewest: 0,
      qtyTotalmaduPopular: 0,
      qtyTotalmaduRecent: 0,
      qtyTotalmaduAll: 0,
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
        this.props.route.params.screen === 'masukAngin'
      ) {
        this._isMounted &&
          this.setState({
            masukAnginPopular: data.masukAnginPopular[0].data,
            masukAnginNewest: data.masukAnginNewest[0].data,
            masukAnginRecent: data.masukAnginRecent[0].data,
            masukAnginAll: data.masukAngin[0].data,
            qtyTotalmasukAnginNewest: data.masukAnginNewest[0].total,
            qtyTotalmasukAnginPopular: data.masukAnginPopular[0].total,
            qtyTotalmasukAnginRecentBuy: data.masukAnginRecent[0].total,
            qtyTotalmasukAnginAll: data.masukAngin[0].total,
            loadingApi: false,
          });
      } else if (
        this.props.route.params &&
        this.props.route.params.screen === 'obatBatuk'
      ) {
        this._isMounted &&
          this.setState({
            obatBatukPopular: data.obatBatukPopular[0].data,
            obatBatukNewest: data.obatBatukNewest[0].data,
            obatBatukRecent: data.obatBatukRecent[0].data,
            obatBatukAll: data.obatBatuk[0].data,
            qtyTotalobatBatukNewest: data.obatBatukNewest[0].total,
            qtyTotalobatBatukPopular: data.obatBatukPopular[0].total,
            qtyTotalobatBatukRecent: data.obatBatukRecent[0].total,
            qtyTotalobatBatukAll: data.obatBatuk[0].total,
            loadingApi: false,
          });
      } else if (
        this.props.route.params &&
        this.props.route.params.screen === 'sariawanPanasDalam'
      ) {
        this._isMounted &&
          this.setState({
            sariawanPanasDalamPopular: data.sariawanPanasDalamPopular[0].data,
            sariawanPanasDalamNewest: data.sariawanPanasDalamNewest[0].data,
            sariawanPanasDalamRecent: data.sariawanPanasDalamRecent[0].data,
            sariawanPanasDalamAll: data.sariawanPanasDalam[0].data,
            qtyTotalsariawanPanasDalamNewest: data.sariawanPanasDalamNewest[0].total,
            qtyTotalsariawanPanasDalamPopular: data.sariawanPanasDalamPopular[0].total,
            qtyTotalsariawanPanasDalamRecent: data.sariawanPanasDalamRecent[0].total,
            qtyTotalsariawanPanasDalamAll: data.sariawanPanasDalam[0].total,
            loadingApi: false,
          });
      } else if (
        this.props.route.params &&
        this.props.route.params.screen === 'pegalLinuStamina'
      ) {
        this._isMounted &&
          this.setState({
            pegalLinuStaminaPopular: data.pegalLinuStaminaPopular[0].data,
            pegalLinuStaminaNewest: data.pegalLinuStaminaNewest[0].data,
            pegalLinuStaminaRecent: data.pegalLinuStaminaRecent[0].data,
            pegalLinuStaminaAll: data.pegalLinuStamina[0].data,
            qtyTotalpegalLinuStaminaNewest: data.pegalLinuStaminaNewest[0].total,
            qtyTotalpegalLinuStaminaPopular: data.pegalLinuStaminaPopular[0].total,
            qtyTotalpegalLinuStaminaRecent: data.pegalLinuStaminaRecent[0].total,
            qtyTotalpegalLinuStaminaAll: data.pegalLinuStamina[0].total,
            loadingApi: false,
          });
      } else if (
        this.props.route.params &&
        this.props.route.params.screen === 'produkWanita'
      ) {
        this._isMounted &&
          this.setState({
            produkWanitaPopular: data.produkWanitaPopular[0].data,
            produkWanitaNewest: data.produkWanitaNewest[0].data,
            produkWanitaRecent: data.produkWanitaRecent[0].data,
            produkWanitaAll: data.produkWanita[0].data,
            qtyTotalprodukWanitaNewest: data.produkWanitaNewest[0].total,
            qtyTotalprodukWanitaPopular: data.produkWanitaPopular[0].total,
            qtyTotalprodukWanitaRecent: data.produkWanitaRecent[0].total,
            qtyTotalprodukWanitaAll: data.produkWanita[0].total,
            loadingApi: false,
          });
      } else if (
        this.props.route.params &&
        this.props.route.params.screen === 'permen'
      ) {
        this._isMounted &&
          this.setState({
            permenPopular: data.permenPopular[0].data,
            permenNewest: data.permenNewest[0].data,
            permenRecent: data.permenRecent[0].data,
            permenAll: data.permen[0].data,
            qtyTotalpermenNewest: data.permenNewest[0].total,
            qtyTotalpermenPopular: data.permenPopular[0].total,
            qtyTotalpermenRecent: data.permenRecent[0].total,
            qtyTotalpermenAll: data.permen[0].total,
            loadingApi: false,
          });
      } else if (
        this.props.route.params &&
        this.props.route.params.screen === 'herbaMojo'
      ) {
        this._isMounted &&
          this.setState({
            herbaMojoPopular: data.herbaMojoPopular[0].data,
            herbaMojoNewest: data.herbaMojoNewest[0].data,
            herbaMojoRecent: data.herbaMojoRecent[0].data,
            herbaMojoAll: data.herbaMojo[0].data,
            qtyTotalherbaMojoNewest: data.herbaMojoNewest[0].total,
            qtyTotalherbaMojoPopular: data.herbaMojoPopular[0].total,
            qtyTotalherbaMojoRecent: data.herbaMojoRecent[0].total,
            qtyTotalherbaMojoAll: data.herbaMojo[0].total,
            loadingApi: false,
          });
      } else if (
        this.props.route.params &&
        this.props.route.params.screen === 'herbana'
      ) {
        this._isMounted &&
          this.setState({
            herbanaPopular: data.herbanaPopular[0].data,
            herbanaNewest: data.herbanaNewest[0].data,
            herbanaRecent: data.herbanaRecent[0].data,
            herbanaAll: data.herbana[0].data,
            qtyTotalherbanaNewest: data.herbanaNewest[0].total,
            qtyTotalherbanaPopular: data.herbanaPopular[0].total,
            qtyTotalherbanaRecent: data.herbanaRecent[0].total,
            qtyTotalherbanaAll: data.herbana[0].total,
            loadingApi: false,
          });
      } else if (
        this.props.route.params &&
        this.props.route.params.screen === 'madu'
      ) {
        this._isMounted &&
          this.setState({
            maduPopular: data.maduPopular[0].data,
            maduNewest: data.maduNewest[0].data,
            maduRecent: data.maduRecent[0].data,
            maduAll: data.madu[0].data,
            qtyTotalmaduNewest: data.maduNewest[0].total,
            qtyTotalmaduPopular: data.maduPopular[0].total,
            qtyTotalmaduRecent: data.maduRecent[0].total,
            qtyTotalmaduAll: data.madu[0].total,
            loadingApi: false,
          });
      } else {
        console.log('masuk biasa');
        this._isMounted &&
          this.setState({
            masukAnginPopular: data.masukAnginPopular[0].data,
            masukAnginNewest: data.masukAnginNewest[0].data,
            masukAnginRecent: data.masukAnginRecent[0].data,
            masukAnginAll: data.masukAngin[0].data,
            obatBatukPopular: data.obatBatukPopular[0].data,
            obatBatukNewest: data.obatBatukNewest[0].data,
            obatBatukRecent: data.obatBatukRecent[0].data,
            obatBatukAll: data.obatBatuk[0].data,
            qtyTotalmasukAnginNewest: data.masukAnginNewest[0].total,
            qtyTotalmasukAnginPopular: data.masukAnginPopular[0].total,
            qtyTotalmasukAnginRecentBuy: data.masukAnginRecent[0].total,
            qtyTotalmasukAnginAll: data.masukAngin[0].total,
            qtyTotalobatBatukNewest: data.obatBatukNewest[0].total,
            qtyTotalobatBatukPopular: data.obatBatukPopular[0].total,
            qtyTotalobatBatukRecent: data.obatBatukRecent[0].total,
            qtyTotalobatBatukAll: data.obatBatuk[0].total,
            produkWanitaPopular: data.produkWanitaPopular[0].data,
            produkWanitaNewest: data.produkWanitaNewest[0].data,
            produkWanitaRecent: data.produkWanitaRecent[0].data,
            produkWanitaAll: data.produkWanita[0].data,
            permenPopular: data.permenPopular[0].data,
            permenNewest: data.permenNewest[0].data,
            permenRecent: data.permenRecent[0].data,
            permenAll: data.permen[0].data,
            herbaMojoPopular: data.herbaMojoPopular[0].data,
            herbaMojoNewest: data.herbaMojoNewest[0].data,
            herbaMojoRecent: data.herbaMojoRecent[0].data,
            herbaMojoAll: data.herbaMojo[0].data,
            herbanaPopular: data.herbanaPopular[0].data,
            herbanaNewest: data.herbanaNewest[0].data,
            herbanaRecent: data.herbanaRecent[0].data,
            herbanaAll: data.herbana[0].data,
            maduPopular: data.maduPopular[0].data,
            maduNewest: data.maduNewest[0].data,
            maduRecent: data.maduRecent[0].data,
            maduAll: data.madu[0].data,
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
          sariawanPanasDalamPopular: data.sariawanPanasDalamPopular[0].data,
          sariawanPanasDalamNewest: data.sariawanPanasDalamNewest[0].data,
          sariawanPanasDalamRecent: data.sariawanPanasDalamRecent[0].data,
          sariawanPanasDalamAll: data.sariawanPanasDalamAll[0].data,
          pegalLinuStaminaPopular: data.pegalLinuStaminaPopular[0].data,
          pegalLinuStaminaNewest: data.pegalLinuStaminaNewest[0].data,
          pegalLinuStaminaRecent: data.pegalLinuStaminaRecent[0].data,
          pegalLinuStaminaAll: data.pegalLinuStaminaAll[0].data,
          qtyTotalsariawanPanasDalamNewest: data.qtyTotalsariawanPanasDalamNewest[0].total,
          qtyTotalsariawanPanasDalamPopular: data.qtyTotalsariawanPanasDalamPopular[0].total,
          qtyTotalsariawanPanasDalamRecent: data.qtyTotalsariawanPanasDalamRecent[0].total,
          qtyTotalsariawanPanasDalamAll: data.qtyTotalsariawanPanasDalamAll[0].total,
          qtyTotalpegalLinuStaminaNewest: data.qtyTotalpegalLinuStaminaNewest[0].total,
          qtyTotalpegalLinuStaminaPopular: data.qtyTotalpegalLinuStaminaPopular[0].total,
          qtyTotalpegalLinuStaminaRecent: data.qtyTotalpegalLinuStaminaRecent[0].total,
          qtyTotalpegalLinuStaminaAll: data.qtyTotalpegalLinuStaminaAll[0].total,
          produkWanitaPopular: data.produkWanitaPopular[0].data,
          produkWanitaNewest: data.produkWanitaNewest[0].data,
          produkWanitaRecent: data.produkWanitaRecent[0].data,
          produkWanitaAll: data.produkWanitaAll[0].data,
          permenPopular: data.permenPopular[0].data,
          permenNewest: data.permenNewest[0].data,
          permenRecent: data.permenRecent[0].data,
          permenAll: data.permenAll[0].data,
          herbaMojoPopular: data.herbaMojoPopular[0].data,
          herbaMojoNewest: data.herbaMojoNewest[0].data,
          herbaMojoRecent: data.herbaMojoRecent[0].data,
          herbaMojoAll: data.herbaMojoAll[0].data,
          herbanaPopular: data.herbanaPopular[0].data,
          herbanaNewest: data.herbanaNewest[0].data,
          herbanaRecent: data.herbanaRecent[0].data,
          herbanaAll: data.herbanaAll[0].data,
          maduPopular: data.maduPopular[0].data,
          maduNewest: data.maduNewest[0].data,
          maduRecent: data.maduRecent[0].data,
          maduAll: data.maduAll[0].data,
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
      refreshing,
      qtyTotalmasukAnginNewest,
      qtyTotalmasukAnginPopular,
      qtyTotalmasukAnginRecentBuy,
      qtyTotalmasukAnginAll,
      qtyTotalpegalLinuStaminaNewest,
      qtyTotalpegalLinuStaminaPopular,
      qtyTotalpegalLinuStaminaRecent,
      qtyTotalpegalLinuStaminaAll,
      qtyTotalobatBatukNewest,
      qtyTotalobatBatukPopular,
      qtyTotalobatBatukRecent,
      qtyTotalobatBatukAll,
      qtyTotalsariawanPanasDalamNewest,
      qtyTotalsariawanPanasDalamPopular,
      qtyTotalsariawanPanasDalamRecent,
      qtyTotalsariawanPanasDalamAll,
      qtyTotalprodukWanitaNewest,
      qtyTotalprodukWanitaPopular,
      qtyTotalprodukWanitaRecent,
      qtyTotalprodukWanitaAll,
      qtyTotalpermenNewest,
      qtyTotalpermenPopular,
      qtyTotalpermenRecent,
      qtyTotalpermenAll,
      qtyTotalherbaMojoNewest,
      qtyTotalherbaMojoPopular,
      qtyTotalherbaMojoRecent,
      qtyTotalherbaMojoAll,
      qtyTotalherbanaNewest,
      qtyTotalherbanaPopular,
      qtyTotalherbanaRecent,
      qtyTotalherbanaAll,
      qtyTotalmaduNewest,
      qtyTotalmaduPopular,
      qtyTotalmaduRecent,
      qtyTotalmaduAll,
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
            paddingBottom: wp('15%'),
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
              {/* produk masuk angin semua */}
              {loadingApi ? (
                <LoadingApi />
              ) : (
                <>
                  {this.state.masukAnginAll.length > 0 && (
                    <View style={[styles.container, {height: hp('44%')}]}>
                      <View style={styles.columnTitle}>
                        {qtyTotalmasukAnginAll > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Masuk Angin Semua'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Masuk Angin Semua'}
                          </Text>
                        )}
                        {qtyTotalmasukAnginAll > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'masukAngin',
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
                        data={this.state.masukAnginAll}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalmasukAnginAll}
                        onClickAll={() => this.onClickAll('masukAngin')}
                      />
                    </View>
                  )}
                  {this.state.masukAnginPopular.length > 0 && (
                    <View style={[styles.container, {height: hp('44%')}]}>
                      <View style={styles.columnTitle}>
                        {qtyTotalmasukAnginPopular > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Masuk Angin Terlaris'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Masuk Angin Terlaris'}
                          </Text>
                        )}
                        {qtyTotalmasukAnginPopular > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'masukAnginPopular',
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
                        data={this.state.masukAnginPopular}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalmasukAnginPopular}
                        onClickAll={() => this.onClickAll('masukAnginPopular')}
                      />
                    </View>
                  )}

                  {this.state.masukAnginNewest.length > 0 && (
                    <View style={[styles.container, {height: hp('44%')}]}>
                      <View style={styles.columnTitle}>
                        {qtyTotalmasukAnginNewest > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Masuk Angin Terbaru'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Masuk Angin Terbaru'}
                          </Text>
                        )}
                        {qtyTotalmasukAnginNewest > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'masukAnginNewest',
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
                        data={this.state.masukAnginNewest}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalmasukAnginNewest}
                        onClickAll={() => this.onClickAll('masukAnginNewest')}
                      />
                    </View>
                  )}

                  {this.state.masukAnginRecent.length > 0 && (
                    <View style={[styles.container, {height: hp('44%')}]}>
                      <View style={styles.columnTitle}>
                        {qtyTotalmasukAnginRecentBuy > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Masuk Angin Terakhir Dipesan'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Masuk Angin Terakhir Dipesan'}
                          </Text>
                        )}
                        {qtyTotalmasukAnginRecentBuy > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'masukAnginRecent',
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
                        data={this.state.masukAnginRecent}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalmasukAnginRecentBuy}
                        onClickAll={() => this.onClickAll('masukAnginRecent')}
                      />
                    </View>
                  )}
                  {this.state.obatBatukAll.length > 0 && (
                    <View style={[styles.container, {height: hp('44%')}]}>
                      <View style={styles.columnTitle}>
                        {qtyTotalobatBatukAll > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Obat Batuk Semua'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Obat Batuk Semua'}
                          </Text>
                        )}
                        {qtyTotalobatBatukAll > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'obatBatuk',
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
                        data={this.state.obatBatukAll}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalobatBatukAll}
                        onClickAll={() => this.onClickAll('obatBatuk')}
                      />
                    </View>
                  )}
                  {this.state.obatBatukPopular.length > 0 && (
                    <View style={[styles.container, {height: hp('44%')}]}>
                      <View style={styles.columnTitle}>
                        {qtyTotalobatBatukPopular > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Obat Batuk Terlaris'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Obat Batuk Terlaris'}
                          </Text>
                        )}
                        {qtyTotalobatBatukPopular > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'obatBatukPopuler',
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
                        data={this.state.obatBatukPopular}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalobatBatukPopular}
                        onClickAll={() => this.onClickAll('obatBatukPopuler')}
                      />
                    </View>
                  )}

                  {this.state.obatBatukNewest.length > 0 && (
                    <View style={[styles.container, {height: hp('44%')}]}>
                      <View style={styles.columnTitle}>
                        {qtyTotalobatBatukNewest > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Obat Batuk Terbaru'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Obat Batuk Terbaru'}
                          </Text>
                        )}
                        {qtyTotalobatBatukNewest > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'obatBatukNewest',
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
                        data={this.state.obatBatukNewest}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalobatBatukNewest}
                        onClickAll={() => this.onClickAll('obatBatukNewest')}
                      />
                    </View>
                  )}

                  {this.state.obatBatukRecent.length > 0 && (
                    <View
                      style={[
                        styles.container,
                        this.state.sariawanPanasDalamAll.length > 0
                          ? {height: hp('44%')}
                          : {height: hp('50%'), marginBottom: hp('10%')},
                      ]}>
                      <View style={styles.columnTitle}>
                        {qtyTotalobatBatukRecent > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {
                              'Produk Obat Batuk Terakhir Dipesan'
                            }
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {
                              'Produk Obat Batuk Terakhir Dipesan'
                            }
                          </Text>
                        )}
                        {qtyTotalobatBatukRecent > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'obatBatukRecent',
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
                          data={this.state.obatBatukRecent}
                          postShoppingCart={item => this.postShoppingCart(item)}
                          qtyTotal={qtyTotalobatBatukRecent}
                          onClickAll={() => this.onClickAll('obatBatukRecent')}
                        />
                      </View>
                      {this.state.sariawanPanasDalamAll.length < 1 ? (
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

                  {this.state.sariawanPanasDalamAll.length > 0 && (
                    <View style={[styles.container, {height: hp('44%')}]}>
                      <View style={styles.columnTitle}>
                        {qtyTotalsariawanPanasDalamAll > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Sariawan dan Panas Dalam Semua'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Sariawan dan Panas Dalam Semua'}
                          </Text>
                        )}
                        {qtyTotalsariawanPanasDalamAll > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'sariwanPanasDalam',
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
                        data={this.state.sariawanPanasDalamAll}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalsariawanPanasDalamAll}
                        onClickAll={() => this.onClickAll('sariwanPanasDalam')}
                      />
                    </View>
                  )}

                  {this.state.sariawanPanasDalamPopular.length > 0 && (
                    <View style={[styles.container, {height: hp('44%')}]}>
                      <View style={styles.columnTitle}>
                        {qtyTotalsariawanPanasDalamPopular > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Sariawan dan Panas Dalam Terlaris'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Sariawan dan Panas Dalam Terlaris'}
                          </Text>
                        )}
                        {qtyTotalsariawanPanasDalamPopular > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'sariawanPanasDalamPopular',
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
                        data={this.state.sariawanPanasDalamPopular}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalsariawanPanasDalamPopular}
                        onClickAll={() => this.onClickAll('sariawanPanasDalamPopular')}
                      />
                    </View>
                  )}

                  {this.state.sariawanPanasDalamNewest.length > 0 && (
                    <View style={[styles.container, {height: hp('44%')}]}>
                      <View style={styles.columnTitle}>
                        {qtyTotalsariawanPanasDalamNewest > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Sariawan dan Panas Dalam Terbaru'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Sariawan dan Panas Dalam Terbaru'}
                          </Text>
                        )}
                        {qtyTotalsariawanPanasDalamNewest > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'sariawanPanasDalamNewest',
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
                        data={this.state.sariawanPanasDalamNewest}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalsariawanPanasDalamNewest}
                        onClickAll={() => this.onClickAll('sariawanPanasDalamNewest')}
                      />
                    </View>
                  )}

                  {this.state.sariawanPanasDalamRecent.length > 0 && (
                    <View style={[styles.container]}>
                      <View style={styles.columnTitle}>
                        {qtyTotalsariawanPanasDalamRecent > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Sariawan dan Panas Dalam Terakhir Dipesan'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Sariawan dan Panas Dalam Terakhir Dipesan'}
                          </Text>
                        )}
                        {qtyTotalsariawanPanasDalamRecent > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'sariawanPanasDalamRecent',
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
                        data={this.state.sariawanPanasDalamRecent}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalsariawanPanasDalamRecent}
                        onClickAll={() => this.onClickAll('sariawanPanasDalamRecent')}
                      />
                    </View>
                  )}

                  {this.state.pegalLinuStaminaAll.length > 0 && (
                    <View style={[styles.container, {height: hp('44%')}]}>
                      <View style={styles.columnTitle}>
                        {qtyTotalpegalLinuStaminaAll > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Pegal Linu dan Stamina Semua'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Pegal Linu dan Stamina Semua'}
                          </Text>
                        )}
                        {qtyTotalpegalLinuStaminaAll > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'pegalLinuStamina',
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
                        data={this.state.pegalLinuStaminaAll}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalpegalLinuStaminaAll}
                        onClickAll={() => this.onClickAll('pegalLinuStamina')}
                      />
                    </View>
                  )}

                  {this.state.pegalLinuStaminaPopular.length > 0 && (
                    <View style={[styles.container, {height: hp('44%')}]}>
                      <View style={styles.columnTitle}>
                        {qtyTotalpegalLinuStaminaPopular > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Pegal Linu dan Stamina Terlaris'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Pegal Linu dan Stamina Terlaris'}
                          </Text>
                        )}
                        {qtyTotalpegalLinuStaminaPopular > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'pegalLinuStaminaPopular',
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
                        data={this.state.pegalLinuStaminaPopular}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalpegalLinuStaminaPopular}
                        onClickAll={() => this.onClickAll('pegalLinuStaminaPopular')}
                      />
                    </View>
                  )}

                  {this.state.pegalLinuStaminaNewest.length > 0 && (
                    <View
                      style={
                        this.state.pegalLinuStaminaRecent.length > 0
                          ? [styles.container,{height: hp('44%')}]
                          : [styles.container, {marginBottom: 0, elevation: 0,height: hp('44%')}]
                      }>
                      <View style={styles.columnTitle}>
                        {qtyTotalpegalLinuStaminaNewest > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Pegal Linu dan Stamina Terbaru'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Pegal Linu dan Stamina Terbaru'}
                          </Text>
                        )}
                        {qtyTotalpegalLinuStaminaNewest > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'pegalLinuStaminaNewest',
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
                        data={this.state.pegalLinuStaminaNewest}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalpegalLinuStaminaNewest}
                        onClickAll={() => this.onClickAll('pegalLinuStaminaNewest')}
                      />
                    </View>
                  )}
                  {this.state.pegalLinuStaminaRecent.length > 0 && (
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
                        {qtyTotalpegalLinuStaminaRecent > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Pegal Linu dan Stamina Terakhir Dipesan'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Pegal Linu dan Stamina Terakhir Dipesan'}
                          </Text>
                        )}
                        {qtyTotalpegalLinuStaminaRecent > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'pegalLinuStaminaRecent',
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
                        data={this.state.pegalLinuStaminaRecent}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalpegalLinuStaminaRecent}
                        onClickAll={() => this.onClickAll('pegalLinuStaminaRecent')}
                      />
                    </View>
                  )}
                  {this.state.produkWanitaAll.length > 0 && (
                    <View style={[styles.container, {height: hp('44%')}]}>
                      <View style={styles.columnTitle}>
                        {qtyTotalprodukWanitaAll > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Produk Wanita Semua'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Produk Wanita Semua'}
                          </Text>
                        )}
                        {qtyTotalprodukWanitaAll > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'produkWanita',
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
                        data={this.state.produkWanitaAll}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalprodukWanitaAll}
                        onClickAll={() => this.onClickAll('produkWanita')}
                      />
                    </View>
                  )}

                  {this.state.produkWanitaPopular.length > 0 && (
                    <View style={[styles.container, {height: hp('44%')}]}>
                      <View style={styles.columnTitle}>
                        {qtyTotalprodukWanitaPopular > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Produk Wanita Terlaris'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Produk Wanita Terlaris'}
                          </Text>
                        )}
                        {qtyTotalprodukWanitaPopular > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'produkWanitaPopular',
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
                        data={this.state.produkWanitaPopular}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalprodukWanitaPopular}
                        onClickAll={() => this.onClickAll('produkWanitaPopular')}
                      />
                    </View>
                  )}

                  {this.state.produkWanitaNewest.length > 0 && (
                    <View
                      style={
                        this.state.produkWanitaRecent.length > 0
                          ? [styles.container,{height: hp('44%')}]
                          : [styles.container, {marginBottom: 0, elevation: 0,height: hp('44%')}]
                      }>
                      <View style={styles.columnTitle}>
                        {qtyTotalprodukWanitaNewest > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Produk Wanita Terbaru'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Produk Wanita Terbaru'}
                          </Text>
                        )}
                        {qtyTotalprodukWanitaNewest > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'produkWanitaNewest',
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
                        data={this.state.produkWanitaNewest}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalprodukWanitaNewest}
                        onClickAll={() => this.onClickAll('produkWanitaNewest')}
                      />
                    </View>
                  )}
                  {this.state.produkWanitaRecent.length > 0 && (
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
                        {qtyTotalprodukWanitaRecent > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Produk Wanita Terakhir Dipesan'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Produk Wanita Terakhir Dipesan'}
                          </Text>
                        )}
                        {qtyTotalprodukWanitaRecent > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'produkWanitaRecent',
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
                        data={this.state.produkWanitaRecent}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalprodukWanitaRecent}
                        onClickAll={() => this.onClickAll('produkWanitaRecent')}
                      />
                    </View>
                  )}
                  {this.state.permenAll.length > 0 && (
                    <View style={[styles.container, {height: hp('44%')}]}>
                      <View style={styles.columnTitle}>
                        {qtyTotalpermenAll > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Permen Semua'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Permen Semua'}
                          </Text>
                        )}
                        {qtyTotalpermenAll > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'permen',
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
                        data={this.state.permenAll}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalpermenAll}
                        onClickAll={() => this.onClickAll('permen')}
                      />
                    </View>
                  )}

                  {this.state.permenPopular.length > 0 && (
                    <View style={[styles.container, {height: hp('44%')}]}>
                      <View style={styles.columnTitle}>
                        {qtyTotalpermenPopular > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Permen Terlaris'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Permen Terlaris'}
                          </Text>
                        )}
                        {qtyTotalpermenPopular > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'permenPopular',
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
                        data={this.state.permenPopular}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalpermenPopular}
                        onClickAll={() => this.onClickAll('permenPopular')}
                      />
                    </View>
                  )}

                  {this.state.permenNewest.length > 0 && (
                    <View
                      style={
                        this.state.permenRecent.length > 0
                          ? [styles.container,{height: hp('44%')}]
                          : [styles.container, {marginBottom: 0, elevation: 0,height: hp('44%')}]
                      }>
                      <View style={styles.columnTitle}>
                        {qtyTotalpermenNewest > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Permen Terbaru'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Permen Terbaru'}
                          </Text>
                        )}
                        {qtyTotalpermenNewest > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'permenNewest',
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
                        data={this.state.permenNewest}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalpermenNewest}
                        onClickAll={() => this.onClickAll('permenNewest')}
                      />
                    </View>
                  )}
                  {this.state.permenRecent.length > 0 && (
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
                        {qtyTotalpermenRecent > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Permen Terakhir Dipesan'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Permen Terakhir Dipesan'}
                          </Text>
                        )}
                        {qtyTotalpermenRecent > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'permenRecent',
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
                        data={this.state.permenRecent}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalpermenRecent}
                        onClickAll={() => this.onClickAll('permenRecent')}
                      />
                    </View>
                  )}
                  {this.state.herbaMojoAll.length > 0 && (
                    <View style={[styles.container, {height: hp('44%')}]}>
                      <View style={styles.columnTitle}>
                        {qtyTotalherbaMojoAll > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Herba Mojo Semua'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Herba Mojo Semua'}
                          </Text>
                        )}
                        {qtyTotalherbaMojoAll > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'herbaMojo',
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
                        data={this.state.herbaMojoAll}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalherbaMojoAll}
                        onClickAll={() => this.onClickAll('herbaMojo')}
                      />
                    </View>
                  )}

                  {this.state.herbaMojoPopular.length > 0 && (
                    <View style={[styles.container, {height: hp('44%')}]}>
                      <View style={styles.columnTitle}>
                        {qtyTotalherbaMojoPopular > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Herba Mojo Terlaris'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Herba Mojo Terlaris'}
                          </Text>
                        )}
                        {qtyTotalherbaMojoPopular > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'herbaMojoPopular',
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
                        data={this.state.herbaMojoPopular}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalherbaMojoPopular}
                        onClickAll={() => this.onClickAll('herbaMojoPopular')}
                      />
                    </View>
                  )}

                  {this.state.herbaMojoNewest.length > 0 && (
                    <View
                      style={
                        this.state.herbaMojoRecent.length > 0
                          ? [styles.container,{height: hp('44%')}]
                          : [styles.container, {marginBottom: 0, elevation: 0,height: hp('44%')}]
                      }>
                      <View style={styles.columnTitle}>
                        {qtyTotalherbaMojoNewest > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Herba Mojo Terbaru'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Herba Mojo Terbaru'}
                          </Text>
                        )}
                        {qtyTotalherbaMojoNewest > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'herbaMojoNewest',
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
                        data={this.state.herbaMojoNewest}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalherbaMojoNewest}
                        onClickAll={() => this.onClickAll('herbaMojoNewest')}
                      />
                    </View>
                  )}
                  {this.state.herbaMojoRecent.length > 0 && (
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
                        {qtyTotalherbaMojoRecent > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Herba Mojo Terakhir Dipesan'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Herba Mojo Terakhir Dipesan'}
                          </Text>
                        )}
                        {qtyTotalherbaMojoRecent > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'herbaMojoRecent',
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
                        data={this.state.herbaMojoRecent}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalherbaMojoRecent}
                        onClickAll={() => this.onClickAll('herbaMojoRecent')}
                      />
                    </View>
                  )}
                  {this.state.herbanaAll.length > 0 && (
                    <View style={[styles.container, {height: hp('44%')}]}>
                      <View style={styles.columnTitle}>
                        {qtyTotalherbanaAll > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Herbana Semua'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Herbana Semua'}
                          </Text>
                        )}
                        {qtyTotalherbanaAll > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'herbana',
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
                        data={this.state.herbanaAll}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalherbanaAll}
                        onClickAll={() => this.onClickAll('herbana')}
                      />
                    </View>
                  )}

                  {this.state.herbanaPopular.length > 0 && (
                    <View style={[styles.container, {height: hp('44%')}]}>
                      <View style={styles.columnTitle}>
                        {qtyTotalherbanaPopular > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Herbana Terlaris'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Herbana Terlaris'}
                          </Text>
                        )}
                        {qtyTotalherbanaPopular > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'herbanaPopular',
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
                        data={this.state.herbanaPopular}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalherbanaPopular}
                        onClickAll={() => this.onClickAll('herbanaPopular')}
                      />
                    </View>
                  )}

                  {this.state.herbanaNewest.length > 0 && (
                    <View
                      style={
                        this.state.herbanaRecent.length > 0
                          ? [styles.container,{height: hp('44%')}]
                          : [styles.container, {marginBottom: 0, elevation: 0,height: hp('44%')}]
                      }>
                      <View style={styles.columnTitle}>
                        {qtyTotalherbanaNewest > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Herbana Terbaru'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Herbana Terbaru'}
                          </Text>
                        )}
                        {qtyTotalherbanaNewest > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'herbanaNewest',
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
                        data={this.state.herbanaNewest}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalherbanaNewest}
                        onClickAll={() => this.onClickAll('herbanaNewest')}
                      />
                    </View>
                  )}
                  {this.state.herbanaRecent.length > 0 && (
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
                        {qtyTotalherbanaRecent > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Herbana Terakhir Dipesan'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Herbana Terakhir Dipesan'}
                          </Text>
                        )}
                        {qtyTotalherbanaRecent > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'herbanaRecent',
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
                        data={this.state.herbanaRecent}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalherbanaRecent}
                        onClickAll={() => this.onClickAll('herbanaRecent')}
                      />
                    </View>
                  )}
                  {this.state.maduAll.length > 0 && (
                    <View style={[styles.container, {height: hp('44%')}]}>
                      <View style={styles.columnTitle}>
                        {qtyTotalmaduAll > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Madu Semua'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Madu Semua'}
                          </Text>
                        )}
                        {qtyTotalmaduAll > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'madu',
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
                        data={this.state.maduAll}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalmaduAll}
                        onClickAll={() => this.onClickAll('madu')}
                      />
                    </View>
                  )}

                  {this.state.maduPopular.length > 0 && (
                    <View style={[styles.container, {height: hp('44%')}]}>
                      <View style={styles.columnTitle}>
                        {qtyTotalmaduPopular > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Madu Terlaris'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Madu Terlaris'}
                          </Text>
                        )}
                        {qtyTotalmaduPopular > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'maduPopular',
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
                        data={this.state.maduPopular}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalmaduPopular}
                        onClickAll={() => this.onClickAll('maduPopular')}
                      />
                    </View>
                  )}

                  {this.state.maduNewest.length > 0 && (
                    <View
                      style={
                        this.state.maduRecent.length > 0
                          ? [styles.container,{height: hp('44%')}]
                          : [styles.container, {marginBottom: 0, elevation: 0,height: hp('44%')}]
                      }>
                      <View style={styles.columnTitle}>
                        {qtyTotalmaduNewest > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Madu Terbaru'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Madu Terbaru'}
                          </Text>
                        )}
                        {qtyTotalmaduNewest > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'maduNewest',
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
                        data={this.state.maduNewest}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalmaduNewest}
                        onClickAll={() => this.onClickAll('maduNewest')}
                      />
                    </View>
                  )}
                  {this.state.maduRecent.length > 0 && (
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
                        {qtyTotalmaduRecent > 10 ? (
                          <Text
                            column={2}
                            style={[styles.title, {width: wp('70%')}]}>
                            {'Produk Madu Terakhir Dipesan'}
                          </Text>
                        ) : (
                          <Text column={2} style={styles.title}>
                            {'Produk Madu Terakhir Dipesan'}
                          </Text>
                        )}
                        {qtyTotalmaduRecent > 10 ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ProdukKategori', {
                                initial: false,
                                screen: 'maduRecent',
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
                        data={this.state.maduRecent}
                        postShoppingCart={item => this.postShoppingCart(item)}
                        qtyTotal={qtyTotalmaduRecent}
                        onClickAll={() => this.onClickAll('maduRecent')}
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
    marginHorizontal: wp('-8%'),
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
