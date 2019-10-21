import React, {Component} from 'react';
import { AsyncStorage, View, ActivityIndicator, StatusBar } from 'react-native';
import { Text } from 'react-native-elements';

class AuthLoading extends Component {
  constructor(props){
    super(props)

    this.state = {

    }
  }

  componentDidMount(){
    this.authenticate();
  }

  authenticate = async () => {
    const token = await AsyncStorage.getItem('userToken');
    this.props.navigation.navigate(token ? 'App' : 'Auth');
  }

  render(){
    return(
      <View style={{height: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#193367'}}>
        <Text
          h1
          h1Style={{color: '#fff', fontWeight: 'bold'}}
          style={{marginBottom: 15}}
        >Taint</Text>
        <ActivityIndicator color='#fff' size='large'/>
      </View>
    )
  }
}

export default AuthLoading;