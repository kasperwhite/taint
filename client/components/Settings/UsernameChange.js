import React, { Component } from 'react';
import { Text, ScrollView, StyleSheet } from 'react-native';
import { inject, observer } from 'mobx-react';
import { Input, Button } from 'react-native-elements';
import Loading from '../Shared/Loading';

class UsernameChange extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      newUsername: ''
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Change username',
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

  componentDidMount() {
    const currentUsername = this.props.authStore.user.username;
    this.setState({
      newUsername: currentUsername
    })
  }

  onChangeSubmit = async () => {
    const { newUsername} = this.state;
    const result = await this.props.settingsStore.changeUsername({ newUsername });
    if(result.success) {
      this.setState({
        newUsername: result.res.username
      })
    }
  }

  render() {
    return(
      <ScrollView style={styles.screen}>
        <Input
          placeholder='Username'
          value={this.state.newUsername}
          onChangeText={(name) => this.setState({newUsername: name.replace(/\s/g,'')})}
          containerStyle={{marginBottom: 20}}
          inputStyle={{color: '#fff'}}
          inputContainerStyle={{borderBottomColor: '#167B14'}}
          maxLength={20}
        />
        {this.props.settingsStore.changeUsernameIsLoading
        ? <Loading size={'large'}/>
        : <Button
            title='Change'
            titleStyle={{color: '#151516'}}
            containerStyle={{flexDirection: 'row', justifyContent: 'center'}}
            buttonStyle={{backgroundColor: '#167B14', paddingHorizontal: 10}}
            disabled={
              !Boolean(
                this.state.newUsername.trim() 
                && this.state.newUsername.length >= 4
                && this.state.newUsername != this.props.authStore.user.username
              )
            }
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

export default inject('settingsStore', 'authStore')(observer(UsernameChange));