import React, { Component } from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import RoomList from './Rooms/RoomList';
import Room from './Rooms/Room';

const RoomNavigator = createAppContainer(createStackNavigator(
  {
    Rooms: RoomList,
    Room: Room
  },
  {
    initialRouteName: 'Rooms',
  }
))

class Main extends Component{
  constructor(props){
    super(props)

    this.state = {}
  }

  render(){
    return(<RoomNavigator/>)
  }
}

export default Main;