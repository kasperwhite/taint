import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, KeyboardAvoidingView,
  FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Input, Icon, Avatar, Button, Overlay } from 'react-native-elements';
import moment from 'moment';

const MessageOverlay = (props) => (
  <Overlay
    isVisible={props.isVisible}
    onBackdropPress={props.toggleOverlay}
    borderRadius={20}
    height={110}
    windowBackgroundColor='rgba(0,0,0,0.6)'
    overlayStyle={{backgroundColor: '#222222'}}
  >
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'space-around',
        width: '100%',
        height: '100%',
        backgroundColor: '#222222'
      }}
    >
      <Button
        title='Edit'
        titleStyle={{color: '#09C709'}}
        type='clear'
        buttonStyle={{paddingVertical: 10}}
        onPress={() => props.editMessage(props.messageId)}
      />
      <Button
        title='Delete'
        titleStyle={{color: '#09C709'}}
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
      messages: []
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('roomName'),
      headerStyle: {
        backgroundColor: '#222222'
      },
      headerTintColor: '#09C709',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerRight: (
        <Button
          icon={
            <Icon
              name='info'
              type='font-awesome'
              color='#09C709'
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
    
  }

  componentDidMount(){
    this.props.navigation.setParams({ 
      openInfo: this.openInfo
    });
    const roomId = this.props.navigation.getParam('roomId');
    const roomName = this.props.navigation.getParam('roomName');
    let messages = [];
    for(let i = 0; i <= 10; i++){
      const message = {
        id: i,
        sender: 'kasper',
        createdAt: '2019-10-22T02:39:58.638Z',
        updatedAt: '2019-10-22T02:39:58.638Z',
        text: 'Hello!Hello!Hello!Hello!Hello!Hello!'
      };
      messages.push(message);
    }
    this.setState({
      roomId,
      roomName,
      messages
    })
  }

  openInfo = () => {
    const {roomId, roomName} = this.state;
    this.props.navigation.navigate('RoomInfo', { roomId, roomName })
  }

  sendMessage = () => {
    let {message} = this.state;
    let messages = Object.assign([], this.state.messages);
    messages.push({id: this.state.messages.length, text: message.trim(), sender: 'kasperwhite'});
    this.setState({
      messages,
      message: ''
    })
  }

  editMessage = (id) => {
    console.log('Edit Message', id);
    this.toggleOverlay();
  }

  deleteMessage = (id) => {
    console.log('Delete Message', id);
    this.toggleOverlay();
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
        {
          item.sender !== 'kasperwhite'
          ? <View style={styles.messageAvatar}>
              <Avatar
                size={35}
                rounded
                containerStyle={{margin: 0, padding: 0}}
                source={require("../../assets/cat.jpg")}
              />
            </View>
          : null
        }
        <TouchableOpacity
          style={styles.messageContent}
          onPress={() => this.selectMessage(item.id)}
          activeOpacity={0.9}
        >
          <Text style={styles.messageSender}>{item.sender}</Text>
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.messageTime}>{moment(item.createdAt).format('LT')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render(){
    if(this.state.isLoading){
      return(
        <View style={{height: '100%', flexDirection: 'column', justifyContent: 'center'}}>
          <ActivityIndicator color="#09C709" size='large'/>
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
          <View style={styles.messageInputCont}>
            <Input
              placeholder='Type message...'
              placeholderTextColor='#737373'
              inputContainerStyle={styles.messageInput}
              inputStyle={{fontSize: 20, borderColor: '#222222'}}
              onChangeText={(text) => this.setState({ message: text })}
              value={this.state.message}
              multiline
            />
            <Button
              icon={
                <Icon
                  name='paper-plane'
                  type='font-awesome'
                  color='#167B14'
                />
              }
              onPress={this.sendMessage}
              type='clear'
              disabled={!this.state.message.trim()}
              disabledStyle={{opacity: 0.6}}
              containerStyle={{flexDirection: 'column', justifyContent: 'center'}}
            />
          </View>
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
    backgroundColor: '#151516'
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
    backgroundColor: '#22593B',
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
  messageTime: {
    alignSelf: 'flex-end',
    color: '#fff',
    fontSize: 10
  },
  messageInput: {
    borderColor: '#fff',
    paddingHorizontal: 15,
    maxHeight: 65,
    backgroundColor: '#B4B1B1',
    borderRadius: 20,
  },
  messageInputCont: {
    paddingRight: 10,
    paddingLeft: 35,
    paddingVertical: 5,
    alignSelf: 'flex-end',
    backgroundColor: '#222222',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignContent: 'center'
  }
})

export default Room;