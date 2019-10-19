import React, {Component} from 'react';
import { Text, AsyncStorage, View, StyleSheet } from 'react-native';
import { Button, Input, Icon } from 'react-native-elements';

class SignIn extends Component {
  constructor(props){
    super(props)

    this.state = {
      username: '',
      password: '',
      isValid: false
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
      },
      headerRight: (
        <Button
          icon={
            <Icon
              name='user-plus'
              type='font-awesome'
              color='#fff'
              size={21}
            />
          }
          containerStyle={{width: 50, marginRight: 5}}
          onPress={() => navigation.navigate('Registration')}
          type='clear'
        />
      )
    };
  };

  signIn = async () => {
    await AsyncStorage.setItem('userToken', '1234-5678')
    this.props.navigation.navigate('AuthLoading');
  }

  render(){
    return(
      <View style={styles.view}>
        <View style={styles.inputBlock}>
          <Input 
            placeholder='Username'
            leftIcon={
              <Icon
                name='user'
                type='font-awesome'
                color='#193367'
                size={20}
              />
            }
            leftIconContainerStyle={{marginRight: 7}}
            value={this.state.username}
            onChangeText={(username) => this.setState({username})}
          />
          <Input 
            placeholder='Password'
            leftIcon={
              <Icon
                name='lock'
                type='font-awesome'
                color='#193367'
                size={20}
              />
            }
            leftIconContainerStyle={{marginRight: 7}}
            value={this.state.password}
            onChangeText={(password) => this.setState({password})}
          />
        </View>
        <Button
          title='Sign In'
          icon={
            <Icon
              name='sign-in'
              type='font-awesome'
              color='#fff'
              size={20}
            />
          }
          containerStyle={{flexDirection: 'row', justifyContent: 'center'}}
          buttonStyle={{backgroundColor: '#193367'}}
          titleStyle={{marginLeft: 10}}
          disabled={!Boolean(this.state.username.trim() && this.state.password.trim())}
          onPress={this.signIn}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  view: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15
  },
  inputBlock: {
    marginBottom: 20
  }
})

export default SignIn;