import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
} from 'react-native';
import {connect} from 'react-redux';
import Size from '../components/Fontresponsive';
import axios from 'axios';
import CONFIG from '../constants/config';
import {Card} from 'react-native-elements';
import {TouchableOpacity} from 'react-native';
import {HelpCareAction} from '../redux/Action';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';

const width = Dimensions.get('window').width;

export class HelpCareSearch extends Component {
  UNSAFE_componentWillMount() {
    // lor(this);
  }

  componentWillUnmount() {
    // rol()
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{paddingBottom: wp('3%')}}>
          {this.props.dataList.map((item, index) => (
            <View
              key={index}
              style={[
                styles.cardBackground,
                index % 2 == 0
                  ? {backgroundColor: '#FFF'}
                  : {backgroundColor: '#F4F4F4'},
              ]}>
              <TouchableOpacity onPress={() => this.props.onItemPress(item)}>
                <Text style={styles.title}>{item.name}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
  dataUser: state.LoginReducer.dataUser,
});

const mapDispatchToProps = dispatch => {
  return {
    helpCareAct: (value, tipe) => {
      dispatch(HelpCareAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HelpCareSearch);

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Lato-Regular',
    fontSize: hp('1.8%'),
    fontWeight: 'bold',
    color: '#575251',
  },
  cardBackground: {
    width,
    marginLeft: wp('0%'),
    borderColor: '#777',
    borderWidth: wp('0%'),
    justifyContent: 'center',
    paddingLeft: wp('5%'),
    paddingVertical: hp('2%'),
  },
});
