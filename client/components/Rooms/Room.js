import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, KeyboardAvoidingView, Keyboard, FlatList } from 'react-native';
import { Input, Icon, Avatar, Button, ListItem } from 'react-native-elements';

class Room extends Component {
  constructor(props){
    super(props)

    this.state = {
      roomId: 1,
      roomName: '',
      message: '',
      messages: [
        {id: 0, sender: 'kasper', text: 'Hello!Hello!Hello!Hello!Hello!Hello!Hello!Hello!Hello!Hello!Hello!Hello!'},
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

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('roomName'),
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
              name='info'
              type='font-awesome'
              color='#fff'
              size={21}
            />
          }
          containerStyle={{width: 50, marginRight: 5}}
          onPress={navigation.getParam('openDialog')}
          type='clear'
        />
      )
    };
  };

  componentWillMount(){
    this.props.navigation.setParams({ 
      openDialog: this.openDialog
    });
    const roomId = this.props.navigation.getParam('roomId');
    const roomName = this.props.navigation.getParam('roomName');
    this.setState({
      roomId,
      roomName
    })
  }

  componentDidMount(){
    // fetch messages
  }

  openDialog = () => {
    const {roomId, roomName} = this.state;
    this.props.navigation.navigate('RoomDialog', { roomId, roomName })
  }

  sendMessage = () => {
    let {message} = this.state;
    let messages = Object.assign([], this.state.messages);
    messages.push({id: this.state.messages.length, text: message, sender: 'kasperwhite'});
    this.setState({
      messages,
      message: ''
    })
  }

  renderMessage = ({item, index}) => {
    return(
      <View style={item.sender === 'kasperwhite' ? styles.myMessage : styles.message}>
        <View style={styles.messageAvatar}>
          <Avatar
            size={40}
            rounded
            containerStyle={{margin: 0, padding: 0}}
            source={require("../../assets/cat.jpg")}
          />
        </View>
        <View style={styles.messageContent}>
          <Text style={styles.messageSender}>{item.sender}</Text>
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
      </View>
    );
  }

  render(){
    return(
      <KeyboardAvoidingView behavior="padding" enabled keyboardVerticalOffset={80}>
        <View style={styles.main}>
          <ScrollView
            ref={ref => this.scrollView = ref}
            onContentSizeChange={()=>{this.scrollView.scrollToEnd({animated: true})}}
          >
            <FlatList
              data={this.state.messages}
              renderItem={this.renderMessage}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.flatList}
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
          inputStyle={{fontSize: 20}}
          containerStyle={styles.messageInputCont}
          onChangeText={(text) => this.setState({ message: text })}
          value={this.state.message}
          multiline
        />
      </View>
    </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  main: {
    height: '100%',
    flexDirection: 'column',
    backgroundColor: '#e0e0eb'
  },
  flatList: {
    flexDirection: 'column',
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  message: {
    flexDirection: 'row',
    marginVertical: 5,
    alignSelf: 'flex-start'
  },
  myMessage: {
    flexDirection: 'row-reverse',
    marginVertical: 5,
    alignSelf: 'flex-end'
  },
  messageAvatar: {
    margin: 5
  },
  messageContent: {
    backgroundColor: '#193367',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    maxWidth: 200
  },
  messageSender: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 3
  },
  messageText: {
    color: '#fff'
  },
  messageInput: {
    borderColor: '#fff',
    paddingLeft: 10,
    paddingTop: 3,
    paddingBottom: 0,
    maxHeight: 65,
  },
  messageInputCont: {
    alignSelf: 'flex-end',
    backgroundColor: '#fff'
  }
})

export default Room;