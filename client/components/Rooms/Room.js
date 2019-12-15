import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, KeyboardAvoidingView,
  FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Input, Icon, Avatar, Button, Overlay } from 'react-native-elements';
import moment from 'moment';
import { observer, inject } from 'mobx-react';

import Loading from '../Shared/Loading';

import { MD5 } from 'crypto-js';

class Room extends Component {
  constructor(props){
    super(props)

    this.state = {
      message: ''
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
    const roomName = this.props.navigation.getParam('roomName');
    this.props.navigation.setParams({ openInfo: this.openInfo, roomName });
    const roomId = this.props.navigation.getParam('roomId');
    this.props.roomMessageStore.roomId = roomId;
  }

  async componentDidMount(){
    await this.props.roomMessageStore.getRoomMessages();
    if(this.props.roomMessageStore.messagesIsSuccess) {
      this.props.roomMessageStore.joinRoom({
        roomDeleteHandler: this.props.navigation.navigate
      });
    }
  }

  componentWillUnmount(){
    this.props.roomMessageStore.leaveRoom();
  }

  openInfo = () => {
    this.props.navigation.navigate('RoomInfo', { roomId: this.props.roomMessageStore.roomId })
  }

  // SEND MESSAGE OPERATION
  sendMessage = async () => {
    let {message} = this.state;
    message = message.trim();
    await this.props.roomMessageStore.postRoomMessage({
      text: message,
      hash: MD5(message).toString()
    })
    this.setState({message: ''});
  }

  renderMessage = ({item, index}) => {
    const isMyMessage = item.sender._id === this.props.authStore.user._id;
    return(
      <View
        style={isMyMessage ? styles.myMessage : styles.message}
        key={item._id}
      >
        <View style={isMyMessage ? styles.myMessageContent : styles.messageContent}>
          <Text style={styles.messageSender}>{item.sender.username}</Text>
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.messageTime}>{moment(item.createdAt).format('LT')}</Text>
        </View>
      </View>
    );
  }

  render(){
    if(this.props.roomMessageStore.messagesIsLoading){
      return(
        <View style={styles.emptyScreen}>
          <Loading size={'large'}/>
        </View>
      )
    } else if(!this.props.roomMessageStore.messagesIsSuccess) {
      return(
        <View style={styles.emptyScreen}>
          <Text style={{color: 'grey', fontSize: 20}}>Something went wrong</Text>
          <Text style={{color: 'grey', fontSize: 20}}>Try again later</Text>
        </View>
      );
    } else {
      return(
        <KeyboardAvoidingView behavior="padding" enabled keyboardVerticalOffset={80}>
          <View style={styles.main}>
            <FlatList
              inverted
              data={this.props.roomMessageStore.messages}
              renderItem={this.renderMessage}
              keyExtractor={item => item._id.toString()}
              contentContainerStyle={styles.flatList}
              removeClippedSubviews={true}
            />
            <View style={styles.messageInputCont}>
              <Input
                placeholder='Type message...'
                placeholderTextColor='#737373'
                containerStyle={{width: '84%', paddingHorizontal: 0}}
                inputContainerStyle={styles.messageInput}
                inputStyle={{fontSize: 20, borderColor: '#222222'}}
                onChangeText={(text) => this.setState({ message: text })}
                value={this.state.message}
                multiline
              />
              <View style={{width: '14%', justifyContent: 'center', alignItems: 'center'}}>
                {
                  this.props.roomMessageStore.postMessageIsLoading
                  ? <Loading size={'large'}/>
                  : <Button
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
                }
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      )
    }
  }
}

const styles = StyleSheet.create({
  emptyScreen: {
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#151516'
  },
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
  myMessageContent: {
    backgroundColor: 'rgb(9, 90, 9)',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    maxWidth: 200,
    minWidth: 100
  },
  messageContent: {
    backgroundColor: 'rgb(9, 60, 9)',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    maxWidth: 200,
    minWidth: 100,
  },
  messageSender: {
    color: '#fff',
    fontSize: 13,
    opacity: 0.6,
    fontStyle: 'italic'
  },
  messageText: {
    color: '#fff',
    fontSize: 18
  },
  messageTime: {
    alignSelf: 'flex-end',
    color: '#fff',
    fontSize: 10
  },
  messageInput: {
    borderBottomWidth: 0,
    paddingHorizontal: 10,
    maxHeight: 65,
    backgroundColor: '#B4B1B1',
    borderRadius: 10
  },
  messageInputCont: {
    width: '100%',
    paddingVertical: 5,
    paddingHorizontal: 8,
    alignSelf: 'flex-end',
    backgroundColor: '#222222',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center'
  }
})

export default inject('authStore','roomStore', 'roomMessageStore')(observer(Room));