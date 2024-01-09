import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import React, {Component} from 'react';
import Modal from 'react-native-modal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import {Image} from 'react-native';
import DummyImage from '../assets/icons/IconLogo.svg';
import OrderTracking from '../assets/icons/OrderTracking.svg';

class ModalTracking extends Component {
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
  }
  render() {
    const {
      getCloseTrackingModal,
      modalTracking,
      titleModal,
      btnClose,
      dataTracking,
    } = this.props;
    return (
      <Modal
        style={styles.viewModal}
        isVisible={modalTracking}
        deviceWidth={wp('100%')}
        // swipeDirection={['up', 'left', 'right', 'down']}
      >
        <View style={{marginTop: hp('2.5%')}}>
          <OrderTracking width={hp('10%')} height={hp('10%')} />
        </View>
        <View style={styles.posisiJudul}>
          <Text style={styles.textJudul}>{titleModal}</Text>
        </View>
        <View style={styles.viewTracking}>
          <Text style={styles.textTracking}>{dataTracking}</Text>
        </View>
        {btnClose ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              width: '80%',
            }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => getCloseTrackingModal()}>
              <Text style={styles.text}>{'Tutup'}</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  viewModal: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: hp('30%'),
    marginBottom: hp('22%'),
    // height: hp('30%'),
    marginHorizontal: wp('5%'),
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('2%'),
  },
  posisiJudul: {
    // marginLeft: wp('3%'),
    // marginBottom: hp('1%'),
    alignItems: 'center',
    marginTop: '5%',
  },
  textJudul: {
    fontSize: hp('2.5%'),
    fontFamily: 'Lato-Regular',
    color: '#000',
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#E07126',
    paddingVertical: '2.5%',
    width:wp('80%'),
    borderRadius: 15,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: hp('1.8%'),
    fontFamily: 'Lato-Regular',
    textAlign: 'justify',
  },
  viewTracking: {
    marginTop: '5%',
    height: '35%',
    paddingHorizontal: '12%',
    // backgroundColor:'red'
  },
  textTracking: {
    fontSize: hp('2.2%'),
    fontFamily: 'Lato-Regular',
    color: '#529F45',
    // textAlign: 'justify',
    textAlign:'center',
    lineHeight: 23
  },
});

export default ModalTracking;
