import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Overlay, Input, Button, Slider, ButtonGroup } from 'react-native-elements';

const AddButton = (props) => {
  return(
    <Button
      title='Add'
      disabled={props.disabled}
      onPress={() => props.handleSubmit()}
      containerStyle={styles.submitButtonContainer}
      buttonStyle={styles.submitButton}
    />
  )
}

const CancelButton = (props) => {
  return(
    <Button
      title='Cancel'
      onPress={() => props.handleCancel()}
      containerStyle={styles.cancelButtonContainer}
      buttonStyle={styles.cancelButton}
    />
  )
}

class AddRoomOverlay extends Component {
  constructor(props){
    super(props);

    this.state = {
      roomName: '',
      timeValue: 60
    }
  }

  resetForm = () => {
    this.setState({roomName: '', timeValue: 60})
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
        height={250}
        overlayStyle={styles.overlay}
        windowBackgroundColor='rgba(0,0,0,0.6)'
      >
        <View style={styles.form}>
          <View style={styles.formRow}>
            <Input
              value={this.state.roomName}
              onChangeText={(roomName) => this.setState({roomName})}
              placeholder='Name'
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
              minimumValue={60}
              thumbTintColor='#193367'
              style={styles.slider}
            />
          </View>
          <View style={styles.buttons}>
            <CancelButton handleCancel={this.props.toggle}/>
            <AddButton handleSubmit={this.handleSubmit} disabled={this.state.roomName === ''}/>
          </View>
        </View>
      </Overlay>
    )
  }
}

const styles = StyleSheet.create({
  overlay: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  form: {
    width: '80%'
  },
  formRow: {
    marginVertical: 10
  },
  input: {
    textAlign: 'center'
  },
  inputContainer: {
    borderColor: '#193367',
    width: '100%'
  },
  slider: {
    
  },
  submitButton: {
    backgroundColor: '#193367'
  },
  submitButtonContainer: {
    marginLeft: 10
  },
  cancelButton: {
    backgroundColor: 'red'
  },
  cancelButtonContainer: {

  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center'
  }
})

export default AddRoomOverlay;