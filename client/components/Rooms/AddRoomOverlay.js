import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Overlay, Input, Button, Slider } from 'react-native-elements';

class AddRoomOverlay extends Component {
  constructor(props){
    super(props);

    this.state = {
      roomName: '',
      timeValue: 1
    }
  }

  resetForm = () => {
    this.setState({roomName: '', timeValue: 1})
  }

  render(){
    const {visible, toggle, addRoom} = this.props;
    return(
      <Overlay
        isVisible={visible}
        width={300}
        height={300}
        onBackdropPress={() => {toggle(); this.resetForm()}}
        borderRadius={10}
        style={{justifyContent: 'center'}}
      >
        <View style={{flexDirection: 'column', justifyContent: 'center'}}>
          <View style={styles.formRow}>
            <Input
              value={this.state.roomName}
              onChangeText={(roomName) => this.setState({roomName})}
              placeholder='Room Name'
            />
          </View>
          <View style={styles.formRow}>
            <Text style={{textAlign:'left'}}>Time: {Math.floor(this.state.timeValue / 60)}m</Text>
            <Slider
              value={this.state.timeValue}
              onValueChange={timeValue => this.setState({ timeValue })}
              step={1}
              maximumValue={3600}
              thumbTintColor='#193367'
              style={styles.slider}
            />
          </View>
          <View style={styles.formRow}>
            <Button 
              title='Add'
              onPress={() => {toggle(); this.resetForm(); addRoom(this.state.roomName, this.state.timeValue)}}
              containerStyle={styles.submitButtonContainer}
            />
          </View>
        </View>
      </Overlay>
    )
  }
}

const styles = StyleSheet.create({
  formRow: {
    marginVertical: 5
  },
  slider: {
    
  },
  submitButtonContainer: {
    
  }
})

export default AddRoomOverlay;