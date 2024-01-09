import {Text, TouchableOpacity, View, RefreshControl} from 'react-native';
import React, {Component, useState, useEffect} from 'react';
import {StyleSheet, FlatList} from 'react-native';
import {connect} from 'react-redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import IconBack from '../assets/icons/backArrow.svg';
import IconAvailable from '../assets/icons/IconAvail.svg';
import axios from 'axios';
import CONFIG from '../constants/config';
import {LoginAction} from '../redux/Action';
import Snackbar from 'react-native-snackbar';
import {ActivityIndicator} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import IconMisi from '../assets/icons/IconMisionRound.svg';
import moment from 'moment';
import IconMisiKosong from '../assets/icons/IconMisiKosong.svg';
import IconMisiSelesaiKosong from '../assets/icons/IconMisiSelesaiKosong.svg';
function LoadingApi() {
  return (
    <View style={styles.loadingApi}>
      <ActivityIndicator animating size="small" color="#529F45" />
    </View>
  );
}
export class ListMission extends Component {
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      listMission: [],
      page: 1,
      loadingApi: true,
      refreshing: false,
      isMission: true,
      cloneArray: [],
    };
  }
  componentWillUnmount() {
    this._isMounted = false;
    // rol();
    // this.focusListener();
  }
  componentDidMount = async () => {
    this.getDataMission();
  };
  getDataMission = async () => {
    this._isMounted = true;
    try {
      let response = await axios.get(`${CONFIG.BASE_URL}/api/mission/list`, {
        headers: {Authorization: `Bearer ${this.props.token}`},
      });
      const data = response.data;
      const date = moment();
      const filter = data.data?.filter(data => {
        return moment(data.end_date).format('x') >= date;
      });
      const newFilter = filter?.filter(data => {
        return data?.is_finish == false;
      });
      if (data['success'] === true) {
        this._isMounted &&
          this.setState({
            loadingApi: false,
            listMission: newFilter,
            cloneArray: data.data,
            refreshing: false,
          });
        this.changeData(this.state.isMission);
      } else {
        console.log('Success false');
      }
    } catch (error) {
      this.setState({
        loadingApi: false,
      });
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
  getStartMisi = async (id, param) => {
    try {
      let response = await axios.get(
        `${CONFIG.BASE_URL}/api/mission-user/${id}`,
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      const data = response.data;
      if (data['success'] === true) {
        this.getDataMission();
        this.props.navigation.navigate('Mission', {
          id: id,
          color: param,
        });
      } else {
        console.log('Success false');
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
  moveToDetail = (id, param) => {
    this.props.navigation.navigate('Mission', {
      id: id,
      color: param,
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
          this.getDataMission();
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
          this.getDataMission();
        },
      },
    });
  };
  onRefresh = () => {
    this.setState({refreshing: true});
    this.getDataMission();
  };
  changeData = (param = true) => {
    this._isMounted = true;
    const date = moment();
    const filter = this.state.cloneArray?.filter(data => {
      return moment(data.end_date).format('x') >= date;
    });
    const newFilter = filter?.filter(data => {
      return data?.is_finish === false;
    });
    const isFinish = filter?.filter(data => {
      return data?.is_finish === true;
    });
    console.log('data ' + isFinish, param, this.state.cloneArray);
    this._isMounted&&this.setState(
      param === true
        ? {
            listMission: newFilter,
            isMission: param,
          }
        : {
            listMission: isFinish,
            isMission: param,
          },
    );
  };
  render() {
    // const DATA = Array.from({length: 10}, (v, i) => i);
    const {listMission, loadingApi, refreshing, isMission} = this.state;
    // console.log("list mission "+ listMission)
    return (
      <View style={styles.container}>
        <View style={styles.headder}>
          <IconBack
            width={wp('4%')}
            height={hp('4%')}
            stroke="black"
            strokeWidth="2.5"
            fill="black"
            onPress={() => this.props.navigation.goBack()}
          />
          <Text style={styles.navTitle}>{'Daftar Misi'}</Text>
        </View>
        <View style={styles.splitScreen}>
          <View style={styles.viewTextSplit}>
            <TouchableOpacity
              style={styles.textBtn}
              onPress={() => this.changeData(true)}>
              <Text
                style={[
                  styles.textSplit,
                  isMission === true
                    ? {
                        borderBottomWidth: 3,
                        borderColor: '#267CE0',
                        color: '#000',
                      }
                    : {
                        borderBottomWidth: 3,
                        borderColor: 'white',
                        color: '#7d7d7d',
                      },
                ]}>
                Misi
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.textBtn}
              onPress={() => this.changeData(false)}>
              <Text
                style={[
                  styles.textSplit,
                  isMission === false
                    ? {
                        borderBottomWidth: 3,
                        borderColor: '#267CE0',
                        color: '#000',
                      }
                    : {
                        borderBottomWidth: 3,
                        borderColor: 'white',
                        color: '#7d7d7d',
                      },
                ]}>
                Misi Selesai
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.content}>
          {loadingApi === true || refreshing === true ? (
            <LoadingApi />
          ) : isMission === true && listMission.length === 0 ? (
            <View style={styles.containerIcon}>
               <IconMisiKosong width={wp('50%')}/>
              <Text style={styles.textIconMisi}>Tidak Ada Misi</Text>
            </View>
          ) : isMission === false && listMission.length === 0 ? (
            <View style={styles.containerIcon}>
              <IconMisiSelesaiKosong width={wp('50%')}/>
              <Text style={styles.textIconMisi}>Misi Selesai</Text>
            </View>
          ) : (
            <View style={{flex: 1}}>
              <FlatList
                contentContainerStyle={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#FFF',
                  paddingTop: '7%',
                }}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => `${index}`}
                data={listMission}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={this.onRefresh}
                    colors={['#529F45', '#FFFFFF']}
                  />
                }
                renderItem={({item, index}) => {
                  let aColor = [];
                  if ((index + 1) % 3 === 0) {
                    aColor = ['#E0C226', '#E07126'];
                  } else if ((index + 1) % 3 === 1) {
                    aColor = ['#267CE0', '#0F4D95'];
                  } else if ((index + 1) % 3 === 2) {
                    aColor = ['#529F45', '#428733'];
                  }
                  return (
                    <LinearGradient
                      key={index}
                      colors={aColor}
                      start={{x: 0.4, y: -0.6}}
                      end={{x: 0.0, y: 0.0}}
                      locations={[0.0, 5.0]}
                      style={{
                        marginBottom: '5%',
                        width: widthPercentageToDP('90%'),
                        height: widthPercentageToDP('60%'),
                        borderRadius: 7,
                        paddingHorizontal: '3%',
                        paddingVertical: '5%',
                      }}>
                      <View style={{flexDirection: 'row'}}>
                        <View style={styles.viewTextMission}>
                          <Text style={styles.titleMision}>
                            {item?.name?.toUpperCase() || 'Nama Misi'}
                          </Text>
                          <Text
                            numberOfLines={1}
                            style={[
                              styles.textDescription,
                              {marginTop: '10%'},
                            ]}>
                            {item?.description}
                          </Text>
                          <Text
                            numberOfLines={1}
                            style={[styles.textDescription, {marginTop: '3%'}]}>
                            Dapatkan {item?.reward || null} Point
                          </Text>
                        </View>
                        <View style={styles.cardImage}>
                          <IconMisi
                            width={widthPercentageToDP('23%')}
                            height={widthPercentageToDP('23%')}
                          />
                        </View>
                      </View>
                      <View style={{marginTop: '5%', flexDirection: 'row'}}>
                        <IconAvailable width={wp('9%')} height={wp('4.5%')} />
                        <Text style={styles.textEndDate}>
                          AVAILABLE UNTIL : {item?.end_date || ' '}
                        </Text>
                      </View>

                      <View style={styles.viewBtnMulai}>
                        <TouchableOpacity
                          style={styles.btnMulai}
                          onPress={() =>
                            item?.available_start === false
                              ? this.moveToDetail(item?.id, aColor)
                              : this.getStartMisi(item?.id, aColor)
                          }>
                          <Text style={{color: '#FFF'}}>
                            {item?.available_start === false
                              ? 'Segera'
                              : item?.is_start === true
                              ? 'Detail Misi'
                              : 'Mulai Misi'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </LinearGradient>
                  );
                }}
              />
            </View>
          )}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  headder: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: hp('8%'),
    backgroundColor: 'white',
    paddingLeft: wp('5%'),
    borderBottomWidth: 4,
    borderColor: '#ddd',
  },
  navTitle: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('2.4%'),
    paddingLeft: wp('5%'),
  },
  content: {
    flex: 1,
  },
  //split
  splitScreen: {
    width: '100%',
    alignItems: 'center',
    // backgroundColor:'blue'
  },
  viewTextSplit: {
    width: '90%',
    flexDirection: 'row',
    // marginHorizontal: '5%',
    // backgroundColor:'red',
  },
  textBtn: {
    flex: 1,
  },
  textSplit: {
    // backgroundColor:'red',
    paddingHorizontal: '10%',
    paddingVertical: heightPercentageToDP('1.9%'),
    textAlign: 'center',
    fontSize: hp('2%'),
    // fontWeight: 'bold',
  },
  //list mission
  titleMision: {
    color: '#FFFFFF',
    fontSize: hp('1.8%'),
    fontWeight: '600',
    fontFamily: 'Lato-Medium',
  },
  viewTextMission: {
    width: '65%',
  },
  textDescription: {
    color: '#FFFFFF',
    fontSize: hp('2.4%'),
    fontWeight: 'bold',
    fontFamily: 'Lato-Medium',
  },
  textEndDate: {
    color: '#FFFFFF',
    fontSize: hp('1.8%'),
    // fontWeight: '700',
    fontFamily: 'Lato-Medium',
  },
  cardImage: {
    marginLeft: '5%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingApi: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    width: wp('100%'),
    marginTop: hp('10%'),
  },
  viewBtnMulai: {
    marginTop: '10%',
    alignItems: 'flex-end',
  },
  btnMulai: {
    borderRadius: 5,
    // width:'100%',
    paddingHorizontal: hp('2%'),
    paddingVertical: hp('1%'),
    borderColor: '#FFF',
    borderWidth: 2,
    fontSize: hp('1.7%'),
    fontFamily: 'Lato-Medium',
    // backgroundColor:'#529F45'
  },
  //contaoner icon
  containerIcon: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    paddingTop:hp('15%')
  },
  textIconMisi: {
    fontWeight:'bold',
    fontSize: hp('2.4%'),
    marginTop: hp('3%')
  }
});
const mapStateToProps = state => ({
  token: state.LoginReducer.token,
});

const mapDispatchToProps = dispatch => {
  return {
    loginAct: (value, tipe) => {
      dispatch(LoginAction(value, tipe));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ListMission);
