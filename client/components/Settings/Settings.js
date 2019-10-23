import React, { Component } from 'react';
import { Text } from 'react-native';
import { Button, Icon } from 'react-native-elements';

class Settings extends Component {
  constructor(props){
    super(props)

    this.state = {

    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Settings',
      headerStyle: {
        backgroundColor: '#222222',
        alignContent: 'center'
      },
      headerTintColor: '#09C709',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerLeft: (
        <Button
          icon={
            <Icon
              name='bars'
              type='font-awesome'
              color='#09C709'
              size={21}
            />
          }
          containerStyle={{marginLeft: 5}}
          onPress={navigation.openDrawer}
          type='clear'
        />
      )
    };
  };

  render(){
    return(
      <Text>Settings</Text>
    )
  }
}

export default Settings;