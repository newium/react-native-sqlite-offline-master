let i=0;

const bear = {

getNeutral : function()
{
    let imageLine;
    i++;
    num=(i%4)+1;
    //let num=Math.floor(Math.random() * (3 - 1 + 1)) + 1;
   switch (num) {
    case 1:
        imageLine = require("../../assets/avatars/bear/neutral1.png");
        break;
      case 2:
        imageLine = require("../../assets/avatars/bear/neutral2.png");
        break;
      case 3:
        imageLine = require("../../assets/avatars/bear/neutral3.png");
        break;
      default:
        imageLine = require("../../assets/avatars/bear/neutral4.png");
   }
    return imageLine;

},

getGreat : function()
{
    let imageLine;
    i++;
    num=(i%5)+1;
    //let num=Math.floor(Math.random() * (4 - 1 + 1)) + 1;
   switch (num) {
    case 1:
        imageLine = require("../../assets/avatars/bear/great1.png");
        break;
      case 2:
        imageLine = require("../../assets/avatars/bear/great2.png");
        break;
      case 3:
        imageLine = require("../../assets/avatars/bear/great3.png");
        break;
        case 4:
            imageLine = require("../../assets/avatars/bear/great4.png");
            break;
      default:
        imageLine = require("../../assets/avatars/bear/great5.png");
   }
    return imageLine;
    
},

getBad : function()
{
    let imageLine;
    i++;
    num=(i%4)+1;
    //let num=Math.floor(Math.random() * (3 - 1 + 1)) + 1;
   switch (num) {
    case 1:
        imageLine = require("../../assets/avatars/bear/bad1.png");
        break;
      case 2:
        imageLine = require("../../assets/avatars/bear/bad2.png");
        break;
      case 3:
        imageLine = require("../../assets/avatars/bear/bad3.png");
        break;
      default:
        imageLine = require("../../assets/avatars/bear/bad4.png");
   }
    return imageLine;
},

getDead : function()
{
    let imageLine = require("../../assets/avatars/bear/dead.png");
    return imageLine;
    
}

}
export default bear;