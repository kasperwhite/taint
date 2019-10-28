import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Overlay, Input, Button, Slider, ButtonGroup } from 'react-native-elements';

const AddButton = (props) => {
  return(
    <Button
      title='Create'
      disabled={props.disabled}
      onPress={() => props.handleSubmit()}
      containerStyle={styles.submitButtonContainer}
      buttonStyle={styles.submitButton}
      disabledStyle={{backgroundColor: '#167B14', opacity: 0.6}}
    />
  )
}

class RoomCreate extends Component {
  constructor(props){
    super(props);

    this.state = {
      roomName: '',
      timeValue: 1
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Create Room',
      headerStyle: {
        backgroundColor: '#222222'
      },
      headerTintColor: '#09C709',
      headerTitleStyle: {
        fontWeight: 'bold',
      }
    };
  };

  resetForm = () => {
    this.setState({roomName: '', timeValue: 1})
  }

  handleSubmit = () => {
    console.log({
      time: this.state.timeValue*3600,
      name: this.state.roomName
    })
    this.resetForm();
  }

  render(){
    return(
      <View style={styles.form}>
        <Input
          value={this.state.roomName}
          onChangeText={(n) => this.setState({roomName: n.replace(/\s/g,'')})}
          placeholder='Name'
          inputStyle={styles.input}
          inputContainerStyle={styles.inputContainer}
        />
        <View style={{marginVertical: 15, paddingHorizontal: 15}}>
          <Text
            style={{textAlign:'left', color: '#fff'}}
          >Time: {this.state.timeValue}h</Text>
          <Slider
            value={this.state.timeValue}
            onValueChange={timeValue => this.setState({ timeValue })}
            step={1}
            maximumValue={12}
            minimumValue={1}
            thumbTintColor='#167B14'
            style={styles.slider}
            trackStyle={styles.sliderTrack}
          />
        </View>
        <AddButton
          handleSubmit={this.handleSubmit} disabled={this.state.roomName === ''}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  form: {
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'flex-start',
    alignContent: 'flex-start', 
    backgroundColor: '#151516',
    padding: 15
  },
  input: {
    color: '#fff'
  },
  inputContainer: {
    borderColor: '#167B14'
  },
  slider: {
    
  },
  sliderTrack: {
    
  },
  submitButton: {
    backgroundColor: '#167B14',
    paddingHorizontal: 10
  },
  submitButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center'
  }
})

export default RoomCreate;