import React, {Component} from 'react';
import { Text, ScrollView, FlatList } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';

class RoomDialog extends Component {
  constructor(props){
    super(props);

    this.state = {
      roomId: 1,
      roomName: '',
      roomKey: '',
      roomTime: 2981,
      users: [
        {id: 0, username: 'kasper'},
        {id: 1, username: 'kasperw'},
        {id: 2, username: 'kasperwe'},
        {id: 3, username: 'kasperwer'},
      ]
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Information',
      headerStyle: {
        backgroundColor: '#193367'
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      }
    };
  };

  componentWillMount(){
    const roomId = this.props.navigation.getParam('roomId');
    const roomName = this.props.navigation.getParam('roomName');
    const roomKey = '1234-7618-234'
    this.setState({
      roomId,
      roomName,
      roomKey
    })
  }

  renderUser = ({ item }) => (
    <ListItem
      title={item.username}
      leftAvatar={{ source: require('../../assets/cat.jpg')}}
      onPress={() => console.log('Do you want to see user page?')}
      onLongPress={() => console.log('Open dialog')}
    />
  )

  render(){
    return(
      <ScrollView>
        <ListItem title='Name' rightTitle={this.state.roomName}/>
        <ListItem title='Key' rightTitle={this.state.roomKey}/>
        <ListItem title='Time' rightTitle={`${Math.floor(this.state.roomTime/60)}m`}/>
        <FlatList
          keyExtractor={item => item.id.toString()}
          data={this.state.users}
          renderItem={this.renderUser}
          ListHeaderComponent={
            <ListItem
              title='Users'
              titleStyle={{margin: 0, padding: 0}}
              bottomDivider
              rightTitle={`${this.state.users.length}`}
            />
          }
        />
      </ScrollView>
    )
  }
}

export default RoomDialog;