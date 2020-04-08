import React, {Component} from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import { observer, inject } from 'mobx-react';
import Loading from '../Shared/Loading';
import TaintButton from '../Shared/TaintButton';

class SignUp extends Component {
  constructor(props){
    super(props)

    this.state = {
      username: '',
      password: '',
      repeatedPassword: '',
      passwordIsVisible: false
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Sign Up',
      headerStyle: {
        backgroundColor: '#222222'
      },
      headerTintColor: '#09C709',
      headerTitleStyle: {
        fontWeight: 'bold',
      }
    };
  };

  resetForm = () => {
    this.setState({
      username: '',
      password: '',
      repeatedPassword: '',
      passwordIsVisible: false,
      isValid: false
    })
  }

  signUp = async () => {
    const {username, password} = this.state;
    const result = await this.props.authStore.signUp({username, password});
    if(result.success){
      this.props.navigation.navigate('SignIn')
    } else {
      console.log(result);
    }
  }

  onPasswordEyeClick = () => {
    this.setState({passwordIsVisible: !this.state.passwordIsVisible})
  }

  render(){
    return(
      <View style={styles.view}>
        <View style={styles.inputBlock}>
          <Input
            placeholder='Username'
            leftIconContainerStyle={{marginRight: 7}}
            value={this.state.username}
            onChangeText={(u) => {this.setState({username: u.replace(/\s/g,'')})}}
            errorMessage={
              this.state.username.length < 4 && this.state.username
              ? 'Username must be longer' : ''
            }
            containerStyle={{marginBottom: 5}}
            inputStyle={{color: '#fff'}}
            maxLength={20}
            inputContainerStyle={{borderBottomColor: '#167B14'}}
          />
          <Input 
            placeholder='Password'
            leftIconContainerStyle={{marginRight: 7}}
            rightIcon={
              <Button
                type='clear'
                icon={
                  <Icon
                    name={this.state.passwordIsVisible ? 'eye' : 'eye-slash'}
                    type='font-awesome'
                    color='#167B14'
                    size={20}
                  />
                }
                onPress={this.onPasswordEyeClick}
              />
            }
            value={this.state.password}
            onChangeText={(p) => {this.setState({password: p.replace(/\s/g,'')})}}
            errorMessage={
              this.state.password.length < 12 && this.state.password
              ? 'Password must be longer' : ''
            }
            secureTextEntry={!this.state.passwordIsVisible}
            containerStyle={{marginBottom: 5}}
            inputStyle={{color: '#fff'}}
            inputContainerStyle={{borderBottomColor: '#167B14'}}
          />
          <Input
            inputStyle={{color: '#fff'}}
            placeholder='Repeat Password'
            leftIconContainerStyle={{marginRight: 7}}
            value={this.state.repeatedPassword}
            onChangeText={(r) => this.setState({repeatedPassword: r.replace(/\s/g,'')})}
            onChange={this.handleChange}
            errorMessage={
              this.state.password !== this.state.repeatedPassword && this.state.repeatedPassword
              ? 'Passwords are different' : ''
            }
            secureTextEntry={true}
            disabled={this.state.passwordIsVisible}
            inputContainerStyle={{borderBottomColor: '#167B14'}}
          />
        </View>
        {this.props.authStore.signUpIsLoading
          ? <Loading size={'large'}/>
          : <TaintButton
              title='Sign Up'
              disabled={
                !Boolean(this.state.username
                && this.state.password
                && this.state.password.length >= 12
                && this.state.username.length >= 4
                && this.state.password === this.state.repeatedPassword)
              }
              onPress={this.signUp}
            />
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  view: {
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#151516'
  },
  inputBlock: {
    marginBottom: 20
  }
})

export default inject('authStore')(observer(SignUp));