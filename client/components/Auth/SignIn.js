import React, {Component} from 'react';
import { Text, AsyncStorage, View, StyleSheet } from 'react-native';
import { Button, Input, Icon } from 'react-native-elements';
import { observer, inject } from 'mobx-react';

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
        backgroundColor: '#222222'
      },
      headerTintColor: '#09C709',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerRight: (
        <Button
          icon={
            <Icon
              name='user-plus'
              type='font-awesome'
              color='#09C709'
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
    this.props.navigation.navigate('SignUp');
    this.resetForm();
  }

  signIn = async () => {
    const {username, password} = this.state;
    const result = await this.props.authStore.signIn({username, password});
    if(result.success){
      const token = result.token;
      this.props.authStore.userToken = token;
      await AsyncStorage.setItem('userToken', token);
      this.props.navigation.navigate('AuthLoading');
    } else {
      console.log(result);
    }
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
                color='#167B14'
                size={20}
              />
            }
            leftIconContainerStyle={{marginRight: 7}}
            value={this.state.username}
            onChangeText={(username) => this.setState({username: username.replace(/\s/g,'')})}
            containerStyle={{marginBottom: 5}}
            inputStyle={{color: '#fff'}}
            maxLength={20}
          />
          <Input 
            placeholder='Password'
            leftIcon={
              <Icon
                name='lock'
                type='font-awesome'
                color='#167B14'
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
                    color='#167B14'
                    size={20}
                  />
                }
                onPress={() => this.setState({passwordIsVisible: !this.state.passwordIsVisible})}
              />
            }
            value={this.state.password}
            onChangeText={(password) => this.setState({password: password.replace(/\s/g,'')})}
            secureTextEntry={!this.state.passwordIsVisible}
            containerStyle={{marginBottom: 5}}
            inputStyle={{color: '#fff'}}
          />
        </View>
        <Button
          title='Sign In'
          titleStyle={{color: '#151516'}}
          containerStyle={{flexDirection: 'row', justifyContent: 'center'}}
          buttonStyle={{backgroundColor: '#167B14', paddingHorizontal: 10}}
          disabled={!Boolean(this.state.username.trim() && this.state.password.trim())}
          onPress={this.signIn}
          disabledStyle={{backgroundColor: '#167B14', opacity: 0.6}}
        />
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

export default inject('authStore')(observer(SignIn));