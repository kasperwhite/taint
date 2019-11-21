import React from 'react';
import { View, ActivityIndicator } from 'react-native';

export default Loading = (props) => (
  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator color="#09C709" size={props.size}/>
  </View>
);