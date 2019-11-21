import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import { observer, inject } from 'mobx-react';
import Loading from '../Shared/Loading';

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

  addContact = async () => {
    const result = await this.props.contactStore.postContact(this.state.search.trim());
    if(result.success){
      this.props.navigation.navigate('Contacts');
      this.resetForm();
    }
  }

  render(){
    return(
      <View style={{height: '100%', flexDirection: 'column', backgroundColor: '#151516'}}>
        <View style={styles.searchCont}>
          <Input
            value={this.state.search}
            placeholder='Find...'
            placeholderTextColor='#737373'
            containerStyle={{width: '85%', borderBottomWidth: 1, borderBottomColor: '#fff'}}
            inputStyle={styles.searchInput}
            inputContainerStyle={styles.searchInputCont}
            onChangeText={(t) => this.updateSearch(t)}
            maxLength={20}
          />
          <View style={{width: '14%', justifyContent: 'center', alignItems: 'center'}}>
            {
              this.props.contactStore.postContactIsLoading
              ? <Loading size={'small'}/>
              : <Button
                  icon={
                    <Icon
                      name='user-plus'
                      type='font-awesome'
                      color='#167B14'
                      size={19}
                    />
                  }
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
            }
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  searchCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingTop: 5,
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: '#222222'
  },
  searchInput: {
    color: '#fff'
  },
  searchInputCont: {
    borderBottomWidth: 0
  }
})

export default inject('contactStore')(observer(ContactAddition));