import React, {Component} from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';
import IconCheck from '../assets/newIcons/iconChecked.svg';
import IconChecked from '../assets/newIcons/iconCheckedActive.svg';
import IconPlus from '../assets/newIcons/PlusWhite.svg';
import IconMinus from '../assets/newIcons/MinusWhite.svg';
import IconTrash from '../assets/newIcons/iconHapus.svg';
import IconInfo from '../assets/icons/Info.svg';
import NumberFormat from 'react-number-format';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import CONFIG from '../constants/config';
import IconClose from '../assets/icons/Closemodal.svg';
import {Card} from 'react-native-elements/dist/card/Card';
import Tooltip from 'react-native-walkthrough-tooltip';
import DummyImage from '../assets/icons/IconLogo.svg';

export class ListKeranjang extends Component {
  constructor(props) {
    super(props);
    this.state = {
      indexTips: 0,
    };
  }
  render() {
    const {
      data,
      dataUser,
      selectAll,
      quantityHandler,
      selectHandler,
      deleteHandler,
      getQuantity,
      notesHandler,
      visibleButton,
      getPromo,
      description,
      getCloseDescription,
    } = this.props;
    return (
      <View style={styles.listKeranjang}>
        {data?.map((item, index) => (
          <View key={index}>
            <View
              style={[
                styles.containerItemKeranjang,
                index % 2 == 0
                  ? {backgroundColor: '#F4F4F4'}
                  : {backgroundColor: '#FFFFFF'},
              ]}>
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: hp('1.5%'),
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={[styles.posision, {marginLeft: wp('5%')}]}>
                  <TouchableOpacity
                    style={
                      ([styles.posision],
                      {
                        width: wp('6%'),
                        height: wp('6%'),
                        padding: wp('0%'),
                      })
                    }
                    onPress={() => selectHandler(index, item.checked)}>
                    {selectAll == true || item.checked == 1 ? (
                      <IconChecked
                        width={wp('7%')}
                        height={wp('7%')}
                        label="checked"
                      />
                    ) : (
                      <IconCheck
                        width={wp('7%')}
                        height={wp('7%')}
                        borderWidth={1}
                        label="check"
                      />
                    )}
                  </TouchableOpacity>
                </View>
                <View style={styles.backgroundImage}>
                  {item.image ? (
                    <Image
                      source={{
                        uri: CONFIG.BASE_URL + item.image,
                      }}
                      style={[
                        styles.posision,
                        {
                          height: wp('20%'),
                          width: wp('20%'),
                        },
                      ]}
                    />
                  ) : (
                    <DummyImage
                      style={[
                        styles.posision,
                        {
                          height: wp('20%'),
                          width: wp('20%'),
                        },
                      ]}
                    />
                  )}
                </View>
                <View
                  style={{
                    flex: 1,
                    paddingHorizontal: 10,
                    paddingTop: 10,
                  }}>
                  <Text
                    numberOfLines={2}
                    multiline
                    style={{
                      fontSize: hp('1.6%'),
                      textAlign: 'left',
                      fontFamily: 'Lato-Medium',
                      color:'#575251'
                    }}>
                    {item.name}
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    {dataUser.class === 'GROSIR' && item.brand_id === '001' && (
                      <Text
                        numberOfLines={2}
                        multiline
                        style={{
                          fontSize: hp('1.6%'),
                          textAlign: 'left',
                          fontFamily: 'Lato-Medium',
                          color: '#E02626',
                          marginRight: wp('1%'),
                        }}>
                        (Deltomed)
                      </Text>
                    )}
                    {dataUser.class === 'SEMI GROSIR' &&
                      item.brand_id === '001' && (
                        <Text
                          numberOfLines={2}
                          multiline
                          style={{
                            fontSize: hp('1.6%'),
                            textAlign: 'left',
                            fontFamily: 'Lato-Medium',
                            color: '#E02626',
                            marginRight: wp('1%'),
                          }}>
                          (Deltomed)
                        </Text>
                      )}
                    {dataUser.class === 'STAR OUTLET' &&
                      item.brand_id === '001' && (
                        <Text
                          numberOfLines={2}
                          multiline
                          style={{
                            fontSize: hp('1.6%'),
                            textAlign: 'left',
                            fontFamily: 'Lato-Medium',
                            color: '#E02626',
                            marginRight: wp('1%'),
                          }}>
                          (Deltomed)
                        </Text>
                      )}
                    {item.half ? (
                      <Text
                        numberOfLines={2}
                        multiline
                        style={{
                          fontSize: hp('1.6%'),
                          fontFamily: 'Lato-Medium',
                          color: '#17a2b8',
                        }}>
                        {'( '}
                        {item.qty_konversi}{' '}
                        {item.data_product.kecil.charAt(0) +
                          item.data_product.kecil.slice(1).toLowerCase()}
                        {' )'}
                      </Text>
                    ) : null}
                  </View>
                  <NumberFormat
                    value={Math.round(item.total_price)}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'Rp '}
                    // decimalScale={2}
                    fixedDecimalScale={true}
                    renderText={value => (
                      <Text style={styles.textHarga}>{value}</Text>
                    )}
                  />
                  <View style={{flexDirection: 'row'}}>
                    {visibleButton ? (
                      <TouchableOpacity
                        style={[styles.posision, {paddingRight: 10}]}
                        onPress={() => deleteHandler(item)}>
                        <IconTrash width={wp('6%')} height={hp('4%')} />
                      </TouchableOpacity>
                    ) : (
                      <TouchableHighlight
                        style={[styles.posision, {paddingRight: 10}]}>
                        <IconTrash width={wp('6%')} height={hp('4%')} />
                      </TouchableHighlight>
                    )}
                    {visibleButton ? (
                      <TouchableOpacity
                        onPress={() => quantityHandler('less', index)}
                        style={styles.iconminus}>
                        <IconMinus />
                      </TouchableOpacity>
                    ) : (
                      <TouchableHighlight style={styles.iconminus}>
                        <IconMinus />
                      </TouchableHighlight>
                    )}
                    {visibleButton ? (
                      <TextInput
                        onEndEditing={ev => getQuantity(ev, index)}
                        style={{
                          // borderWidth: 1,
                          // borderColor: '#cccccc',
                          // paddingHorizontal: hp('1%'),
                          color: '#575251',
                          fontFamily: 'Lato-Regular',
                          fontSize: hp('2%'),
                          textAlign: 'center',
                          paddingTop: 1,
                          paddingBottom: 2.5,
                          height: hp('3.5%'),
                          width: wp('14%'),
                          backgroundColor: '#FFF',
                        }}>
                        {item.qty}
                      </TextInput>
                    ) : (
                      <Text
                        onEndEditing={ev => getQuantity(ev, index)}
                        style={{
                          // borderWidth: 1,
                          // borderColor: '#cccccc',
                          // paddingHorizontal: hp('1%'),
                          color: '#575251',
                          fontFamily: 'Lato-Regular',
                          fontSize: hp('2%'),
                          textAlign: 'center',
                          paddingTop: 1,
                          paddingBottom: 2.5,
                          height: hp('3.5%'),
                          width: wp('14%'),
                          backgroundColor: '#FFF',

                        }}>
                        {item.qty}
                      </Text>
                    )}
                    {visibleButton ? (
                      <TouchableOpacity
                        onPress={() => quantityHandler('more', index)}
                        style={styles.iconplus}>
                        <IconPlus />
                      </TouchableOpacity>
                    ) : (
                      <TouchableHighlight style={styles.iconplus}>
                        <IconPlus />
                      </TouchableHighlight>
                    )}
                  </View>
                  {item.data_product?.promo_sku?.length > 0 && (
                    <View
                      style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                      <View style={{height: wp('7%'), width: wp('45%')}}>
                        <Text
                          numberOfLines={2}
                          style={{
                            fontSize: hp('1.5%'),
                            fontFamily: 'Lato-Regular',
                            color: '#17a2b8',
                          }}>
                          {'( '}
                          {item.data_product?.promo_sku[0]?.title}
                          {' )'}
                        </Text>
                      </View>
                      {description?.sku?.map((val, i) => {
                        if (
                          item.data_product?.promo_sku[0]?.product_id ==
                            val.product_id &&
                          this.state.indexTips == index
                        ) {
                          {
                            console.log(
                              'item nh====-00000-00--',
                              JSON.stringify(description),
                            );
                          }
                          {
                            console.log(
                              'item nh====-item--',
                              JSON.stringify(item),
                            );
                          }
                          return (
                            <Tooltip
                              key={i}
                              contentStyle={{
                                backgroundColor: '#f6f6f6',
                                width: wp('80%'),
                                borderRadius: wp('2%'),
                                alignSelf: 'flex-end',
                              }}
                              isVisible={description != '' ? true : false}
                              placement="bottom"
                              onClose={() => getCloseDescription()}
                              content={
                                <>
                                  <Text
                                    style={{
                                      fontSize: hp('1.5%'),
                                      color: '#666',
                                      fontFamily: 'Lato-Medium',
                                      marginLeft: wp('1%'),
                                      width: wp('65%'),
                                    }}>
                                    {description.description}
                                  </Text>
                                  <IconClose
                                    fill={'#666'}
                                    width={wp('3%')}
                                    height={hp('2%')}
                                    style={{
                                      position: 'absolute',
                                      right: wp('2%'),
                                      top: hp('0.8%'),
                                    }}
                                    onPress={() => getCloseDescription()}
                                  />
                                </>
                              }>
                              <IconInfo
                                onPress={() =>
                                  getPromo(
                                    item.data_product?.promo_sku[0]?.promo_id,
                                    item.data_product.id,
                                  )
                                }
                                width={wp('7%')}
                                height={wp('7%')}
                              />
                            </Tooltip>
                          );
                        }
                      })}
                      {!description && (
                        <IconInfo
                          onPress={() =>
                            this.setState({indexTips: index}, () =>
                              getPromo(
                                item.data_product?.promo_sku[0]?.promo_id,
                                item.data_product.id,
                              ),
                            )
                          }
                          width={wp('7%')}
                          height={wp('7%')}
                        />
                      )}
                    </View>
                  )}
                </View>
              </View>
              <TextInput
                autoCapitalize="none"
                style={{
                  fontSize: hp('1.6%'),
                  fontFamily: 'Lato-Medium',
                  // padding: 0,
                  paddingVertical: 1,
                  marginLeft: wp('14%'),
                  // backgroundColor: '#FFF',
                  color: '#575251',
                  marginBottom: wp('2.5%'),
                  marginTop: wp('-1%'),
                  width: wp('75%'),
                  // borderWidth: 1,
                  // borderColor: '#DCDCDC',
                  paddingLeft: wp('4%'),
                  borderRadius: 10,
                  fontWeight:'600',
                }}
                onEndEditing={ev => notesHandler(ev, index)}
                placeholder="Tulis catatan untuk barang Ini"
                placeholderTextColor="#A4A4A4">
                {item.notes}
              </TextInput>
            </View>
          </View>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listKeranjang: {
    // marginBottom: hp('2%'),
    // paddingHorizontal: wp('2%'),
    marginTop: hp('1%'),
  },
  containerItemKeranjang: {
    // flex:1,
    flexDirection: 'column',
    // marginBottom: hp('1%'),
    // backgroundColor: '#F9F9F9',
    // borderColor: '#ddd',
    // borderWidth: 1,
    // borderRadius: hp('1.5%'),
    // elevation: 2,
  },
  posision: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconplus: {
    // borderWidth: 1,
    // borderColor: '#cccccc',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5CC443',
    borderTopRightRadius: hp('1.7%'),
    borderBottomRightRadius: hp('1.7%'),
    width: wp('6.5%'),
    height: hp('3.5%'),
    marginLeft: wp('-0.5%'),
  },
  iconminus: {
    // borderWidth: 1,
    // borderColor: '#5CC443',
    backgroundColor: '#5CC443',
    borderTopLeftRadius: hp('1.7%'),
    borderBottomLeftRadius: hp('1.7%'),
    width: wp('6.5%'),
    height: hp('3.5%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('-0.2%'),
  },
  textHarga: {
    color: '#575251',
    fontSize: hp('1.6%'),
    fontFamily: 'Lato-Medium',
    // marginTop: hp('2%'),
    marginBottom: hp('1%'),
    fontWeight:'bold',

  },
  container2: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: hp('7%'),
    backgroundColor: 'white',
  },
  backgroundImage: {
    backgroundColor: '#FFF',
    padding: hp('2%'),
    marginTop: hp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp('3%'),
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    elevation: 3,
  },
});

export default ListKeranjang;
