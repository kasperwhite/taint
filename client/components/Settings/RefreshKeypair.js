import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, ListView, AsyncStorage, Alert } from 'react-native';
import { Button, ListItem } from 'react-native-elements';
import moment from 'moment';
import TaintButton from '../Shared/TaintButton';
import { inject, observer } from 'mobx-react';
import Loading from '../Shared/Loading';

class RefreshKeypair extends Component {
  constructor(props){
    super(props);
    
    this.state = {

    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Refresh key pair',
      headerStyle: {
        backgroundColor: '#222222',
        alignContent: 'center'
      },
      headerTintColor: '#09C709',
      headerTitleStyle: {
        fontWeight: 'bold',
      }
    };
  };

  componentDidMount() {
    this.props.settingsStore.getKeypairData();
  }

  onRefresh = () => {
    Alert.alert(
      'Refreshing key pair',
      'App may freeze for a while, are you sure you want to continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          style: 'default',
          onPress: () => { this.props.settingsStore.refreshKeypair() } 
        }
      ]
    )
  }

  render() {
    const { keypairDataIsLoading, keypairIsRefreshing, settings } = this.props.settingsStore;

    if(keypairDataIsLoading){
      return(
        <View style={styles.emptyScreen}>
          <Loading size={'large'}/>
        </View>
      )
    } else {
      return(
        <ScrollView style={styles.screen}>
          <View style={styles.infoBlock}>
            <ListItem
              title={'Last refreshing'}
              rightTitle={moment(new Date(settings.keyPairLastRefresh)).toNow(true) + ' ago'}
              titleStyle={styles.infoTitle}
              rightTitleStyle={styles.infoRightTitle}
              containerStyle={styles.infoListContainer}
              bottomDivider
            />
            <ListItem
              title={'Key'}
              rightTitle={'RSA-1024'}
              titleStyle={styles.infoTitle}
              rightTitleStyle={styles.infoRightTitle}
              containerStyle={styles.infoListContainer}
              bottomDivider
            />
            {/* <ListItem
              title={'Key type'}
              rightTitle={'RSA'}
              titleStyle={styles.infoTitle}
              rightTitleStyle={styles.infoRightTitle}
              containerStyle={styles.infoListContainer}
              bottomDivider
            />
            <ListItem
              title={'Key size'}
              rightTitle={'1024 bits'}
              titleStyle={styles.infoTitle}
              rightTitleStyle={styles.infoRightTitle}
              containerStyle={styles.infoListContainer}
              bottomDivider
            /> */}
          </View>
          {
            keypairIsRefreshing
            ? <Loading size={'large'}/>
            : <TaintButton title='Refresh' onPress={this.onRefresh}/>
          }
        </ScrollView>
      )
    }
  }
  
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#151516',
    padding: 10
  },
  emptyScreen: {
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#151516'
  },
  infoBlock: {
    marginBottom: 20
  },
  infoTitle: {
    color: '#fff'
  },
  infoRightTitle: {
    color: 'grey',
    width: 200,
    textAlign: 'right'
  },
  infoListContainer: {
    backgroundColor: '#151516',
    paddingHorizontal: 10
  },
})

export default inject('settingsStore')(observer(RefreshKeypair));