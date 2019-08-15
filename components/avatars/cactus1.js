let i=0;

const cactus1 = {

getNeutral : function()
{
    let imageLine;
    i++;
    num=(i%4)+1;
    //let num=Math.floor(Math.random() * (3 - 1 + 1)) + 1;
   switch (num) {
    case 1:
        imageLine = require("../../assets/avatars/cactus1/neutral1.png");
        break;
      case 2:
        imageLine = require("../../assets/avatars/cactus1/neutral2.png");
        break;
      case 3:
        imageLine = require("../../assets/avatars/cactus1/neutral3.png");
        break;
      default:
        imageLine = require("../../assets/avatars/cactus1/neutral4.png");
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
        imageLine = require("../../assets/avatars/cactus1/great1.png");
        break;
      case 2:
        imageLine = require("../../assets/avatars/cactus1/great2.png");
        break;
      case 3:
        imageLine = require("../../assets/avatars/cactus1/great3.png");
        break;
        case 2:
            imageLine = require("../../assets/avatars/cactus1/great5.png");
            break;
          case 3:
            imageLine = require("../../assets/avatars/cactus1/great6.png");
            break;
      default:
        imageLine = require("../../assets/avatars/cactus1/great4.png");
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
        imageLine = require("../../assets/avatars/cactus1/bad1.png");
        break;
      case 2:
        imageLine = require("../../assets/avatars/cactus1/bad2.png");
        break;
      case 3:
        imageLine = require("../../assets/avatars/cactus1/bad3.png");
        break;
      default:
        imageLine = require("../../assets/avatars/cactus1/bad1.png");
   }
    return imageLine;
},

getDead : function()
{
    let imageLine = require("../../assets/avatars/cactus1/dead.png");
    return imageLine;
    
}

}
export default cactus1;