import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import DialogList from './DialogList';

class Main extends Component{
  constructor(props){
    super(props)

    this.state = {
      rooms: [
        {name: 'Room1', messages: { text: 'Hello!!!' }},
        {name: 'Room2', messages: { text: 'Hello!!!!' }},
        {name: 'Room3', messages: { text: 'Hello!!!!!' }},
        {name: 'Room4', messages: { text: 'Hello!!!!!!' }},
        {name: 'Room5', messages: { text: 'Hello!!!!!!!' }}
      ]
    }
  }

  render(){
    return(
      <DialogList rooms={this.state.rooms}/>
    )
  }
}

export default Main;