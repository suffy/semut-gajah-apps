import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import Size from '../components/Fontresponsive';
import axios from 'axios';
import CONFIG from '../constants/config';
import {Card} from 'react-native-elements';
import IconLainnya from '../assets/newIcons/iconShopingBag.svg';
import IconProfile from '../assets/newIcons/iconAkun2.svg';
import IconPembayaran from '../assets/icons/Pembayaran2.svg';
import IconPesanan from '../assets/newIcons/iconKomplain.svg';
import IconPromo from '../assets/newIcons/iconPromosi.svg';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';

const width = Dimensions.get('window').width;
const category = [
  {
    id: '1',
    navigate: 'HelpCareCategoryAccount',
    title: 'Akun',
    image: <IconProfile width={wp('11%')} height={hp('6%')} />,
  },
  {
    id: '2',
    navigate: 'HelpCareCategoryComplaint',
    title: 'Komplain Pesanan',
    image: <IconPesanan width={wp('12%')} height={hp('7%')} />,
  },
  {
    id: '3',
    navigate: 'HelpCareCategoryVoucher',
    title: 'Promosi',
    image: <IconPromo width={wp('12%')} height={hp('7%')} />,
  },
  {
    id: '4',
    navigate: 'HelpCareCategoryOther',
    title: 'Lainnya',
    image: <IconLainnya width={wp('12%')} height={hp('7%')} />,
  },
];

export class HelpCare extends Component {
  //    _isMounted = false;
  // constructor(props) {
  //       super(props);
    // if (Text.defaultProps == null) Text.defaultProps = {};
    // Text.defaultProps.allowFontScaling = false;
  //       this.state = {
  //           image: (null)
  //       };
  // }

  UNSAFE_componentWillMount() {
    // lor(this);
  }

  componentWillUnmount() {
    // rol();
  }

  render() {
    const {helpcategories} = this.props;
    console.log('helpcategories', helpcategories);
    return (
      <View style={styles.container}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: wp('3%'), marginLeft: wp('1%') }}>
        {category?.map((item, index) => (
          <View key={item.id} style={styles.button}>
            <TouchableOpacity
              style={{marginBottom: hp('1%')}}
              onPress={() => this.props.navigation.navigate('HelpCareCategoryDetail',{id : item.id})}>
                
              <View style={styles.cardBackground}>
              <View style={styles.icon}>{item.image}</View>
                {/* <Image
                  style={styles.image}
                  source={{uri: CONFIG.BASE_URL + item.icon}}
                  
                /> */}
              <Text style={styles.title}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}

        {/* <FlatList
          data={helpcategories}
          horizontal={false}
          numColumns={4}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate(item.navigate)}>
                <Card containerStyle={styles.cardBackground}>
                  <Image
                    style={styles.image}
                    source={{uri: CONFIG.BASE_URL + item.icon}}
                  />
                </Card>
                <Text style={styles.title}>{item.name}</Text>
              </TouchableOpacity>
            );
          }}
        /> */}
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
  dataUser: state.LoginReducer.dataUser,
});

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HelpCare);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    // marginTop: wp('2%'),
  },
  button: {
    // width: wp('20%'),
  },
  title: {
    fontSize: hp('1.7%'),
    color: '#575251',
    fontFamily: 'Lato-bold',
    textAlign: 'center',
    height: hp('4%'),
    fontWeight:'bold',
    // marginTop: wp('2%'),
    width: '70%'
  },
  cardBackground: {
    backgroundColor: '#FFF',
    width: hp('15%'),
    height: hp('15%'),
    justifyContent: 'center',
    alignItems: 'center',
    margin:hp('1.5%'),
    borderRadius:20,
    elevation:3,
    shadowColor:'black'
  },
  icon:{
    height: hp('9%'),
    alignItems: 'center',
    justifyContent:'center',
  },
  image: {
    width: wp('11%'),
    height: hp('7%'),
  },
});
