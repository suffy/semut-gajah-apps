import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Image,
  FlatList,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {connect} from 'react-redux';
import {Card} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import axios from 'axios';
import CONFIG from '../constants/config';
import NumberFormat from 'react-number-format';
import {SubsAction} from '../redux/Action';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Font from '../components/Fontresponsive';
import DummyImage from '../assets/icons/IconLogo.svg';

export class Search extends Component {
  UNSAFE_componentWillMount() {
    // lor(this);
  }

  componentWillUnmount() {
    // rol()
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'white', alignItems: 'center'}}>
        <ScrollView
          pagingEnabled
          horizontal
          showsVerticalScrollIndicator={false}>
          <FlatList
            contentContainerStyle={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
            }}
            keyExtractor={(item, index) => `${index}`}
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
            scrollEnabled={false}
            ListFooterComponent={() => this.props.ListFooterComponent()}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity onPress={() => this.props.onItemPress(item)}>
                  <Card
                    containerStyle={{
                      borderRadius: wp('3%'),
                      marginBottom: wp('1%'),
                      width: wp('90%'),
                    }}>
                    <View
                      style={[
                        styles.position2,
                        {justifyContent: 'center', alignSelf: 'center'},
                      ]}>
                      <View>
                        {item.image ? (
                          <Image
                            source={{
                              uri: CONFIG.BASE_URL + item.image,
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
                          {item.name}
                        </Text>
                        <NumberFormat
                          value={Math.round(item?.price?.harga_ritel_gt) ?? '0'}
                          displayType={'text'}
                          thousandSeparator={true}
                          prefix={'Rp '}
                          renderText={value => (
                            <Text
                              numberOfLines={1}
                              style={[
                                styles.title,
                                {
                                  fontSize: hp('1.7%'),
                                  fontFamily: 'Lato-Medium',
                                  marginTop: wp('1%'),
                                },
                              ]}>
                              {value}
                            </Text>
                          )}
                        />
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
              );
            }}
          />
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
  dataUser: state.LoginReducer.dataUser,
  qty: state.ShoppingCartReducer.qty,
});

const mapDispatchToProps = dispatch => {
  return {
    notifAct: (value, tipe) => {
      dispatch(NotifAction(value, tipe));
    },
    subsAct: (value, tipe) => {
      dispatch(SubsAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);

const styles = StyleSheet.create({
  position2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: wp('0%'),
  },
  imageStyle: {
    height: wp('15%'),
    width: wp('15%'),
    backgroundColor: '#F9F9F9',
    borderRadius: Font(10),
    marginLeft: wp('1%'),
  },
  title: {
    fontSize: hp('1.5%'),
    fontFamily: 'Lato-Medium',
    textAlign: 'auto',
    width: wp('60%'),
    marginTop: wp('2%'),
  },
  textposition: {
    flex: 1,
    paddingHorizontal: 10,
  },
});
