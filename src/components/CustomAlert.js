import {StyleSheet, Text, Image, View, TouchableOpacity} from 'react-native';
import React, {Component} from 'react';
import Modal from 'react-native-modal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import IconLonceng from '../assets/icons/Lonceng.svg';
import Lonceng from '../assets/icons/IconLonceng.svg';
import CONFIG from '../constants/config';
import IconClose from '../assets/icons/IconClose.svg';

class CustomAlert extends Component {
  render() {
    const {
      alertVisible,
      onPressBtn,
      images,
      title,
      textAlert,
      textBtn,
      typeOfAlert,
      onBackdropPress,
    } = this.props;
    return (
      <Modal
        isVisible={alertVisible}
        onBackdropPress={() => onBackdropPress()}
        style={{alignItems: 'center'}}>
        {typeOfAlert === true ? (
          <View style={styles.containerImages}>
            <View
              style={{
                justifyContent: 'center',
              }}>
              <Image
                resizeMode="cover"
                source={images}
                style={styles.imagesAlert}
              />
            </View>
            <TouchableOpacity  onPress={() => onPressBtn()} style={styles.iconClose}>
              <IconClose   
                  width= {wp('4%')}
                  height= {wp('4%')}
              style={styles.imagesAlertIconCLose}         
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.container}>
            <View style={styles.images}>
              <Lonceng width={wp('13%')} height={wp('13%')} />
            </View>
            {/* <TouchableOpacity  onPress={() => onPressBtn()} style={styles.iconClose}>
              <IconClose   
                  width= {wp('4%')}
                  height= {wp('4%')}
              style={styles.imagesAlertIconCLose}         
              />
            </TouchableOpacity> */}
            <View style={styles.viewTitle}>
              <Text style={styles.title}>{title}</Text>
            </View>
            <View style={styles.viewText}>
              <Text numberOfLines={3} style={styles.text}>
                {textAlert}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => onPressBtn()}
              style={styles.btnAlert}>
              <Text style={styles.textBtn}>{textBtn}</Text>
            </TouchableOpacity>
          </View>
        )}
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    minHeight: '27%',
    alignItems: 'center',
    paddingHorizontal: hp('2.5%'),
    paddingVertical: hp('2.5%'),
    borderRadius: 7,
    width: '90%',
  },
  images: {
    marginTop: '-18%',
    backgroundColor: '#EAE9E5',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#FFF',
    borderWidth: 3,
    paddingVertical: wp('1.5%'),
    paddingHorizontal: wp('1.5%'),
  },
  viewTitle: {
    marginTop: hp('2%'),
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('2.6%'),
    textAlign: 'center',
  },
  viewText: {
    marginTop: hp('2%'),
    marginBottom: hp('2.5%'),
    // backgroundColor:'red',
    width: '100%',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('2%'),
    textAlign: 'center',
  },
  btnAlert: {
    // position: 'absolute',
    // marginTop: hp('2.5%'),
    backgroundColor: '#E07126',
    // backgroundColor: '#529F45',
    paddingVertical: wp('2.5%'),
    width: '100%',
    alignItems: 'center',
    borderRadius: 5,
    // bottom: 0,
  },
  textBtn: {
    fontSize: hp('2%'),
    color: '#FFFFFF',
  },
  // alert images
  containerImages: {},
  iconClose: {
    position: 'absolute',
    top: -15,
    right: -15,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding:wp('2%'),
    borderRadius: wp('50%'),
  },
  btnCloseIcon: {
    alignSelf: 'flex-end',
    top: 0,
    backgroundColor: '#E07126',
    paddingHorizontal: wp('2%'),
    paddingVertical: wp('0.7%'),
    textAlign: 'center',
    borderRadius: 30,
    color: '#FFF',
  },
  imagesAlert: {
    width: wp('55%'),
    height: wp('70%'),
  },
});

export default CustomAlert;
