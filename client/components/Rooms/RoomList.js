import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, FlatList } from 'react-native';
import { ListItem, Badge, ButtonGroup, Button, Icon } from 'react-native-elements';

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

const AddButton = () => {
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
      onPress={() => console.log('Add Room')}
      type='clear'
    />
  )
}

class RoomList extends Component {
  constructor(props){
    super(props)

    this.state = {
      rooms: [
        {id: 0, name: 'Room1', time: '10:00', messages: { text: 'Hello' }},
        {id: 1, name: 'Room2', time: '10:00', messages: { text: 'Hello' }},
        {id: 2, name: 'Room3', time: '10:00', messages: { text: 'Hello' }},
        {id: 3, name: 'Room4', time: '10:00', messages: { text: 'Hello' }},
        {id: 4, name: 'Room5', time: '10:00', messages: { text: 'Hello' }}
      ]
    }
  };

  static navigationOptions = {
    title: 'Rooms',
    headerStyle: {
      backgroundColor: '#193367',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerRight: (
      <View style={{flexDirection: 'row'}}>
        <SearchButton/>
        <AddButton/>
      </View>
    )
  };

  render(){
    const { navigate } = this.props.navigation;

    const renderRoom = ({item, index}) => {
      return(
        <ListItem
          key={index}
          title={item.name}
          subtitle={item.time}
          bottomDivider
          badge={{ value: 3, textStyle: { color: 'white' } }}
          containerStyle={styles.roomCont}
          titleStyle={styles.roomTitle}
          onPress={() => navigate('Room', { roomId: item.id })}
        />
      )
    }

    return(
      <FlatList
        data={this.state.rooms}
        renderItem={renderRoom}
        keyExtractor={i => i.id.toString()}
      />
    )
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