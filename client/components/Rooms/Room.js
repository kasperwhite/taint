import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, KeyboardAvoidingView, Dimensions } from 'react-native';
import { Input, Icon, Avatar } from 'react-native-elements';

class Room extends Component {
  constructor(props){
    super(props)

    this.state = {
      message: '',
      messages: [
        {id: 0, sender: 'kasper', text: 'Hello!Hello!Hello!Hello!Hello!Hello!Hello!Hello!Hello!Hello!Hello!Hello!Hello!Hello!Hello!'},
        {id: 1, sender: 'kasper', text: 'Hello!'},
        {id: 2, sender: 'kasper', text: 'Hello!'},
        {id: 3, sender: 'kasper', text: 'Hello!'},
        {id: 4, sender: 'kasper', text: 'Hello!'},
        {id: 5, sender: 'kasper', text: 'Hello!'},
        {id: 6, sender: 'kasper', text: 'Hello!'},
        {id: 7, sender: 'kasper', text: 'Hello!'},
        {id: 8, sender: 'kasper', text: 'Hello!'},
        {id: 9, sender: 'kasper', text: 'Hello!'},
        {id: 10, sender: 'kasper', text: 'Hello!'},
        {id: 11, sender: 'kasper', text: 'Hello!'}
      ]
    }
  }

  static navigationOptions = {
    title: 'Room',
    headerStyle: {
      backgroundColor: '#193367',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

  sendMessage = () => {
    let {message} = this.state;
    if(message !== ' ' && message !== ''){
      const roomId = this.props.navigation.getParam('roomId','');
      let messages = this.state.messages;
      message = {id: this.state.messages.length, text: message};
      messages.push(message);
      this.setState({
        messages,
        message: ''
      })
    }
  }

  render(){
    return(
      <ScrollView style={styles.cont}>
        {
          this.state.messages.map((m) => (
            <View key={m.id} style={styles.sendMessage}>
              <Avatar
                rounded
                containerStyle={{marginRight: 3}}
              />
              <View style={styles.sendMessageContent}>
                <Text
                  style={{color: '#fff', fontWeight: 'bold'}}
                  onPress={() => console.log('Want to see sender?')}
                >{m.sender}</Text>
                <Text
                  style={{color: '#fff', paddingLeft: 2, paddingTop: 1}}
                  onPress={() => console.log('Want to edit?')}
                >{m.text}</Text>
              </View>
            </View>
          ))
        }
        <Input
          placeholder='Type message...'
          rightIcon={
            <Icon
              name='paper-plane'
              type='font-awesome'
              color='#193367'
              onPress={this.sendMessage}
              style={{width: 100}}
            />
          }
          inputContainerStyle={styles.messageInput}
          containerStyle={styles.messageCont}
          onChange={(data) => this.setState({ message: data.nativeEvent.text })}
          value={this.state.message}
        />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  cont: {
    padding: 5
  },
  sendMessage: {
    flexDirection: "row",
    alignItems: 'center'
  },
  sendMessageContent: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#193367',
    color: 'white',
    margin: 2,
    maxWidth: 250
  },
  messageInput: {
    borderColor: '#193367',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 0,
    borderRadius: 8
  },
  messageCont: {
    
  }
})

export default Room;