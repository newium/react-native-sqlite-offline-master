let i=0;

const earth = {

getNeutral : function()
{
    let imageLine;
    i++;
    num=(i%3)+1;
    //let num=Math.floor(Math.random() * (3 - 1 + 1)) + 1;
   switch (num) {
    case 1:
        imageLine = require("../../assets/avatars/earth/neutral1.png");
        break;
      case 2:
        imageLine = require("../../assets/avatars/earth/neutral2.png");
        break;
      case 3:
        imageLine = require("../../assets/avatars/earth/neutral3.png");
        break;
      default:
        imageLine = require("../../assets/avatars/earth/neutral1.png");
   }
    return imageLine;

},

getGreat : function()
{
    let imageLine;
    i++;
    num=(i%4)+1;
    //let num=Math.floor(Math.random() * (4 - 1 + 1)) + 1;
   switch (num) {
    case 1:
        imageLine = require("../../assets/avatars/earth/great1.png");
        break;
      case 2:
        imageLine = require("../../assets/avatars/earth/great2.png");
        break;
      case 3:
        imageLine = require("../../assets/avatars/earth/great3.png");
        break;
      default:
        imageLine = require("../../assets/avatars/earth/great4.png");
   }
    return imageLine;
    
},

getBad : function()
{
    let imageLine;
    i++;
    num=(i%3)+1;
    //let num=Math.floor(Math.random() * (3 - 1 + 1)) + 1;
   switch (num) {
    case 1:
        imageLine = require("../../assets/avatars/earth/bad1.png");
        break;
      case 2:
        imageLine = require("../../assets/avatars/earth/bad2.png");
        break;
      case 3:
        imageLine = require("../../assets/avatars/earth/bad3.png");
        break;
      default:
        imageLine = require("../../assets/avatars/earth/bad1.png");
   }
    return imageLine;
},

getDead : function()
{
    let imageLine = require("../../assets/avatars/earth/dead.png");
    return imageLine;
    
}

}
export default earth;