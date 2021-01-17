import * as THREE from 'three-r124/build/three'
import Stats from 'three-r124/examples/jsm/libs/stats.module';
import { GUI } from 'three-r124/examples/jsm/libs/dat.gui.module';
import { TrackballControls } from 'three-r124/examples/jsm/controls/TrackballControls.js';
import {SceneUtils} from 'three-r124/examples/jsm/utils/SceneUtils'

// import 'three-r124/examples/jsm/geometries/BoxLineGeometry'
import {ParametricGeometries} from 'three-r124/examples/jsm/geometries/ParametricGeometries'
import {ConvexGeometry} from 'three-r124/examples/jsm/geometries/ConvexGeometry'

import {addTextures} from './texture';

var planeBG = new THREE.Mesh()
var planeBGGeometry = new THREE.PlaneGeometry(1000, 200, 20, 20);

// create a scene, that will hold all elements such as objects, cameras and lights.
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
var controls = function () {
}

// add spotlight for a bit of light
var spotLightBG = new THREE.SpotLight(0xcccccc);
var pointColor = 0xccffcc;
var ambientcol = 0x1c1c1c
var ambientLightIntensity = 1
var ambientLightStatus = true

// status change variables
var spotlightStatus  = false
var lensFlareStatus = false
var hemisphereLightStatus = false
var pointLightStatus = false
var pointLightDebug = false
var PointLightDistance = 20
var PointLightIntensity = 2
var dirLightStatus = false

// imported class initializations
var import_texture = new addTextures()
class ThreejsScene {
    constructor() {

        // initialize settings
        this.stats = Stats();
        this.gui = new GUI();
        // call the render function

        this.step = 0;
        this.renderer = new THREE.WebGLRenderer();
        this.colorcube = new THREE.Color()

        controls = new function () {
            this.rotationSpeed = 0.03;
            this.pointLightDebug = pointLightDebug
            this.pointLightStatus = pointLightStatus
            this.pointColor = pointColor;
            this.pointDistance = PointLightDistance;
            this.pointIntensity = PointLightIntensity;
            this.ambientLightStatus = ambientLightStatus
            this.ambientLightIntensity = ambientLightIntensity
            this.ambientColor = ambientcol;
            this.spotlightStatus = spotlightStatus;
            this.lensFlareStatus = lensFlareStatus
            this.hemisphereLightStatus = hemisphereLightStatus;
            this.dirLightStatus = dirLightStatus
            this.numberOfObjects = scene.children.length;
    
            this.outputObjects = function () {
                console.log(scene.children.length);
            }
        };

        const planeBGMaterial = new THREE.MeshLambertMaterial({
            map: import_texture.loadTextureOnBG()
        })
        // var planeMaterial = new THREE.MeshLambertMaterial();
        planeBG = new THREE.Mesh(planeBGGeometry, planeBGMaterial);
        planeBG.receiveShadow = true;
    }

