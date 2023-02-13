import {controllerMatrix, buttonState, joyStickState} from "../render/core/controllerInput.js";
import * as cg from "../render/core/cg.js";

let t = Date.now() / 1000;
let dt = 0;
let g = [0, -.981, 0];
let rebounce = .8
let ball_list = []
let physics = (obj) => {
    let vp = cg.add(cg.scale(g, dt), obj.v)
    obj.loc = cg.add(obj.loc, cg.scale(cg.mix(obj.v, vp, .5), dt))
    obj.v = vp
    for (const obj2 of ball_list) {
        if (obj2.index >= obj.index) {
            break;
        }
    }
    if (obj.loc[1] < 1.) {
        obj.v[1] = -obj.v[1] * rebounce
        obj.loc[1] = 1.
    }

    obj.setMatrix(cg.mMultiply(cg.mTranslate(obj.loc), cg.mScale(obj.scale)))
}
export const init = async model => {
    let ball = model.add('sphere').color(1,0,0);
    ball.loc = [0.02, 1.5, 0]
    ball.v = [0, 0, 0]
    ball.scale = .1
    ball.setMatrix(cg.mMultiply(ball.loc, cg.mScale(.2)))
    ball.index = 0
    ball_list.push(ball)

    let basketball = model.add('sphere');
    basketball.loc = [-.15,1.3,0]
    basketball.v = [0, 0, 0]
    basketball.scale = 0.07;
    basketball.setMatrix(cg.mMultiply(basketball.loc, cg.mScale(.2)))
    //ball_list.push(basketball)

    /*
    ball = model.add('sphere');
    ball.loc = [0, 2, 0]
    ball.v = [0, 0, 0]
    ball.scale = .1
    ball.setMatrix(cg.mMultiply(ball.loc, cg.mScale(.2)))
    ball.index = 1
    ball_list.push(ball)
    */

    t = Date.now() / 1000
    model.animate(() => {
        // model.turnY(3.14/2)
        //basketball.identity();
        let new_time = Date.now() / 1000
        dt = new_time - t;
        t = new_time;
        for (const ball of ball_list) {
            physics(ball)
        }
        physics(basketball);

    });
}

