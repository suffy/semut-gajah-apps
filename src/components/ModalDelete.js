{
    /*
    
    import ModalDelete from '../components/ModalDelete';
    
    alertDelete: '',
    tambahanDelete: '',
    modalDelete: false,
  
    alertDelete: '',
    tambahanDelete: '',
    buttonDeleteCancel: '',
    buttonDelete: '',
    modalDelete: false,
  
    getCloseModalDelete = async e => {
      this.setState({modalDelete: !this.state.modalDelete});
      if (!e) {
        
      }
    };
  
    <ModalDelete
      modalDelete={this.state.modalDelete}
      tambahanDelete={this.state.tambahanDelete}
      alertDelete={this.state.alertDelete}
      getCloseModalDelete={(e) => this.getCloseModalDelete(e)}
    />
  
    <ModalDelete
      modalDelete={this.state.modalDelete}
      tambahanDelete={this.state.tambahanDelete}
      alertDelete={this.state.alertDelete}
      buttonDeleteCancel={this.state.buttonDeleteCancel}
      buttonDelete={this.state.buttonDelete}
      getCloseModalDelete={(e) => this.getCloseModalDelete(e)}
    />
    
    this.setState({
      alertDelete: ,
      modalDelete: !this.state.modalDelete,
    });
    
    this.setState({
      alertDelete: ,
      tambahanDelete: ,
      modalDelete: !this.state.modalDelete,
    });
  
    this.setState({
      alertDelete: ,
      tambahanDelete: ,
      buttonDeleteCancel: ,
      buttonDelete: ,
      modalDelete: !this.state.modalDelete,
    });
    
    */
  }
  import React, {Component} from 'react';
  import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
  import Modal from 'react-native-modal';
  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as lor,
    removeOrientationListener as rol,
  } from 'react-native-responsive-screen';
  
  class ModalDelete extends Component {
    constructor(props) {
      super(props);
      if (Text.defaultProps == null) Text.defaultProps = {};
      Text.defaultProps.allowFontScaling = false;
    }
  
    render() {
      const {
        modalDelete,
        alertDelete,
        getCloseModalDelete,
        tambahanDelete,
        buttonDeleteCancel,
        buttonDelete,
      } = this.props;
      return (
        <Modal
          isVisible={modalDelete}
          deviceWidth={wp('100%')}
          // deviceHeight={wp('155%')}
          swipeDirection={['up', 'left', 'right', 'down']}
          onBackdropPress={e => getCloseModalDelete(e)}
          // onSwipeComplete={() => getCloseModalDelete()}
          style={
            tambahanDelete
              ? {
                  flex: 1,
                  justifyContent: 'center',
                  marginTop: hp('75%'),
                  marginHorizontal: wp('2%'),
                  backgroundColor: '#fff',
                  borderRadius: wp('1%'),
                  padding: 10,
                }
              : {
                  flex: 1,
                  justifyContent: 'center',
                  marginTop: hp('75%'),
                  marginHorizontal: wp('2%'),
                  backgroundColor: '#fff',
                  borderRadius: wp('1%'),
                  padding: 10,
                }
          }>
          <View style={styles.posisiJudul}>
            <Text style={styles.textJudul}>{'Pemberitahuan :'}</Text>
          </View>
          {tambahanDelete ? (
            <View style={styles.posisiTambahan}>
              <Text style={styles.textTambahan}>{tambahanDelete}</Text>
            </View>
          ) : null}
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View style={{alignSelf: 'center', marginHorizontal: wp('2.5%')}}>
              <Text style={styles.text}>{alertDelete}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '70%',
              }}>
              {buttonDeleteCancel ? (
                <TouchableOpacity
                  style={styles.buttonBatal}
                  onPress={e => getCloseModalDelete((e = 'cancel'))}>
                  <Text style={styles.textBatal}>{buttonDeleteCancel}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.buttonBatal}
                  onPress={e => getCloseModalDelete((e = 'cancel'))}>
                  <Text style={styles.textBatal}>{'Batal'}</Text>
                </TouchableOpacity>
              )}
              {buttonDelete ? (
                <TouchableOpacity
                  style={styles.buttonOK}
                  onPress={() => getCloseModalDelete()}>
                  <Text style={styles.textOK}>{buttonDelete}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.buttonOK}
                  onPress={() => getCloseModalDelete()}>
                  <Text style={styles.textOK}>{'OK'}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
      );
    }
  }
  
  const styles = StyleSheet.create({
    posisiJudul: {
      marginLeft: wp('3%'),
    },
    textJudul: {
      fontSize: hp('2.2%'),
      fontFamily: 'Lato-Regular',
      color: '#000',
    },
    posisiTambahan: {
      marginLeft: wp('3%'),
    },
    textTambahan: {
      fontSize: hp('2.2%'),
      fontFamily: 'Lato-Regular',
      color: '#529F45',
    },
    buttonOK: {
      backgroundColor: '#529F45',
      width: wp('40%'),
      borderRadius: wp('2%'),
      alignItems: 'center',
      marginVertical: wp('2%'),
      paddingVertical: wp('2%'),
      marginLeft: wp('3%'),
    },
    textOK: {
      fontSize: hp('1.8%'),
      fontFamily: 'Lato-Regular',
      textAlign: 'justify',
      color: '#fff',
    },
    buttonBatal: {
      backgroundColor: '#fff',
      borderColor: '#E07126',
      borderWidth: 1,
      width: wp('20%'),
      borderRadius: wp('2%'),
      alignItems: 'center',
      marginVertical: wp('2%'),
      paddingVertical: wp('2%'),
    },
    textBatal: {
      fontSize: hp('1.8%'),
      fontFamily: 'Lato-Regular',
      textAlign: 'justify',
      color: '#E07126',
    },
  });
  
  export default ModalDelete;
  