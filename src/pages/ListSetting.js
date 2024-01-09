import React, {Component, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  FlatList,
  RefreshControl,
  Image,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import CONFIG from '../constants/config';
import axios from 'axios';
import { NotifAction } from '../redux/Action';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import IconBack from '../assets/icons/backArrow.svg';

export class ListSetting extends Component {
   _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {};
  }

  UNSAFE_componentWillMount() {
    // lor(this);
  }

  componentWillUnmount() {
    // rol()
  }

  getDataUser = () => {
    this.props.navigation.navigate('DataUser');
  };

  getDaftarAlamat = () => {
    this.props.navigation.navigate('DataAlamat');
  };

  getShopping = () => {
    this.props.navigation.navigate('NotificationShopping');
  };

  render() {
    return (
      <View style={styles.container2}>
        <View style={styles.container}>
        <IconBack
            width={wp('4%')}
            height={hp('4%')}
            stroke="black"
            strokeWidth="2.5"
            fill="black"
            onPress={()=>this.props.navigation.goBack()}
          />
        <Text style={styles.textJudul}>{'Setelan'}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            this.getDataUser();
          }}
          style={styles.button}>
          {/* <IconChat
            width={wp('7%')}
            height={hp('7%')}
            style={styles.love}
          /> */}
          <Text style={styles.text}>{'Data Diri'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.getDaftarAlamat();
          }}
          style={styles.button}>
          {/* <IconSubs
            width={wp('7%')}
            height={hp('7%')}
            style={styles.love}
          /> */}
          <Text style={styles.text}>{'Daftar Alamat'}</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          // onPress={() => {
          //   this.notifAllOrder != undefined ? this.getShopping() : null;
          // }}
          onPress={() => this.getShopping()}
          style={styles.button}>
          <IconShopping
            width={wp('7%')}
            height={hp('7%')}
            style={styles.love}
          />
          <Text style={styles.text}>{'Belanja'}</Text>
          {this.renderCountOrderAll()}
        </TouchableOpacity> */}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
});

const mapDispatchToProps = dispatch => {
  return {
    notifAct: (value, tipe) => {
      dispatch(NotifAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListSetting);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: hp('8%'),
    backgroundColor: 'white',
    paddingLeft: wp('5%')
  },
  container2: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    // paddingLeft: wp('5%'),
  },
  button: {
    flexDirection: 'row',
    height: hp('5%'),
    width: wp('90%'),
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderColor: '#E8E8E8',
    marginBottom: hp('1%'),
    marginTop: hp('-1%'),
    marginLeft: wp('5%'),
  },
  text: {
    fontSize: hp('1.4%'),
    fontFamily: 'Lato-Medium',
    // marginLeft: wp('5%'),
  },
  textJudul: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('2.4%'),
    paddingLeft: wp('5%'),
  },
});