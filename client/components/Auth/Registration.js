import React, {Component} from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';

class Registration extends Component {
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
      title: 'Registration',
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
      passwordIsVisible: false
    })
  }

  completeReg = () => {
    //some message
    this.props.navigation.navigate('SignIn');
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
          <Input 
            placeholder='Repeat Password'
            leftIcon={
              <Icon
                name='lock'
                type='font-awesome'
                color='#193367'
                size={20}
              />
            }
            leftIconContainerStyle={{marginRight: 7}}
            value={this.state.repeatedPassword}
            onChangeText={(repeatedPassword) => this.setState({repeatedPassword})}
            errorMessage={
              this.state.password !== this.state.repeatedPassword && this.state.repeatedPassword
              ? 'Passwords are different' : ''
            }
            secureTextEntry={true}
            disabled={this.state.passwordIsVisible}
          />
        </View>
        <Button
          title='Complete'
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
          disabled={
            !Boolean(
            this.state.username.trim()
            && this.state.password.trim()
            && this.state.password.trim() === this.state.repeatedPassword.trim()
            )
          }
          onPress={this.completeReg}
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

export default Registration;