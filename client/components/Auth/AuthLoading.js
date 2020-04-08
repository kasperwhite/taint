import React, {Component} from 'react';
import { AsyncStorage, View, ActivityIndicator, StatusBar } from 'react-native';
import { Text } from 'react-native-elements';
import { observer, inject } from 'mobx-react';
import Loading from '../Shared/Loading';

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
      this.props.authStore.userToken = token;
      const result = await this.props.authStore.authenticate();
      if(result.success){
        const userSecKey = await AsyncStorage.getItem('userSecKey');
        if(userSecKey) {
          this.enterApp();
        } else {
          this.props.authStore.generateKeyPair()
            .then(() => { this.enterApp() })
            .catch(() => { this.props.navigation.navigate('Auth') })
        }
      } else {
        this.props.navigation.navigate('Auth');
      }
    } else {
      this.props.navigation.navigate('Auth');
    }
  }

  enterApp = () => {
    this.props.authStore.emitOnline();
    this.props.navigation.navigate('App');
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
        {/* <Text
          h3
          h3Style={{color: '#09C709', fontWeight: 'bold'}}
          style={{marginBottom: 15}}
        >Authentication</Text> */}
        <Loading size={'large'}/>
      </View>
    )
  }
}

export default inject('authStore')(observer(AuthLoading));