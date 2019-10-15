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

  handleSubmit = () => {
    const {toggle, addRoom} = this.props;
    toggle();
    this.resetForm();
    addRoom(this.state.roomName, this.state.timeValue)
  }

  render(){
    const {toggle,visible} = this.props;
    return(
      <Overlay
        isVisible={visible}
        onBackdropPress={() => {toggle(); this.resetForm()}}
        borderRadius={10}
        height={300}
        overlayStyle={styles.overlay}
      >
        <View style={styles.form}>
          <View style={styles.formRow}>
            <Input
              value={this.state.roomName}
              onChangeText={(roomName) => this.setState({roomName})}
              placeholder='Room Name'
              inputStyle={styles.input}
              inputContainerStyle={styles.inputContainer}
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
              onPress={this.handleSubmit}
              containerStyle={styles.submitButtonContainer}
              buttonStyle={styles.submitButton}
            />
          </View>
        </View>
      </Overlay>
    )
  }
}

const styles = StyleSheet.create({
  overlay: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  form: {
    width: '80%'
  },
  formRow: {
    marginVertical: 5
  },
  input: {
    
  },
  inputContainer: {
    borderColor: '#193367',
    width: '100%'
  },
  slider: {
    
  },
  submitButton: {

  },
  submitButtonContainer: {
    
  }
})

export default AddRoomOverlay;