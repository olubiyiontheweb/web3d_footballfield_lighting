import * as THREE from 'three-r124/build/three'
// import { scene } from "./main"

import grass from '@/assets/textures/grasslight-big.jpg'

class addTextures {
    constructor() {
        this.textureGrass = new THREE.TextureLoader().load(grass);
        this.textureGrass.wrapS = THREE.RepeatWrapping
        this.textureGrass.wrapT = THREE.RepeatWrapping
        this.textureGrass.repeat.set(10,10)
    }

    loadTextureOnBG() {
        return this.textureGrass
    }
}

export {addTextures}