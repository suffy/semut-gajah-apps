import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TextInput,
  Alert,
  FlatList,
  Pressable,
  Modal,
  RefreshControl,
} from 'react-native';
import {connect} from 'react-redux';
import IconCheck from '../assets/newIcons/iconChecked.svg';
import IconChecked from '../assets/newIcons/iconCheckedActive.svg';
import axios from 'axios';
import CONFIG from '../constants/config';
import {ShoppingCartAction, SubsAction, BannerAction} from '../redux/Action';
import NumberFormat from 'react-number-format';
import IconZeroCart from '../assets/icons/ZeroCart.svg';
import {Card} from 'react-native-elements/dist/card/Card';
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
import {Rating} from 'react-native-elements';
import DummyImage from '../assets/icons/IconLogo.svg';
import IconClose from '../assets/icons/Closemodal.svg';
import ListKeranjang from '../components/ListKeranjang';
import Snackbar from 'react-native-snackbar';
import IconShopping from '../assets/icons/Shopping-Cart.svg';
import IconCart from '../assets/icons/KeranjangActive.svg';
import BottomNavigation from '../components/BottomNavigation';
import ModalAlert from '../components/ModalAlert';
import ModalDelete from '../components/ModalDelete';
import ModalBlackList from '../components/ModalBlackList';
import Header from '../components/Header';
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

function LoadingApi() {
  return (
    <View style={styles.loadingApi}>
      <ActivityIndicator animating size="small" color="#529F45" />
    </View>
  );
}

const width = Dimensions.get('window').width;

