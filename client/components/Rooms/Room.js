import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, KeyboardAvoidingView, Dimensions, FlatList } from 'react-native';
import { Input, Icon, Avatar } from 'react-native-elements';

class Room extends Component {
  constructor(props){
    super(props)

    this.state = {
      message: '',
      messages: [
        {id: 0, sender: 'kasper', text: 'Hello!'},
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
      backgroundColor: '#193367'
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerRight: (
      <Icon
        name='ellipsis-v'
        type='font-awesome'
        color='#fff'
        onPress={() => console.log('Press!')}
        containerStyle={{paddingRight: 20}}
      />
    )
  };

  sendMessage = () => {
    let {message} = this.state;
    if(message !== ' ' && message !== ''){
      const roomId = this.props.navigation.getParam('roomId','');
      let messages = this.state.messages;
      message = {id: this.state.messages.length, text: message, sender: 'kasperwhite'};
      messages.push(message);
      this.setState({
        messages,
        message: ''
      })
    }
  }

  render(){
    return(
      <KeyboardAvoidingView behavior="padding" enabled style={styles.keyboard} keyboardVerticalOffset={90}>
        <View>
          <ScrollView
            style={styles.scrollCont}
            ref={ref => this.scrollView = ref}
            onContentSizeChange={()=>{this.scrollView.scrollToEnd({animated: true})}}
          >
            <View style={{paddingVertical: 10, paddingHorizontal: 6}}>
            {
              this.state.messages.map((m) => (
                <View key={m.id} style={m.sender === 'kasper' ? styles.otherSendMessage : styles.mySendMessage}>
                  <Avatar
                    rounded
                    containerStyle={{margin: 3}}
                    source={require("../../assets/cat.jpg")}
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
            </View>
          </ScrollView>
          <Input
          placeholder='Type message...'
          rightIcon={
            <Icon
              name='paper-plane'
              type='font-awesome'
              color='#193367'
              onPress={this.sendMessage}
            />
          }
          rightIconContainerStyle={{paddingHorizontal: 15}}
          inputContainerStyle={styles.messageInput}
          containerStyle={styles.messageCont}
          onChange={(data) => {
            if(data.nativeEvent.text !== ' ' ){
              this.setState({ message: data.nativeEvent.text })
            }
          }}
          value={this.state.message}
        />
      </View>
    </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  keyboard: {
    
  },
  scrollCont: {
    backgroundColor: '#d6e0f5'
  },
  otherSendMessage: {
    alignSelf: 'flex-start',
    flexDirection: "row",
    alignItems: 'center',
    marginVertical: 3
  },
  mySendMessage: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginVertical: 3
  },
  sendMessageContent: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#193367',
    color: 'white',
    maxWidth: 250
  },
  messageInput: {
    borderColor: '#fff',
    paddingLeft: 10,
    paddingTop: 3,
    paddingBottom: 0
  },
  messageCont: {
    marginTop: 'auto',
  }
})

export default Room;