import React, {Component} from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";





//const line=require('../../assets/images/01.jpg')
//const line=require('../../assets/images/pikachu-gif-png-3.gif')
class AvatarBar extends Component  {
  constructor() {
    super();
    this.state = {
      currentFace:4
    };
  }

  componentDidMount() {
    this._interval = setInterval(() => {
      let num=(this.state.currentFace+1)%6 ;
        this.state.currentFace=num;
        this.forceUpdate()
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

render () {
  let imageLine=require('../../assets/images/01.jpg');
  switch(this.state.currentFace)
   {
     case 1:
        imageLine=require('../../assets/images/01.jpg')
        break;
     case 2:
            imageLine=require('../../assets/images/02.jpg')  
            break;
            case 3:
                imageLine=require('../../assets/images/03.jpg')
                break;
             case 4:
                    imageLine=require('../../assets/images/04.jpg')  
                    break;
                    case 5:
                        imageLine=require('../../assets/images/05.jpg')
                        break;
                     case 0:
                            imageLine=require('../../assets/images/06.jpg')  
                            break;
                            default:
                            imageLine=require('../../assets/images/01.jpg')

   }
  
 


  return (


    <View style={styles.avatarBar}>
    <TouchableOpacity style={styles.avatar} onPress={()=>
    {
      console.log(this.state.currentFace);
    }}>
  
    
    <Image key={this.state.currentFace} style={{height:"100%",width:"100%",resizeMode:"center"}} source= {imageLine} />
    
    </TouchableOpacity>
    <View style={styles.info}>
        <View style={styles.stars}>
        <Text>stars </Text>
        </View>
        <View style={styles.time}>
        <Text>time </Text>
        </View>
        <View style={styles.health}>
        <Text>health </Text>
        </View>
    </View>
  </View>
)};
}
const styles = StyleSheet.create({
  avatarBar: {
    width: "100%",
    height:148,
    marginBottom: 5,
    padding: 10,
    backgroundColor: "#eee",
    flexDirection: "row",
    alignItems: "stretch",
  },
  avatar: {
    width: "50%",
    backgroundColor: "#fff",
   
  },
  info: {
    flexDirection: "column",
    alignItems: "stretch",
    flexGrow:1,
    
  },
  stars:{
    backgroundColor: "#54e",
    flexDirection: "row",
    flexGrow:1,
  },
  time:{
    backgroundColor: "#40b",
    flexDirection: "row",
    flexGrow:1,
},
health:{
    backgroundColor: "#b24",
    flexDirection: "row",
    flexGrow:1,
},
});

export default AvatarBar;