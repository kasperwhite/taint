import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { ListItem, CheckBox, Button, Icon } from 'react-native-elements';

class RoomUsersSelect extends Component {
  constructor(props){
    super(props);

    this.state = {
      contactsForSelect: []
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
      },
      headerRight: (
        <Button
          icon={
            <Icon
              name='check'
              type='font-awesome'
              color='#09C709'
              size={21}
            />
          }
          containerStyle={{width: 50, marginRight: 5}}
          onPress={navigation.getParam('handleSubmit')}
          type='clear'
        />
      )
    };
  };

  componentDidMount(){
    this.props.navigation.setParams({ 
      handleSubmit: this.handleSubmit
    });
    const contacts = this.props.navigation.getParam('contacts');
    const contactsForSelect = contacts.map((c) => {
      return { _id: c._id, username: c.username, checked: false }
    })
    this.setState({ contactsForSelect });
  }

  toggleCheckbox = (_id) => {
    const changedContact = this.state.contactsForSelect.find((c) => c._id === _id);
    changedContact.checked = !changedContact.checked;
    const contactsForSelect = Object.assign([], this.state.contactsForSelect, changedContact);
    this.setState({ contactsForSelect });
  }

  handleSubmit = () => {
    const selectedUsers = this.state.contactsForSelect.filter(el => el.checked);
    this.props.navigation.getParam('handleUsersSelect')(selectedUsers);
    this.props.navigation.goBack();
  }

  renderContact = ({ item }) => (
    <ListItem
      title={item.username}
      bottomDivider
      leftAvatar={{ source: require('../../assets/cat.jpg')}}
      containerStyle={{backgroundColor: '#151516'}}
      titleStyle={{color: '#fff'}}
      rightElement={
        <CheckBox
          key={item._id}
          containerStyle={{margin: 0}}
          size={18}
          checked={this.state.contactsForSelect.find(el => el._id === item._id).checked}
          onPress={() => this.toggleCheckbox(item._id)}
        />
      }
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
          keyExtractor={item => item._id.toString()}
          data={this.state.contactsForSelect}
          renderItem={this.renderContact}
        />
      </View>
    )
  }
}

export default RoomUsersSelect;