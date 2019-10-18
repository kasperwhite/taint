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
        backgroundColor: '#193367',
        alignContent: 'center'
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerLeft: (
        <Button
          icon={
            <Icon
              name='bars'
              type='font-awesome'
              color='#fff'
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