import React, {useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Share,
} from 'react-native';
import axios from 'axios';
import CONFIG from '../constants/config';
import {connect} from 'react-redux';
import QRCode from 'react-native-qrcode-svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Storage from '@react-native-async-storage/async-storage';
import IconBack from '../assets/newIcons/iconBack.svg';
import Snackbar from 'react-native-snackbar';
import Header from '../components/Header';

const Barcode = props => {
  const [inputText, setInputText] = useState('');
  const [qrvalue, setQrvalue] = useState('');
  let myQRCode = useRef();

  const shareQRCode = () => {
    myQRCode.toDataURL(dataURL => {
      console.log(dataURL);
      let shareImageBase64 = {
        title: 'React Native',
        url: `data:image/png;base64,${dataURL}`,
        subject: 'Share Link', //  for email
      };
      Share.share(shareImageBase64).catch(error => console.log(error));
    });
  };

  useEffect(() => {
    getQR();

    return () => {};
  }, []);

  async function getQR() {
    try {
      let response = await axios.get(`${CONFIG.BASE_URL}/api/qrcode`, {
        headers: {Authorization: `Bearer ${props.token}`},
      });
      console.log(response.data);
      const data = response.data;
      if (data !== '' && data['success'] == true) {
        setQrvalue(data.data);
        console.log('DATA QR', data.data);
      } else {
        console.log('', typeof data);
        return false;
      }
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
        'Cek Error===========getVersion=============',
        JSON.parse(JSON.stringify(error)).message,
      );
      if (error429) {
        showSnackbarBusy();
      } else if (errorNetwork) {
        showSnackbarInet();
      } else if (error400) {
        Storage.removeItem('token');
        this.props.navigation.navigate('Home');
      }
    }
  }

  function showSnackbarBusy() {
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
          getQR;
        },
      },
    });
  }

  function showSnackbarInet() {
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
          getQR;
        },
      },
    });
  }
  function funBack(){
    this.props.navigation.goBack()
  }
  // getQRcode = () => {
  //   axios
  //     .get(`${CONFIG.BASE_URL}/api/qrcode`, {
  //       headers: {Authorization: `Bearer ${this.props.token}`},
  //     })
  //     .then(response => {
  //       // console.log(response)
  //       const data = response.data;
  //       if (data !== '' && data['success'] == true) {
  //         setQrvalue(data);
  //         console.log('DATA QR', data)
  //       } else {
  //         console.log('', typeof data);
  //         return false;
  //       }
  //     })
  //     .catch(err => {
  //       console.log(err.response);
  //     });
  // }

  return (
    <SafeAreaView style={{flex: 1}}>
      <Header 
         title="Kode Barcode"
      navigation={this.props.navigation}
         notif={false}
         notifCount={0}
         cart={false}
         cartCount={0}
        />
      <View style={styles.container2}>
        <QRCode
          getRef={ref => (myQRCode = ref)}
          // ref={myQRCode}
          //QR code value
          value={qrvalue ? qrvalue : 'NA'}
          //size of QR Code
          size={250}
          //Color of the QR Code (Optional)
          color="#529F45"
          //Background Color of the QR Code (Optional)
          backgroundColor="white"
          //Center Logo size  (Optional)
          logoSize={30}
          //Center Logo margin (Optional)
          logoMargin={2}
          //Center Logo radius (Optional)
          logoBorderRadius={15}
          //Center Logo background (Optional)
          logoBackgroundColor="yellow"
        />
        {/* <Text style={styles.textStyle}>
          Please insert any value to generate QR code
        </Text>
         <TextInput
            autoCapitalize = 'none'
          style={styles.textInputStyle}
          onChangeText={inputText => setInputText(inputText)}
          placeholder="Enter Any Value"
          placeholderTextColor="#A4A4A4"
          value={inputText}
        />
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => setQrvalue(inputText)}>
          <Text style={styles.buttonTextStyle}>Generate QR Code</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonStyle} onPress={shareQRCode}>
          <Text style={styles.buttonTextStyle}>Share QR Code</Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Barcode);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: wp('3%'),
  },
  containerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: hp('8%'),
    backgroundColor: 'white',
    borderBottomWidth: 4,
    borderColor: '#ddd',
    // marginBottom: wp('3%'),
  },
  text: {
    color: '#575251',
    fontFamily: 'Lato-Medium',
    fontSize: hp('2.3%'),
    paddingLeft: wp('1.5%'),
    fontWeight: 'bold',
  },
  container2: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: 10,
  },
  titleStyle: {
    fontSize: hp('1.6%'),
    fontFamily: 'Lato-Medium',
    textAlign: 'center',
    margin: 10,
  },
  textStyle: {
    textAlign: 'center',
    margin: 10,
  },
  textInputStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: '#51D8C7',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#51D8C7',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 30,
    padding: 10,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: hp('1.6%'),
    fontFamily: 'Lato-Medium',
  },
});
