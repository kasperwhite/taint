import React, {Component} from 'react';
import { Text, AsyncStorage, View, StyleSheet } from 'react-native';
import { Button, Input, Icon } from 'react-native-elements';

class SignIn extends Component {
  constructor(props){
    super(props)

    this.state = {
      username: '',
      password: '',
      isValid: false,
      passwordIsVisible: false
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
          onPress={navigation.getParam('openReg')}
          type='clear'
        />
      )
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({ openReg: this.openReg });
  }

  openReg = () => {
    this.props.navigation.navigate('Registration');
    this.resetForm();
  }

  signIn = async () => {
    await AsyncStorage.setItem('userToken', '1234-5678')
    this.props.navigation.navigate('AuthLoading');
  }

  resetForm = () => {
    this.setState({
      username: '',
      password: '',
      isValid: false,
      passwordIsVisible: false
    })
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
            containerStyle={{marginBottom: 5}}
            maxLength={20}
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
            rightIcon={
              <Button
                type='clear'
                icon={
                  <Icon
                    name={this.state.passwordIsVisible ? 'eye' : 'eye-slash'}
                    type='font-awesome'
                    color='#193367'
                    size={20}
                  />
                }
                onPress={() => this.setState({passwordIsVisible: !this.state.passwordIsVisible})}
              />
            }
            value={this.state.password}
            onChangeText={(password) => this.setState({password})}
            secureTextEntry={!this.state.passwordIsVisible}
            containerStyle={{marginBottom: 5}}
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