import React,{Component} from 'react';
import { View, FlatList } from 'react-native';
import { ListItem, Icon, Button } from 'react-native-elements';

const DeleteContactButton = (props) => (
  <Button
    icon={
      <Icon
        name='user-times'
        type='font-awesome'
        color='#167B14'
        size={17}
      />
    }
    buttonStyle={{marginHorizontal: 3}}
    containerStyle={{padding: 0}}
    onPress={() => props.deleteContact(props.userId)}
    type='clear'
  />
)

const AddContactButton = (props) => (
  <Button
    icon={
      <Icon
        name='user-plus'
        type='font-awesome'
        color='#167B14'
        size={17}
      />
    }
    containerStyle={{width: 50, marginRight: 5}}
    onPress={props.addContact}
    type='clear'
  />
)

class Contacts extends Component {
  constructor(props){
    super(props);

    this.state = {
      contacts: [
        {id: 0, username: 'Popovich', avatar: require('../../assets/cat.jpg')},
        {id: 1, username: 'Yaroslav', avatar: require('../../assets/cat.jpg')},
        {id: 2, username: 'Vladimir', avatar: require('../../assets/cat.jpg')},
        {id: 3, username: 'Amina', avatar: require('../../assets/cat.jpg')},
        {id: 4, username: 'Ded', avatar: require('../../assets/cat.jpg')},
        {id: 5, username: 'Denis', avatar: require('../../assets/cat.jpg')},
        {id: 6, username: 'Popovich', avatar: require('../../assets/cat.jpg')},
        {id: 7, username: 'Popovich', avatar: require('../../assets/cat.jpg')},
        {id: 8, username: 'Popovich', avatar: require('../../assets/cat.jpg')},
        {id: 9, username: 'Popovich', avatar: require('../../assets/cat.jpg')},
        {id: 10, username: 'Popovich', avatar: require('../../assets/cat.jpg')},
        {id: 11, username: 'Popovich', avatar: require('../../assets/cat.jpg')},
        {id: 12, username: 'Popovich!!!!!!!!!', avatar: require('../../assets/cat.jpg')},
      ]
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Contacts',
      headerStyle: {
        backgroundColor: '#222222'
      },
      headerTintColor: '#09C709',
      headerTitleStyle: {
        fontWeight: 'bold'
      },
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
      ),
      headerRight: (
        <AddContactButton addContact={navigation.getParam('addContact')}/>
      )
    };
  }

  componentDidMount(){
    this.props.navigation.setParams({ 
      addContact: this.addContact
    });
  }

  // ADD CONTACT OPERATION
  addContact = () => {
    this.props.navigation.navigate('ContactAddition');
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
          <DeleteContactButton
            deleteContact={this.deleteContact}
            userId={item.id}
          />
        }
        containerStyle={{backgroundColor: '#151516'}}
        titleStyle={{
          fontSize: 17,
          color: '#fff'
        }}
      />
    )
  }

  render(){
    return(
      <View style={{height: '100%', flexDirection: 'column', backgroundColor: '#151516'}}>
        <FlatList
          data={this.state.contacts}
          renderItem={this.renderContact}
          keyExtractor={i => i.id.toString()}
          contentContainerStyle={{
            paddingBottom: 20,
            marginVertical: 0
          }}
          removeClippedSubviews={true}
        />
      </View>
    )
  }
}

export default Contacts;