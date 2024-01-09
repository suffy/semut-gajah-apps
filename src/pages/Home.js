import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  RefreshControl,
  TouchableWithoutFeedback,
  Animated,
  FlatList,
  Pressable,
  Modal,
  Linking,
  BackHandler,
} from 'react-native';
import Banner from '../pages/Banner';
import Voucher from '../pages/Voucher';
import List from '../pages/List';
import Category from '../pages/Category';
import BannerPromo from '../pages/BannerPromo';
import IconSearch from '../assets/newIcons/iconPencarian.svg';
import IconClose from '../assets/newIcons/iconClose.svg';
import IconNotif from '../assets/newIcons/iconNotif.svg';
import IconShopping from '../assets/newIcons/iconKeranjangAktif.svg';
import IconMenu from '../assets/newIcons/iconMenu.svg';
import Logo from '../assets/icons/Logo.svg';
import Search from '../pages/Search';
import axios from 'axios';
import CONFIG from '../constants/config';
import {
  SubsAction,
  LoginAction,
  NotifAction,
  TopSpenderAction,
} from '../redux/Action';
import Storage from '@react-native-async-storage/async-storage';
import IconOffline from '../assets/icons/NetInfo.svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import NumberFormat from 'react-number-format';
import {ActivityIndicator} from 'react-native-paper';
import {Card, Rating} from 'react-native-elements';
import DummyImage from '../assets/icons/IconLogo.svg';
import {fcmService} from '../components/FCMService';
import {localNotificationService} from '../components/LocalNotificationService';
import Snackbar from 'react-native-snackbar';
import IconCart from '../assets/newIcons/cartActive.svg';
import {copilot, walkthroughable, CopilotStep} from 'react-native-copilot';
import BottomNavigation from '../components/BottomNavigation';
import ModalAlert from '../components/ModalAlert';
import Whatsapp from '../assets/icons/whatsapp-symbol.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalBlackList from '../components/ModalBlackList';
import CustomAlert from '../components/CustomAlert';
import {useRoute} from '@react-navigation/native';
import {Avatar} from 'react-native-elements';
import moment from 'moment';
import Bintang from '../assets/newIcons/iconBintangActive.svg';
const width = Dimensions.get('window').width;
const height = width * 0.5;
const widthItem = width / 3;
const products = [
  {
    id: '',
    name: '',
    image: '',
    price: {
      id: '',
      product_id: '',
      harga_ritel_gt: '',
      harga_grosir_mt: '',
      harga_semi_grosir: '',
      harga_promosi_coret_ritel_gt: '',
      harga_promosi_coret_grosir_mt: '',
      harga_promosi_coret_semi_grosir: '',
    },
  },
];

const CopilotTouchableOpacity = walkthroughable(TouchableOpacity);
const CopilotView = walkthroughable(View);

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

const list = [
  {
    id: '',
    name: '',
    image: '',
    price_sell: '',
  },
];

let langkahStep = null;

