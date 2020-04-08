import React, { Component } from 'react';
import { Text, ScrollView, StyleSheet, View, Switch } from 'react-native';
import { Button, Icon, Avatar, Input, ListItem } from 'react-native-elements';
import { observer, inject } from 'mobx-react';
import { avatarsUrl } from '../../mobx/config';

class Settings extends Component {
  constructor(props){
    super(props)

    this.state = {
      visible: false
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Settings',
      headerStyle: {
        backgroundColor: '#222222',
        alignContent: 'center'
      },
      headerTintColor: '#09C709',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerLeft: (
        <Button
          icon={
            <Icon
              name='bars'
              type='font-awesome'
              color='#09C709'
              size={21}
            />
          }
          containerStyle={{marginLeft: 10}}
          onPress={navigation.openDrawer}
          type='clear'
        />
      )
    };
  };

  componentWillMount = () => {
    this.state.visible = this.props.authStore.user.visible;
  }

  onUsernameChange = () => {
    this.props.navigation.navigate('UsernameChange')
  }

  onPasswordChange = () => {
    this.props.navigation.navigate('PasswordChange')
  }

  onRefreshKeypair = () => {
    this.props.navigation.navigate('RefreshKeypair')
  }

  onDeleteAccount = () => {
    this.props.navigation.navigate('DeleteAccount')
  }

  onToggle = async () => {
    const value = !this.state.visible;
    this.setState((state, props) => ({
      visible: value
    }));
    await this.props.settingsStore.changeVisible({value});
  }

  render(){
    const { avatarId, username, visible } = this.props.authStore.user;
    return(
      <ScrollView style={styles.screen}>
        <ListItem
          bottomDivider
          title={username}
          subtitle={'Username'}
          containerStyle={styles.changeUsernameFieldContainer}
          titleStyle={styles.changeUsernameFieldTitle}
          subtitleStyle={styles.listItemSubtitle}
          onPress={this.onUsernameChange}
        />
        <ListItem
          bottomDivider
          title={'Change password'}
          containerStyle={styles.changePasswordFieldContainer}
          titleStyle={styles.changePasswordFieldTitle}
          onPress={this.onPasswordChange}
        />
        <ListItem
          bottomDivider
          title={'Refresh key pair'}
          subtitle={'Try to refresh the key pair as often as possible'}
          containerStyle={styles.changePasswordFieldContainer}
          titleStyle={styles.changePasswordFieldTitle}
          subtitleStyle={styles.listItemSubtitle}
          onPress={this.onRefreshKeypair}
        />
        <ListItem
          bottomDivider
          title={'Invisible'}
          subtitle={"Others can't add you to contacts"}
          containerStyle={styles.changePasswordFieldContainer}
          titleStyle={styles.changePasswordFieldTitle}
          subtitleStyle={styles.listItemSubtitle}
          rightElement={
            <Switch
              value={!this.state.visible}
              onValueChange={this.onToggle}
              thumbColor='#09C709'
              trackColor='#057a05'
            />
          }
        />
        <ListItem
          bottomDivider
          title={'Delete account'}
          subtitle={'Delete account and everything related to it'}
          containerStyle={styles.changePasswordFieldContainer}
          titleStyle={styles.deleteAccountFieldTitle}
          subtitleStyle={styles.listItemSubtitle}
          onPress={this.onDeleteAccount}
        />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#151516',
    paddingHorizontal: 10
  },
  infoHeader: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#777'
  },
  usernameField: {
    fontSize: 23,
    color: '#fff',
    marginLeft: 20
  },
  changeUsernameFieldContainer: {
    backgroundColor: '#151516',
    paddingHorizontal: 10
  },
  changeUsernameFieldTitle: {
    color: '#fff',
    fontSize: 17
  },
  listItemSubtitle: {
    color: '#777',
    fontSize: 13
  },
  changePasswordFieldContainer: {
    backgroundColor: '#151516',
    paddingHorizontal: 10
  },
  changePasswordFieldTitle: {
    color: '#fff',
    fontSize: 17
  },
  deleteAccountFieldTitle: {
    color: '#f20000',
    fontSize: 17
  }
})

export default inject('settingsStore', 'authStore')(observer(Settings));