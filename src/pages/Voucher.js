import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import {connect} from 'react-redux';
import {VoucherAction} from '../redux/Action';
import CONFIG from '../constants/config';
import Size from '../components/Fontresponsive';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Storage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';

const {width} = Dimensions.get('window');
const height = width * 0.3;
const widthItem = width / 2;
const voucher = [
  {
    id: '',
    code: '',
    type: '',
    percent: '',
    nominal: '',
    category: '',
    termandcondition: '',
    min_transaction: '',
    max_transaction: '',
    description: '',
    end_at: '',
  },
];

export class Voucher extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      active: 0,
      voucher: voucher,
    };
  }

  componentDidMount() {
    this.getVoucher();
  }

  UNSAFE_componentWillMount() {
    // lor(this);
  }

  componentWillUnmount() {
    // rol()
  }

  //Voucher
  getVoucher = async () => {
    try {
      let response = await axios.get(`${CONFIG.BASE_URL}/api/vouchers`, {
        headers: {Authorization: `Bearer ${this.props.token}`},
      });
      let data = response.data.data;
      this.setState({voucher: data});
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
  };

  change = ({nativeEvent}) => {
    const slide = Math.ceil(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
    );
    if (slide !== this.state.active) {
      this.setState({active: slide});
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
    return (
      <View>
        {this.state.voucher.length > 0 && (
          <View style={styles.container}>
            <ScrollView
              pagingEnabled
              horizontal
              onScroll={this.change}
              showsHorizontalScrollIndicator={false}
              style={styles.scroll}>
              {this.state.voucher.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    this.props.navigation.navigate(
                      'DetailVoucher',
                      this.props.voucherAct(item, 'voucher'),
                    )
                  }>
                  <Image
                    source={
                      item.file ? {uri: CONFIG.BASE_URL + item.file} : null
                    }
                    style={styles.image}></Image>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: wp('0%'),
    marginTop: wp('0%'),
  },
  scroll: {
    width,
    height,
  },
  image: {
    resizeMode: 'contain',
    width: widthItem,
    height,
    marginRight: wp('2%'),
    marginLeft: wp('4%'),
    borderRadius: wp('1%'),
  },
});

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
  dataUser: state.LoginReducer.dataUser,
});

const mapDispatchToProps = dispatch => {
  return {
    voucherAct: (value, tipe) => {
      dispatch(VoucherAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Voucher);
