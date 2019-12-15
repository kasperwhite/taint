import React from 'react';
import { AsyncStorage, View, Platform } from 'react-native';
import { ListItem, Avatar, Button, Icon } from 'react-native-elements';
import { DrawerNavigatorItems } from 'react-navigation-drawer';
import { observer, inject } from 'mobx-react';

import { avatarsUrl } from '../mobx/config';

export default inject('authStore')(observer(DrawerContent = (props) => {

  const signOut = async () => {
    await props.authStore.signOut();
    props.navigation.navigate('AuthLoading');
  }

  return(
    <View>
      <ListItem
        leftElement={
          <Avatar
            rounded
            source={{uri: avatarsUrl + props.authStore.user.avatarId}}
            size='medium'
          />
        }
        title={props.authStore.user.username}
        titleStyle={{fontWeight: 'bold', color: '#fff', fontSize: 20}}
        containerStyle={{
          height: 130,
          backgroundColor: '#222222',
          paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight
        }}
        rightElement={
          <View style={{flexDirection: 'row'}}>
            <Button
              onPress={signOut}
              type='clear'
              icon={<Icon name='sign-out' type='font-awesome' color='#09C709' size={20}/>}
            />
          </View>
        }
      />
      <DrawerNavigatorItems {...props} labelStyle={{color: '#fff'}}/>
    </View>
  )
}))