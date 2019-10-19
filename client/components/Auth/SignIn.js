import React, {Component} from 'react';
import { Text, AsyncStorage } from 'react-native';
import { Button } from 'react-native-elements';

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

  signIn = async () => {
    await AsyncStorage.setItem('userToken', '1234-5678')
    this.props.navigation.navigate('AuthLoading');
  }

  render(){
    return(
      <Button title='Enter' onPress={this.signIn}/>
    )
  }
}

export default SignIn;