export class Home extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.onEndReachedCalledDuringMomentum = false;
    this.animation = new Animated.Value(0);
    this.state = {
      search: this.props.route.params?.kataKunci || '',
      listSearch: list,
      qty: 0,
      page: 1,
      loadingMore: false,
      refreshing: false,
      maxPage: 1,
      recomenProduct: [],
      loadingApi: true,
      modalVisible: false,
      modalVisibleTutorial: false,
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
      banners: [],
      promo: [],
      categories: [],
      products_newest: [],
      products_popular: [],
      products_recent: [],
      products_promo: [],
      qtyTotalNew: '',
      qtyTotalPopular: '',
      qtyTotalPromo: '',
      alertData: '',
      modalAlert: false,
      numberWASub: '',
      notifMessage: 0,
      notifAllOrder: 0,
      notifSubscribe: 0,
      notifAllComplaint: 0,
      notifBroadcast: 0,
      visibleModalBlack: false,
      visibleCustomAlert: false,
      dataAlert: {},
    };

    this.firebaseNotify = null;
    this.localNotify = null;
  }

  getMenu = () => {
    this.props.navigation.navigate('Profile');
  };

  getDataLoadAll = async () => {
    const {page} = this.state;
    try {
      let response = await axios.get(
        `${CONFIG.BASE_URL}/api/load-all?page=${page}`,
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      const data = response.data.data;
      this._isMounted &&
        this.setState({
          recomenProduct:
            page === 1
              ? data.products_recomen[0].data
              : [
                  ...this.state.recomenProduct,
                  ...data.products_recomen[0].data,
                ],
          loadingMore: data.products_recomen[0].last_page > this.state.page,
          maxPage: data.products_recomen[0].last_page,
          categories: data.categories,
          banners: data.banners,
          promo: data.promo[0].data,
          products_newest: data.products_newest,
          products_popular: data.products_popular,
          products_recent: data.products_recent,
          products_promo: data.products_promo,
          qtyTotalNew: data.products_newest[0].total,
          qtyTotalPopular: data.products_popular[0].total,
          qtyTotalPromo: data.products_promo[0].total,
          loadingApi: false,
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
        'Cek Error=======DATA LOAD=================',
        JSON.parse(JSON.stringify(error)).message,
      );
      if (error429) {
        this.showSnackbarBusy();
      } else if (errorNetwork) {
        this.showSnackbarInet();
      } else if (error400) {
        // Storage.removeItem('token');
      }
    }
  };

  getDataLoadRecomen = async () => {
    const {page} = this.state;
    try {
      let response = await axios.get(
        `${CONFIG.BASE_URL}/api/load-all?page=${page}`,
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      const data = response.data.data;
      this.setState({
        recomenProduct:
          page === 1
            ? data.products_recomen[0].data
            : [...this.state.recomenProduct, ...data.products_recomen[0].data],
        loadingMore: data.products_recomen[0].last_page > this.state.page,
        maxPage: data.products_recomen[0].last_page,
        loadingApi: false,
      });
    } catch (error) {
      this.setState({loadingApi: false, loadingMore: false});
      let error429 =
        JSON.parse(JSON.stringify(error)).message ===
        'Request failed with status code 429';
      let errorNetwork =
        JSON.parse(JSON.stringify(error)).message === 'Network Error';
      let error400 =
        JSON.parse(JSON.stringify(error)).message ===
        'Request failed with status code 400';
      console.log(
        'Cek Error========LOAD REKOMEN================',
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

  componentDidMount = async () => {
    this._isMounted = true;
    this.focusListener = this.props.navigation.addListener('focus', () => {
      console.log('masuk listener');
      this.getDataLoadAll();
      this.getNotifAll();
      this.getWhatsappNumber();
      this.cekLoginVersion();
      if (this.props.route.params?.kataKunci !== undefined) {
        console.log('log 329');
        this.handlerSearch(this.props.route.params?.kataKunci);
      } else {
        console.log('Kosong', this.props.route.params?.kataKunci);
      }
    });
    this.getDataLoadAll();
    this.getNotifAll();
    this.getDataUser();
    this.getDataSearching();

    let tutorial = await Storage.getItem('tutorial');
    console.log('tutorial=============', tutorial);
    if (tutorial === null || tutorial === '') {
      this.waktu = setTimeout(() => {
        this.props.copilotEvents.on('stepChange', this.handleStepChange);
        this.props.start();
        // this.setState({modalVisibleTutorial: false});
      }, 300);
    }
    const {navigation} = this.props;
    this.firebaseNotify = fcmService;
    this.localNotify = localNotificationService;
    this.firebaseNotify.registerAppWithFCM().catch(error => {
      console.log(error);
    });
    this.firebaseNotify.register(
      this.onRegister,
      this.onNotification,
      this.onOpenNotification,
      navigation,
    );

    this.localNotify.createDefaultChannels();
    this.localNotify.configure(this.onOpenNotification, navigation);
  };

  componentWillUnmount() {
    this._isMounted = false;
    this.props.copilotEvents.off('stop');
    clearInterval(this.interval);
  }

  componentDidUpdate() {
    if (this.state.loadingApi) {
      this.interval = setInterval(
        () => this.setState({loadingApi: false}),
        10000,
      );
    }
  }

  removeParams = async () => {
    this.props.navigation.setParams({kataKunci: undefined});
  };

  getDataUser = async () => {
    try {
      let response = await axios.get(`${CONFIG.BASE_URL}/api/profile`, {
        headers: {Authorization: `Bearer ${this.props.token}`},
      });
      console.log('getDataUser');
      const data = response.data.data;
      this.props.loginAct(data, 'dataUser');
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
        'Cek Error===========DataUser=============',
        JSON.parse(JSON.stringify(error)).message,
      );
      if (error429) {
        this.showSnackbarBusy();
      } else if (errorNetwork) {
        this.showSnackbarInet();
      } else if (error400) {
        Storage.removeItem('token');
        this.setState({
          alertData: 'Waktu Sesi Anda Telah Habis',
          modalAlert: !this.state.modalAlert,
        });
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
        'Cek Error===========DataSearching=============',
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
    this.setState({search: value});
    this.getDataSearching(value, true);
  };

  handleItemPress = item => {
    this.postRecent(item);
    this.props.subsAct(item, 'item');
    this.setState({search: ''});
    this.props.navigation.navigate('ProdukDeskripsi', {
      initial: false,
      keyWord: this.state.search,
    });
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
        'Cek Error==========POST CART==============',
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

  postRecent = async item => {
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
      this.getDataLoadAll();
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
        'Cek Error==========POST RECENT==============',
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
    this.setState({
      modalVisible: true,
    });
  };
  cekLoginVersion = async () => {
    try {
      let response = await axios.get(`${CONFIG.BASE_URL}/api/profile`, {
        headers: {Authorization: `Bearer ${await Storage.getItem('token')}`},
      });
      const data = response.data;
      if (data['success'] === true) {
        await this.autoLogOut(data.data.app_version);
      }
    } catch (e) {
      console.log('error: ' + e.message);
    }
  };
  autoLogOut = async loginVersion => {
    try {
      let response = await axios({
        method: 'post',
        url: `${CONFIG.BASE_URL}/api/version/restart`,
        data: {
          customer_code: this.props.dataUser.customer_code,
          version: loginVersion,
        },
      });
      const data = response.data;
      if (data.restart === true) {
        await this.removeData();
      } else {
        this._isMounted &&
          this.setState({visibleCustomAlert: data.alert?.is_show});
        this._isMounted && this.setState({dataAlert: data.alert});
      }
    } catch (e) {
      console.log('erorrr ======= 263' + e.message);
    }
  };
  removeData = async () => {
    try {
      await axios
        .post(
          `${CONFIG.BASE_URL}/api/auth/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${await Storage.getItem('token')}`,
            },
          },
        )
        .then(response => {
          const data = response.data.success;
          if (data == true) {
            Storage.removeItem('token');
            this._isMounted && this.setState({loadingApi: false});
            this.setState({
              alertData: 'Waktu Sesi Anda Telah Habis',
              modalAlert: !this.state.modalAlert,
            });
          } else {
            console.log('gagal');
          }
        });
    } catch (e) {
      console.log('erorrr ======= 295' + JSON.stringify(e));
    }
  };
  //load more data
  getMoreData = () => {
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
          this.getDataLoadRecomen();
        },
      );
      this.onEndReachedCalledDuringMomentum =
        this.state.page >= this.state.maxPage;
    }
  };

  renderLoadMore = () => {
    if (!this.state.loadingMore) return null;
    return (
      <View>
        <ActivityIndicator animating size="small" color="#777" />
      </View>
    );
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
        return (
          <View style={styles.counter}>
            <Text style={styles.counterText}>
              {count > 100 ? '99+' : count}
            </Text>
          </View>
        );
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleRefresh = async () => {
    await this.setState({
      refreshing: true,
      page: 1,
    });
    this.getDataRefresh();
  };

  getDataRefresh = () => {
    this.getDataLoadAll();
    this.getDataUser();
    this.getNotifAll();
    this.setState({refreshing: false});
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

  onRegister = async token => {
    await Storage.setItem('fcmToken', token);
  };

  onNotification(notify) {
    // fungsi memberikan notifikasi ke device setelah menerima data dari firebase
    const options = {
      soundName: 'default',
      playSound: true,
    };
    let body = notify?.notification?.body;
    let handlePlusDeliveryDate = notify?.body?.split(' - ');
    localNotificationService.showNotification(
      0,
      notify?.notification?.title,
      body,
      notify,
      options,
    );
  }

  onOpenNotification = async (notify, navigation, background) => {
    // fungsi saat notifikasi di buka pada device
    console.log('open notification');
    if (notify?.notification?.title === 'Status Orderan') {
      this.props.navigation.navigate('NotificationShopping', {initial: false});
    } else if (notify?.notification?.title === 'Status Langganan') {
      this.props.navigation.navigate('NotificationSubscribe', {initial: false});
    } else if (notify?.notification?.title === 'Status Complaint') {
      this.props.navigation.navigate('NotificationComplaint', {initial: false});
    } else if (notify?.notification?.title === 'Status Chat') {
      this.props.navigation.navigate('Chat', {initial: false});
    } else if (notify?.notification?.title === 'Status Pembaharuan') {
      Linking.openURL(
        'http://play.google.com/store/apps/details?id=com.semutgajah',
      );
    } else if (notify?.notification?.title === 'Pemberitahuan') {
      console.log('data notif klik ' + JSON.stringify(notify));
      let _price =
        typeof notify?.data?.price === 'string'
          ? JSON.parse(notify?.data?.price)
          : null;
      let _notify = notify.data;
      if (_price !== null) {
        console.log('masuk 1');
        _notify = {..._notify, price: _price};
        this.props.navigation.navigate(
          'ProdukDeskripsi',
          this.props.subsAct(_notify, 'item'),
          {initial: false},
        );
      } else {
        console.log(
          'masuk 2 ' + JSON.stringify(notify?.data) + typeof notify?.data,
        );
        this.props.navigation.navigate('OutOfStockDetails', {id: notify?.data});
      }
    } else {
    }
  };

  onPressFunction = () => {
    this.flatListRef.scrollToOffset({animated: true, offset: 0});
    // flatlistRef.current.scrollToIndex({index: 0});
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
          this.getDataLoadAll();
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
          this.getDataLoadAll();
        },
      },
    });
  };

  getNavigasi = item => {
    if (item.id == 1) {
      this.props.navigation.navigate('Produk', {
        screen: 'DetailHerbal',
      });
    } else if (item.id == 2) {
      this.props.navigation.navigate('Produk', {
        screen: 'DetailSupMul',
      });
    } else if (item.id == 3) {
      this.props.navigation.navigate('Produk', {
        screen: 'DetailFoodBev',
      });
    } else if (item.id == 4) {
      this.props.navigation.navigate('Produk', {
        screen: 'DetailMinyak',
      });
    }
  };
  getName = () => {
    let name = this.props?.dataUser?.name
      ?.match(/(\b\S)?/g)
      .join('')
      .toUpperCase();
    if (name == null || name == '' || name == undefined) {
      return (name = 'NA');
    }
    return name;
  };
  flatListHeader = () => {
    const {dataUser} = this.props;
    return (
      <View>
        {dataUser && (
          <View
            style={{
              backgroundColor: '#FFF',
              alignItems: 'center',
              flexDirection: 'row',
              // paddingHorizontal: wp('10%'),
              paddingVertical: hp('1.5%'),
            }}>
            {dataUser?.photo ? (
              <View style={styles.avatar}>
                <Image
                  source={{uri: CONFIG.BASE_URL + dataUser?.photo}}
                  style={styles.image}></Image>
              </View>
            ) : (
              <View style={styles.avatar}>
                <Avatar
                  size={hp('8%')}
                  width={hp('8%')}
                  height={hp('8%')}
                  containerStyle={{
                    backgroundColor: '#BDBDBD',
                  }}
                  // placeholderStyle={{backgroundColor: '#BDBDBD'}}
                  rounded
                  title={this.getName()}
                  activeOpacity={0.7}
                />
              </View>
            )}

            <View
              style={{
                flexDirection: 'column',
                marginLeft: wp('2%'),
                width: '80%',
              }}>
              <Text numberOfLines={1} style={styles.name}>
                {/* {'SEMUT GAJAH'} */}
                {'Hello '}
                {!dataUser?.user_address[0]
                  ? ' '
                  : dataUser?.user_address[0]?.shop_name
                  ? dataUser?.user_address[0]?.shop_name
                  : dataUser?.user_address[0]?.name}
                {'!'}
              </Text>
              <Text style={styles.last_login}>
                {dataUser?.last_login
                  ? 'Terakhir login ' +
                    moment(dataUser?.last_login).format('D MMM YYYY')
                  : ' '}{' '}
              </Text>
            </View>
          </View>
        )}
        <CopilotStep
          text="Semua informasi promo ada disini"
          order={4}
          name="banner-promo">
          <CopilotView>
            <Banner
              promo={this.state.promo}
              navigation={this.props.navigation}
            />
          </CopilotView>
        </CopilotStep>
        {/* STAGING/DEV MODE ( */}
        {CONFIG.BASE_URL == 'https://production.semutgajah.com' ? null : (
          <View style={styles.cardBackground}>
            <Text style={styles.promoText}>
              {
                'STAGING MODE ON, HANYA UNTUK TESTING SAJA. GUNAKAN APLIKASI DARI PLAYSTORE UNTUK BERTRANSAKSI'
              }
            </Text>
          </View>
        )}
        <CopilotStep
          text="Semua informasi produk kategori ada disini"
          order={5}
          name="category">
          <CopilotView>
            <Category
              // refreshing={refreshing}
              getNavigasi={item => this.getNavigasi(item)}
              categories={this.state.categories}
              navigation={this.props.navigation}
            />
          </CopilotView>
        </CopilotStep>
        <BannerPromo
          // refreshing={refreshing}
          banners={this.state.banners}
          navigation={this.props.navigation}
        />
        <List
          // refreshing={refreshing}
          rating={this.state.rating}
          categories={this.state.categories}
          products_newest={this.state.products_newest}
          products_popular={this.state.products_popular}
          products_recent={this.state.products_recent}
          products_promo={this.state.products_promo}
          qtyTotalNew={this.state.qtyTotalNew}
          qtyTotalPopular={this.state.qtyTotalPopular}
          qtyTotalPromo={this.state.qtyTotalPromo}
          navigation={this.props.navigation}
          showModal={() => this.showModal()}
          postShoppingCart={item => this.postShoppingCart(item)}
          postRecent={item => this.postRecent(item)}
          getAnimation={() => this.getAnimation()}
          getNotifAll={() => this.getNotifAll()}
        />
        <View
          style={{
            flexDirection: 'row',
            // paddingLeft: wp('5%'),
            paddingBottom: hp('1%'),
            paddingTop: hp('2%'),
            backgroundColor: '#F4F4F4',
            paddingHorizontal: wp('5%'),
          }}>
          <Text style={styles.title}>{'Produk Rekomendasi'}</Text>
        </View>
      </View>
    );
  };

  handleStepChange = async step => {
    await Storage.setItem('tutorial', 'true');
    langkahStep = step.name;
  };

  getCloseAlertModal() {
    this.setState({modalAlert: !this.state.modalAlert});
    if (this.state.alertData == 'Waktu Sesi Anda Telah Habis') {
      this.props.navigation.replace('Login');
    }
  }

  getWhatsappNumber = async () => {
    try {
      let response = await axios.get(`${CONFIG.BASE_URL}/api/wa/number`, {
        headers: {Authorization: `Bearer ${this.props.token}`},
      });
      // console.log('response===>', JSON.stringify(response, null, 2));
      const data = response.data;
      console.log('data', data);
      if (data.data !== '' && data['success'] == true) {
        this.setState({numberWASub: data.data[0]});
      } else {
        this.setState({
          alertData: 'Gagal ambil data whatsapp',
          modalAlert: !this.state.modalAlert,
        });
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
      }
    }
  };

  handleChatWhatsapp = chat => {
    let url = 'whatsapp://send?phone=62' + this.state.numberWASub.telp_wa;
    Linking.openURL(url)
      .then(data => {
        console.log('WhatsApp Opened');
      })
      .catch(() => {
        this.setState({
          alertData: 'Pastikan aplikasi whatsapp terinstall di hape kamu',
          modalAlert: !this.state.modalAlert,
        });
      });
  };
  handleCloseCustomAlert = () => {
    this.setState({visibleCustomAlert: !this.state.visibleCustomAlert});
  };
  onPressCustomAlert = (type, param) => {
    if (type === 'top-spender') {
      this.props.navigation.navigate('TopSpender', {
        id: param,
      });
    } else if (type === 'promo') {
      this.props.navigation.navigate('DetailPromo', {
        id: param,
      });
    } else if (type === 'link') {
      Linking.openURL(param);
    }
    this.setState({visibleCustomAlert: !this.state.visibleCustomAlert});
  };

  render() {
    const {qty, refreshing, search, rating, loadingApi, dataAlert} = this.state;
    const rotation = this.animation.interpolate({
      inputRange: [0, 1, 2, 3, 4, 5],
      outputRange: ['0deg', '-15deg', '15deg', '-15deg', '15deg', '0deg'],
    });
    return (
      <View style={{flex: 1, height: wp('100%')}}>
        <ModalAlert
          modalAlert={this.state.modalAlert}
          alert={this.state.alertData}
          getCloseAlertModal={() => this.getCloseAlertModal()}
        />
        {loadingApi ? null : !dataAlert ? null : (
          <CustomAlert
            typeOfAlert={dataAlert?.type === 'image' ? true : false}
            alertVisible={this.state.visibleCustomAlert}
            // alertVisible={true}
            images={{uri: CONFIG.BASE_URL + '/' + dataAlert?.parameter}}
            title={dataAlert?.title || 'Informasi'}
            textAlert={dataAlert?.description || 'Description'}
            textBtn={
              dataAlert?.type === 'top-spender'
                ? 'Lihat Top-Spender'
                : dataAlert?.type === 'promo'
                ? 'Lihat Promo '
                : dataAlert?.type === 'link'
                ? 'Lihat'
                : 'Tutup'
            }
            onPressBtn={
              () =>
                this.onPressCustomAlert(dataAlert?.type, dataAlert?.parameter)
              // this.onPressCustomAlert("link", "https://www.youtube.com/")
            }
            onBackdropPress={() => this.handleCloseCustomAlert()}
          />
        )}

        <View
          style={[
            styles.container2,
            {
              position: 'relative',
              top: 0,
              width: wp('100%'),
            },
          ]}>
          <Logo
            // onPress={() =>
            //   this.props.navigation.navigate('Home')
            // }
            width={wp('12%')}
            height={hp('7%')}
            marginLeft={wp('4%')}
          />
          <View style={styles.searchSection}>
            <TextInput
              autoCapitalize="none"
              onChangeText={value => this.handlerSearch(value)}
              style={styles.inputStyle}
              placeholder="Pencarian..."
              value={search}
              selectTextOnFocus={true}
            />
            {search === '' ? (
              <IconSearch
                width={wp('4.5%')}
                height={hp('6.5%')}
                style={styles.search}
              />
            ) : (
              <IconClose
                fill={'black'}
                width={wp('4%')}
                height={hp('6.5%')}
                style={[styles.search]}
                onPress={() => {
                  this.setState({
                    search: '',
                  });
                  this.removeParams();
                }}
              />
            )}
          </View>
          <CopilotStep
            text="Notifikasi untuk chat, langganan, pesanan, dan komplain ada disini"
            order={1}
            name="notification">
            <CopilotView>
              <CopilotTouchableOpacity
                onPress={() => this.props.navigation.navigate('Notification')}>
                <IconNotif width={wp('5.5%')} height={hp('5.5%')} />
                {this.renderCountNotificationBadge()}
              </CopilotTouchableOpacity>
            </CopilotView>
          </CopilotStep>
          <CopilotStep
            text="Barang yang dibeli akan dimuat disini"
            order={2}
            name="cart-notification">
            <CopilotView>
              <CopilotTouchableOpacity
                style={{Position: 'relative'}}
                onPress={() => this.props.navigation.navigate('Keranjang')}>
                <Animated.View style={{transform: [{rotate: rotation}]}}>
                  <IconShopping width={wp('5.5%')} height={hp('5.5%')} />
                </Animated.View>
                {qty > 0 ? (
                  <View style={styles.counter}>
                    <Text style={styles.counterText}>{qty}</Text>
                  </View>
                ) : null}
              </CopilotTouchableOpacity>
            </CopilotView>
          </CopilotStep>
          <CopilotStep
            text="Untuk melihat menu profile dan setting dapat anda lihat disini"
            order={3}
            name="menu">
            <CopilotView style={styles.menu}>
              <CopilotTouchableOpacity onPress={() => this.getMenu()}>
                <IconMenu
                  width={wp('5.5%')}
                  height={hp('5.5%')}
                  marginRight={wp('2%')}
                />
              </CopilotTouchableOpacity>
            </CopilotView>
          </CopilotStep>
        </View>
        {this.state.search.length > 0 && (
          <ScrollView style={styles.scroll}>
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
          <View style={styles.scroll}>
            {/* {this.flatListHeader()} */}
            {loadingApi ? (
              <LoadingApi />
            ) : (
              <FlatList
                // scrollToIndex={this.onPressFunction}
                contentContainerStyle={styles.viewButtonRecomen}
                // columnWrapperStyle={{backgroundColor: 'white'}}
                // ListHeaderStyle={styles.headerStyle}
                numColumns={3}
                keyExtractor={(item, index) => `${index}`}
                data={this.state.recomenProduct}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={this.handleRefresh}
                    colors={['#529F45', '#FFFFFF']}
                  />
                }
                onEndReached={() => this.getMoreData()}
                onEndReachedThreshold={0.5}
                initialNumToRender={10}
                showsVerticalScrollIndicator={false}
                onMomentumScrollBegin={() => {
                  this.onEndReachedCalledDuringMomentum = false;
                }}
                ListFooterComponent={() => this.renderLoadMore()}
                ListHeaderComponent={this.flatListHeader}
                ListHeaderComponentStyle={{
                  backgroundColor: '#ddd',
                  // marginHorizontal: wp('-5%'),
                }}
                renderItem={({item, index}) => {
                  return (
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'center',
                      }}>
                      {/* produk rekomendasi */}
                      {/* <View style={{marginLeft: wp('1.5%')}}> */}
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
                        style={styles.buttonViewProdukRecomen}>
                        <View style={styles.imagesContainer}>
                          {item.image ? (
                            <Image
                              resizeMode="contain"
                              source={{uri: CONFIG.BASE_URL + item.image}}
                              style={styles.list}
                            />
                          ) : (
                            <DummyImage style={styles.list} />
                          )}
                        </View>
                        <View
                          style={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                            marginHorizontal: wp('3%'),
                          }}>
                          <View style={{height: wp('9%')}}>
                            <Text numberOfLines={2} style={styles.listTitle}>
                              {item.name || 'name'}
                            </Text>
                          </View>
                          <NumberFormat
                            value={Math.round(item?.price?.harga_ritel_gt)}
                            //harga barang
                            displayType={'text'}
                            thousandSeparator={true}
                            prefix={'Rp '}
                            renderText={value => (
                              <Text style={styles.listPrice}>{value || 0}</Text>
                            )}
                          />
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <View style={styles.borderLogo}>
                              <Bintang height={wp('3%')} width={wp('3%')} />
                              <Text
                                style={{
                                  fontSize: hp('1.6%'),
                                  color: '#575251',
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
                                <IconCart width={wp('4%')} height={wp('4%')} />
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
                        {item.promo_sku?.length > 0 && (
                          <View
                            style={{
                              flexDirection: 'row',
                              position: 'absolute',
                              left: 7,
                              top: 5,
                            }}>
                            <View
                              style={{
                                backgroundColor: '#F2BB4C',
                                padding: 4,
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingLeft: 10,
                                paddingRight: 10,
                                borderRadius: hp('0.5%'),
                              }}>
                              <Text
                                style={{
                                  fontSize: hp('1.5%'),
                                  fontFamily: 'Lato-Medium',
                                  color: '#FFF',
                                }}>
                                {'Promo'}
                              </Text>
                            </View>
                          </View>
                        )}
                        {item.cart ? (
                          <Pressable
                            style={styles.buttonKeranjang}
                            onPress={() => {
                              this.postShoppingCart(item);
                            }}>
                            <Text style={styles.textKeranjang}>{'Tambah'}</Text>
                          </Pressable>
                        ) : (
                          <Pressable
                            style={styles.buttonKeranjang}
                            onPress={() => {
                              this.postShoppingCart(item);
                            }}>
                            <Text style={styles.textKeranjang}>{'Beli'}</Text>
                          </Pressable>
                        )}
                      </TouchableOpacity>
                      {/* </View> */}
                    </View>
                  );
                }}
              />
            )}
          </View>
        )}
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
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisibleTutorial}
          onRequestClose={() => {
            this.setState({
              modalVisibleTutorial: !this.state.modalVisibleTutorial,
            });
          }}>
          <View style={styles.centeredViewTutorial}>
            {/* <View style={styles.modalView}>
                </View> */}
          </View>
        </Modal>
        <ModalBlackList
          modalVisible={this.state.visibleModalBlack}
          getCloseAlertModal={() => this.closeModalBlacklist()}
        />
        <Whatsapp
          onPress={() => this.handleChatWhatsapp()}
          style={{position: 'absolute', right: 10, bottom: 60}}
          width={wp('15%')}
          height={wp('15%')}
        />
        <BottomNavigation
          copilotEvents={this.props.copilotEvents}
          navigation={this.props.navigation}
          nameRoute="Home"
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  dataUser: state.LoginReducer.dataUser,
  token: state.LoginReducer.token,
  qty: state.ShoppingCartReducer.qty,
});

