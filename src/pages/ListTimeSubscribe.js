import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import Trash from '../assets/icons/Trash.svg';
import Size from '../components/Fontresponsive';
import axios from 'axios';
import CONFIG from '../constants/config';
import {SubsAction} from '../redux/Action';
import Icon404 from '../assets/icons/404.svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Storage from '@react-native-async-storage/async-storage';
import IconBack from '../assets/icons/backArrow.svg';
import {ActivityIndicator} from 'react-native-paper';
import DummyImage from '../assets/icons/IconLogo.svg';
import Snackbar from 'react-native-snackbar';

function LoadingApi() {
  return (
    <View style={styles.loadingApi}>
      <ActivityIndicator animating size="small" color="#529F45" />
    </View>
  );
}

const listTimeSubscribe = [
  {
    total: '',
  },
];

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
  },
];

const listTimeMonthSubscribe = [
  {
    total: '',
  },
];

const listDataMonthSubscribe = [
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
  },
];

export class ListTimeSubscribe extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      listTimeSubscribe: listTimeSubscribe,
      listDataSubscribe: [],
      listTimeMonthSubscribe: listTimeMonthSubscribe,
      listDataMonthSubscribe: [],
      loadingApi: true,
      loadingApi2: true,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this._isMounted && this.getTimeWeekSubscribe();
      this._isMounted && this.getTimeMonthSubscribe();
    });
  }

  // UNSAFE_componentWillMount() {
  //   // lor(this);
  //   this.getTimeWeekSubscribe();
  //   this.getTimeMonthSubscribe();
  // }

  componentWillUnmount() {
    // rol();
    this._isMounted = false;
    // this.focusListener();
  }

  //list time perweek subscribe
  getTimeWeekSubscribe = async () => {
    try {
      let response = await axios.get(
        `${CONFIG.BASE_URL}/api/subscribes?type=2_week`,
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      // let dataTotal = response.data.data;
      // let data = response.data.data.data;
      console.log('dataweek', JSON.stringify(response.data.data.data));
      this.setState({
        loadingApi: false,
        listTimeSubscribe: response.data.data,
        listDataSubscribe: response.data.data.data,
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
        this.props.navigation.navigate('Home');
      }
    }
  };

  getTimeMonthSubscribe = async () => {
    try {
      let response = await axios.get(
        `${CONFIG.BASE_URL}/api/subscribes?type=month`,
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      // let dataTotal = response.data.data;
      // let data = response.data.data.data;
      console.log('datamonth', JSON.stringify(response.data.data.data));
      this.setState({
        loadingApi2: false,
        listTimeMonthSubscribe: response.data.data,
        listDataMonthSubscribe: response.data.data.data,
      });
    } catch (error) {
      this.setState({loadingApi2: false});
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

  render() {
    const {loadingApi, loadingApi2} = this.state;
    console.log('cek ========================', JSON.stringify(this.state.listDataSubscribe))
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={[styles.container]}>
          <IconBack
            width={wp('4%')}
            height={hp('4%')}
            stroke="black"
            strokeWidth="2.5"
            fill="black"
            onPress={() => this.props.navigation.goBack()}
          />
          <Text style={styles.text}>{'List Daftar Langganan'}</Text>
        </View>
        {loadingApi ? (
          <LoadingApi />
        ) : (
          <>
            {this.state.listTimeSubscribe.total != 0 && (
              <View>
                <ScrollView>
                  <View style={styles.position1}>
                    <View style={[styles.position2, {marginLeft: wp('2%')}]}>
                      <View style={styles.textposition}>
                        <Text style={styles.title}>{'Per minggu'}</Text>
                        <Text style={[styles.title, {color: '#777'}]}>
                          Jumlah Produk: {this.state.listTimeSubscribe.total}
                        </Text>
                      </View>
                      <View style={styles.buttonPosisi}>
                        <TouchableOpacity
                          style={styles.button1}
                          onPress={() => {
                            this.props.subsAct(
                              this.state.listDataSubscribe,
                              'listDataSubscribe',
                            );
                            this.props.navigation.navigate('ListDataSubscribe');
                          }}>
                          <Text style={styles.textEdit}>Detail</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <ScrollView
                      horizontal
                      onScroll={this.change}
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{
                        marginBottom: wp('5%'),
                        marginLeft: wp('2%'),
                      }}>
                      {this.state.listDataSubscribe.map((item, index) => (
                        <View key={index}>
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
                      ))}
                    </ScrollView>
                  </View>
                </ScrollView>
              </View>
            )}
          </>
        )}
        {loadingApi2 ? (
          <LoadingApi />
        ) : (
          <>
            {this.state.listTimeMonthSubscribe.total != 0 && (
              <View>
                <ScrollView>
                  <View style={styles.position1}>
                    <View style={[styles.position2, {marginLeft: wp('2%')}]}>
                      <View style={styles.textposition}>
                        <Text style={styles.title}>{'Per bulan'}</Text>
                        <Text style={[styles.title, {color: '#777'}]}>
                          Jumlah Produk:{' '}
                          {this.state.listTimeMonthSubscribe.total}
                        </Text>
                      </View>
                      <View style={styles.buttonPosisi}>
                        <TouchableOpacity
                          style={styles.button1}
                          onPress={() => {
                            this.props.subsAct(
                              this.state.listDataMonthSubscribe,
                              'listDataSubscribe',
                            ),
                              this.props.navigation.navigate(
                                'ListDataMonthSubscribe',
                              );
                          }}>
                          <Text style={styles.textEdit}>Detail</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <ScrollView
                      horizontal
                      onScroll={this.change}
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{
                        marginBottom: wp('5%'),
                        marginLeft: wp('2%'),
                      }}>
                      {this.state.listDataMonthSubscribe.map((item, index) => (
                        <View key={index}>
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
                      ))}
                    </ScrollView>
                  </View>
                </ScrollView>
              </View>
            )}
          </>
        )}
        {this.state.listTimeSubscribe.total == 0 &&
        this.state.listTimeMonthSubscribe.total == 0 ? (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              marginTop: hp('-30%'),
            }}>
            <Icon404 width={wp('80%')} height={hp('80%')} />
            <Text
              style={{
                fontSize: hp('2%'),
                fontFamily: 'Lato-Medium',
                textAlign: 'center',
                marginTop: hp('-20%'),
              }}>
              Wah, daftar langganan mu kosong
            </Text>
            <Text
              style={{
                fontSize: hp('1.8%'),
                fontFamily: 'Lato-Medium',
                width: wp('65%'),
                textAlign: 'center',
                marginTop: wp('2%'),
              }}>
              Yuk, isi daftar langgananmu
            </Text>
            <TouchableOpacity
              style={[styles.subscribeButton, {marginTop: wp('2%')}]}
              onPress={() => this.props.navigation.navigate('Produk')}>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: hp('1.8%'),
                  fontFamily: 'Lato-Medium',
                }}>
                {'Mencari Produk Langganan'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
  dataUser: state.LoginReducer.dataUser,
});

const mapDispatchToProps = dispatch => {
  return {
    subsAct: (value, tipe) => {
      dispatch(SubsAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListTimeSubscribe);

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
    backgroundColor: '#F9F9F9',
    borderRadius: Size(10),
    marginTop: wp('3%'),
    marginRight: wp('2%'),
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
  buttonPosisi: {
    paddingRight: wp('5%'),
  },
  button1: {
    marginTop: hp('2.5%'),
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
  subscribeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#529F45',
    width: wp('60%'),
    height: hp('5%'),
    borderRadius: Size(10),
  },

  loadingApi: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    width: wp('100%'),
    marginTop: hp('0%'),
    // height: hp('100%'),
    // position: 'absolute',
    // top:hp('-50%')
  },
});
