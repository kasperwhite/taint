import React, { Component } from 'react';
import { View } from 'react-native';
import { Overlay, Input, Button } from 'react-native-elements';

class AddRoomOverlay extends Component {
  constructor(props){
    super(props);

    this.state = {
      roomName: ''
    }
  }
  render(){
    return(
      <Overlay
        isVisible={this.props.visible}
        width={300}
        height={300}
        onBackdropPress={() => this.props.toggle()}
        borderRadius={10}
      >
        <View>
          <Input
            value={this.state.roomName}
            onChangeText={(roomName) => this.setState({roomName})}
            placeholder='Room Name'
          />
          <Button 
            title='Add'
            containerStyle={{marginTop: 20}}
            onPress={() => {this.props.toggle(); this.props.addRoom(this.state.roomName)}}
          />
        </View>
      </Overlay>
    )
  }
}

export default AddRoomOverlay;