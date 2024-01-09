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
import Logo from '../assets/icons/Logo.svg';
// // import Background from '../assets/images/Background.png';
import CONFIG from '../constants/config';
import Size from '../components/Fontresponsive';
import {LoginAction} from '../redux/Action';
import {connect} from 'react-redux';
import IconAddress from '../assets/icons/Address.svg';
import IconDropdown from '../assets/icons/Dropdown.svg';
import {FormAlamatEdit} from '../pages/FormAlamatEdit';
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

export class FormEditAlamat extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      address: '',
      _isPress: false,
      provinsi: props.alamat.provinsi,
      kota: props.alamat.kota,
      kecamatan: props.alamat.kecamatan,
      kelurahan: props.alamat.kelurahan,
      kodepos: props.alamat.kode_pos,
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

  componentWillUnmount() {
    // rol();
    this._isMounted = false;
  }

  getCloseAlertModal() {
    this.setState({modalAlert: !this.state.modalAlert});
  }

  getCloseModalDelete = async e => {
    this.setState({modalDelete: !this.state.modalDelete});
    if (!e) {
      if (!this.state.kodepos) {
        this.setState({
          alertData: 'Pastikan diisi kodeposnya',
          modalAlert: !this.state.modalAlert,
        });
        return;
      } else if (!this.state.address.trim()) {
        this.setState({address: this.props.alamat.address});
        console.log('MASUK', this.props.alamat);
        await axios
          .post(
            `${CONFIG.BASE_URL}/api/address/${this.props.alamat.id}`,
            {
              address: this.state.address,
              province: this.state.provinsi,
              city: this.state.kota,
              district: this.state.kecamatan,
              subdistrict: this.state.kelurahan,
              postcode: this.state.kodepos,
            },
            {
              headers: {
                Authorization: `Bearer ${this.props.token}`,
              },
            },
            {timeout: 1000},
          )
          .then(response => {
            const data = response.data;
            console.log('DATA', data.data);
            if (data.data != null) {
              this.props.loginAct(data.data, 'dataUser');
              this.props.navigation.replace('DataAlamat');
            } else {
              this.setState({
                alertData: 'Alamat gagal diubah  ' + data.message,
                modalAlert: !this.state.modalAlert,
              });
            }
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
            } else if (error400) {
              Storage.removeItem('token');
              this.props.navigation.navigate('Home');
            }
          });
      } else {
        await axios
          .post(
            `${CONFIG.BASE_URL}/api/address/${this.props.alamat.id}`,
            {
              address: this.state.address,
              province: this.state.provinsi,
              city: this.state.kota,
              district: this.state.kecamatan,
              subdistrict: this.state.kelurahan,
              postcode: this.state.kodepos,
            },
            {
              headers: {
                Authorization: `Bearer ${this.props.token}`,
              },
            },
            {timeout: 1000},
          )
          .then(response => {
            const data = response.data;
            console.log('DATA', data.data);
            if (data.data != null) {
              this.props.loginAct(data.data, 'dataUser');
              this.props.navigation.replace('DataAlamat');
            } else {
              this.setState({
                alertData: 'Alamat gagal diubah  ' + data.message,
                modalAlert: !this.state.modalAlert,
              });
            }
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
            } else if (error400) {
              Storage.removeItem('token');
              this.props.navigation.navigate('Home');
            }
          });
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
    const {alamat} = this.props;
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container2}>
        <ModalAlert
          modalAlert={this.state.modalAlert}
          alert={this.state.alertData}
          getCloseAlertModal={() => this.getCloseAlertModal()}
        />
        <ModalDelete
          modalDelete={this.state.modalDelete}
          tambahanDelete={this.state.tambahanDelete}
          alertDelete={this.state.alertDelete}
          getCloseModalDelete={e => this.getCloseModalDelete(e)}
        />
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
          <View style={styles.container}>
            {/* <Logo
                width={wp('3%'5)}
                height={hp('1%'6)}
                style={styles.image}
              /> */}
            <Text style={styles.textlogo}>{'Edit Alamat'}</Text>

            <View style={styles.posision}>
              <View style={styles.containerInput}>
                <TextInput
                  autoCapitalize="none"
                  placeholder="Alamat Detail"
                  placeholderTextColor="#A4A4A4"
                  style={[
                    styles.inputStyle,
                    {height: hp('15%'), textAlignVertical: 'top'},
                  ]}
                  multiline
                  onChangeText={value => {
                    this._isMounted && this.setState({address: value});
                  }}>
                  {alamat.address}
                </TextInput>
              </View>
              {/* {this.state._isPress == true ? (
                <TouchableOpacity
                  style={styles.buttonAlamat}
                  onPress={() => this.props.navigation.navigate('FormAlamat')}>
                  <View style={{flexDirection: 'column'}}>
                    <Text style={styles.textbuttonAlamat}>
                      {'Pilih Provinsi'}
                    </Text>
                    <Text style={styles.textbuttonAlamat}>
                      {this.props.province}
                    </Text>
                    <Text style={styles.textbuttonAlamat}>
                      {this.props.district}
                    </Text>
                    <Text style={styles.textbuttonAlamat}>
                      {this.props.subdistrict}
                    </Text>
                    <Text style={styles.textbuttonAlamat}>
                      {this.props.postcode}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : null} 
              <TouchableOpacity
                style={styles.buttonPick}
                onPress={() => {
                  if (this.state._isPress === true) {
                    this.setState({_isPress: false});
                  } else {
                    this.setState({_isPress: true});
                  }
                }}>
                <IconDropdown
                  width={wp('6%')}
                  height={hp('6%')}
                />
              </TouchableOpacity> */}
              <IconAddress
                style={styles.icon}
                width={wp('6%')}
                height={hp('6%')}
              />
            </View>

            <FormAlamatEdit
              navigation={this.props.navigation}
              alamat={alamat}
              provinsi={data =>
                this._isMounted && this.setState({provinsi: data})
              }
              kota={data => this._isMounted && this.setState({kota: data})}
              kecamatan={data =>
                this._isMounted && this.setState({kecamatan: data})
              }
              kelurahan={data =>
                this._isMounted && this.setState({kelurahan: data})
              }
              kodepos={value =>
                this._isMounted && this.setState({kodepos: value})
              }
            />

            <View>
              <TouchableOpacity
                style={styles.buttonSimpan}
                onPress={() =>
                  this.setState({
                    alertDelete: 'Apakah yakin ingin mengganti alamat anda?',
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

export default connect(mapStateToProps, mapDispatchToProps)(FormEditAlamat);

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
    alignItems: 'center',
    padding: wp('4%'),
  },
  container2: {
    flex: 1,
  },
  textlogo: {
    // color: '#529F45',
    color: '#000',
    fontFamily: 'Lato-Medium',
    alignSelf: 'flex-start',
    fontSize: hp('2.4%'),
    marginBottom: hp('2%'),
  },
  posision: {
    flexDirection: 'column',
    position: 'relative',
  },
  containerInput: {
    overflow: 'hidden',
    paddingBottom: hp('2%'),
    paddingHorizontal: wp('2%'),
  },
  inputStyle: {
    color: 'black',
    fontFamily: 'Lato-Medium',
    fontSize: hp('1.6%'),
    width: wp('70%'),
    height: hp('5.5%'),
    textAlign: 'left',
    borderColor: '#E8E8E8',
    borderWidth: 1,
    borderRadius: wp('4%'),
    marginTop: hp('2%'),
    paddingHorizontal: wp('13%'),
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 10,
  },
  icon: {
    position: 'absolute',
    top: hp('1.8%'),
    right: wp('62%'),
  },
  eye: {
    position: 'absolute',
    top: hp('3.5%'),
    right: wp('6%'),
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
    height: hp('5.5%'),
    width: wp('55%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp('1%'),
    marginTop: hp('2%'),
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
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    height: hp('13%'),
    width: wp('60%'),
    // alignItems: 'flex-start',
    // marginBottom: hp('2%'),
    justifyContent: 'space-between',
    // paddingVertical: hp('0%'),
    paddingHorizontal: wp('4%'),
    borderRadius: hp('2%'),
    borderWidth: 2,
    borderColor: '#E8E8E8',
    position: 'absolute',
    top: hp('7%'),
    right: wp('0%'),
  },
  textbuttonAlamat: {
    fontFamily: 'Lato-Regular',
    fontSize: hp('1.6%'),
  },
  buttonPick: {
    position: 'absolute',
    top: hp('2%'),
    right: wp('3%'),
  },
});
