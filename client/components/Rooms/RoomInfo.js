import React, {Component} from 'react';
import { Text, ScrollView, FlatList, View, Alert, StyleSheet } from 'react-native';
import { ListItem, Icon, Tooltip, ButtonGroup, Button } from 'react-native-elements';

const DeleteRoomButton = (props) => {
  return(
    <Button
      title='Delete Room'
      titleStyle={{color: '#151516'}}
      onPress={() => props.deleteRoom()}
      buttonStyle={{backgroundColor: '#167B14'}}
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
          color='#151516'
          size={15}
        />
      }
      containerStyle={{borderRadius: 30, backgroundColor: '#167B14', width: 30, height: 30}}
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
        color='#167B14'
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
      containerStyle={styles.infoListItemCont}
      titleStyle={styles.infoListItemTitle}
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
      <ScrollView
        style={{
          backgroundColor: '#151516'
        }}
      >
        <ListItem
          title='Name'
          rightTitle={this.state.roomName}
          containerStyle={styles.infoListItemCont}
          titleStyle={styles.infoListItemTitle}
          rightTitleStyle={styles.infoListItemRigthTitle}
        />
        <ListItem
          title='Key'
          rightTitle={this.state.roomKey}
          containerStyle={styles.infoListItemCont}
          titleStyle={styles.infoListItemTitle}
          rightTitleStyle={styles.infoListItemRigthTitle}
        />
        <ListItem
          title='Time'
          rightTitle={`${Math.floor(this.state.roomTime/60)}m`}
          containerStyle={styles.infoListItemCont}
          titleStyle={styles.infoListItemTitle}
          rightTitleStyle={styles.infoListItemRigthTitle}
        />
        <ListItem
          title='Users'
          rightTitle={`${this.state.users.length}`}
          bottomDivider
          containerStyle={styles.infoListItemCont}
          titleStyle={styles.infoListItemTitle}
          rightTitleStyle={styles.infoListItemRigthTitle}
        />
        <FlatList
          keyExtractor={item => item.id.toString()}
          data={this.state.users}
          renderItem={this.renderUser}
          ListHeaderComponent={
            <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
              <AddUserButton addUser={this.addUser}/>
              <Text style={{marginLeft: 10, color: '#fff'}}>Add user</Text>
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

const styles = StyleSheet.create({
  infoListItemCont: {
    backgroundColor: '#151516'
  },
  infoListItemTitle: {
    color: '#fff'
  },
  infoListItemRigthTitle: {
    color: '#fff'
  }
})

export default RoomInfo;