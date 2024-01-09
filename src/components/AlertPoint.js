import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import IconClose from '../assets/icons/IconClose.svg';

class AlertPoint extends Component {
  render() {
    const {visible, onClose} = this.props;
    return (
      <>
        {visible ? (
          <View style={styles.container}>
            <View style={styles.content}>
              <Text style={styles.text}>1 Poin setara 1 Rupiah</Text>
              <TouchableOpacity style={styles.imagesAlertIconCLose}
              onPress={() => onClose()}
              >
                <IconClose width={wp('4%')} height={wp('4%')} />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('2%'),
  },
  content: {
    backgroundColor: '#529F45',
    width: '93%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('2.5%'),
    borderRadius: 5,
    flexDirection: 'row',
  },
  text: {
    fontSize: hp('2%'),
    color: '#FFFFFF',
    fontFamily: 'Lato-Medium',
  },
  imagesAlertIconCLose: {
    position: 'absolute',
    right: '5%',
  },
});

export default AlertPoint;
