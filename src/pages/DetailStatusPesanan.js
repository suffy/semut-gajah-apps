import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Text,
  Alert,
  Modal,
  TextInput,
  Pressable,
} from 'react-native';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import IconBack from '../assets/icons/backArrow.svg';
import ModalAlert from '../components/ModalAlert';
import {OrderAction} from '../redux/Action';
import Storage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import Home from '../assets/icons/Home.svg';
import HomeActive from '../assets/icons/HomeActive.svg';
import Group545 from '../assets/icons/000/Group545.svg';
import Group546 from '../assets/icons/000/Group546.svg';
import Group547 from '../assets/icons/000/Group547.svg';
import Group548 from '../assets/icons/000/Group548.svg';
import Group549 from '../assets/icons/000/Group549.svg';

export class DetailStatusPesanan extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    this.state = {
      modalVisible: false,
      notes: '',
      alertData: '',
      modalAlert: false,
      order: this.props.order,
    };
  }
  render() {
    const {order} = this.state;
    // console.log("data order id", order.id)
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <ModalAlert
          modalAlert={this.state.modalAlert}
          alert={this.state.alertData}
          getCloseAlertModal={() => this.getCloseAlertModal()}
        />
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({modalVisible: !this.state.modalVisible});
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                {'Apakah anda yakin membatalkan pesanan?'}
              </Text>
              <TextInput
                autoCapitalize="none"
                style={{
                  borderColor: '#fff',
                  borderWidth: 1,
                  borderColor: '#C4C4C4',
                  borderRadius: wp('1%'),
                  marginBottom: wp('3%'),
                  paddingHorizontal: wp('3%'),
                  width: wp('80%'),
                }}
                underlineColorAndroid="transparent"
                // numberOfLines={10}
                multiline={true}
                placeholder="Tuliskan alasanmu disni"
                placeholderTextColor="#A4A4A4"
                onChangeText={value => {
                  this.setState({notes: value});
                }}>
                {this.props.item?.description}
              </TextInput>
              <View style={{flexDirection: 'row'}}>
                <Pressable
                  style={[
                    styles.buttonToKeranjang,
                    {
                      width: wp('30%'),
                      backgroundColor: '#fff',
                      borderColor: '#6c757d',
                    },
                  ]}
                  onPress={() =>
                    this.setState({
                      modalVisible: !this.state.modalVisible,
                      buttonDisabled: false,
                    })
                  }>
                  <Text style={[styles.textStyle, {color: '#000'}]}>
                    {'Lewati'}
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.buttonToKeranjang,
                    {
                      marginLeft: wp('1%'),
                    },
                  ]}
                  onPress={() => this.postCancelOrder()}>
                  <Text style={styles.textStyle}>{'Simpan dan lanjutkan'}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
        <View style={[styles.container]}>
          <IconBack
            width={wp('4%')}
            height={hp('4%')}
            stroke="black"
            strokeWidth="2.5"
            fill="black"
            onPress={() => this.props.navigation.goBack()}
          />
          <Text style={styles.text}>{'Detail Status'}</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.viewImageGrup}>
            <View style={styles.itemImageGrup}>
              <HomeActive width={wp('6%')} height={hp('6%')} />
              <Group548 width={'100%'} height={hp('2%')} />
            </View>
            <View style={styles.itemImageGrup}>
              <HomeActive width={wp('6%')} height={hp('6%')} />
              <Group545 width={'100%'} height={hp('2%')} />
            </View>
            <View style={styles.itemImageGrup}>
              <Home width={wp('6%')} height={hp('6%')} />
              <Group546 width={'100%'} height={hp('2%')} />
            </View>
            <View style={styles.itemImageGrup}>
              <Home width={wp('6%')} height={hp('6%')} />
              <Group549 width={'100%'} height={hp('2%')} />
            </View>
          </View>
          <View style={styles.textStatusPesanan}>
            <Text style={styles.textGreen}>Status pesanan</Text>
          </View>
          <View style={styles.viewStatusPemesanan}>
            <Text style={{color: '#000', fontWeight: '600'}}>
              Status Pemesanan
            </Text>
            <View style={styles.viewListStatusPemesanan}>
              <View style={styles.cardStatusPemesanan}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      backgroundColor: '#529F45',
                      height: hp('1.5%'),
                      width: hp('1.5%'),
                      marginHorizontal: wp('1%'),
                      borderRadius: 50,
                    }}></View>
                  <Text style={styles.textGreen}>
                    System-Automatic - Minggu, 24 Jul 2022
                  </Text>
                  <View style={styles.viewTextGray}>
                    <Text style={styles.textGray}>15:23 WIB</Text>
                  </View>
                </View>
                <View style={styles.viewContentCard}>
                  <View
                    style={{
                      backgroundColor: '#529F45',
                      minHeight: 7,
                      width: 3,
                      marginHorizontal: wp('2%'),
                    }}
                  />
                  <View style={styles.textContentCard}>
                    <Text style={styles.textGray}>Transaksi selesai</Text>
                    <Text style={styles.textGray}>
                      Dana akan diteruskan kepenjual
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.viewListStatusPemesanan}>
              <View style={styles.cardStatusPemesanan}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      backgroundColor: '#529F45',
                      height: hp('1.5%'),
                      width: hp('1.5%'),
                      marginHorizontal: wp('1%'),
                      borderRadius: 50,
                    }}></View>
                  <Text style={styles.textGreen}>
                    System-Automatic - Minggu, 24 Jul 2022
                  </Text>
                  <View style={styles.viewTextGray}>
                    <Text style={styles.textGray}>15:23 WIB</Text>
                  </View>
                </View>
                <View style={styles.viewContentCard}>
                  <View
                    style={{
                      backgroundColor: '#529F45',
                      minHeight: 7,
                      width: 3,
                      marginHorizontal: wp('2%'),
                    }}
                  />
                  <View style={styles.textContentCard}>
                    <Text style={styles.textGray}>Transaksi selesai</Text>
                    <Text style={styles.textGray}>
                      Dana akan diteruskan kepenjual
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.viewListStatusPemesanan}>
              <View style={styles.cardStatusPemesanan}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      backgroundColor: '#529F45',
                      height: hp('1.5%'),
                      width: hp('1.5%'),
                      marginHorizontal: wp('1%'),
                      borderRadius: 50,
                    }}></View>
                  <Text style={styles.textGreen}>
                    System-Automatic - Minggu, 24 Jul 2022
                  </Text>
                  <View style={styles.viewTextGray}>
                    <Text style={styles.textGray}>15:23 WIB</Text>
                  </View>
                </View>
                <View style={styles.viewContentCard}>
                  <View
                    style={{
                      backgroundColor: '#529F45',
                      minHeight: 7,
                      width: 3,
                      marginHorizontal: wp('2%'),
                    }}
                  />
                  <View style={styles.textContentCard}>
                    <Text style={styles.textGray}>Transaksi selesai</Text>
                    <Text style={styles.textGray}>
                      Dana akan diteruskan kepenjual
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    ); 
  }
}
const mapStateToProps = state => ({
  token: state.LoginReducer.token,
  dataUser: state.LoginReducer.dataUser,
  order: state.OrderReducer.order,
});

