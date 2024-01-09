import {StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import {LoginAction} from '../redux/Action';
import { TextInput } from 'react-native-paper';
class FormFoto extends Component {
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
  }
  render() {
    const {getPilihKtp,getPilihNPWP,getFotoToko,getPilihKtpSelfie} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.posision}>
          <View style={styles.comboPassword}>
            <TouchableWithoutFeedback
              style={styles.containerInput}
              onPress={() => getPilihKtp()}>
              <Text style={this.props.ktp == "Pilih Foto KTP" ?[styles.inputStyle]:[styles.inputStyle,{color: '#000'}]}>{this.props.ktp}</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
        <View style={styles.posision2}>
          <View style={styles.comboPassword}>
            <TouchableWithoutFeedback
              style={styles.containerInput}
              onPress={() => getPilihNPWP()}>
              <Text style={this.props.npwp == "Pilih Foto NPWP (Tidak Wajib Diisi)" ?[styles.inputStyle]:[styles.inputStyle,{color: '#000'}]}>{this.props.npwp}</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
        <View style={styles.posision2}>
          <View style={styles.comboPassword}>
            <TouchableWithoutFeedback
              style={styles.containerInput}
              onPress={() => getFotoToko()}>
              <Text style={this.props.toko == "Pilih Foto Toko" ?[styles.inputStyle]:[styles.inputStyle,{color: '#000'}]}>{this.props.toko}</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
        <View style={styles.posision2}>
          <View style={styles.comboPassword}>
            <TouchableWithoutFeedback
              style={styles.containerInput}
              onPress={() => getPilihKtpSelfie()}>
              <Text style={this.props.selfie == "Pilih Foto Selfie" ?[styles.inputStyle]:[styles.inputStyle,{color: '#000'}]}>{this.props.selfie}</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    // flex:1,
    // backgroundColor:'red',
    paddingBottom: hp('3%'),
  },
  posision: {
    flexDirection: 'column',
    position: 'relative',
  },
  posision2: {
    paddingTop: hp('3.5%'),
    flexDirection: 'column',
    position: 'relative',
  },
  comboPassword: {
    flexDirection: 'row',
  },
  containerInput: {
    overflow: 'hidden',
    paddingBottom: hp('2%'),
    paddingHorizontal: wp('2%'),
  },
  inputStyle: {
    color: '#A4A4A4',
    fontFamily: 'Lato-Medium',
    fontSize: hp('1.6%'),
    width: wp('72%'),
    paddingVertical: hp('1.9%'),
    textAlign: 'left',
    borderColor: '#E8E8E8',
    borderWidth: 1,
    borderRadius: wp('4%'),
    // marginTop: hp('2%'),
    paddingHorizontal: wp('13%'),
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 10,
  },
  inputStyle2: {
    color: '#A4A4A4',
    fontFamily: 'Lato-Medium',
    fontSize: hp('1.6%'),
    width: wp('72%'),
    height: hp('5.5%'),
    textAlign: 'left',
    borderColor: '#E8E8E8',
    borderWidth: 1,
    borderRadius: wp('4%'),
    // marginTop: hp('2%'),
    paddingHorizontal: wp('13%'),
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 10,
  },
});

export default FormFoto;
