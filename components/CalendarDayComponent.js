import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Database from "../Database2";


const weekDaysNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

class CalendarDayComponent extends React.Component {
  constructor(props) {
    super(props);
    this.onDayPress = this.onDayPress.bind(this);
  }

  getContentStyle() {
    const { state, marking = {}, date, current } = this.props;
    const style= {
      content: {},
      text: {
        color: '#181c26'
      }
    };

   
      if (state === 'today') {
        style.text.color = '#fff';
        style.content.borderRadius = 50;
        if(marking.status==='great')
          style.content.backgroundColor = 'green';
        else  if(marking.status==='neutral')
          style.content.backgroundColor = 'blue';
        else  if(marking.status==='bad')
          style.content.backgroundColor = 'red';
          else 
          style.content.backgroundColor = 'gray';
      }
      else if(marking.status==='bad')
        {
          
          style.text.color = '#fff';
          style.content.backgroundColor = '#dd8f90';
          style.content.borderRadius = 50;
        }
     else if(marking.status==='neutral')
        {
          
          style.text.color = '#fff';
          style.content.backgroundColor = '#8f90dd';
          style.content.borderRadius = 50;
        }
        else if(marking.status==='great')
        {
          
          style.text.color = '#fff';
          style.content.backgroundColor = '#8fdd90';
          style.content.borderRadius = 50;
        }



    if (state === 'disabled') {
      style.text.color = '#c1c2c1';
    } 

    return style;
  }

  getFooterTextStyle() {
    const { marking = {} } = this.props;
    const style = {
      color: '#c1c2c1',
      fontSize:10
    };

    if (marking.inventory > 0) {
      style.color = '#4caf50';
    }
    return style;
  }

  getInventoryCount() {
    const { marking = {} } = this.props;
  //  if (typeof marking === 'object') {
   //   if (marking.inventory >= 0) {
        return marking.task;
   //   }
  //  }
    return '';
  }

  onDayPress() {
    this.props.onPress(this.props.date);
   /*  console.log(this.props);
    console.log(this); */
  }

  render() {
    const contentStyle = this.getContentStyle();

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          {
            this.props.horizontal ?
              <Text style={styles.weekName} numberOfLines={1}>
                {
                  weekDaysNames[this.props.date.weekDay]
                }
              </Text>
              :
              null
          }
        </View>
        <TouchableOpacity
          style={[styles.content, contentStyle.content]}
          onPress={this.onDayPress}
        >
          <Text style={[styles.contentText, contentStyle.text]}>
            {String(this.props.children)}
          </Text>
        </TouchableOpacity>
        <View>
          <Text style={this.getFooterTextStyle()}>
            {this.getInventoryCount()}
          </Text>
        </View>
      </View>
    );
  }
}

CalendarDayComponent.propTypes = {
  children: PropTypes.any,
  state: PropTypes.string,
  marking: PropTypes.any,
  horizontal: PropTypes.bool,
  date: PropTypes.object,
  onPress: PropTypes.func.isRequired,
  current: PropTypes.string
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 7,
    marginRight: 7
  },
  weekName: {
    width: 32,
    textAlign: 'center',
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: '#7c7c7c'
  },
  content: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center'
  },
  contentText: {
    fontSize: 18
  }
});

export default CalendarDayComponent;
