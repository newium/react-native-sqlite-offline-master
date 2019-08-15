let i=0;

const woman5 = {

getNeutral : function()
{
    let imageLine;
    i++;
    num=(i%3)+1;
    //let num=Math.floor(Math.random() * (3 - 1 + 1)) + 1;
   switch (num) {
    case 1:
        imageLine = require("../../assets/avatars/woman5/neutral1.png");
        break;
      case 2:
        imageLine = require("../../assets/avatars/woman5/neutral2.png");
        break;
      case 3:
        imageLine = require("../../assets/avatars/woman5/neutral3.png");
        break;
      default:
        imageLine = require("../../assets/avatars/woman5/neutral1.png");
   }
    return imageLine;

},

getGreat : function()
{
    let imageLine;
    i++;
    num=(i%3)+1;
    //let num=Math.floor(Math.random() * (4 - 1 + 1)) + 1;
   switch (num) {
    case 1:
        imageLine = require("../../assets/avatars/woman5/great1.png");
        break;
      case 2:
        imageLine = require("../../assets/avatars/woman5/great2.png");
        break;
      case 3:
        imageLine = require("../../assets/avatars/woman5/great3.png");
        break;
      default:
        imageLine = require("../../assets/avatars/woman5/great1.png");
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
        imageLine = require("../../assets/avatars/woman5/bad1.png");
        break;
      case 2:
        imageLine = require("../../assets/avatars/woman5/bad2.png");
        break;
      case 3:
        imageLine = require("../../assets/avatars/woman5/bad3.png");
        break;
      default:
        imageLine = require("../../assets/avatars/woman5/bad1.png");
   }
    return imageLine;
},

getDead : function()
{
    let imageLine = require("../../assets/avatars/woman5/dead.png");
    return imageLine;
    
}

}
export default woman5;