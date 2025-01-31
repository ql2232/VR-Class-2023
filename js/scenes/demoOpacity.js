
// This demo shows how you can vary opacity.

export const init = async model => {

   // NOTE: Creation order matters when rendering transparent objects.
   //       Transparent objects need to render *after* opaque objects.
   let currOpacity = 1;
   let prevNumber = 0;
   let cube1 = model.add('cube').color(1,1,0);
   let cube2 = cube1.add('cube').color(0,1,1).move(2.5,0,0);

   model.move(0,1.5,0).scale(.1).animate(() => {
      cube1.identity().turnZ(0.3 * model.time)
                      .turnY(1.0 * model.time);



      if ((model.time|0) % 4 == 0 && (model.time|0)!= prevNumber){
         prevNumber = (model.time|0);
         currOpacity = Math.random();
      }
      console.log(currOpacity)
      cube2.opacity(currOpacity);
   });
}
