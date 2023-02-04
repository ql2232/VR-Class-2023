import { controllerMatrix, buttonState, joyStickState } from "../render/core/controllerInput.js";

export const init = async model => {
   let cube = model.add('sphere');

   let drop = (currObj) => {
      
   }

   model.move(0,1.5,0).scale(.3).animate(() => {
      cube.identity().scale(.5);
      //console.log(model.time, cube.getGlobalMatrix());
   });
}
