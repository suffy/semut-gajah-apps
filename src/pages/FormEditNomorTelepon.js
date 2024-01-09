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
import ModalDelete from '../components/ModalDelete';
import Header from '../components/Header';
export class FormEditNomorTelepon extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      phone: '',
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
    // rol()
    this._isMounted = false;
  }

  getCloseModalDelete = async e => {
    this.setState({modalDelete: !this.state.modalDelete});
    if (!e) {
      this.props.loginAct(this.state.phone, 'phone');
      this.props.navigation.replace('FormInputCodeOTPEditTelp');
    }
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
        <Header 
          title={"Edit Nomor Telepon"}
          navigation={this.props.navigation}
          />
        <View showsVerticalScrollIndicator={false} style={styles.scroll}>
          <View style={styles.posision}>
            <Text style={[styles.textStyle]}>{'Nomor Telepon'}</Text>
            <TextInput
              autoCapitalize="none"
              required="number"
              keyboardType="number-pad"
              placeholder="08112345678"
              placeholderTextColor="#A4A4A4"
              style={styles.inputStyle}
              underlineColorAndroid="transparent"
              onChangeText={value =>
                this._isMounted && this.setState({phone: value})
              }>
              {/* {this.props.dataUser.phone} */}
            </TextInput>
          </View>

          <View>
            <TouchableOpacity
              style={styles.buttonSimpan}
              onPress={() =>
                this.setState({
                  alertDelete:
                    'Apakah nomor tersebut sudah benar ? \n harap mengecek kembali nomor anda',
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FormEditNomorTelepon);

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
