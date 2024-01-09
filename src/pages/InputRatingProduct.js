import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  Dimensions,
  Button,
} from 'react-native';
import {connect} from 'react-redux';
import Size from '../components/Fontresponsive';
import axios from 'axios';
import NumberFormat from 'react-number-format';
import CONFIG from '../constants/config';
import {Card, Rating} from 'react-native-elements';
import {RatingAction} from '../redux/Action';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Storage from '@react-native-async-storage/async-storage';
import IconBack from '../assets/icons/backArrow.svg';
import ModalAlert from '../components/ModalAlert';
import DummyImage from '../assets/icons/IconLogo.svg';
import Snackbar from 'react-native-snackbar';

export class InputRatingProduct extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      rating: '0',
      reviews: [
        {
          product_id: '',
          star_review: 0,
          detail_review: '',
        },
      ],
      alertData: '',
      modalAlert: false,
    };
  }

  componentDidMount = () => {
    let map = this.props.ratingProduct.data_item.map(function (item) {
      return {
        product_id: item.product?.id,
        star_review: 0,
        detail_review: '',
      };
    });
    this.setState({reviews: map});
  };

  UNSAFE_componentWillMount() {
    // lor(this);
  }

  componentWillUnmount() {
    // rol();
  }

  postRating = async () => {
    let rating = this.state.reviews.every(item => item.star_review > 0);
    if (rating) {
      try {
        let response = await axios.post(
          `${CONFIG.BASE_URL}/api/review`,
          {
            order_id: this.props.ratingProduct.id,
            products: this.state.reviews,
          },
          {
            headers: {Authorization: `Bearer ${this.props.token}`},
          },
        );
        let data = response.data;
        if (data !== '' && data['success'] == true) {
          console.log('RATINGS', data);
          this.props.navigation.replace('TopNav', {
            screen: 'HistoryRating',
            initial: false,
          });
        } else {
          this.setState({
            alertData: 'Input rating gagal',
            modalAlert: !this.state.modalAlert,
          });
          console.log(response.data);
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
      this.setState({
        alertData: 'Harap isi rating bintang di setiap produk',
        modalAlert: !this.state.modalAlert,
      });
    }
  };

  handleRating = (index, value, desc) => {
    let tmp = this.state.reviews;
    if (desc === 'rating') {
      tmp[index].star_review = value;
    } else {
      tmp[index].detail_review = value;
    }
    this.setState({reviews: tmp});
  };

  getCloseAlertModal() {
    this.setState({modalAlert: !this.state.modalAlert});
  }

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
    const {rating} = this.state;
    console.log('state review', this.state.reviews);
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <ModalAlert
          modalAlert={this.state.modalAlert}
          alert={this.state.alertData}
          getCloseAlertModal={() => this.getCloseAlertModal()}
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
          <Text style={styles.text}>{'Tulis Ulasan'}</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.props.ratingProduct.data_item.map((item, index) => (
            <View key={index}>
              {item.product ? (
                <Card
                  containerStyle={{
                    borderRadius: wp('3%'),
                    marginBottom: wp('1%'),
                    marginTop: wp('0%'),
                  }}>
                  <View
                    style={[
                      styles.position2,
                      {justifyContent: 'center', alignSelf: 'center'},
                    ]}>
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
                    <View
                      style={[styles.textposition, {marginTop: wp('-2.5%')}]}>
                      <Text numberOfLines={3} multiline style={styles.title}>
                        {item.product?.name}
                      </Text>
                      <Text
                        style={{
                          color: '#777',
                          fontSize: hp('1.7%'),
                          fontFamily: 'Lato-Medium',
                          marginTop: wp('2%'),
                        }}>
                        {item.qty} barang x{' '}
                        {item.half ? (
                          <NumberFormat
                            value={Math.round(item.price_apps / 2) ?? '0'}
                            displayType={'text'}
                            thousandSeparator={true}
                            prefix={'Rp '}
                            renderText={value => (
                              <Text
                                numberOfLines={1}
                                style={{
                                  fontSize: hp('1.7%'),
                                  fontFamily: 'Lato-Medium',
                                  marginTop: wp('1%'),
                                }}>
                                {value}
                              </Text>
                            )}
                          />
                        ) : (
                          <NumberFormat
                            value={Math.round(item.price_apps) ?? '0'}
                            displayType={'text'}
                            thousandSeparator={true}
                            prefix={'Rp '}
                            renderText={value => (
                              <Text
                                numberOfLines={1}
                                style={{
                                  fontSize: hp('1.7%'),
                                  fontFamily: 'Lato-Medium',
                                  marginTop: wp('1%'),
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
                              fontSize: hp('1.7%'),
                              fontFamily: 'Lato-Medium',
                              marginTop: wp('1%'),
                              color: '#17a2b8',
                            }}>
                            {' ( '}
                            {item?.qty_konversi}{' '}
                            {item?.small_unit.charAt(0) +
                              item?.small_unit.slice(1).toLowerCase()}
                            {' )'}
                          </Text>
                        ) : null}
                      </Text>
                      <NumberFormat
                        value={Math.round(item.total_price) ?? '0'}
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={'Rp '}
                        renderText={value => (
                          <Text style={styles.text3}>{value}</Text>
                        )}
                      />
                    </View>
                  </View>
                </Card>
              ) : null}
              <View style={{marginTop: wp('2%')}}>
                <Rating
                  type="custom"
                  ratingCount={5}
                  imageSize={30}
                  startingValue={rating}
                  onFinishRating={value =>
                    this.handleRating(index, value, 'rating')
                  }
                />
                <View style={styles.textAreaContainer}>
                  <TextInput
                    autoCapitalize="none"
                    style={styles.textArea}
                    underlineColorAndroid="transparent"
                    numberOfLines={10}
                    multiline={true}
                    placeholder="Berikan komentarmu terkait barang ini"
                    placeholderTextColor="#A4A4A4"
                    onChangeText={value =>
                      this.handleRating(index, value, 'detail')
                    }
                  />
                </View>
              </View>
              {this.props.ratingProduct.data_item.length > 1 && (
                <Card.Divider
                  style={{
                    borderWidth: wp('0.1%'),
                    marginTop: wp('3%'),
                  }}
                />
              )}
            </View>
          ))}
          <TouchableOpacity
            style={[
              styles.buttonSelesai,
              {
                marginTop: wp('4%'),
                marginBottom: wp('4%'),
              },
            ]}
            onPress={() => this.postRating()}>
            <Text style={styles.textButton}>Kirim Ulasan</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
  dataUser: state.LoginReducer.dataUser,
  ratingProduct: state.RatingReducer.ratingProduct,
});

const mapDispatchToProps = dispatch => {
  return {
    rateAct: (value, tipe) => {
      dispatch(RatingAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(InputRatingProduct);

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
    marginBottom: wp('4%'),
  },
  text: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('2.4%'),
    paddingLeft: wp('5%'),
  },
  title: {
    fontSize: hp('2%'),
    fontFamily: 'Lato-Medium',
    textAlign: 'auto',
    width: wp('51%'),
    marginTop: wp('2%'),
  },
  position2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: wp('0%'),
  },
  imageStyle: {
    height: hp('12%'),
    width: wp('20%'),
    backgroundColor: '#F9F9F9',
    borderRadius: Size(10),
    marginLeft: wp('1%'),
  },
  textposition: {
    flex: 1,
    paddingHorizontal: 10,
  },
  textAreaContainer: {
    borderColor: '#fff',
    borderWidth: Size(1),
    borderRadius: Size(5),
    borderColor: '#C4C4C4',
    marginTop: wp('3%'),
    width: wp('92.5%'),
    alignSelf: 'center',
  },
  textArea: {
    height: hp('18%'),
    width: wp('91%'),
    textAlignVertical: 'top',
    marginLeft: wp('1%'),
  },
  buttonSelesai: {
    backgroundColor: '#529F45',
    borderRadius: 10,
    width: wp('92.5%'),
    height: hp('6%'),
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: wp('3%'),
  },
  textButton: {
    fontSize: hp('1.8%'),
    color: '#fff',
    fontFamily: 'Lato-Medium',
    alignSelf: 'center',
  },
  text3: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('1.9%'),
    color: '#529F45',
    marginTop: wp('2%'),
  },
});
