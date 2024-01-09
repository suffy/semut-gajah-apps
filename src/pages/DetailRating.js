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
import axios from 'axios';
import NumberFormat from 'react-number-format';
import CONFIG from '../constants/config';
import {Card, Rating} from 'react-native-elements';
import {RatingAction} from '../redux/Action';
import moment from 'moment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import IconBack from '../assets/icons/backArrow.svg';
import DummyImage from '../assets/icons/IconLogo.svg';

const width = Dimensions.get('window').width;

export class DetailRating extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      rating: '',
    };
  }

  UNSAFE_componentWillMount() {
    // lor(this);
  }

  componentWillUnmount() {
    // rol();
  }

  render() {
    const {rating} = this.state;
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
          <Text style={styles.text}>{'Detail Ulasan'}</Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{marginBottom: wp('3%')}}>
          {this.props.rating.data_review.map((item, index) => (
            <View key={index}>
              {item.review ? (
                <>
                  <Card
                    containerStyle={{
                      borderRadius: wp('3%'),
                      marginBottom: wp('1%'),
                    }}>
                    <View
                      style={[styles.position2, {justifyContent: 'center'}]}>
                      <View>
                        {item.review.image ? (
                          <Image
                            source={{
                              uri: CONFIG.BASE_URL + item.review.image,
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
                          {item.review.name}
                        </Text>
                        <Text
                          style={{
                            color: '#777',
                            fontSize: hp('1.7%'),
                            fontFamily: 'Lato-Medium',
                            marginTop: wp('2%'),
                          }}>
                          {item.qty ?? '0'} barang x{' '}
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
                  <View
                    style={{
                      marginLeft: wp('4%'),
                      marginTop: wp('2%'),
                    }}>
                    <Text style={{marginTop: wp('2%')}}>
                      <Rating
                        imageSize={25}
                        readonly
                        startingValue={item.review.star_review}
                      />
                    </Text>
                    <View style={[styles.position2, {marginTop: wp('2%')}]}>
                      <Text
                        style={{
                          fontSize: hp('1.8%'),
                          fontFamily: 'Lato-Medium',
                          marginLeft: wp('0%'),
                        }}>
                        {this.props.dataUser.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: hp('0.8%'),
                          fontFamily: 'Lato-Medium',
                          marginLeft: wp('2%'),
                          color: '#777',
                        }}>
                        ⬤
                      </Text>
                      <Text
                        style={{
                          fontSize: hp('1.7%'),
                          fontFamily: 'Lato-Medium',
                          marginLeft: wp('2%'),
                        }}>
                        {moment(item.review.created_at).format('LLL')}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: hp('1.5%'),
                        fontFamily: 'Lato-Medium',
                        color: '#777',
                        marginTop: wp('2%'),
                      }}>
                      {item.review.detail_review}
                    </Text>
                  </View>
                </>
              ) : null}
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
  dataUser: state.LoginReducer.dataUser,
  rating: state.RatingReducer.rating,
});

const mapDispatchToProps = dispatch => {
  return {
    rateAct: (value, tipe) => {
      dispatch(RatingAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailRating);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: hp('8%'),
    backgroundColor: 'white',
    paddingHorizontal: wp('5%'),
    borderBottomWidth: 4,
    borderColor: '#ddd',
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
    width: wp('60%'),
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
    borderRadius: hp('1.5%'),
    marginLeft: wp('1%'),
  },
  textposition: {
    flex: 1,
    paddingHorizontal: 10,
  },
  text3: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('1.9%'),
    color: '#529F45',
    marginTop: wp('2%'),
  },
});
