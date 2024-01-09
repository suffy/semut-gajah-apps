import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
  RefreshControl,
} from 'react-native';
import { connect } from 'react-redux';
import Size from '../components/Fontresponsive';
import axios from 'axios'
import NumberFormat from 'react-number-format';
import CONFIG from '../constants/config';
import { Card } from 'react-native-elements';
import moment from 'moment';
import IconPlus from '../assets/icons/Plus.svg';
import { ComplaintAction } from '../redux/Action';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';

const width = Dimensions.get('window').width;

export class OrderComplaint extends Component {

  UNSAFE_componentWillMount() {
    // lor(this);
  }

  componentWillUnmount() {
    // rol()
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <FlatList
          data={this.props.data}
          // refreshControl={
          //   <RefreshControl
          //     refreshing={this.props.refreshing}
          //     onRefresh={() => this.props.onRefresh()}
          //     colors={['#529F45', '#FFFFFF']}
          //   />
          // }
          onEndReached={() => this.props.onEndReached()}
          onMomentumScrollBegin={() => this.props.onMomentumScrollBegin}
          onEndReachedThreshold={0.5}
          initialNumToRender={10}
          keyExtractor={(item, index) => String(index)}
          ListFooterComponent={() => this.props.ListFooterComponent()}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate(
                    'OrderComplaintDetail',
                    this.props.complaintAct(item, 'detailComplaint'),
                  )
                }>
                <Card
                  containerStyle={{
                    borderRadius: wp('3%'),
                    marginBottom: wp('1%'),
                    marginLeft: wp('2%'),
                  }}>
                  <View style={styles.position2}>
                    <Text
                      style={{
                        color: '#777',
                        fontSize: hp('1.7%'),
                        fontFamily: 'Lato-Medium',
                        marginTop: wp('0%'),
                        marginBottom: wp('3%'),
                        marginLeft: wp('1%'),
                        width: wp('30%'),
                      }}>
                      {moment(item.order?.order_details[0]?.created_at).format(
                        'LLL',
                      )}
                    </Text>
                    <Text
                      style={{
                        color: '#777',
                        fontSize: hp('1.7%'),
                        fontFamily: 'Lato-Medium',
                        marginTop: wp('0%'),
                        marginBottom: wp('3%'),
                        marginLeft: wp('1%'),
                        width: wp('40%'),
                      }}>
                      Invoice: {item.order?.invoice}
                    </Text>
                  </View>
                  <View style={[styles.position2, {justifyContent: 'center'}]}>
                    <View>
                      <Image
                        source={
                          item.order?.order_details[0]?.product.image
                            ? {
                                uri: CONFIG.BASE_URL + item.order?.order_details[0]?.product
                                  .image,
                              }
                            : null
                        }
                        style={styles.imageStyle}
                      />
                    </View>
                    <View
                      style={[
                        styles.textposition,
                        {
                          marginTop: wp('-2.5%'),
                        },
                      ]}>
                      <Text numberOfLines={3} multiline style={styles.title}>
                        {item.order?.order_details[0]?.product.name}
                      </Text>
                      <NumberFormat
                        value={
                          Math.round(
                            item.order?.order_details[0]?.total_price
                          ) ?? '0'
                        }
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
                            Total: {value}
                          </Text>
                        )}
                      />
                    </View>
                  </View>
                  {item.order?.order_details?.length > '1' ? (
                    <View style={styles.textposition}>
                      <Text
                        style={{
                          fontSize: hp('1.8%'),
                          fontFamily: 'Lato-Medium',
                          marginTop: wp('2%'),
                          color: '#777',
                        }}>
                        +{item.order?.order_details?.length - 1} produk lainnya
                      </Text>
                    </View>
                  ) : null}
                </Card>
              </TouchableOpacity>
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
});

const mapDispatchToProps = dispatch => {
  return {
    complaintAct: (value, tipe) => {
      dispatch(ComplaintAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderComplaint);

const styles = StyleSheet.create({
  borderFilterComplaint: {
    marginLeft: wp('2%'),
    borderColor: '#777',
    borderRadius: Size(10),
    width: wp('20%'),
    borderWidth: wp('0.1%'),
    height: hp('6%'),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  position2: {
    flexDirection: 'row',
    marginBottom: hp('0.5%'),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: hp('1.8%'),
    fontFamily: 'Lato-Medium',
    textAlign: 'auto',
    width: wp('60%'),
    marginTop: wp('2%'),
  },
  imageStyle: {
    height: hp('12%'),
    width: wp('20%'),
    backgroundColor: '#F9F9F9',
    borderRadius: Size(10),
    marginLeft: wp('1%'),
  },
  cardBackground: {
    width,
    marginLeft: wp('0%'),
    borderColor: '#777',
    borderWidth: wp('0%'),
    justifyContent: 'center',
    paddingLeft: wp('5%'),
    marginTop: wp('0%'),
  },
  textposition: {
    flex: 1,
    paddingHorizontal: 10,
  },
});
