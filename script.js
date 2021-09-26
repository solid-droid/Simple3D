var clock = new THREE.Clock();
var mixers = [];
//////////////////////////////////////

let engine = new simple3D({
  onModelLoadComplete: () => { beginModelCreate(); },
});

const beginModelCreate = () => {
  engine.createModel('M1','scene1',mixers,'mcdonalds', {
    position: { x: -100, y: 15, z: -60 },
    rotation: { x: 0, y: Math.PI/4, z: 0 },
    scale:{x:0.02,y:0.02,z:0.02}
  });
  engine.createModel('M2','scene1',mixers,'mcdonalds', {
    position: { x: 55, y: 15, z: 0 },
    rotation: { x: 0, y: -Math.PI/4, z: 0 },
    scale:{x:0.02,y:0.02,z:0.02}
  });
  engine.createModel('M3','scene1',mixers,'mcdonalds', {
    position: { x: 25, y: 15, z: -125 },
    rotation: { x: 0, y: -0.3, z: 0 },
    scale:{x:0.02,y:0.02,z:0.02}
  });
  engine.createModel('M4','scene1',mixers,'vendingMachine', {
    position: { x: -33, y: 0, z: -42 },
    rotation: { x: 0, y:-Math.PI/2, z: 0 },
    scale:{x:1.5,y:1.5,z:1.5}
  });
  engine.createModel('M5','scene1',mixers,'arrowStraight', {
    position: { x: -10, y: 5, z: -25 },
    rotation: { x: 0, y: -Math.PI/4, z: 0 },
    scale:{x:1,y:1,z:1}
  });
  engine.createModel('M6','scene1',mixers,'arrowStraight', {
    position: { x: -20, y: 5, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale:{x:1,y:1,z:1}
  });
  engine.createModel('M7','scene1',mixers,'arrowStraight', {
    position: { x: -20, y: 5, z: 30 },
    rotation: { x: 0, y: 0, z: 0 },
    scale:{x:1,y:1,z:1}
  });
  engine.createModel('M8','scene1',mixers,'arrowStraight', {
    position: { x: -10, y: 5, z: 50 },
    rotation: { x: 0, y: 0.8, z: 0 },
    scale:{x:1,y:1,z:1}
  });
};

let domEvents = engine.getDomEvents();
////////////////////////////////////

let renderer = engine.createRenderer("canvas");
engine.createScene('scene1');
engine.createCamera('camera1');
engine.createOrbitalControl('control1','camera1');
engine.setCameraPosition('camera1', 'scene1');
engine.setActive('scene1', 'camera1', 'control1');

[
 {path: './3dModels/mcdonalds/scene.gltf', name: 'mcdonalds'},
 {path: './3dModels/arrow-straight/scene.gltf' , name: 'arrowStraight'},
 {path: './3dModels/vendingMachine/scene.gltf' , name: 'vendingMachine'},
].forEach(x => engine.loadModel(x.name, x.path));

engine.createLight('ambient','scene1');
engine.createDirectionalLight('directional','scene1', '#b1b1b1', {x : 15 ,y: 4 , z: 10});
engine.createGround('scene1');

engine.createBlocksFromArray('scene1',mapData.data.buildings, {color: '#868686'});



function render() {
  requestAnimationFrame(render); 
  var delta = clock.getDelta();
  mixers.forEach(mixer => mixer.update( delta ));
  engine.activeControl.update();
  console.log();
  const M1 = engine.getActiveModel('M1');
  const M2 = engine.getActiveModel('M2');
  const M3 = engine.getActiveModel('M3');
  if(M1) engine.getActiveModel('M1').scene.rotation.y+= 0.005;
  if(M2) engine.getActiveModel('M2').scene.rotation.y+= 0.005;
  if(M3) engine.getActiveModel('M3').scene.rotation.y+= 0.005;

  renderer.render(engine.activeScene, engine.activeCamera);
}

render();

/////////////////////////---auto resize---/////////////////////
const onWindowResize = () => {
  engine.activeCamera.aspect = window.innerWidth / window.innerHeight;
  engine.activeCamera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
window.addEventListener( 'resize', onWindowResize, false );

