import React, {Component} from 'react';
import { Text, View } from 'react-native';

class Registration extends Component {
  constructor(props){
    super(props)

    this.state = {

    }
  }

  /*  data without space  */

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Registration',
      headerStyle: {
        backgroundColor: '#193367'
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      }
    };
  };

  render(){
    return(
      <View>
        <Text>Registration</Text>
      </View>
    )
  }
}

export default Registration;