import React from 'react';
import {useWindowDimensions} from 'react-native';
import RenderHtml from 'react-native-render-html';

export default function TextHtml(props) {
  const {width} = useWindowDimensions();
  return (
    <RenderHtml
      contentWidth={width}
      source={{html: props.html}}
      baseStyle={props.style}
    />
  );
}