const mapDispatchToProps = dispatch => {
  return {
    orderAct: (value, tipe) => {
      dispatch(OrderAction(value, tipe));
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DetailStatusPesanan);
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: hp('8%'),
    backgroundColor: 'white',
    borderColor: '#E8E8E8',
    paddingLeft: wp('5%'),
    borderBottomWidth: 4,
    borderColor: '#ddd',
  },
  text: {
    fontFamily: 'Lato-Medium',
    fontSize: hp('2.4%'),
    paddingLeft: wp('5%'),
  },
  content: {
    flex: 1,
    paddingTop: hp('1%'),
    paddingRight: wp('5%'),
    paddingLeft: wp('5%'),
  },
  viewImageGrup: {
    flexDirection: 'row',
    width: '100%',
  },
  itemImageGrup: {
    flexDirection: 'column',
    width: '25%',
    alignItems: 'center',
  },
  textStatusPesanan: {
    paddingTop: hp('3%'),
    width: '100%',
    alignItems: 'center',
    color: '#529F45',
  },
  viewStatusPemesanan: {
    marginTop: hp('3.3%'),
  },
  viewListStatusPemesanan: {
    marginTop: hp('1.5%'),
    // backgroundColor:'red'
  },
  cardStatusPemesanan: {
    width: '100%',
    // backgroundColor: 'blue',
    flexDirection: 'column',
  },
  textGreen: {
    color: '#529F45',
    fontSize: hp('1.8%'),
  },
  viewTextGray: {
    position: 'absolute',
    right: 0,
  },
  textGray: {
    color: '#7D7D7D',
    fontSize: hp('1.8%'),
    alignItems: 'flex-end',
    marginRight: wp('3%'),
  },
  viewContentCard: {
    flexDirection: 'row',
  },
  textContentCard: {
    paddingTop: hp('1%'),
    paddingBottom: hp('1.5%'),
  },
});
