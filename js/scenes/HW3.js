import { g2 } from "../util/g2.js";
import * as cg from "../render/core/cg.js";
import { controllerMatrix, buttonState, joyStickState } from "../render/core/controllerInput.js";
import { lcb, rcb } from '../handle_scenes.js';

// This demo shows examples of 2D canvases in VR.

let radius = 0.3;
let count = 0;
let dt = 0;
let t = Date.now() / 1000;
let currTime = 0
let canCreate = false
let sphereID = 0;

let timeRemain = 4;
let showStat = false;
let deleteCount = 0;
let currLevel = 1;

let getPosition = (obj, currTime) => {
    let currLocation = cg.add(obj.loc,cg.scale(obj.v, dt))
    obj.loc = currLocation

    if ((currLocation[0] > 2 && obj.v[0] > 0)|| (currLocation[0] < -2 && obj.v[0] < 0)){
        obj.v[0] = -obj.v[0]
    }
    if ((currLocation[1] > 2 && obj.v[1] > 0) || (currLocation[1] < -1 && obj.v[1] < 0)){
        obj.v[1] = -obj.v[1]
    }
    if ((currLocation[2] > 3 && obj.v[2] > 0)|| (currLocation[2] < -3&& obj.v[2] < 0)){
        obj.v[2] = -obj.v[2]
    }
    return currLocation
}

let changeOpacity = (obj, currInt) =>{
    if (currInt < 0.7){
        return 0.2
    }
    else{
        obj.opacCount = obj.opacCount + 1
        return 0.8
    }
}

let hitSphere = (currCenter) =>{
    let point = lcb.projectOntoBeam(currCenter);
    let diff = cg.subtract(point, currCenter);
    let hit = cg.norm(diff) < radius*0.3;
    let lt = buttonState.left[0].pressed;
    if (hit && lt) {
        return true
    }
    else{
        return false
    }
}

let createSphere = (obj) => {
    let sphereMain = obj.add('sphere').color(1,1,0);
    sphereMain.v = [Math.random()-0.5,Math.random()-.5,Math.random()-.5]
    sphereMain.loc = [0, 1.5, 0]
    sphereMain.sphereChild = []
    sphereMain.ID = sphereID;
    sphereID = sphereID + 1
    sphereMain.currOpacity = [1,1,1,1,1,1]
    sphereMain.opacCount = 6

    let sphere0 = sphereMain.add('sphere').color(0,1,1).move(0,0,1.5).scale(.6);
    sphereMain.sphereChild.push(sphere0)
    let sphere1 = sphereMain.add('sphere').color(0,1,1).move(0,0,-1.5).scale(.6);
    sphereMain.sphereChild.push(sphere1)
    let sphere2 = sphereMain.add('sphere').color(0,1,1).move(1.5,0,0).scale(.6);
    sphereMain.sphereChild.push(sphere2)
    let sphere3 = sphereMain.add('sphere').color(0,1,1).move(-1.5,0,0).scale(.6);
    sphereMain.sphereChild.push(sphere3)
    let sphere4 = sphereMain.add('sphere').color(0,1,1).move(0,1.5,0).scale(.6);
    sphereMain.sphereChild.push(sphere4)
    let sphere5 = sphereMain.add('sphere').color(0,1,1).move(0,-1.5,0).scale(.6);
    sphereMain.sphereChild.push(sphere5)
}

let findIndex = (obj, currID) =>{
    for (let i = 0; i < obj._children.length; i++){
        if (obj._children[i].ID == currID){
            return i
        }
    }
    return -1
}

