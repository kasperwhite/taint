import React, {Component} from 'react';
import { Text } from 'react-native';

class RoomDialog extends Component {
  constructor(props){
    super(props);

    this.state = {
      roomId: 1,
      roomName: 'Ind'
    }
  }

  render(){
    return(
      <Text>RoomId: {this.state.roomId} RoomName: {this.state.roomName}</Text>
    )
  }
}

export default RoomDialog;