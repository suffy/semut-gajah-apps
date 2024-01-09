import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import Size from '../components/Fontresponsive';
import axios from 'axios';
import CONFIG from '../constants/config';
import {Rating} from 'react-native-elements';
import {RatingAction} from '../redux/Action';
import {Card} from 'react-native-elements';
import {ProgressBar, Colors} from 'react-native-paper';
import moment from 'moment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Storage from '@react-native-async-storage/async-storage';
import {ActivityIndicator} from 'react-native-paper';
import Icon404 from '../assets/icons/404.svg';
import IconBack from '../assets/icons/backArrow.svg';
import Snackbar from 'react-native-snackbar';

const width = Dimensions.get('window').width;
const products = [
  {
    product_id: '',
    avg_star: '',
    total_five_star: '',
    total_four_star: '',
    total_three_star: '',
    total_two_star: '',
    total_one_star: '',
    percent_five_star: '',
    percent_four_star: '',
    percent_three_star: '',
    percent_two_star: '',
    percent_one_star: '',
  },
];

const comment = [
  {
    id: '',
    avg_rating: '',
    review: [
      {
        product_id: '',
        star_review: '',
        detail_review: '',
        created_at: '',
        user: {
          id: '',
          name: '',
        },
      },
    ],
  },
];

function LoadingApi() {
  return (
    <View style={styles.loadingApi}>
      <ActivityIndicator animating size="small" color="#529F45" />
    </View>
  );
}

