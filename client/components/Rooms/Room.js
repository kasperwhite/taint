import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, KeyboardAvoidingView,
  FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Input, Icon, Avatar, Button, Overlay } from 'react-native-elements';
import moment from 'moment';
import { observer, inject } from 'mobx-react';

import Loading from '../Shared/Loading';

const MessageOverlay = (props) => (
  <Overlay
    isVisible={props.isVisible}
    onBackdropPress={props.toggleOverlay}
    borderRadius={20}
    height={60}
    windowBackgroundColor='rgba(0,0,0,0.6)'
    overlayStyle={{backgroundColor: '#222222'}}
  >
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'space-around',
        width: '100%',
        height: '100%',
        backgroundColor: '#222222',
        
      }}
    >
      {/* <Button
        title='Edit'
        titleStyle={{color: '#09C709'}}
        type='clear'
        buttonStyle={{paddingVertical: 10}}
        onPress={() => props.editMessage(props.messageId)}
      /> */}
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
      let message;
      if(i % 2 == 0){
        message = {
          id: i,
          sender: 'kasper',
          createdAt: '2019-10-22T02:39:58.638Z',
          updatedAt: '2019-10-22T02:39:58.638Z',
          text: 'Hello!Hello!Hello!Hello!Hello!Hello!'
        };
      } else {
        message = {
          id: i,
          sender: 'kasperwhite',
          createdAt: '2019-10-22T02:39:58.638Z',
          updatedAt: '2019-10-22T02:39:58.638Z',
          text: 'Hello!Hello!Hello!Hello!Hello!Hello!'
        };
      }
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

  // SEND MESSAGE OPERATION
  sendMessage = () => {
    let {message} = this.state;
    console.log('Send Message', message.trim());
    this.setState({message: ''})
  }

  // EDIT MESSAGE OPERATION
  editMessage = (id) => {
    console.log('Edit Message', id);
    this.toggleOverlay();
  }

  // DELETE MESSAGE OPERATION
  deleteMessage = (id) => {
    console.log('Delete Message', id);
    this.toggleOverlay();
  }

  toggleOverlay = () => {
    this.setState({isVisible: !this.state.isVisible});
  }

  selectMessage = (item) => {
    if(item.sender === 'kasperwhite'){
      this.setState({selectedMessageId: item.id});
      this.toggleOverlay();
    }
  }

  renderMessage = ({item, index}) => {
    return(
      <View style={item.sender === 'kasperwhite' ? styles.myMessage : styles.message} key={item.id}>
        <TouchableOpacity
          style={styles.messageContent}
          onPress={() => this.selectMessage(item)}
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
          {
            !this.props.roomMessageStore.isLoading
            ? <FlatList
              data={this.state.messages}
              renderItem={this.renderMessage}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.flatList}
              ref={ref => this.scrollView = ref}
              onContentSizeChange={()=>{this.scrollView.scrollToEnd({animated: true})}}
              removeClippedSubviews={true}
            />
            : <Loading/>
          }
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
    paddingHorizontal: 15,
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
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 5
  },
  messageText: {
    color: '#fff',
    fontSize: 16
  },
  messageTime: {
    alignSelf: 'flex-end',
    color: '#fff',
    fontSize: 10
  },
  messageInput: {
    borderBottomWidth: 0,
    paddingHorizontal: 15,
    maxHeight: 65,
    backgroundColor: '#B4B1B1',
    borderRadius: 10,
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

export default inject('roomMessageStore')(observer(Room));