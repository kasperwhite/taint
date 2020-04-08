import React, { Component } from 'react';
import { Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { inject, observer } from 'mobx-react';
import { Input, Button } from 'react-native-elements';
import Loading from '../Shared/Loading';
import TaintButton from '../Shared/TaintButton';

class DeleteAccount extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      password: ''
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Delete account',
      headerStyle: {
        backgroundColor: '#222222',
        alignContent: 'center'
      },
      headerTintColor: '#09C709',
      headerTitleStyle: {
        fontWeight: 'bold',
      }
    };
  };

  onDeleteSubmit = () => {
    Alert.alert(
      'Delete account',
      'When you delete an account, all the rooms and messages you created will be deleted, are you sure you want to continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          style: 'default',
          onPress: async () => {
            const res = await this.props.authStore.deleteAccount({password: this.state.password});
            if(res.success) { this.props.navigation.navigate('Auth') }
          } 
        }
      ]
    )
  }

  render() {
    return(
      <ScrollView style={styles.screen}>
        <Input
          placeholder='Password'
          value={this.state.password}
          onChangeText={(pass) => this.setState({password: pass.replace(/\s/g,'')})}
          containerStyle={{marginBottom: 20}}
          inputStyle={{color: '#fff'}}
          inputContainerStyle={{borderBottomColor: '#167B14'}}
          secureTextEntry={true}
        />
        {this.props.settingsStore.changeUsernameIsLoading
          ? <Loading size={'large'}/>
          : <TaintButton
              title='Delete'
              disabled={!Boolean(this.state.password.trim())}
              onPress={this.onDeleteSubmit}
            />
        }
      </ScrollView>
    )
  }

}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#151516',
    padding: 10
  }
})

export default inject('settingsStore', 'authStore')(observer(DeleteAccount));