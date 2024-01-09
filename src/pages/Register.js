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
  Image,
  Alert,
  Pressable,
  Modal,
  RefreshControl,
  TouchableWithoutFeedback,
  PermissionsAndroid,
} from 'react-native';
import {connect} from 'react-redux';
import axios from 'axios';
import Logo from '../assets/icons/IconLogo.svg';
import IconEye from '../assets/icons/Eye.svg';
import CONFIG from '../constants/config';
import messaging from '@react-native-firebase/messaging';
import {LoginAction} from '../redux/Action';
import IconPhone from '../assets/newIcons/iconNomorTelepon.svg';
import IconSandi from '../assets/newIcons/iconPadLock.svg';
import IconReSandi from '../assets/newIcons/iconPadLock.svg';
import IconUser from '../assets/newIcons/iconPerson.svg';
import IconToko from '../assets/newIcons/iconToko.svg';
import IconEmail from '../assets/newIcons/iconEmail.svg';
import IconAddress from '../assets/newIcons/iconAlamat.svg';
import {FormAlamat} from '../pages/FormAlamat';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import {ActivityIndicator} from 'react-native-paper';
import ModalAlert from '../components/ModalAlert';
import FormFoto from '../components/FormFoto';
import ImagePicker from 'react-native-image-crop-picker';
import Storage from '@react-native-async-storage/async-storage';

function MiniOfflineSign() {
  return (
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>{'Tidak ada koneksi internet'}</Text>
    </View>
  );
}

function LoadingApi() {
  return (
    <View style={styles.loadingApi}>
      <ActivityIndicator animating size="large" color="#529F45" />
    </View>
  );
}

const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs camera permission',
        },
      );
      // If CAMERA Permission is granted
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else return true;
};

const requestExternalWritePermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'External Storage Write Permission',
          message: 'App needs write permission',
        },
      );
      // If WRITE_EXTERNAL_STORAGE Permission is granted
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      this.setState({
        alertData: 'Permission dibatalkan' + err,
        modalAlert: !this.state.modalAlert,
      });
    }
    return false;
  } else return true;
};
export class Register extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      name: '',
      phone: '',
      email: '',
      password: '',
      password_confirmation: '',
      address: '',
      other_address: '',
      linkShareLoc: '',
      shouldShow: false,
      shouldShow2: false,
      shouldShow3: false,
      hidePass: true,
      hidePass2: true,
      textInput_text_holder: 0,
      sum_holder: 0,
      random_number_1: 0,
      random_number_2: 0,
      tokenFCM: '',
      namaToko: '',
      _isPress: false,
      provinsi: '',
      kota: '',
      kecamatan: '',
      kelurahan: '',
      kodepos: '',
      refreshing: false,
      loadingApi: false,
      alertData: '',
      modalAlert: false,
      nextBtn: false,
      file: {
        ktp: 'Pilih Foto KTP',
        npwp: 'Pilih Foto NPWP (Tidak Wajib Diisi)',
        toko: 'Pilih Foto Toko',
        selfie: 'Pilih Foto Selfie',
      },
      photo_ktp: [
        {
          uri: '',
          fileName: '',
          fileSize: 0,
          height: 0,
          width: 0,
          type: '',
        },
      ],
      photo_npwp: [
        {
          uri: '',
          fileName: '',
          fileSize: 0,
          height: 0,
          width: 0,
          type: '',
        },
      ],
      photo_toko: [
        {
          uri: '',
          fileName: '',
          fileSize: 0,
          height: 0,
          width: 0,
          type: '',
        },
      ],
      selfie_ktp: [
        {
          uri: '',
          fileName: '',
          fileSize: 0,
          height: 0,
          width: 0,
          type: '',
        },
      ],
      modalVisible: false,
      param: '',
      tambahan: '',
    };
  }

  UNSAFE_componentWillMount() {
    // lor(this);
    this._isMounted = true;
    try {
      const {navigation} = this.props;
      // method navigation 'focus' terjadi ketika setelah berpindah dari halaman ini kemudian kembali lagi ke halaman ini
      navigation.addListener('focus', async () => {
        await this.getAllData();
      });
    } catch (error) {
      console.log(error);
    }
  }

  handleRefresh = () => {
    this.setState({
      refreshing: true,
    });
  };

  getAllData = () => {
    this.generate_captcha();
    this.getFcmToken();
  };

  componentWillUnmount() {
    // rol();
    this._isMounted = false;
  }
  getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log(fcmToken);
      console.log('Your Firebase Token Register is:', fcmToken);
      this.setState({tokenFCM: fcmToken});
    } else {
      console.log('Failed', 'No token received');
    }
  };

  generate_captcha = () => {
    var number_1 = Math.floor(Math.random() * 100) + 1;

    var number_2 = Math.floor(Math.random() * 100) + 1;

    var sum = number_1 + number_2;

    this._isMounted &&
      this.setState({random_number_1: number_1, random_number_2: number_2});

    this._isMounted && this.setState({sum_holder: sum});
  };

  run_captcha_function = () => {
    var temp = this.state.random_number_1 + this.state.random_number_2;

    if (this.state.textInput_text_holder == temp) {
      //Write Your Code Here Which you want to execute on RIGHT Captcha Entered.
      this._isMounted && this.setState({shouldShow3: true});
    } else {
      //Write Your Code Here Which you want to execute on WRONG Captcha Entered.
      this.setState({
        alertData: 'Captcha Tidak Cocok',
        modalAlert: !this.state.modalAlert,
      });
    }

    // Calling captcha function, So each time new captcha number generates on button clicks.
    this.generate_captcha();
  };

  handlerSubmit = async () => {
    const dataUser = {
      name: this.state.name,
      shop_name: this.state.namaToko,
      phone: this.state.phone,
      email: this.state.email,
    };
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    this.setState({loadingApi: true});
    const formData = new FormData();
    formData.append('name', this.state.name);
    formData.append('shop_name', this.state.namaToko);
    formData.append('phone', this.state.phone);
    formData.append('email', this.state.email);
    formData.append('password', this.state.password);
    formData.append('password_confirmation', this.state.password_confirmation);
    formData.append('shareloc', this.state.linkShareLoc);
    formData.append('address', this.state.address);
    formData.append('province', this.state.provinsi);
    formData.append('district', this.state.kecamatan);
    formData.append('city', this.state.kota);
    formData.append('subdistrict', this.state.kelurahan);
    formData.append('postal_code', this.state.kodepos);
    formData.append('fcm_token', this.state.tokenFCM);
    formData.append('latitude',this.props.route.params?.latitude),
    formData.append('longitude',this.props.route.params?.longitude),
    formData.append('photo_ktp', {
      name: this.state.photo_ktp?.path.split('/').pop(),
      type: this.state.photo_ktp?.mime,
      uri: this.state.photo_ktp?.path,
    });
    formData.append('selfie_ktp', {
      name: this.state.selfie_ktp?.path.split('/').pop(),
      type: this.state.selfie_ktp?.mime,
      uri: this.state.selfie_ktp?.path,
    });
    formData.append('photo_toko', {
      name: this.state.photo_toko?.path.split('/').pop(),
      type: this.state.photo_toko?.mime,
      uri: this.state.photo_toko?.path,
    });
    formData.append('photo_npwp', {
      name: this.state.photo_npwp?.path.split('/').pop(),
      type: this.state.photo_npwp?.mime,
      uri: this.state.photo_npwp?.path,
    });
    await axios
      .post(`${CONFIG.BASE_URL}/api/auth/register?status=1`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        const data = response.data;
        console.log('MASUK', JSON.stringify(data));
        if (data !== '' && data['success'] == true) {
          this.props.loginAct(dataUser, 'dataUser');
          this.setState({loadingApi: false});
          this.props.navigation.navigate('FormInputCodeOTP', {
            dataUser: formData,
          });
        } else {
          this.setState({loadingApi: false});
          if (data?.message == 'The phone has already been taken.') {
            this.setState({
              tambahan: 'VERIFIKASI GAGAL',
              alertData: 'Nomor telepon yang didaftarkan telah dipakai',
              modalAlert: !this.state.modalAlert,
            });
          } else if (data?.message == 'The email has already been taken.') {
            this.setState({
              tambahan: 'VERIFIKASI GAGAL',
              alertData: 'Akun anda sudah terdaftar',
              modalAlert: !this.state.modalAlert,
            });
          } else if (data?.message == 'Account has been registered') {
            this.setState({
              tambahan: 'VERIFIKASI GAGAL',
              alertData: 'Akun anda sudah terdaftar',
              modalAlert: !this.state.modalAlert,
            });
          } else if (data?.message == 'Mapping code undefined') {
            this.setState({
              tambahan: 'VERIFIKASI GAGAL',
              alertData: 'Wilayah anda belum masuk dalam area penjualan kami',
              modalAlert: !this.state.modalAlert,
            });
          }else {
            this.setState({
              tambahan: 'VERIFIKASI GAGAL',
              alertData: data?.message,
              modalAlert: !this.state.modalAlert,
            });
          }
        }
      })
      .catch(error => {
        this.setState({loadingApi: false});
        let error429 =
          JSON.parse(JSON.stringify(error)).message ===
          'Request failed with status code 429';
        let errorNetwork =
          JSON.parse(JSON.stringify(error)).message === 'Network Error';
        let error400 =
          JSON.parse(JSON.stringify(error)).message ===
          'Request failed with status code 400';
        console.log(
          'Cek Error===========DataSearching=============',
          JSON.parse(JSON.stringify(error)).message,
        );
        if (error429) {
          this.showSnackbarBusy();
        } else if (errorNetwork) {
          this.showSnackbarInet();
        }
      });
  };

  getCloseAlertModal() {
    this.setState({modalAlert: !this.state.modalAlert});
  }
  launchImageLibrary = () => {
    console.log('Param ' + this.state.param);
    ImagePicker.openPicker({
      cropping: true,
      width: 300,
      height: 300,
      freeStyleCropEnabled: true,
      cropperCircleOverlay: true,
      mediaType: 'photo',
    })
      .then(async image => {
        console.log('DATA SESUDAH2 ===>', JSON.stringify(image));
        if (this.state.param === 'photo_ktp') {
          this.setState({photo_ktp: image});
          this.setState(prevState => ({
            file: {
              ...prevState.file,
              ktp: image?.path.split('/').pop(),
            },
          }));
        } else if (this.state.param === 'photo_npwp') {
          this.setState({photo_npwp: image});
          this.setState(prevState => ({
            file: {
              ...prevState.file,
              npwp: image?.path.split('/').pop(),
            },
          }));
        } else if (this.state.param === 'photo_toko') {
          this.setState({photo_toko: image});
          this.setState(prevState => ({
            file: {
              ...prevState.file,
              toko: image?.path.split('/').pop(),
            },
          }));
        } else if (this.state.param === 'selfie_ktp') {
          this.setState({selfie_ktp: image});
          this.setState(prevState => ({
            file: {
              ...prevState.file,
              selfie: image?.path.split('/').pop(),
            },
          }));
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  launchCamera = async () => {
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      ImagePicker.openCamera({
        cropping: true,
        width: 300,
        height: 300,
        freeStyleCropEnabled: true,
        mediaType: 'photo',
        cropperCircleOverlay: true,
        useFrontCamera: true,
      })
        .then(async image => {
          console.log('DATA SESUDAH2 ===>', JSON.stringify(image));
          if (this.state.param === 'photo_ktp') {
            this.setState({photo_ktp: image});
            this.setState(prevState => ({
              file: {
                ...prevState.file,
                ktp: image?.path.split('/').pop(),
              },
            }));
          } else if (this.state.param === 'photo_npwp') {
            this.setState({photo_npwp: image});
            this.setState(prevState => ({
              file: {
                ...prevState.file,
                npwp: image?.path.split('/').pop(),
              },
            }));
          } else if (this.state.param === 'photo_toko') {
            this.setState({photo_toko: image});
            this.setState(prevState => ({
              file: {
                ...prevState.file,
                toko: image?.path.split('/').pop(),
              },
            }));
          } else if (this.state.param === 'selfie_ktp') {
            this.setState({selfie_ktp: image});
            this.setState(prevState => ({
              file: {
                ...prevState.file,
                selfie: image?.path.split('/').pop(),
              },
            }));
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };
  nextForm() {
    if (!this.state.name.trim()) {
      this.setState({
        alertData: 'Pastikan nama tidak ada yang kosong',
        modalAlert: !this.state.modalAlert,
      });
      return;
    } else if (!this.state.namaToko.trim()) {
      this.setState({
        alertData: 'Pastikan nama toko tidak ada yang kosong',
        modalAlert: !this.state.modalAlert,
      });
      return;
    } else if (!this.state.phone.trim()) {
      this.setState({
        alertData: 'Pastikan nomor telepon tidak ada yang kosong',
        modalAlert: !this.state.modalAlert,
      });
      return;
    } else if (!this.state.password.trim()) {
      this.setState({
        alertData: 'Pastikan password tidak ada yang kosong',
        modalAlert: !this.state.modalAlert,
      });
      return;
    } else if (!this.state.password_confirmation.trim()) {
      this.setState({
        alertData: 'Pastikan password confirm tidak ada yang kosong',
        modalAlert: !this.state.modalAlert,
      });
      return;
    } else if (!this.state.linkShareLoc) {
      this.setState({
        alertData: 'Pastikan Link Lokasi tidak kosong',
        modalAlert: !this.state.modalAlert,
      });
    } else if (!this.state.address.trim()) {
      this.setState({
        alertData: 'Pastikan alamat tidak ada yang kosong',
        modalAlert: !this.state.modalAlert,
      });
      return;
    } else if (this.state.address.trim().length < 10) {
      this.setState({
        alertData: 'Alamat harap diisi dengan lengkap',
        modalAlert: !this.state.modalAlert,
      });
      return;
    } else if (this.state.kodepos == null || this.state.kodepos == '') {
      this.setState({
        alertData: 'Pastikan diisi kodeposnya',
        modalAlert: !this.state.modalAlert,
      });
      return;
    } else if (this.state.alert == true) {
      this.setState({
        alertData: 'Pastikan password diisi dengan benar',
        modalAlert: !this.state.modalAlert,
      });
      return;
    } else if (this.state.alert2 == true) {
      this.setState({
        alertData: 'Pastikan password diisi dengan benar',
        modalAlert: !this.state.modalAlert,
      });
      return;
    } else {
      this._isMounted = true;
      this._isMounted && this.setState({nextBtn: !this.state.nextBtn});
      console.log('Nilai next ' + this.state.nextBtn);
    }
  }
  showModal = param => {
    this.setState({
      modalVisible: true,
      param: param,
    });
    const setWaktu = setTimeout(() => {
      this.setState({
        modalVisible: false,
      });
    }, 5000);
    return () => {
      clearTimeout(setWaktu);
    };
  };
  render() {
    console.log("long "+this.props.route.params?.longitude+" lat "+this.props.route.params?.latitude);
    const {refreshing, linkShareLoc, loadingApi, nextBtn} = this.state;
    return (
      <View style={styles.container}>
        <ModalAlert
          modalAlert={this.state.modalAlert}
          tambahan={this.state.tambahan}
          alert={this.state.alertData}
          getCloseAlertModal={() => this.getCloseAlertModal()}
        />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.handleRefresh}
              colors={['#529F45', '#FFFFFF']}
            />
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={styles.scroll}>
          <View style={styles.container}>
            <Logo width={wp('30%')} height={hp('16%')} style={styles.image} />
            <Text style={styles.textlogo}>{'Daftar'}</Text>
            {nextBtn === false ? (
              <View style={{alignItems: 'center'}}>
                <View style={styles.posision}>
                  <View style={styles.containerInput}>
                    <TextInput
                      autoCapitalize="none"
                      placeholder="Nama"
                      value={this.state.name}
                      placeholderTextColor="#C1B5B2"
                      style={styles.inputStyle}
                      onChangeText={value => {
                        this._isMounted && this.setState({name: value});
                      }}
                    />
                  </View>
                  <IconUser
                    style={styles.icon}
                    width={wp('6%')}
                    height={hp('6%')}
                  />
                </View>
                <View style={styles.posision}>
                  <View style={styles.containerInput}>
                    <TextInput
                      autoCapitalize="none"
                      placeholder="Nama Toko"
                      placeholderTextColor="#C1B5B2"
                      style={styles.inputStyle}
                      value={this.state.namaToko}
                      onChangeText={value => {
                        this._isMounted && this.setState({namaToko: value});
                      }}
                    />
                  </View>
                  <IconToko
                    style={styles.icon}
                    width={wp('6%')}
                    height={hp('6%')}
                  />
                </View>
                <View style={styles.posision}>
                  <View style={styles.containerInput}>
                    <TextInput
                      autoCapitalize="none"
                      placeholder="Nomor Telepon"
                      placeholderTextColor="#C1B5B2"
                      style={styles.inputStyle}
                      required="number"
                      value={this.state.phone}
                      keyboardType="number-pad"
                      onChangeText={value => {
                        this._isMounted && this.setState({phone: value});
                      }}
                    />
                  </View>
                  <IconPhone
                    style={styles.icon}
                    width={wp('6%')}
                    height={hp('6%')}
                  />
                </View>
                <View style={styles.posision}>
                  <View style={styles.containerInput}>
                    <TextInput
                      autoCapitalize="none"
                      placeholder="Email (Tidak Wajib Diisi)"
                      placeholderTextColor="#C1B5B2"
                      style={styles.inputStyle}
                      value={this.state.email}
                      keyboardType="email-address"
                      label="Email"
                      onChangeText={value => {
                        this._isMounted && this.setState({email: value});
                      }}
                    />
                  </View>
                  <IconEmail
                    style={styles.icon}
                    width={wp('6%')}
                    height={hp('6%')}
                  />
                </View>
                <View style={styles.posision}>
                  <View style={styles.comboPassword}>
                    <View style={styles.containerInput}>
                      <TextInput
                        autoCapitalize="none"
                        placeholder="Kata Sandi"
                        placeholderTextColor="#C1B5B2"
                        value={this.state.password}
                        style={styles.inputStyle}
                        secureTextEntry={this.state.hidePass ? true : false}
                        onChangeText={value => {
                          this._isMounted &&
                            this.setState({password: value}, () => {
                              if (this.state.password.length < 7) {
                                this.setState({alert: true});
                              } else {
                                this.setState({alert: false});
                              }
                            });
                        }}
                      />
                    </View>
                    <IconSandi
                      style={styles.icon}
                      width={wp('6%')}
                      height={hp('6%')}
                    />
                    <IconEye
                      style={styles.eye}
                      width={wp('5%')}
                      height={hp('3%')}
                      onPress={() => {
                        if (this.state.hidePass == true) {
                          this._isMounted && this.setState({hidePass: false});
                        } else {
                          this._isMounted && this.setState({hidePass: true});
                        }
                      }}
                    />
                  </View>
                  {this.state.alert && (
                    <Text style={styles.textWarning}>
                      Password Harus 8 Character
                    </Text>
                  )}
                </View>
                <View style={styles.posision}>
                  <View style={styles.comboPassword}>
                    <View style={styles.containerInput}>
                      <TextInput
                        autoCapitalize="none"
                        placeholder="Konfirmasi Kata Sandi"
                        placeholderTextColor="#C1B5B2"
                        style={styles.inputStyle}
                        value={this.state.password_confirmation}
                        secureTextEntry={this.state.hidePass2 ? true : false}
                        onChangeText={value => {
                          this._isMounted &&
                            this.setState(
                              {password_confirmation: value},
                              () => {
                                if (
                                  this.state.password !==
                                  this.state.password_confirmation
                                ) {
                                  this.setState({alert2: true});
                                } else {
                                  this.setState({alert2: false});
                                }
                              },
                            );
                        }}
                      />
                    </View>
                    <IconReSandi
                      style={styles.icon}
                      width={wp('6%')}
                      height={hp('6%')}
                    />
                    <IconEye
                      style={styles.eye}
                      width={wp('5%')}
                      height={hp('3%')}
                      onPress={() => {
                        if (this.state.hidePass2 === true) {
                          this._isMounted && this.setState({hidePass2: false});
                        } else {
                          this._isMounted && this.setState({hidePass2: true});
                        }
                      }}
                    />
                  </View>
                  {this.state.alert2 && (
                    <Text style={styles.textWarning}>Password Tidak Sama</Text>
                  )}
                </View>
                <View style={styles.posision}>
                  <View style={styles.containerInput}>
                    <TextInput
                      autoCapitalize="none"
                      placeholder="Link Lokasi Toko"
                      placeholderTextColor="#C1B5B2"
                      style={styles.inputStyle}
                      value={this.state.linkShareLoc}
                      onChangeText={value => {
                        this._isMounted && this.setState({linkShareLoc: value});
                      }}
                    />
                  </View>
                  <IconToko
                    style={styles.icon}
                    width={wp('6%')}
                    height={hp('6%')}
                  />
                </View>
                <View style={styles.posision}>
                  <View style={styles.containerInput}>
                    <TextInput
                      autoCapitalize="none"
                      placeholder="Alamat Detail"
                      placeholderTextColor="#C1B5B2"
                      value={this.state.address}
                      style={[
                        styles.inputStyle,
                        {height: hp(15), textAlignVertical: 'top'},
                      ]}
                      multiline
                      onChangeText={value => {
                        this._isMounted && this.setState({address: value});
                      }}
                    />
                  </View>
                  <IconAddress
                    style={styles.icon}
                    width={wp('6%')}
                    height={hp('6%')}
                  />
                </View>
                <FormAlamat
                  navigation={this.props.navigation}
                  provinsi={data =>
                    // console.log("data "+ data),
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
                  textProvince={
                    this.state.provinsi != '' ? this.state.provinsi : null
                  }
                  textCity={this.state.kota != '' ? this.state.kota : null}
                  textPoscode={
                    this.state.kodepos != '' ? this.state.kodepos : null
                  }
                  textKecamatan={
                    this.state.kecamatan != '' ? this.state.kecamatan : null
                  }
                  textKelurahan={
                    this.state.kelurahan != '' ? this.state.kelurahan : null
                  }
                />
                <TouchableWithoutFeedback onPress={() => this.nextForm()}>
                  <View style={styles.viewNextBtn}>
                    <Text style={styles.textNextBtn}>Next</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            ) : (
              <View style={{alignItems: 'center'}}>
                <FormFoto
                  getPilihKtp={() => this.showModal('photo_ktp')}
                  ktp={this.state.file.ktp}
                  getPilihNPWP={() => this.showModal('photo_npwp')}
                  npwp={this.state.file.npwp}
                  getFotoToko={() => this.showModal('photo_toko')}
                  toko={this.state.file.toko}
                  getPilihKtpSelfie={() => this.showModal('selfie_ktp')}
                  selfie={this.state.file.selfie}
                />
                {this.state.shouldShow3 ? (
                  <View style={styles.button}>
                    <View>
                      <TouchableOpacity
                        style={styles.buttonOk}
                        onPress={() => this.handlerSubmit()}>
                        <Text
                          style={{
                            textAlign: 'center',
                            color: 'white',
                            fontFamily: 'Lato-Medium',
                            fontSize: hp('2%'),
                          }}>
                          {'OK'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={styles.MainContainer}>
                    <View style={styles.captcha_view}>
                      <Text
                        style={{
                          fontSize: hp('2%'),
                          fontFamily: 'Lato-Medium',
                          textAlign: 'center',
                          color: '#000',
                        }}>
                        {this.state.random_number_1} {'+'}{' '}
                        {this.state.random_number_2} {'= '}
                      </Text>

                      <TextInput
                        autoCapitalize="none"
                        placeholder="Hasil"
                        placeholderTextColor="#C1B5B2"
                        keyboardType="numeric"
                        onChangeText={data =>
                          this._isMounted &&
                          this.setState({textInput_text_holder: data})
                        }
                        style={styles.textInputCap}
                        // underlineColorAndroid="transparent"
                      />

                      <TouchableOpacity onPress={() => this.generate_captcha()}>
                        <Image
                          source={{
                            uri: 'https://reactnativecode.com/wp-content/uploads/2019/08/reload_image.jpg',
                          }}
                          style={{
                            width: wp('8%'),
                            height: hp('8%'),
                            resizeMode: 'contain',
                            margin: 5,
                          }}
                        />
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={styles.buttonCap}
                      onPress={() => this.run_captcha_function()}>
                      <Text style={styles.textCap}>
                        {'Periksa Hasil Captcha'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                <TouchableWithoutFeedback onPress={() => this.nextForm()}>
                  <View style={[styles.viewNextBtn, {marginTop: hp('2%')}]}>
                    <Text style={styles.textNextBtn}>Back</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            )}
            <Modal
              animationType="fade"
              transparent={true}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                this.setState({modalVisible: !this.state.modalVisible});
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>{'Pilih metode'}</Text>
                  <Pressable
                    style={[styles.button, styles.buttonModal]}
                    onPress={() => this.launchCamera()}>
                    <Text style={styles.textStyle2}>{'Kamera'}</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.buttonModal]}
                    onPress={() => this.launchImageLibrary()}>
                    <Text style={styles.textStyle2}>{'Galeri'}</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </View>
        </ScrollView>
        {loadingApi ? <LoadingApi /> : null}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  province: state.LoginReducer.province,
  city: state.LoginReducer.city,
  district: state.LoginReducer.district,
  subdistrict: state.LoginReducer.subdistrict,
  postcode: state.LoginReducer.postcode,
  province2: state.LoginReducer.other_province,
  city2: state.LoginReducer.other_city,
  district2: state.LoginReducer.other_district,
  subdistrict2: state.LoginReducer.other_subdistrict,
  postcode2: state.LoginReducer.other_postcode,
  dataUser: state.LoginReducer.dataUser,
});

const mapDispatchToProps = dispatch => {
  return {
    loginAct: (value, tipe) => {
      dispatch(LoginAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewNextBtn: {
    backgroundColor: '#51AF3E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('2%'),
    width: wp('70%'),
    paddingVertical: hp('1%'),
    borderRadius: 15,
  },
  textNextBtn: {
    color: '#FFF',
    fontFamily: 'Lato-Medium',
    fontSize: hp('2%'),
  },
  textlogo: {
    color: '#529F45',
    fontFamily: 'Lato-Medium',
    fontSize: hp('3%'),
    marginTop: hp('1.5%'),
    marginBottom: hp('4%'),
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
    backgroundColor: '#F1F1F1',
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
    paddingTop: hp('3%'),
  },
  textStyle2: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Lato-Medium',
    fontSize: hp('1.8%'),
  },
  button: {
    flexDirection: 'row',
  },
  textWarning: {
    color: 'red',
    fontSize: hp('1.2%'),
    fontFamily: 'Lato-Medium',
    marginTop: hp('-1.5%'),
    marginBottom: hp('-0.4%'),
    marginLeft: wp('5%'),
  },
  comboPassword: {
    flexDirection: 'row',
  },
  buttonAlamat: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    height: hp('13%'),
    width: wp('60%'),
    // alignItems: 'flex-start',
    // marginBottom: hp(2),
    justifyContent: 'space-between',
    // paddingVertical: hp(0),
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
    fontSize: hp('1.8%'),
  },
  buttonPick: {
    position: 'absolute',
    top: hp('2%'),
    right: wp('3%'),
  },

  MainContainer: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('0%'),
  },

  captcha_view: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: hp('-10%'),
    borderColor: '#E8E8E8',
    width: wp('70%'),
    height: hp('10%'),
    borderWidth: 1,
    borderRadius: 30,
    padding: 5,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 10,
  },
  textInputCap: {
    textAlign: 'left',
    height: hp('6%'),
    width: wp('25%'),
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 15,
    fontSize: hp('2%'),
    fontFamily: 'Lato-Medium',
    color: '#000000',
    paddingHorizontal: wp('5%'),
  },
  buttonCap: {
    width: wp('70%'),
    height: hp('5.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#529F45',
    borderRadius: wp('3%'),
    marginTop: hp('4%'),
  },
  textCap: {
    color: '#fff',
    fontSize: hp('1.8%'),
    fontFamily: 'Lato-Medium',
    textAlign: 'center',
    // padding: 5,
  },
  buttonOk: {
    backgroundColor: '#529F45',
    height: hp('5.5%'),
    width: wp('70%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp('1%'),
    marginTop: hp('0%'),
  },
  offlineContainer: {
    // flex: 1,
    // backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    // flexDirection: 'column',
    width: wp('100%'),
    height: hp('5%'),
    flexDirection: 'row',
    // marginTop: hp('5%'),
  },
  offlineText: {
    color: '#4A8F3C',
    fontFamily: 'Lato-Medium',
    // fontSize: hp('3%'),
    // marginBottom: hp(-30),
    textAlign: 'center',
    fontSize: hp('2%'),
  },
  loadingApi: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.2)',
    justifyContent: 'center',
    alignSelf: 'center',
    width: wp('100%'),
    height: hp('100%'),
    position: 'absolute',
    // top:hp('-50%')
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.9)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonModal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('8%'),
    backgroundColor: '#529F45',
    width: wp('40%'),
    justifyContent: 'center',
    borderRadius: hp('1.5%'),
    // paddingLeft: wp('5%'),
    marginBottom: hp('2%'),
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
});
