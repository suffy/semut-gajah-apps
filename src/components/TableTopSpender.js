import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {Component} from 'react';
import moment from 'moment';
import {connect} from 'react-redux';
import IconBack from '../assets/icons/backArrow.svg';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {DataTable} from 'react-native-paper';
import NumberFormat from 'react-number-format';

let idLocale = require('moment/locale/id');
moment.updateLocale('id', idLocale);

function LoadingApi() {
  return (
    <View style={styles.loadingApi}>
      <ActivityIndicator animating size="small" color="#529F45" />
    </View>
  );
}

export class TableTopSpender extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
  }
  render() {
    const {modalVisible,  notes, alertData, modalAlert, order, array} = this.props
    // console.log("table top spender "+ array)
    return (
      <View style={styles.container}>
        <View style={styles.tableCard}>
          <View style={styles.tabel}>
            <View style={styles.colPeringkat}>
              <Text style={styles.colTitle}>Peringkat</Text>
            </View>
            <View style={styles.colPeringkat}>
              <Text style={styles.colTitle}>Reward</Text>
            </View>
          </View>
          {array 
            ? array?.map((item, index) => (
                <View key={index} style={styles.tabel}>
                  <View
                    style={
                      index % 2 === 0
                        ? styles.colPeringkatActive
                        : styles.colPeringkatContent
                    }>
                    <Text style={styles.textContentTable}>
                      {'Peringkat '}
                      {index + 1}
                    </Text>
                  </View>
                  <View
                    style={
                      index % 2 === 0
                        ? styles.colPeringkatActive
                        : styles.colPeringkatContent
                    }>
                   
                        <Text style={styles.textContentTable}>
                          {item.nominal || "-"}
                        </Text>
                      
                  </View>
                </View>
              ))
            : null}
        </View>
      </View>
    );
  }
}

export default TableTopSpender;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    minHeight: heightPercentageToDP('23%'),
    alignItems: 'center',
    width: '100%',
  },
  textJudul: {
    fontSize: heightPercentageToDP('2.5%'),
  },
  tableCard: {
    width: '100%',
    flex: 1,
    padding: '3%',
  },
  tabel: {
    flexDirection: 'row',
    width: '100%',
    flex: 1,
  },
  colTitle: {
    color: '#FFFFFF',
    fontSize: heightPercentageToDP('2%'),
  },
  colPeringkat: {
    flex: 1,
    alignItems: 'center',
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    backgroundColor: '#529F45',
  },
  colNama: {
    flex: 3,
    alignItems: 'center',
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    backgroundColor: '#529F45',
  },
  colPeringkatContent: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: '1.5%',
    justifyContent: 'center',
    borderColor: '#FFFFFF',
    backgroundColor: '#E8E8E8',
  },
  colPeringkatActive: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: '1.5%',
    justifyContent: 'center',
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
  },
  colNamaContent: {
    flex: 3,
    alignItems: 'center',
    paddingVertical: '1.5%',
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    borderColor: '#FFFFFF',
  },
  colNamaContentActive: {
    flex: 3,
    alignItems: 'center',
    paddingVertical: '1.5%',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    borderColor: '#FFFFFF',
  },
  textContentTable: {
    color: '#7d7d7d',
    fontSize: heightPercentageToDP('1.8%'),
  },
});
