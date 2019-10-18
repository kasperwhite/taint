import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { ListItem, Badge, ButtonGroup, Button, Icon, Overlay, Input } from 'react-native-elements';

import AddRoomOverlay from './AddRoomOverlay';

const SearchButton = () => {
  return(
    <Button
      icon={
        <Icon
          name='search'
          type='font-awesome'
          color='#fff'
          size={21}
        />
      }
      containerStyle={{width: 50, marginRight: 5}}
      onPress={() => console.log('Find Room')}
      type='clear'
    />
  )
}

const AddButton = (props) => {
  return(
    <Button
      icon={
        <Icon
          name='plus'
          type='font-awesome'
          color='#fff'
          size={21}
        />
      }
      containerStyle={{width: 50, marginRight: 5}}
      onPress={props.handlePress}
      type='clear'
    />
  )
}

class RoomList extends Component {
  constructor(props){
    super(props)

    this.state = {
      rooms: [
        {id: 0, name: 'Room1', time: 2798, messages: [{ text: 'Hello' },{ text: 'Hello' },{ text: 'Hello' }]},
        {id: 1, name: 'Room2', time: 2798, messages: [{ text: 'Hello' },{ text: 'Hello' }]},
        {id: 2, name: 'Room3', time: 2798, messages: [{ text: 'Hello' }]},
        {id: 3, name: 'Room4', time: 2798, messages: [{ text: 'Hello' },{ text: 'Hello' },{ text: 'Hello' },{ text: 'Hello' }]},
        {id: 4, name: 'Room5', time: 2798, messages: [{ text: 'Hello' }]},
        {id: 5, name: 'Room1', time: 2798, messages: [{ text: 'Hello' },{ text: 'Hello' },{ text: 'Hello' }]},
        {id: 6, name: 'Room2', time: 2798, messages: [{ text: 'Hello' },{ text: 'Hello' }]},
        {id: 7, name: 'Room3', time: 2798, messages: [{ text: 'Hello' }]},
        {id: 8, name: 'Room4', time: 2798, messages: [{ text: 'Hello' },{ text: 'Hello' },{ text: 'Hello' },{ text: 'Hello' }]},
        {id: 9, name: 'Room5', time: 2798, messages: [{ text: 'Hello' }]},
        {id: 10, name: 'Room1', time: 2798, messages: [{ text: 'Hello' },{ text: 'Hello' },{ text: 'Hello' }]},
        {id: 11, name: 'Room2', time: 2798, messages: [{ text: 'Hello' },{ text: 'Hello' }]},
        {id: 12, name: 'Room3', time: 2798, messages: [{ text: 'Hello' }]},
        {id: 13, name: 'Room4', time: 2798, messages: [{ text: 'Hello' },{ text: 'Hello' },{ text: 'Hello' },{ text: 'Hello' }]},
        {id: 14, name: 'Room5', time: 2798, messages: [{ text: 'Hello' }]}
      ],
      isVisible: false,
      isLoading: false
    }
  };

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Rooms',
      headerStyle: {
        backgroundColor: '#193367',
        alignContent: 'center'
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerRight: (
        <View style={{flexDirection: 'row'}}>
          {/* <SearchButton/> */}
          <AddButton handlePress={navigation.getParam('toggleModal')}/>
        </View>
      ),
      headerLeft: (
        <Button
          icon={
            <Icon
              name='bars'
              type='font-awesome'
              color='#fff'
              size={21}
            />
          }
          containerStyle={{marginLeft: 5}}
          onPress={navigation.openDrawer}
          type='clear'
        />
      )
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({ toggleModal: this.toggleModal });
    // fetch rooms
  }

  toggleModal = () => {
    this.setState({ isVisible: !this.state.isVisible });
  }

  addRoom = (name, time) => {
    let rooms = Object.assign([], this.state.rooms);
    const roomId = this.state.rooms.length;
    rooms.push({id: roomId, name, time, messages: [{ text: 'Hello' }]});
    this.setState({ rooms });
    this.enterRoom(roomId, name);
  }

  enterRoom = (roomId, roomName) => {
    this.props.navigation.navigate('Room', { roomId, roomName })
  }

  renderRoom = ({item, index}) => {
    return(
      <ListItem
        key={index}
        title={item.name}
        bottomDivider
        rightElement={
          <Badge
            value={item.messages.length}
            badgeStyle={{backgroundColor: '#193367', width: 20, height: 20, borderRadius: 20}}/>
        }
        containerStyle={styles.roomCont}
        titleStyle={styles.roomTitle}
        onPress={() => this.enterRoom(item.id, item.name)}
      />
    )
  }

  render(){
    if(this.state.isLoading){
      return(
        <View style={{height: '100%', flexDirection: 'column', justifyContent: 'center'}}>
          <ActivityIndicator color="#193367" size='large'/>
        </View>
      )
    } else {
      return(
        <View>
          <FlatList
            data={this.state.rooms}
            renderItem={this.renderRoom}
            keyExtractor={i => i.id.toString()}
          />
          <AddRoomOverlay
            visible={this.state.isVisible}
            toggle={this.toggleModal}
            addRoom={this.addRoom}
          />
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  roomCont: {
    justifyContent: 'center',
    alignContent: 'center',
    height: 65,
    paddingHorizontal: 20
  },
  roomTitle: {
    fontSize: 17,
    marginBottom: 3
  },
  roomBadgeText: {
    color: 'white',
    paddingHorizontal: 5
  },
  roomBadgeCont: {
    
  }
})

export default RoomList;