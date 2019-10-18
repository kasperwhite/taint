import React, { Component } from 'react';
import { Icon } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';

import RoomList from './Rooms/RoomList';
import Room from './Rooms/Room';
import RoomInfo from './Rooms/RoomInfo';

const RoomNavigator = createStackNavigator(
  {
    Rooms: RoomList,
    Room: Room,
    RoomInfo: RoomInfo
  }
)

const MainNavigator = createAppContainer(createDrawerNavigator({
  Rooms: { screen: RoomNavigator }
}, {
  initialRouteName: 'Rooms'
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