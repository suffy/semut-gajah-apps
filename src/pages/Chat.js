import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import {
  GiftedChat,
  Bubble,
  Send,
  InputToolbar,
  Composer,
} from 'react-native-gifted-chat';
import IconSend from '../assets/newIcons/iconRightArrow.svg';
import {connect} from 'react-redux';
import axios from 'axios';
import CONFIG from '../constants/config';
import moment from 'moment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Storage from '@react-native-async-storage/async-storage';
import Logo from '../assets/icons/Logo.svg';
import IconNotif from '../assets/newIcons/iconNotif.svg';
import IconShopping from '../assets/newIcons/iconKeranjangAktif.svg';
import IconMenu from '../assets/newIcons/iconMenu.svg';
import {ActivityIndicator} from 'react-native-paper';
import Snackbar from 'react-native-snackbar';

const list = [
  {
    id: '',
    name: '',
    image: '',
    price_sell: '',
    
  },
];

class Chat extends React.Component {
  _isMounted = false;
  messagesRef = null;
  state = {
    // chatInterval: null,
    messages: [],
    chat: [],
    id: 0,
    idUser: 0,
    idAdmin: 0,
    search: '',
    listSearch: list,
    qty: 0,
    page: 1,
    loadingMore: false,
    refreshing: false,
    maxPage: 1,
    notifMessage: 0,
    notifAllOrder: 0,
    notifSubscribe: 0,
    notifAllComplaint: 0,
    notifBroadcast: 0,
  };

  renderLoadMore = () => {
    if (!this.state.loadingMore) return null;
    return (
      <View>
        <ActivityIndicator animating size="small" color="#777" />
      </View>
    );
  };

