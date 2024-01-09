import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  PixelRatio,
} from 'react-native';

const {width, height} = Dimensions.get('window');

const Fontresponsive = (size, multiplier = 2) => {
  const scale = (width / height) * multiplier;

  const newSize = size * scale;

  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export default Fontresponsive

const styles = StyleSheet.create({})