    createScene(canvas) {

        this.renderer.setClearColor(new THREE.Color(0xaaaaff, 1.0))
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.setPixelRatio( window.devicePixelRatio );

        // allow shadows in the scene
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMapSoft = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // show axes in the screen
        this.axes = new THREE.AxesHelper(50);

        // create a sphere
        const sphereLightGeometry = new THREE.SphereGeometry(4, 20, 20);
        const sphereLightMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x7777FF
        });
        this.sphereLight = new THREE.Mesh(sphereLightGeometry, sphereLightMaterial);
        // position the sphere
        this.sphereLight.position.set(-50, -10, 20);
        this.sphereLight.castShadow = true

        scene.add(this.axes);
        
        // position and point the camera to the zcenter of the scene
        // camera.position.set(0, 28, 104);
        // camera.lookAt(scene.position);
        camera.position.copy(new THREE.Vector3(-30, 40, 30));
        camera.lookAt(new THREE.Vector3(0, 0, 0));      

        this.addGeometries()

        // scene.fog = new THREE.FogExp2(0xffffff, 0.005);

        // rotate and position the plane
        planeBG.rotation.x = -0.5 * Math.PI;
        planeBG.position.x = 15;
        planeBG.position.y = 0;
        planeBG.position.z = 0;

        // add the plane to the scene
        scene.add(planeBG);

        spotLightBG.position.set(-40, 60, -10);
        spotLightBG.lookAt(planeBG);
        scene.add(spotLightBG);
        spotLightBG.visible = true

        // show performance monitor
        this.stats.setMode(0) // show frame per second rendered
        canvas.appendChild(this.stats.dom)
        canvas.appendChild( this.renderer.domElement );
        
        this.trackballControls = new TrackballControls(camera, this.renderer.domElement)
        this.clock = new THREE.Clock();
    }

    addGeometries() {
        var geoms = [];

        geoms.push(new THREE.CylinderGeometry(1, 4, 4));

        // basic cube
        geoms.push(new THREE.BoxGeometry(2, 2, 2));

        // basic spherer
        geoms.push(new THREE.SphereGeometry(2));

        geoms.push(new THREE.IcosahedronGeometry(4));

        // create a convex shape (a shape without dents)
        // using a couple of points
        // for instance a cube
        const points = [
            new THREE.Vector3(2, 2, 2),
            new THREE.Vector3(2, 2, -2),
            new THREE.Vector3(-2, 2, -2),
            new THREE.Vector3(-2, 2, 2),
            new THREE.Vector3(2, -2, 2),
            new THREE.Vector3(2, -2, -2),
            new THREE.Vector3(-2, -2, -2),
            new THREE.Vector3(-2, -2, 2)
        ];

        geoms.push(new ConvexGeometry(points));

        const vertices = [
            new THREE.Vector3(1,3,1),
            new THREE.Vector3(1,3,-1),
            new THREE.Vector3(1,-1,1),
            new THREE.Vector3(1,-1,-1),
            new THREE.Vector3(-1,3,-1),
            new THREE.Vector3(-1,3,1),
            new THREE.Vector3(-1,-1,-1),
            new THREE.Vector3(-1,-1,1)
        ];

        const faces = [
            new THREE.Face3(0,2,1),
            new THREE.Face3(2,3,1),
            new THREE.Face3(4,6,5),
            new THREE.Face3(6,7,5),
            new THREE.Face3(4,5,1),
            new THREE.Face3(5,0,1),
            new THREE.Face3(7,6,2),
            new THREE.Face3(6,3,2),
            new THREE.Face3(5,7,0),
            new THREE.Face3(7,2,0),
            new THREE.Face3(1,3,4),
            new THREE.Face3(3,6,4),
        ];

        const geom = new THREE.Geometry();
        geom.vertices = vertices;
        geom.faces = faces;
        geom.computeFaceNormals();

        geoms.push(geom)

        // create a lathgeometry
        const pts = []; //points array - the path profile points will be stored here
        const detail = .1; //half-circle detail - how many angle increments will be used to generate points
        const radius = 3; //radius for half_sphere
        for (var angle = 0.0; angle < Math.PI; angle += detail) //loop from 0.0 radians to PI (0 - 180 degrees)
            pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)); //angle/radius to x,z

        geoms.push(new THREE.LatheGeometry(pts, 12));

        // create a OctahedronGeometry
        geoms.push(new THREE.OctahedronGeometry(3));

        // create a geometry based on a function
        geoms.push(new THREE.ParametricGeometry(ParametricGeometries.mobius3d, 20, 10));

        geoms.push(new THREE.TetrahedronGeometry(3));

        geoms.push(new THREE.TorusGeometry(3, 1, 10, 10));

        geoms.push(new THREE.TorusKnotGeometry(3, 0.5, 50, 20));

        var j = 0;
        
        for (var i = 0; i < geoms.length; i++) {

            const materials = [

                new THREE.MeshLambertMaterial({
                    color: Math.random() * 0xffffff,
                    wireframe: false
                }),
                new THREE.MeshBasicMaterial({
                    color: Math.random() * 0x00e0d0,
                    wireframe: true
                })
            ];

            const mesh = SceneUtils.createMultiMaterialObject(geoms[i], materials);
            mesh.traverse(function (e) {
                e.castShadow = true
            });

            mesh.position.x = -20 + ((i % 4) * 10);
            mesh.position.y = 4;
            mesh.position.z = -10 + (j * 12);

            if ((i + 1) % 4 == 0) j++;
            scene.add(mesh);
        }

    }

    onResize() {
        // console.log(window.innerWidth)
        // console.log(window.innerHeight)
        // console.log(window.innerWidth/window.innerHeight)
        // console.log(this.camera.aspect)
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }

    buttons() {

        this.gui.add(controls, 'numberOfObjects').listen();
        this.gui.add(controls, 'spotlightStatus').onChange(function (e) {
            spotlightStatus = e
        });
        this.gui.add(controls, 'lensFlareStatus').onChange(function (e) {
            lensFlareStatus = e
        });
        this.gui.add(controls, 'ambientLightStatus').onChange(function (e) {
            ambientLightStatus = e
        });
        this.gui.add(controls, 'ambientLightIntensity', 0, 5, 0.2).onChange(function () {
            ambientLightIntensity = controls.ambientLightIntensity;
        });
        this.gui.addColor(controls, 'ambientColor').onChange(function () {
            ambientcol = controls.ambientColor;
        });
        this.gui.add(controls, 'pointLightStatus').onChange(function (e) {
            pointLightStatus = e
        });
        this.gui.add(controls, 'pointLightDebug').onChange(function (e) {
            pointLightDebug = e
        })
        this.gui.addColor(controls, 'pointColor').onChange(function () {
            pointColor = controls.pointColor;
        });
        this.gui.add(controls, 'pointDistance', 0, 100).onChange(function (e) {
            PointLightDistance = e;
        });
        this.gui.add(controls, 'pointIntensity', 0, 3).onChange(function (e) {
            PointLightIntensity = e;
        });
        this.gui.add(controls, 'hemisphereLightStatus').onChange(function (e) {
            hemisphereLightStatus = e
        });
        this.gui.add(controls, 'dirLightStatus').onChange(function (e) {
            dirLightStatus = e
        });
    }

    animate() {

        this.trackballControls.update(this.clock.getDelta());
        this.stats.update();

        import_light.addAmbientLight()
        import_light.addSpotLight()
        import_light.loadLensflareAsSun()
        import_light.addHemiLight()
        import_light.addPointLight()
        import_light.addDirLight(planeBG)
        // console.log(import_light)

        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render( scene, camera );
    }
}

const instance_scene = new ThreejsScene()

import {initLights} from './light';
var import_light = new initLights();

export { scene, controls, instance_scene }