import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';

class DialogList extends Component {
  constructor(props){
    super(props)

    this.state = {
      
    }
  }

  render(){

    return(
      <ScrollView>
        {
          this.props.rooms.map((r, i) => (
            <ListItem
              key={i}
              title={r.name}
              bottomDivider
              badge={{
                value: 15,
                textStyle: styles.roomBadgeText,
                containerStyle: styles.roomBadgeCont
              }}
              containerStyle={styles.roomCont}
              titleStyle={styles.roomTitle}
              onPress={() => console.log(r.messages)}
            />
          ))
        }
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  roomCont: {
    justifyContent: 'center',
    alignContent: 'center',
    height: 60,
    paddingHorizontal: 20
  },
  roomTitle: {
    fontSize: 17
  },
  roomBadgeText: {
    color: 'orange',
    paddingHorizontal: 5
  },
  roomBadgeCont: {

  }
})

export default DialogList;