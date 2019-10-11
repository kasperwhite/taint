import React, { Component } from 'react';
import { Text } from 'react-native';

class Room extends Component {
  constructor(props){
    super(props)

    this.state = {}
  }

  static navigationOptions = {
    title: 'Room',
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

  render(){
    return(<Text>It is {this.props.navigation.getParam('roomId','')} chat</Text>)
  }
}

export default Room;