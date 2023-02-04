import { controllerMatrix, buttonState, joyStickState } from "../render/core/controllerInput.js";
import * as cg from "../render/core/cg.js";

export const init = async model => {
   //let cube = model.add('cube');

   let robot = model.add();
   let head = robot.add();
   head.add('cube').texture('../media/textures/robot.jpeg');
   
   let eye1 = head.add();
   eye1.add('sphere');
   eye1.add('cube').move(0,0,1).scale(0.25).color(0,0,0);
   
   let eye2 = head.add();
   eye2.add('sphere');
   eye2.add('cube').move(0,0,1).scale(0.25).color(0,0,0);
   let nose1 = head.add('tubeY').color(0,0,1);

   let body = robot.add();
   let neck = body.add('cube');
   let belly = body.add('cube');
   let butt = body.add('cube');

   let leftKnee = body.add();
   let rightKnee = body.add();
   let leftFoot = leftKnee.add();
   let rightFoot = rightKnee.add();


   let leftShoulder  = body.add();
   let rightShoulder = body.add();
   let leftAnkle = leftShoulder.add();
   let rightAnkle = rightShoulder.add();
   let leftHand = leftAnkle.add();
   let rightHand = rightAnkle.add();
   leftShoulder .add('sphere').scale(.09);
   leftAnkle    .add('sphere').scale(.05);
   rightShoulder .add('sphere').scale(.09);
   rightAnkle    .add('sphere').scale(.05);
   leftHand    .add('cube').scale(.09,.03,.07);
   rightHand    .add('cube').scale(.09,.03,.07);

   let headNeck = model.add('tubeZ');
   let lsNeck = model.add('tubeZ');
   let rsNeck = model.add('tubeZ');
   let lsAnkle = model.add('tubeZ');
   let rsAnkle = model.add('tubeZ');
   let laHand = model.add('tubeZ');
   let raHand = model.add('tubeZ');


   //let ball1 = model.add('sphere');
   //let ball2 = model.add('sphere');
   //let tube1 = model.add('tubeZ');

   let limb = (a,b,c,r) => {
      if (r === undefined) r = .012;
      a.color(.7,.7,.7);
      let B = b.getGlobalMatrix().slice(12, 15);
      let C = c.getGlobalMatrix().slice(12, 15);
      a.setMatrix(cg.mMultiply(cg.mTranslate(cg.mix(B,C,.5)),
                  cg.mMultiply(cg.mAimZ(cg.subtract(C,B), [0,0,1]),
		               cg.mScale(r,r,.5*cg.distance(B,C)))));
   }

   model.animate(() => {
      let leftTrigger  = buttonState.left[2].pressed;
      let rightTrigger  = buttonState.right[0].pressed;
      //ball1.color(leftTrigger ? [1,0,0] : [.7,.7,.7]);
      //ball2.color(rightTrigger ? [0,1,0] : [.7,.7,.7]);
      //ball1.identity().move(0.5,1.5,0).scale(0.1);
      //console.log(ball1.getGlobalMatrix());
      //ball2.identity().move(-0.5,1.5,0).scale(0.05);
      //limb(tube1, ball1, ball2);


      robot.identity().move(.5,1.7,0);
      head.identity().move([-0.4,0,0]).scale(.1);
      head.move(rightTrigger ? [0, .5 + Math.sin(1*model.time)/2,0] : [0,0,0]);
                     //.turnY(Math.sin(1*model.time));
      
      eye1.identity().move(.4,.5,1).scale(.2);
      eye1.move(rightTrigger ? [0,0,2] : [0,0,0])
                     //.turnX(Math.sin(2.1*model.time))
                     //.turnY(Math.sin(1.0*model.time));
      
      eye2.identity().move(-.5,.5,1).scale(.2);
                     //.turnY(Math.sin(1.0*model.time))
                     //.turnZ(Math.sin(2.1*model.time));

      nose1.identity().move(-.03, 0,1).scale(.2);

      neck.identity().move(-.4,-.15,0).scale(.1,.02,.1).color(1,0,0);
      belly.identity().move(-.4,-.3,0).scale(.1,.13,.1);
      butt.identity().move(-.4,-.48,0).scale(.1,.02,.1);

      leftShoulder .identity().move( -.55,-.15,0).scale(.35);
      rightShoulder .identity().move(-.25,-.15,0).scale(.35);
      rightAnkle.identity().move(.1,-.7,0);
      leftAnkle.identity().move(-.1,-.7,0);
      rightHand.identity().move(.15,0,0);
      leftHand.identity().move(-.15,0,0);

      limb(headNeck, head, neck);
      limb(lsNeck, neck, leftShoulder);
      limb(rsNeck, neck, rightShoulder);
      limb(lsAnkle, leftAnkle, leftShoulder,.008);
      limb(rsAnkle, rightAnkle, rightShoulder,.008);
      limb(laHand, leftAnkle, leftHand,.008);
      limb(raHand, rightAnkle, rightHand,.008);
      
      
   });
}
