import React, {Component} from 'react';
import { Text, ScrollView, FlatList, View, Alert, StyleSheet } from 'react-native';
import { ListItem, Icon, Tooltip, ButtonGroup, Button, Avatar } from 'react-native-elements';
import { observer, inject } from 'mobx-react';

import Loading from '../Shared/Loading';

const ControlPanel = (props) => (
  <View style={{flexDirection: 'row', marginRight: 15}}>
    <Button
      icon={
        <Icon
          name='user-plus'
          type='font-awesome'
          color='#09C709'
          size={18}
        />
      }
      containerStyle={{marginRight: 5}}
      onPress={props.addUser}
      type='clear'
    />
    <Button
      icon={
        <Icon
          name='trash'
          type='font-awesome'
          color='#09C709'
          size={18}
        />
      }
      onPress={props.deleteRoom}
      type='clear'
    />
  </View>
)

const DeleteUserButton = (props) => (
  <Button
    icon={
      <Icon
        name='minus-circle'
        type='font-awesome'
        color='#167B14'
        size={15}
      />
    }
    buttonStyle={{marginHorizontal: 3}}
    containerStyle={{padding: 0}}
    onPress={() => props.deleteUser(props.user)}
    type='clear'
  />
)

class RoomInfo extends Component {
  constructor(props){
    super(props);

    this.state = {
      room: {}
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Info',
      headerStyle: {
        backgroundColor: '#222222'
      },
      headerTintColor: '#09C709',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerRight: (
        navigation.getParam('controlIsVisible')
        ? <ControlPanel
            addUser={navigation.getParam('addUser')}
            deleteRoom={navigation.getParam('deleteRoom')}
            room={navigation.getParam('room')}
          />
        : null
      )
    };
  };

  componentWillMount(){
    const roomId = this.props.navigation.getParam('roomId');
    const room = this.props.roomStore.getRoom(roomId);
    this.props.navigation.setParams({ 
      addUser: this.addUser,
      deleteRoom: this.deleteRoom,
      controlIsVisible: room.creator == this.props.authStore.user._id
    });
    this.setState({ room });
  }

  componentDidMount = async () => {
    await this.props.roomUserStore.getRoomUsers(this.state.room._id);
    await this.props.contactStore.getContacts();
  }

  deleteRoom = () => {
    Alert.alert(
      'Delete Room',
      `Are you sure you want to delete ${this.state.room.name} room?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'default',
          onPress: async () => {
            const result = await this.props.roomStore.deleteRoom(this.state.room._id);
            if(result.success){ this.props.navigation.navigate('Rooms') }
          }
        }
      ]
    )
  }

  addUser = () => {
    this.props.navigation.navigate('RoomUsersSelect', {
      handleUsersSelect: this.handleUsersSelect,
      contacts: 
        this.props.contactStore.contacts.filter(
          c => !this.props.roomUserStore.roomUsers.find(u => u._id == c._id)
        )
    });
  }

  handleUsersSelect = async (users) => {
    await this.props.roomUserStore.postRoomUsers(
      this.state.room,
      users.map(u => u._id)
    );
  }

  deleteUser = (user) => {
    Alert.alert(
      'Delete User',
      user._id == this.props.authStore.user._id
      ? `Are you sure you want to leave from room?`
      : `Are you sure you want to kick ${user.username}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: user._id == this.props.authStore.user._id ? 'Leave' :'Delete',
          style: 'default',
          onPress: () => {
            this.props.roomUserStore.deleteRoomUser(this.state.room._id, user._id)
          } 
        }
      ]
    )
  }

  renderUser = ({ item }) => {
    const myId = this.props.authStore.user._id;
    return(
      <ListItem
        title={item.username}
        containerStyle={styles.infoListItemCont}
        titleStyle={styles.infoListItemTitle}
        /* leftElement={
          <Avatar
            rounded
            size='small'
            source={require('../../assets/cat.jpg')}
          />
        } */
        rightElement={
          this.state.room.creator == myId && item._id != myId
          ? <DeleteUserButton deleteUser={this.deleteUser} user={item}/>
          : item._id == myId && this.state.room.creator != myId
          ? <DeleteUserButton deleteUser={this.deleteUser} user={item}/>
          : null
        }
      />
    )
  }

  render(){
    return(
      <ScrollView
        style={{
          backgroundColor: '#151516'
        }}
      >
        <ListItem
          title='Name'
          rightTitle={this.state.room.name}
          containerStyle={styles.infoListItemCont}
          titleStyle={styles.infoListItemTitle}
          rightTitleStyle={styles.infoListItemRigthTitle}
        />
        <ListItem
          title='Key'
          rightTitle={this.state.room.key}
          containerStyle={styles.infoListItemCont}
          titleStyle={styles.infoListItemTitle}
          rightTitleStyle={styles.infoListItemRigthTitle}
        />
        <ListItem
          title='Time'
          rightTitle={`${Math.floor(this.state.room.time/3600)}h`}
          containerStyle={styles.infoListItemCont}
          titleStyle={styles.infoListItemTitle}
          rightTitleStyle={styles.infoListItemRigthTitle}
        />
        <ListItem
          title='Users'
          bottomDivider
          rightTitle={`${this.state.room.users.length}`}
          containerStyle={styles.infoListItemCont}
          titleStyle={styles.infoListItemTitle}
          rightTitleStyle={styles.infoListItemRigthTitle}
        />
        {this.props.roomUserStore.usersIsLoading
        ? <Loading size={'large'}/>
        : <FlatList
            keyExtractor={item => item._id.toString()}
            data={this.props.roomUserStore.roomUsers}
            renderItem={this.renderUser}
          />
        }
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  infoListItemCont: {
    backgroundColor: '#151516'
  },
  infoListItemTitle: {
    color: '#fff'
  },
  infoListItemRigthTitle: {
    color: 'grey'
  }
})

export default inject('authStore','roomStore', 'roomUserStore','contactStore')(observer(RoomInfo));