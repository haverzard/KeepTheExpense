import React, { Component } from 'react'
import { StyleSheet, Text, TextInput, View, Image, Button, Picker, Modal } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import {NavigationContainer} from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { AddMenu, MainMenu, ShowMenu } from './components/Assets'
import Database from './Database'

const Stack = createStackNavigator()

let db = new Database()

export default class Main extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={ MainMenu }
            options={{
              headerStyle: {
                backgroundColor: '#f4511e',
                height: 60,
              },
            }}
          />
          <Stack.Screen
            name="Add Expenses"
            component={ AddMenu }
            options={{
              headerStyle: {
                backgroundColor: '#f4511e',
                height: 60,
              },
            }}
          />
          <Stack.Screen
            name="Show Expenses"
            component={ ShowMenu }
            options={{
              headerStyle: {
                backgroundColor: '#f4511e',
                height: 60,
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 10,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menubar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0FF',
  },
  title: {
    fontSize: 17
  }
});
