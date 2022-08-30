import { Simple3D, box3D, ground2D, utils } from './Simple3D';
import * as TWEEN from '@tweenjs/tween.js';
import { Vector3 } from '@babylonjs/core';

init();

function init(){
    const scene = new Simple3D('canvas3D');
    const box = new box3D();
    const box2 = new box3D();
    const ground = new ground2D();

    box.set.edge(true)
       .set.opacity(0.5)
       .set.x(4)
       .set.z(4)

    box2.set.edge(true)
        .set.opacity(1)

    ground.set.scale(10, 10)
          .set.grid()
    new TWEEN.Tween(box)
             .to({height:5}, 2000)
             .repeat(Infinity)
             .yoyo(true)
             .interpolation(TWEEN.Interpolation.Linear)
             .onUpdate(() => {
              utils.rotateAroundPivot(
                box.mesh, 
                new Vector3(0.5, 0, 0.5), 
                new Vector3(0, 1, 0), 
                0.01
                )
            })
             .start();
         
    box2.on('longClick',(e)=> {
        console.log('hello');
    });
    scene.showStats()
         .showAxis()
         .render([TWEEN.update]);      
}