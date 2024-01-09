import {Text, TouchableOpacity, View} from 'react-native';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import IconMission from '../assets/icons/IconSplashMission.svg';
import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import IconBack from '../assets/icons/backArrow.svg';

export class SplashMission extends Component {
  _isMounted = false;
  startMission = () => {
    this.props.navigation.navigate('ListMission');
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.backBtn}>
          <IconBack
            width={wp('4%')}
            height={hp('4%')}
            stroke="black"
            strokeWidth="2.5"
            fill="black"
            onPress={() => this.props.navigation.goBack()}
          />
        </View>
        <View style={styles.content}>
          <IconMission />
          <Text style={styles.textTitle}>Memulai Misi</Text>
          <Text style={styles.textContent}>
            Ayo mulai misi untuk mendapatkan point
          </Text>
        </View>
        <TouchableOpacity
          style={styles.btnMulai}
          onPress={() => this.startMission()}>
          <View>
            <Text style={styles.textBtn}>Mulai</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: hp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    paddingLeft: wp('5%'),
    paddingTop: hp('2%'),
    width: '100%',
  },
  content: {
    flex: 1,
    marginTop: hp('20%'),
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
  },
  textTitle: {
    marginTop: hp('2%'),
    textAlign: 'center',
    fontSize: hp('2.2%'),
    fontWeight: 'bold',
  },
  textContent: {
    marginTop: hp('2%'),
    textAlign: 'center',
    fontSize: hp('1.9%'),
    color: '#7D7D7D',
  },
  //btn mulai
  btnMulai: {
    backgroundColor: '#529F45',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('1%'),
    borderRadius: 15,
  },
  textBtn: {
    color: '#FFFFFF',
    fontSize: hp('2.2%'),
  },
});
const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(SplashMission);
