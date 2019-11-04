import React,{Component} from 'react';
import { View, FlatList, ScrollView, StyleSheet } from 'react-native';
import { ListItem, Avatar, Icon, Button, SearchBar, Input } from 'react-native-elements';
import { observer, inject } from 'mobx-react';

const ContactPanel = (props) => (
  <View style={{flexDirection: 'row'}}>
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
  </View>
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
    buttonStyle={{marginHorizontal: 3}}
    containerStyle={{
      padding: 0,
      flexDirection: 'column',
      justifyContent: 'center',
      alignContent: 'center'
    }}
    onPress={() => props.addContact()}
    type='clear'
    disabled={!props.search}
    disabledStyle={{opacity: 0.6}}
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
      ],
      fContacts: [],
      search: '',
      isLoading: false,
      isCancelVis: false
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
      )
    };
  }

  componentDidMount(){
    this.setState({fContacts: this.state.contacts});
  }

  // ADD CONTACT OPERATION
  addContact = () => {
    console.log('Add Contact', this.state.search);
  }

  // DELETE CONTACT OPERATION
  deleteContact = (id) => {
    console.log('Delete', id);
  }

  clearSearchField = () => {
    this.setState({
      search: '',
      isCancelVis: false,
      fContacts: this.state.contacts
    })
  }

  updateSearch = search => {
    if(!search){
      this.setState({fContacts: this.state.contacts, isCancelVis: false});
    } else {
      const contacts = this.state.contacts;
      this.setState({
        fContacts: contacts.filter(el => el.username.includes(search)),
        isCancelVis: true
      })
    }
    this.setState({ search });
  };

  renderContact = ({item, index}) => {
    return(
      <ListItem
        title={item.username}
        leftAvatar={{source: item.avatar}}
        bottomDivider
        rightElement={
          <ContactPanel
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
        <View style={styles.searchCont}>
          <Input
            value={this.state.search}
            placeholder='Find...'
            placeholderTextColor='#737373'
            containerStyle={{width: '82%', borderBottomWidth: 1, borderBottomColor: '#fff'}}
            inputStyle={styles.searchInput}
            inputContainerStyle={styles.searchInputCont}
            onChangeText={(t) => this.updateSearch(t.replace(/\s/g,''))}
            maxLength={20}
          />
          <AddContactButton addContact={this.addContact} search={this.state.search}/>
        </View>
      <ScrollView>
        <FlatList
          data={this.state.fContacts}
          renderItem={this.renderContact}
          keyExtractor={i => i.id.toString()}
          contentContainerStyle={{
            paddingBottom: 20,
            marginVertical: 0
          }}
        />
      </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  searchCont: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'center',
    paddingTop: 5,
    paddingHorizontal: 5,
    paddingBottom: 10,
    backgroundColor: '#222222'
  },
  searchInput: {
    padding: 5,
    color: '#fff'
  },
  searchInputCont: {
    borderBottomWidth: 0
  }
})

export default inject('appStore')(observer(Contacts));