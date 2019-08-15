let i=0;

const boy = {

getNeutral : function()
{
    let imageLine;
    i++;
    num=(i%3)+1;
    //let num=Math.floor(Math.random() * (3 - 1 + 1)) + 1;
   switch (num) {
    case 1:
        imageLine = require("../../assets/avatars/boy/neutral1.png");
        break;
      case 2:
        imageLine = require("../../assets/avatars/boy/neutral2.png");
        break;
      case 3:
        imageLine = require("../../assets/avatars/boy/neutral3.png");
        break;
      default:
        imageLine = require("../../assets/avatars/boy/neutral1.png");
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
        imageLine = require("../../assets/avatars/boy/great1.png");
        break;
      case 2:
        imageLine = require("../../assets/avatars/boy/great2.png");
        break;
      case 3:
        imageLine = require("../../assets/avatars/boy/great3.png");
        break;
      default:
        imageLine = require("../../assets/avatars/boy/great4.png");
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
        imageLine = require("../../assets/avatars/boy/bad1.png");
        break;
      case 2:
        imageLine = require("../../assets/avatars/boy/bad2.png");
        break;
      case 3:
        imageLine = require("../../assets/avatars/boy/bad3.png");
        break;
      default:
        imageLine = require("../../assets/avatars/boy/bad4.png");
   }
    return imageLine;
},

getDead : function()
{
    let imageLine = require("../../assets/avatars/boy/dead.png");
    return imageLine;
    
}

}
export default boy;