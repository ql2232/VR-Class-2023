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

let deleteCount = 0
let timeRemaining = 4

let getPosition = (obj, currTime) => {
    let currLocation = cg.add(obj.loc,cg.scale(obj.v, dt))
    obj.loc = currLocation

    if (currLocation[0] > 3 || currLocation[0] < -2){
        obj.v[0] = -obj.v[0]
    }
    if (currLocation[1] > 2.5 || currLocation[1] < 0){
        obj.v[1] = -obj.v[1]
    }
    if (currLocation[2] > 3 || currLocation[2] < -3){
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

    let currOpacity = [1,1,1,1,1,1]

    let prevNumber = 0;

    let newSphere = model.add();
    //let sphereChild = [];
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
        g2.barChart(.4,.3,.5,.5, values, ['remove','time'],
            ['red','green']);
        g2.drawWidgets(obj3)
    });
    g2.addWidget(obj3, 'textbox' , .5, .2, '#ff8080', 'hello', value => {});

    //let ball = model.add('sphere');


    model.move(0,1.5,0).scale(.3).animate(() => {
        if ((buttonState.right[0].pressed && canCreate) || (timeRemain == 8 && newSphere._children.length < 2)){
            createSphere(newSphere)
            canCreate = false
        }

        let new_time = Date.now() / 1000
        dt = new_time - t;
        currTime = currTime + dt
        t = new_time;
        obj3.identity().move(0,2,-3).scale(.7,.7,.0001);
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

    });
}
