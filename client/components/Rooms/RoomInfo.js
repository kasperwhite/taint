import React, {Component} from 'react';
import { Text, ScrollView, FlatList, View, Alert, StyleSheet } from 'react-native';
import { ListItem, Icon, Tooltip, ButtonGroup, Button, Avatar } from 'react-native-elements';
import { observer, inject } from 'mobx-react';
import TaintButton from '../Shared/TaintButton';
import Loading from '../Shared/Loading';
import { avatarsUrl } from '../../mobx/config';
import moment from 'moment';

const AddUserComponent = (props) => (
  <ListItem
    leftElement={
      <Button
        icon={
          <Icon
            name='plus'
            type='font-awesome'
            color='#151516'
            size={20}
          />
        }
        containerStyle={{
          borderRadius: 40,
          backgroundColor: '#167B14',
          width: 40,
          height: 40,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onPress={props.addUser}
        type='clear'
      />
    }
    title={'Add user'}
    titleStyle={{color: '#fff'}}
    containerStyle={styles.infoListItemCont}
  />
)

const DeleteUserButton = (props) => (
  <Button
    icon={
      <Icon
        name='minus-circle'
        type='font-awesome'
        color='#167B14'
        size={18}
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
      room: {},
      isKeyOpened: false
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
      }
    };
  };

  componentWillMount(){
    const roomId = this.props.navigation.getParam('roomId');
    const room = this.props.roomStore.getRoom(roomId);
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
        leftElement={
          <Avatar
            rounded
            size='medium'
            source={{uri: avatarsUrl + item.avatarId}}
          />
        }
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
    const roomKey = this.props.roomMessageStore.roomKey;
    const room = this.state.room;
    const roomName = room.name;
    const selfDestructTime = moment(new Date(room.createdAt)).add(room.time, 'hours').fromNow();

    return(
      <ScrollView
        style={{
          backgroundColor: '#151516'
        }}
      >
        <ListItem
          title='Name'
          rightTitle={roomName.length > 13 ? roomName.slice(0, 13) + '...' : roomName}
          containerStyle={styles.infoListItemCont}
          titleStyle={styles.infoListItemTitle}
          rightTitleStyle={styles.infoListItemRigthTitle}
        />
        {/* <ListItem
          title='Key'
          rightTitle={roomKey ? roomKey.slice(0, 13) + '...' : 'Is not established' }
          containerStyle={styles.infoListItemCont}
          titleStyle={styles.infoListItemTitle}
          rightTitleStyle={styles.infoListItemRigthTitle}
        /> */}
        <ListItem
          title='Key'
          rightTitle={'AES-128'}
          containerStyle={styles.infoListItemCont}
          titleStyle={styles.infoListItemTitle}
          rightTitleStyle={styles.infoListItemRigthTitle}
        />
        <ListItem
          title='Self-destruct time'
          rightTitle={selfDestructTime}
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
          ? <View style={{marginVertical: 20}}><Loading size={'large'}/></View>
          : this.props.roomUserStore.usersIsSuccess
            ? <FlatList
                keyExtractor={item => item._id.toString()}
                data={this.props.roomUserStore.users}
                renderItem={this.renderUser}
                ListHeaderComponent={<AddUserComponent addUser={this.addUser}/>}
              />
            : <View style={{flexDirection: 'column',alignItems: 'center', marginVertical: 20}}>
                <Text style={{color: 'grey', fontSize: 20}}>Something went wrong</Text>
                <Text style={{color: 'grey', fontSize: 20}}>Try again later</Text>
              </View>
        }
        {this.state.room.creator == this.props.authStore.user._id
          ? <TaintButton type='warning' title='Delete Room' onPress={this.deleteRoom}/>
          : null
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
    color: 'grey',
    width: 200,
    textAlign: 'right'
  },
  submitButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 15
  },
  submitButton: {
    backgroundColor: '#C71414'
  }
})

export default inject('authStore','roomStore', 'roomUserStore', 'roomMessageStore', 'contactStore')(observer(RoomInfo));