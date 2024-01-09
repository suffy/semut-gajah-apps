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
import IconProvinsi from '../assets/newIcons/iconProvinsi.svg';
import IconKabupaten from '../assets/newIcons/iconKota.svg';
import IconKecamatan from '../assets/newIcons/iconKecamatan.svg';
import IconKelurahan from '../assets/newIcons/iconKelurahan.svg';
import IconKodepos from '../assets/newIcons/iconKodePos.svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import ModalAlert from '../components/ModalAlert';
import Snackbar from 'react-native-snackbar';

export class FormAlamat extends Component {
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
      dataposcode: 0,
      cek: false,
      cek2: false,
      cek3: false,
      cek4: false,
      alertData: '',
      modalAlert: false,
    };
  }

  UNSAFE_componentWillMount() {
    // lor(this);
    this._isMounted = true;
    this.getProvinsi();
  }

  componentWillUnmount() {
    // rol()
    this._isMounted = false;
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
      // const index0 = {id:0, name:"Pilih Provinsi"}
      // this.state.province.unshift(index0)
      // console.log(data);
      
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
        this.setState({
          dataprovince: value,
        });
        // await this.props.loginAct(dataProvince.name, 'province');
        let data = dataProvince?.name;
        // console.log("data provider "+JSON.stringify(data))
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
      await this.setState({
        dataposcode: value,
      });
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
    const {province, city, kecamatan, kelurahan, poscode} = this.state;
    const {textProvince,textCity,textPoscode,textKecamatan,textKelurahan} = this.props;
    // console.log("kode pos "+ province);
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
                dropdownIconColor={'#479933'}
                dropdownIconRippleColor={'#529F45'}
                itemStyle={{
                  color: '#A4A4A4',
                  backgroundColor: '#FFFFFF',
                  fontFamily: 'Lato-Medium',
                  fontSize: hp('1.6%'),
                }}
                selectedValue={this.state.dataprovince}
                onValueChange={value => this.pickerProvince(value)}>
                <Picker.Item
                  style={styles.pickerItem}
                  fontFamily="Lato-Medium"
                  color={textProvince != null ? "#000":"#C1B5B2"}
                  key={0}
                  label={textProvince||'Pilih Provinsi'}
                  value={'Pilih Provinsi'}
                />
                {province &&
                  province.map(province => {
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
                dropdownIconColor={'#479933'}
                dropdownIconRippleColor={'#529F45'}
                itemStyle={{
                  color: '#A4A4A4',
                  backgroundColor: '#FFFFFF',
                  fontFamily: 'Lato-Medium',
                  fontSize: hp('1.6%'),
                }}
                selectedValue={this.state.datacity}
                onValueChange={value => this.pickerCity(value)}>
                <Picker.Item
                  style={styles.pickerItem}
                  fontFamily="Lato-Medium"
                  color={textCity != null ? "#000":"#C1B5B2"}
                  key={0}
                  label={textCity||'Pilih Kabupaten/Kota'}
                  value={'Pilih Kota'}
                  enabled={this.state.cek}
                />
                {city &&
                  city.map(city => {
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
                dropdownIconColor={'#479933'}
                dropdownIconRippleColor={'#529F45'}
                itemStyle={{
                  color: '#A4A4A4',
                  backgroundColor: '#FFFFFF',
                  fontFamily: 'Lato-Medium',
                  fontSize: hp('1.6%'),
                }}
                selectedValue={this.state.datakecamatan}
                onValueChange={value => this.pickerKecamatan(value)}>
                <Picker.Item
                  style={styles.pickerItem}
                  fontFamily="Lato-Medium"
                  color={textKecamatan != null ? "#000":"#C1B5B2"}
                  key={0}
                  label={textKecamatan||'Pilih Kecamatan'}
                  value={'Pilih Kecamatan'}
                  enabled={this.state.cek2}
                />
                {kecamatan &&
                  kecamatan.map(kecamatan => {
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
                dropdownIconColor={'#479933'}
                dropdownIconRippleColor={'#529F45'}
                itemStyle={{
                  color: '#A4A4A4',
                  backgroundColor: '#FFFFFF',
                  fontFamily: 'Lato-Medium',
                  fontSize: hp('1.6%'),
                }}
                selectedValue={this.state.datakelurahan}
                onValueChange={
                  value => this.pickerKelurahan(value) //sebelumnya ini pickerPos
                }>
                <Picker.Item
                  style={styles.pickerItem}
                  fontFamily="Lato-Medium"
                  color={textKelurahan != null ? "#000":"#C1B5B2"}
                  key={0}
                  label={textKelurahan||'Pilih Kelurahan'}
                  value={'Pilih Kelurahan'}
                  enabled={this.state.cek3}
                />
                {kelurahan &&
                  kelurahan.map(kelurahan => {
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
                dropdownIconColor={'#479933'}
                dropdownIconRippleColor={'#529F45'}
                itemStyle={{
                  color: '#A4A4A4',
                  backgroundColor: '#FFFFFF',
                  fontFamily: 'Lato-Medium',
                  fontSize: hp('1.6%'),
                }}
                selectedValue={this.state.dataposcode}
                onValueChange={value => this.pickerPos(value)}>
                <Picker.Item
                  style={styles.pickerItem}
                  fontFamily="Lato-Medium"
                  color="#A4A4A4"
                  key={0}
                  label={'Pilih Kodepos'}
                  value={'Pilih Kodepos'}
                  enabled={this.state.cek4}
                />
                {poscode &&
                  poscode.map(poscode => {
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
const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => {
  return {
    loginAct: (value, tipe) => {
      dispatch(LoginAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormAlamat);

const styles = StyleSheet.create({
  // scroll: {
  //   flex: 1,
  //   backgroundColor: '#fff',
  // },
  container: {
    // width: wp('100%'),
    // height: hp('1%'00),
    alignItems: 'center',
    marginTop: hp('2%'),
    // marginBottom: hp('2%'),
    // justifyContent: 'center',
    // paddingTop: hp('1%'),
  },
  containerInput: {
    overflow: 'hidden',
    paddingBottom: hp('3%'),
    paddingHorizontal: wp('2%'),
  },
  viewPicker: {
    borderWidth: 1,
    borderRadius: hp('2.7%'),
    borderColor: '#E8E8E8',
    backgroundColor: '#F1F1F1',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 7,
  },
  picker: {
    height: hp('7%'),
    width: wp('80%'),
    marginLeft: hp('-0.8%'),
    marginRight: hp('-4.5%'),
    marginTop: hp('-1%'),
    transform: [{scaleX: 0.7}, {scaleY: 0.65}],
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
    // marginVertical: hp('2%'),
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
    top: hp('0%'),
    left: wp('7%'),
  },
});
