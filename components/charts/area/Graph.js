import React, {
    Component,
    PropTypes,
  } from 'react';
  import {
    ART,
    Dimensions,
    StyleSheet,
    Text,
    View,
  } from 'react-native';
  
  const {
    Group,
    Shape,
    Surface,
  } = ART;
  
  import * as graphUtils from './graph-utils';
  
  
  const PaddingSize = 15;
  const TickWidth = 40;

  const dimensionWindow = Dimensions.get('window');
  
  export default class AreaChart extends Component {
    constructor() {
        super();
        this.state = {
            graphWidth: 0,
            graphHeight: 0,
            linePath: '',
          };
       
      }
    static defaultProps = {
     
    };
  
    
  
    componentWillMount() {
      this.computeNextState(this.props);
    }
  
    componentWillReceiveProps(nextProps) {
      this.computeNextState(nextProps);
    }
  
    computeNextState(nextProps) {
      const {
        data,
       
        xAccessor,
        yAccessor,
      } = nextProps;
  
      let  width= Math.round(dimensionWindow.width * 0.9)
      let height= Math.round(dimensionWindow.height * 0.5)

      const graphWidth = width - PaddingSize * 2;
      const graphHeight = height - PaddingSize * 2;
  
      const lineGraph = graphUtils.createLineGraph({
        data,
        xAccessor,
        yAccessor,
        width: graphWidth,
        height: graphHeight,
      });
  
      this.setState({
        graphWidth,
        graphHeight,
        linePath: lineGraph.path,
      ticks: lineGraph.ticks,
      scale: lineGraph.scale,
    });
  }

  render() {
    const {
      yAccessor,
    } = this.props;

    const {
      graphWidth,
      graphHeight,
      linePath,
      ticks,
      scale,
    } = this.state;

    const {
      x: scaleX,
    } = scale;

    const tickXFormat = scaleX.tickFormat(null, '%b %d');

  
      return (
        <View style={styles.container}>
          <Surface width={graphWidth} height={graphHeight}>
            <Group x={0} y={0}>
              <Shape
                d={linePath}
                stroke='#e377c2'
                strokeWidth={1}
              />
            </Group>
          </Surface>


          <View key={'ticksX'} style={styles.ticksXContainer}>
          {ticks.map((tick, index) => {
            const tickStyles = {};
            tickStyles.width = TickWidth;
            tickStyles.left = tick.x - (TickWidth / 2);
{/* 
if((index%5 )!=0)
return ;
else */}

            return (
              <Text key={index} style={[styles.tickLabelX, tickStyles]}>
                {tickXFormat(tick.datum.time )}
              </Text>
            );
          })}
        </View>

        <View key={'ticksY'} style={styles.ticksYContainer}>
          {ticks.map((tick, index) => {
            const value = yAccessor(tick.datum);

            const tickStyles = {};
            tickStyles.width = TickWidth;
            tickStyles.left = tick.x - Math.round(TickWidth * 0.5);

            tickStyles.top = tick.y + 2 - Math.round(TickWidth * 0.65);
            {/* if((index%5 )!=0)
return ;
else */}
            return (
              <View key={index} style={[styles.tickLabelY, tickStyles]}>
                <Text style={styles.tickLabelYText}>
                  {value}
                </Text>
              </View>
            );
          })}
        </View>

        <View key={'ticksYDot'} style={styles.ticksYContainer}>
          {ticks.map((tick, index) => {
           {/*  if((index%5 )!=0)
return ;
else */}
            return (
              
            <View
              key={index}
              style={[styles.ticksYDot, {
                left: tick.x,
                top: tick.y,
              }]}
            />
          )
          
          })}
        </View>
        </View>
      );
    }
  }
  
  const styles = StyleSheet.create({
    container: {
        marginTop:30,
      
    },
  
    tickLabelX: {
      position: 'absolute',
      bottom: 0,
      fontSize: 12,
      textAlign: 'center',
    },
  
    ticksYContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
    },

    ticksXContainer: {
        position: 'relative',
        bottom: -20,
        marginBottom:20,
        left: 0,
      },
  
    tickLabelY: {
      position: 'absolute',
      left: 0,
      backgroundColor: 'transparent',
    },
  
    tickLabelYText: {
      fontSize: 12,
      textAlign: 'center',
    },
  
    ticksYDot: {
      position: 'absolute',
      width: 2,
      height: 2,
      backgroundColor: '#000',
      borderRadius: 100,
    },
  });