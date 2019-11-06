import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import { observer, inject } from 'mobx-react';

class ContactAddition extends Component {
  constructor(props){
    super(props);

    this.state = {
      search: ''
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Add Contact',
      headerStyle: {
        backgroundColor: '#222222'
      },
      headerTintColor: '#09C709',
      headerTitleStyle: {
        fontWeight: 'bold',
      }
    };
  };

  updateSearch = search => {
    this.setState({ search: search.trim() });
  };

  resetForm = () => {
    this.setState({search: ''});
  }

  addContact = () => {
    console.log(this.state.search.trim());
    this.resetForm();
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
            onChangeText={(t) => this.updateSearch(t)}
            maxLength={20}
          />
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
            onPress={this.addContact}
            type='clear'
            disabled={!this.state.search}
            disabledStyle={{opacity: 0.6}}
          />
        </View>
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

export default inject('contactStore')(observer(ContactAddition));