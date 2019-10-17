import React, {Component} from 'react';
import { Text, ScrollView, FlatList, View } from 'react-native';
import { ListItem, Icon, Tooltip, ButtonGroup, Button } from 'react-native-elements';

const DeleteRoomButton = (props) => {
  return(
    <Button
      title='Delete Room'
      onPress={() => props.deleteRoom()}
      buttonStyle={{backgroundColor: '#b30000'}}
      containerStyle={{marginTop: 30}}
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
    const roomKey = '1234-7618-234'
    this.setState({
      roomId,
      roomName,
      roomKey
    })
  }

  deleteRoom = () => {
    console.log('Delete Room', this.state.roomId)
  }

  addUser = () => {
    console.log('Add User')
  }

  deleteUser = (id) => {
    console.log('Delete User', id)
  }

  openUserPage = (id) => {
    console.log('Open User Page', id)
  }

  renderUser = ({ item }) => (
    <ListItem
      title={item.username}
      bottomDivider
      leftAvatar={{ source: require('../../assets/cat.jpg')}}
      rightElement={
        <View style={{flexDirection: 'row'}}>
          <OpenUserPageButton openUserPage={this.openUserPage} userId={item.id}/>
          <DeleteUserButton deleteUser={this.deleteUser} userId={item.id}/>
        </View>
      }
    />
  )

  render(){
    return(
      <ScrollView>
        <ListItem title='Name' rightTitle={this.state.roomName}/>
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