const mapDispatchToProps = dispatch => {
  return {
    subsAct: (value, tipe) => {
      dispatch(SubsAction(value, tipe));
    },
    loginAct: (value, tipe) => {
      dispatch(LoginAction(value, tipe));
    },
    notifAct: (value, tipe) => {
      dispatch(NotifAction, BannerAction(value, tipe));
    },
    topSpenderAct: (value, tipe) => {
      dispatch(TopSpenderAction(value, tipe));
    },
  };
};

const style = {
  borderRadius: 10,
  paddingTop: 5,
};

const customSvgPath = ({position, size, canvasSize}) => {
  console.log('position, size, canvasSize', position, size, canvasSize);
  if (langkahStep == 'notification') {
    return `M0,0H${canvasSize.x}V${canvasSize.y}H0V0ZM${position.x._value},${position.y._value}Za25 25 0 1 0 25 0 25 25 0 0 0-25 0`;
  } else if (langkahStep == 'cart-notification') {
    return `M0,0H${canvasSize.x}V${canvasSize.y}H0V0ZM${position.x._value},${position.y._value}Za25 25 0 1 0 25 0 25 25 0 0 0-25 0`;
  } else if (langkahStep == 'menu') {
    return `M0,0H${canvasSize.x}V${canvasSize.y}H0V0ZM${position.x._value},${position.y._value}Za25 25 0 1 0 25 0 25 25 0 0 0-25 0`;
  } else {
    return `M0,0H${canvasSize.x}V${canvasSize.y}H0V0ZM${position.x._value},${
      position.y._value
    }H${position.x._value + size.x._value}V${
      position.y._value + size.y._value
    }H${position.x._value}V${position.y._value}Z`;
  }
};

