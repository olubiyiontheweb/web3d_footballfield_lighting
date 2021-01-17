<template>
<div id="renderCanvas" ref="renderCanvas">
</div>
</template>

<script>
import {instance_scene} from '../threedjs/main.js'
// import {addHouseAndTree} from '../threedjs/treeHouse.js'

export default {
  name: 'ThreedScene',
  props: {
    msg: String
  },
  metaInfo: {
    title: 'Sport Lighting',
    titleTemplate: '%s - Football Field',
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