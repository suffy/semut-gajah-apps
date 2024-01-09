import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import Size from '../components/Fontresponsive';
import axios from 'axios';
import CONFIG from '../constants/config';
import IconSearch from '../assets/newIcons/iconPencarian.svg';
import IconClose from '../assets/newIcons/iconClose.svg';
import {Card} from 'react-native-elements';
import HelpCareCategory from '../pages/HelpCareCategory';
import HelpCareSearch from '../pages/HelpCareSearch';
import {HelpCareAction} from '../redux/Action';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Storage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
import IconBack from '../assets/icons/backArrow.svg';
import Snackbar from 'react-native-snackbar';
import Header from '../components/Header';
const width = Dimensions.get('window').width;
const helpcare = [
  {
    id: '',
    name: '',
    description: '',
  },
];

export class HelpCare extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      helpcare: helpcare,
      helpcategories: [],
      search: '',
      listSearch: helpcare,
    };
  }

  componentDidMount() {}

  UNSAFE_componentWillMount = () => {
    // lor(this);
    this.getHelpCare();
    this.getHelpCategories();
    this.getDataSearching();
  };

  componentWillUnmount() {
    // rol();
  }

  //help care
  getHelpCare = async () => {
    try {
      let response = await axios.get(`${CONFIG.BASE_URL}/api/helps`, {
        headers: {Authorization: `Bearer ${this.props.token}`},
      });
      let data = response.data.data;
      // console.log('data',JSON.stringify(data));
      this.setState({helpcare: data});
    } catch (error) {
      let error429 =
        JSON.parse(JSON.stringify(error)).message ===
        'Request failed with status code 429';
      let errorNetwork =
        JSON.parse(JSON.stringify(error)).message === 'Network Error';
      let error400 =
        JSON.parse(JSON.stringify(error)).message ===
        'Request failed with status code 400';
      console.log(
        'Cek Error========================',
        JSON.parse(JSON.stringify(error)).message,
      );
      if (error429) {
        this.showSnackbarBusy();
      } else if (errorNetwork) {
        this.showSnackbarInet();
      } else if (error400) {
        Storage.removeItem('token');
        // this.props.navigation.navigate('Home');
      }
    }
  };

  //help care kategori
  getHelpCategories = async () => {
    try {
      let response = await axios.get(
        `${CONFIG.BASE_URL}/api/helps/categories`,
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      let data = response.data.data;
      console.log('data ICON', JSON.stringify(data));
      this.setState({helpcategories: data});
    } catch (error) {
      let error429 =
        JSON.parse(JSON.stringify(error)).message ===
        'Request failed with status code 429';
      let errorNetwork =
        JSON.parse(JSON.stringify(error)).message === 'Network Error';
      let error400 =
        JSON.parse(JSON.stringify(error)).message ===
        'Request failed with status code 400';
      console.log(
        'Cek Error========================',
        JSON.parse(JSON.stringify(error)).message,
      );
      if (error429) {
        this.showSnackbarBusy();
      } else if (errorNetwork) {
        this.showSnackbarInet();
      } else if (error400) {
        Storage.removeItem('token');
        this.props.navigation.navigate('Home');
      }
    }
  };

  getDataSearching = async (value = '') => {
    try {
      let response = await axios.get(
        `${CONFIG.BASE_URL}/api/helps?search=${value}`,
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      const data = response.data.data;
      this.setState({listSearch: data});
    } catch (error) {
      let error429 =
        JSON.parse(JSON.stringify(error)).message ===
        'Request failed with status code 429';
      let errorNetwork =
        JSON.parse(JSON.stringify(error)).message === 'Network Error';
      let error400 =
        JSON.parse(JSON.stringify(error)).message ===
        'Request failed with status code 400';
      console.log(
        'Cek Error========================',
        JSON.parse(JSON.stringify(error)).message,
      );
      if (error429) {
        this.showSnackbarBusy();
      } else if (errorNetwork) {
        this.showSnackbarInet();
      } else if (error400) {
        Storage.removeItem('token');
        // this.props.navigation.navigate('Home');
      }
    }
  };

  handlerSearch = value => {
    this.setState({search: value});
    this.getDataSearching(value);
  };

  filterList(list) {
    let result = list.filter(listItem =>
      listItem.name.toLowerCase().includes(this.state.search.toLowerCase()),
    );
    return result;
  }

  handleItemPress = item => {
    this.props.helpCareAct(item, 'helpCare');
    this.setState({search: ''});
    this.props.navigation.navigate('HelpCareDetail');
  };

  showSnackbarBusy = () => {
    Snackbar.show({
      text: 'Server Sibuk, Silahkan ulangi lagi',
      //You can also give duration- Snackbar.LENGTH_SHORT, Snackbar.LENGTH_LONG
      duration: Snackbar.LENGTH_INDEFINITE,
      //color of snakbar
      backgroundColor: '#17a2b8',
      //color of text
      textColor: 'white',
      //action
      action: {
        text: 'coba lagi',
        textColor: 'white',
        onPress: () => {
          this.forceUpdate();
        },
      },
    });
  };

  showSnackbarInet = () => {
    Snackbar.show({
      text: 'Internet Bermasalah, Silahkan ulangi lagi',
      //You can also give duration- Snackbar.LENGTH_SHORT, Snackbar.LENGTH_LONG
      duration: Snackbar.LENGTH_INDEFINITE,
      //color of snakbar
      backgroundColor: '#17a2b8',
      //color of text
      textColor: 'white',
      //action
      action: {
        text: 'coba lagi',
        textColor: 'white',
        onPress: () => {
          this.forceUpdate();
        },
      },
    });
  };

  render() {
    const {search} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <Header
          title="Bantuan"
          navigation={this.props.navigation}
          // menu={true}
        />
        {this.state.search.length == 0 && (
          <View style={{backgroundColor: '#F4F4F4', paddingTop: hp('1%')}}>
            <Text style={styles.title2}>{'Ada yang bisa dibantu?'}</Text>
          </View>
        )}
        {this.state.search.length > 0 && (
          <View style={{backgroundColor: '#F4F4F4', paddingTop: hp('1%')}}>
            <Text style={styles.title2}>{'Hasil Pencarian'}</Text>
          </View>
        )}
            <View style={styles.searchSection}>
              <TextInput
                autoCapitalize="none"
                onChangeText={value => this.handlerSearch(value)}
                style={styles.inputStyle}
                placeholder="Ketik kata kunci yang ingin anda cari"
                value={search}
                selectTextOnFocus={true}
              />
              {search === '' ? (
                <IconSearch
                width={wp('4.5%')}
                height={hp('6.5%')}
                  style={styles.search}
                />
              ) : (
                <IconClose
                  fill="black"
                  width={wp('4%')}
                  height={hp('6.5%')}
                  style={[styles.search]}
                  onPress={() => {
                    this.setState({
                      search: '',
                    });
                  }}
                />
              )}
            </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{paddingBottom: wp('3%')}}>
          {this.state.search.length > 0 && (
            <HelpCareSearch
              onItemPress={this.handleItemPress}
              dataList={this.filterList(this.state.listSearch)}
              navigation={this.props.navigation}
            />
          )}
          {this.state.search.length == 0 && (
            <SafeAreaView>
              <Text style={[styles.title2, {marginTop: wp('1%')}]}>
                {'Pilih topik sesuai dengan kendala kamu'}
              </Text>

              <HelpCareCategory
                helpcategories={this.state.helpcategories}
                navigation={this.props.navigation}
              />
              <Text
                style={[
                  styles.title,
                  {marginTop: wp('2%'), marginBottom: hp('2%')},
                ]}>
                {'FAQ'}
              </Text>
              {this.state.helpcare.map((item, index) => (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate(
                      'HelpCareDetail',
                      this.props.helpCareAct(item, 'helpCare'),
                    )
                  }
                  key={index}>
                  <View
                    style={[
                      styles.cardBackground,
                      index % 2 == 0
                        ? {backgroundColor: '#FFF'}
                        : {backgroundColor: '#F4F4F4'},
                    ]}>
                    <Text style={styles.textQuestion}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </SafeAreaView>
          )}
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

export default connect(mapStateToProps, mapDispatchToProps)(HelpCare);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: hp('8%'),
    backgroundColor: 'white',
    paddingHorizontal: wp('5%'),
    borderBottomWidth: 4,
    borderColor: '#ddd',
  },
  text: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('2.2%'),
    marginLeft: wp('5%'),
  },
  searchSection: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    paddingBottom: hp('2.5%'),
  },
  inputStyle: {
    // flex: 1,
    borderWidth: 2,
    fontFamily: 'Lato-Medium',
    fontSize: hp('1.8%'),
    color: '#000000',
    width: wp('95%'),
    height: hp('5%'),
    marginLeft: wp('1%'),
    paddingLeft: wp('5%'),
    paddingRight: wp('15%'),
    borderRadius: hp('3%'),
    borderColor: '#FFF',
    backgroundColor: '#FFF',
  },
  search: {
    position: 'absolute',
    top: wp('-1.5%'),
    right: wp('4%'),
  },
  container2: {
    flexDirection: 'row',
    marginLeft: wp('4%'),
    height: hp('5%'),
    backgroundColor: 'white',
    alignItems: 'center',
    marginBottom: wp('4%'),
    marginTop: wp('4%'),
  },
  title: {
    fontFamily: 'Lato-Regular',
    fontSize: hp('2%'),
    marginLeft: wp('5%'),
    fontWeight: 'bold',
    color: '#575251',
  },
  title2: {
    fontFamily: 'Lato-Regular',
    fontSize: hp('2%'),
    marginLeft: wp('5%'),
    marginVertical: wp('2%'),
    fontWeight: 'bold',
    color: '#575251',
  },
  textQuestion: {
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
