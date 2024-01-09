{
  /*
  
  import ModalAlert from '../components/ModalAlert';
  
  tambahan: '',
  alertData: '',
  buttonAlert: '',
  buttonAlertCancel: '',
  modalAlert: false,
  
  getCloseAlertModal() {
   this.setState({modalAlert: !this.state.modalAlert});
  }
  
  <ModalAlert
    modalAlert={this.state.modalAlert}
    tambahan={this.state.tambahan}
    alert={this.state.alertData}
    buttonAlert={this.state.buttonAlert}
    buttonAlertCancel={this.state.buttonAlertCancel}
    getCloseAlertModal={e => this.getCloseAlertModal(e)}
  />
  
  this.setState({
    alert: ,
    modalAlert: !this.state.modalAlert,
  });

  await this.setState({
    tambahan: '',
    alertData: '',
    buttonAlert: 'Perbarui',
    buttonAlertCancel: 'Lewati',
    modalAlert: !this.state.modalAlert,
  });
  
  */
}
import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import NumberFormat from 'react-number-format';

class ModalAlert extends Component {
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
  }

  render() {
    const {
      modalAlert,
      alert,
      getCloseAlertModal,
      tambahan,
      buttonAlert,
      buttonAlertCancel,
      nominal,
    } = this.props;
    return (
      <Modal
        isVisible={modalAlert}
        deviceWidth={wp('100%')}
        // deviceHeight={wp('155%')}
        swipeDirection={['up', 'left', 'right', 'down']}
        // onBackdropPress={e => getCloseAlertModal(e)}
        // onSwipeComplete={() => getCloseAlertModal()}
        style={
          tambahan
            ? {
                flex: 1,
                justifyContent: 'flex-start',
                marginTop: hp('70%'),
                height: hp('30%'),
                marginHorizontal: wp('2%'),
                backgroundColor: '#fff',
                borderRadius: wp('1%'),
                paddingVertical: hp('2%'),
                paddingHorizontal: wp('2%'),
              }
            : {
                flex: 1,
                justifyContent: 'flex-start',
                marginTop: hp('78%'),
                height: hp('22%'),
                marginHorizontal: wp('2%'),
                backgroundColor: '#fff',
                borderRadius: wp('1%'),
                paddingVertical: hp('2%'),
                paddingHorizontal: wp('2%'),
              }
        }>
        <View style={styles.posisiJudul}>
          <Text style={styles.textJudul}>{'Pemberitahuan :'}</Text>
        </View>
        {tambahan ? (
          <View style={styles.posisiTambahan}>
            <Text style={styles.textTambahan}>{tambahan}</Text>
          </View>
        ) : null}
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{alignSelf: 'center', marginHorizontal: wp('2.5%')}}>
            <Text style={styles.text}>
              {alert}{' '}
              {nominal ? (
                <NumberFormat
                  value={Math.round(nominal)}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={'Rp '}
                  renderText={value => (
                    <Text style={styles.textHarga}>{value}</Text>
                  )}
                />
              ) : ""}
            </Text>
          </View>
          <View
            style={
              buttonAlertCancel
                ? {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '80%',
                  }
                : {
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '80%',
                  }
            }>
            {buttonAlertCancel ? (
              <TouchableOpacity
                style={styles.buttonCancel}
                onPress={e => getCloseAlertModal((e = 'cancel'))}>
                <Text style={[styles.text, {color: '#E07126'}]}>
                  {buttonAlertCancel}
                </Text>
              </TouchableOpacity>
            ) : null}
            {buttonAlert ? (
              <TouchableOpacity
                style={styles.button}
                onPress={() => getCloseAlertModal()}>
                <Text style={[styles.text, {color: '#fff'}]}>
                  {buttonAlert}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={() => getCloseAlertModal()}>
                <Text style={[styles.text, {color: '#fff'}]}>{'OK'}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  posisiJudul: {
    marginLeft: wp('3%'),
    marginBottom: hp('1%'),
  },
  textJudul: {
    fontSize: hp('2.2%'),
    fontFamily: 'Lato-Regular',
    color: '#000',
  },
  posisiTambahan: {
    marginLeft: wp('3%'),
    marginBottom: hp('1%'),
  },
  textTambahan: {
    fontSize: hp('2.2%'),
    fontFamily: 'Lato-Regular',
    color: '#529F45',
  },
  text: {
    fontSize: hp('1.8%'),
    fontFamily: 'Lato-Regular',
    textAlign: 'justify',
  },
  button: {
    backgroundColor: '#529F45',
    width: wp('40%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    marginVertical: wp('2%'),
    paddingVertical: wp('2%'),
  },
  buttonCancel: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E07126',
    width: wp('30%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    marginVertical: wp('2%'),
    paddingVertical: wp('2%'),
  },
});

export default ModalAlert;
