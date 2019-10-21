import React,{Component} from 'react';
import { View, FlatList } from 'react-native';
import { ListItem, Avatar, Icon, Button, SearchBar } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';

const ContactPanel = (props) => (
  <View style={{flexDirection: 'row'}}>
    <Button
      icon={
        <Icon
          name='comment'
          type='font-awesome'
          color='#193367'
          size={17}
        />
      }
      buttonStyle={{marginHorizontal: 3}}
      containerStyle={{padding: 0}}
      onPress={() => props.openDialog(props.userId)}
      type='clear'
    />
    <Button
      icon={
        <Icon
          name='user-times'
          type='font-awesome'
          color='#193367'
          size={17}
        />
      }
      buttonStyle={{marginHorizontal: 3}}
      containerStyle={{padding: 0}}
      onPress={() => props.deleteContact(props.userId)}
      type='clear'
    />
  </View>
)

const AddContactButton = (props) => (
  <Button
    icon={
      <Icon
        name='user-plus'
        type='font-awesome'
        color='#193367'
        size={17}
      />
    }
    buttonStyle={{marginHorizontal: 3}}
    containerStyle={{padding: 0}}
    onPress={() => props.addContact(props.userId)}
    type='clear'
  />
)

class Contacts extends Component {
  constructor(props){
    super(props);

    this.state = {
      contacts: [
        {id: 0, username: 'Popovich', avatar: require('../../assets/cat.jpg')},
        {id: 1, username: 'Popovich', avatar: require('../../assets/cat.jpg')},
        {id: 2, username: 'Popovich', avatar: require('../../assets/cat.jpg')},
        {id: 3, username: 'Popovich', avatar: require('../../assets/cat.jpg')},
        {id: 4, username: 'Popovich', avatar: require('../../assets/cat.jpg')},
        {id: 5, username: 'Popovich', avatar: require('../../assets/cat.jpg')},
        {id: 6, username: 'Popovich', avatar: require('../../assets/cat.jpg')},
        {id: 7, username: 'Popovich', avatar: require('../../assets/cat.jpg')},
        {id: 8, username: 'Popovich', avatar: require('../../assets/cat.jpg')},
        {id: 9, username: 'Popovich', avatar: require('../../assets/cat.jpg')},
        {id: 10, username: 'Popovich', avatar: require('../../assets/cat.jpg')},
        {id: 11, username: 'Popovich', avatar: require('../../assets/cat.jpg')},
        {id: 12, username: 'Popovich', avatar: require('../../assets/cat.jpg')},
        
      ],
      otherContacts: [
        {id: 13, username: 'Popovich', avatar: require('../../assets/cat.jpg')},
        {id: 14, username: 'Popovich', avatar: require('../../assets/cat.jpg')},
        {id: 15, username: 'Popovich', avatar: require('../../assets/cat.jpg')}
      ],
      isLoading: false,
      search: ''
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Contacts',
      headerStyle: {
        backgroundColor: '#193367'
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold'
      },
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
  }

  updateSearch = search => {
    this.setState({ search });
  };

  // OPEN DIALOG WITH USER
  openDialog = (id) => {
    console.log('Open Dialog', id);
  }

  // ADD CONTACT OPERATION
  addContact = (id) => {
    console.log('Add Contact', id);
  }

  // DELETE CONTACT OPERATION
  deleteContact = (id) => {
    console.log('Delete', id);
  }

  renderContact = ({item, index}) => {
    return(
      <ListItem
        title={item.username}
        leftAvatar={{source: item.avatar}}
        bottomDivider
        rightElement={
          this.state.contacts.find(el => el.id === item.id)
          ? <ContactPanel openDialog={this.openDialog} deleteContact={this.deleteContact} userId={item.id}/>
          : <AddContactButton addContact={this.addContact} userId={item.id}/>
        }
      />
    )
  }

  render(){
    return(
      <ScrollView>
        <SearchBar
          value={this.state.search}
          placeholder='Search...'
          onChangeText={this.updateSearch}
          lightTheme={true}
        />
        <FlatList
          data={this.state.contacts}
          renderItem={this.renderContact}
          keyExtractor={i => i.id.toString()}
        />
        <FlatList
          data={this.state.otherContacts}
          renderItem={this.renderContact}
          keyExtractor={i => i.id.toString()}
          ListHeaderComponent={
            <ListItem
              title='Other'
            />
          }
        />
      </ScrollView>
    )
  }
}

export default Contacts;