import React, { Component } from 'react';
import { ScrollView, StyleSheet, Image, ActivityIndicator, View, Text } from 'react-native';
import { Card, Button } from 'react-native-elements';
import Database from '../Database2';
import { Calendar } from 'react-native-calendars';
import CalendarDayComponent from './CalendarDayComponent';

const db = new Database();

export default class ProductDetailsScreen extends Component {
  static navigationOptions = {
    title: 'Product Details',
  }

  constructor() {
    super();
    this.state = {
      isLoading: true,
      product: {},
      id: '',
    };
  }

  componentDidMount() {
    this._subscribe = this.props.navigation.addListener('didFocus', () => {
      const { navigation } = this.props;
      db.productById(navigation.getParam('prodId')).then((data) => {
        console.log(data);
        product = data;
        this.setState({
          product,
          isLoading: false,
          id: product.prodId
        });
      }).catch((err) => {
        console.log(err);
        this.setState = {
          isLoading: false
        }
      })
    });
  }
  
  deleteProduct(id) {
    const { navigation } = this.props;
    this.setState({
      isLoading: true
    });
    db.deleteProduct(id).then((result) => {
      console.log(result);
      this.props.navigation.goBack();
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    })
  }

  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )
    }


    
    return (
      <ScrollView>
        <Card style={styles.container}>
          <View style={styles.subContainer}>
            
            <View>
            <Calendar
          
          dayComponent={CalendarDayComponent}
          minDate={'2019-05-10'}
  // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
  maxDate={'2019-05-23'}
          style={{
            paddingLeft: 0, paddingRight: 0
          }}
          onDayPress={(day) => {console.log('selected day', day)}}
          markedDates={{
            '2019-05-13': {soldOut: false, blocked: false, inventory: 0},
            '2019-05-14': {soldOut: false, blocked: false, inventory: 2},
            '2019-05-15': {soldOut: false, blocked: true, inventory: 0},
            '2019-05-16': {soldOut: false, blocked: true, inventory: 2},
            '2019-05-23': {soldOut: true, blocked: false, inventory: 0},
            '2019-05-24': {soldOut: true, blocked: false, inventory: 2},
            '2019-05-25': {soldOut: true, blocked: true, inventory: 0},
            '2019-05-26': {soldOut: true, blocked: true, inventory: 2}
          }}
         
          
        />
            </View>
            <View>
              <Text style={{fontSize: 16}}>Product ID: {this.state.product.prodId}</Text>
            </View>
            <View>
              <Text style={{fontSize: 16}}>Product Name: {this.state.product.prodName}</Text>
            </View>
            <View>
              <Text style={{fontSize: 16}}>Product Desc: {this.state.product.prodDesc}</Text>
            </View>
            <View>
              <Text style={{fontSize: 16}}>Product Price: {this.state.product.prodPrice}</Text>
            </View>
          </View>
          <View style={styles.detailButton}>
            <Button
              large
              backgroundColor={'#CCCCCC'}
              leftIcon={{name: 'edit'}}
              title='Edit'
              onPress={() => {
                this.props.navigation.navigate('EditProduct', {
                  prodId: `${this.state.id}`,
                });
              }} />
          </View>
          <View style={styles.detailButton}>
            <Button
              large
              backgroundColor={'#999999'}
              color={'#FFFFFF'}
              leftIcon={{name: 'delete'}}
              title='Delete'
              onPress={() => this.deleteProduct(this.state.id)} />
          </View>
        </Card>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  subContainer: {
    flex: 1,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#CCCCCC',
  },
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  detailButton: {
    marginTop: 10
  }
})
