import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {Component} from 'react';
import DummyImage from '../assets/icons/IconLogo.svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import CONFIG from '../constants/config';
import {
  SubsAction,
  LoginAction,
  NotifAction,
  TopSpenderAction,
} from '../redux/Action';
import {connect} from 'react-redux';
class ProductVarian extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
  }
  render() {
    const {dataVarian, onPressVarian, navigation, subsAct, getVarian} =
      this.props;
    return dataVarian.length >= 2 ? (
      <View style={styles.container}>
        {dataVarian != undefined ? (
          <Text style={styles.textVarian}>Semua varian</Text>
        ) : null}
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {dataVarian != undefined ? (
            dataVarian.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    navigation.navigate(
                      'ProdukDeskripsi',
                      {
                        initial: false,
                      },
                      subsAct(item, 'item'),
                    )
                  }>
                  {item?.image == undefined ? (
                    <DummyImage style={styles.imagesVarian} />
                  ) : (
                    <Image
                      source={
                        dataVarian != undefined ? (
                          {uri: CONFIG.BASE_URL + item?.image}
                        ) : (
                          <DummyImage style={styles.imagesVarian} />
                        )
                      }
                      style={styles.imagesVarian}
                    />
                  )}
                </TouchableOpacity>
              );
            })
          ) : (
            <DummyImage style={styles.imagesVarian} />
          )}
        </ScrollView>
      </View>
    ) : null;
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 8,
    // paddingHorizontal: wp('5%'),
    // flexDirection: 'row',
  },
  imagesVarian: {
    width: 60,
    height: 60,
    marginLeft: 5,
    marginRight: 10,
    backgroundColor: '#FFFFFF',
  },
  textVarian: {
    fontSize: hp('2%'),
    color: '#575251',
    fontFamily: 'Lato-Bold',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
});
const mapStateToProps = state => ({
  dataUser: state.LoginReducer.dataUser,
  token: state.LoginReducer.token,
  qty: state.ShoppingCartReducer.qty,
});

const mapDispatchToProps = dispatch => {
  return {
    subsAct: (value, tipe) => {
      dispatch(SubsAction(value, tipe));
    },
    loginAct: (value, tipe) => {
      dispatch(LoginAction(value, tipe));
    },
    notifAct: (value, tipe) => {
      dispatch(NotifAction, BannerAction(value, tipe));
    },
    topSpenderAct: (value, tipe) => {
      dispatch(TopSpenderAction(value, tipe));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ProductVarian);
