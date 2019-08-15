let i=0;

const sun2 = {

getNeutral : function()
{
    let imageLine;
    i++;
    num=(i%3)+1;
    //let num=Math.floor(Math.random() * (3 - 1 + 1)) + 1;
   switch (num) {
    case 1:
        imageLine = require("../../assets/avatars/sun2/neutral1.png");
        break;
      case 2:
        imageLine = require("../../assets/avatars/sun2/neutral2.png");
        break;
      case 3:
        imageLine = require("../../assets/avatars/sun2/neutral3.png");
        break;
      default:
        imageLine = require("../../assets/avatars/sun2/neutral1.png");
   }
    return imageLine;

},

getGreat : function()
{
    let imageLine;
    i++;
    num=(i%6)+1;
    //let num=Math.floor(Math.random() * (4 - 1 + 1)) + 1;
   switch (num) {
    case 1:
        imageLine = require("../../assets/avatars/sun2/great1.png");
        break;
      case 2:
        imageLine = require("../../assets/avatars/sun2/great2.png");
        break;
      case 3:
        imageLine = require("../../assets/avatars/sun2/great3.png");
        break;
        case 5:
        imageLine = require("../../assets/avatars/sun2/great5.png");
        break;
      case 6:
        imageLine = require("../../assets/avatars/sun2/great6.png");
        break;
      default:
        imageLine = require("../../assets/avatars/sun2/great4.png");
   }
    return imageLine;
    
},

getBad : function()
{
    let imageLine;
    i++;
    num=(i%5)+1;
    //let num=Math.floor(Math.random() * (3 - 1 + 1)) + 1;
   switch (num) {
    case 1:
        imageLine = require("../../assets/avatars/sun2/bad1.png");
        break;
      case 2:
        imageLine = require("../../assets/avatars/sun2/bad2.png");
        break;
      case 3:
        imageLine = require("../../assets/avatars/sun2/bad3.png");
        break;
        case 4:
        imageLine = require("../../assets/avatars/sun2/bad4.png");
        break;
      default:
        imageLine = require("../../assets/avatars/sun2/bad5.png");
   }
    return imageLine;
},

getDead : function()
{
    let imageLine = require("../../assets/avatars/sun2/dead.png");
    return imageLine;
    
}

}
export default sun2;