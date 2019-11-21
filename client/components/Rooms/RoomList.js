import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, FlatList, ActivityIndicator, AsyncStorage } from 'react-native';
import { ListItem, Badge, ButtonGroup, Button, Icon, Overlay, Input } from 'react-native-elements';
import { observer, inject } from 'mobx-react';

import Loading from '../Shared/Loading';

const AddButton = (props) => {
  return(
    <Button
      icon={
        <Icon
          name='plus'
          type='font-awesome'
          color='#09C709'
          size={21}
        />
      }
      containerStyle={{width: 50, marginRight: 5}}
      onPress={() => props.handlePress('RoomCreate')}
      type='clear'
    />
  )
}

class RoomList extends Component {
  constructor(props){
    super(props)

    this.state = { }
  };

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Rooms',
      headerStyle: {
        backgroundColor: '#222222',
        alignContent: 'center'
      },
      headerTintColor: '#09C709',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerRight: (
        <View style={{flexDirection: 'row'}}>
          <AddButton handlePress={navigation.navigate}/>
        </View>
      ),
      headerLeft: (
        <Button
          icon={
            <Icon
              name='bars'
              type='font-awesome'
              color='#09C709'
              size={21}
            />
          }
          containerStyle={{marginLeft: 10}}
          onPress={navigation.openDrawer}
          type='clear'
        />
      )
    };
  };

  componentDidMount(){
    this.props.roomStore.getRooms();
  }

  enterRoom = (roomId) => {
    this.props.navigation.navigate('Room', { roomId })
  }

  renderRoom = ({item, index}) => {
    return(
      <ListItem
        key={index}
        title={item.name}
        bottomDivider
        rightTitle='Up to 9:22pm'
        containerStyle={styles.roomCont}
        titleStyle={styles.roomTitle}
        rightTitleStyle={{fontSize: 12, color: 'grey'}}
        onPress={() => this.enterRoom(item._id)}
      />
    )
  }

  render(){
    if(this.props.roomStore.roomsIsLoading){
      return(
        <View style={styles.emptyScreen}>
          <Loading size={'large'}/>
        </View>
      )
    } else if(!this.props.roomStore.rooms) {
      return(
        <View style={styles.emptyScreen}>
          <Text style={{color: 'grey', fontSize: 20}}>Something went wrong</Text>
        </View>
      )
    } else if(!this.props.roomStore.rooms.length){
      return(
        <View style={styles.emptyScreen}>
          <Text style={{color: 'grey', fontSize: 20}}>Room list is empty</Text>
        </View>
      )
    } else {
      return(
        <View style={{backgroundColor: '#151516', height: '100%'}}>
          <FlatList
            data={this.props.roomStore.rooms}
            renderItem={this.renderRoom}
            keyExtractor={i => i._id.toString()}
            contentContainerStyle={{backgroundColor: '#151516', flexDirection: 'column-reverse'}}
          />
        </View>
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
  roomCont: {
    justifyContent: 'center',
    alignContent: 'center',
    height: 65,
    paddingHorizontal: 20,
    backgroundColor: '#151516'
  },
  roomTitle: {
    fontSize: 17,
    color: '#fff'
  },
  roomBadgeText: {
    color: 'white',
    paddingHorizontal: 5
  },
  roomBadgeCont: {
    
  }
})

export default inject('roomStore')(observer(RoomList));