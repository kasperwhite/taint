import React, { Component } from 'react';
import { Text, View, StyleSheet, KeyboardAvoidingView, FlatList } from 'react-native';
import { Input, Icon, Button } from 'react-native-elements';
import moment from 'moment';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { MD5 } from 'crypto-js';

import Loading from '../Shared/Loading';

const UserTypingComponent = (props) => {
  const { typingUsers } = props;

  return (
    <View style={{ width: '100%', alignSelf: 'flex-end', paddingVertical: 2, paddingHorizontal: 5 }}>
      <Text style={{ color: '#797575', fontStyle: 'italic', fontSize: 15 }}>
        { 
          typingUsers.length 
          ? typingUsers.length > 2 
            ? `${typingUsers[0]} and other ${typingUsers.length-1} is typing ...` 
            : `${typingUsers.join(' and ')} is typing ...` 
          : ''
        }
      </Text>
    </View>
  )
}

const EstablishStatusComponent = (props) => (
  <View style={{flexDirection: 'column', alignItems: 'center', width: 200}}>
    <Icon
      name='md-sync' 
      type='ionicon'
      color='#09C709'
      size={45}
    />
    { props.establishIsLoading
    ? <View>
        <Text style={{color: 'grey', fontSize: 16, textAlign: 'center', marginBottom: 10}}>Establishment group key started...</Text>
        <Text style={{color: 'grey', fontSize: 16, fontWeight: 'bold', textAlign: 'center'}}>Do not leave</Text>
      </View> 
    : <View>
        <Text style={{color: '#fff', fontSize: 30, textAlign: 'center'}}>{props.joinedUsers}/{props.allUsers}</Text>
        <Text style={{color: 'grey', fontSize: 16, textAlign: 'center'}}>users joined for establishment group key</Text>
      </View>
    }
  </View>
)

const RequestGroupKeyStatusComponent = (props) => (
  <View style={{flexDirection: 'column', alignItems: 'center', width: 200}}>
    <Icon
      name='md-key'
      type='ionicon'
      color='#09C709'
      size={40}
    />
    { props.error
        ? <View>
            <Text style={{color: 'grey', fontSize: 16, textAlign: 'center', marginBottom: 10}}>No one is there now</Text>
            <Text style={{color: 'grey', fontSize: 16, fontWeight: 'bold', textAlign: 'center'}}>Try again later</Text>
          </View>
        : <View>
            <Text style={{color: 'grey', fontSize: 16, textAlign: 'center', marginBottom: 10}}>Seems like you do not have group key. Trying to request...</Text>
            <Text style={{color: 'grey', fontSize: 16, fontWeight: 'bold', textAlign: 'center'}}>Do not leave</Text>
          </View>
    }
  </View>
)

class Room extends Component {
  constructor(props){
    super(props)

    this.state = {
      message: '',
      typingTimeoutId: ''
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

    this.props.roomMessageStore.roomId = this.props.navigation.getParam('roomId');
    this.props.roomMessageStore.roomType = this.props.navigation.getParam('roomType');
  }

  async componentDidMount(){
    await this.props.roomMessageStore.initialize();
  }

  componentWillUnmount(){
    this.props.roomMessageStore.leaveRoom();
    this.props.roomMessageStore.resetEstablish();
    if(this.state.typingTimeoutId){ clearTimeout(this.state.typingTimeoutId) }
    this.props.roomMessageStore.emitUserTyping('typingEnd');
  }

  openInfo = () => {
    this.props.navigation.navigate('RoomInfo', { roomId: this.props.roomMessageStore.roomId })
  }

  // SEND MESSAGE OPERATION
  sendMessage = async () => {
    let {message} = this.state;
    this.setState({ message: '' });
    message = message.trim();
    await this.props.roomMessageStore.postRoomMessage({ text: message })
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

  onContentSizeChange = () => {
    this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
    this.props.roomMessageStore.refresh = false;
  }

  onUserType = (text) => {
    this.setState({ message: text });
    this.props.roomMessageStore.emitUserTyping('typingStart');

    if(this.state.typingTimeoutId){ clearTimeout(this.state.typingTimeoutId) }
    this.state.typingTimeoutId = setTimeout(() => {
      this.props.roomMessageStore.emitUserTyping('typingEnd');
    }, 3000)
  }

  render(){
    const room = this.props.roomStore.getRoom(this.props.roomMessageStore.roomId);
    const { establishStandby, establishIsLoading, requestGroupKeyIsLoading, 
      requestGroupKeyError, messagesIsLoading, messagesIsSuccess, messagesIsLoaded, 
      messages, postMessageIsLoading, roomType, typingUsers} = this.props.roomMessageStore;

    if(establishStandby && roomType == 'secure'){
      return(
        <View style={styles.emptyScreen}>
          <EstablishStatusComponent
            allUsers={this.props.roomMessageStore.allSocketUsers.length}
            joinedUsers={this.props.roomMessageStore.joinedUsers.length}
            roomUsers={room.users.length}
            establishIsLoading={establishIsLoading}
          />
        </View>
      )
    } else if(requestGroupKeyIsLoading || requestGroupKeyError){
      return(
        <View style={styles.emptyScreen}>
          <RequestGroupKeyStatusComponent
            error={requestGroupKeyError}
          />
        </View>
      )
    } else if(messagesIsLoading){
      return(
        <View style={styles.emptyScreen}>
          <Loading size={'large'}/>
        </View>
      )
    } else if(!messagesIsSuccess && messagesIsLoaded) {
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
              ref={(ref) => { this.flatListRef = ref; }}
              inverted
              data={toJS(messages)}
              renderItem={this.renderMessage}
              keyExtractor={item => item._id.toString()}
              contentContainerStyle={styles.flatList}
              windowSize={10}
              removeClippedSubviews={true}
              onContentSizeChange={this.onContentSizeChange}
              ListHeaderComponent={
                <UserTypingComponent typingUsers={toJS(typingUsers)}/>
              }
            />
            <View style={styles.messageInputCont}>
              <Input
                placeholder='Type message...'
                placeholderTextColor='#737373'
                containerStyle={{width: '84%', paddingHorizontal: 0}}
                inputContainerStyle={styles.messageInput}
                inputStyle={{fontSize: 20, borderColor: '#222222', paddingVertical: 5}}
                onChangeText={this.onUserType}
                value={this.state.message}
                multiline
              />
              <View style={{width: '14%', justifyContent: 'center', alignItems: 'center'}}>
                {
                  postMessageIsLoading
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
    paddingVertical: 5
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
    backgroundColor: '#009C00',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 15,
    maxWidth: 200,
    minWidth: 100
  },
  messageContent: {
    backgroundColor: '#007B00', 
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 15,
    maxWidth: 200,
    minWidth: 100,
  },
  messageSender: {
    color: '#fff',
    fontSize: 13,
    opacity: 0.8,
    fontStyle: 'italic',
    fontWeight: 'bold'
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
    maxHeight: 70,
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