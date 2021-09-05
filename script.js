let engine = new simple3D({
    onModelLoadComplete: () => {  }
  });

let renderer = engine.createRenderer("canvas");
engine.createScene('scene1');
engine.createCamera('camera1');
engine.createOrbitalControl('control1','camera1');
engine.setCameraPosition('camera1', 'scene1');
engine.setActive('scene1', 'camera1', 'control1');

[
 {path: './3dModels/robot1/scene.gltf', name: 'robot1'},
 {path: './3dModels/car1/scene.gltf' , name: 'car'},
].forEach(x => engine.loadModel(x.name, x.path));

engine.createLight('light1','scene1');

let domEvents = engine.getDomEvents();

var clock = new THREE.Clock();

var mixers = [];


function render() {
  requestAnimationFrame(render); 
  var delta = clock.getDelta();
  mixers.forEach(mixer => mixer.update( delta ));
  engine.activeControl.update();
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

