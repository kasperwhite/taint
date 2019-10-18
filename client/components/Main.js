import React, { Component } from 'react';
import { Icon, View, Text, Platform } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerNavigatorItems } from 'react-navigation-drawer';

import RoomList from './Rooms/RoomList';
import Room from './Rooms/Room';
import RoomInfo from './Rooms/RoomInfo';

import Settings from './Settings/Settings';

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

const MainNavigator = createAppContainer(createDrawerNavigator({
  Rooms: { screen: RoomNavigator },
  Settings: { screen: SettingsNavigator }
}, {
  initialRouteName: 'Rooms',
  drawerBackgroundColor: '#193367',
  contentComponent: DrawerContent
}))

class Main extends Component{
  constructor(props){
    super(props)

    this.state = {}
  }

  render(){
    return(<MainNavigator/>)
  }
}

export default Main;