import { controllerMatrix, buttonState, joyStickState } from "../render/core/controllerInput.js";

export const init = async model => {

   let robot = model.add();
   let body = robot.add();
   body.add('sphere').texture('../media/textures/universe1.webp');
   let arm1 = body.add();
   arm1.add('tubeX');
   let arm2 = body.add();
   arm2.add('tubeX');
   
   let head = robot.add();
   head.add('cube').texture('../media/textures/robot.jpeg');
   
   let eye1 = head.add();
   eye1.add('sphere');
   eye1.add('cube').move(0,0,1).scale(0.25).color(0,0,0);
   
   let eye2 = head.add();
   eye2.add('sphere');
   eye2.add('cube').move(0,0,1).scale(0.25).color(0,0,0);
   let nose1 = head.add('tubeY').color(0,0,1);
   let nose2 = head.add('tubeX').color(0,0,1);

   let mouth = head.add('tubeX').color(10,0,0);

   let rightEar = head.add('donut').color(0,1,1);
   let leftEar = head.add('donut').color(0,1,1);

   

   model.move(0.2,1.2,0).scale(.3).animate(() => {
      robot.identity().move(0,0.6 + Math.abs(Math.sin(model.time)),0);

      body.identity().move(-.5, -0.65,0).scale(1.5,0.3,1);
      arm1.identity().move(-.5,0,0).scale(0.8,0.2,0.2).turnX(Math.sin(1*model.time));
      arm2.identity().scale(0.3);
      head.identity().move(-0.4,0,0).scale(.3,.4,.4)
                     .turnY(Math.sin(1*model.time));
      
      eye1.identity().move(.4,.5,1).scale(.2)
                     .turnX(Math.sin(2.1*model.time))
                     .turnY(Math.sin(1.0*model.time));
      
      eye2.identity().move(-.5,.5,1).scale(.2)
                     .turnY(Math.sin(1.0*model.time))
                     .turnZ(Math.sin(2.1*model.time));
      nose1.identity().move(-.03, 0,1).scale(.2);
      nose2.identity().move(-.03, 0,1).scale(.2);

      mouth.identity().move(0,-.7,.5)
                     .scale(.5,.1,.6)
                     .turnY(Math.sin(2.0* model.time));

      rightEar.identity().move(1,1,0).scale(.5*Math.cos(2.0* model.time));
      leftEar.identity().move(-1,1,0).scale(.5*Math.cos(2.0* model.time));
   });
}
