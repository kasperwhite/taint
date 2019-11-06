import React, { Component } from 'react';
import { View, Text, Platform, AsyncStorage } from 'react-native';
import { Avatar, ListItem, Icon, Button } from 'react-native-elements';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import { Transition } from 'react-native-reanimated';
import { createDrawerNavigator, DrawerNavigatorItems } from 'react-navigation-drawer';
import { Provider } from 'mobx-react'

import AuthLoading from './Auth/AuthLoading';
import SignUp from './Auth/SignUp';
import SignIn from './Auth/SignIn';
import RoomList from './Rooms/RoomList';
import RoomCreate from './Rooms/RoomCreate';
import Room from './Rooms/Room';
import RoomInfo from './Rooms/RoomInfo';
import RoomUsersSelect from './Rooms/RoomUsersSelect';
import Contacts from './Contacts/Contacts';
import Settings from './Settings/Settings';

import authStore from '../mobx/AuthStore';
import roomStore from '../mobx/RoomStore';
import roomMessageStore from '../mobx/RoomMessageStore';
import roomUserStore from '../mobx/RoomUserStore';
import contactStore from '../mobx/ContactStore';
import settingsStore from '../mobx/SettingsStore';

const DrawerContent = (props) => {

  const signOut = async () => {
    await AsyncStorage.removeItem('userToken');
    props.navigation.navigate('AuthLoading');
  }

  return(
    <View>
      <ListItem
        leftElement={<Avatar rounded source={require('../assets/cat.jpg')} size={40}/>}
        title='KASPERWHITE'
        titleStyle={{fontWeight: 'bold', color: '#fff'}}
        containerStyle={{
          height: 130,
          backgroundColor: '#222222',
          paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight
        }}
        rightElement={
          <View style={{flexDirection: 'row'}}>
            <Button
              onPress={signOut}
              type='clear'
              icon={<Icon name='sign-out' type='font-awesome' color='#09C709' size={20}/>}
            />
          </View>
        }
      />
      <DrawerNavigatorItems {...props} labelStyle={{color: '#fff'}}/>
    </View>
  )
}

const RoomNavigator = createStackNavigator(
  {
    Rooms: RoomList,
    RoomCreate: RoomCreate,
    Room: Room,
    RoomInfo: RoomInfo,
    RoomUsersSelect: RoomUsersSelect
  },
  {
    initialRouteName: 'Rooms'
  }
)

const ContactsNavigator = createStackNavigator(
  {
    Contacts: Contacts
  },
  {
    initialRouteName: 'Contacts'
  }
)

const SettingsNavigator = createStackNavigator(
  {
    Settings: Settings
  }, {
    initialRouteName: 'Settings'
  }
)

const AuthNavigator = createStackNavigator(
  {
    SignIn: SignIn,
    SignUp: SignUp
  },
  {
    initialRouteName: 'SignIn'
  }
)

const MainNavigator = createDrawerNavigator({
  Rooms: {
    screen: RoomNavigator,
    navigationOptions: {
      title: 'Rooms',
      drawerLabel: 'Rooms',
      drawerIcon: ({tintColor}) => (
        <Icon name='comments' type='font-awesome' color='#167B14' size={23}/>
      )
    }
  },
  Contacts: {
    screen: ContactsNavigator,
    navigationOptions: {
      title: 'Contacts',
      drawerLabel: 'Contacts',
      drawerIcon: ({tintColor}) => (
        <Icon name='address-book' type='font-awesome' color='#167B14' size={23}/>
      )
    }
  },
  Settings: {
    screen: SettingsNavigator,
    navigationOptions: {
      title: 'Settings',
      drawerLabel: 'Settings',
      drawerIcon: ({tintColor}) => (
        <Icon name='cog' type='font-awesome' color='#167B14' size={23}/>
      )
    }
  }
}, {
  initialRouteName: 'Rooms',
  drawerBackgroundColor: '#151516',
  contentComponent: DrawerContent
})

const SwitchNavigator = createAppContainer(createAnimatedSwitchNavigator(
  {
    AuthLoading: AuthLoading,
    App: MainNavigator,
    Auth: AuthNavigator
  },
  {
    transition: (
      <Transition.Together>
        <Transition.Out
          type='slide-bottom'
          durationMs={200}
          interpolation="easeIn"
        />
        <Transition.In type="fade" durationMs={200} />
      </Transition.Together>
    )
  }
))

class Main extends Component{
  constructor(props){
    super(props)

    this.state = {}
  }

  render(){
    return(
      <Provider
        authStore={authStore}
        roomStore={roomStore}
        roomMessageStore={roomMessageStore}
        roomUserStore={roomUserStore}
        contactStore={contactStore}
        settingsStore={settingsStore}
      >
        <SwitchNavigator/>
      </Provider>
    )
  }
}

export default Main;