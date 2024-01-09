import React, {Component} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  Dimensions,
  TouchableWithoutFeedback,
  RefreshControl,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import Font from '../../components/Fontresponsive';
import NumberFormat from 'react-number-format';
import IconSearch from '../../assets/newIcons/iconPencarian.svg';
import IconNotif from '../../assets/newIcons/iconNotif.svg';
import IconShopping from '../../assets/newIcons/iconKeranjangAktif.svg';
import IconMenu from '../../assets/newIcons/iconMenu.svg';
import IconClose from '../../assets/newIcons/iconClose.svg';
import Logo from '../../assets/icons/Logo.svg';
import Search from '../Search';
import axios from 'axios';
import CONFIG from '../../constants/config';
import {SubsAction, NotifAction} from '../../redux/Action';
import Storage from '@react-native-async-storage/async-storage';
import IconOffline from '../../assets/icons/NetInfo.svg';
import {ActivityIndicator} from 'react-native-paper';
import {Card} from 'react-native-elements';
import Icon404 from '../../assets/icons/404.svg';
import BottomNavigation from '../../components/BottomNavigation';
import DummyImage from '../../assets/icons/IconLogo.svg';
import Snackbar from 'react-native-snackbar';

const width = Dimensions.get('window').width;

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
];

export class ProdukKategori extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    console.log('route navigation===', this.props.route.params);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.onEndReachedCalledDuringMomentum = false;
    this.state = {
      search: '',
      listSearch: list,
      qty: 0,
      notifMessage: 0,
      notifSubscribe: 0,
      notifAllOrder: 0,
      notifAllComplaint: 0,
      notifBroadcast: 0,
      herbal: list,
      page: 1,
      loadingMore: false,
      refreshing: false,
      maxPage: 1,
      pilihStatus: '',
      loadingApi: true,
      buttonChange: false,
      buttonSemua: true,
      buttonTerbaru: false,
      buttonHerbal: false,
      buttonSupMul: false,
      buttonFoodBev: false,
      buttonMinyak: false,
    };
  }

  getMenu = () => {
    this.props.navigation.navigate('Profile');
  };

  //produk baru product
  getPerCategory = async (status = '') => {
    this._isMounted = true
    const {page} = this.state;
    let number;
    let category;
    this.props.route.params.screen === 'Herbal'
      ? (number = 1)
      : this.props.route.params.screen === 'HerbalNew'
      ? ((number = 1), (category = 'newest'))
      : this.props.route.params.screen === 'HerbalPopular'
      ? ((number = 1), (category = 'popular'))
      : // : this.props.route.params.screen === 'HerbalPromo'
      // ? ((number = 1), (category = 'promo'))
      this.props.route.params.screen === 'HerbalRecent'
      ? ((number = 1), (category = 'recent'))
      : this.props.route.params.screen === 'SupMul'
      ? (number = 2)
      : this.props.route.params.screen === 'SupMulNew'
      ? ((number = 2), (category = 'newest'))
      : this.props.route.params.screen === 'SupMulPopular'
      ? ((number = 2), (category = 'popular'))
      : // : this.props.route.params.screen === 'SupMulPromo'
      // ? ((number = 2), (category = 'promo'))
      this.props.route.params.screen === 'SupMulRecent'
      ? ((number = 2), (category = 'recent'))
      : this.props.route.params.screen === 'FoodBev'
      ? (number = 3)
      : this.props.route.params.screen === 'FoodBevNew'
      ? ((number = 3), (category = 'newest'))
      : this.props.route.params.screen === 'FoodBevPopular'
      ? ((number = 3), (category = 'popular'))
      : // : this.props.route.params.screen === 'FoodBevPromo'
      // ? ((number = 3), (category = 'promo'))
      this.props.route.params.screen === 'FoodBevRecent'
      ? ((number = 3), (category = 'recent'))
      : this.props.route.params.screen === 'Minyak'
      ? (number = 4)
      : this.props.route.params.screen === 'MinyakNew'
      ? ((number = 4), (category = 'newest'))
      : this.props.route.params.screen === 'MinyakPopular'
      ? ((number = 4), (category = 'popular'))
      : // : this.props.route.params.screen === 'MinyakPromo'
      // ? ((number = 4), (category = 'promo'))
      this.props.route.params.screen === 'MinyakRecent'
      ? ((number = 4), (category = 'recent'))
      : this.props.route.params.screen === 'GeneralNew'
      ? (category = 'newest')
      : this.props.route.params.screen === 'GeneralPopular'
      ? (category = 'popular')
      : this.props.route.params.screen === 'GeneralPromo'
      ? (category = 'promo')
      : this.props.route.params.screen === 'GeneralRecent'
      ? (category = 'recent')
      : this.props.route.params.screen === 'GeneralProductsPromo'
      ? (number = 'products_promo')
      : this.props.route.params.screen === 'ProdukLainnya'
      ? (number = '')
      : ((number = ''), (category = ''));
    // console.log('number NH', number);
    // console.log('category NH', category);
    // console.log('CONTOH KEDUA', status);
    try {
      let response;
      if (category && number) {
        console.log('masuk if 1');
        response = await axios.get(
          `${CONFIG.BASE_URL}/api/products?category_id=${number}&category=${category}&order=${status}&page=${page}`,
          {
            headers: {Authorization: `Bearer ${this.props.token}`},
          },
        );
      } else if (category && number === undefined) {
        console.log('masuk if 2');
        response = await axios.get(
          `${CONFIG.BASE_URL}/api/products?category_id=${status}&category=${category}&page=${page}`,
          {
            headers: {Authorization: `Bearer ${this.props.token}`},
          },
        );
      } else if (
        category === undefined &&
        number &&
        this.props.route.params.screen !== 'GeneralProductsPromo'
      ) {
        console.log('masuk if 3');
        response = await axios.get(
          `${CONFIG.BASE_URL}/api/products?category_id=${number}&order=${status}&page=${page}`,
          {
            headers: {Authorization: `Bearer ${this.props.token}`},
          },
        );
      } else if (
        category === undefined &&
        number &&
        this.props.route.params.screen === 'GeneralProductsPromo'
      ) {
        console.log('masuk if 4');
        response = await axios.get(
          `${CONFIG.BASE_URL}/api/products?category=${number}&order=${status}&page=${page}`,
          {
            headers: {Authorization: `Bearer ${this.props.token}`},
          },
        );
      } else if (
        this.props.route.params.screen === 'KalenderPromo' &&
        this.props.route.params.idPromo
      ) {
        console.log('masuk if 5');
        response = await axios.get(
          `${CONFIG.BASE_URL}/api/promo/detail/${this.props.route.params.idPromo}?&page=${page}`,
          {
            headers: {Authorization: `Bearer ${this.props.token}`},
          },
        );
      } else if (
        (this.props.route.params.screen === 'HerbalPromo' ||
          this.props.route.params.screen === 'SupMulPromo' ||
          this.props.route.params.screen === 'FoodBevPromo' ||
          this.props.route.params.screen === 'MinyakPromo') &&
        this.props.route.params.idPromo
      ) {
        console.log('masuk if 6');
        console.log(this.props.route.params.idPromo);
        response = await axios.get(
          `${CONFIG.BASE_URL}/api/promo/detail/${this.props.route.params.idPromo}?&page=${page}`,
          {
            headers: {Authorization: `Bearer ${this.props.token}`},
          },
        );
      }
      const data = response.data.data;
      // console.log('DATA KATEGORI PRODUK========', JSON.stringify(data));
      this._isMounted && this.setState(prevState => ({
        loadingApi: false,
        herbal: page === 1 ? data.data : [...this.state.herbal, ...data.data],
        refreshing: false,
        loadingMore: data.last_page > this.state.page,
        maxPage: data.last_page,
      }));
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
        this.props.navigation.navigate('Home');
      }
    }
  };

  //searching data
  getDataSearching = async (value = this.state.search) => {
    const {page} = this.state;
    try {
      let response = await axios.get(
        `${CONFIG.BASE_URL}/api/products?search=${value}&page=${page}`,
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      const data = response.data.data;
      // if (this.props.dataUser.account_type == 5) {
      //   data = response.data.data.product_partner;
      // } else {
      //   data = response.data.data.product_mpm;
      // }
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
        // this.props.navigation.navigate('Home');
      }
    }
  };

  handlerSearch = value => {
    this._isMounted && this.setState({search: value, page: 1});
    this.getDataSearching(value);
  };

  handleItemPress = item => {
    this.postRecent(item);
    this.props.subsAct(item, 'item');
    this.setState({search: ''});
    this.props.navigation.navigate('ProdukDeskripsi', {initial: false});
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
          this.getPerCategory();
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
        this.getPerCategory();
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
        return (
          <View style={styles.counter}>
            <Text style={styles.counterText}>{count > 100 ? "99+" : count}</Text>
          </View>
        );
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount() {
    this._isMounted = true;
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.getPerCategory();
      this.getNotifAll();
    });
    this.getPerCategory();
    this.getNotifAll();
  }

  componentWillUnmount() {
    // rol();
    this._isMounted = false;
    // this.focusListener();
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
        // this.props.navigation.navigate('Home');
      }
    }
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

  //status
  handleStatusChange = async item => {
    await this.setState({
      pilihStatus: item,
      loadingApi: true,
      herbal: '',
      page: 1,
    });
    this.getPerCategory(item);
  };

  handleViewChange = async () => {
    await this.setState({
      buttonChange: !this.state.buttonChange,
      loadingApi: true,
      herbal: '',
      page: 1,
    });
    this.getPerCategory();
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
    const {qty, search, loadingApi, buttonChange} = this.state;
    console.log('buttonChange', search);
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={styles.container}>
          <Logo
            onPress={() => this.props.navigation.navigate('Home')}
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
                height={hp('6%')}
                style={styles.search}
              />
            ) : (
              <IconClose
                fill="black"
                width={wp('4%')}
                height={hp('6.5%')}
                style={[styles.search]}
                onPress={() => {
                  this._isMounted &&
                    this.setState({
                      search: '',
                    });
                }}
              />
            )}
          </View>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Notification')}>
            <IconNotif width={wp('5.5%')} height={hp('5.5%')} />
            {this.renderCountNotificationBadge()}
          </TouchableOpacity>
          <TouchableOpacity
            style={{Position: 'relative'}}
            onPress={() => this.props.navigation.navigate('Keranjang')}>
            <IconShopping width={wp('5.5%')} height={hp('5.5%')} />
            {qty > 0 ? (
              <View style={styles.counter}>
                <Text style={styles.counterText}>{qty}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
          <TouchableOpacity style={styles.menu} onPress={() => this.getMenu()}>
            <IconMenu
              width={wp('5.5%')}
              height={hp('5.5%')}
              marginRight={wp('2%')}
            />
          </TouchableOpacity>
        </View>
        <View>
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
            <>
              <View style={styles.position2}>
                {this.props.route.params.screen === 'GeneralNew' ||
                this.props.route.params.screen === 'GeneralPopular' ||
                this.props.route.params.screen === 'GeneralPromo' ||
                this.props.route.params.screen === 'GeneralRecent' ? (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {this.state.buttonSemua ? (
                      <TouchableOpacity
                        style={[
                          styles.borderFilter,
                          {marginLeft: wp('5%'), backgroundColor: '#529F45'},
                        ]}>
                        <Text style={[styles.textButton, {color: '#fff'}]}>
                          Semua
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={[styles.borderFilter, {marginLeft: wp('5%')}]}
                        onPress={() => {
                          this.handleStatusChange();
                          this.setState({
                            buttonSemua: !this.state.buttonSemua,
                            buttonHerbal: false,
                            buttonSupMul: false,
                            buttonFoodBev: false,
                            buttonMinyak: false,
                          });
                        }}>
                        <Text style={styles.textButton}>Semua</Text>
                      </TouchableOpacity>
                    )}
                    {this.state.buttonHerbal ? (
                      <TouchableOpacity
                        style={[
                          styles.borderFilter,
                          {backgroundColor: '#529F45'},
                        ]}>
                        <Text style={[styles.textButton, {color: '#fff'}]}>
                          Herbal
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.borderFilter}
                        onPress={() => {
                          this.handleStatusChange('1');
                          this.setState({
                            buttonSemua: false,
                            buttonHerbal: !this.state.buttonHerbal,
                            buttonSupMul: false,
                            buttonFoodBev: false,
                            buttonMinyak: false,
                          });
                        }}>
                        <Text style={styles.textButton}>Herbal</Text>
                      </TouchableOpacity>
                    )}
                    {this.state.buttonSupMul ? (
                      <TouchableOpacity
                        style={[
                          styles.borderFilter,
                          {width: wp('25%'), backgroundColor: '#529F45'},
                        ]}>
                        <Text style={[styles.textButton, {color: '#fff'}]}>
                          Supplemen dan Vitamin
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={[styles.borderFilter, {width: wp('25%')}]}
                        onPress={() => {
                          this.handleStatusChange('2');
                          this.setState({
                            buttonSemua: false,
                            buttonHerbal: false,
                            buttonSupMul: !this.state.buttonSupMul,
                            buttonFoodBev: false,
                            buttonMinyak: false,
                          });
                        }}>
                        <Text style={styles.textButton}>
                          Supplemen dan Vitamin
                        </Text>
                      </TouchableOpacity>
                    )}
                    {this.state.buttonFoodBev ? (
                      <TouchableOpacity
                        style={[
                          styles.borderFilter,
                          {width: wp('25%'), backgroundColor: '#529F45'},
                        ]}>
                        <Text style={[styles.textButton, {color: '#fff'}]}>
                          Makanan dan Minuman
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={[styles.borderFilter, {width: wp('25%')}]}
                        onPress={() => {
                          this.handleStatusChange('3');
                          this.setState({
                            buttonSemua: false,
                            buttonHerbal: false,
                            buttonSupMul: false,
                            buttonFoodBev: !this.state.buttonFoodBev,
                            buttonMinyak: false,
                          });
                        }}>
                        <Text style={styles.textButton}>
                          Makanan dan Minuman
                        </Text>
                      </TouchableOpacity>
                    )}
                    {this.state.buttonMinyak ? (
                      <TouchableOpacity
                        style={[
                          styles.borderFilter,
                          {
                            width: wp('25%'),
                            marginRight: wp('5%'),
                            backgroundColor: '#529F45',
                          },
                        ]}>
                        <Text style={[styles.textButton, {color: '#fff'}]}>
                          Minyak Angin dan Balsem
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={[
                          styles.borderFilter,
                          {width: wp('25%'), marginRight: wp('5%')},
                        ]}
                        onPress={() => {
                          this.handleStatusChange('4');
                          this.setState({
                            buttonSemua: false,
                            buttonHerbal: false,
                            buttonSupMul: false,
                            buttonFoodBev: false,
                            buttonMinyak: !this.state.buttonMinyak,
                          });
                        }}>
                        <Text style={styles.textButton}>
                          Minyak Angin dan Balsem
                        </Text>
                      </TouchableOpacity>
                    )}
                  </ScrollView>
                ) : (
                  // ) : this.props.route.params.screen === 'Herbal' ||
                  //   this.props.route.params.screen === 'SupMul' ||
                  //   this.props.route.params.screen === 'FoodBev' ||
                  //   this.props.route.params.screen === 'Minyak' ? (
                  //   <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  //     <TouchableOpacity
                  //       style={[styles.borderFilter, {marginLeft: wp('5%')}]}
                  //       onPress={() => this.handleStatusChange()}>
                  //       <Text style={styles.textButton}>{'Semua'}</Text>
                  //     </TouchableOpacity>
                  //     <TouchableOpacity
                  //       style={styles.borderFilter}
                  //       onPress={() => this.handleStatusChange('desc')}>
                  //       <Text style={styles.textButton}>{'Terbaru'}</Text>
                  //     </TouchableOpacity>
                  //     {buttonChange ? (
                  //       <TouchableOpacity
                  //         style={[styles.borderFilter, {width: wp('30%')}]}
                  //         onPress={() => this.handleViewChange()}>
                  //         <Text style={styles.textButton}>
                  //           {'Produk Lainnya'}
                  //         </Text>
                  //       </TouchableOpacity>
                  //     ) : (
                  //       <TouchableOpacity
                  //         style={[styles.borderFilter, {width: wp('35%')}]}
                  //         onPress={() => this.handleViewChange()}>
                  //         <Text style={styles.textButton}>
                  //           {'Produk Semut Gajah'}
                  //         </Text>
                  //       </TouchableOpacity>
                  //     )}
                  //   </ScrollView>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {this.state.buttonSemua ? (
                      <TouchableOpacity
                        style={[
                          styles.borderFilter,
                          {marginLeft: wp('5%'), backgroundColor: '#529F45'},
                        ]}>
                        <Text style={[styles.textButton, {color: '#fff'}]}>
                          {'Semua'}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={[styles.borderFilter, {marginLeft: wp('5%')}]}
                        onPress={() => {
                          this.handleStatusChange();
                          this.setState({
                            buttonSemua: !this.state.buttonSemua,
                            buttonTerbaru: !this.state.buttonTerbaru,
                          });
                        }}>
                        <Text style={styles.textButton}>{'Semua'}</Text>
                      </TouchableOpacity>
                    )}
                    {this.state.buttonTerbaru ? (
                      <TouchableOpacity
                        style={[
                          styles.borderFilter,
                          {backgroundColor: '#529F45'},
                        ]}>
                        <Text style={[styles.textButton, {color: '#fff'}]}>
                          {'Terbaru'}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.borderFilter}
                        onPress={() => {
                          this.handleStatusChange('desc');
                          this.setState({
                            buttonSemua: !this.state.buttonSemua,
                            buttonTerbaru: !this.state.buttonTerbaru,
                          });
                        }}>
                        <Text style={styles.textButton}>{'Terbaru'}</Text>
                      </TouchableOpacity>
                    )}
                  </ScrollView>
                )}
              </View>
              {loadingApi ? (
                <LoadingApi />
              ) : (
                <FlatList
                  contentContainerStyle={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'white',
                    paddingBottom: hp('3%'),
                  }}
                  style={{height: '80%'}}
                  keyExtractor={(item, index) => `${index}`}
                  data={this.state.herbal}
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
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
                  renderItem={({item, index}) => {
                    if (
                      this.props.route.params.screen === 'KalenderPromo' ||
                      this.props.route.params.screen === 'HerbalPromo' ||
                      this.props.route.params.screen === 'SupMulPromo' ||
                      this.props.route.params.screen === 'FoodBevPromo' ||
                      this.props.route.params.screen === 'MinyakPromo'
                    ) {
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => {
                            this.postRecent(item),
                              this.props.navigation.navigate(
                                'ProdukDeskripsi',
                                {initial: false},
                                this.props.subsAct(item.product, 'item'),
                              );
                          }}>
                          <Card
                            containerStyle={{
                              borderRadius: wp('1%'),
                              width: wp('90%'),
                              padding: 0,
                              marginTop: wp('1.75%'),
                              // backgroundColor:'red'
                            }}
                            wrapperStyle={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}>
                            <View>
                              {item.product.image ? (
                                <Image
                                  source={{
                                    uri: CONFIG.BASE_URL + item.product.image,
                                  }}
                                  style={styles.imageStyle}
                                />
                              ) : (
                                <DummyImage style={styles.imageStyle} />
                              )}
                            </View>
                            <View style={[styles.textposition]}>
                              <Text
                                numberOfLines={3}
                                multiline
                                style={styles.title}>
                                {item.product.name}
                              </Text>
                              {item?.product?.status_promosi_coret == 1 ? (
                                <NumberFormat
                                  value={
                                    Math.round(
                                      item?.product?.price
                                        ?.harga_promosi_coret_ritel_gt ||
                                        item?.product?.price
                                          ?.harga_promosi_coret_grosir_mt ||
                                        item?.product?.price
                                          ?.harga_promosi_coret_semi_grosir,
                                    ) ?? '0'
                                  }
                                  displayType={'text'}
                                  thousandSeparator={true}
                                  prefix={'Rp '}
                                  renderText={value => (
                                    <Text
                                      numberOfLines={1}
                                      style={[
                                        styles.title,
                                        {
                                          fontSize: hp('1.7%'),
                                          fontFamily: 'Lato-Regular',
                                          marginTop: wp('1%'),
                                        },
                                      ]}>
                                      {value}
                                    </Text>
                                  )}
                                />
                              ) : (
                                <NumberFormat
                                  value={
                                    Math.round(
                                      item?.product?.price?.harga_ritel_gt,
                                    ) ?? '0'
                                  }
                                  displayType={'text'}
                                  thousandSeparator={true}
                                  prefix={'Rp '}
                                  renderText={value => (
                                    <Text
                                      numberOfLines={1}
                                      style={[
                                        styles.title,
                                        {
                                          fontSize: hp('1.7%'),
                                          fontFamily: 'Lato-Regular',
                                          marginTop: wp('1%'),
                                        },
                                      ]}>
                                      {value}
                                    </Text>
                                  )}
                                />
                              )}
                            </View>
                          </Card>
                        </TouchableOpacity>
                      );
                    }
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
                        }}>
                        <Card
                          containerStyle={{
                            borderRadius: wp('1%'),
                            width: wp('90%'),
                            padding: 0,
                            marginTop: wp('1.75%'),
                            // backgroundColor:'red'
                          }}
                          wrapperStyle={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}>
                          <View>
                            {item.image ? (
                              <Image
                                source={{
                                  uri: CONFIG.BASE_URL + item.image,
                                }}
                                style={styles.imageStyle}
                              />
                            ) : (
                              <DummyImage style={styles.imageStyle} />
                            )}
                          </View>
                          <View style={[styles.textposition]}>
                            <Text
                              numberOfLines={3}
                              multiline
                              style={styles.title}>
                              {item.name}
                            </Text>
                            {item?.status_promosi_coret == 1 ? (
                              <NumberFormat
                                value={
                                  Math.round(
                                    item?.price?.harga_promosi_coret_ritel_gt ||
                                      item?.price
                                        ?.harga_promosi_coret_grosir_mt ||
                                      item?.price
                                        ?.harga_promosi_coret_semi_grosir,
                                  ) ?? '0'
                                }
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={'Rp '}
                                renderText={value => (
                                  <Text
                                    numberOfLines={1}
                                    style={[
                                      styles.title,
                                      {
                                        fontSize: hp('1.7%'),
                                        fontFamily: 'Lato-Regular',
                                        marginTop: wp('1%'),
                                      },
                                    ]}>
                                    {value}
                                  </Text>
                                )}
                              />
                            ) : (
                              <NumberFormat
                                value={
                                  Math.round(item?.price?.harga_ritel_gt) ?? '0'
                                }
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={'Rp '}
                                renderText={value => (
                                  <Text
                                    numberOfLines={1}
                                    style={[
                                      styles.title,
                                      {
                                        fontSize: hp('1.7%'),
                                        fontFamily: 'Lato-Regular',
                                        marginTop: wp('1%'),
                                      },
                                    ]}>
                                    {value}
                                  </Text>
                                )}
                              />
                            )}
                          </View>
                        </Card>
                      </TouchableOpacity>
                    );
                  }}
                />
              )}
            </>
          )}
        </View>
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
  dataUser: state.LoginReducer.dataUser,
  qty: state.ShoppingCartReducer.qty,
});

