let i=0;

const gift = {

getNeutral : function()
{
    let imageLine;
    i++;
    num=(i%4)+1;
    //let num=Math.floor(Math.random() * (3 - 1 + 1)) + 1;
   switch (num) {
    case 1:
        imageLine = require("../../assets/avatars/gift/neutral1.png");
        break;
      case 2:
        imageLine = require("../../assets/avatars/gift/neutral2.png");
        break;
      case 3:
        imageLine = require("../../assets/avatars/gift/neutral3.png");
        break;
      default:
        imageLine = require("../../assets/avatars/gift/neutral4.png");
   }
    return imageLine;

},

getGreat : function()
{
    let imageLine;
    i++;
    num=(i%7)+1;
    //let num=Math.floor(Math.random() * (4 - 1 + 1)) + 1;
   switch (num) {
    case 1:
        imageLine = require("../../assets/avatars/gift/great1.png");
        break;
      case 2:
        imageLine = require("../../assets/avatars/gift/great2.png");
        break;
      case 3:
        imageLine = require("../../assets/avatars/gift/great3.png");
        break;
        case 4:
        imageLine = require("../../assets/avatars/gift/great4.png");
        break;
      case 5:
        imageLine = require("../../assets/avatars/gift/great5.png");
        break;
      case 6:
        imageLine = require("../../assets/avatars/gift/great6.png");
        break;
      default:
        imageLine = require("../../assets/avatars/gift/great7.png");
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
        imageLine = require("../../assets/avatars/gift/bad1.png");
        break;
      case 2:
        imageLine = require("../../assets/avatars/gift/bad2.png");
        break;
      case 3:
        imageLine = require("../../assets/avatars/gift/bad3.png");
        break;
      default:
        imageLine = require("../../assets/avatars/gift/bad4.png");
   }
    return imageLine;
},

getDead : function()
{
    let imageLine = require("../../assets/avatars/gift/dead.png");
    return imageLine;
    
}

}
export default gift;