export class Keranjang extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.onEndReachedCalledDuringMomentum = false;
    this.state = {
      nilaiMinBelanja: 0,
      selectAll: false,
      isCheck: false,
      shoppingCartItems: [],
      hasilPromo: '',
      hargaPromo: '',
      hasilPromoNotif: '',
      shoppingCart: {
        product_id: '',
        brand_id: '',
        satuan_online: '',
        konversi_sedang_ke_kecil: '',
        qty_konversi: '',
        qty: 1,
        notes: '',
        price_apps: '',
      },
      orderItems: {
        voucher_id: '',
        payment_method: '',
        delivery_service: '',
      },
      notifMessage: 0,
      notifSubscribe: 0,
      notifAllOrder: 0,
      notifAllComplaint: 0,
      notifBroadcast: 0,
      isSemiGrosir: false,
      isGrosir: false,
      isStar: false,
      loading: false,
      loadingMore: false,
      page: 1,
      refreshing: false,
      maxPage: 1,
      loadingApi: true,
      loadingApi2: true,
      recomenProduct: [],
      rating: '1',
      modalVisible: false,
      tempCheck: [],
      visibleButton: true,
      qty: 0,
      tambahan: '',
      alertData: '',
      buttonAlert: '',
      buttonAlertCancel: '',
      modalAlert: false,
      description: '',
      alertDelete: '',
      tambahanDelete: '',
      buttonDeleteCancel: '',
      buttonDelete: '',
      modalDelete: false,
      dataDelete: null,
      dataDelete2: null,
      dataDelete3: null,
      dataPriceList: null,
      visibleModalBlack: false,
      dataHarga: 0,
    };
  }

  getShoppingCart = async () => {
    // const {page} = this.state;
    try {
      // this.setState({reload: true, loading: true});
      // this.setState({tempCheck: []});
      // this.setState({loadingApi: true});
      let response = await axios.get(`${CONFIG.BASE_URL}/api/shopping-cart`, {
        headers: {Authorization: `Bearer ${this.props.token}`},
      });
      const data = response.data.data;
      console.log('dataShopping shopping-cart response', JSON.stringify(data));
      // const newData =
      //   page === 1
      //     ? data.data
      //     : [...this.state.shoppingCartItems, ...data.data];
      const newData = [...data];
      let isGrosir = this.state.isGrosir;
      let isSemiGrosir = this.state.isSemiGrosir;
      let isStar = this.state.isStar;
      // let notif = response.data.promo_result.map((item, index) => {
      //   item.isSelected = true;
      //   return {...item};
      // });
      console.log(JSON.stringify(this.props.dataUser.class));
      if (this.props.dataUser.class === 'SEMI GROSIR') {
        isSemiGrosir = newData.some(i => i.brand_id === '001');
      } else if (this.props.dataUser.class === 'GROSIR') {
        isGrosir = newData.some(i => i.brand_id === '001');
      } else if (this.props.dataUser.class === 'STAR OUTLET') {
        isStar = newData.some(i => i.brand_id === '001');
      }
      console.log('isSemiGrosir', isSemiGrosir);
      console.log('isStar', isStar);
      console.log('isGrosir', isGrosir);
      console.log('this.state.tempCheck', this.state.tempCheck);
      let _tempCheck = [];
      if (this.state.tempCheck.length === 0) {
        console.log('masuk sini 1');
        this.setState({selectAll: false});
        newData.map(item => {
          _tempCheck = [..._tempCheck, {checked: 0}];
          item.checked = false;
          return {...item};
        });
      } else {
        console.log('masuk sini 2');
        // console.log('tracing', this.state.tempCheck);
        // console.log('tracing2', newData);
        newData.map((_, index) => {
          console.log('index', index);
          newData[index]['checked'] =
            this.state.tempCheck[index]?.checked || false; // set the new value
        });
        _tempCheck = this.state.tempCheck;
      }
      console.log('_tempCheck', _tempCheck);
      // console.log('newData', JSON.stringify(newData));
      this.setState({
        loadingApi: false,
        shoppingCartItems: newData,
        // hasilPromo: response.data.promo_result,
        // hargaPromo: response.data.detail,
        // hasilPromoNotif: notif,
        refreshing: false,
        isGrosir: isGrosir,
        isSemiGrosir: isSemiGrosir,
        isStar: isStar,
        // loadingMore: data.last_page > this.state.page,
        // maxPage: data.last_page,
        tempCheck: _tempCheck,
      });
    } catch (error) {
      this.setState({loadingApi: false});
      console.log(error);
      let error429 =
        JSON.parse(JSON.stringify(error)).message ===
        'Request failed with status code 429';
      let errorNetwork =
        JSON.parse(JSON.stringify(error)).message === 'Network Error';
      let error400 =
        JSON.parse(JSON.stringify(error)).message ===
        'Request failed with status code 400';
      console.log(
        'Cek Error===========GetShoppingCart=============',
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
      this.setState({loading: false});
    }
  };

  //pilih salah satu produk
  selectHandler = (index, value) => {
    const newItems = this.state.shoppingCartItems; // clone the array
    let temp = this.state.tempCheck;
    newItems[index].checked = value == 1 ? 0 : 1; // set the new value
    temp[index].checked = value == 1 ? 0 : 1;
    this.setState({shoppingCartItems: newItems}); // set new state
    let result = this.state.shoppingCartItems.every(
      item => {
        return item.checked > 0;
      },
      // ? this.setState({selectAll: true})
      // : this.setState({selectAll: false}),
    );
    result
      ? this.setState({selectAll: true, tempCheck: temp})
      : this.setState({selectAll: false, tempCheck: temp});
    this.setState({isCheck: true, tempCheck: temp});
  };

  //pilih semua produk
  selectHandlerAll = value => {
    const newItems = this.state.shoppingCartItems; // clone the array
    let temp = this.state.tempCheck;
    console.log('ini temp', temp);
    newItems.map((item, index) => {
      console.log('index', index);
      newItems[index]['checked'] = value == true ? 0 : 1; // set the new value
      temp[index]['checked'] = value == true ? 0 : 1;
    });
    this.setState({
      shoppingCartItems: newItems,
      selectAll: value == true ? false : true,
      tempCheck: temp,
    });
  };

  deleteHandler = index => {
    this.setState({
      loading: true,
      alertDelete: 'Apakah yakin ingin menghapus item ini?',
      buttonDelete: 'Hapus',
      modalDelete: !this.state.modalDelete,
      dataDelete: index,
    });
  };

  //update jumlah barang
  quantityHandler = async (action, id) => {
    let items = this.state.shoppingCartItems;
    let accept = false;

    if (action === 'more') {
      items[id].qty = parseInt(items[id].qty) + 1;
      accept = true;
    } else if (action === 'less' && items[id].qty > 1) {
      items[id].qty = parseInt(items[id].qty) - 1;
      accept = true;
    } else {
      this.setState({
        loading: true,
        alertDelete: 'Apakah yakin ingin menghapus item ini?',
        buttonDelete: 'Hapus',
        modalDelete: !this.state.modalDelete,
        dataDelete2: id,
      });
    }

    // if (action === 'more') {
    //   items[id].total_price =
    //     parseInt(items[id].price_apps) * parseInt(items[id].qty);
    // } else if (action === 'less' && items[id].total_price > 0) {
    //   items[id].total_price =
    //     parseInt(items[id].price_apps) * parseInt(items[id].qty);
    // } else {
    //   items[id].total_price = 0;
    // }

    if (accept) {
      this.setState({shoppingCartItems: items}, async () => {
        try {
          let response = await axios.post(
            `${CONFIG.BASE_URL}/api/shopping-cart/${items[id].id}`,
            {
              product_id: items[id].product_id,
              brand_id: items[id].brand_id,
              satuan_online: items[id].satuan_online,
              konversi_sedang_ke_kecil:
                items[id].qty * items[id].konversi_sedang_ke_kecil,
              qty: items[id].qty,
              notes: items[id].notes,
              price_apps: items[id].price_apps,
            },
            {
              headers: {Authorization: `Bearer ${this.props.token}`},
            },
          );
          // const data = response.data.success;
          const data = response.data.data;
          console.log('data tambahkurang===>', response.data);
          console.log('data update===>', JSON.stringify(response.data.data));
          // if (data == true) {
          //   this.getShoppingCart();
          // } else {
          //   console.log('Edit jumlah gagal===>', data);
          // }
          if (response.data['success'] === true) {
            // if (action === 'more') {
            //   items[id].qty = parseInt(items[id].qty) + 1;
            // } else if (action === 'less' && items[id].qty > 1) {
            //   items[id].qty = parseInt(items[id].qty) - 1;
            // }
            const newData = data;
            let isGrosir = this.state.isGrosir;
            let isSemiGrosir = this.state.isSemiGrosir;
            let isStar = this.state.isStar;
            // let notif = response.data.promo_result.map((item, index) => {
            //   item.isSelected = true;
            //   return {...item};
            // });
            console.log(JSON.stringify(this.props.dataUser.class));
            if (this.props.dataUser.class === 'SEMI GROSIR') {
              isSemiGrosir = newData.some(i => i.brand_id === '001');
            } else if (this.props.dataUser.class === 'GROSIR') {
              isGrosir = newData.some(i => i.brand_id === '001');
            } else if (this.props.dataUser.class === 'STAR OUTLET') {
              isStar = newData.some(i => i.brand_id === '001');
            }
            console.log('isSemiGrosir', isSemiGrosir);
            console.log('isStar', isStar);
            console.log('isGrosir', isGrosir);
            let _tempCheck = [];
            if (this.state.tempCheck.length === 0) {
              // console.log('masuk sini 1');
              newData.map(item => {
                _tempCheck = [..._tempCheck, {checked: 0}];
              });
            } else {
              // console.log('masuk sini 2');
              // console.log('tracing', this.state.tempCheck);
              // console.log('tracing2', newData);
              newData.map((_, index) => {
                newData[index]['checked'] = this.state.tempCheck[index].checked; // set the new value
              });
              _tempCheck = this.state.tempCheck;
            }
            console.log('_tempCheck', _tempCheck);
            this.setState((prevState, nextProps) => ({
              loadingApi: false,
              shoppingCartItems: newData,
              // hasilPromo: response.data.promo_result,
              // hargaPromo: response.data.detail,
              // hasilPromoNotif: notif,
              refreshing: false,
              isGrosir: isGrosir,
              isSemiGrosir: isSemiGrosir,
              isStar: isStar,
              // loadingMore: data.last_page > this.state.page,
              // maxPage: data.last_page,
              tempCheck: _tempCheck,
            }));
          } else {
            console.log('message ' + response.data.message);
            this.setState({visibleModalBlack: true});
          }
        } catch (error) {
          console.log(error);
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
          this.setState({loading: false});
        }
      });
    }
  };

  // update quantity input
  getQuantity = (e, id) => {
    let items = this.state.shoppingCartItems;
    if (parseInt(e.nativeEvent.text) < 0) {
      // items[id].qty = parseInt(e.nativeEvent.text) * 0;
      this.setState({
        alertData: 'tidak boleh kurang dari 0',
        modalAlert: !this.state.modalAlert,
      });
      this._isMounted && this.getShoppingCart();
    } else if (
      parseInt(e.nativeEvent.text) == 0 ||
      parseInt(e.nativeEvent.text) == null ||
      parseInt(e.nativeEvent.text) == '' ||
      isNaN(parseInt(e.nativeEvent.text)) ||
      parseInt(e.nativeEvent.text) == 'undefined'
    ) {
      this.setState({
        loading: true,
        alertDelete: 'Apakah yakin ingin menghapus item ini?',
        buttonDelete: 'Hapus',
        modalDelete: !this.state.modalDelete,
        dataDelete2: id,
      });
    } else {
      // items[id].qty = e.nativeEvent.text;
      items[id].qty = parseInt(e.nativeEvent.text);
      this.setState({shoppingCartItems: items}, async () => {
        try {
          let response = await axios.post(
            `${CONFIG.BASE_URL}/api/shopping-cart/${items[id].id}`,
            {
              product_id: items[id].product_id,
              brand_id: items[id].brand_id,
              satuan_online: items[id].satuan_online,
              konversi_sedang_ke_kecil: items[id].konversi_sedang_ke_kecil,
              qty_konversi: items[id].qty * items[id].konversi_sedang_ke_kecil,
              qty: items[id].qty,
              notes: items[id].notes,
              price_apps: items[id].price_apps,
            },
            {
              headers: {Authorization: `Bearer ${this.props.token}`},
            },
          );
          this._isMounted && this.getShoppingCart();
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
      });
    }
  };

  //update catatan
  notesHandler = (e, id) => {
    let items = this.state.shoppingCartItems;
    items[id].notes = e.nativeEvent.text;

    this.setState({shoppingCartItems: items}, async () => {
      try {
        let response = await axios.post(
          `${CONFIG.BASE_URL}/api/shopping-cart/${items[id].id}`,
          {
            product_id: items[id].product_id,
            brand_id: items[id].brand_id,
            satuan_online: items[id].satuan_online,
            konversi_sedang_ke_kecil: items[id].konversi_sedang_ke_kecil,
            qty_konversi: items[id].qty * items[id].konversi_sedang_ke_kecil,
            qty: items[id].qty,
            notes: items[id].notes,
            price_apps: items[id].price_apps,
          },
          {
            headers: {Authorization: `Bearer ${this.props.token}`},
          },
        );
        const data = response.data;
        if (data === '' || !data['success']) {
          this.setState({
            alertData: 'Gagal menambahkan catatan',
            modalAlert: !this.state.modalAlert,
          });
          console.log('Edit catatan gagal===>', data);
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
    });
  };

  //hitung total jumlah harga
  subtotalPrice = () => {
    if (this.state.shoppingCartItems) {
      return this.state.shoppingCartItems.reduce(
        (sum, item) => sum + (item.checked == 1 ? Number(item.total_price) : 0),
        0,
      );
    }
    return 0;
  };

  filterChecked() {
    let result = this.state.shoppingCartItems.filter(item => {
      return item.checked === 1;
    });
    return result;
  }

  filterChecked2() {
    let result = this.state.hasilPromo.filter(item => {
      return item.promo_status === 1;
    });
    return result;
  }

  postBuyShoppingCart = async () => {
    let isZero = false;
    let isMinbuy = false;
    let minPembelian = 0;
    let filtered = this.filterChecked();
    // let filtered2 = this.filterChecked2();
    let arrChecked = filtered.map(function (item) {
      // console.log('itemqty',item.qty,'itemMin',item.min_pembelian)
      console.log('cek isi====', item);
      minPembelian =
        (item.min_pembelian === '' || item.min_pembelian === null) ?? 1;
      return {
        id: item.id,
        user_id: item.user_id,
        product_id: item.product_id,
        promo_id: item.promo_id,
        satuan_online: item.satuan_online,
        // large_unit: item.large_unit,
        // medium_unit: item.medium_unit,
        // small_unit: item.small_unit,
        konversi_sedang_ke_kecil: item.konversi_sedang_ke_kecil,
        qty_konversi: item.qty_konversi,
        qty: item.qty,
        price_apps: item.price_apps,
        total_price: item.total_price,
        notes: item.notes,
        session: item.session,
        // data: item.data,
        created_at: item.created_at,
        updated_at: item.updated_at,
        deleted_at: item.deleted_at,
        status: item.status,
        brand_id: item.brand_id,
        name: item.name,
        image: item.image,
        min_pembelian: item.min_pembelian,
        order_discount: item.order_discount,
        status_herbana: item.status_herbana,
        status_promosi_coret: item.status_promosi_coret,
      };
    });

    isMinbuy = arrChecked.every(
      val =>
        val.qty >=
        ((val.min_pembelian === '' || val.min_pembelian === null) ?? 1),
    );
    isZero = arrChecked.every(i => i.qty >= 1);
    console.log('cek cek====', isZero, isMinbuy);
    // let promoChecked = filtered2.map(item => {
    //   return {
    //     promo_id: item.promo_id,
    //     promo_reward: item.promo_reward,
    //     // promo_reward: item.promo_reward.map((item2) =>{
    //     //   return {
    //     //     promo_potongan : item2.nominal,
    //     //     promo_disc : item2.disc,
    //     //     product : item2.product,
    //     //   }
    //     // })
    //   };
    // });
    // console.log('cek isi promo====', promoChecked);
    if (isZero && isMinbuy) {
      // this.props.shopAct(promoChecked, 'promo');
      this.props.shopAct(this.subtotalPrice(), 'shop_total');
      console.log(
        'cek isi shoppingcart====',
        JSON.stringify({data: arrChecked}),
      );
      let response = await axios({
        method: 'post',
        url: `${CONFIG.BASE_URL}/api/orders/count`,
        headers: {Authorization: `Bearer ${this.props.token}`},
        data: {data: arrChecked},
      })
        .then(response => {
          const data = response.data;
          console.log(
            'count=================================================',
            JSON.stringify(data),
          );
          if (data['success'] == true) {
            if (data.validate_price?.length > 0) {
              let _data = data.validate_price;
              console.log("Data validate price "+JSON.stringify(_data));
              this.getPopUp(_data);
            } else {
              // let arr = data.promo_result.map((item, index) => {
              //   item.isSelected = false;
              //   return {...item};
              // });
              this.setState({
                selectAllItem: false,
                selectAll: false,
              });
              this.props.shopAct(data.promo_result, 'hasilPromo');
              this.props.shopAct(data.promo_result, 'hasilPromoNotif');
              this.props.shopAct(data.detail, 'hargaPromo');
              this.props.shopAct(data.shopping_carts, 'shop');
              this.props.shopAct(data.credit_limit, 'kredit');
              this.props.navigation.navigate('Delivery');
            }
          } else if (data.message === 'Anda Masuk Dalam Daftar Blacklist') {
            this.setState({visibleModalBlack: true});
          } else {
            console.log('Munculkan modal');
            this.showSnackbarMaintenance({text: data.message});
          }
        })
        .catch(error => {
          let error429 =
            JSON.parse(JSON.stringify(error)).message ===
            'Request failed with status code 429';
          let errorNetwork =
            JSON.parse(JSON.stringify(error)).message === 'Network Error';
          let error400 =
            JSON.parse(JSON.stringify(error)).message ===
            'Request failed with status code 400';
          console.log(
            'Cek Error========================701',
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
    } else if (!isMinbuy && isZero) {
      this.setState({
        alertData: 'Minimal pembelian produk ini berjumlah ' + minPembelian,
        modalAlert: !this.state.modalAlert,
      });
    } else if (!isZero && isMinbuy) {
      this.setState({
        alertData: 'Jumlah tidak boleh kosong',
        modalAlert: !this.state.modalAlert,
      });
    } else if (!isZero && !isMinbuy) {
      this.setState({
        alertData: 'Jumlah tidak boleh kosong',
        modalAlert: !this.state.modalAlert,
      });
    }
  };

  getPopUp = async data => {
    await this.setState({
      tambahan: 'Order gagal! harga telah berubah',
      alertData: 'Update keranjang sekarang?',
      buttonAlert: 'Perbarui',
      buttonAlertCancel: 'Batal',
      modalAlert: !this.state.modalAlert,
      dataPriceList: data,
      loading: true,
    });
    console.log('data=====', data);
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
        return count
      } else {
        return 0
      }
    } catch (error) {
      console.log(error);
    }
  };

  // UNSAFE_componentWillMount = async () => {
  // lor(this);
  // this._isMounted = true;
  // this._isMounted && (await this.getShoppingCart());
  // this._isMounted && (await this.getProdukRecomen());
  // this._isMounted && (await this.getNotifAll());
  // };

  componentDidMount = () => {
    this._isMounted = true;
    // this.setState({refreshing:true})
    this.getShoppingCart();
    this.getNotifAll();
    this.getProdukRecomen();
    this.getMinimunBelanja();
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.getShoppingCart();
      this.getNotifAll();
    });
  };

  componentWillUnmount() {
    // rol();
    this._isMounted = false;
    // this.focusListener();
  }

  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        refreshing: true,
      },
      () => {
        this.getShoppingCart();
        this.getProdukRecomen();
        this.getNotifAll();
      },
    );
  };

  handleLoadMore = async () => {
    if (
      !this.onEndReachedCalledDuringMomentum &&
      this.state.page < this.state.maxPage
    ) {
      await this.setState(
        {
          page: this.state.page + 1,
          loadingMore: this.state.page < this.state.maxPage,
        },
        () => {
          this.getShoppingCart();
        },
      );
      this.onEndReachedCalledDuringMomentum =
        this.state.page >= this.state.maxPage;
    }
  };

  getProdukRecomen = async () => {
    try {
      let response = await axios.get(
        `${CONFIG.BASE_URL}/api/recomen/products`,
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      console.log('recoment', response.data);
      const data = response.data.data.data;
      // const dataTotal = response.data.data.total;
      this.setState({
        loadingApi2: false,
        loadingApi: false,
        recomenProduct: data,
        // qtyTotalRecomen: response.data.data.total,
      });
    } catch (error) {
      console.log('5');
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
        'Cek Error==========Recomen==============',
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

  showModal = () => {
    this.setState({
      modalVisible: true,
    });
    // setTimeout(() => {
    //   this.setState({
    //     modalVisible: false,
    //     // tempCheck: [],
    //     // shoppingCartItems: [],
    //   });
    //   // this.getShoppingCart();
    //   console.log('masuk masuk masuk');
    // }, 3000);
    // return () => {
    //   clearTimeout(this.setWaktu);
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
            this.state.shoppingCart.qty * item.konversi_sedang_ke_kecil,
          qty: this.state.shoppingCart.qty,
          notes: this.state.shoppingCart.notes,
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
  closeModalBlacklist() {
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
        'Cek Error=========PostRecent===============',
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

  changeSelected = index => {
    const {hasilPromoNotif} = this.state;
    let arr = hasilPromoNotif.map((val, i) => {
      if (index == i) {
        val.isSelected = false;
      }
      return {...val};
    });
    console.log('arr================', arr);
    this.setState({hasilPromoNotif: arr});
  };

  showSnackbarBusy = () => {
    this._isMounted && this.setState({visibleButton: false});
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
          this._isMounted && this.getShoppingCart();
          this._isMounted && this.setState({visibleButton: true});
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
          this._isMounted && this.getShoppingCart();
          this._isMounted && this.setState({visibleButton: true});
        },
      },
    });
  };

  showSnackbarMaintenance = props => {
    this._isMounted && this.setState({visibleButton: false});
    Snackbar.show({
      text: props.text,
      //You can also give duration- Snackbar.LENGTH_SHORT, Snackbar.LENGTH_LONG
      duration: Snackbar.LENGTH_INDEFINITE,
      //color of snakbar
      backgroundColor: '#17a2b8',
      //color of text
      textColor: 'white',
      //action
      action: {
        text: 'ok',
        textColor: 'white',
        onPress: () => {
          this._isMounted && this.getShoppingCart();
          this._isMounted && this.setState({visibleButton: true});
        },
      },
    });
  };

  getPromo = async (item, status) => {
    console.log('cekkkkk', item, status);
    try {
      let response = await axios({
        method: 'get',
        headers: {Authorization: `Bearer ${this.props.token}`},
        url: `${CONFIG.BASE_URL}/api/promo?id=${item}&product_id=${status}`,
      });
      const data = response.data;
      // console.log('data getPromo',JSON.stringify(data.data));
      if (data != 0 && data['success'] == true) {
        // this.props.navigation.navigate(
        //   'DetailPromo',
        //   this.props.bannerAct(data.data, 'banner'),
        // );
        this.setState({description: data.data});
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

  getCloseAlertModal = async e => {
    const {dataPriceList} = this.state;
    if (
      !e &&
      dataPriceList &&
      this.state.alertData == 'Update keranjang sekarang?'
    ) {
      try {
        let response = await axios.post(
          `${CONFIG.BASE_URL}/api/shopping-cart/validate`,
          {
            validate_price: dataPriceList,
          },
          {
            headers: {Authorization: `Bearer ${this.props.token}`},
          },
        );
        const dataIsi = response.data.success;
        console.log('data Valid keranjang===>', JSON.stringify(response.data));
        if (dataIsi == true) {
          this.setState({loading: false}, () => {
            this.getShoppingCart();
          });
        } else {
          console.log('data gagal===>', dataIsi);
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
    } else {
      this.getShoppingCart();
    }
    this.setState({modalAlert: !this.state.modalAlert, dataPriceList: null});
  };

  getCloseDescription() {
    this.setState({description: ''});
  }

  getCloseModalDelete = async e => {
    const {dataDelete, dataDelete2, shoppingCartItems} = this.state;
    const newItems = [...shoppingCartItems]; // clone the array
    // console.log('items nih2===', newItems);
    console.log('dataDelete', dataDelete);
    console.log('dataDelete2', dataDelete2);
    console.log('eeeeeee', e);
    if (
      !e &&
      dataDelete != null &&
      this.state.alertDelete == 'Apakah yakin ingin menghapus item ini?'
    ) {
      console.log('masuk 1');
      console.log('masuk 1', dataDelete.id);
      try {
        let response = await axios.delete(
          `${CONFIG.BASE_URL}/api/shopping-cart/${dataDelete.id}`,
          {
            headers: {Authorization: `Bearer ${this.props.token}`},
          },
        );
        const data = response.data.success;
        console.log('data delete===>', data);
        if (data == true) {
          this.setState(
            {
              loading: false,
              dataDelete: null,
              tempCheck: [],
            },
            () => {
              this.getShoppingCart();
            },
          );
        } else {
          console.log('data gagal dihapus===>', data);
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
          'Cek Error==========getCloseModalDelete==============',
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
    } else if (
      e &&
      dataDelete2 != null &&
      dataDelete == null &&
      this.state.alertDelete == 'Apakah yakin ingin menghapus item ini?'
    ) {
      console.log('masuk 2');
      newItems[dataDelete2].qty = 'load...';
      await this.setState(
        {
          shoppingCartItems: newItems,
          dataDelete2: null,
          tempCheck: [],
        },
        () => this.getShoppingCart(),
      );
    } else if (
      !e &&
      dataDelete2 != null &&
      dataDelete == null &&
      this.state.alertDelete == 'Apakah yakin ingin menghapus item ini?'
    ) {
      console.log('masuk 3');
      try {
        let response = await axios.delete(
          `${CONFIG.BASE_URL}/api/shopping-cart/${newItems[dataDelete2].id}`,
          {
            headers: {Authorization: `Bearer ${this.props.token}`},
          },
        );
        const data = response.data.success;
        console.log('data delete===>', response.data);
        if (data == true) {
          this.setState(
            {
              loading: false,
              dataDelete2: null,
              tempCheck: [],
            },
            () => {
              this.getShoppingCart();
            },
          );
        } else {
          console.log('data gagal dihapus===>', data);
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
          'Cek Error========getCloseModalDelete2================',
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
    }
    this.setState({
      modalDelete: !this.state.modalDelete,
      buttonDelete: '',
    });
  };

  async getMinimunBelanja() {
    try {
      let response = await axios.get(
        `${CONFIG.BASE_URL}/api/minimum-transaction/${this.props.dataUser?.site_code}`,
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      const data = response.data;
      // console.log("data 1597 "+JSON.stringify(data));
      if (data['success'] == true) {
        this.setState({
          nilaiMinBelanja: data?.data[0]?.min_transaction || 0,
        });
      } else {
        console.log('gagal');
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
        'Cek Error=========PostRecent===============',
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
  }

  cekMinBelanja() {
    // console.log('MINIMAL BELANJA ADALAH ' + this.state.nilaiMinBelanja);
    const nilaiMinBelanja = this.state.nilaiMinBelanja;
    let minOrder =
      Math.round(nilaiMinBelanja) - Math.round(this.subtotalPrice());
    if (
      Math.round(nilaiMinBelanja) <= Math.round(this.subtotalPrice()) ||
      Math.round(this.subtotalPrice()) == 0
    ) {
      return this.subtotalPrice();
    } else {
      return minOrder;
    }
  }
  funMinBuy() {
    const number = this.state.nilaiMinBelanja;
    this.setState({
      alertData: 'Mininal order adalah ',
      dataHarga: number,
      modalAlert: !this.state.modalAlert,
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
    const {
      shoppingCartItems,
      nilaiMinBelanja,
      selectAll,
      rating,
      tempCheck,
      loadingApi,
      qty,
    } = this.state;
    return (
      <View style={{flex: 1, backgroundColor: 'white',}}>
        <ModalDelete
          modalDelete={this.state.modalDelete}
          tambahanDelete={this.state.tambahanDelete}
          alertDelete={this.state.alertDelete}
          buttonDelete={this.state.buttonDelete}
          getCloseModalDelete={e => this.getCloseModalDelete(e)}
        />
        <ModalAlert
          modalAlert={this.state.modalAlert}
          tambahan={this.state.tambahan}
          alert={this.state.alertData}
          nominal={this.state.dataHarga}
          buttonAlert={this.state.buttonAlert}
          buttonAlertCancel={this.state.buttonAlertCancel}
          getCloseAlertModal={e => this.getCloseAlertModal(e)}
        />
        <Header 
        title="Keranjang"
        navigation={this.props.navigation}
        notif={true}
        notifCount={this.renderCountNotificationBadge()}
        cart={true}
        cartCount={qty}
        menu={true}
        />
        {/* {this.keranjangRoute()} */}
        {/* {Kelas Grosir} */}
        {this.state.isGrosir ? (
          <Card containerStyle={styles.cardBackground}>
            <Text style={styles.promoText}>
              {
                'Anda terdaftar sebagai kelas GROSIR. Sehingga mendapatkan diskon sebesar 4.5% pada brand DELTOMED'
              }
            </Text>
            <IconClose
              fill={'white'}
              width={wp('3%')}
              height={hp('2%')}
              style={[styles.closePromo]}
              onPress={() => {
                this.setState({
                  isGrosir: '',
                });
              }}
            />
          </Card>
        ) : null}
        {this.state.isStar ? (
          <Card containerStyle={styles.cardBackground}>
            <Text style={styles.promoText}>
              {
                'Anda terdaftar sebagai kelas STAR OUTLET. Sehingga mendapatkan diskon sebesar 4.5% pada brand DELTOMED'
              }
            </Text>
            <IconClose
              fill={'white'}
              width={wp('3%')}
              height={hp('2%')}
              style={[styles.closePromo]}
              onPress={() => {
                this.setState({
                  isStar: '',
                });
              }}
            />
          </Card>
        ) : null}
        {this.state.isSemiGrosir ? (
          <Card containerStyle={styles.cardBackground}>
            <Text style={styles.promoText}>
              {
                'Anda terdaftar sebagai kelas SEMI GROSIR. Sehingga mendapatkan diskon sebesar 3% pada brand DELTOMED'
              }
            </Text>
            <IconClose
              fill={'white'}
              width={wp('3%')}
              height={hp('2%')}
              style={[styles.closePromo]}
              onPress={() => {
                this.setState({
                  isSemiGrosir: '',
                });
              }}
            />
          </Card>
        ) : null}
        {!loadingApi && shoppingCartItems.length > 0 ? (
          <>
            <View style={styles.container2}>
              <TouchableOpacity
                style={
                  ([styles.posision],
                  {
                    width: wp('5.5%'),
                    // height: wp('5.5%'),
                    padding: wp('0%'),
                    marginLeft: wp('5%'),
                    marginRight: wp('3%'),
                    
                  })
                }
                onPress={() => this.selectHandlerAll(this.state.selectAll)}>
                {this.state.selectAll === true &&
                shoppingCartItems.every(item => item.checked === 1) ? (
                  <IconChecked
                    width={wp('7%')}
                    height={wp('7%')}
                    label="checked"
                  />
                ) : (
                  <IconCheck
                    width={wp('7%')}
                    height={wp('7%')}
                    label="check"
                  />
                )}
              </TouchableOpacity>
              <Text
                style={{
                  paddingLeft: wp('2%'),
                  fontSize: hp('1.6%'),
                  fontFamily: 'Lato-Medium',
                  color:'#575251'
                }}>
                {'Pilih Semua'}
              </Text>
            </View>

            <ScrollView style={{marginBottom:hp('17%')}}>
              {/* {loadingApi ? (
                <LoadingApi />
              ) : (
                
              )} */}
              <ListKeranjang
                data={shoppingCartItems}
                dataUser={this.props.dataUser}
                selectAll={this.state.selectAll}
                quantityHandler={(type, index) =>
                  this.quantityHandler(type, index)
                }
                notesHandler={(ev, index) => this.notesHandler(ev, index)}
                getQuantity={(ev, index) => this.getQuantity(ev, index)}
                selectHandler={(index, item) => this.selectHandler(index, item)}
                deleteHandler={(item, index) => this.deleteHandler(item)}
                visibleButton={this.state.visibleButton}
                getPromo={(item, status) => this.getPromo(item, status)}
                description={this.state.description}
                getCloseDescription={() => this.getCloseDescription()}
              />

              <View>
                {/* {this.renderFooter()} */}
                {/* <Text>list footer</Text> */}
                {this.state.recomenProduct.length !== 0 ? (
                  <View style={styles.container}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={[styles.title,{color:"#575251"}]}>{'Produk Rekomendasi'}</Text>
                    </View>
                     <CardProduk
                      onClick={item => this.clickCard(item)}
                      data={this.state.recomenProduct}
                      postShoppingCart={item =>this.postShoppingCart(item)
                      }
                      // qtyTotal={qtyTotalRecomen}
                      // onClickAll={() => this.onClickAll('Herbal')}
                    />
                    {/* <ScrollView
                      contentContainerStyle={{
                        paddingLeft: wp('10%'),
                        paddingRight: wp('5%'),
                      }}
                      horizontal
                      onScroll={this.change}
                      showsHorizontalScrollIndicator={false}
                      style={styles.scroll}>
                      {this.state.recomenProduct.map((item, index) => {
                        return (
                          <TouchableOpacity
                            key={index}
                            onPress={() => {
                              this.postRecent(item),
                                this.props.navigation.navigate(
                                  'ProdukDeskripsi',
                                  // {initial: false},
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
                                onPress={async () => {
                                  await this.postShoppingCart(item);
                                }}>
                                <Text style={styles.textKeranjang}>
                                  {'Tambah'}
                                </Text>
                              </Pressable>
                            ) : (
                              <Pressable
                                style={styles.buttonKeranjang}
                                onPress={async () => {
                                  await this.postShoppingCart(item);
                                }}>
                                <Text style={styles.textKeranjang}>
                                  {'Beli'}
                                </Text>
                              </Pressable>
                            )}
                          </TouchableOpacity>
                        );
                      })}
                      
                    </ScrollView> */}
                  </View>
                ) : (
                  <LoadingApi />
                )}
              </View>
            </ScrollView>
            <View style={styles.container3}>
              <View
                style={{
                  flexDirection: 'column',
                  marginLeft: wp('5%'),
                }}>
                {Math.round(nilaiMinBelanja) <=
                  Math.round(this.subtotalPrice()) ||
                Math.round(this.subtotalPrice()) == 0 ? (
                  <>
                    <Text style={[styles.textTotalHarga]}>{'Total Harga'}</Text>
                    <NumberFormat
                      value={Math.round(this.subtotalPrice())}
                      displayType={'text'}
                      thousandSeparator={true}
                      prefix={'Rp '}
                      renderText={value => (
                        <Text style={styles.textHarga}>{value}</Text>
                      )}
                    />
                  </>
                ) : (
                  <>
                    <NumberFormat
                      value={Math.round(nilaiMinBelanja)}
                      displayType={'text'}
                      thousandSeparator={true}
                      prefix={'Rp '}
                      renderText={value => (
                        <Text style={[styles.textTotalHarga]}>
                          {'Minimal order ' + value}
                        </Text>
                      )}
                    />

                    <NumberFormat
                      value={Math.round(this.cekMinBelanja())}
                      displayType={'text'}
                      thousandSeparator={true}
                      prefix={'-Rp '}
                      renderText={value => (
                        <Text style={styles.textHarga}>{value}</Text>
                      )}
                    />
                  </>
                )}
              </View>
              {this.state.visibleButton ? (
                <>
                  {this.state.selectAll === true ||
                  shoppingCartItems.find(item => item.checked === 1) ? (
                    <TouchableOpacity
                      style={[styles.ButtonBeli]}
                      onPress={() =>
                        Math.round(nilaiMinBelanja) <=
                        Math.round(this.subtotalPrice())
                          ? this.postBuyShoppingCart()
                          : this.funMinBuy()
                      }>
                      <Text
                        style={{
                          color: '#FFFFFF',
                          fontSize: hp('1.8%'),
                          fontFamily: 'Lato-Medium',
                        }}>
                        {'Beli'}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.ButtonBeli}
                      onPress={() =>
                        this.setState({
                          alertData: 'Harap Memilih Produk Diatas',
                          modalAlert: !this.state.modalAlert,
                        })
                      }>
                      <Text
                        style={{
                          color: '#FFFFFF',
                          fontSize: hp('1.8%'),
                          fontFamily: 'Lato-Medium',
                        }}>
                        {'Beli'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : null}
            </View>
          </>
        ) : !loadingApi && shoppingCartItems.length == 0 ? null : loadingApi &&
          shoppingCartItems.length == 0 ? (
          <LoadingApi />
        ) : null}

        {!loadingApi && shoppingCartItems.length == 0 && (
          <View
            style={{
              alignItems: 'center',
              marginTop: hp('10%'),
              flex: 1,
            }}>
            <IconZeroCart width={wp('80%')} height={hp('60%')} />
            <Text
              style={{
                fontSize: hp('2%'),
                fontFamily: 'Lato-Medium',
                textAlign: 'center',
                marginTop: hp('-10%'),
              }}>
              Wah, keranjang mu kosong
            </Text>
            <Text
              style={{
                fontSize: hp('1.8%'),
                fontFamily: 'Lato-Medium',
                width: wp('65%'),
                textAlign: 'center',
                marginTop: wp('2%'),
              }}>
              Yuk, isi dengan barang-barang yang ingin kamu beli
            </Text>
            <TouchableOpacity
              style={[styles.belanjaButton, {marginTop: wp('2%')}]}
              onPress={() => this.props.navigation.navigate('Produk')}>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: hp('1.8%'),
                  fontFamily: 'Lato-Medium',
                }}>
                {'Mulai Belanja'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() =>
            this.setState(
              {
                modalVisible: !this.state.modalVisible,
                tempCheck: [],
                // recomenProduct: [],
              },
              () => {
                this.getNotifAll();
                this.getShoppingCart();
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
                  style={[styles.buttonToKeranjang]}
                  onPress={() =>
                    this.setState(
                      {
                        modalVisible: !this.state.modalVisible,
                        tempCheck: [],
                        // recomenProduct: [],
                      },
                      () => {
                        this.getNotifAll();
                        this.getShoppingCart();
                        this.getProdukRecomen();
                      },
                    )
                  }>
                  <Text style={[styles.textStyle]}>{'Kembali'}</Text>
                </Pressable>
                {/* <Pressable
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
                        tempCheck: [],
                        // shoppingCartItems: [],
                      },
                      () => {
                        this._isMounted && this.getShoppingCart();
                        this._isMounted && this.getNotifAll();
                      },
                    )
                  }>
                  <Text style={styles.textStyle}>{'Lihat Keranjang'}</Text>
                </Pressable> */}
              </View>
            </View>
          </View>
        </Modal>
        <ModalBlackList
          modalVisible={this.state.visibleModalBlack}
          getCloseAlertModal={() => this.closeModalBlacklist()}
        />
        <BottomNavigation
          navigation={this.props.navigation}
          nameRoute="Keranjang"
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
  dataUser: state.LoginReducer.dataUser,
  item: state.SubscribeReducer.item,
});

const mapDispatchToProps = dispatch => {
  return {
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

export default connect(mapStateToProps, mapDispatchToProps)(Keranjang);

const styles = StyleSheet.create({
  posisionTextTitle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: wp('5%'),
  },
  containerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: hp('8%'),
    backgroundColor: 'white',
    borderBottomWidth: 4,
    borderColor: '#ddd',
  },
  textHeader: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('2.8%'),
    paddingLeft: wp('5%'),
  },
  buttonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp('25%'),
  },
  posision: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container2: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: hp('5%'),
  },
  iconplus: {
    borderWidth: 1,
    borderColor: '#cccccc',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFEEA',
    borderTopRightRadius: hp('1%'),
    borderBottomRightRadius: hp('1%'),
    width: wp('6.5%'),
    marginLeft: wp('-0.5%'),
  },
  iconminus: {
    borderWidth: 1,
    borderColor: '#cccccc',
    backgroundColor: '#FFFEEA',
    borderTopLeftRadius: hp('1%'),
    borderBottomLeftRadius: hp('1%'),
    width: wp('6.5%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('-0.2%'),
  },
  containerInput: {
    overflow: 'hidden',
    paddingBottom: hp('2%'),
    paddingHorizontal: wp('2%'),
  },
  containerItemKeranjang: {
    // flex:1,
    flexDirection: 'column',
    marginBottom: hp('1%'),
    // backgroundColor: '#F9F9F9',
    backgroundColor: '#FFFFFF',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: hp('1.5%'),
    elevation: 2,
  },
  container3: {
    position: 'absolute',
    width: '100%',
    bottom:0,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    paddingBottom:hp('9.5%'),
    // flex: 1,
    // paddingTop: hp('1.5%'),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textTotalHarga: {
    color:"#575251",
    fontFamily: 'Lato-Medium',
    fontSize: hp('2%'),
    paddingTop: hp('1.5%'),
    fontWeight: 'bold',
  },
  textHarga: {
    color:"#575251",
    fontSize: hp('2.6%'),
    fontFamily: 'Lato-Medium',
    // marginTop: hp('2%'),
    marginBottom: hp('1%'),
    // fontWeight:'bold'
  },
  ButtonBeli: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#51AF3E',
    width: wp('20%'),
    height: hp('5%'),
    borderRadius: wp('10%'),
    marginRight: wp('7%'),
  },
  belanjaButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#529F45',
    width: wp('40%'),
    height: hp('5%'),
    borderRadius: hp('1.5%'),
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
    marginRight: wp('4%'),
  },
  containerViewFlatlist: {
    // paddingVertical: hp('6%'),
    flex: 1,
    width: wp('100%'),
    // backgroundColor: '#F8F8F8',
    // height: hp('1%'00),
    alignSelf: 'center',
  },
  textLoading: {
    backgroundColor: 'white',
    fontSize: hp('2%'),
    fontFamily: 'Lato-Medium',
    height: hp('4%'),
    justifyContent: 'center',
    textAlign: 'center',
  },
  cardBackground: {
    backgroundColor: '#529F45',
    width: wp('96%'),
    height: hp('9.5%'),
    marginLeft: wp('2%'),
    borderColor: '#F9F9F9',
    borderWidth: wp('0%'),
    justifyContent: 'center',
    borderRadius: hp('1.5%'),
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
    marginLeft: wp('1%'),
    width: wp('78%'),
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

  container: {
    height: hp('45%'),
    backgroundColor: '#F4F4F4',
    // backgroundColor: 'red',
    elevation: 2,
    // marginHorizontal: wp('-5%'),
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
    color:"#575251",
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
    paddingLeft: wp('10%'),
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
    marginTop:hp('1%'),
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
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    width: wp('100%'),
    marginTop: hp('10%'),
    // height: hp('100%'),
    // position: 'absolute',
    // top:hp('-50%')
  },
});
