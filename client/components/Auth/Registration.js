import React, {Component} from 'react';
import { Text } from 'react-native';

class Registration extends Component {
  constructor(props){
    super(props)

    this.state = {

    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Registration',
      headerStyle: {
        backgroundColor: '#193367'
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      }
    };
  };

  render(){
    return(
      <Text>Registration</Text>
    )
  }
}

export default Registration;