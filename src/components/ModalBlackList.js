import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {Component} from 'react';
import Modal from 'react-native-modal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';

class ModalBlackList extends Component {
  render() {
    const {
      modalVisible,
      alert,
      getCloseAlertModal,
      tambahan,
      buttonAlert,
      buttonAlertCancel,
    } = this.props;
    return (
      <Modal
        isVisible={modalVisible}
        deviceWidth={wp('100%')}
        swipeDirection={['up', 'left', 'right', 'down']}>
        <View style={styles.cardModal}>
          <View style={styles.posisiJudul}>
            <Text style={styles.textJudul}>{'Pemberitahuan :'}</Text>
          </View>
          <View>
            <Text style={styles.textContent}>
              Akun anda masuk kedalam daftar blacklist
            </Text>
            <View style={styles.btnModal}>
              <TouchableOpacity
              onPress={() => getCloseAlertModal()}
              >
                <Text style={[styles.textContent, {color: '#FFF'}]}>Tutup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  cardModal: {
    justifyContent: 'flex-start',
    minHeight: hp('20%'),
    marginHorizontal: wp('2%'),
    backgroundColor: '#fff',
    borderRadius: wp('1%'),
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('5%'),
  },
  posisiJudul: {
    marginLeft: wp('3%'),
    marginBottom: hp('1%'),
  },
  textJudul: {
    fontSize: hp('2.2%'),
    fontFamily: 'Lato-Regular',
    color: '#000',
  },
  textContent: {
    alignSelf: 'center',
    maxWidth: '70%',
    textAlign: 'center',
    fontSize: hp('2.2%'),
    fontFamily: 'Lato-Regular',
    color: '#000',
  },
  btnModal: {
    alignSelf: 'center',
    marginTop: hp('2%'),
    minWidth: '25%',
    padding: '1%',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#E07126',
    backgroundColor: '#E07126',
  },
});

export default ModalBlackList;
