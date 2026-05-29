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
import FastImage from 'react-native-fast-image';
import {connect} from 'react-redux';
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
import IconHerbal from '../assets/newIcons/iconHerbal.svg';
import IconSupMul from '../assets/newIcons/iconSuplemen.svg';
import IconFoodBev from '../assets/newIcons/iconMakananMinuman.svg';
import IconMinyak from '../assets/newIcons/iconMinyakAngin.svg';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const category = [
  {
    id: '1',
    navigate: 'Produk',
    name: 'Herbal',
    image: <IconHerbal width={wp('10%')} height={wp('10%')} />,
    icon: IconHerbal,
  },
  {
    id: '2',
    navigate: 'Produk',
    name: 'Supplemen dan Multivitamin',
    image: <IconSupMul width={wp('13%')} height={wp('13%')} />,
    icon: IconSupMul,
  },
  {
    id: '3',
    navigate: 'Produk',
    name: 'Makanan dan Minuman',
    image: <IconFoodBev width={wp('13%')} height={wp('13%')} />,
    icon: IconFoodBev,
  },
  {
    id: '4',
    navigate: 'Produk',
    name: 'Minyak Angin dan Balsem',
    image: <IconMinyak width={wp('13%')} height={wp('13%')} />,
    icon: IconMinyak,
  },
];

export class Category extends Component {
  render() {
    const {categories, getNavigasi} = this.props;

    const chunkArray = (arr, size) => {
      const result = [];
      for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
      }
      return result;
    };

    return (
      <View>
        {categories?.length > 0 && (
          <View style={styles.container}>
            <Text style={styles.judul}>{'Kategori'}</Text>
            <View style={styles.containerButton}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {chunkArray(
                  categories[0]
                    ?.sort((a, b) => a.menu_order - b.menu_order)
                    .slice(0, 100),
                  2,
                ).map((group, columnIndex) => (
                  <View key={columnIndex} style={styles.containerColumn}>
                    {group.map((item, rowIndex) => (
                      <TouchableWithoutFeedback
                        key={item.id ?? rowIndex}
                        onPress={() => getNavigasi(item)}>
                        <View style={styles.card}>
                          <View style={styles.viewCategory}>
                            <FastImage
                              style={styles.image}
                              source={{
                                uri: CONFIG.BASE_URL + item.icon,
                                priority: FastImage.priority.normal,
                              }}
                              resizeMode={FastImage.resizeMode.contain}
                            />
                            <Text
                              numberOfLines={2}
                              adjustsFontSizeToFit
                              style={styles.title}>
                              {item.name}
                            </Text>
                          </View>
                        </View>
                      </TouchableWithoutFeedback>
                    ))}
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: wp('100%'),
    flexDirection: 'column',
    backgroundColor: '#FFF',
    marginBottom: 5,
    paddingHorizontal: wp('5%'),
    paddingBottom: hp('2%'),
  },
  containerButton: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonCategory: {
    flex: 1,
  },
  viewCategory: {
    backgroundColor: '#FFF',
    height: wp('20%'),
    width: wp('20%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    elevation: 2,
  },
  judul: {
    fontSize: hp('2%'),
    fontFamily: 'Lato-Bold',
    color: '#575251',
    marginTop: hp('2%'),
    // marginLeft: wp('5%'),
    marginBottom: hp('2%'),
    fontWeight: 'bold',
  },
  title: {
    fontSize: wp('2%'), // proporsional terhadap card
    color: '#000000',
    fontFamily: 'Lato-Medium',
    textAlign: 'center',
    width: '90%',
  },
  image: {
    marginBottom: wp('1%'),
    width: wp('10%'),
    height: wp('10%'),
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
  card: {
    marginRight: wp('1%'),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingRight: 2,
    paddingLeft: 2,
    paddingBottom: 5,
  },
  containerColumn: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: wp('1%'),
    height: wp('45%'), // cukup tinggi agar 2 item muat
  },
});

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Category);
