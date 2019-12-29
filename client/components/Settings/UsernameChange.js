import React, { Component } from 'react';
import { Text } from 'react-native';
import { inject, observer } from 'mobx-react';

class UsernameChange extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      newUsername: ''
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Change username',
      headerStyle: {
        backgroundColor: '#222222',
        alignContent: 'center'
      },
      headerTintColor: '#09C709',
      headerTitleStyle: {
        fontWeight: 'bold',
      }
    };
  };

  render() {
    return(
      <Text>Change username</Text>
    )
  }
}

export default inject('settingsStore')(observer(UsernameChange));