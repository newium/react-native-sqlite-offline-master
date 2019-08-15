import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import bear from "../avatars/bear"
import boy from "../avatars/boy"
import cactus1 from "../avatars/cactus1"
import cat3 from "../avatars/cat3"
import earth from "../avatars/earth"
import gift from "../avatars/gift"
import moncyan from "../avatars/moncyan"
import pig4 from "../avatars/pig4"
import sun2 from "../avatars/sun2"
import woman5 from "../avatars/woman5"

import Icon from "react-native-vector-icons/MaterialIcons";

import Database from "../../Database2";
const db = new Database();
//const line=require('../../assets/images/01.jpg')
//const line=require('../../assets/images/pikachu-gif-png-3.gif')
class AvatarBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentFace: '',
      mood: 'neutral',
      avatarSelector:cat3,
      avatars: {},
        initial:0,
    };
    
  }

  shouldComponentUpdate(nextProps,nextState){
    if(nextState.avatars!=this.state.avatars)
      return false;

return true;
  }

  avatarSwitcher= () =>
  {
    switch(this.props.avatarId)
    {
      case 1:
          this.setState({
            avatarSelector:moncyan
          })
      break;
      case 2:
          this.setState({
            avatarSelector:earth
          })
      break;
      case 3:
          this.setState({
            avatarSelector:bear
          })
      break;
      case 4:
          this.setState({
            avatarSelector:boy
          })
      break;
      case 5:
          this.setState({
            avatarSelector:cactus1
          })
      break;
      case 6:
          this.setState({
            avatarSelector:cat3
          })
      break;
      case 7:
          this.setState({
            avatarSelector:gift
          })
      break;
      case 8:
          this.setState({
            avatarSelector:pig4
          })
      break;
      case 9:
          this.setState({
            avatarSelector:woman5
          })
      break;
      case 10:
          this.setState({
            avatarSelector:sun2
          })
      break;
      default:
          this.setState({
            avatarSelector:moncyan
          })
      break;
  
  
  
    }
  }

  componentDidMount() {
 this.setState({
   inital: this.state.inital+1
 })
    this._interval = setInterval(() => {
      this.chooseImage(this.state.mood);
      //this.forceUpdate();
    }, 60000); 

 this.avatarSwitcher();



  

    let health= this.props.currentHealth/this.props.maximumHealth;
    console.warn(health)
    if(health===0)
    {
      this.chooseImage('dead');
      this.setState({
        mood:'dead'
      }),()=>{
        
        this.chooseImage(this.state.mood);
       
          };
    }
    else if(health<0.33)
    {
      this.chooseImage('bad');
      this.setState({
        mood:'bad'
      }),()=>{
        
        this.chooseImage(this.state.mood);
       
          };
    }
    else if(health<0.67)
    {
      
      this.chooseImage('neutral');
  
      this.setState({
        mood:'neutral'
      }),()=>{
        
        this.chooseImage(this.state.mood);
        
          };
    }
    else 
    {
      this.chooseImage('great');
      this.setState({
        mood:'great'
      }),()=>{
        
    this.chooseImage(this.state.mood);
    
      };
    }


  }

  componentWillUnmount() {
     clearInterval(this._interval); 


  }

componentWillReceiveProps(nextProps) {
  if(this.props.currentHealth!=nextProps.currentHealth ||
    this.props.currentAvatarId!=nextProps.currentAvatarId)
  {
    return true;
  }


  if(this.state.mood=="dead" )
  return;
  if(this.props.emotion=="dead" || nextProps.emotion=="dead")
{
  this.chooseImage("dead");
  return;
}
if(this.props.emotion==nextProps.emotion )
{
  console.warn(nextProps.emotion)
  return false;
}
  

 if (this.props !== nextProps) {
 
  this.chooseImage(nextProps.emotion);
  setTimeout(() => {
    this.chooseImage(this.state.mood);
   // this.forceUpdate();
  }, 2000); 
 }
  
}



handleAvatarPress=()=>
{

  this.chooseImage(this.state.mood);
  
}






chooseImage=(emotion)=>
{
  let imageLine;
  if(emotion=='dead')
    {
      imageLine=this.state.avatarSelector.getDead();
    }
   else if(emotion=='bad')
    {
      imageLine=this.state.avatarSelector.getBad();
    }
    else if(emotion=='neutral')
    {
      imageLine=this.state.avatarSelector.getNeutral();
    }
    else 
    {
      imageLine=this.state.avatarSelector.getGreat();
    }
    this.setState({
      currentFace:imageLine,
    });
    return imageLine;
}



  render() {
    let imageLine=this.state.currentFace;
   

    return (
      <View style={styles.avatarBar}>
        <TouchableOpacity
          style={styles.avatar}
          onPress={() => {
            console.log(this.state.currentFace);
            this.state.mood=="dead"?'':this.handleAvatarPress();
          }}
          onLongPress={()=>{
            this.props.triggerShop()
          }}
          >
          <Image
            key={this.state.currentFace}
            style={{ height: "100%",  width: "100%", resizeMode: "contain" }}
            source={imageLine}
          />
        </TouchableOpacity>
        <View style={styles.info}>
          <View style={styles.stars}>
          <Icon name='star' size={30} color='#FFA500'/>
             <Text style={{fontSize: 30, color:'#FFA500'}}> {this.props.points} </Text>
          </View>
          
          <View style={styles.health}>
          <Icon name='favorite' size={26} color='#8B0000'/>
            {/*  <Text style={{fontSize: 26, color:'#8B0000'}}> {this.props.currentHealth}/{this.props.maximumHealth} </Text> */}
          
          <View style={styles.healthbar}><View style={{backgroundColor:'#DC143C',
           borderRadius: this.props.currentHealth==this.props.maximumHealth?15:0,
            borderTopLeftRadius:15,borderBottomLeftRadius:15,
          height:24,width:`${this.props.currentHealth/this.props.maximumHealth*100}%`}}
          ></View></View>
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  avatarBar: {
    width: "100%",
    height: 148,
    marginBottom: 5,
    padding: 10,
    backgroundColor: "#eee",
    flexDirection: "row",
    alignItems: "stretch"
  },
  avatar: {
    width: "50%",
    backgroundColor: "#fff"
  },
  info: {
    flexDirection: "column",
    alignItems: "stretch",
    flexGrow: 1
  },
  stars: {
   /*  backgroundColor: "#54e", */
    flexDirection: "row",
    flexGrow: 1,
    padding: 10,
    fontSize: 30,
    justifyContent:'space-around',
    alignItems: 'center',
  },
  healthbar: {
    marginRight:5,
    marginLeft:10,
    justifyContent:'flex-start',
    alignItems: 'center',
    flexDirection: "row",
    flexGrow: 1,
    borderColor:'#8B0000',
    borderRadius:15,
    borderWidth:1,
    height:26,
    width:'25%'
  },
  health: {
    /* backgroundColor: "#b24", */
    padding: 10,
    flexDirection: "row",
    flexGrow: 1,
    fontSize: 30,
    justifyContent:'space-around',
    alignItems: 'flex-end',
  }
});

export default AvatarBar;
