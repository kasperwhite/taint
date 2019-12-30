import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { inject, observer } from 'mobx-react';
import { Input, Button } from 'react-native-elements';

import Loading from '../Shared/Loading';

class PasswordChange extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      error: false,
      oldPass: '',
      newPass: ''
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Change password',
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

  onChangeSubmit = async () => {
    const {oldPass, newPass} = this.state;
    const result = await this.props.settingsStore.changePassword({oldPass, newPass});
    if(result.success) {
      this.setState({
        error: false,
        oldPass: '',
        newPass: ''
      })
    } else {
      this.setState({
        error: true
      })
    }
  }

  render() {
    return(
      <ScrollView style={styles.screen}>
        <Input
          placeholder='Old password'
          value={this.state.oldPass}
          onChangeText={(pass) => this.setState({oldPass: pass.replace(/\s/g,'')})}
          containerStyle={{marginBottom: 5}}
          inputStyle={{color: '#fff'}}
          inputContainerStyle={{borderBottomColor: '#167B14'}}
          errorMessage={this.state.error ? 'Incorrect' : null}
          secureTextEntry
        />
        <Input
          placeholder='New password'
          value={this.state.newPass}
          onChangeText={(pass) => this.setState({newPass: pass.replace(/\s/g,'')})}
          containerStyle={{marginBottom: 20}}
          inputStyle={{color: '#fff'}}
          inputContainerStyle={{borderBottomColor: '#167B14'}}
          secureTextEntry
        />
        {this.props.settingsStore.changePasswordIsLoading
        ? <Loading size={'large'}/>
        : <Button
            title='Change'
            titleStyle={{color: '#151516'}}
            containerStyle={{flexDirection: 'row', justifyContent: 'center'}}
            buttonStyle={{backgroundColor: '#167B14', paddingHorizontal: 10}}
            disabled={!Boolean(this.state.oldPass.trim() && this.state.newPass.trim())}
            disabledStyle={{backgroundColor: '#167B14', opacity: 0.6}}
            disabledTitleStyle={{color: '#151516'}}
            onPress={this.onChangeSubmit}
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

export default inject('settingsStore')(observer(PasswordChange));