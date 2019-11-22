import React, {Component} from 'react';
import { AsyncStorage, View, ActivityIndicator, StatusBar } from 'react-native';
import { Text } from 'react-native-elements';
import { observer, inject } from 'mobx-react';

class AuthLoading extends Component {
  constructor(props){
    super(props)

    this.state = { }
  }

  componentDidMount(){
    this.authenticate();
  }

  authenticate = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if(token) {
      const result = await this.props.authStore.authenticate();
      if(result.success){
        this.props.authStore.userToken = token;
        this.props.navigation.navigate('App');
      } else {
        this.props.navigation.navigate('Auth');
      }
    } else {
      this.props.navigation.navigate('Auth');
    }
  }

  render(){
    return(
      <View
        style={{
          height: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#151516'
        }}
      >
        <Text
          h1
          h1Style={{color: '#09C709', fontWeight: 'bold'}}
          style={{marginBottom: 15}}
        >Taint</Text>
        <ActivityIndicator color='#09C709' size='large'/>
      </View>
    )
  }
}

export default inject('authStore')(observer(AuthLoading));