export const init = async model => {
    //
    // let gun = model.add('cube');
    // let MP = cg.mTranslate(0,.5,.5);

    let isInBox = p => {
      // FIRST TRANSFORM THE POINT BY THE INVERSE OF THE BOX'S MATRIX.
      let q = cg.mTransform(cg.mInverse(gun.getMatrix()), p);
      // THEN WE JUST NEED TO SEE IF THE RESULT IS INSIDE A UNIT CUBE.
      return q[0] >= -1 & q[0] <= 1 &&
             q[1] >= -1 & q[1] <= 1 &&
             q[2] >= -1 & q[2] <= 1 ;
   }

    g2.textHeight(.1);
    let backgroundWidget = model.add()

    let createTable = () => {
        let obj5 = backgroundWidget.add('cube')
          .texture(() => {
              g2.setColor('white');
              g2.fillRect(0,0,1.5,1);
              g2.setColor('black');
              g2.textHeight(.05);
              g2.fillText(currLevel.toString(), .8, .48, 'center');
              g2.fillText('Current Level: ', .3, .48, 'center')
              g2.fillText(deleteCount.toString(), .8, .28, 'center');
              g2.fillText('No. of atoms destroyed', .3, .28, 'center');
              g2.fillText('Scoring board', .5, .93, 'center');
              g2.drawWidgets(obj5);
      });
      obj5.value = [.8,.8];
      g2.addWidget(obj5, 'textbox' , .5, .1, '#ffffff', 'Welcome to VR!', value => {});
      g2.addWidget(obj5, 'button', .7, .68, '#8080ff', 'LV3', value => {currLevel = 3});
      g2.addWidget(obj5, 'button', .5, .68, '#ff8080', 'LV2', value => {currLevel = 2});
      g2.addWidget(obj5, 'button', .3, .68, '#80ffff', 'LV1', value => {currLevel = 1});
    }

    let prevNumber = 0;

    let newSphere = model.add().scale(0.3);
    createSphere(newSphere)

    // ANIMATED BAR CHART
    let obj3 = model.add('cube').texture(() => {
        g2.setColor('black');
        g2.textHeight(.1);
        g2.fillText('Count Box', .5, .9, 'center');
        g2.setColor('blue');
        let values = [];
        values.push(deleteCount/8);
        values.push(timeRemain/5);
        g2.barChart(.4,.3,.5,.5, values, ['score','time'],
            ['red','green']);
        g2.drawWidgets(obj3)
    });
    g2.addWidget(obj3, 'textbox' , .5, .2, '#ff8080', 'hello', value => {});

    model.move(0,1.5,0).animate(() => {
        model.setTable(false);
        if ((buttonState.right[0].pressed && canCreate) || (timeRemain == 8 && newSphere._children.length < 2)){
            createSphere(newSphere)
            canCreate = false
        }

        if (buttonState.right[1].pressed){
            if (backgroundWidget._children.length == 0){
                createTable();
            }
            backgroundWidget.hud().scale(1,1,.0001).move(0,-3.5,2);
        }
        else{
            backgroundWidget._children = [];
        }

        let new_time = Date.now() / 1000
        dt = new_time - t;
        currTime = currTime + dt
        t = new_time;
        obj3.identity().move(0,0,-3).scale(.4,.4,.0001);
        if (deleteCount > 3){
            timeRemain = timeRemain - dt
            if (timeRemain <= 0){
                timeRemain = 8
            }
        }

        for (let j = 0; j < newSphere._children.length; j++){
            let currSphere = newSphere._children[j]
            currSphere.identity().move(getPosition(currSphere, dt)).turnZ(0.3 * model.time).turnY(1.0 * model.time);
            currSphere.scale(radius);

            if ((model.time|0) % 4 == 0 && (model.time|0)!= prevNumber){
                prevNumber = (model.time|0);
                for (let i = 0; i < 6; i++){
                    if (currSphere.sphereChild[i]._opacity < 0.5) {
                        currSphere.currOpacity[i] = changeOpacity(currSphere,Math.random());
                    }

                }
            }
            let centerMain = currSphere.getGlobalMatrix().slice(12, 15);
            for (let i = 0; i < currSphere.sphereChild.length; i++){
                if (currSphere.sphereChild[i]._opacity < 0.5){
                    currSphere.sphereChild[i].opacity(currSphere.currOpacity[i]);
                }
            }

            for (let i = 0; i < currSphere.sphereChild.length; i++){
                if (hitSphere(currSphere.sphereChild[i].getGlobalMatrix().slice(12, 15))){
                    if (currSphere.sphereChild[i]._opacity > 0.5){
                        currSphere.opacCount = currSphere.opacCount - 1
                    }
                    currSphere.currOpacity[i] = 0.2
                    currSphere.sphereChild[i].opacity(currSphere.currOpacity[i]);
                    break;
                }
            }

            if ( currSphere.opacCount <= 0 && hitSphere(centerMain)){
                let tempID = findIndex(newSphere, currSphere.ID)
                newSphere._children.splice(tempID,1)
                deleteCount = deleteCount + 1
                canCreate = true
            }
        }

        // let ml = controllerMatrix.left;
        // let mr = controllerMatrix.right;
        //
        // // EXTRACT THE LOCATION OF EACH CONTROLLER FROM ITS MATRIX,
        // // AND USE IT TO SEE WHETHER THAT CONTROLLER IS INSIDE THE BOX.
        //
        // let isLeftInBox  = isInBox(ml.slice(12,15));
        // if (! isLeftInBox){
        //     gun.color(1,1,1);
        //     MP = cg.mTranslate(0,-.5,.5);
        //
        //     gun.hud().setMatrix(MP).turnX(-0.6).scale(.06,0.15,0.06);
        // }

    });
}
