import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Pressable,
  Modal,
  PermissionsAndroid,
} from 'react-native';
import {connect} from 'react-redux';
import axios from 'axios';
import CONFIG from '../constants/config';
import IconEdit from '../assets/icons/edit.svg';
import {Avatar} from 'react-native-elements';
import {LoginAction} from '../redux/Action';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Storage from '@react-native-async-storage/async-storage';
import IconBack from '../assets/icons/backArrow.svg';
import ImagePicker from 'react-native-image-crop-picker';
import ModalAlert from '../components/ModalAlert';
import ModalDelete from '../components/ModalDelete';
import Snackbar from 'react-native-snackbar';
import Header from '../components/Header';
const createFormData = (photo, body) => {
  const data = new FormData();
  data.append('photo', {
    name: photo.fileName,
    type: photo.type,
    uri:
      Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', ''),
  });

  // Object.keys(body).forEach(key => {
  //     data.append(key, body[key]);
  // });

  return data;
};

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

export class DataUser extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      photo: [
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
      alertData: '',
      modalAlert: false,
      alertDelete: '',
      tambahanDelete: '',
      modalDelete: false,
    };
  }

  UNSAFE_componentWillMount = async () => {
    // lor(this);
    await this.getDataUser();
  };

  componentWillUnmount() {
    // rol();
  }

  getDataUser = async () => {
    try {
      let response = await axios.get(`${CONFIG.BASE_URL}/api/profile`, {
        headers: {Authorization: `Bearer ${this.props.token}`},
      });
      console.log('getDataUser');
      const data = response.data.data;
      // console.log('data nih', data);
      this.props.loginAct(data, 'dataUser');
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

  launchImageLibrary = () => {
    ImagePicker.openPicker({
      cropping: true,
      width: 300,
      height: 300,
      freeStyleCropEnabled: true,
      cropperCircleOverlay: true,
      mediaType: 'photo',
      // includeBase64: true,
      // includeExif: true,
      // multiple: false,
      // compressImageQuality: 0.8,
    })
      .then(async image => {
        console.log('DATA SESUDAH2 ===>', JSON.stringify(image));
        const formData = new FormData();
        formData.append('name', this.props.dataUser.name);
        formData.append('email', this.props.dataUser.email);
        formData.append('phone', this.props.dataUser.phone);
        formData.append('photo', {
          name: image?.path.split('/').pop(),
          type: image?.mime,
          uri:
            Platform.OS === 'android'
              ? image?.path
              : image?.path.replace('file://', ''),
        });
        console.log('formData', JSON.stringify(formData));
        await axios
          .post(
            `${CONFIG.BASE_URL}/api/profile/${this.props.dataUser.id}`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${this.props.token}`,
              },
            },
            {timeout: 1000},
          )
          .then(response => {
            const data = response.data.data;
            console.log('DATA', response.data);
            if (data != null) {
              this.getDataUser();
            } else {
              this.setState({
                alertData: 'Avatar gagal diubah  ' + data.message,
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
        // includeBase64: true,
        // includeExif: true,
        // multiple: false,
        // compressImageQuality: 0.8,
      })
        .then(async image => {
          console.log('DATA SESUDAH2 ===>', JSON.stringify(image));
          const formData = new FormData();
          formData.append('name', this.props.dataUser.name);
          formData.append('email', this.props.dataUser.email);
          formData.append('phone', this.props.dataUser.phone);
          formData.append('photo', {
            name: image?.path.split('/').pop(),
            type: image?.mime,
            uri:
              Platform.OS === 'android'
                ? image?.path
                : image?.path.replace('file://', ''),
          });
          console.log('data', JSON.stringify(formData));
          await axios
            .post(
              `${CONFIG.BASE_URL}/api/profile/${this.props.dataUser.id}`,
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${this.props.token}`,
                },
              },
              // {timeout: 1000},
            )
            .then(response => {
              const data = response.data.data;
              console.log('DATA', response.data);
              if (data != null) {
                this.getDataUser();
              } else {
                this.setState({
                  alertData: 'Avatar gagal diubah  ' + data.message,
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
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  showModal = () => {
    this.setState({
      modalVisible: true,
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

  getName = () => {
    let name = this.props?.dataUser?.name
      ?.match(/(\b\S)?/g)
      .join('')
      .toUpperCase();
    if (name) {
      return name;
    } else {
      return 'NA';
    }
  };

  getCloseAlertModal() {
    this.setState({modalAlert: !this.state.modalAlert});
  }

  getCloseModalDelete = async e => {
    this.setState({modalDelete: !this.state.modalDelete});
    if (!e) {
      this.props.navigation.replace('FormEditNomorTelepon');
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
    const {dataUser, navigation} = this.props;
    const {photo} = this.state;
    // console.log('nama====>', name);
    console.log('LINK PHOTO', photo[0].uri);
    return (
      <View style={styles.Scroll}>
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
        <Header 
        title={"Data User"}
        navigation={this.props.navigation}
        />
        {dataUser.photo != null ? (
          <View style={styles.containerAvatar}>
            <View style={styles.avatar}>
              <Image
                source={{uri: CONFIG.BASE_URL + this.props.dataUser.photo}}
                style={styles.image}
                rounded></Image>
              <Pressable
                style={styles.editAvatar}
                onPress={() => {
                  this.showModal();
                }}>
                <IconEdit width={hp('6%')} height={hp('6%')} />
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.containerAvatar}>
            <View style={styles.avatar}>
              <Avatar
                size={hp('20%')}
                width={hp('20%')}
                height={hp('20%')}
                containerStyle={{
                  backgroundColor: '#BDBDBD',
                }}
                // placeholderStyle={{backgroundColor: '#BDBDBD'}}
                rounded
                title={this.getName()}
                activeOpacity={0.7}
              />
              <Pressable
                style={styles.editAvatar}
                onPress={() => {
                  this.showModal();
                }}>
                <IconEdit width={hp('6%')} height={hp('6%')} />
              </Pressable>
            </View>
          </View>
        )}

        <View style={styles.containerIsi}>
          <Text style={styles.textJudul}>{'Nama'}</Text>
          <View style={styles.posisiRataKiriKanan}>
            <Text style={styles.textIsi}>{dataUser.name}</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('FormEditNama')}>
              <Text style={styles.textButton}>{'Ubah'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.viewBorder} />
          <Text style={styles.textJudul}>{'Email'}</Text>
          <View style={styles.posisiRataKiriKanan}>
            <Text style={styles.textIsi}>
              {dataUser.email ? dataUser.email : 'kosong'}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('FormEditEmail')}>
              <Text style={styles.textButton}>{'Ubah'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.viewBorder} />
          <Text style={styles.textJudul}>{'Nomor Telepon'}</Text>
          <View style={styles.posisiRataKiriKanan}>
            <Text style={styles.textIsi}>{dataUser.phone}</Text>
            <TouchableOpacity
              onPress={() =>
                this.setState({
                  alertDelete:
                    'apakah anda ingin merubah nomor telepon? \n harap diingat untuk login berikutnya',
                  modalDelete: !this.state.modalDelete,
                })
              }>
              <Text style={styles.textButton}>{'Ubah'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.viewBorder} />
        </View>
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
                style={[styles.button, styles.buttonToKeranjang]}
                onPress={() => this.launchCamera()}>
                <Text style={styles.textStyle}>{'Kamera'}</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonToKeranjang]}
                onPress={() => this.launchImageLibrary()}>
                <Text style={styles.textStyle}>{'Galeri'}</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  dataUser: state.LoginReducer.dataUser,
  token: state.LoginReducer.token,
});

const mapDispatchToProps = dispatch => {
  return {
    loginAct: (value, tipe) => {
      dispatch(LoginAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DataUser);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: hp('8%'),
    backgroundColor: 'white',
    marginHorizontal: wp('-5%'),
    paddingHorizontal: wp('5%'),
    borderBottomWidth: 4,
    borderColor: '#ddd',
  },
  text: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('2.4%'),
    paddingLeft: wp('5%'),
  },
  Scroll: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  containerIsi: {
    flex: 1,
    paddingHorizontal: wp('5%'),
    marginTop: hp('1%'),
  },
  image: {
    height: hp('20%'),
    width: hp('20%'),
    borderRadius: hp('20%'),
    resizeMode: 'cover',
    // resizeMode :'contain'
  },
  containerAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('5%'),
    // backgroundColor: 'red'
  },
  avatar: {
    position: 'relative',
    height: hp('20%'),
    width: hp('20%'),
    borderRadius: hp('20%'),
    backgroundColor: '#FED9CD',
    alignItems: 'center',
    justifyContent: 'center',
    // marginLeft: wp('5%'),
  },
  editAvatar: {
    position: 'absolute',
    // backgroundColor: 'white',
    bottom: wp('0%'),
    right: hp('0%'),
    // color: 'black',
    // borderRadius: wp('10%'0),
  },
  posisiRataKiriKanan: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewBorder: {
    borderColor: '#E8E8E8',
    borderWidth: 1,
    marginTop: hp('1%'),
  },
  textJudul: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('1.8%'),
    marginTop: hp('1.5%'),
  },
  textIsi: {
    fontFamily: 'Lato-Regular',
    fontSize: hp('1.6%'),
    marginTop: hp('0%'),
  },
  textButton: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('1.3%'),
    marginTop: hp('1%'),
    color: '#529F45',
  },

  // View Modal
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  buttonToKeranjang: {
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
  },
  buttonClose: {
    position: 'absolute',
    right: wp('-40%'),
    top: hp('-5%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // height: hp('8%'),
    backgroundColor: '#529F45',
    // width: wp('50%'),
    justifyContent: 'flex-start',
    borderRadius: hp('0.5%'),
    paddingHorizontal: wp('5%'),
  },
  textStyle: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Lato-Medium',
    fontSize: hp('1.8%'),
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'Lato-Medium',
    fontSize: hp('1.8%'),
    color: '#000000',
  },
});
