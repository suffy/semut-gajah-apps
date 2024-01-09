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
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import {connect} from 'react-redux';
import axios from 'axios';
import Logo from '../assets/icons/IconLogo.svg';
import IconEye from '../assets/icons/Eye.svg';
import CONFIG from '../constants/config';
import messaging from '@react-native-firebase/messaging';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
import {LoginAction} from '../redux/Action';
import IconPhone from '../assets/icons/Phone.svg';
import IconSandi from '../assets/icons/Sandi.svg';
import IconReSandi from '../assets/icons/ReSandi.svg';
import IconUser from '../assets/icons/User.svg';
import IconToko from '../assets/icons/Toko.svg';
import IconEmail from '../assets/icons/Email.svg';
import IconAddress from '../assets/icons/Address.svg';
import {FormAlamat} from '../pages/FormAlamat';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import {ActivityIndicator} from 'react-native-paper';
import ModalAlert from '../components/ModalAlert';

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

export class RegisterUserLama extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    // this.dbRef = firestore().collection('users');
    this.state = {
      //   name: '',
      phone: '',
      email: '',
      password: '',
      password_confirmation: '',
      uniqueCode: '',
      address: '',
      other_address: '',
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
      provinsi: '',
      kota: '',
      kecamatan: '',
      kelurahan: '',
      kodepos: '',
      refreshing: false,
      loadingApi: false,
      alertData: '',
      modalAlert: false,
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
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!this.state.password.trim()) {
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
    } else if (!this.state.phone.trim()) {
      this.setState({
        alertData: 'Pastikan nomor telepon tidak ada yang kosong',
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
      this.setState({loadingApi: true});
      const formData = {
        customer_code: this.props.dataUser.customer_code,
        name: this.props.dataUser?.name,
        user_address: this.props.dataUser.user_address,
        // email: this.state.email,
        phone: this.state.phone,
        password: this.state.password,
        password_confirmation: this.state.password_confirmation,
        // address: this.state.address,
        // province: this.state.provinsi,
        // city: this.state.kota,
        // district: this.state.kecamatan,
        // subdistrict: this.state.kelurahan,
        // postal_code: this.state.kodepos,
        fcm_token: this.state.tokenFCM,
      };
      await this.props.loginAct(formData, 'dataUser');
      this.setState({loadingApi: false});
      this.props.navigation.navigate('FormInputCodeOTPOld');
    }
  };

  getCloseAlertModal() {
    this.setState({modalAlert: !this.state.modalAlert});
  }

  render() {
    const {refreshing, loadingApi} = this.state;
    const {dataUser} = this.props;
    console.log(dataUser);
    return (
      <SafeAreaView style={styles.scroll}>
        <ModalAlert
          modalAlert={this.state.modalAlert}
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

            {/* <Text style={[styles.textStyle]}>{'Nama'}</Text> */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: wp('65%'),
              }}>
              <IconUser
                // style={styles.icon}
                width={wp('6%')}
                height={hp('6%')}
              />
              <Text
                style={{
                  fontSize: hp('1.8%'),
                  fontFamily: 'Lato-Regular',
                  marginLeft: wp('2%'),
                  color: '#A4A4A4',
                }}>
                {dataUser?.name}
              </Text>
            </View>
            {dataUser?.user_address?.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: item.kelurahan ?  'flex-start' : 'flex-end',
                  justifyContent: 'flex-start',
                  width: wp('65%'),
                }}>
                <IconAddress width={wp('6%')} height={hp('6%')} />
                <Text
                  style={{
                    fontSize: hp('1.8%'),
                    fontFamily: 'Lato-Regular',
                    marginLeft: wp('2%'),
                    color: '#A4A4A4',
                  }}>
                  {item.address}
                  {'\n'}
                  {item.kelurahan ? item.kelurahan : null}
                  {item.kecamatan ? ',' + item.kecamatan : null}
                  {item.kota ? ',' + item.kota : null}
                  {item.kode_pos ? ',' + item.kode_pos : null}
                </Text>
              </View>
            ))}
            {/* <View style={styles.posision}>
              <View style={styles.containerInput}>
                <TextInput
                  autoCapitalize="none"
                  style={[styles.inputStyle]}
                  placeholderTextColor="#000000"
                  editable={false}
                  selectTextOnFocus={false}
                  value={dataUser.name}
                  // onChangeText={value => {
                  //   this._isMounted && this.setState({name: value});
                  // }}
                />
              </View>
              <IconUser
                style={styles.icon}
                width={wp('6%')}
                height={hp('6%')}
              />
            </View> */}
            {/* <Text style={[styles.textStyle]}>{'Nama Toko'}</Text> */}
            {/* <View style={styles.posision}>
              <View style={styles.containerInput}>
                <TextInput
                  autoCapitalize="none"
                  placeholder="Nama Toko"
                  placeholderTextColor="#A4A4A4"
                  style={styles.inputStyle}
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
            </View> */}
            {/* <Text style={[styles.textStyle]}>{'Nomor Telepon'}</Text> */}
            <View style={styles.posision}>
              <View style={styles.containerInput}>
                <TextInput
                  autoCapitalize="none"
                  placeholder="Nomor Telepon"
                  placeholderTextColor="#A4A4A4"
                  style={styles.inputStyle}
                  required="number"
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
            {/* <Text style={[styles.textStyle]}>{'Email'}</Text> */}
            {/* <View style={styles.posision}>
              <View style={styles.containerInput}>
                <TextInput
                  autoCapitalize="none"
                  placeholder="Email (Tidak Wajib Diisi)"
                  placeholderTextColor="#A4A4A4"
                  style={styles.inputStyle}
                  label="Email"
                  keyboardType="email-address"
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
            </View> */}
            {/* <Text style={[styles.textStyle]}>{'Kata Sandi'}</Text> */}
            <View style={styles.posision}>
              <View style={styles.comboPassword}>
                <View style={styles.containerInput}>
                  <TextInput
                    autoCapitalize="none"
                    placeholder="Kata Sandi"
                    placeholderTextColor="#A4A4A4"
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
            {/* <Text style={[styles.textStyle]}>{'Konfirmasi Kata Sandi'}</Text> */}
            <View style={styles.posision}>
              <View style={styles.comboPassword}>
                <View style={styles.containerInput}>
                  <TextInput
                    autoCapitalize="none"
                    placeholder="Konfirmasi Kata Sandi"
                    placeholderTextColor="#A4A4A4"
                    style={styles.inputStyle}
                    secureTextEntry={this.state.hidePass2 ? true : false}
                    onChangeText={value => {
                      this._isMounted &&
                        this.setState({password_confirmation: value}, () => {
                          if (
                            this.state.password !==
                            this.state.password_confirmation
                          ) {
                            this.setState({alert2: true});
                          } else {
                            this.setState({alert2: false});
                          }
                        });
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
            {/* <Text style={styles.textStyle}>{'Alamat'}</Text> */}
            {/* <View style={styles.posision}>
              <View style={styles.containerInput}>
                <TextInput
                  editable={false}
                  selectTextOnFocus={false}
                  value={dataUser.user_address[0].address}
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
                  }}
                />
              </View>
              <IconAddress
                style={styles.icon}
                width={wp('6%')}
                height={hp('6%')}
              />
            </View> */}
            {/* <FormAlamat
              navigation={this.props.navigation}
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
            /> */}
            {/* {this.state.shouldShow2 ? (
                  <TouchableOpacity
                    style={styles.buttonAlamat}
                    onPress={() =>
                      this.props.navigation.navigate('FormOtherAlamat')
                    }>
                    <Text style={styles.textbuttonAlamat}>
                      {this.props.province2}
                    </Text>
                    <Text style={styles.textbuttonAlamat}>
                      {this.props.city2}
                    </Text>
                    <Text style={styles.textbuttonAlamat}>
                      {this.props.district2}
                    </Text>
                    <Text style={styles.textbuttonAlamat}>
                      {this.props.subdistrict2}
                    </Text>
                    <Text style={styles.textbuttonAlamat}>
                      {this.props.postcode2}
                    </Text>
                  </TouchableOpacity>
                ) : null}
                {this.state.shouldShow ? (
                   <TextInput
            autoCapitalize = 'none'
                    style={[
                      styles.inputStyle,
                      {
                        height: hp(7),
                      },
                    ]}
                    onChangeText={value =>
                      this._isMounted && this.setState({other_address: value})
                    }
                  />
                ) : null} */}

            {this.state.shouldShow3 ? (
              <View style={styles.button}>
                {/* <View>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#E07126',
                        height: hp(4.5),
                        width: wp(35),
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: Size(10),
                      }}
                      onPress={() => {
                        this._isMounted &&
                          this.setState({
                            shouldShow: !this.state.shouldShow,
                            shouldShow2: !this.state.shouldShow,
                          });
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontFamily: 'Lato-Medium',
                          fontSize: hp(1.8),
                          color: '#FFFFFF',
                        }}>
                        {'Tambah Alamat'}
                      </Text>
                    </TouchableOpacity>
                  </View> */}
                <View>
                  <TouchableOpacity
                    style={styles.buttonOk}
                    onPress={() => this.handlerSubmit()}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: 'white',
                        fontFamily: 'Lato-Medium',
                        fontSize: hp('1.8%'),
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
                    placeholderTextColor="#A4A4A4"
                    keyboardType="numeric"
                    onChangeText={data =>
                      this._isMounted &&
                      this.setState({textInput_text_holder: data})
                    }
                    style={styles.textInputCap}
                    // underlineColorAndroid="transparent"
                  />

                  <TouchableOpacity onPress={this.generate_captcha}>
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
                  onPress={this.run_captcha_function}>
                  <Text style={styles.textCap}>{'Periksa Hasil Captcha'}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
        {loadingApi ? <LoadingApi /> : null}
      </SafeAreaView>
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
  code: state.LoginReducer.codeUser,
  nama: state.LoginReducer.nama,
  dataUser: state.LoginReducer.dataUser,
});

const mapDispatchToProps = dispatch => {
  return {
    loginAct: (value, tipe) => {
      dispatch(LoginAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterUserLama);

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    width: wp('100%'),
    height: hp('100%'),
    // height: hp('200%'),
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: hp('2%'),
    paddingBottom: hp('5%'),
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
    paddingTop: hp('3%'),
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
    marginTop: hp('2%'),
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
    backgroundColor: '#E07126',
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
    marginTop: hp('2%'),
    // marginTop: hp('0%'),
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
});
