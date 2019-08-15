/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import ProductScreen from './components/ProductScreen';
import ProductDetailsScreen from './components/ProductDetailsScreen';
import ProductAddScreen from './components/ProductAddScreen';
import ProductEditScreen from './components/ProductEditScreen';
import HabitAddScreen from './components/HabitAddScreen';
import HabitScreen from './components/HabitScreen';
import HabitDetailsScreen from './components/HabitDetailsScreen';
import IconSelect from './components/small-components/IconSelect';
import HabitEditScreen from './components/HabitEditScreen';


const RootStack = createStackNavigator(
  {
    Product: ProductScreen,
    ProductDetails: ProductDetailsScreen,
    AddProduct: ProductAddScreen,
    AddHabit: HabitAddScreen,
    Habit: HabitScreen,
    HabitDetails: HabitDetailsScreen,
    EditHabit: HabitEditScreen,
    EditProduct: ProductEditScreen,
    IconSelect:IconSelect
  },
  {
    initialRouteName: 'Habit',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#779877',
      },
      headerTintColor: '#9bc',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  },
);

const RootContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <RootContainer style={styles.container} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