export class ProductRating extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      rating: '5',
      rating4: '4',
      rating3: '3',
      rating2: '2',
      rating1: '1',
      ratingProduct: products,
      commentRating: comment,
      pilihRating: '',
      loadingApi: true,
    };
  }

  componentDidMount() {
    this.getProductRating();
    this.getCommentRating();
    this.getFilterRating();
  }

  UNSAFE_componentWillMount() {
    // lor(this);
  }

  componentWillUnmount() {
    // rol();
  }

  //rata-rata rating
  getProductRating = async () => {
    try {
      let response = await axios.get(
        `${CONFIG.BASE_URL}/api/products/ratings/${this.props.item.id}`,
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      let data = response.data.data;
      this.setState({ratingProduct: data});
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

  //komen rating
  getCommentRating = async () => {
    try {
      let response = await axios.get(
        `${CONFIG.BASE_URL}/api/products/${this.props.item.id}`,
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      const dataReview = response.data.message;
      this.setState({loadingApi: false, commentRating: dataReview.review});
    } catch (error) {
      console.log('getMessage====>', error);
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

  //get filter rating
  getFilterRating = async (star = '') => {
    console.log('star', this.props.item.id);
    try {
      let response = await axios.get(
        `${CONFIG.BASE_URL}/api/products/${this.props.item.id}?star=${star}`,
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      const data = response.data.message;
      // console.log('getMessage====>', JSON.stringify(data));
      this.setState({commentRating: data.review});
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
    }
  };

  handleStarChange(item) {
    console.log(item);
    this.setState({
      pilihRating: item,
    });
    this.getFilterRating(item);
  }

  //hitung jumlah ulasan
  subtotalRating = () => {
    if (this.state.ratingProduct) {
      return this.state.ratingProduct.reduce(
        (sum, item) =>
          sum +
          (parseInt(item.total_five_star) +
            parseInt(item.total_four_star) +
            parseInt(item.total_three_star) +
            parseInt(item.total_two_star) +
            parseInt(item.total_one_star)),
        0,
      );
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
    const {rating, rating4, rating3, rating2, rating1, loadingApi} = this.state;
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
          <Text style={styles.text}>{'Ulasan Produk'}</Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{marginBottom: wp('3%')}}>
          <View>
            {this.state.ratingProduct.map((item, index) => (
              <Card containerStyle={styles.cardBackground} key={index}>
                <View style={styles.position2}>
                  <View
                    style={{
                      marginLeft: wp('0%'),
                      alignItems: 'center',
                    }}>
                    <View style={styles.position2}>
                      <Text style={styles.ratingBold}>{item.avg_star}</Text>
                      <Text style={styles.rating}> / 5</Text>
                    </View>
                    <Text style={{marginTop: wp('2%')}}>
                      <Rating
                        imageSize={17}
                        readonly
                        ratingCount={5}
                        startingValue={item.avg_star}
                      />
                    </Text>
                    <Text
                      style={{
                        color: '#777',
                        fontSize: hp('1.7%'),
                        fontFamily: 'Lato-Medium',
                        marginTop: wp('2%'),
                      }}>
                      {this.subtotalRating()} Ulasan
                    </Text>
                  </View>
                  <View
                    style={{
                      marginLeft: wp('3%'),
                      alignItems: 'flex-start',
                    }}>
                    <View style={styles.position2}>
                      <Text style={{marginTop: wp('2%')}}>
                        <Rating
                          imageSize={17}
                          readonly
                          ratingCount={5}
                          startingValue={rating}
                        />
                      </Text>
                      <ProgressBar
                        progress={
                          (item.percent_five_star.replace('%', '') || 0) / 100
                        }
                        color={Colors.yellow700}
                        style={{
                          width: wp('32%'),
                          marginLeft: wp('2%'),
                          marginTop: wp('2%'),
                        }}
                      />
                      <Text
                        style={{
                          color: '#777',
                          fontSize: hp('1.7%'),
                          fontFamily: 'Lato-Medium',
                          marginTop: wp('2%'),
                        }}>
                        {' '}
                        {item.total_five_star}
                      </Text>
                    </View>
                    <View style={styles.position2}>
                      <Text style={{marginTop: wp('2%')}}>
                        <Rating
                          imageSize={17}
                          readonly
                          ratingCount={5}
                          startingValue={rating4}
                        />
                      </Text>
                      <ProgressBar
                        progress={
                          (item.percent_four_star.replace('%', '') || 0) / 100
                        }
                        color={Colors.yellow700}
                        style={{
                          width: wp('32%'),
                          marginLeft: wp('2%'),
                          marginTop: wp('2%'),
                        }}
                      />
                      <Text
                        style={{
                          color: '#777',
                          fontSize: hp('1.7%'),
                          fontFamily: 'Lato-Medium',
                          marginTop: wp('2%'),
                        }}>
                        {' '}
                        {item.total_four_star}
                      </Text>
                    </View>
                    <View style={styles.position2}>
                      <Text style={{marginTop: wp('2%')}}>
                        <Rating
                          imageSize={17}
                          readonly
                          ratingCount={5}
                          startingValue={rating3}
                        />
                      </Text>
                      <ProgressBar
                        progress={
                          (item.percent_three_star.replace('%', '') || 0) / 100
                        }
                        color={Colors.yellow700}
                        style={{
                          width: wp('32%'),
                          marginLeft: wp('2%'),
                          marginTop: wp('2%'),
                        }}
                      />
                      <Text
                        style={{
                          color: '#777',
                          fontSize: hp('1.7%'),
                          fontFamily: 'Lato-Medium',
                          marginTop: wp('2%'),
                        }}>
                        {' '}
                        {item.total_three_star}
                      </Text>
                    </View>
                    <View style={styles.position2}>
                      <Text style={{marginTop: wp('2%')}}>
                        <Rating
                          imageSize={17}
                          readonly
                          ratingCount={5}
                          startingValue={rating2}
                        />
                      </Text>
                      <ProgressBar
                        progress={
                          (item.percent_two_star.replace('%', '') || 0) / 100
                        }
                        color={Colors.yellow700}
                        style={{
                          width: wp('32%'),
                          marginLeft: wp('2%'),
                          marginTop: wp('2%'),
                        }}
                      />
                      <Text
                        style={{
                          color: '#777',
                          fontSize: hp('1.7%'),
                          fontFamily: 'Lato-Medium',
                          marginTop: wp('2%'),
                        }}>
                        {' '}
                        {item.total_two_star}
                      </Text>
                    </View>
                    <View style={styles.position2}>
                      <Text style={{marginTop: wp('2%')}}>
                        <Rating
                          imageSize={17}
                          readonly
                          ratingCount={5}
                          startingValue={rating1}
                        />
                      </Text>
                      <ProgressBar
                        progress={
                          (item.percent_one_star.replace('%', '') || 0) / 100
                        }
                        color={Colors.yellow700}
                        style={{
                          width: wp('32%'),
                          marginLeft: wp('2%'),
                          marginTop: wp('2%'),
                        }}
                      />
                      <Text
                        style={{
                          color: '#777',
                          fontSize: hp('1.7%'),
                          fontFamily: 'Lato-Medium',
                          marginTop: wp('2%'),
                        }}>
                        {' '}
                        {item.total_one_star}
                      </Text>
                    </View>
                  </View>
                </View>
              </Card>
            ))}
            <ScrollView
              horizontal
              onScroll={this.change}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{marginTop: wp('5%')}}>
              <View style={styles.position2}>
                <TouchableOpacity
                  style={[styles.borderAll, {marginLeft: wp('3%')}]}
                  onPress={() => this.handleStarChange()}>
                  <Text
                    style={{
                      fontSize: hp('1.6%'),
                      fontFamily: 'Lato-Medium',
                    }}>
                    Semua
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.borderLogo}
                  onPress={() => this.handleStarChange('5')}>
                  <Rating
                    imageSize={23}
                    readonly
                    startingValue={rating}
                    ratingCount={1}
                  />
                  <Text
                    style={{
                      fontSize: hp('1.6%'),
                      fontFamily: 'Lato-Medium',
                    }}>
                    {' '}
                    5
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.borderLogo}
                  onPress={() => this.handleStarChange('4')}>
                  <Rating
                    imageSize={23}
                    readonly
                    startingValue={rating}
                    ratingCount={1}
                  />
                  <Text
                    style={{
                      fontSize: hp('1.6%'),
                      fontFamily: 'Lato-Medium',
                    }}>
                    {' '}
                    4
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.borderLogo}
                  onPress={() => this.handleStarChange('3')}>
                  <Rating
                    imageSize={23}
                    readonly
                    startingValue={rating}
                    ratingCount={1}
                  />
                  <Text
                    style={{
                      fontSize: hp('1.6%'),
                      fontFamily: 'Lato-Medium',
                    }}>
                    {' '}
                    3
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.borderLogo}
                  onPress={() => this.handleStarChange('2')}>
                  <Rating
                    imageSize={23}
                    readonly
                    startingValue={rating}
                    ratingCount={1}
                  />
                  <Text
                    style={{
                      fontSize: hp('1.6%'),
                      fontFamily: 'Lato-Medium',
                    }}>
                    {' '}
                    2
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.borderLogo, {marginRight: wp('3%')}]}
                  onPress={() => this.handleStarChange('1')}>
                  <Rating
                    imageSize={23}
                    readonly
                    startingValue={rating}
                    ratingCount={1}
                  />
                  <Text
                    style={{
                      fontSize: hp('1.6%'),
                      fontFamily: 'Lato-Medium',
                    }}>
                    {' '}
                    1
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
            {this.state.commentRating.length > 0 && (
              <>
                <Text
                  style={[
                    styles.ratingList,
                    {marginLeft: wp('3%'), marginTop: wp('4%')},
                  ]}>
                  Daftar Ulasan Produk
                </Text>
                {this.state.commentRating.map((itemRating, indexRating) => (
                  <View
                    style={{
                      marginBotton: wp('3%'),
                      // marginTop: wp('4%'),
                      marginLeft: wp('3%'),
                    }}
                    key={indexRating}>
                    {loadingApi ? (
                      <LoadingApi />
                    ) : (
                      <Card
                        containerStyle={{
                          borderRadius: wp('3%'),
                          marginBottom: wp('1%'),
                          marginLeft: wp('0%'),
                        }}>
                        <Rating
                          imageSize={23}
                          readonly
                          startingValue={itemRating.star_review}
                          style={{
                            alignItems: 'flex-start',
                            marginBottom: wp('1%'),
                          }}
                        />
                        <View style={styles.position2}>
                          <Text
                            style={{
                              fontSize: hp('1.6%'),
                              fontFamily: 'Lato-Medium',
                            }}>
                            Oleh
                          </Text>
                          <Text
                            style={{
                              fontSize: hp('1.6%'),
                              fontFamily: 'Lato-Medium',
                            }}>
                            {' '}
                            {itemRating.user?.name}
                          </Text>
                        </View>
                        <Text
                          style={{
                            color: '#777',
                            fontSize: hp('1.7%'),
                            fontFamily: 'Lato-Medium',
                            marginTop: wp('2%'),
                          }}>
                          {moment(itemRating.created_at).format('LLL')}
                        </Text>
                        {itemRating.detail_review != null && (
                          <Text
                            style={{
                              fontSize: hp('1.6%'),
                              fontFamily: 'Lato-Medium',
                              marginTop: wp('2%'),
                            }}>
                            {itemRating.detail_review}
                          </Text>
                        )}
                        {itemRating.detail_review == null && (
                          <Text
                            style={{
                              fontSize: hp('1.6%'),
                              fontFamily: 'Lato-Medium',
                              marginTop: wp('2%'),
                            }}>
                            Tidak ada komentar
                          </Text>
                        )}
                      </Card>
                    )}
                  </View>
                ))}
              </>
            )}
            {this.state.commentRating.length === 0 && (
              <View style={{flex: 1, alignItems: 'center'}}>
                <Icon404
                  width={wp('80%')}
                  height={hp('60%')}
                  // source={require('../assets/images/no_data.jpg')}
                />
                {/* <Text
                  style={[
                    {
                      fontSize: hp('2.6%'),
                      fontFamily: 'Robotic-Medium',
                      marginTop: hp('-10%'),
                    },
                  ]}>
                  {'Tidak ada data.'}
                </Text> */}
              </View>
            )}
          </View>
        </ScrollView>
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
    subsAct: (value, tipe) => {
      dispatch(SubsAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductRating);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: hp('8%'),
    backgroundColor: 'white',
    paddingLeft: wp('5%'),
    paddingHorizontal: wp('5%'),
    borderBottomWidth: 4,
    borderColor: '#ddd',
  },
  text: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('2.4%'),
    paddingLeft: wp('5%'),
  },
  position2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: wp('0%'),
  },
  rating: {
    fontSize: hp('1.8%'),
    color: '#000000',
    fontFamily: 'Lato-Medium',
    marginTop: wp('1.5%'),
  },
  ratingBold: {
    color: '#000000',
    fontSize: hp('2%'),
    fontFamily: 'Lato-Medium',
  },
  cardBackground: {
    width,
    marginLeft: wp('0%'),
    marginTop: wp('0%'),
    justifyContent: 'center',
  },
  borderLogo: {
    marginLeft: wp('2%'),
    borderColor: '#777',
    borderRadius: Size(10),
    width: wp('15%'),
    borderWidth: wp('0.1%'),
    height: hp('6%'),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  borderAll: {
    marginLeft: wp('2%'),
    borderColor: '#777',
    borderRadius: Size(15),
    width: wp('20%'),
    borderWidth: wp('0.1%'),
    height: hp('6%'),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  ratingList: {
    color: '#000000',
    fontSize: hp('1.8%'),
    fontFamily: 'Lato-Medium',
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
