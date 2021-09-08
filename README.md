# Simple3D  --> _under development_
 Easy to use wrapper for ThreeJS  
 


# Goals
* Make a 3d scene easily with presets
* Make a 3d scene in less than 10 lines of code
* Easily manage extended events and properties
* Easily manage resourses and models

# How to use
```html
<script src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r96/three.min.js'></script>
<script src="https://rawcdn.githack.com/mrdoob/three.js/r96/examples/js/loaders/GLTFLoader.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.19.0/TweenMax.min.js"></script>
<script src='./lib/threex.domevents.js'></script>
<script src='./lib/orbit.js'></script>
<script  src="./simple3D.js"></script>
```
  
Javascript

```javascript

let engine = new simple3D({
    onModelLoadComplete: () => {  } // triggers on model load complete
  });

//create the DOM renderer
let renderer = engine.createRenderer("canvas");  

//create a scene
engine.createScene('scene1');

//create a camera
engine.createCamera('camera1');

//for orbital camera
engine.createOrbitalControl('control1','camera1');

//set default 3rd Person camera location
engine.setCameraPosition('camera1', 'scene1');

//set active scene and camera
engine.setActive('scene1', 'camera1', 'control1');

//load 3d models
[
 {path: './3dModels/robot1/scene.gltf', name: 'robot1'},
 {path: './3dModels/car1/scene.gltf' , name: 'car'},
].forEach(x => engine.loadModel(x.name, x.path));

//create ambient light
engine.createLight('light1','scene1');

//render loop
function render() {
  requestAnimationFrame(render); 
  engine.activeControl.update();
  renderer.render(engine.activeScene, engine.activeCamera);
}

render();

//window resize
const onWindowResize = () => {
  engine.activeCamera.aspect = window.innerWidth / window.innerHeight;
  engine.activeCamera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
window.addEventListener( 'resize', onWindowResize, false );

```
