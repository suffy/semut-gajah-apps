import React, { useEffect } from 'react';
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import TabItem from '../components/TabItem';

const BottomNavigator = ({state, descriptors, navigation}) => {
  // console.log('state======',state)
  // console.log('descriptors======', descriptors)
  // console.log('navigation======', navigation)
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  // useEffect(() => {
  //   // effect
  //   return () => {
  //     this.props.navigation.reset({
  //       index: 0,
  //       routes: [{ name: 'Produk' }],
  //     });
  //   }
  // }, [])

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name,{screen : route.name});
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TabItem
            key={index}
            label={label}
            isFocused={isFocused}
            onLongPress={onLongPress}
            onPress={onPress}
            backBehaviour = "initialRoute"
          />
        );
      })}
    </View>
  );
};

export default BottomNavigator;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    paddingRight: wp('19%'),
    paddingLeft: wp('0%'),
    // paddingBottom: hp('11.5%'),
    height:hp('8%'),
    paddingTop: hp('3.5%'),  
    // backgroundColor:'red',
    borderTopWidth: 4,
    borderColor: '#ddd'
  },
});
