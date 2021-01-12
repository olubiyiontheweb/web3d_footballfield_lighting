<template>
<div id="renderCanvas" ref="renderCanvas">
</div>
</template>

<script>
import {ThreejsScene} from '../threedjs/main.js'

// const canvas = document.getElementById('renderCanvas')

const instance_scene = new ThreejsScene()

export default {
  name: 'ThreedScene',
  props: {
    msg: String
  },
  metaInfo: {
    title: 'Sport',
    titleTemplate: '%Concert - Geometry World!',
    htmlAttrs: {
      lang: 'en',
      amp: true
    }
  },
  methods: {
    // alert() {
    //  alert("hello")
    // }
  },
  created: function () {    
    // const vm = this
    // console.log('It showed here: ' + vm.setcanvasscene())
  },
  mounted: function () {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered

      this.canvas = this.$refs.renderCanvas
      // this.scene = new ThreejsScene(this.canvas)

      instance_scene.createScene(this.canvas)

      instance_scene.addGeometries()

      instance_scene.buttons()

      // listen to the resize events
      window.addEventListener('resize', function(){
        instance_scene.onResize()
        // console.log(instance_scene);
      })

      instance_scene.animate()

    })
  },
  updated: function () {
      this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been re-rendered
    })
  }
}
</script>

<style scoped>
canvas { width: 100%; height: 100% }
</style>