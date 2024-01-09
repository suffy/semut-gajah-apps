import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import ProductsImage from './ProductsImages';
import {Picker} from '@react-native-picker/picker';
import IconMinus from '../assets/icons/Minus.svg';
import IconPlus from '../assets/icons/Plus.svg';
import Size from '../components/Fontresponsive';
import axios from 'axios';
import CONFIG from '../constants/config';
import {
  orderminAct,
  orderplusAct,
  SubsAction,
  OrderAction,
} from '../redux/Action';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Storage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import IconBack from '../assets/icons/backArrow.svg';
import ModalAlert from '../components/ModalAlert';
import Snackbar from 'react-native-snackbar';

export class EditSubscribe extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      subscribeItems: {
        id: this.props.details.id,
        product_id: this.props.details.product_id,
        qty: parseInt(this.props.details.qty),
        start_at: this.props.details.start_at,
        time: this.props.details.time,
        notes: this.props.details.notes,
        status: this.props.details.status,
        half: this.props.details.half == 1 ? 'Setengah' : 'Satu',
      },
      showPickerDate: false,
      date: new Date(Date.now()),
      // dateAfter: new Date().setDate(new Date().getDate() - 1),
      dateSubscibe: '',
      alertData: '',
      modalAlert: false,
    };
  }

  UNSAFE_componentWillMount() {
    // lor(this);
  }

  componentWillUnmount() {
    // rol();
  }

  postSubscribe = async () => {
    if (this.state.subscribeItems.qty == 0) {
      this.setState({
        alertData: 'Jumlah tidak boleh 0',
        modalAlert: !this.state.modalAlert,
      });
    } else {
      try {
        let response;
        if (this.state.subscribeItems.half == 'Setengah') {
          response = await axios.post(
            `${CONFIG.BASE_URL}/api/subscribe/${this.props.details.id}`,
            {
              product_id: this.state.subscribeItems.product_id,
              qty: this.state.subscribeItems.qty,
              start_at: moment(this.state.subscribeItems.start_at).format(
                'YYYY-MM-DD',
              ),
              time: this.state.subscribeItems.time,
              notes: this.state.subscribeItems.notes,
              status: this.state.subscribeItems.status,
              half: 1,
            },
            {
              headers: {Authorization: `Bearer ${this.props.token}`},
            },
          );
        } else {
          response = await axios.post(
            `${CONFIG.BASE_URL}/api/subscribe/${this.props.details.id}`,
            {
              product_id: this.state.subscribeItems.product_id,
              qty: this.state.subscribeItems.qty,
              start_at: moment(this.state.subscribeItems.start_at).format(
                'YYYY-MM-DD',
              ),
              time: this.state.subscribeItems.time,
              notes: this.state.subscribeItems.notes,
              status: this.state.subscribeItems.status,
            },
            {
              headers: {Authorization: `Bearer ${this.props.token}`},
            },
          );
        }
        const data = response.data;
        console.log('data ubah===', data);
        if (data !== '' && data['success'] == true) {
          this.props.navigation.replace('ListTimeSubscribe');
        } else {
          this.setState({
            alertData: 'Edit subscribe gagal',
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
    }
  };

  quantityHandler = action => {
    let currentQty = this.state.subscribeItems.qty;

    if (action == 'more') {
      currentQty += 1;
    } else if (action == 'less' && currentQty > 0) {
      currentQty -= 1;
    } else {
      currentQty = 0;
    }
    console.log(currentQty);

    this.setState(prevState => ({
      subscribeItems: {
        ...prevState.subscribeItems,
        qty: currentQty,
      },
    }));
  };

  onChange = (event, value) => {
    this.setState({
      subscribeItems: {
        ...this.state.subscribeItems,
        start_at: value,
      },
    });
    if (Platform.OS === 'android') {
      this.setState({showPickerDate: false});
    }
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
    console.log('cek subscribe', JSON.stringify(this.state.subscribeItems));
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
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
          <Text style={styles.text}>{'Ubah Langganan'}</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.subscribe}>
            <ProductsImage
              key={this.props.details.id}
              image={this.props.details.product.image}
              navigation={this.props.navigation}
            />
            <View style={styles.positionSubscribe}>
              <Text style={styles.title}>Langganan</Text>
              {/* <View style={styles.positionDetail}> */}
              <Text
                style={[
                  styles.priceProduct,
                  {fontSize: hp('1.5%'), marginBottom: wp('2%')},
                ]}>
                Produk yang dipesan
              </Text>
              <Text style={[styles.priceProduct, {marginBottom: wp('2%')}]}>
                {this.props.details.product.name}
              </Text>
              <View style={styles.positionDetail}>
                <Text style={styles.priceProduct}>Jumlah</Text>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={() => this.quantityHandler('less')}
                    style={styles.iconminus}>
                    <IconMinus />
                  </TouchableOpacity>
                  <TextInput
                    onChangeText={value =>
                      this.setState({
                        subscribeItems: {
                          ...this.state.subscribeItems,
                          qty: parseInt(value),
                        },
                      })
                    }
                    required="number"
                    keyboardType="number-pad"
                    style={{
                      borderWidth: 1,
                      borderColor: '#cccccc',
                      paddingHorizontal: 12,
                      paddingTop: 3,
                      color: 'black',
                      fontSize: hp('1.8%'),
                      fontFamily: 'Lato-Medium',
                      width: wp('28%'),
                      textAlign: 'center',
                    }}>
                    {this.state.subscribeItems.qty}
                  </TextInput>
                  <TouchableOpacity
                    onPress={() => this.quantityHandler('more')}
                    style={styles.iconplus}>
                    <IconPlus />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.positionDetail}>
                <Text style={styles.priceProduct}>Waktu</Text>
                <View style={styles.picker}>
                  <Picker
                    selectedValue={this.state.subscribeItems.time}
                    itemStyle={{color: '#000000'}}
                    onValueChange={value =>
                      this.setState(prevState => ({
                        subscribeItems: {
                          ...prevState.subscribeItems,
                          time: value,
                        },
                      }))
                    }>
                    <Picker.Item
                      style={{
                        fontSize: hp('1.8%'),
                        fontFamily: 'Lato-Regular',
                      }}
                      label="Per 2 minggu"
                      value="2_week"
                      key={0}
                    />
                    <Picker.Item
                      style={{
                        fontSize: hp('1.8%'),
                        fontFamily: 'Lato-Regular',
                      }}
                      label="Per bulan"
                      value="month"
                    />
                  </Picker>
                </View>
              </View>
              <View style={styles.positionDetail}>
                <Text style={styles.priceProduct}>Pilih Waktu Langganan</Text>
                <TouchableOpacity
                  style={styles.buttonPilihTanggal}
                  onPress={() => this.setState({showPickerDate: true})}>
                  <Text>
                    {moment(this.state.subscribeItems.start_at).format(
                      'DD MMM YYYY',
                    )}
                  </Text>
                </TouchableOpacity>
              </View>
              {this.props.details.product.status_renceng ? (
                <View style={styles.positionDetail}>
                  <Text style={styles.priceProduct}>{'Satuan Renceng'}</Text>
                  <View style={styles.picker}>
                    <Picker
                      selectedValue={this.state.subscribeItems.half}
                      itemStyle={{color: '#000000'}}
                      onValueChange={value =>
                        this.setState(prevState => ({
                          subscribeItems: {
                            ...prevState.subscribeItems,
                            half: value,
                          },
                        }))
                      }>
                      <Picker.Item
                        style={{
                          fontSize: hp('1.8%'),
                          fontFamily: 'Lato-Regular',
                        }}
                        label={
                          'Full (' +
                          this.props.details.product.konversi_sedang_ke_kecil +
                          ' ' +
                          this.props.details.product.kecil.charAt(0) +
                          this.props.details.product.kecil
                            .slice(1)
                            .toLowerCase() +
                          ' )'
                        }
                        value={'Satu'}
                        key={0}
                      />
                      <Picker.Item
                        style={{
                          fontSize: hp('1.8%'),
                          fontFamily: 'Lato-Regular',
                        }}
                        label={
                          'Setengah (' +
                          this.props.details.product.konversi_sedang_ke_kecil / 2 +
                          ' ' +
                          this.props.details.product.kecil.charAt(0) +
                          this.props.details.product.kecil
                            .slice(1)
                            .toLowerCase() +
                          ' )'
                        }
                        value={'Setengah'}
                      />
                    </Picker>
                  </View>
                </View>
              ) : null}
              <View style={styles.positionDetail}>
                <Text style={styles.priceProduct}>Status</Text>
                <View style={styles.picker}>
                  <Picker
                    style={styles.picker}
                    selectedValue={this.state.subscribeItems.status}
                    onValueChange={value =>
                      this.setState(prevState => ({
                        subscribeItems: {
                          ...prevState.subscribeItems,
                          status: value,
                        },
                      }))
                    }>
                    <Picker.Item
                      style={{
                        fontSize: hp('1.8%'),
                        fontFamily: 'Lato-Medium',
                      }}
                      label="Aktif"
                      value="1"
                      key={0}
                    />
                    <Picker.Item
                      style={{
                        fontSize: hp('1.8%'),
                        fontFamily: 'Lato-Medium',
                      }}
                      label="Tidak Aktif"
                      value="0"
                    />
                  </Picker>
                </View>
              </View>
              <Text style={[styles.priceProduct, {marginTop: wp('3%')}]}>
                Catatan
              </Text>
              <View style={styles.textAreaContainer}>
                <TextInput
                  autoCapitalize="none"
                  style={styles.textArea}
                  underlineColorAndroid="transparent"
                  numberOfLines={10}
                  multiline={true}
                  value={this.state.subscribeItems.notes}
                  onChangeText={value =>
                    this.setState(prevState => ({
                      subscribeItems: {
                        ...prevState.subscribeItems,
                        notes: value,
                      },
                    }))
                  }
                />
              </View>
            </View>
          </View>
        </ScrollView>
        <View
          style={{
            alignItems: 'center',
            marginHorizontal: wp('5%'),
            marginVertical: wp('2%'),
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={styles.buttonCari}
            onPress={() => this.props.navigation.navigate('Produk')}>
            <Text style={styles.textButtonCari}>Cari barang lainnya</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonSelesai}
            onPress={() => this.postSubscribe()}>
            <Text style={styles.textButtonSelesai}>Selesai</Text>
          </TouchableOpacity>
        </View>
        {/* The date picker */}
        {this.state.showPickerDate && (
          <DateTimePicker
            minimumDate={new Date()}
            value={this.state.date}
            mode={'date'}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            is24Hour={true}
            onChange={this.onChange}
            style={styles.datePicker}
          />
        )}
      </View>
    );
  }
}

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
  menu: {
    marginRight: wp('2%'),
  },
  subscribe: {
    flex: 1,
    marginTop: 0,
  },
  positionSubscribe: {
    marginTop: wp('2%'),
    // marginLeft: 30,
    marginHorizontal: wp('5%'),
  },
  positionDetail: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: 'red'
  },
  title: {
    fontSize: hp('2.4%'),
    color: '#000000',
    fontFamily: 'Lato-Medium',
    marginBottom: 20,
  },
  priceProduct: {
    fontSize: hp('2%'),
    color: '#000000',
    fontFamily: 'Lato-Regular',
  },
  input: {
    width: wp('40%'),
    height: hp('8%'),
    textAlign: 'center',
    borderColor: '#C4C4C4',
    borderWidth: 1,
    borderRadius: Size(4),
    paddingHorizontal: wp('1%'),
    color: '#000000',
    fontFamily: 'Lato-Regular',
    fontSize: hp('1.4%'),
  },
  buttonEdit: {
    backgroundColor: '#E0C226',
    borderRadius: 10,
    width: wp('19%'),
    height: hp('5%'),
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSelesai: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#529F45',
    borderRadius: wp('1%'),
    width: wp('43%'),
    height: hp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonCari: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E07126',
    borderRadius: wp('1%'),
    width: wp('43%'),
    height: hp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButtonSelesai: {
    fontSize: hp('1.8%'),
    color: '#529F45',
    fontFamily: 'Lato-Medium',
    alignSelf: 'center',
  },
  textButtonCari: {
    fontSize: hp('1.8%'),
    color: '#E07126',
    fontFamily: 'Lato-Medium',
    alignSelf: 'center',
  },
  textEdit: {
    fontSize: hp('1.8%'),
    color: '#000000',
    fontFamily: 'Lato-Medium',
    alignSelf: 'center',
  },
  textAreaContainer: {
    borderColor: '#fff',
    borderWidth: Size(1),
    borderRadius: Size(4),
    borderColor: '#C4C4C4',
    fontSize: hp('1.8%'),
    color: '#000000',
    fontFamily: 'Lato-Regular',
    height: hp('10%'),
    width: wp('90%'),
    marginVertical: wp('2%'),
  },
  textArea: {
    textAlignVertical: 'top',
    paddingLeft: wp('1%'),
  },
  picker: {
    // marginTop: hp('-2%'),
    justifyContent: 'center',
    width: wp('40%'),
    height: wp('8%'),
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: wp('1%'),
  },
  iconplus: {
    borderWidth: Size(1),
    borderColor: '#cccccc',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: Size(4),
    borderBottomRightRadius: Size(4),
    width: wp('6%'),
  },
  iconminus: {
    borderWidth: 1,
    borderColor: '#cccccc',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: Size(4),
    borderBottomLeftRadius: Size(4),
    width: wp('6%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPilihTanggal: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DCDCDC',
    borderWidth: 1,
    width: wp('40%'),
    height: hp('4%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp('1%'),
  },
});

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
  dataUser: state.LoginReducer.dataUser,
  details: state.SubscribeReducer.item,
});

const mapDispatchToProps = dispatch => {
  return {
    orderplusAct: () => {
      dispatch({type: 'PLUS_ORDER'});
    },
    orderminAct: () => {
      dispatch({type: 'MINUS_ORDER'});
    },
    subsAct: (value, tipe) => {
      dispatch(SubsAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditSubscribe);
