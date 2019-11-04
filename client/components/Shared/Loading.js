import React from 'react';
import { View, ActivityIndicator } from 'react-native';

export default Loading = () => (
  <View style={{
    height: '100%', 
    lexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#151516'
  }}>
    <ActivityIndicator color="#09C709" size='large'/>
  </View>
);