  getNotifAll = async () => {
    try {
      let response = await axios.get(
        `${CONFIG.BASE_URL}/api/notification-all`,
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      const data = response.data.data;
      // console.log('DATA TEST', data);
      this._isMounted &&
        this.setState({
          notifAllOrder: data.total_order,
          notifMessage: data.total_chat,
          notifAllComplaint: data.total_complaint,
          notifSubscribe: data.total_subscribe,
          notifBroadcast: data.total_broadcast,
          qty: data.total_cart,
        });
      // this.props.notifAct(data.data, 'notifAllComplaint');
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

  renderCountNotificationBadge = () => {
    const {
      notifMessage,
      notifSubscribe,
      notifAllOrder,
      notifAllComplaint,
      notifBroadcast,
    } = this.state;
    // fungsi menghitung order berdasarkan status
    try {
      let count = 0;
      let hasil = notifMessage;
      let hasil2 = notifSubscribe;
      let hasil3 = notifAllOrder;
      let hasil4 = notifAllComplaint;
      let hasil5 = notifBroadcast;
      count =
        count +
        parseInt(hasil) +
        parseInt(hasil2) +
        parseInt(hasil3) +
        parseInt(hasil4) +
        parseInt(hasil5);
      // console.log(count);
      if (count > 0) {
        return (
          <View style={styles.counter}>
            <Text style={styles.counterText}>{count > 100 ? "99+" : count}</Text>
          </View>
        );
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleRefresh = () => {
    this.setState(
      {
        refreshing: this.state.page < this.state.maxPage,
      },
      () => {
        this.getAllData();
      },
    );
  };

  getChatFirst = async () => {
    try {
      let response = await axios.get(`${CONFIG.BASE_URL}/api/chats`, {
        headers: {
          Authorization: `Bearer ${this.props.token}`,
        },
      });
      const data = response.data.data.data;
      // this._isMounted && this.setState({chat: data});
      // if ((data ?? 0).length && this._isMounted) {
      //   this.setIntervalTime = setInterval(() => {
      //     console.log('data====>', data);
      //     this.callback(data[0].chat_id);
      //   }, 5000);
      // }
      this.callback(data[0].chat_id);
      this.setState({chat: data});
      this.setIntervalTime = setInterval(() => {
        this.callback(data[0].chat_id);
      }, 5000);
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

  async callback(chatId) {
    try {
      let response = await axios.get(
        `${CONFIG.BASE_URL}/api/message/${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${this.props.token}`,
          },
        },
      );
      const data = response.data.data;
      data.map((item, i) => {
        data[i] = {
          _id: item.id,
          createdAt: moment(item.sended_at).format(),
          text: item.message,
          user: {
            _id: item.from_id,
            name: item.name,
          },
        };
      });
      console.log('messages', data);
      this.setState(prevState => ({
        messages: data.reverse(),
      }));
    } catch (error) {
      console.log('getMessage====>', error);
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
  }

  async onSend(messages = []) {
    // clearInterval(this.setIntervalTime);
    try {
      let response = await axios.post(
        `${CONFIG.BASE_URL}/api/message`,
        {
          message: messages[0].text,
        },
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      const data = response.data.data;
      this.setState(prevState => ({
        messages: GiftedChat.append(prevState.messages, messages),
      }));
      // clearInterval(this.setIntervalTime);
    } catch (error) {
      console.log(error);
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
  }

  getMenu = () => {
    this.props.navigation.navigate('Profile');
  };

  postRecent = async item => {
    console.log(JSON.stringify(item));
    try {
      let response = await axios.post(
        `${CONFIG.BASE_URL}/api/recent/products`,
        {
          product_id: item.id,
        },
        {
          headers: {Authorization: `Bearer ${this.props.token}`},
        },
      );
      // let data = response.data.data.data;
      // const dataTotal = response.data.data.total;
      console.log(response);
    } catch (error) {
      console.log('5');
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
    const {qty, refreshing, search, chat} = this.state;
    return (
      <View style={{backgroundColor: '#F4F4F4', flex: 1}}>
        <View style={styles.container2}>
          <Logo
            onPress={() => this.props.navigation.navigate('Home')}
            width={wp('12%')}
            height={hp('7%')}
            marginLeft={wp('4%')}
          />
          <Text
            style={{
              fontSize: hp('1.4%'),
              fontFamily: 'Lato-Medium',
              color: 'grey',
            }}>
            {'Terakhir dilihat :'}
            {moment(chat[0]?.last_login).fromNow()}
          </Text>
          <View style={styles.iconKanan}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('Notification', {initial: false})
              }>
              <IconNotif width={wp('5%')} height={hp('5%')} />
              {this.renderCountNotificationBadge()}
            </TouchableOpacity>
            <TouchableOpacity
              style={{Position: 'relative'}}
              onPress={() => this.props.navigation.navigate('Keranjang')}>
              <IconShopping width={wp('5.5%')} height={hp('5.5%')} />
              {qty > 0 ? (
                <View style={styles.counter}>
                  <Text style={styles.counterText}>{qty}</Text>
                </View>
              ) : null}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menu}
              onPress={() => this.getMenu()}>
              <IconMenu
                width={wp('5.5%')}
                height={hp('5.5%')}
                marginRight={wp('2%')}
              />
            </TouchableOpacity>
          </View>
        </View>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: this.props.dataUser.id,
            name: this.props.dataUser.name,
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          }}
          placeholder="Silahkan Ketik Chat Disini..."
          placeholderTextColor="#A4A4A4"
          renderBubble={this.renderBubble}
          renderSend={this.renderSend}
          renderInputToolbar={this.renderInputToolbar}
          scrollToBottomComponent={this.scrollToBottomComponent}
          renderComposer={this.renderComposer}
          alwaysShowSend
          scrollToBottom
          alignTop
          isCustomViewBottom
          bottomOffset={30}
          messagesContainerStyle={{paddingBottom: hp('5%')}}
        />
      </View>
    );
  }

  componentDidMount() {
    this._isMounted = true;
    this.getChatFirst();
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.getNotifAll();
    });
  }

  componentWillUnmount() {
    // rol();
    this._isMounted = false;
    clearInterval(this.setIntervalTime);
    // this.getChatFirst();
    // this.focusListener();
  }

  scrollToBottomComponent = () => {
    return (
      <Image
        source={require('../assets/images/ArrowDown.png')}
        style={{height: hp('5%'), width: hp('5%')}}
        color="#333"
      />
    );
  };

  renderInputToolbar = props => (
    <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: '#FFFFFF',
        // paddingTop: hp('2%'0),
        // marginRight: wp('5%'),
        // marginLeft: wp('5%'),
        marginBottom: hp('2%'),
        // borderRadius: hp('2%'),
      }}
      primaryStyle={{alignItems: 'center'}}
    />
  );

  renderComposer = props => (
    <Composer
      {...props}
      textInputStyle={{
        color: 'black',
        fontFamily: 'Lato-Medium',
        fontSize: hp('2%'),
        backgroundColor: 'white',
        borderWidth: 1,
        marginTop: hp('2%'),
        borderColor: '#E8E8E8',
        justifyContent: 'center',
        paddingLeft: wp('5%'),
        marginLeft: wp('5%'),
        marginRight: wp('8%'),
        borderRadius: hp('2%'),
      }}
    />
  );

  renderSend = props => {
    const {text, onSend} = props;
    return (
      <TouchableOpacity
        onPress={() => {
          if (text && onSend) {
            onSend({text: text.trim()}, true);
          }
        }}
        style={{
          backgroundColor: '#529F45',
          height: hp('6%'),
          width: wp('13%'),
          borderRadius: hp('3%'),
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: wp('5%'),
          marginTop: hp('2%'),
          // position: 'absolute',
          // top: hp('0%'),
          // right: wp('0%')
        }}>
        <IconSend
          width={wp('5%')}
          height={hp('5%')}
          style={{
            marginRight: wp('0%'),
            marginBottom: hp('0%'),
          }}
        />
      </TouchableOpacity>
    );
  };

  renderBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#5CC443',
            alignItems: 'center',
            marginRight: wp('2%'),
          },
          left: {
            backgroundColor: '#FFFFFF',
            alignItems: 'center',
            marginLeft: wp('2%'),
          },
        }}
        textStyle={{
          right: {
            color: '#FFFFFF',
            fontSize: hp('1.8%'),
            fontFamily: 'Lato-Medium',
          },
          left: {
            color: '#575251',
            fontSize: hp('1.8%'),
            fontFamily: 'Lato-Medium',
          },
        }}
      />
    );
  };
}

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
  dataUser: state.LoginReducer.dataUser,
  chat: state.LoginReducer.chat,
});

