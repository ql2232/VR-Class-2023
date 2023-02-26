import { g2 } from "../util/g2.js";
import { controllerMatrix, buttonState, joyStickState } from "../render/core/controllerInput.js";

// This demo shows how you can add heads-up display (HUD) objects.

export const init = async model => {

   let numCount = 0;
   g2.textHeight(.1);
   let backgroundWidget = model.add()

   let createTable = () => {
         let obj5 = backgroundWidget.add('cube')
          .texture(() => {
         g2.setColor('white');
         g2.fillRect(0,0,1.5,1);
         g2.setColor('black');
         g2.textHeight(.05);
         g2.fillText('Current Level: ', .3, .48, 'center')
         g2.fillText(numCount.toString(), .8, .28, 'center');
         g2.fillText('No. of atoms destroyed', .3, .28, 'center');
         g2.fillText('Scoring board', .5, .93, 'center');
         g2.drawWidgets(obj5);
      });
      obj5.value = [.8,.8];
      //g2.addWidget(obj5, 'trackpad', .5, .6, '#ff8080', 'my widget', value => obj5.value = value);
      g2.addWidget(obj5, 'textbox' , .5, .1, '#ffffff', 'Welcome to VR!', value => {});
      g2.addWidget(obj5, 'button', .7, .68, '#8080ff', 'LV3', value => {});
      g2.addWidget(obj5, 'button', .5, .68, '#ff8080', 'LV2', value => {});
      g2.addWidget(obj5, 'button', .3, .68, '#80ffff', 'LV1', value => {});
   }

   model.animate(() => {
       model.setTable(false);
      if ((buttonState.right[0].pressed)){
         createTable();
         backgroundWidget.hud().scale(.5,.5,.0001);
      }
      else{
         backgroundWidget._children = [];
      }
   });
}
