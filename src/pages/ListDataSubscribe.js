import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from 'react-native';
import {connect} from 'react-redux';
import Trash from '../assets/icons/Trash.svg';
import Size from '../components/Fontresponsive';
import axios from 'axios';
import NumberFormat from 'react-number-format';
import CONFIG from '../constants/config';
import {SubsAction} from '../redux/Action';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Storage from '@react-native-async-storage/async-storage';
import IconBack from '../assets/icons/backArrow.svg';
import DummyImage from '../assets/icons/IconLogo.svg';
import Snackbar from 'react-native-snackbar';
import ModalDelete from '../components/ModalDelete';

const listDataSubscribe = [
  {
    id: '',
    product_id: '',
    qty: '',
    time: '',
    product: {
      brand_id: '',
      image: '',
      name: '',
      price: {
        small_retail: '',
        price_apps: '',
      },
    },
    alertDelete: '',
    tambahanDelete: '',
    buttonDeleteCancel: '',
    buttonDelete: '',
    modalDelete: false,
    dataDelete: [],
  },
];

const deleteSubscribe = [
  {
    id: '',
    product_id: '',
    qty: '',
    time: '',
    notes: '',
    status: '',
  },
];

export class ListDataSubscribe extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.onEndReachedCalledDuringMomentum = false;
    this.state = {
      listSubscribe: this.props.listDataSubscribe,
      deleteSubscribe: deleteSubscribe,
      page: 1,
      loadingMore: false,
      refreshing: false,
      maxPage: 1,
    };
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.getDataSubscribe();
    });
  }

  // UNSAFE_componentWillMount() {
  //   // lor(this);
  // }

  componentWillUnmount() {
    // rol()
    // this.focusListener();
  }

  //data subscribe
  getDataSubscribe = async () => {
    const {page} = this.state;
    try {
      let response = await axios.get(
        `${CONFIG.BASE_URL}/api/subscribes?type=2_week&page=${page}`,
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      const data = response.data.data;
      this.setState(prevState => ({
        listSubscribe:
          page === 1 ? data.data : [...this.state.listSubscribe, ...data.data],
        refreshing: false,
        loadingMore: data.last_page > this.state.page,
        maxPage: data.last_page,
      }));
      if (this.state.listSubscribe.length == 0) {
        this.props.navigation.goBack();
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

  //load more data
  getMoreSubscribe = () => {
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
          this.getDataSubscribe();
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
        this.getDataSubscribe();
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

  getCloseModalDelete = async e => {
    const {dataDelete} = this.state;
    this.setState({modalDelete: !this.state.modalDelete, buttonDelete: ''});
    if (
      !e &&
      dataDelete &&
      this.state.alertDelete == 'Apakah yakin ingin menghapus item ini?'
    ) {
      try {
        let response = await axios.delete(
          `${CONFIG.BASE_URL}/api/subscribe/${dataDelete.id}`,
          {
            headers: {Authorization: `Bearer ${this.props.token}`},
          },
        );
        const data = response.data;
        console.log(response.data);
        if (data['success'] == true) {
          this.getDataSubscribe();
        } else {
          console.log('Gagal menghapus data===>', data);
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
    }
  };

  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <ModalDelete
          modalDelete={this.state.modalDelete}
          tambahanDelete={this.state.tambahanDelete}
          alertDelete={this.state.alertDelete}
          buttonDelete={this.state.buttonDelete}
          getCloseModalDelete={e => this.getCloseModalDelete(e)}
        />
        <View style={[styles.container]}>
          <IconBack
            width={wp('4%')}
            height={hp('4%')}
            stroke="black"
            strokeWidth="2.5"
            fill="black"
            onPress={() => this.props.navigation.goBack()}
          />
          <Text style={styles.text}>{'Daftar Langganan Mingguan'}</Text>
        </View>
        <FlatList
          keyExtractor={(item, index) => `${index}`}
          data={this.state.listSubscribe}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}
              colors={['#529F45', '#FFFFFF']}
            />
          }
          onEndReached={() => this.getMoreSubscribe()}
          onMomentumScrollBegin={() => {
            this.onEndReachedCalledDuringMomentum = false;
          }}
          onEndReachedThreshold={0.5}
          initialNumToRender={10}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => this.renderLoadMore()}
          renderItem={({item, index}) => {
            return (
              <View style={styles.position1}>
                <View style={[styles.position2, {marginLeft: wp('2%')}]}>
                  <View>
                    {item.product.image ? (
                      <Image
                        source={{
                          uri: CONFIG.BASE_URL + item.product.image,
                        }}
                        style={[styles.position, styles.imageStyle]}
                      />
                    ) : (
                      <DummyImage
                        style={[styles.position, styles.imageStyle]}
                      />
                    )}
                  </View>
                  <View style={styles.textposition}>
                    <Text numberOfLines={3} multiline style={styles.title}>
                      {item.product.name}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        width: wp('60%'),
                      }}>
                      {item.half ? (
                        <NumberFormat
                          value={
                            Math.round(item.product.price.harga_ritel_gt / 2) ??
                            '0'
                          }
                          displayType={'text'}
                          thousandSeparator={true}
                          prefix={'Rp '}
                          renderText={value => (
                            <Text
                              numberOfLines={1}
                              style={{
                                color: '#096A3A',
                                fontSize: hp('1.9%'),
                                fontFamily: 'Lato-Medium',
                                marginTop: hp('1%'),
                                paddingBottom: hp('1%'),
                              }}>
                              {value}
                            </Text>
                          )}
                        />
                      ) : (
                        <NumberFormat
                          value={
                            Math.round(item.product.price.harga_ritel_gt) ?? '0'
                          }
                          displayType={'text'}
                          thousandSeparator={true}
                          prefix={'Rp '}
                          renderText={value => (
                            <Text
                              numberOfLines={1}
                              style={{
                                color: '#096A3A',
                                fontSize: hp('1.9%'),
                                fontFamily: 'Lato-Medium',
                                marginTop: hp('1%'),
                                paddingBottom: hp('1%'),
                              }}>
                              {value}
                            </Text>
                          )}
                        />
                      )}
                      {item.half ? (
                        <Text
                          numberOfLines={1}
                          style={{
                            fontSize: hp('1.9%'),
                            fontFamily: 'Lato-Medium',
                            marginTop: hp('1%'),
                            paddingBottom: hp('1%'),
                            color: '#17a2b8',
                          }}>
                          {'  ( '}
                          {item.product.konversi_sedang_ke_kecil / 2 +
                            ' ' +
                            item.product.kecil.charAt(0) +
                            item.product.kecil.slice(1).toLowerCase()}
                          {' )'}
                        </Text>
                      ) : null}
                    </View>
                    {item.status == '1' ? (
                      <Text style={[styles.title, {color: '#777'}]}>
                        Status: Aktif
                      </Text>
                    ) : null}
                    {item.status == '0' ? (
                      <Text style={[styles.title, {color: '#777'}]}>
                        Status: Tidak Aktif
                      </Text>
                    ) : null}
                  </View>
                  <View style={styles.buttonPosisi}>
                    <TouchableOpacity
                      style={styles.button1}
                      onPress={() =>
                        this.props.navigation.navigate(
                          'DetailSubscribe',
                          this.props.subsAct(item, 'details'),
                        )
                      }>
                      <Text style={styles.textEdit}>Detail</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.button2}
                      onPress={() =>
                        this.setState({
                          alertDelete: 'Apakah yakin ingin menghapus item ini?',
                          buttonDelete: 'Hapus',
                          modalDelete: !this.state.modalDelete,
                          dataDelete: item,
                        })
                      }>
                      <Text style={styles.textEdit}>Hapus</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
  dataUser: state.LoginReducer.dataUser,
  listDataSubscribe: state.SubscribeReducer.listDataSubscribe,
});

const mapDispatchToProps = dispatch => {
  return {
    subsAct: (value, tipe) => {
      dispatch(SubsAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListDataSubscribe);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: hp('8%'),
    backgroundColor: 'white',
    paddingLeft: wp('5%'),
    borderBottomWidth: 4,
    borderColor: '#ddd',
  },
  text: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('2.4%'),
    paddingLeft: wp('5%'),
  },
  position: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  position1: {
    flexDirection: 'column',
    marginBottom: hp('2%'),
    backgroundColor: '#F9F9F9',
  },
  position2: {
    flexDirection: 'row',
    marginBottom: hp('0.5%'),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageStyle: {
    height: hp('12%'),
    width: wp('20%'),
    backgroundColor: '#FBB0B0',
    borderRadius: Size(10),
    marginLeft: wp('3%'),
  },
  textposition: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  title: {
    fontSize: hp('2%'),
    fontFamily: 'Lato-Medium',
    textAlign: 'auto',
    width: wp('50%'),
  },
  textHarga: {
    color: '#096A3A',
    fontSize: hp('1.9%'),
    fontFamily: 'Lato-Medium',
    marginTop: hp('1%'),
    width: wp('50%'),
  },
  buttonPosisi: {
    paddingRight: wp('5%'),
  },
  button1: {
    marginTop: hp('1%'),
    backgroundColor: '#529F45',
    borderRadius: Size(10),
    width: wp('15%'),
    height: hp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp('20%'),
  },
  textEdit: {
    textAlign: 'center',
    color: '#fff',
    fontSize: hp('1.8%'),
    fontFamily: 'Lato-Medium',
  },
  button2: {
    marginTop: hp('1%'),
    backgroundColor: '#E02626',
    borderRadius: Size(10),
    width: wp('15%'),
    height: hp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp('20%'),
  },
});
