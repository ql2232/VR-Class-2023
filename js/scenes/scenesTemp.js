import * as global from "../global.js";
import { Gltf2Node } from "../render/nodes/gltf2.js";

export default () => {
   global.scene().addNode(new Gltf2Node({
      url: ""
   })).name = "backGround";

   return {
      enableSceneReloading: true,
      scenes: [ 
         { name: "DemoKP1" , path: "./demoKP1.js"         },
         { name: "DemoKP0"     , path: "./demoKP0.js"     },
         { name: "HW2"        , path: "./HW2.js"},
         { name: "test"        , path: "./test.js"},
      ]
   };
}
