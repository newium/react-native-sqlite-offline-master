let i=0;

const moncyan = {

getNeutral : function()
{
    let imageLine;
    i++;
    num=(i%4)+1;
    //let num=Math.floor(Math.random() * (3 - 1 + 1)) + 1;
   switch (num) {
    case 1:
        imageLine = require("../../assets/avatars/moncyan/neutral1.png");
        break;
      case 2:
        imageLine = require("../../assets/avatars/moncyan/neutral2.png");
        break;
      case 3:
        imageLine = require("../../assets/avatars/moncyan/neutral3.png");
        break;
      default:
        imageLine = require("../../assets/avatars/moncyan/neutral4.png");
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
        imageLine = require("../../assets/avatars/moncyan/great1.png");
        break;
      case 2:
        imageLine = require("../../assets/avatars/moncyan/great2.png");
        break;
      case 3:
        imageLine = require("../../assets/avatars/moncyan/great3.png");
        break;
        case 4:
            imageLine = require("../../assets/avatars/moncyan/great4.png");
            break;
            case 5:
                imageLine = require("../../assets/avatars/moncyan/great5.png");
                break;
      default:
        imageLine = require("../../assets/avatars/moncyan/great6.png");
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
        imageLine = require("../../assets/avatars/moncyan/bad1.png");
        break;
      case 2:
        imageLine = require("../../assets/avatars/moncyan/bad2.png");
        break;
      case 3:
        imageLine = require("../../assets/avatars/moncyan/bad3.png");
        break;
      default:
        imageLine = require("../../assets/avatars/moncyan/bad4.png");
   }
    return imageLine;
},

getDead : function()
{
    let imageLine = require("../../assets/avatars/moncyan/dead.png");
    return imageLine;
    
}

}
export default moncyan;