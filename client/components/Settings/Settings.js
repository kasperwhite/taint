import React, { Component } from 'react';
import { Text, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Icon, Avatar, Input, ListItem } from 'react-native-elements';
import { observer, inject } from 'mobx-react';
import { avatarsUrl } from '../../mobx/config';

const UserInfo = (props) => (
  <View style={styles.infoHeader}>
    <Avatar
      rounded
      size='medium'
      source={{uri: avatarsUrl + props.avatarId}}
    />
    <Text style={styles.usernameField}>{props.username}</Text>
  </View>
)

class Settings extends Component {
  constructor(props){
    super(props)

    this.state = { }
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

  onUsernameChange = () => {
    this.props.navigation.navigate('UsernameChange')
  }

  onPasswordChange = () => {
    this.props.navigation.navigate('PasswordChange')
  }

  render(){
    const { avatarId, username } = this.props.authStore.user;
    return(
      <ScrollView style={styles.screen}>
        <ListItem
          bottomDivider
          title={username}
          subtitle={'Username'}
          containerStyle={styles.changeUsernameFieldContainer}
          titleStyle={styles.changeUsernameFieldTitle}
          subtitleStyle={styles.changeUsernameFieldSubtitle}
          onPress={this.onUsernameChange}
        />
        <ListItem
          bottomDivider
          title={'Change password'}
          containerStyle={styles.changePasswordFieldContainer}
          titleStyle={styles.changePasswordFieldTitle}
          onPress={this.onPasswordChange}
        />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#151516',
    padding: 10
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
    backgroundColor: '#151516'
  },
  changeUsernameFieldTitle: {
    color: '#fff',
    fontSize: 19
  },
  changeUsernameFieldSubtitle: {
    color: '#777',
    fontSize: 13
  },
  changePasswordFieldContainer: {
    backgroundColor: '#151516'
  },
  changePasswordFieldTitle: {
    color: '#fff',
    fontSize: 19
  }
})

export default inject('settingsStore', 'authStore')(observer(Settings));