const mapDispatchToProps = dispatch => {
  return {
    notifAct: (value, tipe) => {
      dispatch(NotifAction(value, tipe));
    },
    subsAct: (value, tipe) => {
      dispatch(SubsAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProdukKategori);

const styles = StyleSheet.create({
  container: {
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
    backgroundColor:'#F1F1F1',
  },
  search: {
    position: 'absolute',
    top: wp('-1.5%'),
    right: wp('4%'),
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
  },
  position2: {
    flexDirection: 'row',
    alignItems: 'center',
    height: hp('7%'),
  },
  imageStyle: {
    height: wp('15%'),
    width: wp('15%'),
    backgroundColor: '#F9F9F9',
    borderRadius: Font(10),
  },
  title: {
    fontSize: hp('1.6%'),
    fontFamily: 'Lato-Regular',
    textAlign: 'auto',
    width: wp('60%'),
  },
  textposition: {
    flex: 1,
    paddingHorizontal: 10,
  },
  borderFilter: {
    marginLeft: wp('2%'),
    borderColor: '#DCDCDC',
    borderWidth: 1,
    borderRadius: wp('1%'),
    width: wp('20%'),
    height: hp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // paddingHorizontal: wp('1%'),
    // backgroundColor: 'red'
  },
  textButton: {
    fontSize: hp('1.6%'),
    fontFamily: 'Lato-Medium',
    textAlign: 'center',
    color: '#000',
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
