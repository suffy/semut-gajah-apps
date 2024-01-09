import {Text, Image, StyleSheet, View, Linking, ScrollView} from 'react-native';
import React, {Component} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import IconBack from '../assets/icons/backArrow.svg';
import {connect} from 'react-redux';
import {TouchableOpacity} from 'react-native-gesture-handler';
import CONFIG from '../constants/config';
import TableTopSpender from '../components/TableTopSpender';
import {SafeAreaView} from 'react-native-safe-area-context';
import DummyImage from '../assets/icons/IconLogo.svg';
import {LoginAction, TopSpenderAction} from '../redux/Action';
import Storage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Snackbar from 'react-native-snackbar';
import {ActivityIndicator} from 'react-native-paper';
import Header from '../components/Header'
function LoadingApi() {
  return (
    <View style={styles.loadingApi}>
      <ActivityIndicator animating size="small" color="#529F45" />
    </View>
  );
}

export class TopSpender extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      loadingApi: true,
      dataTopSpender: [],
    };
  }
  componentWillUnmount() {
    // rol();
    // this.focusListener();
  }
  componentDidMount = async () => {
    this._isMounted = true;
    this.focusListener = await this.props.navigation.addListener('focus', () =>
      this.getDataUser(),
    );
    if (this.props.route.params?.id !== undefined) {
      this.getTopSpender();
    }
  };
  getDataUser = async () => {
    try {
      let response = await axios.get(`${CONFIG.BASE_URL}/api/profile`, {
        headers: {Authorization: `Bearer ${this.props.token}`},
      });

      const data = response.data.data;
      this.props.loginAct(data, 'dataUser');
      this._isMounted && this.setState({
        loadingApi: false,
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
        'Cek Error========================54',
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
  getTopSpender = async () => {
    try {
      let response = await axios.get(
        `${CONFIG.BASE_URL}/api/top-spender/${this.props.route.params.id}`,
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      const data = response.data.data;
      this.props.topSpenderAct(data, 'topSpender');
      this._isMounted && this.setState({
        loadingApi: false,
        dataTopSpender: data
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
        'Cek Error========================54',
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
          this.getTopSpender();
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
          this.getTopSpender();
        },
      },
    });
  };
  openTopSpender = (id) => {
    const url =
      CONFIG.BASE_URL +
      '/top-spender/' +
      id +
      '/' +
      this.props.dataUser?.customer_code;
    Linking.openURL(url);
  };
  render() {
    const {loadingApi,dataTopSpender} = this.state;
    // console.log("data "+ JSON.stringify(this.props.topSpender))
    const DATA = Array.from({length: 3}, (v, i) => i);
    return (
      <SafeAreaView style={styles.container}>
        <Header 
          title={"Top Spender"}
          navigation={this.props.navigation}
        />
        {loadingApi === true ? (
          <LoadingApi />
        ) : (
          <>
            <ScrollView
              contentContainerStyle={{
                paddingLeft: wp('5%'),
                paddingRight: wp('5%'),
                alignItems: 'center',
              }}
              style={{flex: 1}}
              showsVerticalScrollIndicator={false}>
              <View style={{flex: 1, marginTop: hp('2%'), height: hp('90%')}}>
                {this.props.topSpender != undefined ? (
                  <Image
                    source={
                      this.props.topSpender?.banner ? (
                        {uri: CONFIG.BASE_URL + this.props.topSpender?.banner}
                      ) : (
                        <DummyImage style={styles.banner} />
                      )
                    }
                    style={styles.banner}
                  />
                ) : (
                  <DummyImage style={styles.banner} />
                )}
                <View style={styles.contentTopSpender}>
                  <Text style={styles.topSpenderTitle}>
                    {this.props.topSpender?.title || "Top-Spender"}
                  </Text>
                  <TableTopSpender
                    array={this.props.topSpender?.rank_reward }
                  />
                  <View style={styles.cardDes}>
                    <Text style={styles.textDes}>Deskripsi</Text>
                    <Text style={styles.textIsiDes}>
                      {this.props.topSpender?.description || "Deskripsi"}
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
            <View style={styles.btnTopSpender}>
              <View style={styles.btnLihatTopSpender}>
                <TouchableOpacity
                  onPress={() => {
                    this.openTopSpender((id = this.props.topSpender?.id));
                  }}>
                  <Text style={styles.textBtn}>Lihat top spender</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headder: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: hp('8%'),
    backgroundColor: 'white',
    borderColor: '#E8E8E8',
    paddingLeft: wp('5%'),
    borderBottomWidth: 4,
    borderColor: '#ddd',
  },
  navTitle: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('2.4%'),
    paddingLeft: wp('5%'),
  },
  contentTopSpender: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: '5%',
  },
  topSpenderTitle: {
    fontSize: heightPercentageToDP('2.5%'),
    marginVertical: heightPercentageToDP('0.5%'),
    marginTop: heightPercentageToDP('0.5%'),
  },
  cardDes: {
    width: widthPercentageToDP('88%'),
    padding: heightPercentageToDP('1%'),
    backgroundColor: 'white',
    marginTop: '5%',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D9D9D9',
    paddingLeft: '5%',
    minHeight: heightPercentageToDP('15%'),
    marginBottom: heightPercentageToDP('1%'),
  },
  textDes: {
    width: '100%',
    fontSize: heightPercentageToDP('2%'),
    marginBottom: heightPercentageToDP('0.5%'),
  },
  textIsiDes: {
    width: '100%',
    fontSize: heightPercentageToDP('1.8%'),
    color: '#7D7D7D',
  },
  btnTopSpender: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    paddingBottom: '5%',
  },
  btnLihatTopSpender: {
    width: widthPercentageToDP('88%'),
    backgroundColor: '#529F45',
    padding: '3.5%',
    alignItems: 'center',
    borderRadius: 13,
  },
  textBtn: {
    color: '#FFFFFF',
  },
  banner: {
    resizeMode: 'contain',
    width: widthPercentageToDP('86%'),
    minHeight: heightPercentageToDP('23%'),
    borderRadius: hp('1%'),
    alignSelf: 'center',
  },
  loadingApi: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    width: wp('100%'),
    marginTop: hp('10%'),
  },
});

const mapStateToProps = state => ({
  topSpender: state.TopSpenderReducer.topSpender,
  dataUser: state.LoginReducer.dataUser,
  token: state.LoginReducer.token,
});

const mapDispatchToProps = dispatch => {
  return {
    voucherAct: (value, tipe) => {
      dispatch(VoucherAction(value, tipe));
    },
    loginAct: (value, tipe) => {
      dispatch(LoginAction(value, tipe));
    },
    topSpenderAct: (value, tipe) => {
      dispatch(TopSpenderAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopSpender);
