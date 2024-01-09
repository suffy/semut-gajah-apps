import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Keyboard,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import CONFIG from '../constants/config';
import axios from 'axios';
import {connect} from 'react-redux';
import {LoginAction} from '../redux/Action';
import IconProvinsi from '../assets/icons/Provinsi.svg';
import IconKabupaten from '../assets/icons/Kabupaten.svg';
import IconKecamatan from '../assets/icons/Kecamatan.svg';
import IconKelurahan from '../assets/icons/Kelurahan.svg';
import IconKodepos from '../assets/icons/Kodepos.svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import ModalAlert from '../components/ModalAlert';
import Snackbar from 'react-native-snackbar';

export class FormAlamatEdit extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      isLoading: true,
      province: [],
      dataprovince: 0,
      city: [],
      datacity: 0,
      kecamatan: [],
      datakecamatan: 0,
      kelurahan: [],
      datakelurahan: 0,
      poscode: [],
      cek: false,
      cek2: false,
      cek3: false,
      cek4: false,
      alamat: props.alamat,
      alertData: '',
      modalAlert: false,
    };
  }

  UNSAFE_componentWillMount() {
    // lor(this);
    this.getProvinsi();
  }

  componentWillUnmount() {
    // rol()
  }

  getProvinsi = async () => {
    try {
      let response = await axios.get(`${CONFIG.BASE_URL}/api/location`, {
        params: {
          type: 'province',
        },
      });
      const data = response.data.data;
      this.setState({province: data});
      console.log(data);
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
      } else {
        this.setState({
          alertData: 'akses ke data provinsi gagal',
          modalAlert: !this.state.modalAlert,
        });
      }
    }
  };

  pickerProvince = async value => {
    const {province} = this.state;
    try {
      let dataProvince = province.find(province => province.id === value);
      if (value == 'Pilih Provinsi' && dataProvince.name == 'Pilih Provinsi') {
        return;
      } else {
        await this.setState({
          dataprovince: value,
        });
        // await this.props.loginAct(dataProvince.name, 'province');
        let data = dataProvince.name;
        this.props.provinsi(data);
        axios
          .get(`${CONFIG.BASE_URL}/api/location`, {
            params: {
              type: 'city',
              province_id: value,
            },
          })
          .then(response => {
            const data = response.data;
            this.setState({city: data.data});
            this.setState({cek: true});
          })
          .catch(error => {
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
            } else {
              this.setState({
                alertData: 'akses ke data kota gagal',
                modalAlert: !this.state.modalAlert,
              });
            }
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  pickerCity = async value => {
    const {city} = this.state;
    try {
      let dataCity = city.find(city => city.id === value);
      if (value == 'Pilih Kota' && dataCity.name == 'Pilih Kota') {
        return;
      } else {
        await this.setState({
          datacity: value,
        });
        // await this.props.loginAct(dataCity.name, 'city');
        let data = dataCity.name;
        this.props.kota(data);
        axios
          .get(`${CONFIG.BASE_URL}/api/location`, {
            params: {
              type: 'district',
              city_id: value,
            },
          })
          .then(response => {
            const data = response.data;
            this.setState({kecamatan: data.data});
            this.setState({cek2: true});
          })
          .catch(error => {
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
            } else {
              this.setState({
                alertData: 'akses ke data kecamatan gagal',
                modalAlert: !this.state.modalAlert,
              });
            }
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  pickerKecamatan = async value => {
    const {kecamatan} = this.state;
    try {
      let dataKecamatan = kecamatan.find(kecamatan => kecamatan.id === value);
      if (
        value == 'Pilih Kecamatan' &&
        dataKecamatan.name == 'Pilih Kecamatan'
      ) {
        return;
      } else {
        await this.setState({
          datakecamatan: value,
        });
        // await this.props.loginAct(dataKecamatan.name, 'district');
        let data = dataKecamatan.name;
        this.props.kecamatan(data);
        axios
          .get(`${CONFIG.BASE_URL}/api/location`, {
            params: {
              type: 'subdistrict',
              district_id: value,
            },
          })
          .then(response => {
            const data = response.data;
            this.setState({kelurahan: data.data});
            this.setState({cek3: true});
          })
          .catch(error => {
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
            } else {
              this.setState({
                alertData: 'akses ke data kelurahan gagal',
                modalAlert: !this.state.modalAlert,
              });
            }
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  pickerKelurahan = async value => {
    const {kelurahan} = this.state;
    try {
      let dataKelurahan = kelurahan.find(kelurahan => kelurahan.id === value);
      if (
        value == 'Pilih Kelurahan' &&
        dataKelurahan.name == 'Pilih Kelurahan'
      ) {
        return;
      } else {
        await this.setState({
          datakelurahan: value,
        });
        // await this.props.loginAct(dataKelurahan.name, 'subdistrict');
        let data = dataKelurahan.name;
        this.props.kelurahan(data);
        axios
          .get(`${CONFIG.BASE_URL}/api/location`, {
            params: {
              type: 'postal_code',
              province_id: this.state.dataprovince,
              city_id: this.state.datacity,
              district_id: this.state.datakecamatan,
            },
          })
          .then(response => {
            const data = response.data.data;
            const pos = [];
            data.forEach(obj => {
              if (!pos.some(o => o.postcode === obj.postcode)) {
                pos.push({...obj});
              }
            });
            this.setState({poscode: pos});
            this.setState({cek4: true});
          })
          .catch(error => {
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
            } else {
              this.setState({
                alertData: 'akses ke data kodepos gagal',
                modalAlert: !this.state.modalAlert,
              });
            }
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  pickerPos = async value => {
    if (value == 'Pilih Kodepos') {
      return;
    } else {
      // await this.props.loginAct(value, 'postcode');
      this.props.kodepos(value);
    }
  };

  getAlamat = () => {
    this.props.navigation.goBack();
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
    const {alamat} = this.state;
    console.log('alamat nih===>', alamat);
    return (
      // <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
      <View style={styles.container}>
        <ModalAlert
          modalAlert={this.state.modalAlert}
          alert={this.state.alertData}
          getCloseAlertModal={() => this.getCloseAlertModal()}
        />
        {/* <Logo
            width={wp('30%')}
            height={hp('16%')}
            style={styles.image}
          />
          <Text style={styles.textlogo}>{'Alamat'}</Text> */}
        {/* <Text style={styles.text}>Provinsi</Text> */}
        <View style={styles.posision}>
          <View style={styles.containerInput}>
            <View style={styles.viewPicker}>
              <Picker
                style={styles.picker}
                mode="dialog"
                onFocus={Keyboard.dismiss}
                dropdownIconColor={'#E07126'}
                dropdownIconRippleColor={'#529F45'}
                itemStyle={{
                  color: '#A4A4A4',
                  backgroundColor: '#FFFFFF',
                  fontFamily: 'Lato-Medium',
                  fontSize: hp('1.6%'),
                }}
                selectedValue={this.state.province}
                onValueChange={value => this.pickerProvince(value)}>
                <Picker.Item
                  style={styles.pickerItem}
                  fontFamily="Lato-Medium"
                  color="#000000"
                  key={0}
                  label={alamat.provinsi}
                  value={alamat.provinsi}
                />
                {this.state.province.map(province => {
                  return (
                    <Picker.Item
                      style={styles.pickerItem}
                      fontFamily="Lato-Medium"
                      color="#000000"
                      key={province.id}
                      label={province.name}
                      value={province.id}
                    />
                  );
                })}
              </Picker>
            </View>
          </View>
          <IconProvinsi
            style={styles.icon}
            width={wp('6%')}
            height={hp('6%')}
          />
        </View>
        {/* <Text style={styles.text}>Kabupaten/Kota</Text> */}
        <View style={styles.posision}>
          <View style={styles.containerInput}>
            <View style={styles.viewPicker}>
              <Picker
                style={styles.picker}
                mode="dialog"
                onFocus={Keyboard.dismiss}
                dropdownIconColor={'#E07126'}
                dropdownIconRippleColor={'#529F45'}
                itemStyle={{
                  color: '#A4A4A4',
                  backgroundColor: '#FFFFFF',
                  fontFamily: 'Lato-Medium',
                  fontSize: hp('1.6%'),
                }}
                selectedValue={this.state.city}
                onValueChange={value => this.pickerCity(value)}>
                <Picker.Item
                  style={styles.pickerItem}
                  fontFamily="Lato-Medium"
                  color="#000000"
                  key={0}
                  label={alamat.kota}
                  value={alamat.kota}
                  enabled={this.state.cek}
                />
                {this.state.city.map(city => {
                  return (
                    <Picker.Item
                      style={styles.pickerItem}
                      fontFamily="Lato-Medium"
                      color="#000000"
                      key={city}
                      label={city.name}
                      value={city.id}
                    />
                  );
                })}
              </Picker>
            </View>
          </View>
          <IconKabupaten
            style={styles.icon}
            width={wp('6%')}
            height={hp('6%')}
          />
        </View>
        {/* <Text style={styles.text}>Kecamatan</Text> */}
        <View style={styles.posision}>
          <View style={styles.containerInput}>
            <View style={styles.viewPicker}>
              <Picker
                style={styles.picker}
                mode="dialog"
                onFocus={Keyboard.dismiss}
                dropdownIconColor={'#E07126'}
                dropdownIconRippleColor={'#529F45'}
                itemStyle={{
                  color: '#A4A4A4',
                  backgroundColor: '#FFFFFF',
                  fontFamily: 'Lato-Medium',
                  fontSize: hp('1.6%'),
                }}
                selectedValue={this.state.kecamatan}
                onValueChange={value => this.pickerKecamatan(value)}>
                <Picker.Item
                  style={styles.pickerItem}
                  fontFamily="Lato-Medium"
                  color="#000000"
                  key={0}
                  label={alamat.kecamatan}
                  value={alamat.kecamatan}
                  enabled={this.state.cek2}
                />
                {this.state.kecamatan.map(kecamatan => {
                  return (
                    <Picker.Item
                      style={styles.pickerItem}
                      fontFamily="Lato-Medium"
                      color="#000000"
                      key={kecamatan}
                      label={kecamatan.name}
                      value={kecamatan.id}
                    />
                  );
                })}
              </Picker>
            </View>
          </View>
          <IconKecamatan
            style={styles.icon}
            width={wp('6%')}
            height={hp('6%')}
          />
        </View>
        {/* <Text style={styles.text}>Kelurahan</Text> */}
        <View style={styles.posision}>
          <View style={styles.containerInput}>
            <View style={styles.viewPicker}>
              <Picker
                style={styles.picker}
                mode="dialog"
                onFocus={Keyboard.dismiss}
                dropdownIconColor={'#E07126'}
                dropdownIconRippleColor={'#529F45'}
                itemStyle={{
                  color: '#A4A4A4',
                  backgroundColor: '#FFFFFF',
                  fontFamily: 'Lato-Medium',
                  fontSize: hp('1.6%'),
                }}
                selectedValue={this.state.kelurahan}
                onValueChange={
                  value => this.pickerKelurahan(value) //sebelumnya ini pickerPos
                }>
                <Picker.Item
                  style={styles.pickerItem}
                  fontFamily="Lato-Medium"
                  color="#000000"
                  key={0}
                  label={alamat.kelurahan}
                  value={alamat.kelurahan}
                  enabled={this.state.cek3}
                />
                {this.state.kelurahan.map(kelurahan => {
                  return (
                    <Picker.Item
                      style={styles.pickerItem}
                      fontFamily="Lato-Medium"
                      color="#000000"
                      key={kelurahan}
                      label={kelurahan.name}
                      value={kelurahan.id}
                    />
                  );
                })}
              </Picker>
            </View>
          </View>
          <IconKelurahan
            style={styles.icon}
            width={wp('6%')}
            height={hp('6%')}
          />
        </View>
        {/* <Text style={styles.text}>Kode Pos</Text> */}
        <View style={styles.posision}>
          <View style={styles.containerInput}>
            <View style={styles.viewPicker}>
              <Picker
                style={styles.picker}
                mode="dialog"
                onFocus={Keyboard.dismiss}
                dropdownIconColor={'#E07126'}
                dropdownIconRippleColor={'#529F45'}
                itemStyle={{
                  color: '#A4A4A4',
                  backgroundColor: '#FFFFFF',
                  fontFamily: 'Lato-Medium',
                  fontSize: hp('1.6%'),
                }}
                selectedValue={this.state.poscode}
                onValueChange={value => this.pickerPos(value)}>
                <Picker.Item
                  style={styles.pickerItem}
                  fontFamily="Lato-Medium"
                  color="#000000"
                  key={0}
                  label={alamat.kode_pos}
                  value={alamat.kode_pos}
                  enabled={this.state.cek4}
                />
                {this.state.poscode.map(poscode => {
                  return (
                    <Picker.Item
                      style={styles.pickerItem}
                      fontFamily="Lato-Medium"
                      color="#000000"
                      key={poscode}
                      // label={poscode.name}
                      label={`${poscode.postcode}`}
                      value={poscode.postcode}
                    />
                  );
                })}
              </Picker>
            </View>
          </View>
          <IconKodepos style={styles.icon} width={wp('6%')} height={hp('6%')} />
        </View>
        {/* <TouchableOpacity
            onPress={() => this.getAlamat()}
            style={styles.button}>
            <Text style={styles.textButton}>{'Submit'}</Text>
          </TouchableOpacity> */}
      </View>
      // </ScrollView>
    );
  }
}
const mapStateToProps = state => ({
  alamat: state.LoginReducer.alamat,
});

const mapDispatchToProps = dispatch => {
  return {
    loginAct: (value, tipe) => {
      dispatch(LoginAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormAlamatEdit);

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    // width: wp('100%'),
    // height: hp('1%'00),
    alignItems: 'center',
    marginTop: hp('1%'),
    // justifyContent: 'center',
    // paddingTop: hp('1%'),
  },
  textlogo: {
    color: '#529F45',
    fontFamily: 'Lato-Medium',
    fontSize: hp('3%'),
    marginTop: hp('1.5%'),
    marginBottom: hp('4%'),
  },
  text: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('2%'),
    // backgroundColor: '#E07126',
    height: hp('5%'),
    width: wp('70%'),
    borderTopLeftRadius: hp('1.5%'),
    borderTopRightRadius: hp('1.5%'),
    paddingVertical: wp('1%'),
    // paddingLeft: wp('3),
  },
  containerInput: {
    overflow: 'hidden',
    paddingBottom: hp('1.5%'),
    paddingHorizontal: wp('2%'),
    marginTop: hp('1%'),
  },
  viewPicker: {
    borderWidth: 1,
    borderRadius: hp('2%'),
    borderColor: '#E8E8E8',
    // marginVertical: hp('1%'),
    // width: wp('70%'),
    // paddingBottom: hp('3%'),
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 10,
  },
  picker: {
    height: hp('6.5%'),
    width: wp('61%'),
    marginLeft: hp('4.5%'),
    marginTop: hp('-1%'),
    transform: [{scaleX: 1}, {scaleY: 0.8}],
    // justifyContent: 'center'
  },
  pickerItem: {
    backgroundColor: '#FFFFFF',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#529F45',
    height: hp('5%'),
    width: wp('55%'),
    borderRadius: wp('3%'),
    marginVertical: hp('2%'),
  },
  textButton: {
    fontFamily: 'Lato-Medium',
    color: 'white',
    fontSize: hp('1.6%'),
  },
  posision: {
    flexDirection: 'column',
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    top: hp('1%'),
    right: wp('62%'),
  },
});
