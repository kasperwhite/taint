import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, KeyboardAvoidingView,
  FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Input, Icon, Avatar, Button, Overlay } from 'react-native-elements';

const MessageOverlay = (props) => (
  <Overlay
    isVisible={props.isVisible}
    onBackdropPress={props.toggleOverlay}
    borderRadius={20}
    height={110}
    windowBackgroundColor='rgba(0,0,0,0.6)'
    overlayStyle={{}}
  >
    <View style={{flexDirection: 'column', justifyContent: 'space-around', width: '100%', height: '100%'}}>
      <Button
        title='Edit'
        titleStyle={{color: '#193367'}}
        type='clear'
        buttonStyle={{paddingVertical: 10}}
        onPress={() => props.editMessage(props.messageId)}
      />
      <Button
        title='Delete'
        titleStyle={{color: '#193367'}}
        type='clear'
        buttonStyle={{paddingVertical: 10}}
        onPress={() => props.deleteMessage(props.messageId)}
      />
    </View>
  </Overlay>
)

class Room extends Component {
  constructor(props){
    super(props)

    this.state = {
      roomId: 1,
      roomName: '',
      message: '',
      isVisible: false,
      isLoading: false,
      selectedMessageId: 0,
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
          onPress={navigation.getParam('openInfo')}
          type='clear'
        />
      )
    };
  };

  componentWillMount(){
    this.props.navigation.setParams({ 
      openInfo: this.openInfo
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

  openInfo = () => {
    const {roomId, roomName} = this.state;
    this.props.navigation.navigate('RoomInfo', { roomId, roomName })
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

  editMessage = (id) => {
    console.log('Edit Message', id)
  }

  deleteMessage = (id) => {
    console.log('Delete Message', id)
  }

  toggleOverlay = () => {
    this.setState({isVisible: !this.state.isVisible});
  }

  selectMessage = (id) => {
    this.setState({selectedMessageId: id});
    this.toggleOverlay();
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
        <TouchableOpacity
          style={styles.messageContent}
          onPress={() => this.selectMessage(item.id)}
          activeOpacity={0.9}
        >
          <Text style={styles.messageSender}>{item.sender}</Text>
          <Text style={styles.messageText}>{item.text}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render(){
    if(this.state.isLoading){
      return(
        <View style={{height: '100%', flexDirection: 'column', justifyContent: 'center'}}>
          <ActivityIndicator color="#193367" size='large'/>
        </View>
      )
    } else {
    return(
      <KeyboardAvoidingView behavior="padding" enabled keyboardVerticalOffset={80}>
        <View style={styles.main}>
          <MessageOverlay
            isVisible={this.state.isVisible}
            toggleOverlay={this.toggleOverlay}
            messageId={this.state.selectedMessageId}
            editMessage={this.editMessage}
            deleteMessage={this.deleteMessage}
          />
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