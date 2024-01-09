import React, {Component} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import CONFIG from '../constants/config';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import IconChat from '../assets/icons/ChatThumbnail.svg';
import DummyImage from '../assets/icons/IconLogo.svg';

const width = Dimensions.get('window').width;
const height = width * 0.77;

export class ProductsImages extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      image: this.props.image,
    };
  }

  UNSAFE_componentWillMount() {
    // lor(this);
  }

  componentWillUnmount() {
    // rol()
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.positionProduct}>
          {this.state.image != null && (
            <React.Fragment>
              <Image
                source={
                  this.state.image
                    ? {uri: CONFIG.BASE_URL + this.state.image}
                    : null
                }
                style={styles.product}
              />
            </React.Fragment>
          )}
          {this.state.image == null ||
            (this.state.image == '' && (
              <React.Fragment>
                <DummyImage style={styles.product2} />
              </React.Fragment>
            ))}
        </View>
        {/* <View style={styles.positionChat}>
          <TouchableOpacity
            style={{
              backgroundColor: '#529F45',
              width: 45,
              height: 35,
              borderTopLeftRadius: hp('1%'),
              borderBottomLeftRadius: hp('1%'),
              justifyContent: 'center',
            }}
            onPress={() => this.props.navigation.navigate('Chat')}>
            <IconChat fill="white" style={styles.imageChat} />
          </TouchableOpacity>
        </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    width,
    height,
    backgroundColor: '#fff',
  },
  product: {
    resizeMode: 'contain',
    width,
    height,
    flex: 1,
    flexDirection: 'column',
  },
  product2: {
    resizeMode: 'contain',
    width,
    height: wp('100%'),
    marginTop: wp('-100%'),
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FBB0B0',
  },
  positionProduct: {
    position: 'absolute',
  },
  positionChat: {
    position: 'absolute',
    alignSelf: 'flex-end',
    marginTop: height / 1.2,
    flex: 1,
  },
  buttonChat: {
    backgroundColor: '#529F45',
    width: 45,
    height: 35,
    borderTopLeftRadius: hp('1%'),
    borderBottomLeftRadius: hp('1%'),
    justifyContent: 'center',
  },
  imageChat: {
    alignSelf: 'center',
    // marginTop: 5,
  },
});

const mapStateToProps = state => ({
  token: state.LoginReducer.token,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ProductsImages);
