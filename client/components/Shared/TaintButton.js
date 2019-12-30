import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

export default TaintButton = (props) => (
  <Button
    title={props.title}
    titleStyle={styles.title}
    containerStyle={styles.container}
    buttonStyle={props.type == 'warning' ? styles.buttonWarning : styles.buttonDefault}
    disabled={props.disabled}
    onPress={props.onPress}
    disabledStyle={styles.disabled}
    disabledTitleStyle={styles.title}
  />
)

const styles = StyleSheet.create({
  title: {
    color: '#151516'
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  buttonDefault: {
    backgroundColor: '#167B14',
    paddingHorizontal: 10
  },
  buttonWarning: {
    backgroundColor: '#C71414',
    paddingHorizontal: 10
  },
  disabled: {
    backgroundColor: '#167B14',
    opacity: 0.6
  }
})