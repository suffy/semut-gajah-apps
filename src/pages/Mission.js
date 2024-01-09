import {
  Text,
  Image,
  StyleSheet,
  View,
  Linking,
  ScrollView,
  ImageBackground,
  RefreshControl,
} from 'react-native';
import React, {Component} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import IconBack from '../assets/icons/backArrow.svg';
import {connect} from 'react-redux';
import Size from '../components/Fontresponsive';
import IconReward from '../assets/icons/DetailMissionReward.svg';
import IconTask from '../assets/icons/DetailMissionTask.svg';
import IconTime from '../assets/icons/DetailMissionAvail.svg';
import IconListTask from '../assets/icons/ListTask.svg';
import CONFIG from '../constants/config';
import axios from 'axios';
import Snackbar from 'react-native-snackbar';
import {ActivityIndicator} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import IconMisi from '../assets/icons/IconMisionRound.svg';
import IconAvailable from '../assets/icons/IconAvail.svg';
import BgTaskActive from '../assets/images/BgTaskActive.webp';
import BgTask from '../assets/images/BgTask.webp';

function LoadingApi() {
  return (
    <View style={styles.loadingApi}>
      <ActivityIndicator animating size="small" color="#529F45" />
    </View>
  );
}
export class Mission extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      detailMission: {
        tasks: [],
      },
      page: 1,
      refreshing: false,
      loadingApi: true,
    };
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
  componentDidMount = async () => {
    this._isMounted = true;
    this.getDetailMission();
  };

  getDetailMission = async () => {
    try {
      let response = await axios.get(
        `${CONFIG.BASE_URL}/api/mission/${this.props.route.params?.id}`,
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      const data = response.data;
      if (data['success'] === true) {
        this._isMounted &&
          this.setState({
            detailMission: {
              name: data.data.name,
              description: data.data.description,
              reward: data.data.reward,
              remain_time: data.data.remain_time,
              finish_task: data.data.finish_task,
              total_task: data.data.total_task,
              end_date: data.data.end_date,
              tasks: data.data.tasks,
            },
            loadingApi: false,
            refreshing: false,  
          });
        console.log('Detail Misi',);
      } else {
        console.log('Detail mission false');
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
        JSON.parse(JSON.stringify(error)),
      );
      if (error429) {
        this.showSnackbarBusy();
        console.log('Cek Error 429');
      } else if (errorNetwork) {
        this.showSnackbarInet();
        console.log('showSnackbarInet');
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
          this.getDetailMission();
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
          this.getDetailMission();
        },
      },
    });
  };
  onRefresh = () => {
    this.setState({refreshing : true});
    this.getDetailMission()
  }
  render() {
    const {detailMission, loadingApi,refreshing} = this.state;
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
          <Text style={styles.navTitle}>{'Detail Misi'}</Text>
        </View>
        {loadingApi === true || refreshing === true ? (
          <LoadingApi />
        ) : (
          <View
            style={{
              // marginTop: hp('2%'),
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
            }}>
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={this.onRefresh}
                  colors={['#529F45', '#FFFFFF']}
                />
              }>
              <LinearGradient
                colors={this.props.route.params?.color}
                start={{x: 0.4, y: -0.6}}
                end={{x: 0.0, y: 0.0}}
                locations={[0.0, 5.0]}
                style={{
                  width: widthPercentageToDP('90%'),
                  height: widthPercentageToDP('60%'),
                  borderRadius: 7,
                  paddingHorizontal: '3%',
                  paddingVertical: '5%',
                  backgroundColor: 'black',
                  marginBottom: '3%',
                }}>
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.viewTextMission}>
                    <Text style={styles.titleMision}>
                      {detailMission?.name?.toUpperCase() || 'Nama Misi'}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={[styles.textDescription, {marginTop: '10%'}]}>
                      {detailMission?.description || 'Description'}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={[styles.textDescription, {marginTop: '3%'}]}>
                      Dapatkan {detailMission?.reward || null} Point
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
                    AVAILABLE UNTIL : {detailMission?.end_date || ' '}
                  </Text>
                </View>
              </LinearGradient>
              <View>
                <Text style={styles.textTitle}>Deskripsi</Text>
                <Text style={styles.textDesc}>
                  {detailMission?.description || 'Description'}
                </Text>
              </View>
              <View style={styles.viewDetailMisi}>
                <View style={styles.viewImagesDetail}>
                  <View style={[styles.viewIconDetail, {flex: 1}]}>
                    <IconReward width={wp('15%')} height={wp('15%')} />
                    <View style={{marginTop: '3%'}}>
                      <Text style={styles.textDetailMission}>Reward</Text>
                      <Text style={styles.textDetailMission}>
                        {detailMission?.reward || ''} Poin
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.viewIconDetail, {flex: 2}]}>
                    <IconTask width={wp('15%')} height={wp('15%')} />
                    <View style={{marginTop: '3%'}}>
                      <Text style={styles.textDetailMission}>Total Task</Text>
                      <Text style={styles.textDetailMission}>
                        {detailMission?.finish_task +
                          '/' +
                          detailMission?.total_task || ''}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.viewIconDetail, {flex: 1}]}>
                    <IconTime width={wp('15%')} height={wp('15%')} />
                    <View style={{marginTop: '3%'}}>
                      <Text style={styles.textDetailMission}>
                        Available Until
                      </Text>
                      <Text style={styles.textDetailMission}>
                        {detailMission?.end_date || ''}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.line} />
                <View style={styles.task}>
                  <Text style={styles.textTitleTask}>Tugas Anda</Text>
                  {detailMission?.tasks != undefined
                    ? detailMission?.tasks.map((item, index) => {
                        return (
                          <View key={index}>
                            <View style={styles.cardTask}>
                              <ImageBackground
                                source={
                                  item.is_finish === true
                                    ? BgTaskActive
                                    : BgTask
                                }
                                resizeMode="cover"
                                style={styles.bgTaskImage}>
                                <Text style={styles.textIconTask}>
                                  {index + 1}
                                </Text>
                              </ImageBackground>
                              <View style={styles.viewTextTask}>
                                <Text style={styles.textNumberTask}>
                                  Task {index + 1}
                                </Text>
                                <Text style={styles.textValueTask}>
                                  {item.name}
                                </Text>
                              </View>
                            </View>
                            <View
                              style={[styles.line, {marginTop: hp('2%')}]}
                            />
                          </View>
                        );
                      })
                    : null}
                </View>
              </View>
            </ScrollView>
          </View>
        )}
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
  viewTextMission: {
    width: '65%',
  },
  titleMision: {
    color: '#FFFFFF',
    fontSize: hp('1.8%'),
    fontWeight: '600',
    fontFamily: 'Lato-Medium',
  },
  textDescription: {
    color: '#FFFFFF',
    fontSize: hp('2.4%'),
    fontWeight: 'bold',
    fontFamily: 'Lato-Medium',
  },
  cardImage: {
    marginLeft: '5%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textEndDate: {
    color: '#FFFFFF',
    fontSize: hp('1.8%'),
    fontFamily: 'Lato-Medium',
  },
  navTitle: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('2.4%'),
    paddingLeft: wp('5%'),
  },
  loadingApi: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    width: wp('100%'),
    marginTop: hp('10%'),
  },
  // styles scrollView
  scrollView: {
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    width: '100%',
  },
  textTitle: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('2.2%'),
    fontWeight: '700',
  },
  textDesc: {
    marginTop: '2%',
    fontSize: hp('2.0%'),
    color: '#7D7D7D',
  },
  viewDetailMisi: {
    width: '100%',
    paddingTop: '5%',
  },
  viewImagesDetail: {
    flexDirection: 'row',
    width: '100%',
  },
  viewIconDetail: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textDetailMission: {
    textAlign: 'center',
    fontSize: hp('1.8%'),
  },
  line: {
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    marginTop: hp('3'),
  },
  // Task
  task: {
    marginTop: hp('2%'),
    paddingBottom: hp('5%'),
  },
  textTitleTask: {
    color: '#529F45',
  },
  cardTask: {
    flexDirection: 'row',
    marginTop: hp('1%'),
    alignItems: 'center',
  },
  bgTaskImage: {
    height: hp('4%'),
    width: hp('4%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  textIconTask: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: hp('2.5%'),
  },
  viewTextTask: {
    marginLeft: wp('3%'),
    justifyContent: 'center',
  },
  textNumberTask: {
    fontWeight: 'bold',
  },
  textValueTask: {
    color: '#7D7D7D',
    width: widthPercentageToDP('80%'),
  },
});
const mapStateToProps = state => ({
  token: state.LoginReducer.token,
});

const mapDispatchToProps = dispatch => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(Mission);
