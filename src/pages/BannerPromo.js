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
  TouchableWithoutFeedback,
} from 'react-native';
import {connect} from 'react-redux';
import {BannerAction,TopSpenderAction} from '../redux/Action';
import {Card} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import CONFIG from '../constants/config';
import axios from 'axios';
import Storage from '@react-native-async-storage/async-storage';
import {ActivityIndicator} from 'react-native-paper';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function LoadingApi() {
  return (
    <View style={styles.loadingApi}>
      <ActivityIndicator animating size="small" color="#529F45" />
    </View>
  );
}

export class BannerPromo extends Component {
  getNavigasi = (item, index) => {
    console.log('item', item, index);
    if(item.identity === "top_spender"){
      this.props.navigation.navigate(
        'TopSpender',
        this.props.topSpenderAct(item,'topSpender')
      );
    }else{
      if (index == 0) {
        this.props.navigation.navigate('ProdukKategori', {
          screen: 'HerbalPromo',
          idPromo: item.id,
          initial: false,
        });
      } else if (index == 1) {
        this.props.navigation.navigate('ProdukKategori', {
          screen: 'SupMulPromo',
          idPromo: item.id,
          initial: false,
        });
      } else if (index == 2) {
        this.props.navigation.navigate('ProdukKategori', {
          screen: 'FoodBevPromo',
          idPromo: item.id,
          initial: false,
        });
      } else if (index == 3) {
        this.props.navigation.navigate('ProdukKategori', {
          screen: 'MinyakPromo',
          idPromo: item.id,
          initial: false,
        });
      }
    }
  };

  render() {
    const {banners} = this.props;
    console.log('banners', banners);
    return (
      <View style={styles.container}>
        {banners[0]?.map((item, index) => {
          // if (item.position == 'middle') {
          // console.log(item.images);
          return (
            <TouchableWithoutFeedback
              key={index}
              style={styles.buttonCategory}
              onPress={() => this.getNavigasi(item, index)}>
              <Image
                resizeMode="contain"
                style={styles.images}
                source={{uri: CONFIG.BASE_URL + item.banner}}
              />
            </TouchableWithoutFeedback>
          );
          // }
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width: wp('100%'),
    // height: hp('28%'),
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: hp('1%'),
    // paddingHorizontal: wp('3%'),
    marginBottom:5,
    // marginTop: wp('3%'),
    // marginLeft: wp(1),
    // paddingVertical: hp('1%'),
    paddingHorizontal: wp('5%'),
  },
  buttonCategory: {
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#F8F8F8',
    borderRadius: hp('1.5%'),
    // width: wp('40%'),
    // height: hp('10%'),
    // marginTop: hp('6%'),
    // marginTop: wp('2%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  images: {
    width: wp('43%'),
    height: wp('20%'),
    borderRadius: hp('1.5%'),
    // backgroundColor: 'red',
    // marginTop:hp('10%')
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

const mapDispatchToProps = dispatch =>{
  return {
    topSpenderAct: (value, tipe) => {
      dispatch(TopSpenderAction(value, tipe));
    },
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(BannerPromo);
