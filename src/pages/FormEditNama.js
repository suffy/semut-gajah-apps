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
// import Background from '../assets/images/Background.png';
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
import IconBack from '../assets/icons/backArrow.svg';
import ModalAlert from '../components/ModalAlert';
import ModalDelete from '../components/ModalDelete';
import Snackbar from 'react-native-snackbar';
import Header from '../components/Header';
export class FormEditNama extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      name: '',
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
      await axios
        .post(
          `${CONFIG.BASE_URL}/api/profile/${this.props.dataUser.id}`,
          {
            name: this.state.name,
            email: this.props.dataUser.email,
            phone: this.props.dataUser.phone,
          },
          {
            headers: {
              Authorization: `Bearer ${this.props.token}`,
            },
          },
        )
        .then(response => {
          const data = response.data;
          console.log('DATA', data.data);
          if (data.data != null) {
            this.props.navigation.navigate('DataUser');
            this.props.loginAct(data.data, 'dataUser');
          } else {
            this.setState({
              alertData: 'Nama gagal diubah  ' + data.message,
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
          title={"Edit Nama"}
          navigation={this.props.navigation}
          />
        <View showsVerticalScrollIndicator={false} style={styles.scroll}>
          <View style={styles.posision}>
            <Text style={[styles.textStyle]}>{'Nama'}</Text>
            <TextInput
              autoCapitalize="none"
              placeholder=""
              style={styles.inputStyle}
              underlineColorAndroid="transparent"
              onChangeText={value =>
                this._isMounted && this.setState({name: value})
              }>
              {this.props.dataUser.name}
            </TextInput>
          </View>
          <View style={styles.posision}>
            <Text style={[styles.textStyle]}>
              {'Nama dapat dilihat oleh pengguna lainnya'}
            </Text>
          </View>

          <View style={styles.containerButton}>
            <View>
              <TouchableOpacity
                style={styles.buttonSimpan}
                onPress={() =>
                  this.setState({
                    alertDelete: 'Apakah yakin ingin mengganti nama anda?',
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
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
  dataUser: state.LoginReducer.dataUser,
});

const mapDispatchToProps = dispatch => {
  return {
    loginAct: (value, tipe) => {
      dispatch(LoginAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormEditNama);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: hp('8%'),
    backgroundColor: 'white',
    paddingHorizontal: wp('5%'),
    marginHorizontal: wp('-5%'),
    borderBottomWidth: 4,
    borderColor: '#ddd',
  },
  text: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('2.4%'),
    paddingLeft: wp('5%'),
  },
  scroll: {
    // flex: 1,
    paddingHorizontal: wp('5%'),
    backgroundColor: '#fff',
  },
  background: {
    flexGrow: 1,
    height: hp('100%'),
    alignItems: 'center',
    paddingVertical: hp('18%'),
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
});
