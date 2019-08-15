import React, { Component } from "react";
import { withNavigation } from "react-navigation";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import Database from "../../Database2";
//import Icon from "react-native-vector-icons/MaterialIcons";
import { Icon } from "react-native-elements";

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





const db = new Database();

class AvatarSelectItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
         
          avatarSelector:sun2,
         
    
        };
        
      }


componentDidMount(){
    this.avatarSwitcher();
}



    avatarSwitcher= () =>
    {
      switch(this.props.avatar.avatarID)
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

render() {
    let imageLine;
    if(this.props.buyable)
        imageLine=this.state.avatarSelector.getGreat();
    else
        imageLine=this.state.avatarSelector.getNeutral();



    
  return (
      <TouchableOpacity
      onPress={()=>{
          this.props.onPress()
          console.log('hey')}}
          style={this.props.buyable?'':{backgroundColor:'#aaa',color:'#ccc'}} 
          >
    <View style={[styles.listItem,{height:100,
     borderBottomColor:'#ddd',borderBottomWidth:2}
     ]}>
    <View style={{width:'33%'}} > 
    <Image   key={this.props.avatar.avatarId} 
    style={{ height: "100%",  width: "100%", resizeMode: "contain" }}
            source={imageLine}/>
 </View>
 <View style={{width:'4%'}}></View>
            <View style={styles.infoPad}>
            <View style={styles.listItem}><Text>{this.props.avatar.avatarName}</Text><Text>{this.props.avatar.avatarPrice}</Text></View>
            <View style={{height:20}}></View>
            <View><Text style={{fontSize: 14}}>{this.props.avatar.description}</Text></View>
        </View>
        <View style={{width:'3%'}}></View>
    </View>
    </TouchableOpacity>
  );
}
}

const styles = StyleSheet.create({
listItem: {
  width: "100%",
  marginBottom: 5,
 
  backgroundColor: "#fff",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
 
  fontSize:22,
},

infoPad: {
    width:'60%',
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
}
});

export default AvatarSelectItem;
