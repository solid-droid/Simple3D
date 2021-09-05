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

    createCamera(name , angle = 50, min = 0.1 , max = 100000) {
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
        controls.minDistance  =2000;
        controls.maxDistance  = 10000;
        controls.enableDamping = true; 
        controls.dampingFactor = 0.12;  
        controls.rotateSpeed = 0.08; 
        controls.autoRotate = false;
        controls.autoRotateSpeed = 0.08;
        controls.maxPolarAngle = Math.PI/2;
        this.controlList[name] = controls;
        return controls;
    }

    createAmbientLight(name, scene, color =  0x919191 ){
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

    createLight(name, scene, color =  0x919191, position = undefined){
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
            position : {x : 6000 ,y: 3000, z: 3000},
            rotate   : {x : 0, y: 0.465 , z: 0.05},
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
}