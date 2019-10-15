import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, KeyboardAvoidingView, Dimensions, FlatList } from 'react-native';
import { Input, Icon, Avatar, Button } from 'react-native-elements';

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
      <Button
        icon={
          <Icon
            name='ellipsis-v'
            type='font-awesome'
            color='#fff'
          />
        }
        containerStyle={{width: 50, marginRight: 5}}
        onPress={() => console.log('Open Dialog')}
        type='clear'
      />
    )
  };

  sendMessage = () => {
    let {message} = this.state;
    if(message !== ' ' && message !== ''){
      //const roomId = this.props.navigation.getParam('roomId','');
      let messages = Object.assign([], this.state.messages);
      messages.push({id: this.state.messages.length, text: message, sender: 'kasperwhite'});
      this.setState({
        messages,
        message: ''
      })
    }
  }

  renderMessage = ({item, index}) => {
    return(
      <View
        key={item.id}
        style={item.sender === 'kasper' ? styles.otherSendMessage : styles.mySendMessage}
      >
        <Avatar
          rounded
          containerStyle={{margin: 3}}
          source={require("../../assets/cat.jpg")}
        />
        <View style={styles.sendMessageContent}>
          <Text
            style={{color: '#fff', fontWeight: 'bold'}}
            onPress={() => console.log('Want to see sender?')}
          >{item.sender}</Text>
          <Text
            style={{color: '#fff', paddingLeft: 2, paddingTop: 1}}
            onPress={() => console.log('Want to edit?')}
          >{item.text}</Text>
        </View>
      </View>
    );
  }

  render(){
    return(
      <KeyboardAvoidingView behavior="padding" enabled style={styles.keyboard} keyboardVerticalOffset={90}>
        <View>
          <ScrollView
            ref={ref => this.scrollView = ref}
            onContentSizeChange={()=>{this.scrollView.scrollToEnd({animated: true})}}
          >
            <FlatList
              data={this.state.messages}
              renderItem={this.renderMessage}
              keyExtractor={item => item.id.toString()}
              style={{paddingVertical: 10, paddingHorizontal: 6, backgroundColor: '#d6e0f5'}}
            />
          </ScrollView>
          <Input
          placeholder='Type message...'
          rightIcon={
            <Button
              icon={
                <Icon
                  name='paper-plane'
                  type='font-awesome'
                  color='#193367'
                />
              }
              containerStyle={{width: 50}}
              onPress={this.sendMessage}
              type='clear'
            />
          }
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