// / export default connect(mapStateToProps, mapDispatchToProps)(Home);
export default copilot({
  svgMaskPath: customSvgPath,
  tooltipStyle: style,
  androidStatusBarVisible: true,
  overlay: 'svg',
  animated: true,
  // verticalOffset: hp('3.3%'),
  labels: {
    previous: 'Sebelumnya',
    next: 'Lanjut',
    skip: 'Lewati',
    finish: 'Selesai',
  },
})(connect(mapStateToProps, mapDispatchToProps)(Home));

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
  scroll: {
    flex: 1,
    // backgroundColor: '#F8F8F8',
    backgroundColor: '#FFFFFF',
    width: wp('100%'),
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

  // bagian LIST
  list: {
    width: wp('27%'),
    height: wp('27%'),
    backgroundColor: '#FFFFFF',
    // paddingHorizontal: hp('3%'),
    alignSelf: 'center',
    borderRadius: wp('1%'),
  },
  listTitle: {
    fontSize: hp('1.6%'),
    fontFamily: 'Lato-Medium',
    color: '#575251',
    marginTop: wp('1%'),
  },
  listPrice: {
    fontSize: hp('2%'),
    fontFamily: 'Lato-Bold',
    color: '#575251',
    marginBottom: wp('1%'),
    marginTop: wp('1%'),
  },
  title: {
    fontSize: hp('1.7%'),
    fontFamily: 'Lato-Bold',
    color: '#1F1F1F',
    // marginTop: hp('1%'),
    // marginBottom: hp('2%'),
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

  //Produk Rekomen
  viewButtonRecomen: {
    flexDirection: 'column',
    // flexWrap: 'wrap',
    justifyContent: 'space-between',
    // paddingHorizontal: wp('5%'),
    // alignItems: 'center',
    paddingBottom: hp('9%'),
    backgroundColor: '#F4F4F4',
  },
  headerStyle: {
    marginBottom: hp('5%'),
  },
  buttonViewProdukRecomen: {
    // flex: 1,
    marginTop: hp('1%'),
    width: wp('30%'),
    height: hp('31%'),
    marginHorizontal: wp('2%'),
    marginBottom: hp('5%'),
    borderRadius: hp('2%'),
    backgroundColor: '#F4F4F4',
  },
  imagesContainer: {
    backgroundColor: '#FFF',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('3%'),
    paddingVertical: wp('5%'),
    borderRadius: wp('5%'),
  },
  // View Modal
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.9)',
  },
  centeredViewTutorial: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
    // backgroundColor: 'red',
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
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    width: wp('100%'),
    marginTop: hp('10%'),
    // height: hp('100%'),
    // position: 'absolute',
    // top:hp('-50%')
  },

  // Sign Type
  cardBackground: {
    backgroundColor: '#529F45',
    width: wp('95%'),
    height: hp('9.5%'),
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('5%'),
    borderColor: '#F9F9F9',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: hp('1.5%'),
    marginBottom: 5,
  },
  closePromo: {
    position: 'absolute',
    right: wp('3%'),
    top: hp('0.8%'),
  },
  promoText: {
    fontSize: hp('1.5%'),
    color: '#fff',
    fontFamily: 'Lato-Medium',
    // marginLeft: wp('1%'),
    // width: wp('100%'),
  },
  avatar: {
    height: hp('8%'),
    width: hp('8%'),
    borderRadius: hp('13%'),
    backgroundColor: '#FED9CD',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp('5%'),
  },
  image: {
    height: hp('8%'),
    width: hp('8%'),
    borderRadius: hp('4%'),
  },
  name: {
    color: '#575251',
    fontSize: hp('2.5%'),
    fontFamily: 'Lato-Medium',
    fontWeight: 'bold',
  },
  last_login: {
    color: '#C1B5B2',
    fontSize: hp('1.5%'),
    fontStyle: 'italic',
    fontFamily: 'Lato-Medium',
  },
});
