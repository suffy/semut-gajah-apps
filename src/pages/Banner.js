import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import CONFIG from '../constants/config';
import axios from 'axios';
import {connect} from 'react-redux';
import {BannerAction, TopSpenderAction} from '../redux/Action';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Storage from '@react-native-async-storage/async-storage';
import {ActivityIndicator} from 'react-native-paper';

const {width} = Dimensions.get('window');
const height = width * 0.464;
const bannerImages = [
  {
    id: '',
    images: '',
  },
];
const SCROLLVIEW_REF = 'scrollview';

function LoadingApi() {
  return (
    <View style={styles.loadingApi}>
      <ActivityIndicator animating size="small" color="#529F45" />
    </View>
  );
}

export class Banner extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      bannerImages: [],
      loadingApi: true,
      position: 1,
      autoplay: true,
      xValue: 0,
    };
    this._currentIndex = 0;
  }

  UNSAFE_componentWillMount() {
    // lor(this);
  }

  componentDidMount = () => {
    // if (this.state.autoplay) {
    this._startAutoPlay();
    // }
    // this.props.onRef(this);
  };

  componentWillUnmount() {
    // rol();
    this._stopAutoPlay();
    // this.props.onRef(undefined);
    // this.props.onRef2(this);
  }

  _startAutoPlay = () => {
    this._timerId = setInterval(() => this._gotoNext(), 2500);
  };

  _stopAutoPlay() {
    if (this._timerId) {
      clearInterval(this._timerId);
      this._timerId = null;
    }
  }

  _gotoNext = () => {
    try {
      this._currentIndex = this._currentIndex + 1;
      let nextIndex = this._currentIndex % this.props.promo.length;
      this.refs[SCROLLVIEW_REF]?.scrollTo({
        x: width * nextIndex - wp('15%') * nextIndex,
      });
    } catch (error) {
      console.log(error);
    }
  };
  _onScrollEnd = event => {
    try {
      const index = width - wp('15%');
      this._stopAutoPlay();
      if (event > index * this._currentIndex+1) {
        const result = event / index + 1;
        this.refs[SCROLLVIEW_REF]?.scrollTo({
          x: index * parseInt(result), animated: true,
        });
        this._currentIndex = parseInt(result);
        this._startAutoPlay();
      } else {
        const result = event / index;
        this.refs[SCROLLVIEW_REF]?.scrollTo({
          x: index * parseInt(result),
          animated: true,
        });
        this._currentIndex = parseInt(result);
        this._startAutoPlay();
      }
    } catch (e) {
      console.log('log 120 ' + e.message);
    }
  };
  render() {
    const {promo} = this.props;
    // const {bannerImages} = this.state;
    return (
      <View style={styles.container}>
        {/* <View style={styles.container}> */}
        {bannerImages.length > 0 && (
          <ScrollView
            ref={SCROLLVIEW_REF}
            pagingEnabled={true}
            decelerationRate={"fast"}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.scroll}
            disableIntervalMomentum={true}
            onScrollEndDrag={e => {
              this._onScrollEnd(e.nativeEvent.contentOffset.x);
            }}
            >
            {promo?.map((item, index) => {
              if (item.status == 1) {
                return (
                  <View key={index} style={{paddingVertical: wp('2%')}}>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        if (item.identity === 'top_spender') {
                          this.props.navigation.navigate(
                            'TopSpender',
                            this.props.topSpenderAct(item, 'topSpender'),
                          );
                        } else if (item.identity === 'promo') {
                          this.props.navigation.navigate(
                            'DetailPromo',
                            this.props.bannerAct(item, 'banner'),
                          );
                        } else {
                          null;
                        }
                      }}>
                      <Image
                        resizeMode="cover"
                        key={item.id}
                        source={{uri: CONFIG.BASE_URL + item.banner}}
                        style={[
                          styles.banner,
                          {
                            marginRight:
                              index + 1 === promo?.length ? wp('5%') : null,
                            marginLeft: index === 0 ? wp('10%') : wp('5%'),
                          },
                        ]}></Image>
                    </TouchableWithoutFeedback>
                  </View>
                );
              }
            })}
          </ScrollView>
        )}
        {/* </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    // marginTop: wp('4%'),
    // marginBottom: wp('4%'),
    // width: wp('100%'),
    // height: hp('26%'),
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
    // marginLeft: wp('-5%'),
    marginRight: wp('-5%'),
  },
  scroll: {
    marginRight: wp('5%'),
    // marginLeft: wp('-5%'),
    // width: wp('100%'),
    // height: hp('100%'),
    // marginLeft: wp('-5%'),
  },
  banner: {
    marginLeft: wp('5%'),
    // marginRight: wp('5%'),
    width: wp('80%'),
    height: wp('30%'),
    borderRadius: hp('1%'),
    alignSelf: 'center',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
  },
  pagingDot: {
    color: '#888',
    margin: 3,
    fontSize: width / 30,
  },
  pagingDotActive: {
    color: '#fff',
    margin: 3,
    fontSize: width / 30,
  },
  loadingApi: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    width: wp('100%'),
    height: hp('25.5%'),
    marginTop: hp('0%'),
    // height: hp('100%'),
    // position: 'absolute',
    // top:hp('-50%')
  },
});

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
});

const mapDispatchToProps = dispatch => {
  return {
    bannerAct: (value, tipe) => {
      dispatch(BannerAction(value, tipe));
    },
    topSpenderAct: (value, tipe) => {
      dispatch(TopSpenderAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Banner);
