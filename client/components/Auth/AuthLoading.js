import React, {Component} from 'react';
import { AsyncStorage, View, ActivityIndicator, StatusBar } from 'react-native';

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
    await AsyncStorage.setItem('userToken', '1234-5678');
    const token = await AsyncStorage.getItem('userToken');
    await AsyncStorage.removeItem('userToken');
    this.props.navigation.navigate(token ? 'App' : 'Auth');
  }

  render(){
    return(
      <View style={{height: '100%', flexDirection: 'column', justifyContent: 'center', backgroundColor: '#193367'}}>
        <ActivityIndicator color='#fff' size='large'/>
      </View>
    )
  }
}

export default AuthLoading;