import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {connect} from 'react-redux';
import axios from 'axios';
import CONFIG from '../constants/config';
import IconSearch from '../assets/icons/Search.svg';
import {Card, ListItem, Button, Icon, FAB} from 'react-native-elements';
import {LoginAction} from '../redux/Action';
import IconTambah from '../assets/icons/Plus.svg';
import IconAlamat from '../assets/icons/DaftarAlamat.svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Storage from '@react-native-async-storage/async-storage';
import IconBack from '../assets/icons/backArrow.svg';
import Snackbar from 'react-native-snackbar';

const width = Dimensions.get('window').width;

const alamat = [
  {
    address: '',
    address_name: null,
    address_phone: null,
    created_at: '',
    default_address: null,
    deleted_at: null,
    id: 0,
    isSelected: false,
    kecamatan: '',
    kelurahan: '',
    kode_pos: 0,
    kota: '',
    latitude: null,
    longitude: null,
    mapping_site_id: 0,
    name: '',
    provinsi: '',
    shop_name: '',
    status: 0,
    type: null,
    updated_at: '',
    user_id: 0,
  },
];

export class DataAlamat extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      _isPress: false,
      alamat: alamat,
      search: '',
      listSearch: alamat,
    };
  }

  UNSAFE_componentWillMount() {
    // lor(this);
    const {dataUser} = this.props;
    let arr = dataUser.user_address.map((item, index) => {
      item.isSelected = false;
      return {...item};
    });
    this.setState({alamat: arr});
  }

  componentWillUnmount() {
    // rol();
  }

  changeColour2 = index => {
    const {listSearch} = this.state;
    let arr = listSearch.map((val, i) => {
      if (index == i) {
        val.isSelected = !val.isSelected;
      } else {
        val.isSelected = false;
      }
      return {...val};
    });
    this.setState({listSearch: arr});
  };

  changeColour = index => {
    const {alamat} = this.state;
    let arr = alamat.map((val, i) => {
      if (index == i) {
        val.isSelected = !val.isSelected;
      } else {
        val.isSelected = false;
      }
      return {...val};
    });
    this.setState({alamat: arr});
  };

  getDefaultAddress = async item => {
    // console.log('token==>', this.props.token);
    try {
      let response = await axios.put(
        `${CONFIG.BASE_URL}/api/default-address/${item.id}`,
        {timeout: 1000},
        {
          headers: {
            Authorization: `Bearer ${this.props.token}`,
          },
        },
      );
      const data = response.data;
      // console.log('Response===>', data.data);
      this.props.loginAct(data.data, 'dataUser');
      this.props.navigation.replace('DataAlamat');
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

  // searching
  getDataSearching = async (value = '') => {
    // console.log('Value===>', value);
    try {
      let response = await axios.get(
        `${CONFIG.BASE_URL}/api/address?search=${value}`,
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      const data = response.data.data;
      let arr = data.user_address.map((item, index) => {
        item.isSelected = false;
        return {...item};
      });
      this.setState({listSearch: arr});
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
    let result = list.filter(item => {
      const itemData = `${item.address.toLowerCase()} ${item.name.toLowerCase()} ${item.provinsi.toLowerCase()} ${item.kota.toLowerCase()} ${item.kecamatan.toLowerCase()} ${item.kelurahan.toLowerCase()} ${item.kode_pos.toLowerCase()}`;
      const textData = this.state.search.toLowerCase();
      return itemData.includes(textData);
      // listItem.name.toLowerCase().includes(this.state.search.toLowerCase()),
    });
    return result;
  }

  renderSearch = () => {
    const {listSearch} = this.state;
    console.log('LIST===>', listSearch);
    return (
      <View>
        {this.filterList(listSearch).map((item, index) => (
          <View key={`${item.id}`}>
            {item.isSelected ? (
              <TouchableWithoutFeedback
                onPress={() => this.changeColour2(index)}>
                <Card
                  containerStyle={[
                    {
                      backgroundColor: '#ccffcc',
                      borderColor: '#ccffcc',
                    },
                    styles.cardBackground,
                  ]}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Card.Title style={styles.cardTitle}>
                        {'Rumah'}
                      </Card.Title>
                      {item.default_address == 1 ? (
                        <Text style={styles.textAlamatUtama}>{'Utama'}</Text>
                      ) : null}
                    </View>
                    {item.default_address == 1 ? null : (
                      <Button
                        titleStyle={styles.buttonJadikanUtamaTitle}
                        buttonStyle={styles.buttonJadikanUtama}
                        onPress={() => {
                          this.getDefaultAddress(item);
                        }}
                        title="Jadikan Utama"
                      />
                    )}
                  </View>
                  <Card.Divider />
                  {/* <Card.Image source={require('../assets/images/no_data.jpg')}> */}
                  <Text style={styles.Nama}>{item.name}</Text>
                  <Text style={styles.Telp}>{this.props.dataUser.phone}</Text>
                  {item.kelurahan ? (
                    <Text style={styles.Alamat}>
                      {item.address}
                      {', '}
                      {item.kelurahan}
                      {', '}
                      {item.kecamatan}
                      {', '}
                      {item.kota}
                      {', '}
                      {item.provinsi}
                      {', '}
                      {item.kode_pos}
                    </Text>
                  ) : (
                    <Text style={styles.Alamat}>{item.address}</Text>
                  )}
                  <Button
                    onPress={() =>
                      this.props.navigation.replace(
                        'FormEditAlamat',
                        this.props.loginAct(item, 'alamat'),
                      )
                    }
                    //   icon={<Icon name="code" color="#ffffff" />}
                    titleStyle={styles.cardButtonTitle}
                    buttonStyle={styles.cardButton}
                    title="Ubah Alamat"
                  />
                  {/* </Card.Image> */}
                </Card>
              </TouchableWithoutFeedback>
            ) : (
              <TouchableWithoutFeedback
                onPress={() => this.changeColour2(index)}>
                <Card
                  containerStyle={[
                    {
                      backgroundColor: '#FFFFFF',
                      borderColor: '#FFFFFF',
                    },
                    styles.cardBackground,
                  ]}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    }}>
                    <Card.Title style={styles.cardTitle}>{'Rumah'}</Card.Title>
                    {item.default_address == 1 ? (
                      <Text style={styles.textAlamatUtama}>{'Utama'}</Text>
                    ) : null}
                  </View>
                  <Card.Divider />
                  {/* <Card.Image source={require('../assets/images/no_data.jpg')}> */}
                  <Text style={styles.Nama}>{item.name}</Text>
                  <Text style={styles.Telp}>{this.props.dataUser.phone}</Text>
                  <Text style={styles.Alamat}>
                    {item.address}
                    {', '}
                    {item.kelurahan}
                    {', '}
                    {item.kecamatan}
                    {', '}
                    {item.kota}
                    {', '}
                    {item.provinsi}
                    {', '}
                    {item.kode_pos}
                  </Text>
                  <Button
                    onPress={() =>
                      this.props.navigation.replace(
                        'FormEditAlamat',
                        this.props.loginAct(item, 'alamat'),
                      )
                    }
                    //   icon={<Icon name="code" color="#ffffff" />}
                    titleStyle={styles.cardButtonTitle}
                    buttonStyle={styles.cardButton}
                    title="Ubah Alamat"
                  />
                  {/* </Card.Image> */}
                </Card>
              </TouchableWithoutFeedback>
            )}
          </View>
        ))}
      </View>
    );
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
    const {alamat, listSearch} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={[styles.container]}>
          <IconBack
            width={wp('4%')}
            height={hp('4%')}
            stroke="black"
            strokeWidth="2.5"
            fill="black"
            onPress={() => this.props.navigation.goBack()}
          />
          <Text style={styles.text}>{'Daftar Alamat'}</Text>
          {/* {this.state._isPress == true ? (
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('FormTambahAlamat')}
              style={styles.buttonTambahAlamat}>
              <Text style={styles.textTambahAlamat}>{'Tambah Alamat'}</Text>
            </TouchableOpacity>
          ) : null} */}
          {/* <TouchableOpacity
            onPress={() => {
              if (this.state._isPress === true) {
                this.setState({_isPress: false});
              } else {
                this.setState({_isPress: true});
              }
            }}>
            <IconTambah
              width={wp('5%')}
              height={hp('6%')}
            />
          </TouchableOpacity> */}
        </View>
        {/* <View style={styles.container2}>
          <IconSearch
            width={wp('3%'.5)}
            height={hp('6%')}
            style={styles.search}
          />
           <TextInput
            autoCapitalize = 'none'
            onChangeText={value => this.handlerSearch(value)}
            style={styles.inputStyle}
            placeholder="Cari Alamat"
            placeholderTextColor="#A4A4A4"
          />
        </View> */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            backgroundColor: 'white',
            marginBottom: wp('3%'),
          }}>
          {this.state.search.length > 0 && this.renderSearch()}
          {this.state.search.length == 0 && (
            <View>
              {alamat.map((item, index) => (
                <View key={`${item.id}`}>
                  {item.isSelected ? (
                    <TouchableWithoutFeedback
                      onPress={() => this.changeColour(index)}>
                      <Card
                        containerStyle={[
                          {
                            backgroundColor: '#ccffcc',
                            borderColor: '#ccffcc',
                          },
                          styles.cardBackground,
                        ]}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <IconAlamat
                              width={wp('6%')}
                              height={hp('6%')}
                              style={{
                                marginRight: wp('2%'),
                                marginTop: hp('-1%'),
                              }}
                            />
                            <Text style={styles.cardTitle}>
                              {'Alamat Toko'}
                            </Text>
                            {item.default_address == 1 ? (
                              <Text style={styles.textAlamatUtama}>
                                {'Utama'}
                              </Text>
                            ) : null}
                          </View>
                          {item.default_address == 1 ? null : (
                            <Button
                              titleStyle={styles.buttonJadikanUtamaTitle}
                              buttonStyle={styles.buttonJadikanUtama}
                              onPress={() => {
                                this.getDefaultAddress(item);
                              }}
                              title="Jadikan Utama"
                            />
                          )}
                        </View>
                        <Card.Divider />
                        {/* <Card.Image source={require('../assets/images/no_data.jpg')}> */}
                        <Text style={styles.Nama}>{item.name}</Text>
                        <Text style={styles.Telp}>
                          {this.props.dataUser.phone}
                        </Text>
                        <Text style={styles.Alamat}>
                          {item.address}
                          {', '}
                          {item.kelurahan}
                          {', '}
                          {item.kecamatan}
                          {', '}
                          {item.kota}
                          {', '}
                          {item.provinsi}
                          {', '}
                          {item.kode_pos}
                        </Text>
                        <Button
                          onPress={() =>
                            this.props.navigation.replace(
                              'FormEditAlamat',
                              this.props.loginAct(item, 'alamat'),
                            )
                          }
                          //   icon={<Icon name="code" color="#ffffff" />}
                          titleStyle={styles.cardButtonTitle}
                          buttonStyle={styles.cardButton}
                          title="Ubah Alamat"
                        />
                        {/* </Card.Image> */}
                      </Card>
                    </TouchableWithoutFeedback>
                  ) : (
                    <TouchableWithoutFeedback
                      onPress={() => this.changeColour(index)}>
                      <Card
                        containerStyle={[
                          {
                            backgroundColor: '#FFFFFF',
                            borderColor: '#E8E8E8',
                            borderWidth: 2,
                          },
                          styles.cardBackground,
                        ]}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                          }}>
                          <IconAlamat
                            width={wp('6%')}
                            height={hp('6%')}
                            style={{
                              marginRight: wp('2%'),
                              marginTop: hp('-1%'),
                            }}
                          />
                          <Text style={styles.cardTitle}>{'Alamat Toko'}</Text>
                          {item.default_address == 1 ? (
                            <Text style={styles.textAlamatUtama}>
                              {'Utama'}
                            </Text>
                          ) : null}
                        </View>
                        <Card.Divider />
                        {/* <Card.Image source={require('../assets/images/no_data.jpg')}> */}
                        <Text style={styles.Nama}>{item.name}</Text>
                        <Text style={styles.Telp}>
                          {this.props.dataUser.phone}
                        </Text>
                        <Text style={styles.Alamat}>
                          {item.address}
                          {', '}
                          {item.kelurahan}
                          {', '}
                          {item.kecamatan}
                          {', '}
                          {item.kota}
                          {', '}
                          {item.provinsi}
                          {', '}
                          {item.kode_pos}
                        </Text>
                        <Button
                          onPress={() =>
                            this.props.navigation.replace(
                              'FormEditAlamat',
                              this.props.loginAct(item, 'alamat'),
                            )
                          }
                          //   icon={<Icon name="code" color="#ffffff" />}
                          titleStyle={styles.cardButtonTitle}
                          buttonStyle={styles.cardButton}
                          title="Ubah Alamat"
                        />
                        {/* </Card.Image> */}
                      </Card>
                    </TouchableWithoutFeedback>
                  )}
                </View>
              ))}
            </View>
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
    loginAct: (value, tipe) => {
      dispatch(LoginAction(value, tipe));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DataAlamat);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: hp('8%'),
    backgroundColor: 'white',
    paddingLeft: wp('5%'),
    borderBottomWidth: 4,
    borderColor: '#ddd',
  },
  text: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('2.4%'),
    paddingLeft: wp('5%'),
  },
  inputStyle: {
    borderWidth: 1,
    fontFamily: 'Lato-Medium',
    fontSize: hp('1.6%'),
    color: 'black',
    width: wp('90%'),
    height: hp('5.5%'),
    borderRadius: hp('3.5%'),
    borderColor: '#777',
    paddingLeft: wp('7%'),
  },
  search: {
    position: 'absolute',
    right: wp('89%'),
  },
  container2: {
    position: 'relative',
    height: hp('5%'),
    backgroundColor: 'white',
    alignItems: 'center',
    marginBottom: wp('1%'),
    marginTop: wp('0%'),
  },
  title: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('2.2%'),
    marginBottom: wp('2%'),
  },
  cardBackground: {
    width: wp('90%'),
    // marginLeft: wp('1%'0),
    borderWidth: 2,
    borderRadius: hp('2.5%'),
    alignSelf: 'center',
    alignItems: 'stretch',
    // paddingLeft: wp('5%'),
    // marginTop: wp('1%'),
  },
  cardTitle: {
    // alignSelf: 'flex-start',
    marginTop: hp('-1.5%'),
    fontSize: hp('2%'),
    // height: hp('4%'),
    color: 'black',
    fontFamily: 'Lato-Medium',
    marginRight: wp('2%'),
  },
  textAlamatUtama: {
    // marginBottom: wp('3%'),
    marginTop: hp('-1%'),
    fontSize: hp('1.2%'),
    fontFamily: 'Lato-Medium',
    backgroundColor: '#E8E8E8',
    borderRadius: hp('0.8%'),
    padding: hp('0.8%'),
  },
  Nama: {
    fontSize: hp('1.8%'),
    fontFamily: 'Lato-Bold',
  },
  Telp: {
    fontSize: hp('1.6%'),
    fontFamily: 'Lato-Medium',
    paddingTop: hp('0.8%'),
  },
  Alamat: {
    fontSize: hp('1.6%'),
    fontFamily: 'Lato-Medium',
    paddingTop: hp('0.8%'),
  },
  cardButton: {
    borderRadius: hp('1.5%'),
    width: wp('80%'),
    height: hp('5%'),
    backgroundColor: '#529F45',
    alignSelf: 'center',
    marginTop: hp('1.5%'),
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
  },
  cardButtonTitle: {
    fontSize: hp('1.6%'),
    fontFamily: 'Lato-Medium',
  },
  buttonTambahAlamat: {
    width: wp('20%'),
    height: hp('4%'),
    borderRadius: hp('2%'),
    backgroundColor: '#529F45',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp('28%'),
  },
  textTambahAlamat: {
    fontSize: hp('1.1%'),
    fontFamily: 'Lato-Medium',
    color: 'white',
  },
  buttonJadikanUtama: {
    borderRadius: hp('1%'),
    marginBottom: hp('1.5%'),
    backgroundColor: '#E07126',
    fontSize: hp('1.4%'),
    fontFamily: 'Lato-Medium',
    width: wp('20%'),
  },
  buttonJadikanUtamaTitle: {
    fontSize: hp('1.1%'),
    fontFamily: 'Lato-Medium',
  },
});
