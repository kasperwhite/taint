import React, { Component } from 'react';
import { View, Text, Platform } from 'react-native';
import { Avatar, ListItem, Icon } from 'react-native-elements';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import { Transition } from 'react-native-reanimated';
import { createDrawerNavigator, DrawerNavigatorItems } from 'react-navigation-drawer';

import AuthLoading from './Auth/AuthLoading';
import Registration from './Auth/Registration';
import SignIn from './Auth/SignIn';

import RoomList from './Rooms/RoomList';
import Room from './Rooms/Room';
import RoomInfo from './Rooms/RoomInfo';

import Settings from './Settings/Settings';

const DrawerContent = (props) => (
  <View>
    <ListItem
      leftElement={<Avatar rounded source={require('../assets/cat.jpg')} size={40}/>}
      title='KASPERWHITE'
      titleStyle={{fontWeight: 'bold', color: '#fff'}}
      containerStyle={{
        height: 130,
        backgroundColor: '#214183',
        paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight
      }}
    />
    <DrawerNavigatorItems {...props} labelStyle={{color: '#fff'}}/>
  </View>
)

const RoomNavigator = createStackNavigator(
  {
    Rooms: RoomList,
    Room: Room,
    RoomInfo: RoomInfo
  }
)

const SettingsNavigator = createStackNavigator(
  {
    Settings: Settings
  }
)

const AuthNavigator = createStackNavigator(
  {
    SignIn: SignIn,
    Registration: Registration
  }
)

const MainNavigator = createDrawerNavigator({
  Rooms: {
    screen: RoomNavigator,
    navigationOptions: {
      title: 'Rooms',
      drawerLabel: 'Rooms',
      drawerIcon: ({tintColor}) => (
        <Icon name='comments' type='font-awesome' color='#fff' size={23}/>
      )     
    }
  },
  Settings: {
    screen: SettingsNavigator,
    navigationOptions: {
      title: 'Settings',
      drawerLabel: 'Settings',
      drawerIcon: ({tintColor}) => (
        <Icon name='cog' type='font-awesome' color='#fff' size={23}/>
      )
    }
  }
}, {
  initialRouteName: 'Rooms',
  drawerBackgroundColor: '#193367',
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
          type='fade'
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
    return(<SwitchNavigator/>)
  }
}

export default Main;