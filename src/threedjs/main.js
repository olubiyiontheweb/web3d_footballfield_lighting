import * as THREE from 'three/build/three'
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import {SceneUtils} from 'three/examples/jsm/utils/SceneUtils'

// import 'three/examples/jsm/geometries/BoxLineGeometry'
import {ParametricGeometries} from 'three/examples/jsm/geometries/ParametricGeometries'
import {ConvexGeometry} from 'three/examples/jsm/geometries/ConvexGeometry'

// create a scene, that will hold all our elements such as objects, cameras and lights.
const scene = new THREE.Scene();
const planeGeometry = new THREE.PlaneGeometry(65, 30);

class ThreejsScene {
    constructor() {

        // initialize settings
        this.stats = Stats();
        this.gui = new GUI();
        // call the render function

        this.step = 0;
        this.sphere = new THREE.Mesh()
        this.cube = new THREE.Mesh()

        this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.renderer = new THREE.WebGLRenderer();
        this.ambientLight = new THREE.AmbientLight(0x0c0c0c)
        this.spotlight = new THREE.SpotLight(0xffffff)

        this.colorcube = new THREE.Color()
    }

    createScene(canvas) {

        // this.renderer.setClearColor(new THREE.Color(0x2cab72));
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // show axes in the screen
        this.axes = new THREE.AxesHelper(20);

        // create a sphere
        const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
        const sphereMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x7777FF
        });
        this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        // position the sphere
        this.sphere.position.set(20, 4, 2);
        this.sphere.castShadow = true

        scene.add(this.axes);
        // add the sphere to the scene
        scene.add(this.sphere);

        this.addPlaneDesign()
        
        // position and point the camera to the center of the scene
        this.camera.position.set(-30, 50, 30);
        this.camera.lookAt(scene.position);

        scene.add(this.ambientLight)

        this.spotlight.position.set( -40, 60, -10)
        this.spotlight.castShadow = true
        scene.add(this.spotlight)

        this.addGeometries()

        // scene.fog = new THREE.FogExp2(0xffffff, 0.005);

        // scene.overrideMaterial = new THREE.MeshLambertMaterial({
        //     color: 0xffffff
        // });

        // show performance monitor
        this.stats.setMode(0) // show frame per second rendered
        
        // console.log(canvas)
        canvas.appendChild(this.stats.dom)
        canvas.appendChild( this.renderer.domElement );
        
        this.trackballControls = new TrackballControls(this.camera, this.renderer.domElement)
        this.clock = new THREE.Clock();
    }

    addPlaneDesign() {

        // create the ground plane
        this.planeMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xab2c65,
            wireframe: false
        });

        const plane = new THREE.Mesh(planeGeometry, this.planeMaterial);
        // rotate and position the plane
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.set(15, 0, 0);
        plane.receiveShadow = true

        // add the plane to the scene
        scene.add(plane);
        
        const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);

        for (var j = 0; j < (planeGeometry.parameters.height / 5); j++) {
            for (var i = 0; i < planeGeometry.parameters.width / 5; i++) {
                // const rnd = Math.random() * 0.75 + 0.25;
                const cubeMaterial = new THREE.MeshLambertMaterial();
                cubeMaterial.color = this.colorcube;
                this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      
                this.cube.position.z = -((planeGeometry.parameters.height) / 2) + 2 + (j * 5);
                this.cube.position.x = -((planeGeometry.parameters.width) / 4) + 2 + (i * 5);
                this.cube.position.y = -2;
      
                scene.add(this.cube);
            }
        }
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
        console.log(geom)
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

        console.log(geoms.length)

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

            mesh.position.x = -10 + ((i % 4) * 12);
            mesh.position.y = 4;
            mesh.position.z = -10 + (j * 12);

            if ((i + 1) % 4 == 0) j++;
            scene.add(mesh);
        }

        console.log(geoms.length)

    }

    onResize() {
        // console.log(window.innerWidth)
        // console.log(window.innerHeight)
        // console.log(window.innerWidth/window.innerHeight)
        // console.log(this.camera.aspect)
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }

    buttons() {

        this.controls = new function () {
            this.rotationSpeed = 0.02;
            this.bouncingSpeed = 0.03;

            // console.log(scene)

            this.addCube = function () {
    
                const cubeSize = Math.ceil((Math.random() * 3));
                const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
                const cubeMaterial = new THREE.MeshLambertMaterial({
                    color: Math.random() * 0xffffff
                });
                const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
                cube.castShadow = true;
                cube.name = "cube-" + scene.children.length;
    
                // position the cube randomly in the scene
                
                // x for width, y for height, z for depth
                cube.position.x = -15 + Math.round((Math.random() * planeGeometry.parameters.width));
                cube.position.y = Math.round((Math.random() * 5));
                cube.position.z = -15 + Math.round((Math.random() * planeGeometry.parameters.height));
    
                // add the cube to the scene
                scene.add(cube);
                this.numberOfObjects = scene.children.length;
                
                console.log(scene.children)
            };

            this.numberOfObjects = scene.children.length;

            this.removeCube = function () {
                const allChildren = scene.children;
                const lastObject = allChildren[allChildren.length - 1];
                // remove only meshes from scene
                if (lastObject instanceof THREE.Mesh) {
                    scene.remove(lastObject);
                    this.numberOfObjects = scene.children.length;
                }
                console.log(scene.children)
            };

            // get and manipulate mesh objects
            this.getobject = function () {
                // const object = scene.getObjectByName('cube-7')
                // alert(object.position.z)
                const allChildren = scene.children;
                const lastObject = allChildren[allChildren.length - 1];
                // remove only meshes from scene
                if (lastObject instanceof THREE.Mesh) {
                    lastObject.position.x = -30 + Math.round((Math.random() * planeGeometry.parameters.width));
                    lastObject.position.y = Math.round((Math.random() * 5));
                    lastObject.position.z = -20 + Math.round((Math.random() * planeGeometry.parameters.height));
                    console.log(lastObject.position)
                }
            }
    
            this.outputObjects = function () {
                console.log(scene.children.length);
            }
        };

        this.gui.add(this.controls, 'rotationSpeed', 0, 0.5);
        this.gui.add(this.controls, 'addCube');
        this.gui.add(this.controls, 'removeCube');
        this.gui.add(this.controls, 'outputObjects');
        this.gui.add(this.controls, 'numberOfObjects').listen();
        this.gui.add(this.controls, 'getobject');
    }

    animate() {

        this.trackballControls.update(this.clock.getDelta());
        this.stats.update();

        // rotate the cube around its axes

        // bounce the sphere up and down
        this.step += this.controls.bouncingSpeed; // speed of sphere animation
        this.sphere.position.x = 20 + (10 * (Math.cos(this.step)));
        this.sphere.position.y = 2 + (10 * Math.abs(Math.sin(this.step)));

        this.colorcube= new THREE.Color(Math.random() * 6, Math.random() * 6, Math.random() * 6); 
        // console.log(this.colorcube)
        // this.cube.color = this.colorcube
        this.addPlaneDesign()

        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render( scene, this.camera );
    }
}

console.log('works')
export { ThreejsScene }