import React, {Component} from 'react';
import { Text } from 'react-native';

class SignIn extends Component {
  constructor(props){
    super(props)

    this.state = {

    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Sign In',
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
      <Text>SignIn</Text>
    )
  }
}

export default SignIn;