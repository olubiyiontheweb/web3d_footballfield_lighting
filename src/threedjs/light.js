import * as THREE from 'three-r124/build/three'
import {Lensflare, LensflareElement} from 'three-r124/examples/jsm/objects/Lensflare.js'

import {scene, controls} from './main'

// import lensflare
import lensflare0 from '@/assets/textures/flares/lensflare0.png'

class initLights {
    constructor() {

        this.hemiLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
        this.hemiLight.visible = controls.pointLightStatus
        scene.add(this.hemiLight)
        
        // create a sphere to track point light
        const sphereLightGeometry = new THREE.SphereGeometry(2, 10, 10);
        const sphereLightMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x7777FF
        });
        this.sphereLight = new THREE.Mesh(sphereLightGeometry, sphereLightMaterial);    
        this.sphereLight.position.set(-50, -10, 20);
        this.sphereLight.visible = controls.pointLightStatus
        // add the sphere to the scene
        scene.add(this.sphereLight)

        this.pointLight = new THREE.PointLight(new THREE.Color(controls.pointColor))
        this.pointLight.distance = controls.PointLightDistance
        this.pointLight.visible = controls.pointLightStatus
        this.pointLight.intensity = controls.pointIntensity
        scene.add(this.pointLight);

        this.PointLightHelper = new THREE.PointLightHelper(this.pointLight);
        this.PointLightHelper.visible = controls.lightsDebug

        this.PointLightShadowHelper = new THREE.CameraHelper(this.pointLight.shadow.camera)
        this.PointLightShadowHelper.visible = controls.lightsDebug
        
        scene.add(this.PointLightHelper);
        scene.add(this.PointLightShadowHelper)

        this.dirLight = new THREE.DirectionalLight(new THREE.Color(controls.pointColor))
        this.dirLight.visible = controls.dirLightStatus
        scene.add(this.dirLight);

        this.spotlight = new THREE.SpotLight(0xffffff)
        this.spotlight2 = new THREE.SpotLight(0xffffff)
        
        this.spotlight.visible = controls.spotlightStatus;
        this.spotlight2.visible = controls.spotlightStatus;
        scene.add(this.spotlight)
        scene.add(this.spotlight2)

        this.ambientLight = new THREE.AmbientLight(new THREE.Color(controls.ambientColor))
        this.ambientLight.visible = controls.ambientLightStatus
        scene.add(this.ambientLight)

        // used to determine the switch point for the light animation
        this.invert = 1;
        this.phase = 0;

        this.sunflare = new THREE.TextureLoader().load(lensflare0)
        this.flareColor = new THREE.Color(0xffaacc);
        this.lensFlare = new Lensflare();

        this.lensFlare.addElement(new LensflareElement(this.sunflare, 350, 0.0, this.flareColor));
        //this.lensFlare.addElement(new THREE.LensflareElement(textureFlare3, 60, 0.6, flareColor));
        //this.lensFlare.addElement(new THREE.LensflareElement(textureFlare3, 70, 0.7, flareColor));
        //this.lensFlare.addElement(new THREE.LensflareElement(textureFlare3, 120, 0.9, flareColor));
        //this.lensFlare.addElement(new THREE.LensflareElement(textureFlare3, 70, 1.0, flareColor));

    }

    addAmbientLight() {
        this.ambientLight.color = new THREE.Color(controls.ambientColor)
        this.ambientLight.intensity = controls.ambientLightIntensity
        this.ambientLight.visible = controls.ambientLightStatus
    }

    addSpotLight() {
        this.spotlight.position.set( -40, 60, -10)
        this.spotlight.castShadow = true

        this.spotlight2.position.set( 40, 60, -10)
        this.spotlight2.castShadow = true
        
        this.spotlight.visible = controls.spotlightStatus;
        this.spotlight2.visible = controls.spotlightStatus;
    }

    loadLensflareAsSun() {
        if (controls.lensFlareStatus) {
            this.dirLight.add(this.lensFlare);
        }
        else {
            this.dirLight.remove(this.lensFlare);
        }
    }

    addPointLight() {

        // move the light simulation
        if (this.phase > 2 * Math.PI) {
            this.invert = this.invert * -1;
            this.phase -= 2 * Math.PI;
        } else {
            this.phase += controls.rotationSpeed;
        }

        // position the sphere
        this.sphereLight.position.z = +(25 * (Math.sin(this.phase)));
        this.sphereLight.position.x = +(14 * (Math.cos(this.phase)));
        this.sphereLight.position.y = 5;
        this.sphereLight.visible = controls.pointLightStatus

        this.PointLightHelper.visible = controls.pointLightDebug
        this.PointLightShadowHelper.visible = controls.pointLightDebug

        this.pointLight.color = new THREE.Color(controls.pointColor)
        this.pointLight.decay = 0.3
        this.pointLight.castShadow = true;
        this.pointLight.distance = controls.PointLightDistance
        this.pointLight.intensity = controls.pointIntensity
        this.pointLight.position.copy(this.sphereLight.position);
        this.pointLight.visible = controls.pointLightStatus
    }

    addHemiLight() {
        this.hemiLight.position.set(0, 500, 0);
        this.hemiLight.visible = controls.hemisphereLightStatus
    }

    addDirLight(planeBG) {
        this.dirLight.position.set(30, 10, -50);
        this.dirLight.castShadow = true;
        this.dirLight.target = planeBG;
        this.dirLight.shadow.camera.near = 0.1;
        this.dirLight.shadow.camera.far = 200;
        this.dirLight.shadow.camera.left = -50;
        this.dirLight.shadow.camera.right = 50;
        this.dirLight.shadow.camera.top = 50;
        this.dirLight.shadow.camera.bottom = -50;
        this.dirLight.shadow.mapSize.width = 2048;
        this.dirLight.shadow.mapSize.height = 2048;
        this.dirLight.visible = controls.dirLightStatus
    }

    showScene() {
        console.log(scene)
    }
}

export {initLights}