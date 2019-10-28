import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Overlay, Input, Button, Slider, ButtonGroup, ListItem, Icon } from 'react-native-elements';

const AddUserButton = (props) => {
  return(
    <Button
      icon={
        <Icon
          name='plus'
          type='font-awesome'
          color='#151516'
          size={15}
        />
      }
      containerStyle={{borderRadius: 30, backgroundColor: '#167B14', width: 30, height: 30}}
      onPress={props.addUser}
      type='clear'
    />
  )
}

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
      timeValue: 1,
      roomUsers: [

      ]
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
    this.setState({roomName: '', timeValue: 1, roomUsers: []})
  }

  handleSubmit = () => {
    console.log({
      time: this.state.timeValue*3600,
      name: this.state.roomName,
      roomUsers: this.state.roomUsers.map(el => { return el.id })
    })
    this.resetForm();
  }

  addUser = () => {
    this.props.navigation.navigate('RoomUsersSelect', { 
      handleUsersSelect: this.handleUsersSelect 
    });
  }

  handleUsersSelect = (users) => {
    this.setState({ roomUsers: users })
  }

  renderUser = ({ item }) => (
    <ListItem
      title={item.username}
      bottomDivider
      leftAvatar={{ source: require('../../assets/cat.jpg'), size: 'small' }}
      containerStyle={{backgroundColor: '#151516'}}
      titleStyle={{color: '#fff'}}
    />
  )

  render(){
    return(
      <View style={styles.form}>
        <ScrollView>
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
        <FlatList
          keyExtractor={item => item.id.toString()}
          data={this.state.roomUsers}
          renderItem={this.renderUser}
          contentContainerStyle={{paddingHorizontal: 10}}
          ListHeaderComponent={
              <ListItem
                title='Users'
                containerStyle={{backgroundColor: '#151516', paddingVertical: 5, paddingHorizontal: 10}}
                titleStyle={{color: '#fff'}}
                bottomDivider
                rightElement={
                  <AddUserButton addUser={this.addUser}/>
                }
              />
          }
        />
        <AddButton
          handleSubmit={this.handleSubmit} disabled={this.state.roomName === ''}
        />
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  form: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignContent: 'flex-start', 
    backgroundColor: '#151516',
    height: '100%',
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
    alignSelf: 'center',
    marginVertical: 20
  }
})

export default RoomCreate;