import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, Switch } from 'react-native';
import { Overlay, Input, Button, Slider, ButtonGroup, ListItem, Icon, Avatar } from 'react-native-elements';
import { observer, inject } from 'mobx-react';
import Loading from '../Shared/Loading';
import TaintButton from '../Shared/TaintButton';
import { avatarsUrl } from '../../mobx/config';

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

class RoomCreate extends Component {
  constructor(props){
    super(props);

    this.state = {
      isRoomSecure: false,
      roomName: '',
      timeValue: 1,
      roomUsers: []
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Create room',
      headerStyle: {
        backgroundColor: '#222222'
      },
      headerTintColor: '#09C709',
      headerTitleStyle: {
        fontWeight: 'bold',
      }
    };
  };

  componentDidMount = async () => {
    await this.props.contactStore.getContacts();
  }

  resetForm = () => {
    this.setState({roomName: '', timeValue: 1, roomUsers: []})
  }

  handleSubmit = async () => {
    const { timeValue, roomName, roomUsers, isRoomSecure } = this.state;
    const result = await this.props.roomStore.postRoom({
      type: isRoomSecure ? 'secure' : 'nonsecure',
      time: timeValue,
      name: roomName,
      users: roomUsers.map(el => { return el._id })
    });
    if(result.success){
      const room = result.res;
      this.props.navigation.navigate('Room', { roomId: room._id, roomName: room.name, roomType: room.type });
      this.resetForm();
    } else {
      console.log(result);
    }
  }

  addUser = () => {
    this.props.navigation.navigate('RoomUsersSelect', { 
      handleUsersSelect: this.handleUsersSelect,
      contacts: this.props.contactStore.contacts
    });
  }

  deleteUser = (id) => {
    const roomUsers = Object.assign([], this.state.roomUsers);
    roomUsers.splice(roomUsers.indexOf(roomUsers.find(el => el._id == id)), 1);
    this.setState({ roomUsers });
  }

  handleUsersSelect = (users) => {
    this.setState({ roomUsers: users}) // delete checked field
  }

  renderUser = ({ item }) => (
    <ListItem
      title={item.username}
      bottomDivider
      leftElement={
        <Avatar
          rounded
          size='small'
          source={{uri: avatarsUrl + item.avatarId}}
        />
      }
      containerStyle={{backgroundColor: '#151516'}}
      titleStyle={{color: '#fff'}}
      rightElement={
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
          onPress={() => this.deleteUser(item._id)}
          type='clear'
        />
      }
    />
  )

  onSwitchToggle = () => {
    this.setState({ isRoomSecure: !this.state.isRoomSecure })
  }

  render(){
    const { isRoomSecure } = this.state;
    return(
      <View style={styles.form}>
        <ScrollView>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
          {/* <Icon
            name='unlock'
            type='font-awesome'
            color='#09C709'
            size={22}
          /> */}
          <Text style={{color: isRoomSecure ? '#fff' : '#09C709', textAlign: 'right'}}>Non-secure</Text>
          <Switch
            value={this.state.isRoomSecure}
            onValueChange={this.onSwitchToggle}
            thumbColor='#09C709'
            trackColor={{ false: '#099609', true: '#099609' }}
            style={{ marginHorizontal: 10 }}
          />
          {/* <Icon
            name='lock'
            type='font-awesome'
            color='#09C709'
            size={22}
          /> */}
          <Text style={{color: !isRoomSecure ? '#fff' : '#09C709', textAlign: 'left'}}>Secure</Text>
        </View>
        <Input
          value={this.state.roomName}
          onChangeText={(n) => this.setState({roomName: n.replace(/\s/g,'')})}
          placeholder='Name'
          inputStyle={styles.input}
          inputContainerStyle={styles.inputContainer}
          maxLength={25}
        />
        <View style={{display: isRoomSecure ? 'flex' : 'none', paddingHorizontal: 10, marginVertical: 10}}>
          <View style={{flexDirection: 'row'}}>
            <Icon
              name='clock-o'
              type='font-awesome'
              color='#09C709'
              size={19}
            />
            <Text
              style={{textAlign:'left', color: '#fff', marginLeft: 5}}
            >Lifetime: <Text style={{color: '#fff', fontWeight: 'bold'}}>{this.state.timeValue}</Text> hours</Text>
          </View>
          <Slider
            value={this.state.timeValue}
            onValueChange={timeValue => this.setState({ timeValue })}
            step={1}
            maximumValue={12}
            minimumValue={1}
            thumbTintColor='#167B14'
            style={styles.slider}
            trackStyle={styles.sliderTrack}
          />
        </View>
        <FlatList
          keyExtractor={item => item._id.toString()}
          data={this.state.roomUsers}
          renderItem={this.renderUser}
          contentContainerStyle={{paddingHorizontal: 10, marginVertical: 10}}
          ListHeaderComponent={
              <ListItem
                title='Users'
                containerStyle={{backgroundColor: '#151516', padding: 10}}
                titleStyle={{color: '#fff'}}
                bottomDivider
                rightElement={
                  <AddUserButton addUser={this.addUser}/>
                }
                leftElement={
                  <Icon
                    name='users'
                    type='font-awesome'
                    color='#09C709'
                    size={19}
                  />
                }
              />
          }
        />
        <View style={{ marginVertical: 10 }}>
        {
          this.props.roomStore.postRoomIsLoading
          ? <Loading size={'large'}/>
          : <TaintButton
              title='Create'
              disabled={this.state.roomName === ''}
              onPress={this.handleSubmit}
            />
        }
        </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  form: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignContent: 'flex-start', 
    backgroundColor: '#151516',
    height: '100%',
    padding: 15
  },
  input: {
    color: '#fff'
  },
  inputContainer: {
    borderColor: '#167B14',
    marginVertical: 10
  },
  slider: {
    
  },
  sliderTrack: {
    
  }
})

export default inject('roomStore', 'contactStore')(observer(RoomCreate));