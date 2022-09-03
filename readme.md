# Simple3D
Easy to use wrapper for ThreeJS
Live Demo => https://solid-droid.github.io/Simple3D/app

# Goals
Make a 3d scene easily with presets
Make a 3d scene in less than 10 lines of code
Easily manage extended events and properties
Easily manage resourses and models
Make syntax Simple and Minimal

# How to Use
Library uses typescript and ESbuild to generate final javascript bundle.  
- clone the project  
- ```npm install```
- ```npm run start``` This will check files for changes and rebuilds automatically
- If you are using VScode IDE, the run live-server extension for live view of the website. (Auto refreshed when file updates)  
- Bundled Script is available in bundle folder  
- App folder holds the basic app code (JS should kept in app/scripts and main.js is the entry point for ESbuild)
- You can keep html anywhere, (But use the bundle/main.js)

# Snippets 
ESbuild supports both JS and TS code.
```javascript
//initialize babylonjs Scene (with few extra basic setups like camera , lights ,etc..)
 const scene = new Simple3D('canvas3D');
 
//box3D creates a 3d box with many customization features
const box = new box3D();

//ground2D creates a 2d plane/ground.
const ground = new ground2D();

//updating box3D parameters. everything is chainable.
box.set.edge(true)
       .set.opacity(0.5)
       .set.x(4)
       .set.z(4)
 
 // dom events => click, rightClick, leftClick, mouseEnter, mouseExit etc...
 box.on('longClick',(e)=> {
        console.log('hello');
 });

// dimension and show grid
ground.set.scale(10, 10)
      .set.grid()

// tweenjs is a great library for creating animations
new TWEEN.Tween(box)
         .to({height:5}, 2000)
         .repeat(Infinity)
         .yoyo(true)
         .interpolation(TWEEN.Interpolation.Linear)
         .onUpdate(() => {
         // custom utils method to rotate around pivot => solar system like animations.
              utils.rotateAroundPivot(
                box.mesh, 
                new Vector3(0.5, 0, 0.5), 
                new Vector3(0, 1, 0), 
                0.01
                )
          }).start();

// custom scene methods for debugging purpose
scene.showStats()
     .showAxis()
     .render([TWEEN.update]);
// pass methods to call during render loop.
```
