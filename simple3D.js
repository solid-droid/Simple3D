class simple3D{

    //components
    renderer;
    domEvents;
    loader;
    activeScene;
    activeCamera;
    activeControl;

    //resourses
    modelList = {};
    activeModel = {};
    controlList = {};
    sceneList = {};
    cameraList = {};
    lightList = {};
    
    //hooks
    onModelLoadComplete;

    //flags
    MODEL_LOAD = 0;

    
    constructor({onModelLoadComplete}={onModelLoadComplete : null}){
        this.onModelLoadComplete = onModelLoadComplete;
    }

    createRenderer(id){
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
          });
          const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;
        this.renderer.setPixelRatio(DPR);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true; //Shadow
        this.renderer.shadowMapSoft = true; // Shadow
        this.renderer.shadowMap.type = THREE.PCFShadowMap; //Shadow
        this.loader = new THREE.GLTFLoader();
        this.loader.crossOrigin = true;
        document.getElementById(id).appendChild(this.renderer.domElement);
        return this.renderer;
    }

    setActive(scene, camera, control){
        this.activeCamera = this.getCamera(camera);
        this.activeScene = this.getScene(scene);
        this.activeControl = this.getControl(control);
        return {scene : this.activeScene, camera: this.activeCamera, control: this.activeControl}
    }

    createScene(name){
        const scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xeeeeee );
        this.sceneList[name] = scene;
    }

    createCamera(name , angle = 45, min = 10 , max = 10000) {
        const camera = new THREE.PerspectiveCamera( angle, window.innerWidth / window.innerHeight, min , max);
        this.cameraList[name] = camera;
        this.setCamera(name);
    }

    createOrbitalControl(name, camera){
        camera = this.getCamera(camera);
        const controls = new THREE.OrbitControls(camera, this.renderer.domElement);
        controls.mouseButtons = {
            ORBIT: THREE.MOUSE.RIGHT,
            ZOOM: THREE.MOUSE.MIDDLE,
            PAN: THREE.MOUSE.LEFT
        };
        controls.touches.ONE = THREE.TOUCH.PAN;
        controls.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;
        controls.minDistance  =50;
        controls.maxDistance  = 300;
        controls.enableDamping = true; 
        controls.dampingFactor = 0.12;  
        controls.rotateSpeed = 0.08; 
        controls.autoRotate = false;
        controls.autoRotateSpeed = 0.08;
        controls.maxPolarAngle = Math.PI/2-0.1;
        this.controlList[name] = controls;
        return controls;
    }

    createAmbientLight(name, scene, color =  '#e0e4e4' ){
        const light = new THREE.AmbientLight( color );
        (this.getScene(scene)).add( light )
        this.lightList[name] = {scene, light};
    }

    createDirectionalLight(name, scene, color =  'red', position = {x : 5 ,y: 1 , z: 1}){
            const light = new THREE.DirectionalLight( color );
            light.position.set( position.x , position.y , position.z );
            this.getScene(scene).add( light )
            this.lightList[name] = {scene, light};
    }

    createSpotLight = (name, scene, color =  'red', position = {x : 5 ,y: 1 , z: 1}) =>{

        const light = new THREE.SpotLight( color,10,70,Math.PI/2,1,2);
        light.position.set( position.x , position.y , position.z );
        this.getScene(scene).add( light )
        this.lightList[name] = {scene, light};
    }

    createLight(name, scene, color =  '#e0e4e4', position = undefined){
        if(position){
            this.createDirectionalLight(name, scene, color , position);
        } else {
            this.createAmbientLight(name, scene, color);
        }
    }

    getScene(name){
        return this.sceneList[name];
    }
    getCamera(name){
        return this.cameraList[name];
    }
    getControl(name){
        return this.controlList[name];
    }

    setCamera(name){
        this.domEvents	= new THREEx.DomEvents(this.getCamera(name), this.renderer.domElement)
    }

    getDomEvents(){
        return this.domEvents;
    }

    loadModel(name, path){
        this.MODEL_LOAD++;
        this.loader.load( path , model => {
           this.modelList[name] = model; 
           this.MODEL_LOAD--;
           if(this.MODEL_LOAD == 0){
            this.onModelLoadComplete();
           }
        });
    }

    getModel(name){
        

        if(this.MODEL_LOAD == 0){
            return  this.modelList[name]; 
        }
    }

    setCameraPosition(camera, scene , {position ,  rotate, pivot }
        = {
            position : {x : 30 ,y: 50, z: 90},
            rotate   : {x : 0, y: -0.3 , z: 0.05},
            pivot    : {x : 0, y: 0, z: 0}
        }
        ){

        if(typeof camera == 'string'){
            camera = this.getCamera(camera);
        }
        if(typeof scene == 'string'){
            scene = this.getScene(scene);
        }

        const camera_pivot = new THREE.Object3D();
        camera_pivot.position.x = pivot.x;
        camera_pivot.position.y = pivot.y;
        camera_pivot.position.z = pivot.z;

        const Xaxis = new THREE.Vector3( 0, 0, 1 );
        const Zaxis = new THREE.Vector3( 0, 0, 1 );
        const Yaxis = new THREE.Vector3( 0, 1, 0 );
        camera_pivot.add( camera );
        camera_pivot.rotateOnAxis( Xaxis, rotate.x);
        camera_pivot.rotateOnAxis( Yaxis, rotate.y);
        camera_pivot.rotateOnAxis( Zaxis, rotate.z);
        scene.add( camera_pivot );
        camera.position.set( position.x, position.y, position.z);
    }

    ///////////////
    createGround = (scene) => {

        var geo = new THREE.PlaneBufferGeometry(1000, 1000);
        var mat = new THREE.MeshBasicMaterial({ color: '#b7b7b7', side: THREE.DoubleSide });
        var plane = new THREE.Mesh(geo, mat);
        plane.rotateX( - Math.PI / 2);
        plane.position.x = 0;
        plane.position.z = 0;
        plane.position.y = 0;

        if(typeof scene == 'string'){
            scene = this.getScene(scene);
        }

        scene.add(plane);
    }

    //////////////////////////
    createBlock = (scene = null, config ) => {
        const {x,y,z} = config.position || {x : 0, y: 0, z: 0};
        const size = config.scale || {x : 1, y: 1, z: 1};
        const color = config.color || 'red';
        const rotation = config.rotation || {x : 0, y: 0, z: 0};


        const offset = { x : -50 , y:0 , z: -50};
        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshPhongMaterial( { color , flatShading: true } );
        const block = new THREE.Mesh( geometry, material );
        block.position.x = x + offset.x;
        block.position.y = y + offset.y;
        block.position.z = z - offset.z;
        block.scale.x = size.x;
        block.scale.y = size.y;
        block.scale.z = size.z;
        if(typeof scene == 'string'){
            scene = this.getScene(scene);
        }
        if(scene){
            scene.add(block);
        }
        return block;
    };

    createBlocksFromArray = (scene, array, config= {}) => {
        const color = config.color;

        array.forEach(item => {
            this.createBlock(scene,{
                position: item.position,
                scale: item.scale,
                color: color ? color : item.color,
                });
        });
    }

    createModel = (name, scene, mixers, modelName, config = {}) => {
        const {x,y,z} = config.position || {x : 0, y: 0, z: 0};
        const rot = config.rotation || {x : 0, y: 0, z: 0};
        const size = config.scale || {x : 1, y: 1, z: 1};
        const model = this.cloneGltf(this.getModel(modelName));
        const animation = config.animation || false;
        model.scene.position.set(x, y, z);
        model.scene.scale.x = size.x;
        model.scene.scale.y = size.y;
        model.scene.scale.z = size.z;
        model.scene.rotateX(rot.x);
        model.scene.rotateY(rot.y);
        model.scene.rotateZ(rot.z);
        this.activeModel[name] = model;
        if(typeof scene == 'string'){
            scene = this.getScene(scene);
        }
        scene.add( model.scene );
        if(animation){
            const mixer = new THREE.AnimationMixer( model.scene );
            mixers.push(mixer);
            const action = mixer.clipAction( model.animations[ 0 ] ); // access first animation clip
            action.play();
        }
    }
    
    getActiveModel = (name) => {
        const model = this.activeModel[name];
        return model;
    };
    cloneGltf = (gltf) => {
        !gltf && console.error('Model not found');
        const clone = {
          animations: gltf.animations,
          scene: gltf.scene.clone(true)
        };
      
        const skinnedMeshes = {};
      
        gltf.scene.traverse(node => {
          if (node.isSkinnedMesh) {
            skinnedMeshes[node.name] = node;
          }
        });
      
        const cloneBones = {};
        const cloneSkinnedMeshes = {};
      
        clone.scene.traverse(node => {
          if (node.isBone) {
            cloneBones[node.name] = node;
          }
      
          if (node.isSkinnedMesh) {
            cloneSkinnedMeshes[node.name] = node;
          }
        });
      
        for (let name in skinnedMeshes) {
          const skinnedMesh = skinnedMeshes[name];
          const skeleton = skinnedMesh.skeleton;
          const cloneSkinnedMesh = cloneSkinnedMeshes[name];
      
          const orderedCloneBones = [];
      
          for (let i = 0; i < skeleton.bones.length; ++i) {
            const cloneBone = cloneBones[skeleton.bones[i].name];
            orderedCloneBones.push(cloneBone);
          }
      
          cloneSkinnedMesh.bind(
              new Skeleton(orderedCloneBones, skeleton.boneInverses),
              cloneSkinnedMesh.matrixWorld);
        }
      
        return clone;
      }
}