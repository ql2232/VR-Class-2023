import * as global from "../global.js";
import { Gltf2Node } from "../render/nodes/gltf2.js";

export default () => {
   global.scene().addNode(new Gltf2Node({
      url: ""
   })).name = "backGround";

   return {
      enableSceneReloading: true,
      scenes: [
         { name: "HW3"               , path: "./HW3.js"       },
         { name: "test"           , path: "./demoCanvas.js"           },
         { name: "DemoKP3"           , path: "./demoKP3.js"           },
         { name: "HUD"           , path: "./demoHUD.js"},
         { name: "twoCubes"      , path: "./demoTwoCubes.js"},
         { name: "grab"          , path:"./demoKP2.js"}
      ]
   };
}

