import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { ListItem, CheckBox } from 'react-native-elements';

class RoomUsersSelect extends Component {
  constructor(props){
    super(props);

    this.state = {
      contacts: [
        {id: 0, username: 'kaper'},
        {id: 1, username: 'kaper'},
        {id: 2, username: 'kaper'},
        {id: 3, username: 'kaper'},
        {id: 4, username: 'kaper'},
      ],
      checked: false,
      selectedUserId: ''
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Select Users',
      headerStyle: {
        backgroundColor: '#222222',
        alignContent: 'center'
      },
      headerTintColor: '#09C709',
      headerTitleStyle: {
        fontWeight: 'bold',
      }
    };
  };

  selectUser = (id) => {
    this.setState({selectedUserId: id})
  }

  renderContact = ({ item }) => (
    <ListItem
      title={item.username}
      bottomDivider
      leftAvatar={{ source: require('../../assets/cat.jpg')}}
      containerStyle={{backgroundColor: '#151516'}}
      titleStyle={{color: '#fff'}}
      onPress={() => this.selectUser(item.id)}
    />
  )

  render(){
    return(
      <View
        style={{
          height: '100%',
          flexDirection: 'column',
          backgroundColor: '#151516'
        }}
      >
        <FlatList
          keyExtractor={item => item.id.toString()}
          data={this.state.contacts}
          renderItem={this.renderContact}
        />
      </View>
    )
  }
}

export default RoomUsersSelect;