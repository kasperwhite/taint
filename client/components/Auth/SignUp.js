import React, {Component} from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';

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

  /*  data without space  */

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Sign Up',
      headerStyle: {
        backgroundColor: '#193367'
      },
      headerTintColor: '#fff',
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

  signUp = () => {
    //some message
    const {username, password} = this.state;
    const user = { username, password };
    console.log(user);
    this.props.navigation.navigate('SignIn');
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
            containerStyle={{marginBottom: 5}}
            maxLength={20}
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
                    color='#193367'
                    size={20}
                  />
                }
                onPress={() => this.setState({passwordIsVisible: !this.state.passwordIsVisible})}
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
          />
          <Input 
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
          />
        </View>
        <Button
          title='Sign Up'
          containerStyle={{flexDirection: 'row', justifyContent: 'center'}}
          buttonStyle={{backgroundColor: '#193367', paddingHorizontal: 10}}
          disabled={
            !Boolean(this.state.username
            && this.state.password
            && this.state.password.length >= 12
            && this.state.password === this.state.repeatedPassword)
          }
          onPress={this.signUp}
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

export default SignUp;