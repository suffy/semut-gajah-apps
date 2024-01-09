import React, {Component} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TextInput,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import axios from 'axios';
import CONFIG from '../constants/config';
import Size from '../components/Fontresponsive';
import {LoginAction} from '../redux/Action';
import {connect} from 'react-redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Storage from '@react-native-async-storage/async-storage';
import ModalAlert from '../components/ModalAlert';
import ModalDelete from '../components/ModalDelete';
import Snackbar from 'react-native-snackbar';

export class FormTambahAlamat extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      address: '',
      alertData: '',
      modalAlert: false,
      alertDelete: '',
      tambahanDelete: '',
      modalDelete: false,
    };
  }

  UNSAFE_componentWillMount() {
    // lor(this);
    this._isMounted = true;
  }

  componentWillUnmount = () => {
    // rol()
    this.props.loginAct('Pilih Provinsi', 'province');
    this.props.loginAct('Kota', 'city');
    this.props.loginAct('Kecamatan', 'district');
    this.props.loginAct('Kelurahan', 'subdistrict');
    this.props.loginAct('Kode Pos', 'postcode');
    this._isMounted = false;
  };

  getCloseAlertModal() {
    this.setState({modalAlert: !this.state.modalAlert});
  }

  getCloseModalDelete = async e => {
    this.setState({modalDelete: !this.state.modalDelete});
    if (!e) {
      if (!this.state.address.trim()) {
        this.setState({
          alertData: 'Pastikan diisi alamatnya',
          modalAlert: !this.state.modalAlert,
        });
        return;
      } else if (this.props.postcode === 'Kode Pos') {
        this.setState({
          alertData: 'Pastikan diisi kodeposnya',
          modalAlert: !this.state.modalAlert,
        });
        return;
      } else {
        console.log('MASUK', this.props.alamat);
        try {
          let response = await axios.post(
            `${CONFIG.BASE_URL}/api/address`,
            {
              address: this.state.address,
              province: this.props.province,
              city: this.props.city,
              district: this.props.district,
              subdistrict: this.props.subdistrict,
              postal_code: this.props.postcode,
            },
            {
              headers: {
                Authorization: `Bearer ${this.props.token}`,
              },
            },
            {timeout: 1000},
          );
          const data = response.data;
          console.log('DATA', data.data);
          if (data.data != null) {
            this.setState({
              alertData: 'Alamat Berhasil Ditambahkan',
              modalAlert: !this.state.modalAlert,
            });
            this.props.loginAct(data.data, 'dataUser');
            this.props.navigation.replace('DataAlamat');
          } else {
            this.setState({
              alertData: 'Alamat gagal ditambahkan  ' + data.message,
              modalAlert: !this.state.modalAlert,
            });
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
          }
        }
      }
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container2}>
        <ModalDelete
          modalDelete={this.state.modalDelete}
          tambahanDelete={this.state.tambahanDelete}
          alertDelete={this.state.alertDelete}
          getCloseModalDelete={e => this.getCloseModalDelete(e)}
        />
        <ModalAlert
          modalAlert={this.state.modalAlert}
          alert={this.state.alertData}
          getCloseAlertModal={() => this.getCloseAlertModal()}
        />
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
          <View style={styles.container}>
            {/* <Logo
                width={wp('3%'5)}
                height={hp('1%'6)}
                style={styles.image}
              /> */}
            <Text style={styles.textlogo}>{'Tambah Alamat'}</Text>

            <View style={styles.posision}>
              <Text style={[styles.textStyle]}>{'Alamat'}</Text>
              <TouchableOpacity
                style={styles.buttonAlamat}
                onPress={() => this.props.navigation.navigate('FormAlamat')}>
                <Text style={styles.textbuttonAlamat}>
                  {this.props.province}
                </Text>
                <Text style={styles.textbuttonAlamat}>{this.props.city}</Text>
                <Text style={styles.textbuttonAlamat}>
                  {this.props.district}
                </Text>
                <Text style={styles.textbuttonAlamat}>
                  {this.props.subdistrict}
                </Text>
                <Text style={styles.textbuttonAlamat}>
                  {this.props.postcode}
                </Text>
              </TouchableOpacity>
              <TextInput
                autoCapitalize="none"
                style={[styles.inputStyle, {height: hp('7%')}]}
                multiline
                onChangeText={value => {
                  this._isMounted && this.setState({address: value});
                }}></TextInput>
            </View>

            <View>
              <TouchableOpacity
                style={styles.buttonSimpan}
                onPress={() =>
                  this.setState({
                    alertDelete: 'Apakah yakin ingin menambah alamat anda?',
                    modalDelete: !this.state.modalDelete,
                  })
                }>
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    fontFamily: 'Lato-Medium',
                    fontSize: hp('1.8%'),
                  }}>
                  {'Simpan'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
  dataUser: state.LoginReducer.dataUser,
  alamat: state.LoginReducer.alamat,
  province: state.LoginReducer.province,
  city: state.LoginReducer.city,
  district: state.LoginReducer.district,
  subdistrict: state.LoginReducer.subdistrict,
  postcode: state.LoginReducer.postcode,
});

const mapDispatchToProps = dispatch => {
  return {
    loginAct: (value, tipe) => {
      dispatch(LoginAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormTambahAlamat);

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  background: {
    flexGrow: 1,
    height: hp('100%'),
    alignItems: 'center',
    paddingVertical: hp('18%'),
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: wp('100%'),
    height: hp('100%'),
    alignItems: 'flex-start',
    padding: wp('4%'),
  },
  container2: {
    flex: 1,
  },
  textlogo: {
    // color: '#529F45',
    color: '#000',
    fontFamily: 'Lato-Medium',
    fontSize: hp('2.4%'),
  },
  posision: {
    flexDirection: 'column',
    paddingVertical: hp('2%'),
  },
  inputStyle: {
    color: 'black',
    fontFamily: 'Lato-Bold',
    fontSize: hp('1.6%'),
    width: wp('90%'),
    textAlign: 'left',
    borderColor: '#E8E8E8',
    borderBottomWidth: 2,
    height: hp('4%'),
    paddingVertical: 0,
  },
  textStyle: {
    fontFamily: 'Lato-Bold',
    fontSize: hp('1.6%'),
    // paddingTop: hp('3%'),
    // paddingLeft:Font(34)
  },
  containerButton: {
    flexDirection: 'row',
  },
  buttonSimpan: {
    backgroundColor: '#529F45',
    height: hp('4.5%'),
    width: wp('90%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Size(10),
    marginTop: hp('1%'),
  },
  comboPassword: {
    flexDirection: 'row',
  },
  eye: {
    paddingTop: hp('4%'),
    marginLeft: wp('-5%'),
  },
  textLupaPassword: {
    fontFamily: 'Lato-Regular',
    fontSize: hp('1.2%'),
    paddingTop: hp('1%'),
    // paddingLeft:Font(34)
  },
  buttonAlamat: {
    backgroundColor: '#E5E5E5',
    height: hp('13%'),
    alignItems: 'flex-start',
    marginTop: hp('2%'),
    // justifyContent: 'center',
    borderRadius: wp('2%'),
  },
  textbuttonAlamat: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('1.4%'),
  },
});
