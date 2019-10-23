import React, {Component} from 'react';
import { Text, ScrollView, FlatList, View, Alert } from 'react-native';
import { ListItem, Icon, Tooltip, ButtonGroup, Button } from 'react-native-elements';

const DeleteRoomButton = (props) => {
  return(
    <Button
      title='Delete Room'
      onPress={() => props.deleteRoom()}
      buttonStyle={{backgroundColor: '#b30000'}}
      containerStyle={{marginVertical: 20}}
    />
  )
}

const AddUserButton = (props) => {
  return(
    <Button
      icon={
        <Icon
          name='plus'
          type='font-awesome'
          color='#fff'
          size={15}
        />
      }
      containerStyle={{borderRadius: 30, backgroundColor: '#193367', width: 30, height: 30}}
      onPress={props.addUser}
      type='clear'
    />
  )
}

const DeleteUserButton = (props) => (
  <Button
    icon={
      <Icon
        name='minus-circle'
        type='font-awesome'
        color='#b30000'
        size={15}
      />
    }
    buttonStyle={{marginHorizontal: 3}}
    containerStyle={{padding: 0}}
    onPress={() => props.deleteUser(props.userId)}
    type='clear'
  />
)

const OpenUserPageButton = (props) => (
  <Button
    icon={
      <Icon
        name='user'
        type='font-awesome'
        color='#193367'
        size={15}
      />
    }
    buttonStyle={{marginHorizontal: 3}}
    containerStyle={{padding: 0}}
    onPress={() => props.openUserPage(props.userId)}
    type='clear'
  />
)

class RoomInfo extends Component {
  constructor(props){
    super(props);

    this.state = {
      roomId: 1,
      roomName: '',
      roomType: '',
      roomKey: '',
      roomTime: 2981,
      users: [
        {id: 0, username: 'kasper'},
        {id: 1, username: 'kasperw'},
        {id: 2, username: 'kasperwe'},
        {id: 3, username: 'kasperwer'},
      ]
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Information',
      headerStyle: {
        backgroundColor: '#193367'
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      }
    };
  };

  componentWillMount(){
    const roomId = this.props.navigation.getParam('roomId');
    const roomName = this.props.navigation.getParam('roomName');
    const roomKey = '1234-7618-234';
    const roomType = 'Private';
    this.setState({
      roomId,
      roomName,
      roomKey,
      roomType
    })
  }

  // DELETE ROOM OPERATION
  deleteRoom = () => {
    console.log('Delete Room', this.state.roomId)
  }

  // ADD USER OPERATION
  addUser = () => {
    console.log('Add User');
    this.props.navigation.navigate('SelectUsers');
  }

  deleteUser = (id) => {
    console.log('Delete User', id)
    Alert.alert(
      'Delete User',
      'Are you sure you want to delete this user?',
      [
        { text: 'Cancel', style: 'cancel', onPress: () => {console.log('Canceled')} },
        { text: 'Delete', style: 'default', onPress: () => {console.log('Deleted')} }
      ]
    )
  }

  renderUser = ({ item }) => (
    <ListItem
      title={item.username}
      bottomDivider
      leftAvatar={{ source: require('../../assets/cat.jpg')}}
      rightElement={
        <View style={{flexDirection: 'row'}}>
          <DeleteUserButton deleteUser={this.deleteUser} userId={item.id}/>
        </View>
      }
    />
  )

  render(){
    return(
      <ScrollView>
        <ListItem title='Name' rightTitle={this.state.roomName}/>
        <ListItem title='Type' rightTitle={this.state.roomType}/>
        <ListItem title='Key' rightTitle={this.state.roomKey}/>
        <ListItem title='Time' rightTitle={`${Math.floor(this.state.roomTime/60)}m`}/>
        <ListItem title='Users' rightTitle={`${this.state.users.length}`} bottomDivider/>
        <FlatList
          keyExtractor={item => item.id.toString()}
          data={this.state.users}
          renderItem={this.renderUser}
          ListHeaderComponent={
            <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
              <AddUserButton addUser={this.addUser}/>
              <Text style={{marginLeft: 10}}>Add user</Text>
            </View>
          }
          ListHeaderComponentStyle={{marginVertical: 10, marginHorizontal: 20}}
        />
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <DeleteRoomButton deleteRoom={this.deleteRoom}/>
        </View>
      </ScrollView>
    )
  }
}

export default RoomInfo;