const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Chat);

const styles = StyleSheet.create({
  // Header
  container2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp('100%'),
    height: hp('8%'),
    backgroundColor: 'white',
    borderBottomWidth: 4,
    borderColor: '#E8E8E8',
  },
  searchSection: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  inputStyle: {
    // flex: 1,
    borderWidth: 2,
    fontFamily: 'Lato-Medium',
    fontSize: hp('1.8%'),
    color: '#000000',
    width: wp('50%'),
    height: hp('5.5%'),
    marginLeft: wp('1%'),
    paddingLeft: wp('5%'),
    paddingRight: wp('10%'),
    borderRadius: hp('1.5%'),
    borderColor: '#DCDCDC',
  },
  search: {
    position: 'absolute',
    top: hp('0%'),
    right: wp('5%'),
  },
  iconKanan: {
    flexDirection: 'row',
    width: wp('25%'),
    justifyContent: 'space-between',
  },
  counter: {
    position: 'absolute',
    right: wp('-2.7%'),
    bottom: hp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#529F45',
    width: hp('2.5%'),
    height: hp('2.5%'),
    borderRadius: hp('2.5%'),
  },
  counterText: {
    textAlign: 'center',
    color: 'white',
    fontSize: hp('1.3%'),
    fontFamily: 'Lato-Bold',
  },
  menu: {
    marginRight: wp('2%'),
    // marginLeft: wp('4%'),
  },
});
