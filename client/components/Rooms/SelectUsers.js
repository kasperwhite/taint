import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { ListItem, CheckBox } from 'react-native-elements';

class SelectUsers extends Component {
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
      checked: false
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Select Users',
      headerStyle: {
        backgroundColor: '#193367'
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      }
    };
  };

  renderContact = ({ item }) => (
    <ListItem
      title={item.username}
      bottomDivider
      leftAvatar={{ source: require('../../assets/cat.jpg')}}
    />
  )

  render(){
    return(
      <View>
        <FlatList
          keyExtractor={item => item.id.toString()}
          data={this.state.contacts}
          renderItem={this.renderContact}
        />
      </View>
    )
  }
}

export default SelectUsers;